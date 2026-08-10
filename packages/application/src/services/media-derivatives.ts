import {
  ConflictError,
  mediaDerivativePresetKey,
  planMediaDerivative,
  type MediaDerivativeOperation,
} from '@relay/contracts';

import {
  produceDerivative,
  type DerivativeStore,
} from './media-derivative-pipeline';

import type {
  ActorContext,
  MediaDerivativeRequest,
  MediaDerivativeService,
  MediaDerivativeView,
  ServiceDeps,
  WorkflowActorContext,
  WorkerMediaService,
} from '../types';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { toJson } from '../internal/json';
import { authorized, runInWorkspace, type Db } from '../internal/runtime';

/**
 * Media derivatives.
 *
 * The original is never overwritten. An edit produces a second stored object
 * with its own checksum, its own dimensions and its own row, and the source
 * asset row is not touched at all, which is what makes "show me the original"
 * a fact rather than a promise.
 *
 * Idempotency is the database's job. The preset key is a checksum over the
 * canonical operation list, and `(media_asset_id, preset_key)` is unique, so
 * asking twice for the same crop returns the row that already exists and
 * reprocesses nothing. Nothing here needs a lock or a dedupe table.
 *
 * A row is written only after the bytes exist. A failed transform leaves no
 * row, because a row is a claim that a file is there, and a claim that is not
 * true is worse than a missing one.
 *
 * The pixel work itself is injected as `MediaTransformFn`. That seam exists so
 * the codec lives in the worker and never becomes a dependency of the API or
 * the web app, and it is also the reason "no generative provider is invoked" is
 * testable: this module makes exactly one call out, and its input carries
 * geometry and a MIME type. There is no field a prompt, a model or a seed could
 * travel in.
 */

const DERIVATIVE_SELECT = {
  id: true,
  workspaceId: true,
  mediaAssetId: true,
  kind: true,
  presetKey: true,
  storageKey: true,
  mimeType: true,
  byteSize: true,
  checksumSha256: true,
  width: true,
  height: true,
  metadata: true,
  createdAt: true,
} as const;

interface DerivativeRow {
  id: string;
  workspaceId: string;
  mediaAssetId: string;
  kind: string;
  presetKey: string;
  storageKey: string;
  mimeType: string;
  byteSize: bigint;
  checksumSha256: string;
  width: number | null;
  height: number | null;
  metadata: unknown;
  createdAt: Date;
}

function operationsFrom(metadata: unknown): readonly MediaDerivativeOperation[] {
  if (typeof metadata !== 'object' || metadata === null) {
    return [];
  }
  const value: unknown = Reflect.get(metadata, 'operations');
  return Array.isArray(value) ? (value as readonly MediaDerivativeOperation[]) : [];
}

export function toDerivativeView(row: DerivativeRow): MediaDerivativeView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    mediaAssetId: row.mediaAssetId,
    kind: row.kind as MediaDerivativeView['kind'],
    presetKey: row.presetKey,
    storageKey: row.storageKey,
    mimeType: row.mimeType,
    byteSize: Number(row.byteSize),
    checksumSha256: row.checksumSha256,
    width: row.width,
    height: row.height,
    operations: operationsFrom(row.metadata),
    createdAt: row.createdAt.toISOString(),
  };
}

interface SourceRow {
  id: string;
  storageKey: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  scanState: string;
  storageDeletedAt: Date | null;
}

const SOURCE_SELECT = {
  id: true,
  storageKey: true,
  mimeType: true,
  width: true,
  height: true,
  scanState: true,
  storageDeletedAt: true,
} as const;

async function requireSource(db: Db, mediaId: string, now: Date): Promise<SourceRow> {
  const row = await db.mediaAsset.findFirst({
    where: { id: mediaId, deletedAt: null, retentionExpiresAt: { gt: now } },
    select: SOURCE_SELECT,
  });
  if (row === null) {
    throw notFound('media_asset', mediaId);
  }
  if (row.storageDeletedAt !== null) {
    throw invalid('errors.media_derivative_source_unavailable', { mediaId });
  }
  return row;
}

async function findByPreset(
  db: Db,
  mediaAssetId: string,
  presetKey: string,
): Promise<DerivativeRow | null> {
  return db.mediaDerivative.findFirst({
    where: { mediaAssetId, presetKey },
    select: DERIVATIVE_SELECT,
  });
}

/**
 * Deterministic per asset and preset, so a duplicated request joins the run
 * that already exists instead of starting a second one. The preset key is
 * shortened only for readability; it is still 96 bits of a SHA-256 and the
 * unique constraint, not this string, is what enforces uniqueness.
 */
export function mediaDerivativeWorkflowId(
  workspaceId: string,
  mediaAssetId: string,
  presetKey: string,
): string {
  return `mder:${workspaceId}:${mediaAssetId}:${presetKey.slice(0, 24)}`;
}

