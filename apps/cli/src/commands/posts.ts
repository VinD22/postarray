import { z } from 'zod';
import {
  RelayError,
  estimateCreateCostMinor,
  idempotencyKeySchema,
  summarizeValidation,
} from '@relay/contracts';
import type { CapabilitySnapshot, ValidationResult } from '@relay/contracts';

import { ROUTES } from '../api/routes';
import {
  canonicalPreviewSchema,
  capabilitySnapshotSchema,
  connectionViewSchema,
  contentItemViewSchema,
  paginated,
  publishJobViewSchema,
  validationResultSchema,
} from '../api/schemas';
import type { ConnectionView } from '../api/schemas';
import type { CliContext } from '../context';
import { externalPublicationCount, readDraftFile } from '../draft';
import type { DraftDocument } from '../draft';
import { describe, renderPlan, renderSuccess, renderTable } from '../output';
import type { PlannedExternalAction, RenderInput } from '../output';

/**
 * Consequential commands.
 *
 * These are the only commands in the CLI that can cause something to appear on
 * a real platform, so they carry the guarantees the approval policy depends on:
 *
 * - `schedule` and `publish` require an idempotency key. Repeating a request
 *   with the same key returns the original result instead of publishing twice.
 * - `publish` requires `--confirm`. Immediate publication needs an explicit
 *   human decision, and a flag that a person had to type is that decision.
 * - `--dry-run` reaches only read endpoints and sends nothing that could change
 *   state, not even a draft.
 *
 * The server enforces all of this again. Nothing here is the only line of
 * defence, and nothing here can be bypassed by not using the CLI.
 */

/** More than this in one request is a bulk action and needs confirmation. */
export const BULK_PUBLICATION_THRESHOLD = 5;
/** The same content to more than this many accounts is also bulk. */
export const BULK_ACCOUNT_THRESHOLD = 3;

export interface BulkAssessment {
  readonly isBulk: boolean;
  readonly publicationCount: number;
  readonly accountCount: number;
  readonly reasons: readonly ('PUBLICATION_COUNT' | 'ACCOUNT_COUNT')[];
}

/**
 * The client-side mirror of the level 3 bulk rule. It exists so `--dry-run`
 * can tell the truth about what will be gated, not so the CLI can decide.
 */
export function assessBulk(draft: DraftDocument): BulkAssessment {
  const publicationCount = externalPublicationCount(draft);
  const accountCount = draft.targets.length;
  const similarBody = draft.targets.every((target) => target.body === undefined);
  const reasons: ('PUBLICATION_COUNT' | 'ACCOUNT_COUNT')[] = [];
  if (publicationCount > BULK_PUBLICATION_THRESHOLD) {
    reasons.push('PUBLICATION_COUNT');
  }
  if (similarBody && accountCount > BULK_ACCOUNT_THRESHOLD) {
    reasons.push('ACCOUNT_COUNT');
  }
  return { isBulk: reasons.length > 0, publicationCount, accountCount, reasons };
}

function requireIdempotencyKey(value: string | undefined): string {
  if (value === undefined) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'IDEMPOTENCY_KEY_REQUIRED' },
    });
  }
  const parsed = idempotencyKeySchema.safeParse(value);
  if (!parsed.success) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'IDEMPOTENCY_KEY_MALFORMED' },
    });
  }
  return parsed.data;
}

function validationLines(result: ValidationResult): readonly string[] {
  const summary = summarizeValidation(result);
  return [
    `ok=${String(result.ok)} errors=${summary.errorCount} warnings=${summary.warningCount} info=${summary.infoCount}`,
    ...(result.estimatedCostMinor === undefined
      ? []
      : [`estimatedCostMinor=${result.estimatedCostMinor} currency=${result.currency ?? ''}`]),
    ...(result.issues.length === 0
      ? []
      : renderTable(
          ['severity', 'code', 'target', 'field', 'message'],
          result.issues.map((issue) => [
            issue.severity,
            issue.code,
            issue.targetId ?? '',
            issue.field ?? '',
            describe(issue.messageKey, issue.params),
          ]),
        )),
  ];
}

