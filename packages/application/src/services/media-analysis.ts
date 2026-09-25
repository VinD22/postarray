import { can } from '@relay/authz';
import { ERROR_CODES, RelayError, type MediaDerivativeOperation } from '@relay/contracts';

import type { ActorContext, AiCallMeta, ServiceDeps } from '../types';
import { AI_COST_METER_KEY, assertMonthlyAiBudget } from '../internal/ai-spend';
import { recordAudit } from '../internal/audit';
import { loadCapabilitiesFor } from '../internal/capabilities';
import { notFound } from '../internal/errors';
import { toJson } from '../internal/json';
import { authorized, type Db } from '../internal/runtime';
import {
  contentWarnings,
  cropWarnings,
  ratioTargets,
  summarizeAnalysis,
} from './media-analysis-checks';
import {
  ANALYSIS_LONG_SIDE_PX,
  ANALYSIS_MAX_BYTES,
  MEDIA_UNDERSTANDING_PROMPT_ID,
  MEDIA_UNDERSTANDING_PROMPT_VERSION,
  VISION_TOKENS_PER_IMAGE_CAP,
  aiSettingsUpdateSchema,
  mediaAnalysisChecksRequestSchema,
  mediaAnalysisRequestSchema,
  mediaUnderstandingOutputSchema,
} from './media-analysis-types';
import type {
  AiSettingsView,
  MediaAnalysisBlockReason,
  MediaAnalysisOutcome,
  MediaAnalysisService,
  MediaAnalysisView,
} from './media-analysis-types';
import { createMediaDerivativeService } from './media-derivatives';

/**
 * Image analysis, opt-in per workspace.
 *
 * Analysis only: the model is shown an image the workspace already owns and
 * describes it. Nothing is generated. Four gates hold before a single pixel
 * leaves the product, and each one is checked here rather than trusted from a
 * caller: the workspace turned the feature on, the asset is an image of this
 * workspace, it finished scanning `clean`, and its rights are declared. What
 * is sent is a downscaled JPEG under 1 MB, made by the ordinary non-generative
 * derivative pipeline, never the original upload.
 *
 * One call per asset per prompt version: the result is stored in
 * `app.media_analyses` keyed by the asset checksum, so asking again is a read.
 */

export const MEDIA_ANALYSIS_REASON_KEYS: Readonly<Record<MediaAnalysisBlockReason, string>> = {
  analysis_disabled: 'mediaAnalysis.blocked.disabled',
  ai_unavailable: 'mediaAnalysis.blocked.aiUnavailable',
  not_an_image: 'mediaAnalysis.blocked.notAnImage',
  scan_not_clean: 'mediaAnalysis.blocked.scanNotClean',
  rights_undeclared: 'mediaAnalysis.blocked.rightsUndeclared',
  source_unavailable: 'mediaAnalysis.blocked.sourceUnavailable',
};

export const AI_VISION_INPUT_TOKEN_METER_KEY = 'ai_vision_input_tokens';
const AI_TEXT_INPUT_METER_KEY = 'ai_text_input_tokens';
const AI_TEXT_OUTPUT_METER_KEY = 'ai_text_output_tokens';

const SENDABLE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function blocked(reason: MediaAnalysisBlockReason): MediaAnalysisOutcome {
  return { status: 'blocked', reason, reasonKey: MEDIA_ANALYSIS_REASON_KEYS[reason] };
}

interface AnalysisRow {
  id: string;
  mediaAssetId: string;
  promptId: string;
  promptVersion: string;
  provider: string;
  model: string;
  result: unknown;
  createdAt: Date;
}

const ANALYSIS_SELECT = {
  id: true,
  mediaAssetId: true,
  promptId: true,
  promptVersion: true,
  provider: true,
  model: true,
  result: true,
  createdAt: true,
} as const;

/** Stored rows are data: parsed on read, and a row that no longer parses is ignored. */
function toView(row: AnalysisRow, mediaId: string): MediaAnalysisView | null {
  const parsed = mediaUnderstandingOutputSchema.safeParse(row.result);
  if (!parsed.success) {
    return null;
  }
  return {
    id: row.id,
    mediaId,
    promptId: row.promptId,
    promptVersion: row.promptVersion,
    provider: row.provider,
    model: row.model,
    createdAt: row.createdAt.toISOString(),
    result: parsed.data,
  };
}

