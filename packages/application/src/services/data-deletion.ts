import { RelayError } from '@relay/contracts';

import type {
  ActorContext,
  DataDeletionScope,
  DataDeletionService,
  ServiceDeps,
  WorkflowActorContext,
} from '../types';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { runInWorkspace } from '../internal/runtime';

/** Publish states that can still create an external side effect. */
const CANCELABLE_JOB_STATES = [
  'approval_requested',
  'approved',
  'scheduled',
  'preparing_media',
  'dispatching',
  'provider_processing',
  'action_required',
  'retry_scheduled',
] as const;
const CANCELABLE_JOB_STATE_SET: ReadonlySet<string> = new Set(CANCELABLE_JOB_STATES);

const TERMINAL_WORKFLOW_STATES = new Set([
  'COMPLETED',
  'FAILED',
  'CANCELED',
  'TERMINATED',
  'TIMED_OUT',
]);

function systemContext(input: WorkflowActorContext): ActorContext {
  return {
    actorType: 'system',
    actorId: 'data-deletion-worker',
    workspaceId: input.workspaceId,
    scopes: [],
    surface: 'automation_rule',
    correlationId: input.correlationId,
    approvalLevel: 'level_3_confirm',
    locale: input.locale,
  };
}

function emptyScope(): DataDeletionScope {
  return {
    publishJobIds: [],
    connectionIds: [],
    receiptIds: [],
    objectPrefixes: [],
    ruleIds: [],
    feedIds: [],
  };
}

function workflowIsTerminal(status: string): boolean {
  return TERMINAL_WORKFLOW_STATES.has(status.toUpperCase());
}

function completedAt(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw invalid('errors.validation_failed', { reason: 'invalid_completion_time' });
  }
  return parsed;
}

/**
 * Durable deletion activities.
 *
 * The worker carries only identifiers and safe workflow context. Every data
 * mutation comes back through this service, which applies the workspace RLS
 * context and makes retries idempotent. Remote provider revocation is kept
 * explicitly separate: until a verified connector exposes that operation we
 * revoke Relay's credential and show the connection as revoked without
 * claiming the provider accepted a revoke request.
 */