/** Turn a draft file into a content item. Reversible: nothing is published. */
async function createDraft(
  context: CliContext,
  draft: DraftDocument,
  idempotencyKey: string,
  projectId: string | undefined,
): Promise<string> {
  const resolvedProjectId = projectId ?? draft.projectId;
  if (resolvedProjectId === undefined) {
    // A draft always belongs to a project. Guessing one would put content under
    // the wrong voice, claims and disclosure defaults.
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'PROJECT_ID_REQUIRED' },
    });
  }

  const created = await context.api().request({
    method: 'POST',
    path: ROUTES.content(),
    schema: contentItemViewSchema,
    idempotencyKey,
    body: {
      projectId: resolvedProjectId,
      campaignId: draft.campaignId ?? null,
      title: draft.title ?? null,
      body: draft.body,
      contentKind: draft.contentKind,
      locale: draft.locale,
      mediaIds: draft.mediaIds,
      links: draft.links.map((link) => ({
        originalUrl: link.originalUrl,
        tracked: link.tracked,
        shortLinkId: null,
        publishedUrl: null,
        utm: null,
        frozenAt: null,
      })),
      threadItems: draft.threadItems,
      disclosure: draft.disclosure,
      targets: draft.targets.map((target) => ({
        connectionId: target.connectionId,
        destinationId: target.destinationId ?? null,
        privacyValue: target.privacyValue ?? null,
      })),
    },
  });

  /**
   * Per-target copy is applied as an explicit variant override after the draft
   * exists, because that is what an override is in the content model: a claimed
   * field on one target, visible as such, that never leaks into another target.
   */
  const byConnection = new Map(
    created.data.variants.map((variant) => [variant.connectionId, variant.id] as const),
  );
  for (const target of draft.targets) {
    if (target.body === undefined) {
      continue;
    }
    const variantId = byConnection.get(target.connectionId);
    if (variantId === undefined) {
      throw new RelayError('NOT_FOUND', {
        messageKey: 'error.not_found.message',
        details: { reason: 'TARGET_VARIANT_NOT_CREATED', connectionId: target.connectionId },
      });
    }
    await context.api().request({
      method: 'PATCH',
      path: ROUTES.contentVariant(created.data.id, variantId),
      schema: z.unknown(),
      body: {
        body: target.body,
        ...(target.mediaIds === undefined ? {} : { mediaIds: target.mediaIds }),
      },
    });
  }

  return created.data.id;
}

export interface ValidateOptions {
  readonly file?: string | undefined;
  readonly contentItemId?: string | undefined;
  readonly idempotencyKey?: string | undefined;
  readonly projectId?: string | undefined;
}

/**
 * Validate a draft.
 *
 * With `--content-item` this is purely read only. With a file it first creates
 * the draft, because validation runs against the real content model and its
 * resolved variants, not against a document the server has never seen. Creating
 * a draft is reversible and publishes nothing, and the new id is printed.
 */
export async function postsValidate(
  context: CliContext,
  render: RenderInput,
  options: ValidateOptions,
): Promise<void> {
  if ((options.file === undefined) === (options.contentItemId === undefined)) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'PROVIDE_EITHER_FILE_OR_CONTENT_ITEM' },
    });
  }

  let contentItemId = options.contentItemId;
  if (options.file !== undefined) {
    const draft = await readDraftFile(options.file);
    contentItemId = await createDraft(
      context,
      draft,
      requireIdempotencyKey(options.idempotencyKey),
      options.projectId,
    );
  }

  const response = await context.api().request({
    method: 'POST',
    path: ROUTES.validate(contentItemId ?? ''),
    schema: validationResultSchema,
  });

  renderSuccess(
    { ...render, correlationId: response.correlationId },
    { contentItemId, validation: response.data },
    [`contentItemId=${contentItemId ?? ''}`, ...validationLines(response.data)],
  );

  if (!response.data.ok) {
    // A draft that will not publish is a failure of the command, not a report.
    throw new RelayError('CONTENT_INVALID', {
      messageKey: 'error.content_invalid.message',
      correlationId: response.correlationId,
      details: { issueCount: response.data.issues.length },
    });
  }
}

