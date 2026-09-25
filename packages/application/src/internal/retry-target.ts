import { createHash } from 'node:crypto';

import { EntitlementRequiredError, type PublishState } from '@relay/contracts';

import type { ActorContext, ServiceDeps } from '../types';
import type { PublishJobView } from '../views';
import { publishWorkflowId } from '../ports/scheduler';

import { recordAudit } from './audit';
import { loadCapabilitiesFor } from './capabilities';
import { loadAggregate } from './content-store';
import { enqueueWorkflowOutbox } from './enqueue-outbox';
import { invalid, notFound } from './errors';
import { toLocalDateTime, toProviderId, toStoredSurface } from './mappers';
import { PUBLISH_JOB_SELECT, jobToView } from './publish-path';
import type { ActorSnapshot, Db } from './runtime';
import { resolveTarget } from './stored-content';

/**
 * Retrying one failed target.
 *
 * A retry is a new publish job for the same variant of the same frozen
 * version, never a re-run of the original job and never a re-run of the whole
 * content item. The original job keeps its failed state and its attempts, so
 * the receipt history shows both.
 *
 * Duplicate publication is the failure this file exists to prevent, so every
 * refusal below errs towards "do not post":
 *
 * - a receipt for this version on this connection means it already published,
 *   whichever job wrote it (worker crash after the provider accepted, then a
 *   later receipt write);
 * - an attempt still `pending`, or one that ended with an `unknown` error
 *   class, means the provider may have accepted the post and we cannot prove
 *   otherwise (provider timeout), so a person reconciles first;
 * - a newer job for this variant that is still in flight is returned instead
 *   of creating another (double click, duplicated webhook, replayed request);
 * - a connection that is not active is refused before anything is queued
 *   (revoked token at execution).
 */

const IMMEDIATE_LEAD_SECONDS = 5;

const RETRYABLE: ReadonlySet<PublishState> = new Set(['action_required', 'failed_permanently']);
const FAILED_FINAL: ReadonlySet<PublishState> = new Set([
  'action_required',
  'failed_permanently',
  'canceled',
  'validation_needed',
]);

/** Derived from `(originalJobId, attempt)`: the same retry is always one job. */
export function retryJobIdempotencyKey(originalJobId: string, attempt: number): string {
  const digest = createHash('sha256')
    .update(JSON.stringify({ kind: 'retry_target', originalJobId, attempt }))
    .digest('hex');
  return `pj_retry_${digest.slice(0, 40)}`;
}

export interface RetryEvidence {
  readonly job: { readonly id: string; readonly state: PublishState; readonly hasReceipt: boolean };
  /** Jobs for the same variant created after this one, oldest first. */
  readonly laterJobs: readonly { readonly id: string; readonly state: PublishState }[];
  /** Receipts for this version on this connection, from any job. */
  readonly receiptCount: number;
  readonly lastAttempt: {
    readonly outcome: string;
    readonly errorClass: string | null;
  } | null;
  readonly connectionStatus: string;
  readonly versionIsCurrent: boolean;
}

export type RetryDecision =
  | { readonly kind: 'create' }
  | { readonly kind: 'return_existing'; readonly jobId: string }
  | {
      readonly kind: 'refuse';
      readonly messageKey: string;
      readonly reason: string;
    };

/** The whole duplicate-safety decision, pure so every case is testable. */
export function decideRetry(evidence: RetryEvidence): RetryDecision {
  if (evidence.job.hasReceipt || evidence.job.state === 'published' || evidence.receiptCount > 0) {
    return {
      kind: 'refuse',
      messageKey: 'errors.job_already_published',
      reason: 'receipt_exists',
    };
  }
  const later = evidence.laterJobs.at(-1);
  if (later !== undefined) {
    if (later.state === 'published' || later.state === 'partially_published') {
      return {
        kind: 'refuse',
        messageKey: 'errors.job_already_published',
        reason: 'retry_published',
      };
    }
    if (!FAILED_FINAL.has(later.state)) {
      return { kind: 'return_existing', jobId: later.id };
    }
    return { kind: 'refuse', messageKey: 'errors.job_not_retryable', reason: 'superseded' };
  }
  if (!RETRYABLE.has(evidence.job.state)) {
    return { kind: 'refuse', messageKey: 'errors.job_not_retryable', reason: 'not_failed' };
  }
  if (
    evidence.lastAttempt !== null &&
    (evidence.lastAttempt.outcome === 'pending' || evidence.lastAttempt.errorClass === 'unknown')
  ) {
    return {
      kind: 'refuse',
      messageKey: 'errors.publish_outcome_unknown',
      reason: 'outcome_unknown',
    };
  }
  if (!evidence.versionIsCurrent) {
    return { kind: 'refuse', messageKey: 'errors.job_not_retryable', reason: 'version_changed' };
  }
  if (evidence.connectionStatus !== 'active') {
    return {
      kind: 'refuse',
      messageKey: 'errors.connection_action_required',
      reason: 'connection_not_active',
    };
  }
  return { kind: 'create' };
}

