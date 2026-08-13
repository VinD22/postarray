import { ERROR_CODES } from '@relay/contracts';

import type {
  ActorContext,
  ServiceDeps,
  WorkerActivityContext,
  WorkerExternalPublication,
  WorkerPublishingService,
} from '../types';
import { notFound } from '../internal/errors';
import { toJson } from '../internal/json';
import { runInWorkspace } from '../internal/runtime';

function context(ctx: WorkerActivityContext): ActorContext {
  return { ...ctx, scopes: [] };
}

function date(value: string): Date {
  return new Date(value);
}

function publication(row: {
  externalPostId: string;
  permalink: string | null;
  publishedAt: Date;
  connection: { externalAccountId: string };
}): WorkerExternalPublication {
  return {
    externalPostId: row.externalPostId,
    permalink: row.permalink,
    publishedAt: row.publishedAt.toISOString(),
    externalAccountId: row.connection.externalAccountId,
  };
}

export function createWorkerPublishingService(deps: ServiceDeps): WorkerPublishingService {
  return {
    async preflightCampaign(input) {
      return runInWorkspace(deps, context(input.ctx), async (db) => {
        const job = await db.publishJob.findFirst({
          where: { id: input.publishJobId, workspaceId: input.ctx.workspaceId },
          select: {
            contentItemId: true,
            contentVersionId: true,
            contentVersion: { select: { contentHash: true } },
          },
        });
        if (job === null)
          throw notFound('publish_job', input.publishJobId, input.ctx.correlationId);
        const targets = await db.postVariant.findMany({
          where: {
            id: { in: [...input.targetIds] },
            workspaceId: input.ctx.workspaceId,
            contentItemId: input.contentItemId,
            contentVersionId: input.contentVersionId,
          },
          select: { id: true, connection: { select: { status: true } } },
        });
        const found = new Set(targets.map((target) => target.id));
        const blockedTargetIds = input.targetIds.filter(
          (id) =>
            !found.has(id) ||
            targets.find((target) => target.id === id)?.connection.status !== 'active',
        );
        const changed =
          job.contentItemId !== input.contentItemId ||
          job.contentVersionId !== input.contentVersionId ||
          job.contentVersion.contentHash !== input.contentVersionChecksum;
        return changed
          ? {
              verdict: 'needs_reapproval',
              messageKey: 'error.content_changed_after_approval.message',
              errorCode: ERROR_CODES.APPROVAL_REQUIRED,
              blockedTargetIds: [...input.targetIds],
            }
          : blockedTargetIds.length > 0
            ? {
                verdict: 'blocked',
                messageKey: 'error.connection_action_required.message',
                errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
                blockedTargetIds,
              }
            : { verdict: 'proceed', messageKey: null, errorCode: null, blockedTargetIds: [] };
      });
    },

    async beginPublishAttempt(input) {
      return runInWorkspace(deps, context(input.ctx), async (db) => {
        const job = await db.publishJob.findFirst({
          where: {
            id: input.publishJobId,
            workspaceId: input.ctx.workspaceId,
            connectionId: input.connectionId,
          },
          select: { contentVersionId: true },
        });
        if (job === null)
          throw notFound('publish_job', input.publishJobId, input.ctx.correlationId);
        const existingReceipt = await db.publicationReceipt.findFirst({
          where: { publishJobId: input.publishJobId, workspaceId: input.ctx.workspaceId },
          select: {
            externalPostId: true,
            permalink: true,
            publishedAt: true,
            connection: { select: { externalAccountId: true } },
          },
        });
        const attempt = await db.publishAttempt.upsert({
          where: {
            publishJobId_attemptNumber: {
              publishJobId: input.publishJobId,
              attemptNumber: input.attemptNumber,
            },
          },
          create: {
            workspaceId: input.ctx.workspaceId,
            publishJobId: input.publishJobId,
            contentVersionId: job.contentVersionId,
            connectionId: input.connectionId,
            attemptNumber: input.attemptNumber,
            correlationId: input.ctx.correlationId,
            requestMetadata: { idempotencyKey: input.idempotencyKey },
          },
          update: {},
          select: { id: true, attemptNumber: true },
        });
        await db.publishJob.updateMany({
          where: {
            id: input.publishJobId,
            workspaceId: input.ctx.workspaceId,
            attemptCount: { lt: input.attemptNumber },
          },
          data: { attemptCount: input.attemptNumber },
        });
        return {
          attemptId: attempt.id,
          attemptNumber: attempt.attemptNumber,
          providerIdempotencyToken: input.idempotencyKey,
          alreadyPublished: existingReceipt === null ? null : publication(existingReceipt),
        };
      });
    },

    async ensureNotAlreadyPublished(input) {
      const found = await runInWorkspace(deps, context(input.ctx), (db) =>
        db.publicationReceipt.findFirst({
          where: { publishJobId: input.publishJobId, workspaceId: input.ctx.workspaceId },
          select: {
            externalPostId: true,
            permalink: true,
            publishedAt: true,
            connection: { select: { externalAccountId: true } },
          },
        }),
      );
      if (found !== null) return { verdict: 'published', publication: publication(found) };
      return (
        deps.workerPublishingProbe?.ensureNotAlreadyPublished(input) ?? {
          verdict: 'not_published',
          publication: null,
        }
      );
    },

    async finalizeAttempt(input) {
      await runInWorkspace(deps, context(input.ctx), async (db) => {
        const endedAt = deps.clock.now();
        await db.publishAttempt.updateMany({
          where: {
            id: input.attemptId,
            publishJobId: input.publishJobId,
            workspaceId: input.ctx.workspaceId,
          },
          data: {
            outcome: input.resultState === 'published' ? 'succeeded' : 'failed',
            errorClass: input.errorClass,
            errorCode: input.errorCode,
            endedAt,
            retryAfterSeconds:
              input.nextRetryAt === null
                ? null
                : Math.max(
                    0,
                    Math.round((date(input.nextRetryAt).getTime() - endedAt.getTime()) / 1000),
                  ),
          },
        });
      });
    },

    async setTargetState(input) {
      await runInWorkspace(deps, context(input.ctx), (db) =>
        db.postVariant
          .updateMany({
            where: { id: input.targetId, workspaceId: input.ctx.workspaceId },
            data: {
              state: input.state,
              validationIssues:
                input.errorCode === null
                  ? []
                  : [{ code: input.errorCode, messageKey: input.messageKey }],
            },
          })
          .then(() => undefined),
      );
    },

    async setJobState(input) {
      await runInWorkspace(deps, context(input.ctx), (db) =>
        db.publishJob
          .updateMany({
            where: { id: input.publishJobId, workspaceId: input.ctx.workspaceId },
            data: {
              state: input.state,
              lastErrorCode: input.errorCode,
              ...(['published', 'failed_permanently', 'partially_published', 'canceled'].includes(
                input.state,
              )
                ? { completedAt: deps.clock.now() }
                : {}),
            },
          })
          .then(() => undefined),
      );
    },

    async writeReceipt(input) {
      return runInWorkspace(deps, context(input.ctx), async (db) => {
        const existing = await db.publicationReceipt.findFirst({
          where: { publishJobId: input.publishJobId, workspaceId: input.ctx.workspaceId },
          select: { id: true },
        });
        if (existing !== null) return { receiptId: existing.id, created: false };
        const job = await db.publishJob.findFirst({
          where: { id: input.publishJobId, workspaceId: input.ctx.workspaceId },
          select: { surface: true, approvalPolicy: true },
        });
        if (job === null)
          throw notFound('publish_job', input.publishJobId, input.ctx.correlationId);
        const created = await db.publicationReceipt.create({
          data: {
            workspaceId: input.ctx.workspaceId,
            publishJobId: input.publishJobId,
            contentVersionId: input.contentVersionId,
            connectionId: input.connectionId,
            provider: input.provider,
            externalPostId: input.publication.externalPostId,
            permalink: input.publication.permalink,
            contentHash: input.contentVersionChecksum,
            publishedAt: date(input.publication.publishedAt),
            dispatchedAt: date(input.dispatchedAt),
            scheduledFor: date(input.scheduledInstant),
            scheduledTimeZone: input.ianaTimeZone,
            surface: job.surface,
            approvalPolicy: job.approvalPolicy,
            responseEvidence: toJson({
              attemptId: input.attemptId,
              capabilityVersion: input.capabilityVersion,
              scheduledLocalTime: input.scheduledLocalTime,
              items: input.items,
            }),
          },
          select: { id: true },
        });
        return { receiptId: created.id, created: true };
      });
    },

    async emitEvent(input) {
      await runInWorkspace(deps, context(input.ctx), (db) =>
        db.outboxEvent
          .upsert({
            where: {
              workspaceId_dedupeKey: {
                workspaceId: input.ctx.workspaceId,
                dedupeKey: input.dedupeKey,
              },
            },
            create: {
              workspaceId: input.ctx.workspaceId,
              kind: input.event,
              dedupeKey: input.dedupeKey,
              payload: { resourceId: input.resourceId, ...input.payload },
            },
            update: {},
          })
          .then(() => undefined),
      );
    },
    async notify(input) {
      await runInWorkspace(deps, context(input.ctx), (db) =>
        db.outboxEvent
          .upsert({
            where: {
              workspaceId_dedupeKey: {
                workspaceId: input.ctx.workspaceId,
                dedupeKey: `notification:${input.resourceId}:${input.messageKey}`,
              },
            },
            create: {
              workspaceId: input.ctx.workspaceId,
              kind: 'notification.requested',
              dedupeKey: `notification:${input.resourceId}:${input.messageKey}`,
              payload: {
                messageKey: input.messageKey,
                resourceId: input.resourceId,
                params: input.params,
              },
            },
            update: {},
          })
          .then(() => undefined),
      );
    },
    /**
     * Where one sequence item ended up.
     *
     * A record, never a create. `updateMany` scoped to the target keeps this
     * safe to call twice, and the publication evidence is merged into the item's
     * settings so the composer can link straight to the comment that exists.
     */
    async setSequenceItemState(input) {
      await runInWorkspace(deps, context(input.ctx), async (db) => {
        const item = await db.commentThreadItem.findFirst({
          where: {
            id: input.threadItemId,
            postVariantId: input.targetId,
            workspaceId: input.ctx.workspaceId,
          },
          select: { id: true, settings: true },
        });
        if (item === null)
          throw notFound('comment_thread_item', input.threadItemId, input.ctx.correlationId);
        const settings =
          typeof item.settings === 'object' && item.settings !== null ? item.settings : {};
        await db.commentThreadItem.updateMany({
          where: { id: item.id, workspaceId: input.ctx.workspaceId },
          data: {
            state: input.state,
            settings: toJson({
              ...settings,
              publication: {
                externalPostId: input.externalPostId,
                permalink: input.permalink,
                publishedAt: input.publishedAt,
                errorCode: input.errorCode,
              },
            }),
          },
        });
      });
    },

    async prepareTargetMedia() {
      return { preparedMediaIds: [], derivativeCount: 0, totalBytes: 0 };
    },
    async scheduleAnalyticsFetches() {
      return { offsetsMs: [60 * 60 * 1000, 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000] };
    },
  };
}
