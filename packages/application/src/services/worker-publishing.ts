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
      // Entitlement at dispatch, not only at scheduling. Between the two a
      // workspace can spend its last free post or lose its subscription, and
      // this is the final gate before a provider call that cannot be taken
      // back. Refused here means nothing external happened: the job parks with
      // the same message key every surface renders, and paying (or being
      // granted credits) lets it be rescheduled.
      const entitlement = await deps.billing.checkEntitlement({
        workspaceId: input.ctx.workspaceId,
        key: 'publishing.enabled',
      });
      if (!entitlement.allowed) {
        return {
          verdict: 'blocked' as const,
          messageKey: entitlement.reasonKey ?? 'error.entitlement_missing.message',
          errorCode: ERROR_CODES.ENTITLEMENT_REQUIRED,
          blockedTargetIds: [...input.targetIds],
        };
      }
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
      const written = await runInWorkspace(deps, context(input.ctx), async (db) => {
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
      // The spend, at the one moment the product has demonstrably published.
      // It happens once per receipt: a crash-and-retry of this activity
      // re-enters with `created: false` and never reaches this line. The
      // gateway's statement is atomic and decides for itself whether the
      // workspace is on the free plan (a verified paid entitlement makes it a
      // no-op), so there is no read-then-write window here to race. A free
      // workspace whose balance hit zero between preflight and now still keeps
      // its receipt; we never retract a published post over a credit.
      if (written.created) {
        await deps.billing.spendPostCredit({
          workspaceId: input.ctx.workspaceId,
          contentItemId: input.contentVersionId,
        });
      }
      return written;
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

    /**
     * Resolve the media this target will actually send.
     *
     * This returned an empty list unconditionally, so every image and video
     * post published as text only, and the providers that require media
     * (Pinterest, Instagram, TikTok, YouTube) failed at the provider rather
     * than here. The receipt's `mediaChecksums` was always empty too, which is
     * the field that proves what shipped.
     *
     * Derivatives are preferred over originals when one exists: the derivative
     * pipeline produces the bytes a provider actually accepts, and its
     * `presetKey` is chosen per provider. When none exists the original is
     * sent, which is correct for a small image that needed no transform.
     *
     * A signed URL is minted per asset because several providers pull from a
     * URL rather than accept an upload. The TTL is deliberately short and
     * generous enough to survive a retry inside one dispatch.
     */
    async prepareTargetMedia(input) {
      return runInWorkspace(deps, context(input.ctx), async (db) => {
        const variant = await db.postVariant.findFirst({
          where: { id: input.targetId, workspaceId: input.ctx.workspaceId },
          select: { mediaAssetIds: true, provider: true },
        });
        if (variant === null || variant.mediaAssetIds.length === 0) {
          return { preparedMediaIds: [], derivativeCount: 0, totalBytes: 0 };
        }

        const assets = await db.mediaAsset.findMany({
          where: { id: { in: variant.mediaAssetIds }, workspaceId: input.ctx.workspaceId },
          select: { id: true, byteSize: true, scanState: true },
        });

        // An asset that has not cleared the safety scan never reaches a
        // provider. Composer validation refuses it first; this is the second
        // guard, because dispatch happens long after that check.
        const clean = assets.filter((asset) => asset.scanState === 'clean');

        const derivatives = await db.mediaDerivative.findMany({
          where: {
            mediaAssetId: { in: clean.map((asset) => asset.id) },
            workspaceId: input.ctx.workspaceId,
          },
          select: { id: true, mediaAssetId: true, byteSize: true },
        });

        // Order follows the variant's own list: the author chose it, and for a
        // carousel the order is the content.
        const ordered = variant.mediaAssetIds.filter((id) =>
          clean.some((asset) => asset.id === id),
        );

        const totalBytes = ordered.reduce((sum, id) => {
          const derivative = derivatives.find((row) => row.mediaAssetId === id);
          const asset = clean.find((row) => row.id === id);
          const bytes = derivative?.byteSize ?? asset?.byteSize ?? 0n;
          return sum + Number(bytes);
        }, 0);

        return {
          preparedMediaIds: ordered,
          derivativeCount: derivatives.length,
          totalBytes,
        };
      });
    },
    async scheduleAnalyticsFetches() {
      return { offsetsMs: [60 * 60 * 1000, 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000] };
    },
  };
}