async function findStored(db: Db, checksum: string): Promise<AnalysisRow | null> {
  return db.mediaAnalysis.findFirst({
    where: {
      assetChecksumSha256: checksum,
      promptVersion: MEDIA_UNDERSTANDING_PROMPT_VERSION,
    },
    select: ANALYSIS_SELECT,
  });
}

const ASSET_SELECT = {
  id: true,
  kind: true,
  scanState: true,
  rights: true,
  checksumSha256: true,
  mimeType: true,
  byteSize: true,
  width: true,
  height: true,
  storageKey: true,
  storageDeletedAt: true,
} as const;

async function loadAsset(db: Db, mediaId: string, now: Date) {
  const asset = await db.mediaAsset.findFirst({
    where: { id: mediaId, deletedAt: null, retentionExpiresAt: { gt: now } },
    select: ASSET_SELECT,
  });
  if (asset === null) {
    throw notFound('media_asset', mediaId);
  }
  return asset;
}

/** The non-generative operations that make the copy we send: fit 1024, JPEG. */
export function analysisOperations(
  width: number | null,
  height: number | null,
): MediaDerivativeOperation[] {
  const operations: MediaDerivativeOperation[] = [];
  if (width !== null && height !== null && Math.max(width, height) > ANALYSIS_LONG_SIDE_PX) {
    const scale = ANALYSIS_LONG_SIDE_PX / Math.max(width, height);
    operations.push({
      op: 'resize',
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale)),
    });
  }
  operations.push({ op: 'convert', format: 'image/jpeg' }, { op: 'compress', quality: 80 });
  return operations;
}

