import { z } from 'zod';
import { RelayError, growthExportFormatSchema } from '@relay/contracts';
import type { GrowthExportFormat } from '@relay/contracts';

import { ROUTES } from '../api/routes';
import {
  automationRuleViewSchema,
  calendarEntrySchema,
  capabilitySnapshotSchema,
  connectionViewSchema,
  contentItemViewSchema,
  growthPlanSchema,
  metricObservationViewSchema,
  paginated,
  publicationReceiptSchema,
  publishJobViewSchema,
  ruleRunViewSchema,
  wrapped,
} from '../api/schemas';
import type { MetricObservationView } from '../api/schemas';
import type { CliContext } from '../context';
import { renderSuccess, renderTable } from '../output';
import type { RenderInput } from '../output';

/**
 * Read commands.
 *
 * Every one of them is safe to run: nothing here creates, schedules, publishes
 * or cancels anything. That is why none of them takes an idempotency key and
 * why none of them has a `--dry-run`: there is nothing to preview.
 */

export interface PageOptions {
  readonly cursor?: string | undefined;
  readonly limit?: number | undefined;
}

function pageQuery(options: PageOptions): Record<string, string | number | undefined> {
  return { cursor: options.cursor, limit: options.limit };
}

export async function accountsList(
  context: CliContext,
  render: RenderInput,
  options: PageOptions & {
    readonly provider?: string | undefined;
    readonly brandId?: string | undefined;
  },
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.connections(),
    schema: paginated(connectionViewSchema),
    query: { ...pageQuery(options), provider: options.provider, brandId: options.brandId },
  });

  renderSuccess({ ...render, correlationId: response.correlationId }, response.data, [
    ...renderTable(
      ['id', 'provider', 'accountType', 'handle', 'health', 'statusMessageKey'],
      response.data.data.map((connection) => [
        connection.id,
        connection.provider,
        connection.accountType,
        connection.handle ?? connection.displayName,
        connection.health,
        connection.statusMessageKey ?? '',
      ]),
    ),
    `nextCursor=${response.data.pageInfo.nextCursor ?? ''}`,
  ]);
}

export async function accountsCapabilities(
  context: CliContext,
  render: RenderInput,
  connectionId: string,
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.connectionCapabilities(connectionId),
    schema: capabilitySnapshotSchema,
  });
  const snapshot = response.data;

  /**
   * `unsupported` and `not_implemented` are different facts and are never
   * merged. One is a platform limit, the other is work we have not done.
   */
  const contentKindRows = Object.entries(snapshot.contentKinds).map(([kind, support]) => [
    kind,
    String(support),
  ]);

  renderSuccess({ ...render, correlationId: response.correlationId }, snapshot, [
    ...renderTable(
      ['field', 'value'],
      [
        ['connectionId', snapshot.connectionId],
        ['provider', snapshot.provider],
        ['accountType', snapshot.accountType],
        ['capabilityVersion', snapshot.capabilityVersion],
        ['observedAt', snapshot.observedAt],
        ['maxTextLength', String(snapshot.text.maxLength)],
        ['maxImages', String(snapshot.media.maxImages)],
        ['maxVideos', String(snapshot.media.maxVideos)],
        ['altText', snapshot.media.altText],
        ['mentions', snapshot.mentions.support],
        ['firstComment', snapshot.firstComment.support],
        ['threads', snapshot.threads.support],
        ['providerScheduling', snapshot.scheduling.providerNative],
        ['privacyMustBeExplicit', String(snapshot.privacy.mustBeExplicit)],
        ['analytics', snapshot.analytics.support],
        ['deletion', snapshot.deletion.support],
        [
          'costPerCreateMinor',
          snapshot.cost === null ? 'unavailable' : String(snapshot.cost.perCreateMinor),
        ],
        [
          'costPerUrlCreateMinor',
          snapshot.cost === null ? 'unavailable' : String(snapshot.cost.perUrlCreateMinor),
        ],
      ],
    ),
    '',
    ...renderTable(['contentKind', 'support'], contentKindRows),
  ]);
}

export async function postsList(
  context: CliContext,
  render: RenderInput,
  options: PageOptions & {
    readonly state?: string | undefined;
    readonly brandId?: string | undefined;
  },
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.content(),
    schema: paginated(contentItemViewSchema),
    query: { ...pageQuery(options), state: options.state, brandId: options.brandId },
  });

  renderSuccess({ ...render, correlationId: response.correlationId }, response.data, [
    ...renderTable(
      ['id', 'state', 'approval', 'kind', 'locale', 'targets', 'title'],
      response.data.data.map((item) => [
        item.id,
        item.state,
        item.approvalState,
        item.contentKind,
        item.locale,
        String(item.variants.length),
        item.title ?? '',
      ]),
    ),
    `nextCursor=${response.data.pageInfo.nextCursor ?? ''}`,
  ]);
}