export async function postsPreview(
  context: CliContext,
  render: RenderInput,
  options: { readonly contentItemId: string; readonly targetId: string },
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.preview(options.contentItemId),
    schema: canonicalPreviewSchema,
    query: { targetId: options.targetId },
  });
  const preview = response.data;

  renderSuccess({ ...render, correlationId: response.correlationId }, preview, [
    ...renderTable(
      ['field', 'value'],
      [
        ['contentItemId', preview.contentItemId],
        ['targetId', preview.targetId],
        ['provider', preview.provider],
        ['account', preview.handle ?? preview.displayName],
        ['contentKind', preview.contentKind],
        ['characters', `${preview.characterCount}/${preview.characterLimit ?? 'unlimited'}`],
        ['truncated', String(preview.truncated)],
        ['media', String(preview.media.length)],
        ['threadItems', String(preview.threadItems.length)],
      ],
    ),
    '',
    preview.body,
  ]);
}

interface TargetContext {
  readonly connection: ConnectionView | undefined;
  readonly capabilities: CapabilitySnapshot | undefined;
}

async function loadTargetContext(
  context: CliContext,
  draft: DraftDocument,
): Promise<Map<string, TargetContext>> {
  const connections = await context.api().request({
    method: 'GET',
    path: ROUTES.connections(),
    schema: paginated(connectionViewSchema),
    query: { limit: 100 },
  });
  const wanted = new Set(draft.targets.map((target) => target.connectionId));
  const byId = new Map<string, TargetContext>();

  for (const connection of connections.data.data) {
    if (!wanted.has(connection.id)) {
      continue;
    }
    let capabilities: CapabilitySnapshot | undefined;
    try {
      const snapshot = await context.api().request({
        method: 'GET',
        path: ROUTES.connectionCapabilities(connection.id),
        schema: capabilitySnapshotSchema,
      });
      capabilities = snapshot.data;
    } catch {
      // A missing snapshot means the cost is unknown, which is printed as
      // unknown. It is never printed as zero.
      capabilities = undefined;
    }
    byId.set(connection.id, { connection, capabilities });
  }
  return byId;
}

/**
 * Build the dry-run plan.
 *
 * Every row is one thing that would exist on a platform afterwards: the root
 * post per target plus each thread item or first comment. Nothing is summarized
 * away, because "6 actions" and "6 posts on 6 accounts" are different sentences
 * and only one of them is useful before you press the button.
 *
 * It reaches only read endpoints, so a dry run creates nothing at all.
 */
export async function buildPlan(
  context: CliContext,
  draft: DraftDocument,
  action: 'schedule_post' | 'create_post',
): Promise<readonly PlannedExternalAction[]> {
  const targets = await loadTargetContext(context, draft);
  const bulk = assessBulk(draft);
  const containsUrl = draft.links.length > 0 || /https?:\/\//i.test(draft.body);

  const planned: PlannedExternalAction[] = [];
  for (const target of draft.targets) {
    const entry = targets.get(target.connectionId);
    const capabilities = entry?.capabilities;
    const cost =
      capabilities === undefined ? null : estimateCreateCostMinor(capabilities, containsUrl);
    const label =
      entry?.connection?.handle ?? entry?.connection?.displayName ?? target.connectionId;

    planned.push({
      action,
      provider: entry?.connection?.provider ?? 'unknown',
      connectionId: target.connectionId,
      accountLabel: label,
      whenInstant: draft.schedule?.instant ?? null,
      ianaTimeZone: draft.schedule?.ianaTimeZone ?? null,
      requiresApproval: true,
      requiresHumanConfirmation: action === 'create_post' || bulk.isBulk,
      estimatedCostMinor: cost,
      currency: capabilities?.cost?.currency ?? null,
    });

    for (const item of draft.threadItems) {
      planned.push({
        action: 'create_comment',
        provider: entry?.connection?.provider ?? 'unknown',
        connectionId: target.connectionId,
        accountLabel: `${label} (+${item.delaySeconds}s)`,
        whenInstant: null,
        ianaTimeZone: null,
        requiresApproval: true,
        requiresHumanConfirmation: false,
        estimatedCostMinor: null,
        currency: null,
      });
    }
  }
  return planned;
}

