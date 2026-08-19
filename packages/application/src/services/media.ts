import {
  CapabilityNotImplementedError,
  ForbiddenError,
  IMAGE_UPLOAD_LIMIT_BYTES,
  MEDIA_RETENTION_DAYS,
  VIDEO_UPLOAD_LIMIT_BYTES,
  newIdFor,
  type MediaDerivativeOperation,
  type OperationRef,
  type Paginated,
} from '@relay/contracts';
import { safeFetch } from '@relay/connectors';
import { z } from 'zod';

import type {
  ActorContext,
  MediaDerivativeRequest,
  MediaDerivativeView,
  MediaService,
  PageQuery,
  ServiceDeps,
} from '../types';
import type { MediaAssetView } from '../views';

import { recordAudit } from '../internal/audit';
import { requireProjectOwnershipIfPresent } from '../internal/project-ownership';
import { invalid, notFound } from '../internal/errors';
import { toJson } from '../internal/json';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';
import { asMediaKind } from '../internal/storage-enums';
import { withIdempotency } from '../internal/idempotency';
import { LocalFileStorage } from '../ports/storage';
import { fetchAndStoreRemoteMedia } from './media-import';
import { createMediaDerivativeService } from './media-derivatives';

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
  projectId: true,
  kind: true,
  mimeType: true,
  byteSize: true,
  checksumSha256: true,
  width: true,
  height: true,
  durationMs: true,
  altText: true,
  altTextWaivedAt: true,
  altTextWaivedReason: true,
  altTextWaivedByName: true,
  rights: true,
  rightsNote: true,
  scanState: true,
  originKind: true,
  originUrl: true,
  metadata: true,
  retentionExpiresAt: true,
  storageDeletedAt: true,
  createdAt: true,
} as const;

interface MediaRow {
  id: string;
  workspaceId: string;
  projectId: string | null;
  kind: string;
  mimeType: string;
  byteSize: bigint;
  checksumSha256: string;
  width: number | null;
  height: number | null;
  durationMs: number | null;
  altText: string | null;
  altTextWaivedAt: Date | null;
  altTextWaivedReason: string | null;
  altTextWaivedByName: string | null;
  rights: string;
  rightsNote: string | null;
  scanState: string;
  originKind: string;
  originUrl: string | null;
  metadata: unknown;
  retentionExpiresAt: Date;
  storageDeletedAt: Date | null;
  createdAt: Date;
}

const mediaMetadataSchema = z
  .object({ filename: z.string().trim().min(1).max(255).optional() })
  .passthrough();

const rightsDeclarationSchema = z
  .object({
    owner: z.enum(['workspace', 'licensed', 'ugc']),
    licenseReference: z.string().nullable(),
    peopleAppear: z.boolean(),
    peopleConsented: z.boolean(),
    containsMusic: z.boolean(),
    declaredByName: z.string().nullable(),
    declaredAt: z.string().datetime(),
  })
  .strict();

function fileNameFrom(metadata: unknown): string | null {
  const parsed = mediaMetadataSchema.safeParse(metadata);
  return parsed.success ? (parsed.data.filename ?? null) : null;
}

function rightsDeclarationFrom(note: string | null): MediaAssetView['rightsDeclaration'] {
  if (note === null) {
    return null;
  }
  try {
    const parsed = rightsDeclarationSchema.safeParse(JSON.parse(note));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function rightsFrom(value: string): MediaAssetView['rights'] {
  switch (value) {
    case 'owned_original':
    case 'licensed':
    case 'public_domain':
    case 'user_generated_with_consent':
    case 'unverified':
      return value;
    default:
      return 'unverified';
  }
}

function toView(row: MediaRow): MediaAssetView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    projectId: row.projectId,
    kind: row.kind as MediaAssetView['kind'],
    mimeType: row.mimeType,
    byteSize: Number(row.byteSize),
    checksumSha256: row.checksumSha256,
    width: row.width,
    height: row.height,
    durationMs: row.durationMs,
    fileName: fileNameFrom(row.metadata),
    altText: row.altText,
    altTextWaived: row.altTextWaivedAt !== null,
    altTextWaivedReason: row.altTextWaivedReason,
    altTextWaivedByName: row.altTextWaivedByName,
    rights: rightsFrom(row.rights),
    rightsDeclaration: rightsDeclarationFrom(row.rightsNote),
    scanState: row.scanState,
    originKind: row.originKind,
    originUrl: row.originUrl,
    retentionExpiresAt: row.retentionExpiresAt.toISOString(),
    storageAvailable: row.storageDeletedAt === null,
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

const SHA256_PATTERN = /^[0-9a-f]{64}$/;

export function uploadLimitForMimeType(mimeType: string): number {
  return mimeType.startsWith('video/') ? VIDEO_UPLOAD_LIMIT_BYTES : IMAGE_UPLOAD_LIMIT_BYTES;
}

function retentionExpiry(now: Date): Date {
  return new Date(now.getTime() + MEDIA_RETENTION_DAYS * 24 * 60 * 60 * 1_000);
}

/**
 * A path value carrying a control character is malformed, never routed. Written
 * as a code-point scan rather than a regular expression so the range is legible
 * and no literal control byte ends up in this file.
 */
function hasControlCharacter(value: string): boolean {
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      return true;
    }
  }
  return false;
}