export async function postsStatus(
  context: CliContext,
  render: RenderInput,
  jobId: string,
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.job(jobId),
    schema: publishJobViewSchema,
  });
  const job = response.data;

  renderSuccess({ ...render, correlationId: response.correlationId }, job, [
    ...renderTable(
      ['field', 'value'],
      [
        ['jobId', job.id],
        ['state', job.state],
        ['provider', job.provider],
        ['connectionId', job.connectionId],
        ['contentItemId', job.contentItemId],
        ['contentVersionId', job.contentVersionId],
        ['scheduledInstant', job.scheduledInstant],
        ['timeZone', job.ianaTimeZone],
        ['approvalRequired', String(job.approvalRequired)],
        ['approvalState', job.approvalState],
        ['attemptCount', String(job.attemptCount)],
        ['lastErrorCode', job.lastErrorCode ?? ''],
        ['canceledAt', job.canceledAt ?? ''],
      ],
    ),
  ]);
}

export async function calendarList(
  context: CliContext,
  render: RenderInput,
  options: PageOptions & {
    readonly from: string;
    readonly to: string;
    readonly brandId?: string | undefined;
  },
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.calendar(),
    schema: paginated(calendarEntrySchema),
    query: { ...pageQuery(options), from: options.from, to: options.to, brandId: options.brandId },
  });

  renderSuccess({ ...render, correlationId: response.correlationId }, response.data, [
    ...renderTable(
      ['instant', 'zone', 'provider', 'connectionId', 'state', 'approval', 'jobId', 'title'],
      response.data.data.map((entry) => [
        entry.instant,
        entry.ianaTimeZone,
        entry.provider ?? '',
        entry.connectionId ?? '',
        entry.state,
        String(entry.approvalRequired),
        entry.jobId ?? '',
        entry.title ?? '',
      ]),
    ),
    `nextCursor=${response.data.pageInfo.nextCursor ?? ''}`,
  ]);
}

export async function receiptsGet(
  context: CliContext,
  render: RenderInput,
  receiptId: string,
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.receipt(receiptId),
    schema: publicationReceiptSchema,
  });
  const receipt = response.data;

  renderSuccess({ ...render, correlationId: response.correlationId }, receipt, [
    ...renderTable(
      ['field', 'value'],
      [
        ['receiptId', receipt.id],
        ['provider', receipt.provider],
        ['accountType', receipt.accountType],
        ['externalPostId', receipt.externalPostId],
        ['permalink', receipt.permalink ?? 'unavailable'],
        ['publishedAt', receipt.publishedAt],
        ['scheduledLocalTime', receipt.scheduledLocalTime],
        ['timeZone', receipt.ianaTimeZone],
        ['creationSurface', receipt.creationSurface],
        ['contentVersionChecksum', receipt.contentVersionChecksum],
        ['capabilityVersion', receipt.capabilityVersion],
        ['approvalState', receipt.approval.state],
        ['attempts', String(receipt.attempts.length)],
      ],
    ),
    '',
    ...renderTable(
      ['item', 'order', 'state', 'externalPostId', 'permalink'],
      [receipt.root, ...receipt.items].map((item) => [
        item.kind,
        String(item.order),
        item.state,
        item.externalPostId ?? '',
        item.permalink ?? '',
      ]),
    ),
  ]);
}

/**
 * A metric that is not available is printed as its reason, never as `0`.
 * Reporting an unread metric as zero is how a person concludes a post failed
 * when it did not. The provider's own definition travels with the number.
 */
function metricRows(
  observations: readonly MetricObservationView[],
): readonly (readonly string[])[] {
  return observations.map((observation) => [
    observation.normalizedName,
    observation.availability === 'available' && observation.value !== null
      ? String(observation.value)
      : observation.availability,
    observation.unit,
    observation.providerField,
    String(observation.freshnessSeconds),
    observation.derivationRestricted ? 'restricted' : '',
  ]);
}

const METRIC_HEADERS = [
  'metric',
  'value',
  'unit',
  'providerField',
  'freshnessSeconds',
  'derivation',
];

export async function analyticsPost(
  context: CliContext,
  render: RenderInput,
  receiptId: string,
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.postMetrics(receiptId),
    schema: wrapped(metricObservationViewSchema),
  });
  renderSuccess(
    { ...render, correlationId: response.correlationId },
    response.data,
    renderTable(METRIC_HEADERS, metricRows(response.data.data)),
  );
}