export function createMediaDerivativeService(deps: ServiceDeps): MediaDerivativeService {
  return {
    async request(
      ctx: ActorContext,
      input: { mediaId: string; operations: readonly MediaDerivativeOperation[] },
    ): Promise<MediaDerivativeRequest> {
      const prepared = await authorized(deps, ctx, 'media.write', undefined, async (db) => {
        const source = await requireSource(db, input.mediaId, deps.clock.now());
        // Validate against the file this will actually run on, while the person
        // who asked is still here to read the answer.
        const plan = planMediaDerivative(
          { mimeType: source.mimeType, width: source.width, height: source.height },
          input.operations,
        );
        const presetKey = await mediaDerivativePresetKey(plan.operations);
        const existing = await findByPreset(db, source.id, presetKey);
        return { plan, presetKey, existing, sourceMimeType: source.mimeType };
      });

      if (prepared.existing !== null) {
        // The unique constraint already did the work. Nothing is reprocessed.
        return {
          mediaId: input.mediaId,
          presetKey: prepared.presetKey,
          status: 'ready',
          derivative: toDerivativeView(prepared.existing),
          operations: prepared.plan.operations,
          projectedWidth: prepared.plan.width,
          projectedHeight: prepared.plan.height,
          targetMimeType: prepared.plan.targetMimeType,
          workflowId: null,
        };
      }

      const started = await deps.scheduler.scheduleMediaDerivative?.({
        workspaceId: ctx.workspaceId,
        mediaAssetId: input.mediaId,
        presetKey: prepared.presetKey,
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
          mediaAssetId: input.mediaId,
          presetKey: prepared.presetKey,
          operations: prepared.plan.operations,
        },
      });

      return {
        mediaId: input.mediaId,
        presetKey: prepared.presetKey,
        status: 'processing',
        derivative: null,
        operations: prepared.plan.operations,
        projectedWidth: prepared.plan.width,
        projectedHeight: prepared.plan.height,
        targetMimeType: prepared.plan.targetMimeType,
        workflowId: started?.workflowId ?? null,
      };
    },

    async list(ctx: ActorContext, mediaId: string): Promise<readonly MediaDerivativeView[]> {
      return authorized(deps, ctx, 'media.read', undefined, async (db) => {
        await requireSource(db, mediaId, deps.clock.now());
        const rows = await db.mediaDerivative.findMany({
          where: { mediaAssetId: mediaId },
          orderBy: { id: 'asc' },
          select: DERIVATIVE_SELECT,
        });
        return rows.map(toDerivativeView);
      });
    },

    async get(ctx: ActorContext, derivativeId: string): Promise<MediaDerivativeView> {
      return authorized(deps, ctx, 'media.read', undefined, async (db) => {
        const row = await db.mediaDerivative.findFirst({
          where: { id: derivativeId },
          select: DERIVATIVE_SELECT,
        });
        if (row === null) {
          throw notFound('media_derivative', derivativeId);
        }
        return toDerivativeView(row);
      });
    },
  };
}


function workerContext(ctx: WorkflowActorContext): ActorContext {
  return { ...ctx, scopes: [], actorType: ctx.actorType };
}

/**
 * The worker-facing half.
 *
 * It supplies the pipeline with a Postgres-backed store and the workspace's
 * storage, and nothing else. Every decision, including the one that makes a
 * repeated request free, lives in `media-derivative-pipeline.ts`, which is why
 * that file is the one the tests point at.
 */
export function createWorkerMediaService(deps: ServiceDeps): WorkerMediaService {
  return {
    async produceDerivative(ctx, input, transform): Promise<MediaDerivativeView> {
      const actorContext = workerContext(ctx);

      const store: DerivativeStore = {
        findByPreset: (mediaAssetId, presetKey) =>
          runInWorkspace(deps, actorContext, async (db) => {
            const row = await findByPreset(db, mediaAssetId, presetKey);
            return row === null ? null : toDerivativeView(row);
          }),

        loadSource: (mediaAssetId) =>
          runInWorkspace(deps, actorContext, async (db) => {
            const row = await requireSource(db, mediaAssetId, deps.clock.now());
            return {
              id: row.id,
              storageKey: row.storageKey,
              mimeType: row.mimeType,
              width: row.width,
              height: row.height,
            };
          }),

        insert: (row) =>
          runInWorkspace(deps, actorContext, async (db, actor) => {
            // A concurrent run may have won between the read and this write.
            // The object is content addressed, so the loser adopts the row that
            // exists rather than creating a second one.
            const raced = await findByPreset(db, row.mediaAssetId, row.presetKey);
            if (raced !== null) {
              return toDerivativeView(raced);
            }
            let created: DerivativeRow;
            try {
              created = await db.mediaDerivative.create({
                data: {
                  workspaceId: ctx.workspaceId,
                  mediaAssetId: row.mediaAssetId,
                  kind: row.kind,
                  presetKey: row.presetKey,
                  storageBucket: deps.config.neon.storageBucket,
                  storageKey: row.storageKey,
                  mimeType: row.mimeType,
                  byteSize: BigInt(row.byteSize),
                  checksumSha256: row.checksumSha256,
                  width: row.width,
                  height: row.height,
                  metadata: toJson({ operations: row.operations }),
                },
                select: DERIVATIVE_SELECT,
              });
            } catch (cause: unknown) {
              const settled = await findByPreset(db, row.mediaAssetId, row.presetKey);
              if (settled === null) {
                throw new ConflictError({
                  messageKey: 'errors.media_derivative_write_failed',
                  details: { mediaAssetId: row.mediaAssetId },
                  cause,
                });
              }
              return toDerivativeView(settled);
            }

            await recordAudit(db, actor, {
              action: 'workspace.updated',
              targetType: 'media_derivative',
              targetId: created.id,
              after: {
                mediaAssetId: row.mediaAssetId,
                presetKey: row.presetKey,
                checksum: row.checksumSha256,
                byteSize: row.byteSize,
              },
              metadata: { operationCount: row.operations.length, generative: false },
            });
            return toDerivativeView(created);
          }),
      };

      const outcome = await produceDerivative(
        { store, storage: deps.storage, workspaceId: ctx.workspaceId },
        input,
        transform,
      );
      return outcome.derivative;
    },
  };
}