export async function runRetryTarget(
  db: Db,
  deps: ServiceDeps,
  ctx: ActorContext,
  actor: ActorSnapshot,
  input: { readonly jobId: string; readonly targetId: string },
): Promise<PublishJobView> {
  const job = await db.publishJob.findFirst({
    where: { id: input.jobId },
    select: {
      ...PUBLISH_JOB_SELECT,
      approvalRequestId: true,
      receipt: { select: { id: true } },
      attempts: {
        orderBy: { attemptNumber: 'desc' },
        take: 1,
        select: { outcome: true, errorClass: true },
      },
    },
  });
  if (job === null) {
    throw notFound('publish_job', input.jobId);
  }
  if (job.postVariantId !== input.targetId) {
    throw notFound('post_variant', input.targetId);
  }

  const [laterJobs, receiptCount, connection, item] = await Promise.all([
    db.publishJob.findMany({
      where: {
        postVariantId: job.postVariantId,
        contentVersionId: job.contentVersionId,
        createdAt: { gt: job.createdAt },
      },
      orderBy: { createdAt: 'asc' },
      select: { id: true, state: true },
    }),
    db.publicationReceipt.count({
      where: { contentVersionId: job.contentVersionId, connectionId: job.connectionId },
    }),
    db.socialConnection.findFirst({
      where: { id: job.connectionId },
      select: { status: true },
    }),
    db.contentItem.findFirst({
      where: { id: job.contentItemId },
      select: { currentVersionId: true },
    }),
  ]);

  const lastAttempt = job.attempts[0] ?? null;
  const decision = decideRetry({
    job: { id: job.id, state: job.state as PublishState, hasReceipt: job.receipt !== null },
    laterJobs: laterJobs.map((row) => ({ id: row.id, state: row.state as PublishState })),
    receiptCount,
    lastAttempt:
      lastAttempt === null
        ? null
        : { outcome: lastAttempt.outcome, errorClass: lastAttempt.errorClass },
    connectionStatus: connection?.status ?? 'disconnected',
    versionIsCurrent: item?.currentVersionId === job.contentVersionId,
  });

  if (decision.kind === 'refuse') {
    throw invalid(decision.messageKey, { jobId: job.id, reason: decision.reason });
  }
  if (decision.kind === 'return_existing') {
    const existing = await db.publishJob.findFirst({
      where: { id: decision.jobId },
      select: PUBLISH_JOB_SELECT,
    });
    if (existing === null) {
      throw notFound('publish_job', decision.jobId);
    }
    return jobToView(existing);
  }

  const entitlement = await deps.billing.checkEntitlement({
    workspaceId: ctx.workspaceId,
    key: 'publishing.enabled',
  });
  if (!entitlement.allowed) {
    throw new EntitlementRequiredError({
      messageKey: entitlement.reasonKey ?? 'errors.entitlement_missing',
      details: { limit: entitlement.limit, used: entitlement.used },
    });
  }

  const aggregate = await loadAggregate(db, job.contentItemId);
  const variant = aggregate.variants.find((candidate) => candidate.id === job.postVariantId);
  if (variant === undefined) {
    throw notFound('post_variant', input.targetId);
  }

  // Attempt 1 is the original job; each retry of the same variant counts on.
  const attempt = laterJobs.length + 2;
  const idempotencyKey = retryJobIdempotencyKey(job.id, attempt);
  const already = await db.publishJob.findFirst({
    where: { idempotencyKey },
    select: PUBLISH_JOB_SELECT,
  });
  if (already !== null) {
    return jobToView(already);
  }

  const capabilities = await loadCapabilitiesFor(db, deps, [variant.connectionId]);
  const capability = capabilities.get(variant.connectionId);
  const resolved = resolveTarget(aggregate.master, variant.settings.overrides);
  const executeAt = new Date(deps.clock.now().getTime() + IMMEDIATE_LEAD_SECONDS * 1000);
  const ianaTimeZone = job.scheduledTimeZone;

  const created = await db.publishJob.create({
    data: {
      workspaceId: actor.workspace.id,
      contentItemId: job.contentItemId,
      contentVersionId: job.contentVersionId,
      postVariantId: variant.id,
      connectionId: variant.connectionId,
      ...(job.approvalRequestId === null ? {} : { approvalRequestId: job.approvalRequestId }),
      approvalPolicy: job.approvalPolicy,
      scheduledFor: executeAt,
      scheduledTimeZone: ianaTimeZone,
      state: 'scheduled',
      idempotencyKey,
      surface: toStoredSurface(ctx.surface),
    },
    select: { id: true },
  });

  const threadItems = resolved.values.threadItems.filter(
    (item) => item.connectionId === null || item.connectionId === variant.connectionId,
  );
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
        contentItemId: job.contentItemId,
        contentVersionId: job.contentVersionId,
        contentVersionChecksum: aggregate.checksum,
        idempotencyKey,
        executeAt: executeAt.toISOString(),
        scheduledLocalTime: toLocalDateTime(executeAt, ianaTimeZone),
        ianaTimeZone,
        targets: [
          {
            targetId: variant.id,
            connectionId: variant.connectionId,
            provider: toProviderId(variant.provider),
            approvedCapabilityVersion: capability?.capabilityVersion ?? 'unavailable',
            threadItemIds: threadItems.map((item) => item.id),
            threadDelaysSeconds: threadItems.map((item) => item.delaySeconds),
          },
        ],
        immediate: true,
      },
    },
  });

  await db.postVariant.update({ where: { id: variant.id }, data: { state: 'scheduled' } });
  // Dispatching, not scheduled: a sibling target may already be live, and a
  // scheduled item would reopen editing underneath it. The worker roll-up
  // settles the final state when this job finishes.
  await db.contentItem.update({ where: { id: job.contentItemId }, data: { state: 'dispatching' } });

  await recordAudit(db, actor, {
    action: 'post.retried',
    targetType: 'publish_job',
    targetId: created.id,
    after: { connectionId: variant.connectionId, scheduledInstant: executeAt.toISOString() },
    metadata: {
      contentItemId: job.contentItemId,
      originalJobId: job.id,
      attempt,
      idempotencyKey,
      workflowId: publishWorkflowId(ctx.workspaceId, created.id),
    },
  });

  const row = await db.publishJob.findFirst({
    where: { id: created.id },
    select: PUBLISH_JOB_SELECT,
  });
  if (row === null) {
    throw notFound('publish_job', created.id);
  }
  return jobToView(row);
}