export async function analyticsAccount(
  context: CliContext,
  render: RenderInput,
  connectionId: string,
  options: { readonly from?: string | undefined; readonly to?: string | undefined },
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.accountMetrics(),
    schema: wrapped(metricObservationViewSchema),
    query: { connectionId, from: options.from, to: options.to },
  });
  renderSuccess(
    { ...render, correlationId: response.correlationId },
    response.data,
    renderTable(METRIC_HEADERS, metricRows(response.data.data)),
  );
}

export async function growthPlanGet(
  context: CliContext,
  render: RenderInput,
  planId: string,
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.growthPlan(planId),
    schema: growthPlanSchema,
  });
  const plan = response.data;

  renderSuccess({ ...render, correlationId: response.correlationId }, plan, [
    ...renderTable(
      ['field', 'value'],
      [
        ['planId', plan.id],
        ['revision', String(plan.revision)],
        ['state', plan.state],
        ['generatedAt', plan.generatedAt],
        ['model', plan.model],
        ['promptVersion', plan.promptVersion],
        // Facts are user-confirmed. Assumptions are not, and the two are never
        // presented as the same kind of statement.
        ['facts', String(plan.business_snapshot.facts.length)],
        ['assumptions', String(plan.business_snapshot.assumptions.length)],
        ['pillars', String(plan.content_system.pillars.length)],
        ['opportunities', String(plan.opportunities.length)],
        ['tools', String(plan.tool_recommendations.length)],
        ['calendarWeeks', String(plan.calendar_proposal.length)],
        ['unsupportedClaims', String(plan.risks_and_unknowns.unsupportedClaims.length)],
      ],
    ),
  ]);
}

export async function growthPlanExport(
  context: CliContext,
  render: RenderInput,
  planId: string,
  format: string,
): Promise<void> {
  const parsed = growthExportFormatSchema.safeParse(format);
  if (!parsed.success) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'UNSUPPORTED_EXPORT_FORMAT', format },
    });
  }
  const exportFormat: GrowthExportFormat = parsed.data;

  /**
   * The export endpoint returns the document itself, not an envelope. The
   * client parses whatever came back into a string so the CLI can print it
   * verbatim and a shell can redirect it into a file.
   */
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.growthPlanExport(planId),
    schema: growthPlanExportSchema(exportFormat),
    query: { format: exportFormat },
  });

  renderSuccess({ ...render, correlationId: response.correlationId }, response.data, [
    response.data.body,
  ]);
}

/** JSON and YAML come back as documents; Markdown comes back as text. */
function growthPlanExportSchema(format: GrowthExportFormat) {
  return z.unknown().transform((value) => ({
    format,
    body: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
  }));
}

export async function rulesList(
  context: CliContext,
  render: RenderInput,
  options: PageOptions,
): Promise<void> {
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.automationRules(),
    schema: paginated(automationRuleViewSchema),
    query: pageQuery(options),
  });

  renderSuccess({ ...render, correlationId: response.correlationId }, response.data, [
    ...renderTable(
      ['id', 'state', 'trigger', 'actions', 'preauthorizedAccounts', 'approval', 'name'],
      response.data.data.map((rule) => [
        rule.id,
        rule.state,
        rule.trigger.kind,
        rule.actions.map((action) => action.kind).join(','),
        String(rule.preauthorizedConnectionIds.length),
        String(rule.requiresApproval),
        rule.name,
      ]),
    ),
    `nextCursor=${response.data.pageInfo.nextCursor ?? ''}`,
  ]);
}

/**
 * A test run never touches a platform. The server refuses to perform an
 * external action for a run flagged as a test, which is why this command has no
 * confirmation and no idempotency key.
 */
export async function rulesTest(
  context: CliContext,
  render: RenderInput,
  ruleId: string,
): Promise<void> {
  const response = await context.api().request({
    method: 'POST',
    path: ROUTES.automationRuleTestRun(ruleId),
    schema: ruleRunViewSchema,
    body: { sampleEvent: null },
  });
  const run = response.data;

  renderSuccess({ ...render, correlationId: response.correlationId }, run, [
    ...renderTable(
      ['field', 'value'],
      [
        ['runId', run.id],
        ['ruleId', run.ruleId],
        ['state', run.state],
        ['isTest', String(run.isTest)],
        ['sourceKind', run.sourceKind],
        ['blockedReasonKey', run.blockedReasonKey ?? ''],
        ['errorCode', run.errorCode ?? ''],
      ],
    ),
    '',
    ...renderTable(
      ['action', 'outcome'],
      run.performedActions.map((action) => [action.kind, action.outcome]),
    ),
  ]);
}
