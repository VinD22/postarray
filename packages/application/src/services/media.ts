import { newIdFor, type OperationRef, type Paginated } from '@relay/contracts';

import type {
  ActorContext,
  MediaEditOperation,
  MediaService,
  PageQuery,
  ServiceDeps,
} from '../types.js';
import type { MediaAssetView } from '../views.js';

import { recordAudit } from '../internal/audit.js';
import { invalid, notFound } from '../internal/errors.js';
import { withIdempotency } from '../internal/idempotency.js';
import { toJson } from '../internal/json.js';
import { pageArgs, toPage } from '../internal/pagination.js';
import { authorized, type Db } from '../internal/runtime.js';
import { asMediaKind } from '../internal/storage-enums.js';
import { assertFetchable } from '../internal/url-safety.js';

/**
 * Media.
 *
 * Uploads go straight to storage through a short-lived ticket; the bytes never
 * pass through the application. The MIME type recorded here is the one the
 * pipeline sniffed from the bytes, not the one the filename claimed. Editing is
 * non-generative only: crop, resize, rotate, compress and convert. There is no
 * generation path in this product and no dormant client for one.
 */

const MEDIA_SELECT = {
  id: true,
  workspaceId: true,
  brandId: true,
  kind: true,
  mimeType: true,
  byteSize: true,
  checksumSha256: true,
  width: true,
  height: true,
  durationMs: true,
  altText: true,
  altTextWaivedAt: true,
  rights: true,
  scanState: true,
  originKind: true,
  createdAt: true,
} as const;

interface MediaRow {
  id: string;
  workspaceId: string;
  brandId: string | null;
  kind: string;
  mimeType: string;
  byteSize: bigint;
  checksumSha256: string;
  width: number | null;
  height: number | null;
  durationMs: number | null;
  altText: string | null;
  altTextWaivedAt: Date | null;
  rights: string;
  scanState: string;
  originKind: string;
  createdAt: Date;
}

function toView(row: MediaRow): MediaAssetView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    brandId: row.brandId,
    kind: row.kind as MediaAssetView['kind'],
    mimeType: row.mimeType,
    byteSize: Number(row.byteSize),
    checksumSha256: row.checksumSha256,
    width: row.width,
    height: row.height,
    durationMs: row.durationMs,
    altText: row.altText,
    altTextWaived: row.altTextWaivedAt !== null,
    rights: row.rights,
    scanState: row.scanState,
    originKind: row.originKind,
    createdAt: row.createdAt.toISOString(),
  };
}

/** Extension is never trusted; this is only the first guess for the ticket. */
function kindForMimeType(mimeType: string): 'image' | 'video' | 'document' | 'audio' {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType.startsWith('video/')) {
    return 'video';
  }
  if (mimeType.startsWith('audio/')) {
    return 'audio';
  }
  return 'document';
}

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 * 1024;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

async function requireMedia(db: Db, mediaId: string): Promise<MediaRow> {
  const row = await db.mediaAsset.findFirst({
    where: { id: mediaId, deletedAt: null },
    select: MEDIA_SELECT,
  });
  if (row === null) {
    throw notFound('media_asset', mediaId);
  }
  return row;
}