export interface ScheduleOptions {
  readonly idempotencyKey?: string | undefined;
  readonly projectId?: string | undefined;
}

export async function postsSchedule(
  context: CliContext,
  render: RenderInput,
  filePath: string,
  options: ScheduleOptions,
): Promise<void> {
  const draft = await readDraftFile(filePath);
  if (draft.schedule === undefined) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'SCHEDULE_REQUIRED' },
    });
  }

  if (context.options.dryRun) {
    const plan = await buildPlan(context, draft, 'schedule_post');
    renderSuccess(
      { ...render, plannedExternalActions: plan },
      { dryRun: true, plannedExternalActions: plan },
      renderPlan(plan),
    );
    return;
  }

  const idempotencyKey = requireIdempotencyKey(options.idempotencyKey);
  const contentItemId = await createDraft(
    context,
    draft,
    `${idempotencyKey}.draft`,
    options.projectId,
  );

  const validation = await context.api().request({
    method: 'POST',
    path: ROUTES.validate(contentItemId),
    schema: validationResultSchema,
  });
  if (!validation.data.ok) {
    throw new RelayError('CONTENT_INVALID', {
      messageKey: 'error.content_invalid.message',
      correlationId: validation.correlationId,
      details: { contentItemId, issueCount: validation.data.issues.length },
    });
  }

  const scheduled = await context.api().request({
    method: 'POST',
    path: ROUTES.schedules(),
    schema: publishJobViewSchema,
    idempotencyKey,
    body: {
      contentItemId,
      scheduleSpec: {
        instant: draft.schedule.instant,
        ianaTimeZone: draft.schedule.ianaTimeZone,
        repeat: null,
      },
    },
  });

  renderSuccess(
    { ...render, correlationId: scheduled.correlationId },
    { contentItemId, validation: validation.data, job: scheduled.data },
    [
      `contentItemId=${contentItemId}`,
      ...validationLines(validation.data),
      ...renderTable(
        ['jobId', 'provider', 'state', 'scheduledInstant', 'zone', 'approvalState'],
        [
          [
            scheduled.data.id,
            scheduled.data.provider,
            scheduled.data.state,
            scheduled.data.scheduledInstant,
            scheduled.data.ianaTimeZone,
            scheduled.data.approvalState,
          ],
        ],
      ),
    ],
  );
}

export interface PublishOptions {
  readonly contentItemId?: string | undefined;
  readonly file?: string | undefined;
  readonly idempotencyKey?: string | undefined;
  readonly projectId?: string | undefined;
  readonly confirm: boolean;
}