export function createMediaAnalysisService(deps: ServiceDeps): MediaAnalysisService {
  const derivatives = createMediaDerivativeService(deps);

  async function recordVisionUsage(ctx: ActorContext, meta: AiCallMeta, images: number) {
    const reference = `${ctx.correlationId}:${meta.promptId}:${meta.promptVersion}`;
    const vision = Math.min(meta.inputTokens, images * VISION_TOKENS_PER_IMAGE_CAP);
    const meters: readonly (readonly [string, number])[] = [
      [AI_COST_METER_KEY, meta.costMicros],
      [AI_TEXT_INPUT_METER_KEY, meta.inputTokens - vision],
      [AI_TEXT_OUTPUT_METER_KEY, meta.outputTokens],
      [AI_VISION_INPUT_TOKEN_METER_KEY, vision],
    ];
    await Promise.all(
      meters.map(([key, quantity]) =>
        deps.billing.recordUsage({
          workspaceId: ctx.workspaceId,
          key,
          quantity,
          idempotencyKey: `${key}:${reference}`,
        }),
      ),
    );
  }

  /** Which stored object to send, or why nothing can be sent yet. */
  async function sendableSource(
    ctx: ActorContext,
    asset: Awaited<ReturnType<typeof loadAsset>>,
  ): Promise<
    | {
        readonly kind: 'ready';
        readonly storageKey: string;
        readonly width: number;
        readonly height: number;
        readonly mediaType: 'image/jpeg' | 'image/png' | 'image/webp';
      }
    | { readonly kind: 'outcome'; readonly outcome: MediaAnalysisOutcome }
  > {
    const small =
      asset.width !== null &&
      asset.height !== null &&
      Math.max(asset.width, asset.height) <= ANALYSIS_LONG_SIDE_PX &&
      Number(asset.byteSize) <= ANALYSIS_MAX_BYTES &&
      SENDABLE_TYPES.has(asset.mimeType);
    if (small && asset.width !== null && asset.height !== null) {
      return {
        kind: 'ready',
        storageKey: asset.storageKey,
        width: asset.width,
        height: asset.height,
        mediaType: asset.mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
      };
    }
    const requested = await derivatives.request(ctx, {
      mediaId: asset.id,
      operations: analysisOperations(asset.width, asset.height),
    });
    const made = requested.derivative;
    if (requested.status !== 'ready' || made === null) {
      return {
        kind: 'outcome',
        outcome: { status: 'processing', workflowId: requested.workflowId },
      };
    }
    if (made.byteSize > ANALYSIS_MAX_BYTES || made.width === null || made.height === null) {
      return { kind: 'outcome', outcome: blocked('source_unavailable') };
    }
    return {
      kind: 'ready',
      storageKey: made.storageKey,
      width: made.width,
      height: made.height,
      mediaType: 'image/jpeg',
    };
  }

  async function settingsView(ctx: ActorContext): Promise<AiSettingsView> {
    return authorized(deps, ctx, 'workspace.read', undefined, async (db, actor) => {
      const row = await db.workspace.findUnique({
        where: { id: ctx.workspaceId },
        select: { aiImageAnalysisEnabled: true },
      });
      const decision = can(actor.policyActor, 'workspace.update', undefined, {
        workspacePolicy: actor.workspacePolicy,
      });
      return {
        imageAnalysisEnabled: row?.aiImageAnalysisEnabled ?? false,
        canChange: decision.allowed,
      };
    });
  }

  const service: MediaAnalysisService = {
    settings: settingsView,

    async updateSettings(ctx, rawInput) {
      const input = aiSettingsUpdateSchema.parse(rawInput);
      await authorized(deps, ctx, 'workspace.update', undefined, async (db, actor) => {
        const before = await db.workspace.findUnique({
          where: { id: ctx.workspaceId },
          select: { aiImageAnalysisEnabled: true },
        });
        await db.workspace.update({
          where: { id: ctx.workspaceId },
          data: { aiImageAnalysisEnabled: input.imageAnalysisEnabled },
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'workspace',
          targetId: ctx.workspaceId,
          before: { aiImageAnalysisEnabled: before?.aiImageAnalysisEnabled ?? false },
          after: { aiImageAnalysisEnabled: input.imageAnalysisEnabled },
          metadata: { setting: 'ai_image_analysis_enabled', generative: false },
        });
      });
      return settingsView(ctx);
    },

    async analyze(ctx, rawInput) {
      const input = mediaAnalysisRequestSchema.parse(rawInput);
      const now = deps.clock.now();

      const gate = await authorized(deps, ctx, 'media.write', undefined, async (db) => {
        const workspace = await db.workspace.findUnique({
          where: { id: ctx.workspaceId },
          select: { aiImageAnalysisEnabled: true },
        });
        if (workspace?.aiImageAnalysisEnabled !== true) {
          return { kind: 'stop', outcome: blocked('analysis_disabled') } as const;
        }
        const asset = await loadAsset(db, input.mediaId, now);
        if (asset.storageDeletedAt !== null) {
          return { kind: 'stop', outcome: blocked('source_unavailable') } as const;
        }
        if (asset.kind !== 'image') {
          return { kind: 'stop', outcome: blocked('not_an_image') } as const;
        }
        if (asset.scanState !== 'clean') {
          return { kind: 'stop', outcome: blocked('scan_not_clean') } as const;
        }
        if (asset.rights === 'unverified') {
          return { kind: 'stop', outcome: blocked('rights_undeclared') } as const;
        }
        const stored = await findStored(db, asset.checksumSha256);
        const view = stored === null ? null : toView(stored, asset.id);
        if (view !== null) {
          return {
            kind: 'stop',
            outcome: { status: 'ready', analysis: view } as MediaAnalysisOutcome,
          } as const;
        }
        if (!deps.ai.isAvailable()) {
          return { kind: 'stop', outcome: blocked('ai_unavailable') } as const;
        }
        await assertMonthlyAiBudget(deps, ctx, db);
        return { kind: 'go', asset } as const;
      });
      if (gate.kind === 'stop') {
        return gate.outcome;
      }
      const asset = gate.asset;

      const source = await sendableSource(ctx, asset);
      if (source.kind === 'outcome') {
        return source.outcome;
      }
      const bytes = await deps.storage.read(source.storageKey);
      if (bytes.byteLength > ANALYSIS_MAX_BYTES) {
        return blocked('source_unavailable');
      }

      let result;
      try {
        result = await deps.ai.completeStructured(mediaUnderstandingOutputSchema, {
          context: {
            workspaceId: ctx.workspaceId,
            projectId: null,
            locale: ctx.locale,
            contentLanguage: null,
            correlationId: ctx.correlationId,
          },
          promptId: MEDIA_UNDERSTANDING_PROMPT_ID,
          variables: { language: ctx.locale, width: source.width, height: source.height },
          images: [
            {
              id: `media:${asset.id}`,
              label: 'Image attached by the user',
              mediaType: source.mediaType,
              dataBase64: Buffer.from(bytes).toString('base64'),
              retrievedAt: now.toISOString(),
            },
          ],
        });
      } catch (error) {
        if (RelayError.is(error) && error.code === ERROR_CODES.AI_UNAVAILABLE) {
          return blocked('ai_unavailable');
        }
        throw error;
      }
      await recordVisionUsage(ctx, result.meta, 1);

      const saved = await authorized(deps, ctx, 'media.write', undefined, async (db, actor) => {
        const raced = await findStored(db, asset.checksumSha256);
        if (raced !== null) {
          return raced;
        }
        const created = await db.mediaAnalysis.create({
          data: {
            workspaceId: ctx.workspaceId,
            mediaAssetId: asset.id,
            assetChecksumSha256: asset.checksumSha256,
            promptId: result.meta.promptId,
            promptVersion: result.meta.promptVersion,
            provider: result.meta.provider,
            model: result.meta.model,
            result: toJson(result.output),
            inputTokens: result.meta.inputTokens,
            outputTokens: result.meta.outputTokens,
            costMicros: BigInt(result.meta.costMicros),
            createdByUserId: actor.userId,
          },
          select: ANALYSIS_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'media_analysis',
          targetId: created.id,
          after: { mediaAssetId: asset.id, promptVersion: created.promptVersion },
          metadata: { model: created.model, generative: false },
        });
        return created;
      });
      const view = toView(saved, asset.id);
      return view === null ? blocked('ai_unavailable') : { status: 'ready', analysis: view };
    },

    async get(ctx, mediaId) {
      return authorized(deps, ctx, 'media.read', undefined, async (db) => {
        const asset = await loadAsset(db, mediaId, deps.clock.now());
        const stored = await findStored(db, asset.checksumSha256);
        return stored === null ? null : toView(stored, asset.id);
      });
    },

    async checks(ctx, rawInput) {
      const input = mediaAnalysisChecksRequestSchema.parse(rawInput);
      // A stored analysis is a read: any member with media.read sees its
      // checks. Only a missing analysis falls through to `analyze`, which
      // keeps its own media.write gate, so a viewer never triggers a call.
      const stored = await service.get(ctx, input.mediaId);
      const outcome: MediaAnalysisOutcome =
        stored === null
          ? await service.analyze(ctx, { mediaId: input.mediaId })
          : { status: 'ready', analysis: stored };
      if (outcome.status !== 'ready') {
        return outcome;
      }
      const context = await authorized(deps, ctx, 'media.read', undefined, async (db) => {
        const asset = await loadAsset(db, input.mediaId, deps.clock.now());
        const capabilities = await loadCapabilitiesFor(db, deps, input.connectionIds);
        return {
          width: asset.width,
          height: asset.height,
          entries: [...capabilities.values()].map((entry) => ({
            connectionId: entry.connectionId,
            ratios: entry.snapshot?.media.aspectRatios.recommended ?? [],
          })),
        };
      });
      const analysis = outcome.analysis.result;
      const warnings = [
        ...(context.width === null || context.height === null
          ? []
          : cropWarnings(
              analysis,
              { width: context.width, height: context.height },
              ratioTargets(context.entries),
            )),
        ...contentWarnings(analysis),
      ];
      return { status: 'ready', analysisId: outcome.analysis.id, warnings };
    },

    async summariesFor(ctx, mediaIds) {
      if (mediaIds.length === 0) {
        return [];
      }
      return authorized(deps, ctx, 'media.read', undefined, async (db) => {
        const assets = await db.mediaAsset.findMany({
          where: { id: { in: [...mediaIds] }, scanState: 'clean', deletedAt: null },
          select: { id: true, checksumSha256: true },
        });
        const summaries: { mediaId: string; summary: string }[] = [];
        for (const asset of assets) {
          const stored = await findStored(db, asset.checksumSha256);
          const view = stored === null ? null : toView(stored, asset.id);
          if (view !== null) {
            summaries.push({ mediaId: asset.id, summary: summarizeAnalysis(view.result) });
          }
        }
        return summaries;
      });
    },
  };
  return service;
}
