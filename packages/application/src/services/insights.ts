import { can } from '@relay/authz';
import { newIdFor, type OperationRef } from '@relay/contracts';

import type { ActorContext, ServiceDeps, WorkerActivityContext } from '../types';
import { recordAudit } from '../internal/audit';
import { notFound } from '../internal/errors';
import { authorized, runInWorkspace } from '../internal/runtime';
import {
  buildDigest,
  lastCompletedWeek,
  readLatestDigest,
  sendDigestEmail,
} from './insight-digest';
import {
  readOpenExperiments,
  readPostExperiment,
  tagExperimentRequestSchema,
  tagPostIntoVariant,
} from './insight-experiments';
import { POST_FEEDBACK_PREFIX, readPostFeedback } from './insight-post';
import { readWhatWorks } from './insight-what-works';
import {
  digestSettingsUpdateSchema,
  generateDigestRequestSchema,
  type DigestSettingsView,
  type InsightArgs,
  type InsightService,
  type InsightView,
  type WorkerDigestService,
} from './insights-types';

/**
 * Stored insights: the weekly digest, per-post feedback and "what works for
 * you". One service for every surface, so the API, MCP and CLI read the same
 * rows through the same authorization check.
 */

function kindOf(messageKey: string): string {
  if (messageKey.startsWith(POST_FEEDBACK_PREFIX)) return 'post_feedback';
  if (messageKey.startsWith('digest.')) return 'digest';
  return 'other';
}

function publicArgs(value: unknown): InsightArgs {
  const out: Record<string, string | number | boolean | null> = {};
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return out;
  for (const [key, entry] of Object.entries(value)) {
    if (key.startsWith('_')) continue;
    if (
      entry === null ||
      typeof entry === 'string' ||
      typeof entry === 'number' ||
      typeof entry === 'boolean'
    ) {
      out[key] = entry;
    }
  }
  return out;
}

function workerContext(ctx: WorkerActivityContext): ActorContext {
  return { ...ctx, scopes: [] };
}

