/** The media library: uploads, imports, derivatives and alt text. */

import { call } from '../call.js';
import { page } from '../fixtures.js';
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
    call(`/media/uploads/${mediaId}/finalize`, { method: 'POST', body: input, idempotencyKey }, () => null),

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
   * not generation: Relay never creates image or video content.
   */
  edit: (
    mediaId: string,
    input: {
      crop?: { x: number; y: number; width: number; height: number };
      trimMs?: { start: number; end: number };
      thumbnailAtMs?: number;
    },
  ): Promise<MediaAssetView | null> =>
    call(`/media/${mediaId}/edits`, { method: 'PATCH', body: input }, () => null),

  setAltText: (
    mediaId: string,
    input: { altText: string | null; waivedReason?: string },
  ): Promise<MediaAssetView | null> =>
    call(`/media/${mediaId}/alt-text`, { method: 'PATCH', body: input }, () => null),
};