export function createDataDeletionService(deps: ServiceDeps): DataDeletionService {
  return {
    async loadDeletionScope(input): Promise<DataDeletionScope> {
      const ctx = systemContext(input.ctx);
      return runInWorkspace(deps, ctx, async (db, actor) => {
        const request = await db.deletionRequest.findFirst({
          where: { id: input.requestId, workspaceId: ctx.workspaceId },
          select: { scope: true, subjectUserId: true, state: true, executeAfter: true },
        });
        if (request === null) {
          throw notFound('deletion_request', input.requestId, ctx.correlationId);
        }
        if (request.state === 'canceled' || request.state === 'completed') {
          return emptyScope();
        }
        if (request.scope !== 'workspace' || request.subjectUserId !== null) {
          throw new RelayError('CAPABILITY_NOT_IMPLEMENTED', {
            messageKey: 'errors.capability_not_implemented',
            details: { capability: 'subject_data_deletion', scope: request.scope },
          });
        }
        if (request.executeAfter.getTime() > deps.clock.now().getTime()) {
          throw invalid('errors.validation_failed', {
            reason: 'deletion_grace_period_not_elapsed',
          });
        }

        const now = deps.clock.now();
        const transition = await db.deletionRequest.updateMany({
          where: {
            id: input.requestId,
            workspaceId: ctx.workspaceId,
            state: { in: ['requested', 'verifying', 'scheduled', 'failed'] },
          },
          data: { state: 'executing', verifiedAt: now, failureNote: null },
        });
        if (transition.count > 0) {
          await recordAudit(db, actor, {
            action: 'deletion.executing',
            targetType: 'deletion_request',
            targetId: input.requestId,
            metadata: { scope: request.scope },
          });
        }

        const [publishJobs, connections, receipts, rules, feeds] = await Promise.all([
          db.publishJob.findMany({
            where: {
              workspaceId: ctx.workspaceId,
              state: { in: [...CANCELABLE_JOB_STATES] },
            },
            orderBy: { id: 'asc' },
            select: { id: true },
          }),
          db.socialConnection.findMany({
            where: { workspaceId: ctx.workspaceId, status: { not: 'disconnected' } },
            orderBy: { id: 'asc' },
            select: { id: true },
          }),
          db.publicationReceipt.findMany({
            where: { workspaceId: ctx.workspaceId },
            orderBy: { id: 'asc' },
            select: { id: true },
          }),
          db.automationRule.findMany({
            where: { workspaceId: ctx.workspaceId },
            orderBy: { id: 'asc' },
            select: { id: true },
          }),
          db.rssFeed.findMany({
            where: { workspaceId: ctx.workspaceId },
            orderBy: { id: 'asc' },
            select: { id: true },
          }),
        ]);

        return {
          publishJobIds: publishJobs.map((row) => row.id),
          connectionIds: connections.map((row) => row.id),
          receiptIds: receipts.map((row) => row.id),
          objectPrefixes: [`${ctx.workspaceId}/`],
          ruleIds: rules.map((row) => row.id),
          feedIds: feeds.map((row) => row.id),
        };
      });
    },

    async cancelScheduledJob(input): Promise<void> {
      const ctx = systemContext(input.ctx);
      const job = await runInWorkspace(deps, ctx, (db) =>
        db.publishJob.findFirst({
          where: { id: input.publishJobId, workspaceId: ctx.workspaceId },
          select: { state: true, temporalWorkflowId: true },
        }),
      );
      if (job === null || !CANCELABLE_JOB_STATE_SET.has(job.state)) {
        return;
      }

      if (job.temporalWorkflowId !== null) {
        const workflow = await deps.scheduler.describe({
          jobId: input.publishJobId,
          workspaceId: ctx.workspaceId,
        });
        if (workflow !== null && !workflowIsTerminal(workflow.status)) {
          await deps.scheduler.cancelPublish({
            jobId: input.publishJobId,
            workspaceId: ctx.workspaceId,
            reason: input.reasonKey,
          });
        }
      }

      await runInWorkspace(deps, ctx, async (db, actor) => {
        const updated = await db.publishJob.updateMany({
          where: {
            id: input.publishJobId,
            workspaceId: ctx.workspaceId,
            state: { in: [...CANCELABLE_JOB_STATES] },
          },
          data: { state: 'canceled', canceledAt: deps.clock.now() },
        });
        if (updated.count > 0) {
          await recordAudit(db, actor, {
            action: 'deletion.job_canceled',
            targetType: 'publish_job',
            targetId: input.publishJobId,
            metadata: { reasonKey: input.reasonKey },
          });
        }
      });
    },

    async revokeProviderConnection(input): Promise<void> {
      const ctx = systemContext(input.ctx);
      await runInWorkspace(deps, ctx, async (db, actor) => {
        const credentials = await db.socialCredential.deleteMany({
          where: { workspaceId: ctx.workspaceId, connectionId: input.connectionId },
        });
        const updated = await db.socialConnection.updateMany({
          where: { id: input.connectionId, workspaceId: ctx.workspaceId },
          data: {
            status: 'revoked',
            statusReason: 'connection.revoked_by_deletion',
            disconnectedAt: deps.clock.now(),
            grantedScopes: [],
          },
        });
        if (credentials.count > 0 || updated.count > 0) {
          await recordAudit(db, actor, {
            action: 'deletion.connection_revoked',
            targetType: 'social_connection',
            targetId: input.connectionId,
            after: { relayCredentialDeleted: credentials.count > 0, status: 'revoked' },
            metadata: { providerRevocation: 'not_implemented' },
          });
        }
      });
    },

    async deleteStoredObjects(input) {
      const ctx = systemContext(input.ctx);
      const page = await deps.storage.list({
        workspaceId: ctx.workspaceId,
        prefix: input.prefix,
        cursor: input.cursor,
        limit: 100,
      });
      for (const key of page.keys) {
        await deps.storage.remove(key);
      }

      if (page.keys.length > 0) {
        await runInWorkspace(deps, ctx, async (db, actor) => {
          const now = deps.clock.now();
          await db.mediaAsset.updateMany({
            where: { workspaceId: ctx.workspaceId, storageKey: { in: [...page.keys] } },
            data: { deletedAt: now, storageDeletedAt: now },
          });
          await db.mediaDerivative.deleteMany({
            where: { workspaceId: ctx.workspaceId, storageKey: { in: [...page.keys] } },
          });
          await recordAudit(db, actor, {
            action: 'deletion.objects_deleted',
            targetType: 'deletion_request',
            targetId: input.requestId,
            metadata: { prefix: input.prefix, objectCount: page.keys.length },
          });
        });
      }

      return { deletedCount: page.keys.length, nextCursor: page.nextCursor };
    },

    async tombstoneAnalytics(input): Promise<void> {
      if (input.receiptIds.length === 0) return;
      const ctx = systemContext(input.ctx);
      await runInWorkspace(deps, ctx, async (db, actor) => {
        const now = deps.clock.now();
        const receipts = await db.publicationReceipt.updateMany({
          where: {
            workspaceId: ctx.workspaceId,
            id: { in: [...input.receiptIds] },
            deletedExternallyAt: null,
          },
          data: { deletedExternallyAt: now },
        });
        const observations = await db.metricObservation.updateMany({
          where: { workspaceId: ctx.workspaceId, receiptId: { in: [...input.receiptIds] } },
          data: {
            availability: 'unavailable',
            rawValue: null,
            normalizedValue: null,
            sourceResponseHash: null,
            unavailableReason: 'deletion.data_erased',
          },
        });
        if (receipts.count > 0 || observations.count > 0) {
          await recordAudit(db, actor, {
            action: 'deletion.analytics_tombstoned',
            targetType: 'deletion_request',
            targetId: input.requestId,
            metadata: {
              receiptCount: receipts.count,
              observationCount: observations.count,
            },
          });
        }
      });
    },

    async finalizeDeletion(input): Promise<void> {
      const ctx = systemContext(input.ctx);
      const executedAt = completedAt(input.completedAt);
      await runInWorkspace(deps, ctx, async (db, actor) => {
        // A storage delete can succeed immediately before a database retryable
        // failure. The page will then be absent on the retry, so the final
        // workspace sweep closes that accounting gap for every media row.
        await db.mediaAsset.updateMany({
          where: { workspaceId: ctx.workspaceId, storageDeletedAt: null },
          data: { deletedAt: executedAt, storageDeletedAt: executedAt },
        });
        await db.mediaDerivative.deleteMany({ where: { workspaceId: ctx.workspaceId } });
        await db.socialCredential.deleteMany({ where: { workspaceId: ctx.workspaceId } });
        await db.apiKey.deleteMany({ where: { workspaceId: ctx.workspaceId } });
        await db.serviceAccount.deleteMany({ where: { workspaceId: ctx.workspaceId } });
        await db.webhookEndpoint.deleteMany({ where: { workspaceId: ctx.workspaceId } });
        await db.oAuthTransaction.deleteMany({ where: { workspaceId: ctx.workspaceId } });
        await db.oAuthGrant.deleteMany({ where: { workspaceId: ctx.workspaceId } });
        await db.oAuthClient.deleteMany({ where: { workspaceId: ctx.workspaceId } });
        if (input.ruleIds.length > 0) {
          await db.automationRule.deleteMany({
            where: { workspaceId: ctx.workspaceId, id: { in: [...input.ruleIds] } },
          });
        }
        if (input.feedIds.length > 0) {
          await db.rssFeed.deleteMany({
            where: { workspaceId: ctx.workspaceId, id: { in: [...input.feedIds] } },
          });
        }
        // Keep retention-bound evidence addressable while making the tenant
        // inaccessible immediately. A hard workspace delete would violate the
        // audit and receipt retention contracts, so closure is a soft delete
        // followed by the existing retention pruner.
        await db.dataExport.updateMany({
          where: {
            workspaceId: ctx.workspaceId,
            state: { in: ['requested', 'building', 'ready', 'delivered'] },
          },
          data: {
            state: 'expired',
            storageKey: null,
            byteSize: null,
            checksumSha256: null,
          },
        });
        await db.membership.updateMany({
          where: { workspaceId: ctx.workspaceId, state: { not: 'removed' } },
          data: { state: 'removed', removedAt: executedAt },
        });
        await db.userSession.updateMany({
          where: { workspaceId: ctx.workspaceId, state: 'active' },
          data: { state: 'revoked', revokedAt: executedAt },
        });
        await db.workspace.updateMany({
          where: { id: ctx.workspaceId, deletedAt: null },
          data: { status: 'deleted', deletedAt: executedAt },
        });

        const completed = await db.deletionRequest.updateMany({
          where: {
            id: input.requestId,
            workspaceId: ctx.workspaceId,
            state: { in: ['requested', 'verifying', 'scheduled', 'executing', 'failed'] },
          },
          data: { state: 'completed', executedAt, failureNote: null },
        });
        if (completed.count > 0) {
          await recordAudit(db, actor, {
            action: 'deletion.executed',
            targetType: 'deletion_request',
            targetId: input.requestId,
            after: { state: 'completed' },
            metadata: {
              deletedObjectCount: input.deletedObjectCount,
              canceledJobCount: input.canceledJobCount,
              revokedConnectionCount: input.revokedConnectionCount,
              providerRevocation: 'not_implemented',
            },
          });
        }
      });
    },

    async markDeletionFailed(input): Promise<void> {
      const ctx = systemContext(input.ctx);
      await runInWorkspace(deps, ctx, async (db, actor) => {
        const failed = await db.deletionRequest.updateMany({
          where: {
            id: input.requestId,
            workspaceId: ctx.workspaceId,
            state: { in: ['requested', 'verifying', 'scheduled', 'executing'] },
          },
          data: { state: 'failed', failureNote: input.reasonKey },
        });
        if (failed.count > 0) {
          await recordAudit(db, actor, {
            action: 'deletion.failed',
            targetType: 'deletion_request',
            targetId: input.requestId,
            after: { state: 'failed' },
            metadata: { reasonKey: input.reasonKey },
          });
        }
      });
    },
  };
}