export function createInsightService(deps: ServiceDeps): InsightService {
  async function digestSettings(ctx: ActorContext): Promise<DigestSettingsView> {
    return authorized(deps, ctx, 'workspace.read', undefined, async (db, actor) => {
      const row = await db.workspace.findUnique({
        where: { id: ctx.workspaceId },
        select: { weeklyDigestEmailEnabled: true },
      });
      const decision = can(actor.policyActor, 'workspace.update', undefined, {
        workspacePolicy: actor.workspacePolicy,
      });
      return { emailEnabled: row?.weeklyDigestEmailEnabled ?? true, canChange: decision.allowed };
    });
  }

  return {
    latestDigest: (ctx) =>
      authorized(deps, ctx, 'analytics.read', undefined, (db) =>
        readLatestDigest(db, ctx.workspaceId),
      ),

    async generateDigest(ctx, rawInput): Promise<OperationRef> {
      const input = generateDigestRequestSchema.parse(rawInput);
      const createdAt = deps.clock.now().toISOString();
      return authorized(deps, ctx, 'analytics.read', undefined, async (db) => {
        const workspace = await db.workspace.findUnique({
          where: { id: ctx.workspaceId },
          select: { defaultTimeZone: true, weekStart: true },
        });
        const week = lastCompletedWeek(
          deps.clock.now(),
          workspace?.defaultTimeZone ?? 'UTC',
          workspace?.weekStart ?? 1,
        );
        const windowStart = input.windowStart ?? week.windowStart;
        const windowEnd =
          input.windowStart === undefined
            ? week.windowEnd
            : new Date(Date.parse(`${windowStart}T00:00:00Z`) + 6 * 86_400_000)
                .toISOString()
                .slice(0, 10);
        await buildDigest(deps, ctx, db, {
          windowStart,
          windowEnd,
          replaceExisting: input.replaceExisting,
        });
        return {
          operationId: newIdFor('operation'),
          status: 'succeeded',
          resourceType: 'digest',
          resourceId: windowStart,
          createdAt,
          completedAt: deps.clock.now().toISOString(),
          error: null,
        };
      });
    },

    list: (ctx, query) =>
      authorized(deps, ctx, 'analytics.read', undefined, async (db) => {
        const rows = await db.insight.findMany({
          where: {
            workspaceId: ctx.workspaceId,
            ...(query.contentItemId === undefined
              ? { messageKey: { startsWith: POST_FEEDBACK_PREFIX } }
              : { contentItemId: query.contentItemId }),
          },
          orderBy: { createdAt: 'desc' },
          take: 100,
          select: {
            id: true,
            contentItemId: true,
            messageKey: true,
            messageArgs: true,
            evidenceIds: true,
            confidence: true,
            sampleSize: true,
            state: true,
            createdAt: true,
          },
        });
        return rows.map((row): InsightView => ({
          id: row.id,
          kind: kindOf(row.messageKey),
          contentItemId: row.contentItemId,
          messageKey: row.messageKey,
          messageArgs: publicArgs(row.messageArgs),
          evidenceIds: [...row.evidenceIds],
          confidence: row.confidence,
          sampleSize: row.sampleSize,
          state: row.state,
          createdAt: row.createdAt.toISOString(),
        }));
      }),

    postFeedback: (ctx, contentItemId) =>
      authorized(deps, ctx, 'analytics.read', undefined, async (db) => {
        const item = await db.contentItem.findFirst({
          where: { id: contentItemId, workspaceId: ctx.workspaceId },
          select: { id: true },
        });
        if (item === null) {
          throw notFound('content_item', contentItemId, ctx.correlationId);
        }
        return readPostFeedback(db, ctx.workspaceId, contentItemId, deps.clock.now());
      }),

    whatWorks: (ctx) =>
      authorized(deps, ctx, 'analytics.read', undefined, (db) =>
        readWhatWorks(db, ctx.workspaceId, deps.clock.now()),
      ),

    digestSettings,

    postExperiment: (ctx, contentItemId) =>
      authorized(deps, ctx, 'analytics.read', undefined, (db) =>
        readPostExperiment(db, ctx.workspaceId, contentItemId),
      ),

    openExperiments: (ctx) =>
      authorized(deps, ctx, 'analytics.read', undefined, (db) =>
        readOpenExperiments(db, ctx.workspaceId),
      ),

    async tagExperiment(ctx, contentItemId, rawInput) {
      const input = tagExperimentRequestSchema.parse(rawInput);
      return authorized(deps, ctx, 'experiment.write', undefined, async (db, actor) => {
        const item = await db.contentItem.findFirst({
          where: { id: contentItemId, workspaceId: ctx.workspaceId },
          select: { id: true },
        });
        if (item === null) {
          throw notFound('content_item', contentItemId, ctx.correlationId);
        }
        const change = await tagPostIntoVariant(db, ctx.workspaceId, contentItemId, input);
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'experiment',
          targetId: input.experimentId,
          before: { variants: change.before },
          after: { variants: change.after },
          metadata: { contentItemId, variantId: input.variantId },
        });
        return readPostExperiment(db, ctx.workspaceId, contentItemId);
      });
    },

    async updateDigestSettings(ctx, rawInput) {
      const input = digestSettingsUpdateSchema.parse(rawInput);
      await authorized(deps, ctx, 'workspace.update', undefined, async (db, actor) => {
        const before = await db.workspace.findUnique({
          where: { id: ctx.workspaceId },
          select: { weeklyDigestEmailEnabled: true },
        });
        await db.workspace.update({
          where: { id: ctx.workspaceId },
          data: { weeklyDigestEmailEnabled: input.emailEnabled },
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'workspace',
          targetId: ctx.workspaceId,
          before: { weeklyDigestEmailEnabled: before?.weeklyDigestEmailEnabled ?? true },
          after: { weeklyDigestEmailEnabled: input.emailEnabled },
          metadata: { setting: 'weekly_digest_email_enabled' },
        });
      });
      return digestSettings(ctx);
    },
  };
}

/** The digest workflow's activities. System context, no user scopes. */
export function createWorkerDigestService(deps: ServiceDeps): WorkerDigestService {
  return {
    async buildWeeklyDigest(input) {
      const ctx = workerContext(input.ctx);
      const built = await runInWorkspace(deps, ctx, (db) =>
        buildDigest(deps, ctx, db, {
          windowStart: input.windowStart,
          windowEnd: input.windowEnd,
          replaceExisting: input.replaceExisting,
        }),
      );
      return {
        // The digest is always built. Only the email is optional.
        enabled: true,
        stored: built.stored,
        rowCount: built.rowCount,
        source: built.source,
        fallbackReasonKey: built.fallbackReasonKey,
      };
    },

    async sendWeeklyDigestEmail(input) {
      const ctx = workerContext(input.ctx);
      return runInWorkspace(deps, ctx, (db) =>
        sendDigestEmail(deps, ctx, db, {
          windowStart: input.windowStart,
          windowEnd: input.windowEnd,
        }),
      );
    },
  };
}
