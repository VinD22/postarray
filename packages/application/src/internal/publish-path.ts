import { publishHoldReasonSchema, type PublishHold } from '@relay/contracts';

import type { ActorContext, PublishConfirmationEvidence, ServiceDeps } from '../types';
import type { PublishJobView } from '../views';

import { recordAudit } from './audit';
import { enqueueWorkflowOutbox } from './enqueue-outbox';
import { containsUrl } from './capabilities';
import { publishJobIdempotencyKey } from './idempotency';
import { toLocalDateTime, toProviderId, toStoredSurface } from './mappers';
import {
  assertConfirmed,
  assertNoBlockers,
  runPublishPreflight,
  type PublishPreflightInput,
} from './publish-preflight';
import type { ActorSnapshot, Db } from './runtime';
import { toApprovalPolicy } from './storage-enums';
import { resolveTarget } from './stored-content';
import { publishWorkflowId } from '../ports/scheduler';

/**
 * The one path to an external publication.
 *
 * `scheduling.schedule` and `publishing.publishNow` differ only in the instant
 * they aim at and the confirmation they require. Everything else, validation,
 * entitlement, approval policy, freezing the version, minting a deterministic
 * idempotency key and handing the job to the durable scheduler, happens here so
 * the two cannot drift apart.
 */

export interface PublishPathInput extends PublishPreflightInput {
  readonly confirmation: PublishConfirmationEvidence | false;
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
  pausedAt: Date | null;
  pausedReason: string | null;
  pausedByUserId: string | null;
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
    hold: toPublishHold(row),
  };
}

/**
 * A hold, read back off the two columns that carry it.
 *
 * The columns move together, so a row with only one of them set is a database
 * bug rather than a partial hold; migration 0070 refuses it. Here the pair is
 * read defensively anyway, and an unrecognised reason is treated as no hold
 * rather than guessed at, because inventing `user` for a value we do not
 * understand would put a Resume button on something a person cannot resume.
 */
export function toPublishHold(row: {
  pausedAt: Date | null;
  pausedReason: string | null;
  pausedByUserId: string | null;
}): PublishHold | null {
  if (row.pausedAt === null || row.pausedReason === null) {
    return null;
  }
  const reason = publishHoldReasonSchema.safeParse(row.pausedReason);
  if (!reason.success) {
    return null;
  }
  return {
    reason: reason.data,
    since: row.pausedAt.toISOString(),
    byUserId: row.pausedByUserId,
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
  pausedAt: true,
  pausedReason: true,
  pausedByUserId: true,
  connection: { select: { provider: true } },
  approvalRequest: { select: { state: true } },
} as const;

export async function runPublishPath(
  db: Db,
  deps: ServiceDeps,
  ctx: ActorContext,
  actor: ActorSnapshot,
  input: PublishPathInput,
): Promise<PublishPathResult> {
  const preflight = await runPublishPreflight(db, deps, ctx, actor, input);
  assertNoBlockers(preflight);
  assertConfirmed(preflight, ctx, input.confirmation);
  const { aggregate, validation, capabilities } = preflight;
  const variants = preflight.variants;

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

  for (const variant of variants) {
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

    // 7. Commit workflow intent in the same transaction as the job. The
    //    dispatcher starts Temporal only after this transaction commits.
    await enqueueWorkflowOutbox(db, {
      kind: 'start_publish',
      dedupeKey: `start-publish:${created.id}`,
      payload: {
        jobId: created.id,
        workspaceId: ctx.workspaceId,
        executeAt: executeAt.toISOString(),
        idempotencyKey,
        workflowInput: {
          ctx: {
            workspaceId: ctx.workspaceId,
            correlationId: ctx.correlationId,
            actorId: ctx.actorId,
            actorType: ctx.actorType,
            surface: ctx.surface,
            approvalLevel: ctx.approvalLevel,
            locale: ctx.locale,
          },
          publishJobId: created.id,
          contentItemId: aggregate.itemId,
          contentVersionId,
          contentVersionChecksum: aggregate.checksum,
          idempotencyKey,
          executeAt: executeAt.toISOString(),
          scheduledLocalTime: toLocalDateTime(executeAt, schedule.ianaTimeZone),
          ianaTimeZone: schedule.ianaTimeZone,
          targets: [
            {
              targetId: variant.id,
              connectionId: variant.connectionId,
              provider: toProviderId(variant.provider),
              approvedCapabilityVersion: capability?.capabilityVersion ?? 'unavailable',
              threadItemIds: resolved.values.threadItems
                .filter(
                  (item) =>
                    item.connectionId === null || item.connectionId === variant.connectionId,
                )
                .map((item) => item.id),
              threadDelaysSeconds: resolved.values.threadItems
                .filter(
                  (item) =>
                    item.connectionId === null || item.connectionId === variant.connectionId,
                )
                .map((item) => item.delaySeconds),
            },
          ],
          immediate: input.kind === 'publish_now',
        },
      },
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
        workflowId: publishWorkflowId(ctx.workspaceId, created.id),
        localTime: toLocalDateTime(executeAt, schedule.ianaTimeZone),
        containsUrl: containsUrl(resolved.values.body),
        estimatedCostMinor: validation.estimatedCostMinor ?? null,
        acknowledgedEscalations:
          input.confirmation === false ? [] : input.confirmation.acknowledgedEscalations,
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
    quantity: variants.length,
    idempotencyKey:
      input.connectionIds === undefined
        ? `${aggregate.currentVersionId}:${input.kind}`
        : `${aggregate.currentVersionId}:${input.kind}:${variants
            .map((variant) => variant.connectionId)
            .sort()
            .join(',')}`,
  });

  return { jobs, checksum: aggregate.checksum };
}
