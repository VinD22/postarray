/** The media library: uploads, imports, derivatives and alt text. */

import { call } from '../call';
import { page } from '../fixtures';
import type { MediaKind, Paginated } from '@relay/contracts';

export type { MediaKind };

export interface MediaAssetView {
  readonly id: string;
  readonly workspaceId: string;
  readonly kind: MediaKind;
  readonly fileName: string;
  readonly mimeType: string;
  readonly byteSize: number;
  readonly width: number | null;
  readonly height: number | null;
  readonly durationMs: number | null;
  readonly checksum: string;
  readonly altText: string | null;
  readonly altTextWaivedReason: string | null;
  readonly originKind: 'upload' | 'import' | 'api';
  readonly originLabel: string;
  readonly rightsDeclared: boolean;
  readonly scanState: 'pending' | 'clean' | 'rejected';
  readonly previewUrl: string | null;
  readonly createdAt: string;
  readonly usedInPostCount: number;
}

export interface UploadTicket {
  readonly mediaId: string;
  readonly uploadUrl: string;
  readonly method: 'PUT' | 'POST';
  readonly headers: Readonly<Record<string, string>>;
  readonly expiresAt: string;
}

/**
 * The edit plan the picture editor sends. Null clears a previously applied
 * step; an omitted key leaves that step as it is.
 */
export interface MediaEditInput {
  readonly crop?: { x: number; y: number; width: number; height: number } | null;
  readonly resize?: { width: number; height: number } | null;
  readonly rotateDegrees?: 0 | 90 | 180 | 270;
  readonly flipHorizontal?: boolean;
  readonly flipVertical?: boolean;
  readonly canvas?: { backgroundColor: string; fit: 'cover' | 'contain' } | null;
  readonly format?: 'image/jpeg' | 'image/png' | 'image/webp';
  /** 1 to 100. Ignored for PNG, which is lossless. */
  readonly quality?: number;
  /** The frame or file used as a video thumbnail, where the platform takes one. */
  readonly thumbnailMediaId?: string | null;
  readonly trimMs?: { start: number; end: number } | null;
  readonly thumbnailAtMs?: number | null;
}

export interface RightsDeclarationInput {
  readonly owner: 'workspace' | 'licensed' | 'ugc';
  readonly licenseReference: string | null;
  readonly peopleAppear: boolean;
  readonly peopleConsented: boolean;
  readonly containsMusic: boolean;
}

export const mediaApi = {
  /** Step one of a direct upload. The browser then PUTs the bytes itself. */
  createUploadUrl: (
    input: { fileName: string; mimeType: string; byteSize: number },
    idempotencyKey: string,
  ): Promise<UploadTicket> =>
    call('/media/uploads', { method: 'POST', body: input, idempotencyKey }, () => ({
      mediaId: 'media_demo_new',
      uploadUrl: '',
      method: 'PUT' as const,
      headers: {},
      expiresAt: new Date(Date.now() + 900_000).toISOString(),
    })),

  /** Step two. The asset is not usable until this returns. */
  finalizeUpload: (
    mediaId: string,
    input: { checksum: string; rightsDeclared: boolean },
    idempotencyKey: string,
  ): Promise<MediaAssetView | null> =>
    call(
      `/media/uploads/${mediaId}/finalize`,
      { method: 'POST', body: input, idempotencyKey },
      () => null,
    ),

  importFromUrl: (
    input: { url: string; rightsDeclared: boolean },
    idempotencyKey: string,
  ): Promise<MediaAssetView | null> =>
    call('/media/imports', { method: 'POST', body: input, idempotencyKey }, () => null),

  list: (
    query: { kind?: MediaKind; cursor?: string; limit?: number } = {},
  ): Promise<Paginated<MediaAssetView>> =>
    call('/media', { query }, () => page<MediaAssetView>([])),

  get: (mediaId: string): Promise<MediaAssetView | null> =>
    call(`/media/${mediaId}`, {}, () => null),

  delete: (mediaId: string): Promise<void> =>
    call(`/media/${mediaId}`, { method: 'DELETE' }, () => undefined),

  /**
   * Crop, trim and thumbnail selection on an uploaded file. This is editing,
   * not generation: Relay never creates image or video content. Every field
   * below changes pixels that are already in the file, which is why there is no
   * prompt, model or seed anywhere in this shape.
   *
   * An edit produces a new version; the original stays addressable and can be
   * restored with `restoreVersion`.
   */
  edit: (mediaId: string, input: MediaEditInput): Promise<MediaAssetView | null> =>
    call(`/media/${mediaId}/edits`, { method: 'PATCH', body: input }, () => null),

  /**
   * Restore a previous version as the current one. This is a new version that
   * carries the older bytes, never a destructive rollback.
   */
  restoreVersion: (
    mediaId: string,
    version: number,
    idempotencyKey: string,
  ): Promise<MediaAssetView | null> =>
    call(
      `/media/${mediaId}/versions/${version}/restore`,
      { method: 'POST', idempotencyKey },
      () => null,
    ),

  /**
   * Record who owns the file, under what licence, and whether the people in it
   * consented. An asset with no declaration cannot be scheduled.
   */
  declareRights: (mediaId: string, input: RightsDeclarationInput): Promise<MediaAssetView | null> =>
    call(`/media/${mediaId}/rights`, { method: 'PATCH', body: input }, () => null),

  setAltText: (
    mediaId: string,
    input: { altText: string | null; waivedReason?: string },
  ): Promise<MediaAssetView | null> =>
    call(`/media/${mediaId}/alt-text`, { method: 'PATCH', body: input }, () => null),
};
