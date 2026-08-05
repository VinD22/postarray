import { evaluateAgentAction, type AgentActionKind, type AgentTarget } from '@relay/authz';
import {
  ApprovalRequiredError,
  EntitlementRequiredError,
  PolicyBlockedError,
  hasErrors,
  type ScheduleSpec,
  type ValidationResult,
} from '@relay/contracts';

import type { ActorContext, ServiceDeps } from '../types.js';
import type { PublishJobView } from '../views.js';

import { recordAudit } from './audit.js';
import { containsUrl, linkHosts, loadCapabilitiesFor } from './capabilities.js';
import { loadAggregate, type ContentAggregate } from './content-store.js';
import { invalid } from './errors.js';
import { publishJobIdempotencyKey } from './idempotency.js';
import { toLocalDateTime, toProviderId, toStoredSurface } from './mappers.js';
import type { ActorSnapshot, Db } from './runtime.js';
import { toApprovalPolicy } from './storage-enums.js';
import { resolveTarget } from './stored-content.js';

/**
 * The one path to an external publication.
 *
 * `scheduling.schedule` and `publishing.publishNow` differ only in the instant
 * they aim at and the confirmation they require. Everything else, validation,
 * entitlement, approval policy, freezing the version, minting a deterministic
 * idempotency key and handing the job to the durable scheduler, happens here so
 * the two cannot drift apart.
 */

export interface PublishPathInput {
  readonly contentItemId: string;
  readonly scheduleSpec: ScheduleSpec;
  readonly kind: Extract<AgentActionKind, 'schedule' | 'publish_now'>;
  readonly confirmation: boolean;
  readonly validate: () => Promise<ValidationResult>;
}

export interface PublishPathResult {
  readonly jobs: readonly PublishJobView[];
  readonly checksum: string;
}

export function jobToView(row: {
  id: string;
  workspaceId: string;
  contentItemId: string;
  contentVersionId: string;
  postVariantId: string | null;
  connectionId: string;
  state: string;
  scheduledFor: Date;
  scheduledTimeZone: string;
  idempotencyKey: string;
  temporalWorkflowId: string | null;
  approvalPolicy: string;
  attemptCount: number;
  lastErrorCode: string | null;
  surface: string;
  createdAt: Date;
  updatedAt: Date;
  canceledAt: Date | null;
  connection: { provider: string };
  approvalRequest: { state: string } | null;
}): PublishJobView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    contentItemId: row.contentItemId,
    contentVersionId: row.contentVersionId,
    postVariantId: row.postVariantId,
    connectionId: row.connectionId,
    provider: toProviderId(row.connection.provider),
    state: publishStateOf(row.state),
    scheduledInstant: row.scheduledFor.toISOString(),
    ianaTimeZone: row.scheduledTimeZone,
    idempotencyKey: row.idempotencyKey,
    workflowId: row.temporalWorkflowId,
    approvalRequired: row.approvalPolicy !== 'none',
    approvalState:
      row.approvalRequest === null
        ? row.approvalPolicy === 'none'
          ? 'not_required'
          : 'requested'
        : row.approvalRequest.state === 'approved'
          ? 'approved'
          : row.approvalRequest.state === 'pending'
            ? 'requested'
            : 'rejected',
    attemptCount: row.attemptCount,
    lastErrorCode: row.lastErrorCode,
    createdVia: row.surface === 'import' ? 'api' : publishSurfaceOf(row.surface),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    canceledAt: row.canceledAt?.toISOString() ?? null,
  };
}

const PUBLISH_STATES = new Set([
  'draft',
  'validation_needed',
  'approval_requested',
  'approved',
  'scheduled',
  'preparing_media',
  'dispatching',
  'provider_processing',
  'published',
  'partially_published',
  'action_required',
  'retry_scheduled',
  'failed_permanently',
  'canceled',
  'deleted_externally',
]);

function publishStateOf(value: string): PublishJobView['state'] {
  return PUBLISH_STATES.has(value) ? (value as PublishJobView['state']) : 'action_required';
}

function publishSurfaceOf(value: string): PublishJobView['createdVia'] {
  switch (value) {
    case 'web':
    case 'api':
    case 'mcp':
    case 'cli':
    case 'rss':
    case 'automation_rule':
      return value;
    default:
      return 'api';
  }
}

export const PUBLISH_JOB_SELECT = {
  id: true,
  workspaceId: true,
  contentItemId: true,
  contentVersionId: true,
  postVariantId: true,
  connectionId: true,
  state: true,
  scheduledFor: true,
  scheduledTimeZone: true,
  idempotencyKey: true,
  temporalWorkflowId: true,
  approvalPolicy: true,
  attemptCount: true,
  lastErrorCode: true,
  surface: true,
  createdAt: true,
  updatedAt: true,
  canceledAt: true,
  connection: { select: { provider: true } },
  approvalRequest: { select: { state: true } },
} as const;