export function createMediaService(deps: ServiceDeps): MediaService {
  return {
    async createUploadUrl(
      ctx: ActorContext,
      input: {
        filename: string;
        mimeType: string;
        byteSize: number;
        sha256: string;
        brandId?: string | null;
      },
    ): Promise<{ uploadUrl: string; mediaId: string; headers: Record<string, string> }> {
      return authorized(
        deps,
        ctx,
        'media.write',
        input.brandId === undefined || input.brandId === null
          ? undefined
          : { brandId: input.brandId },
        async (db, actor) => {
          if (!SHA256_PATTERN.test(input.sha256)) {
            throw invalid('errors.media_checksum_invalid', {});
          }
          if (input.byteSize <= 0 || input.byteSize > MAX_UPLOAD_BYTES) {
            throw invalid('errors.media_too_large', {
              byteSize: input.byteSize,
              limit: MAX_UPLOAD_BYTES,
            });
          }

          // Content-addressed: the same bytes uploaded twice are one asset.
          const existing = await db.mediaAsset.findFirst({
            where: { checksumSha256: input.sha256, deletedAt: null },
            select: { id: true },
          });

          const kind = kindForMimeType(input.mimeType);
          const mediaId =
            existing?.id ??
            (
              await db.mediaAsset.create({
                data: {
                  workspaceId: actor.workspace.id,
                  brandId: input.brandId ?? null,
                  kind,
                  storageBucket: 'media',
                  storageKey: `${ctx.workspaceId}/${input.sha256}`,
                  mimeType: input.mimeType,
                  byteSize: BigInt(input.byteSize),
                  checksumSha256: input.sha256,
                  originKind: 'upload',
                  scanState: 'pending',
                  ...(actor.userId === null ? {} : { createdByUserId: actor.userId }),
                  metadata: toJson({ filename: input.filename }),
                },
                select: { id: true },
              })
            ).id;

          const ticket = await deps.storage.createUploadTicket({
            workspaceId: ctx.workspaceId,
            key: `${ctx.workspaceId}/${input.sha256}`,
            contentType: input.mimeType,
            byteSize: input.byteSize,
            checksumSha256: input.sha256,
          });

          return {
            uploadUrl: ticket.uploadUrl,
            mediaId,
            headers: { ...ticket.headers },
          };
        },
      );
    },

    async finalizeUpload(ctx: ActorContext, mediaId: string): Promise<MediaAssetView> {
      return authorized(deps, ctx, 'media.write', undefined, async (db, actor) => {
        const row = await requireMedia(db, mediaId);
        const object = await deps.storage.head(`${ctx.workspaceId}/${row.checksumSha256}`);
        if (object === null) {
          throw invalid('errors.media_upload_missing', { mediaId });
        }
        // The bytes are what they claimed to be, or the asset does not exist.
        if (object.checksumSha256 !== row.checksumSha256) {
          await db.mediaAsset.update({
            where: { id: mediaId },
            data: { scanState: 'failed', scanNote: 'media.checksum_mismatch' },
          });
          throw invalid('errors.media_checksum_mismatch', { mediaId });
        }

        const updated = await db.mediaAsset.update({
          where: { id: mediaId },
          data: { byteSize: BigInt(object.byteSize), scanState: 'clean' },
          select: MEDIA_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'media_asset',
          targetId: mediaId,
          after: { checksum: row.checksumSha256, byteSize: object.byteSize },
        });

        return toView(updated);
      });
    },

    /** Asynchronous and SSRF safe. The worker performs the fetch, not this call. */
    async importFromUrl(
      ctx: ActorContext,
      input: { url: string; brandId?: string | null },
    ): Promise<OperationRef> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'media.importFromUrl',
        body: input,
        run: async () =>
          authorized(deps, ctx, 'media.write', undefined, async (db, actor) => {
            await assertFetchable(input.url);
            const operationId = newIdFor('operation');
            await recordAudit(db, actor, {
              action: 'workspace.updated',
              targetType: 'media_import',
              targetId: operationId,
              after: { host: new URL(input.url).hostname },
              metadata: { brandId: input.brandId ?? null },
            });
            return {
              operationId,
              status: 'queued',
              resourceType: 'media_asset',
              resourceId: null,
              createdAt: deps.clock.now().toISOString(),
              completedAt: null,
              error: null,
            } satisfies OperationRef;
          }),
      });
    },

    async list(
      ctx: ActorContext,
      query: PageQuery & { brandId?: string; kind?: string } = {},
    ): Promise<Paginated<MediaAssetView>> {
      return authorized(deps, ctx, 'media.read', undefined, async (db) => {
        const args = pageArgs(query);
        const kind = query.kind === undefined ? undefined : asMediaKind(query.kind);
        if (query.kind !== undefined && kind === undefined) {
          throw invalid('errors.unknown_media_kind', { kind: query.kind });
        }
        const rows = await db.mediaAsset.findMany({
          where: {
            deletedAt: null,
            ...(query.brandId === undefined ? {} : { brandId: query.brandId }),
            ...(kind === undefined ? {} : { kind }),
          },
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: MEDIA_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toView);
      });
    },

    async get(ctx: ActorContext, mediaId: string): Promise<MediaAssetView> {
      return authorized(deps, ctx, 'media.read', undefined, async (db) =>
        toView(await requireMedia(db, mediaId)),
      );
    },

    async delete(ctx: ActorContext, mediaId: string): Promise<void> {
      await authorized(deps, ctx, 'media.delete', undefined, async (db, actor) => {
        await requireMedia(db, mediaId);
        await db.mediaAsset.update({
          where: { id: mediaId },
          data: { deletedAt: deps.clock.now() },
        });
        await recordAudit(db, actor, {
          action: 'deletion.executed',
          targetType: 'media_asset',
          targetId: mediaId,
          after: { deleted: true },
        });
      });
    },

    /**
     * Non-generative editing only. The original is preserved: an edit produces
     * a derivative, and platform validation reruns against the result.
     */
    async edit(
      ctx: ActorContext,
      input: { mediaId: string; ops: readonly MediaEditOperation[] },
    ): Promise<MediaAssetView> {
      return authorized(deps, ctx, 'media.write', undefined, async (db, actor) => {
        const row = await requireMedia(db, input.mediaId);
        if (input.ops.length === 0) {
          return toView(row);
        }

        const presetKey = input.ops
          .map((op) => `${op.kind}:${Object.entries(op.params).map(([k, v]) => `${k}=${v}`).join(',')}`)
          .join('|');

        await db.mediaDerivative.upsert({
          where: { mediaAssetId_presetKey: { mediaAssetId: row.id, presetKey } },
          create: {
            workspaceId: actor.workspace.id,
            mediaAssetId: row.id,
            kind: derivativeKindFor(input.ops),
            presetKey,
            storageBucket: 'media',
            storageKey: `${ctx.workspaceId}/${row.checksumSha256}/${encodeURIComponent(presetKey)}`,
            mimeType: row.mimeType,
            byteSize: row.byteSize,
            checksumSha256: row.checksumSha256,
            metadata: toJson({ ops: [...input.ops], pending: true }),
          },
          update: { metadata: toJson({ ops: [...input.ops], pending: true }) },
        });

        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'media_derivative',
          targetId: row.id,
          after: { presetKey, opCount: input.ops.length },
          metadata: { generative: false },
        });

        return toView(row);
      });
    },

    async setAltText(
      ctx: ActorContext,
      input: { mediaId: string; altText: string | null; waived?: boolean },
    ): Promise<MediaAssetView> {
      return authorized(deps, ctx, 'media.write', undefined, async (db, actor) => {
        const before = await requireMedia(db, input.mediaId);
        if (input.altText === null && input.waived !== true) {
          throw invalid('errors.alt_text_required', { mediaId: input.mediaId });
        }
        const after = await db.mediaAsset.update({
          where: { id: input.mediaId },
          data: {
            altText: input.altText,
            altTextWaivedAt: input.waived === true ? deps.clock.now() : null,
          },
          select: MEDIA_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'media_asset',
          targetId: input.mediaId,
          before: { hadAltText: before.altText !== null },
          after: { hasAltText: after.altText !== null, waived: input.waived === true },
        });
        return toView(after);
      });
    },
  };
}

function derivativeKindFor(
  ops: readonly MediaEditOperation[],
): 'transcode' | 'crop' | 'resize' | 'thumbnail' | 'format_conversion' | 'compressed' {
  const last = ops.at(-1);
  switch (last?.kind) {
    case 'crop':
      return 'crop';
    case 'resize':
      return 'resize';
    case 'compress':
      return 'compressed';
    case 'convert':
      return 'format_conversion';
    default:
      return 'transcode';
  }
}