export async function postsPublish(
  context: CliContext,
  render: RenderInput,
  options: PublishOptions,
): Promise<void> {
  if ((options.contentItemId === undefined) === (options.file === undefined)) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'PROVIDE_EITHER_CONTENT_ITEM_OR_FILE' },
    });
  }

  if (context.options.dryRun) {
    if (options.file !== undefined) {
      const draft = await readDraftFile(options.file);
      const plan = await buildPlan(context, draft, 'create_post');
      renderSuccess(
        { ...render, plannedExternalActions: plan },
        { dryRun: true, plannedExternalActions: plan },
        renderPlan(plan),
      );
      return;
    }
    const validation = await context.api().request({
      method: 'POST',
      path: ROUTES.validate(options.contentItemId ?? ''),
      schema: validationResultSchema,
    });
    renderSuccess(
      { ...render, correlationId: validation.correlationId },
      { dryRun: true, validation: validation.data },
      [...validationLines(validation.data), 'plan=serverSide'],
    );
    return;
  }

  /**
   * Immediate publication needs an explicit human decision. `--confirm` is that
   * decision, typed by a person, on this machine. The server asks for its own
   * confirmation as well, and neither substitutes for the other.
   */
  if (!options.confirm) {
    const count =
      options.file === undefined ? 1 : externalPublicationCount(await readDraftFile(options.file));
    throw new RelayError('APPROVAL_REQUIRED', {
      messageKey: 'confirm.publishNow.body',
      details: { reason: 'CONFIRMATION_REQUIRED', flag: '--confirm', publications: count },
    });
  }

  const idempotencyKey = requireIdempotencyKey(options.idempotencyKey);

  let contentItemId = options.contentItemId;
  if (options.file !== undefined) {
    const draft = await readDraftFile(options.file);
    contentItemId = await createDraft(context, draft, `${idempotencyKey}.draft`, options.projectId);
  }

  const item = await context.api().request({
    method: 'GET',
    path: ROUTES.contentItem(contentItemId ?? ''),
    schema: contentItemViewSchema,
  });
  if (item.data.currentChecksum === null) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'CONTENT_VERSION_NOT_FROZEN', contentItemId },
    });
  }

  const published = await context.api().request({
    method: 'POST',
    path: ROUTES.publications(),
    schema: publishJobViewSchema,
    idempotencyKey,
    body: {
      contentItemId,
      confirmation: {
        acknowledgedTargetCount: item.data.variants.length,
        acknowledgedVersionChecksum: item.data.currentChecksum,
        acknowledgedEscalations: ['immediate_publish'],
      },
    },
  });

  renderSuccess(
    { ...render, correlationId: published.correlationId },
    { contentItemId, job: published.data },
    [
      `contentItemId=${contentItemId ?? ''}`,
      ...renderTable(
        ['jobId', 'provider', 'state', 'connectionId'],
        [
          [
            published.data.id,
            published.data.provider,
            published.data.state,
            published.data.connectionId,
          ],
        ],
      ),
    ],
  );
}

export async function postsCancel(
  context: CliContext,
  render: RenderInput,
  jobId: string,
  options: { readonly reason?: string | undefined; readonly idempotencyKey?: string | undefined },
): Promise<void> {
  if (context.options.dryRun) {
    const job = await context.api().request({
      method: 'GET',
      path: ROUTES.job(jobId),
      schema: publishJobViewSchema,
    });
    const plan: readonly PlannedExternalAction[] = [
      {
        action: 'cancel_post',
        provider: job.data.provider,
        connectionId: job.data.connectionId,
        accountLabel: job.data.connectionId,
        whenInstant: job.data.scheduledInstant,
        ianaTimeZone: job.data.ianaTimeZone,
        requiresApproval: false,
        requiresHumanConfirmation: job.data.state === 'dispatching',
        estimatedCostMinor: null,
        currency: null,
      },
    ];
    renderSuccess(
      { ...render, correlationId: job.correlationId, plannedExternalActions: plan },
      { dryRun: true, job: job.data, plannedExternalActions: plan },
      renderPlan(plan),
    );
    return;
  }

  const idempotencyKey = requireIdempotencyKey(options.idempotencyKey);
  const response = await context.api().request({
    method: 'POST',
    path: ROUTES.cancelSchedule(jobId),
    schema: publishJobViewSchema,
    idempotencyKey,
    body: { reason: options.reason ?? 'canceled_from_cli' },
  });

  renderSuccess({ ...render, correlationId: response.correlationId }, response.data, [
    `jobId=${response.data.id}`,
    `state=${response.data.state}`,
  ]);
}