/**
 * A storage key is always `${workspaceId}/${sha256}`.
 *
 * The two direct-transfer routes below take the key from the request path, so
 * it is checked here rather than trusted: it must belong to the calling
 * workspace, and it must not contain a traversal segment or a control
 * character. `LocalFileStorage` refuses an escaping key as well; this is the
 * application-side half of the same rule, and it is what makes a foreign key a
 * `FORBIDDEN` rather than a confusing storage error.
 */
export function assertStorageKeyBelongsToWorkspace(workspaceId: string, storageKey: string): void {
  if (
    !storageKey.startsWith(`${workspaceId}/`) ||
    storageKey.includes('..') ||
    hasControlCharacter(storageKey)
  ) {
    throw new ForbiddenError({ details: { reason: 'storage_key_workspace_mismatch' } });
  }
}

/**
 * These two routes exist only for the local filesystem adapter, which points
 * its upload ticket back at our own API. A deployment configured with an object
 * store issues presigned PUTs, and must not also expose an unsigned write path,
 * so anything other than `LocalFileStorage` refuses.
 */
export function requireLocalStorage(deps: Pick<ServiceDeps, 'storage'>): LocalFileStorage {
  if (!(deps.storage instanceof LocalFileStorage)) {
    throw new CapabilityNotImplementedError({
      messageKey: 'errors.capability_not_implemented',
      details: { capability: 'media_direct_transfer' },
    });
  }
  return deps.storage;
}

async function requireMedia(db: Db, mediaId: string, now: Date): Promise<MediaRow> {
  const row = await db.mediaAsset.findFirst({
    where: { id: mediaId, deletedAt: null, retentionExpiresAt: { gt: now } },
    select: MEDIA_SELECT,
  });
  if (row === null) {
    throw notFound('media_asset', mediaId);
  }
  return row;
}