/**
 * Approval policy. The workspace's own policy is checked first, then the
 * autonomy ladder. Both must be satisfied; neither substitutes for the other.
 */
function assertApproved(aggregate: ContentAggregate): void {
  if (aggregate.approvalPolicy === 'none') {
    return;
  }
  if (aggregate.approvedVersionId === null) {
    throw new ApprovalRequiredError({
      messageKey: 'errors.approval_required',
      details: { contentItemId: aggregate.itemId },
    });
  }
  if (aggregate.approvedChecksum !== aggregate.checksum) {
    throw new ApprovalRequiredError({
      messageKey: 'errors.content_changed_after_approval',
      details: {
        contentItemId: aggregate.itemId,
        approvedChecksum: aggregate.approvedChecksum,
        currentChecksum: aggregate.checksum,
      },
    });
  }
}

export async function runPublishPath(
  db: Db,
  deps: ServiceDeps,
  ctx: ActorContext,
  actor: ActorSnapshot,
  input: PublishPathInput,
): Promise<PublishPathResult> {
  const aggregate = await loadAggregate(db, input.contentItemId);

  if (aggregate.variants.length === 0) {
    throw invalid('errors.no_targets_selected', { contentItemId: aggregate.itemId });
  }

  // 1. Deterministic preflight. A content error stops the request here rather
  //    than at the provider.
  const validation = await input.validate();
  if (hasErrors(validation.issues)) {
    throw invalid('errors.content_invalid', {
      issueCodes: validation.issues
        .filter((issue) => issue.severity === 'error')
        .map((issue) => issue.code),
    });
  }

  // 2. Entitlement. Publishing beyond the plan is refused before anything is
  //    frozen, so the user is not left with a version they cannot send.
  const entitlement = await deps.billing.checkEntitlement({
    workspaceId: ctx.workspaceId,
    key: 'publications.monthly',
    requested: aggregate.variants.length,
  });
  if (!entitlement.allowed) {
    throw new EntitlementRequiredError({
      messageKey: entitlement.reasonKey ?? 'errors.entitlement_missing',
      details: { limit: entitlement.limit, used: entitlement.used },
    });
  }

  // 3. Workspace approval policy.
  assertApproved(aggregate);

  // 4. The autonomy ladder, identical on every surface.
  const capabilities = await loadCapabilitiesFor(
    db,
    deps,
    aggregate.variants.map((variant) => variant.connectionId),
  );

  const now = deps.clock.now();
  const agentTargets: AgentTarget[] = aggregate.variants.map((variant) => {
    const resolved = resolveTarget(aggregate.master, variant.settings.overrides);
    const schedule = resolved.values.schedule ?? input.scheduleSpec;
    return {
      connectionId: variant.connectionId,
      provider: toProviderId(variant.provider),
      brandId: aggregate.brandId,
      locale: resolved.values.locale,
      body: resolved.values.body,
      scheduledInstant: schedule.instant,
      external: true,
      privacyChanged: variant.settings.privacyValue !== null,
      linkHosts: linkHosts(resolved.values.body),
    };
  });

  const publishedToday = await db.publicationReceipt.count({
    where: { publishedAt: { gte: startOfUtcDay(now) } },
  });

  const firstUse: string[] = [];
  for (const variant of aggregate.variants) {
    const seen = await db.publicationReceipt.count({
      where: { connectionId: variant.connectionId },
    });
    if (seen === 0) {
      firstUse.push(variant.connectionId);
    }
  }

  const decision = evaluateAgentAction({
    kind: input.kind,
    approvalLevel: actor.policyActor.approvalLevel,
    restrictions: actor.restrictions,
    targets: agentTargets,
    firstUseConnectionIds: firstUse,
    publishedTodayCount: publishedToday,
    now,
    ...(validation.estimatedCostMinor === undefined
      ? {}
      : { estimatedCostMinor: validation.estimatedCostMinor }),
    ...(validation.currency === undefined ? {} : { costCurrency: validation.currency }),
    humanConfirmed: input.confirmation || ctx.humanConfirmed === true,
  });

  if (!decision.allowed) {
    throw new PolicyBlockedError({
      messageKey: decision.blockers[0]?.messageKey ?? 'errors.policy_blocked',
      details: {
        blockers: decision.blockers.map((blocker) => blocker.code),
        externalPublicationCount: decision.externalPublicationCount,
      },
    });
  }
  if (decision.requiresHumanConfirmation) {
    throw new ApprovalRequiredError({
      messageKey: 'errors.human_confirmation_required',
      details: {
        escalations: decision.escalations.map((escalation) => escalation.code),
        externalPublicationCount: decision.externalPublicationCount,
        similarAccountCount: decision.similarAccountCount,
      },
    });
  }

  // 5. Freeze. The version is already immutable; binding the job to it by id is
  //    what makes the receipt able to prove what was sent.
  const contentVersionId = aggregate.currentVersionId;

  const approvalRequest =
    aggregate.approvalPolicy === 'none'
      ? null
      : await db.approvalRequest.findFirst({
          where: { contentItemId: aggregate.itemId, contentVersionId, state: 'approved' },
          orderBy: { createdAt: 'desc' },
          select: { id: true },
        });

  const jobs: PublishJobView[] = [];

  for (const variant of aggregate.variants) {
    const resolved = resolveTarget(aggregate.master, variant.settings.overrides);
    const schedule = resolved.values.schedule ?? input.scheduleSpec;
    const executeAt = new Date(schedule.instant);
    const capability = capabilities.get(variant.connectionId);

    // 6. A deterministic key. The same version to the same connection at the
    //    same instant is one job, whatever the caller retried.
    const idempotencyKey = publishJobIdempotencyKey({
      contentVersionId,
      connectionId: variant.connectionId,
      scheduledInstant: executeAt.toISOString(),
      ...(ctx.idempotencyKey === undefined ? {} : { callerKey: ctx.idempotencyKey }),
    });

    const existing = await db.publishJob.findFirst({
      where: { idempotencyKey },
      select: PUBLISH_JOB_SELECT,
    });
    if (existing !== null) {
      jobs.push(jobToView(existing));
      continue;
    }

    const created = await db.publishJob.create({
      data: {
        workspaceId: actor.workspace.id,
        contentItemId: aggregate.itemId,
        contentVersionId,
        postVariantId: variant.id,
        connectionId: variant.connectionId,
        ...(approvalRequest === null ? {} : { approvalRequestId: approvalRequest.id }),
        approvalPolicy: toApprovalPolicy(aggregate.approvalPolicy),
        scheduledFor: executeAt,
        scheduledTimeZone: schedule.ianaTimeZone,
        state: 'scheduled',
        idempotencyKey,
        surface: toStoredSurface(ctx.surface),
      },
      select: { id: true },
    });

    // 7. Hand it to the durable scheduler. The workflow id is deterministic,
    //    so a retry of this whole request cannot start a second workflow.
    const started = await deps.scheduler.schedulePublish({
      jobId: created.id,
      workspaceId: ctx.workspaceId,
      executeAt,
      idempotencyKey,
    });

    await db.publishJob.update({
      where: { id: created.id },
      data: { temporalWorkflowId: started.workflowId, temporalRunId: started.runId },
    });

    await db.postVariant.update({
      where: { id: variant.id },
      data: {
        state: 'scheduled',
        ...(capability?.capabilityVersion === undefined || capability.capabilityVersion === null
          ? {}
          : { capabilitySnapshotVersion: capability.capabilityVersion }),
      },
    });

    const row = await db.publishJob.findFirst({
      where: { id: created.id },
      select: PUBLISH_JOB_SELECT,
    });
    if (row !== null) {
      jobs.push(jobToView(row));
    }

    await recordAudit(db, actor, {
      action: input.kind === 'publish_now' ? 'post.published' : 'post.scheduled',
      targetType: 'publish_job',
      targetId: created.id,
      after: {
        checksum: aggregate.checksum,
        scheduledInstant: executeAt.toISOString(),
        connectionId: variant.connectionId,
      },
      metadata: {
        contentItemId: aggregate.itemId,
        idempotencyKey,
        workflowId: started.workflowId,
        localTime: toLocalDateTime(executeAt, schedule.ianaTimeZone),
        containsUrl: containsUrl(resolved.values.body),
        estimatedCostMinor: validation.estimatedCostMinor ?? null,
      },
    });
  }

  await db.contentItem.update({
    where: { id: aggregate.itemId },
    data: {
      state: 'scheduled',
      scheduledAt: new Date(input.scheduleSpec.instant),
      scheduledTimeZone: input.scheduleSpec.ianaTimeZone,
    },
  });

  await deps.billing.recordUsage({
    workspaceId: ctx.workspaceId,
    key: 'publications.monthly',
    quantity: aggregate.variants.length,
    idempotencyKey: `${aggregate.currentVersionId}:${input.kind}`,
  });

  return { jobs, checksum: aggregate.checksum };
}

function startOfUtcDay(instant: Date): Date {
  const start = new Date(instant.getTime());
  start.setUTCHours(0, 0, 0, 0);
  return start;
}