export function createMediaService(deps: ServiceDeps): MediaService {
  const derivatives = createMediaDerivativeService(deps);
  return {
    async createUploadUrl(
      ctx: ActorContext,
      input: {
        filename: string;
        mimeType: string;
        byteSize: number;
        sha256: string;
        projectId?: string | null;
      },
    ): Promise<{
      uploadUrl: string;
      mediaId: string;
      method: 'PUT' | 'POST';
      headers: Record<string, string>;
      expiresAt: string;
      retentionExpiresAt: string;
    }> {
      const prepared = await authorized(
        deps,
        ctx,
        'media.write',
        input.projectId === undefined || input.projectId === null
          ? undefined
          : { projectId: input.projectId },
        async (db, actor) => {
          await requireProjectOwnershipIfPresent(db, actor, input.projectId);
          if (!SHA256_PATTERN.test(input.sha256)) {
            throw invalid('errors.media_checksum_invalid', {});
          }
          const uploadLimit = uploadLimitForMimeType(input.mimeType);
          if (input.byteSize <= 0 || input.byteSize > uploadLimit) {
            throw invalid('errors.media_too_large', {
              byteSize: input.byteSize,
              limit: uploadLimit,
            });
          }

          const retainedUntil = retentionExpiry(deps.clock.now());

          // Content-addressed: the same bytes uploaded twice are one asset.
          const existing = await db.mediaAsset.findFirst({
            where: { checksumSha256: input.sha256 },
            select: { id: true },
          });

          const kind = kindForMimeType(input.mimeType);
          const mediaId =
            existing === null
              ? (
                  await db.mediaAsset.create({
                    data: {
                      workspaceId: actor.workspace.id,
                      projectId: input.projectId ?? null,
                      kind,
                      storageBucket: deps.config.neon.storageBucket,
                      storageKey: `${ctx.workspaceId}/${input.sha256}`,
                      mimeType: input.mimeType,
                      byteSize: BigInt(input.byteSize),
                      checksumSha256: input.sha256,
                      originKind: 'upload',
                      scanState: 'pending',
                      retentionExpiresAt: retainedUntil,
                      ...(actor.userId === null ? {} : { createdByUserId: actor.userId }),
                      metadata: toJson({ filename: input.filename }),
                    },
                    select: { id: true },
                  })
                ).id
              : (
                  await db.mediaAsset.update({
                    where: { id: existing.id },
                    data: {
                      projectId: input.projectId ?? null,
                      kind,
                      mimeType: input.mimeType,
                      byteSize: BigInt(input.byteSize),
                      scanState: 'pending',
                      scanNote: null,
                      deletedAt: null,
                      storageDeletedAt: null,
                      retentionExpiresAt: retainedUntil,
                      metadata: toJson({ filename: input.filename }),
                    },
                    select: { id: true },
                  })
                ).id;

          return { mediaId, retainedUntil };
        },
      );
      const ticket = await deps.storage.createUploadTicket({
        workspaceId: ctx.workspaceId,
        key: `${ctx.workspaceId}/${input.sha256}`,
        contentType: input.mimeType,
        byteSize: input.byteSize,
        checksumSha256: input.sha256,
      });
      return {
        uploadUrl: ticket.uploadUrl,
        mediaId: prepared.mediaId,
        method: ticket.method,
        headers: { ...ticket.headers },
        expiresAt: ticket.expiresAt,
        retentionExpiresAt: prepared.retainedUntil.toISOString(),
      };
    },

    /**
     * Accept the bytes a local upload ticket pointed at this API.
     *
     * Every check is against the pending row the ticket was issued for, not
     * against what the request claims: the workspace prefix, the content type,
     * the checksum header and the ticketed size. `finalizeUpload` re-hashes the
     * stored object independently afterwards, so this is the early reject, not
     * the only integrity check.
     */
    async acceptDirectUpload(
      ctx: ActorContext,
      input: {
        storageKey: string;
        contentType: string;
        checksumSha256: string;
        bytes: Uint8Array;
      },
    ): Promise<{ byteSize: number }> {
      const storage = requireLocalStorage(deps);
      assertStorageKeyBelongsToWorkspace(ctx.workspaceId, input.storageKey);
      if (!SHA256_PATTERN.test(input.checksumSha256)) {
        throw invalid('errors.media_checksum_invalid', {});
      }

      const row = await authorized(deps, ctx, 'media.write', undefined, async (db) => {
        const media = await db.mediaAsset.findFirst({
          where: {
            storageKey: input.storageKey,
            deletedAt: null,
            retentionExpiresAt: { gt: deps.clock.now() },
          },
          select: { id: true, mimeType: true, byteSize: true, checksumSha256: true },
        });
        if (media === null) {
          // No ticket was issued for this key, so nothing may be written to it.
          throw notFound('media_asset', input.storageKey);
        }
        return media;
      });

      if (input.contentType !== row.mimeType) {
        throw invalid('errors.media_content_type_mismatch', { mediaId: row.id });
      }
      if (input.checksumSha256 !== row.checksumSha256) {
        throw invalid('errors.media_checksum_mismatch', { mediaId: row.id });
      }
      if (BigInt(input.bytes.byteLength) > row.byteSize) {
        throw invalid('errors.media_too_large', {
          byteSize: input.bytes.byteLength,
          limit: Number(row.byteSize),
        });
      }

      const stored = await storage.write(input.storageKey, input.bytes, input.contentType);
      return { byteSize: stored.byteSize };
    },

    async readObjectForDownload(
      ctx: ActorContext,
      input: { storageKey: string },
    ): Promise<{ bytes: Uint8Array; contentType: string }> {
      const storage = requireLocalStorage(deps);
      assertStorageKeyBelongsToWorkspace(ctx.workspaceId, input.storageKey);

      const row = await authorized(deps, ctx, 'media.read', undefined, async (db) => {
        const media = await db.mediaAsset.findFirst({
          where: {
            storageKey: input.storageKey,
            deletedAt: null,
            storageDeletedAt: null,
            // An expired retention window is a gone object, not a slow one.
            retentionExpiresAt: { gt: deps.clock.now() },
          },
          select: { mimeType: true },
        });
        if (media === null) {
          throw notFound('media_asset', input.storageKey);
        }
        return media;
      });

      return { bytes: await storage.read(input.storageKey), contentType: row.mimeType };
    },

    async finalizeUpload(ctx: ActorContext, mediaId: string): Promise<MediaAssetView> {
      const row = await authorized(deps, ctx, 'media.write', undefined, async (db) => {
        const media = await requireMedia(db, mediaId, deps.clock.now());
        return { checksumSha256: media.checksumSha256, mimeType: media.mimeType };
      });
      const storageKey = `${ctx.workspaceId}/${row.checksumSha256}`;
      const object = await deps.storage.head(storageKey);
      if (object === null) {
        throw invalid('errors.media_upload_missing', { mediaId });
      }

      if (object.checksumSha256 !== row.checksumSha256) {
        await authorized(deps, ctx, 'media.write', undefined, async (db) => {
          await db.mediaAsset.update({
            where: { id: mediaId },
            data: { scanState: 'failed', scanNote: 'media.checksum_mismatch' },
          });
        });
        throw invalid('errors.media_checksum_mismatch', { mediaId });
      }

      const uploadLimit = uploadLimitForMimeType(row.mimeType);
      if (object.byteSize > uploadLimit) {
        await authorized(deps, ctx, 'media.write', undefined, async (db) => {
          await db.mediaAsset.update({
            where: { id: mediaId },
            data: {
              scanState: 'failed',
              scanNote: 'media.size_limit_exceeded',
            },
          });
        });
        await deps.storage.remove(storageKey);
        await authorized(deps, ctx, 'media.write', undefined, async (db) => {
          await db.mediaAsset.update({
            where: { id: mediaId },
            data: { storageDeletedAt: deps.clock.now() },
          });
        });
        throw invalid('errors.media_too_large', {
          byteSize: object.byteSize,
          limit: uploadLimit,
        });
      }

      return authorized(deps, ctx, 'media.write', undefined, async (db, actor) => {
        const updated = await db.mediaAsset.update({
          where: { id: mediaId },
          data: {
            byteSize: BigInt(object.byteSize),
            scanState: 'pending',
            scanNote: 'media.safety_scan_pending',
          },
          select: MEDIA_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'media_asset',
          targetId: mediaId,
          after: {
            checksum: row.checksumSha256,
            byteSize: object.byteSize,
            scanState: 'pending',
          },
        });

        return toView(updated);
      });
    },

    /** SSRF-safe, content-addressed and replay-safe. */
    async importFromUrl(
      ctx: ActorContext,
      input: { url: string; projectId?: string | null },
    ): Promise<OperationRef> {
      const resource =
        input.projectId === undefined || input.projectId === null
          ? undefined
          : { projectId: input.projectId };
      return withIdempotency(
        deps.kv,
        ctx,
        {
          operation: 'media.import_from_url',
          body: input,
          run: async () => {
            // Authorize before making any outbound request, then authorize
            // again when the durable row and audit event are written. The
            // project is resolved in the same pass, so an id this workspace
            // does not own never reaches the fetcher.
            await authorized(deps, ctx, 'media.write', resource, async (db, actor) => {
              await requireProjectOwnershipIfPresent(db, actor, input.projectId);
            });

            const imported = await fetchAndStoreRemoteMedia({
              workspaceId: ctx.workspaceId,
              url: input.url,
              fetchRemote: deps.remoteMediaFetch ?? safeFetch,
              storage: deps.storage,
            });

            const mediaId = await authorized(
              deps,
              ctx,
              'media.write',
              resource,
              async (db, actor) => {
                const retainedUntil = retentionExpiry(deps.clock.now());
                const existing = await db.mediaAsset.findFirst({
                  where: { checksumSha256: imported.checksumSha256 },
                  select: { id: true },
                });
                const stored =
                  existing === null
                    ? await db.mediaAsset.create({
                        data: {
                          workspaceId: actor.workspace.id,
                          projectId: input.projectId ?? null,
                          kind: kindForMimeType(imported.mimeType),
                          storageBucket: deps.config.neon.storageBucket,
                          storageKey: imported.storageKey,
                          mimeType: imported.mimeType,
                          byteSize: BigInt(imported.byteSize),
                          checksumSha256: imported.checksumSha256,
                          originKind: 'import',
                          originUrl: imported.finalUrl,
                          scanState: 'pending',
                          scanNote: 'media.safety_scan_pending',
                          retentionExpiresAt: retainedUntil,
                          ...(actor.userId === null ? {} : { createdByUserId: actor.userId }),
                          metadata: toJson({ filename: imported.fileName }),
                        },
                        select: { id: true, originKind: true },
                      })
                    : await db.mediaAsset.update({
                        where: { id: existing.id },
                        data: {
                          projectId: input.projectId ?? null,
                          kind: kindForMimeType(imported.mimeType),
                          storageKey: imported.storageKey,
                          mimeType: imported.mimeType,
                          byteSize: BigInt(imported.byteSize),
                          scanState: 'pending',
                          scanNote: 'media.safety_scan_pending',
                          deletedAt: null,
                          storageDeletedAt: null,
                          retentionExpiresAt: retainedUntil,
                          metadata: toJson({ filename: imported.fileName }),
                        },
                        select: { id: true, originKind: true },
                      });
                const id = stored.id;

                await recordAudit(db, actor, {
                  action: 'workspace.updated',
                  targetType: 'media_asset',
                  targetId: id,
                  after: {
                    checksum: imported.checksumSha256,
                    byteSize: imported.byteSize,
                    originKind: stored.originKind,
                    scanState: 'pending',
                  },
                  metadata: {
                    redirectCount: imported.redirectCount,
                    resolvedAddressCount: imported.resolvedAddressCount,
                  },
                });
                return id;
              },
            );

            const completedAt = deps.clock.now().toISOString();
            return {
              operationId: newIdFor('operation'),
              status: 'succeeded' as const,
              resourceType: 'media_asset',
              resourceId: mediaId,
              createdAt: completedAt,
              completedAt,
              error: null,
            };
          },
          resourceIdOf: (operation) => operation.resourceId ?? undefined,
        },
        deps.clock,
      );
    },

    async list(
      ctx: ActorContext,
      query: PageQuery & { projectId?: string; kind?: string } = {},
    ): Promise<Paginated<MediaAssetView>> {
      return authorized(deps, ctx, 'media.read', undefined, async (db, actor) => {
        await requireProjectOwnershipIfPresent(db, actor, query.projectId);
        const args = pageArgs(query);
        const kind = query.kind === undefined ? undefined : asMediaKind(query.kind);
        if (query.kind !== undefined && kind === undefined) {
          throw invalid('errors.unknown_media_kind', { kind: query.kind });
        }
        const rows = await db.mediaAsset.findMany({
          where: {
            deletedAt: null,
            retentionExpiresAt: { gt: deps.clock.now() },
            ...(query.projectId === undefined ? {} : { projectId: query.projectId }),
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
        toView(await requireMedia(db, mediaId, deps.clock.now())),
      );
    },

    async delete(ctx: ActorContext, mediaId: string): Promise<void> {
      await authorized(deps, ctx, 'media.delete', undefined, async (db, actor) => {
        await requireMedia(db, mediaId, deps.clock.now());
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

    async purgeExpired(ctx: ActorContext, limit = 100): Promise<{ readonly purged: number }> {
      if (ctx.actorType !== 'system') {
        throw new ForbiddenError({ details: { reason: 'media_retention_worker_only' } });
      }
      const batchSize = Math.max(1, Math.min(500, Math.trunc(limit)));
      const expired = await authorized(deps, ctx, 'media.delete', undefined, async (db) =>
        db.mediaAsset.findMany({
          where: {
            retentionExpiresAt: { lte: deps.clock.now() },
            storageDeletedAt: null,
          },
          orderBy: { retentionExpiresAt: 'asc' },
          take: batchSize,
          select: {
            id: true,
            storageKey: true,
            retentionExpiresAt: true,
            derivatives: { select: { id: true, storageKey: true } },
          },
        }),
      );

      let purged = 0;
      for (const asset of expired) {
        // Delete first. If the database update fails, the next sweep repeats
        // the idempotent object deletion and then records completion.
        //
        // Derivatives go with the original. They are stored objects of their
        // own, so a sweep that only removed the source would leave crops of a
        // deleted photo sitting in the bucket with nothing pointing at them.
        for (const derivative of asset.derivatives) {
          await deps.storage.remove(derivative.storageKey);
        }
        await deps.storage.remove(asset.storageKey);
        await authorized(deps, ctx, 'media.delete', undefined, async (db, actor) => {
          await db.mediaDerivative.deleteMany({ where: { mediaAssetId: asset.id } });
          await db.mediaAsset.update({
            where: { id: asset.id },
            data: { storageDeletedAt: deps.clock.now(), deletedAt: deps.clock.now() },
          });
          await recordAudit(db, actor, {
            action: 'deletion.executed',
            targetType: 'media_asset',
            targetId: asset.id,
            after: { storageDeleted: true, derivativesDeleted: asset.derivatives.length },
            metadata: { retentionExpiresAt: asset.retentionExpiresAt.toISOString() },
          });
        });
        purged += 1;
      }
      return { purged };
    },

    /**
     * Non-generative editing only. The original is preserved: an edit produces
     * a derivative, and platform validation reruns against the result. See
     * `media-derivatives.ts` for the pipeline and the idempotency argument.
     */
    async edit(
      ctx: ActorContext,
      input: { mediaId: string; ops: readonly MediaDerivativeOperation[] },
    ): Promise<MediaDerivativeRequest> {
      return derivatives.request(ctx, { mediaId: input.mediaId, operations: input.ops });
    },

    async listDerivatives(
      ctx: ActorContext,
      mediaId: string,
    ): Promise<readonly MediaDerivativeView[]> {
      return derivatives.list(ctx, mediaId);
    },

    async getDerivative(ctx: ActorContext, derivativeId: string): Promise<MediaDerivativeView> {
      return derivatives.get(ctx, derivativeId);
    },

    async setAltText(
      ctx: ActorContext,
      input: {
        mediaId: string;
        altText: string | null;
        waived?: boolean;
        waivedReason?: string | null;
      },
    ): Promise<MediaAssetView> {
      return authorized(deps, ctx, 'media.write', undefined, async (db, actor) => {
        const before = await requireMedia(db, input.mediaId, deps.clock.now());
        if (input.altText === null && input.waived !== true) {
          throw invalid('errors.alt_text_required', { mediaId: input.mediaId });
        }
        if (input.altText !== null && input.waived === true) {
          throw invalid('errors.alt_text_waiver_conflict', { mediaId: input.mediaId });
        }
        const waivedReason = input.waived === true ? input.waivedReason?.trim() : undefined;
        if (input.waived === true && !waivedReason) {
          throw invalid('errors.alt_text_waiver_reason_required', { mediaId: input.mediaId });
        }
        const displayName =
          actor.userId === null
            ? null
            : ((
                await db.user.findUnique({
                  where: { id: actor.userId },
                  select: { displayName: true },
                })
              )?.displayName ?? null);
        const after = await db.mediaAsset.update({
          where: { id: input.mediaId },
          data: {
            altText: input.altText,
            altTextWaivedAt: input.waived === true ? deps.clock.now() : null,
            altTextWaivedReason: input.waived === true ? waivedReason : null,
            altTextWaivedByName: input.waived === true ? displayName : null,
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

    async declareRights(
      ctx: ActorContext,
      input: {
        mediaId: string;
        owner: 'workspace' | 'licensed' | 'ugc';
        licenseReference: string | null;
        peopleAppear: boolean;
        peopleConsented: boolean;
        containsMusic: boolean;
        confirmed: true;
      },
    ): Promise<MediaAssetView> {
      return authorized(deps, ctx, 'media.write', undefined, async (db, actor) => {
        const before = await requireMedia(db, input.mediaId, deps.clock.now());
        const licenseReference = input.licenseReference?.trim() || null;
        if (input.owner === 'licensed' && licenseReference === null) {
          throw invalid('errors.media_license_reference_required', { mediaId: input.mediaId });
        }
        if (input.peopleAppear && !input.peopleConsented) {
          throw invalid('errors.media_people_consent_required', { mediaId: input.mediaId });
        }

        const declaredAt = deps.clock.now();
        const declaredByName =
          actor.userId === null
            ? null
            : ((
                await db.user.findUnique({
                  where: { id: actor.userId },
                  select: { displayName: true },
                })
              )?.displayName ?? null);
        const rights =
          input.owner === 'workspace'
            ? 'owned_original'
            : input.owner === 'licensed'
              ? 'licensed'
              : 'user_generated_with_consent';
        const declaration = {
          owner: input.owner,
          licenseReference,
          peopleAppear: input.peopleAppear,
          peopleConsented: input.peopleConsented,
          containsMusic: input.containsMusic,
          declaredByName,
          declaredAt: declaredAt.toISOString(),
        } as const;
        const after = await db.mediaAsset.update({
          where: { id: input.mediaId },
          data: { rights, rightsNote: JSON.stringify(declaration) },
          select: MEDIA_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'media_asset',
          targetId: input.mediaId,
          before: { rights: before.rights },
          after: {
            rights,
            peopleAppear: input.peopleAppear,
            peopleConsented: input.peopleConsented,
            containsMusic: input.containsMusic,
          },
        });
        return toView(after);
      });
    },
  };
}
