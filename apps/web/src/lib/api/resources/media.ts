/** The media library: uploads, provenance, rights and alt text. */

import type { MediaKind, OperationRef, Paginated } from '@relay/contracts';

import { call } from '../call';
import { page } from '../fixtures';

export type { MediaKind };

export interface RightsDeclarationInput {
  readonly owner: 'workspace' | 'licensed' | 'ugc';
  readonly licenseReference: string | null;
  readonly peopleAppear: boolean;
  readonly peopleConsented: boolean;
  readonly containsMusic: boolean;
}

export interface MediaAssetView {
  readonly id: string;
  readonly workspaceId: string;
  readonly brandId: string | null;
  readonly kind: MediaKind;
  readonly fileName: string | null;
  readonly mimeType: string;
  readonly byteSize: number;
  readonly width: number | null;
  readonly height: number | null;
  readonly durationMs: number | null;
  readonly checksumSha256: string;
  readonly altText: string | null;
  readonly altTextWaived: boolean;
  readonly altTextWaivedReason: string | null;
  readonly altTextWaivedByName: string | null;
  readonly rights:
    'owned_original' | 'licensed' | 'public_domain' | 'user_generated_with_consent' | 'unverified';
  readonly rightsDeclaration:
    | (RightsDeclarationInput & {
        readonly declaredByName: string | null;
        readonly declaredAt: string;
      })
    | null;
  readonly scanState: 'pending' | 'clean' | 'suspicious' | 'infected' | 'failed';
  readonly originKind: string;
  readonly originUrl: string | null;
  readonly retentionExpiresAt: string;
  readonly storageAvailable: boolean;
  readonly createdAt: string;
}

export interface UploadTicket {
  readonly mediaId: string;
  readonly uploadUrl: string;
  readonly method: 'PUT' | 'POST';
  readonly headers: Readonly<Record<string, string>>;
  readonly expiresAt: string;
  readonly retentionExpiresAt: string;
}

export interface MediaEditOperation {
  readonly op: 'crop' | 'resize' | 'rotate' | 'compress';
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly degrees?: 90 | 180 | 270;
  readonly quality?: number;
}

export const mediaApi = {
  createUploadUrl: (
    input: { filename: string; mimeType: string; byteSize: number; sha256: string },
    idempotencyKey: string,
  ): Promise<UploadTicket> =>
    call('/media/uploads', { method: 'POST', body: input, idempotencyKey }, () => ({
      mediaId: 'media_demo_new',
      uploadUrl: '',
      method: 'PUT' as const,
      headers: {},
      expiresAt: new Date(Date.now() + 900_000).toISOString(),
      retentionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60_000).toISOString(),
    })),

  finalizeUpload: (mediaId: string, idempotencyKey: string): Promise<MediaAssetView | null> =>
    call(`/media/${mediaId}/finalize`, { method: 'POST', idempotencyKey }, () => null),

  importFromUrl: (
    input: { url: string; brandId?: string | null },
    idempotencyKey: string,
  ): Promise<OperationRef> =>
    call('/media/imports', { method: 'POST', body: input, idempotencyKey }, () => ({
      operationId: 'op_demo_media_import',
      status: 'queued',
      resourceType: 'media_asset',
      resourceId: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      error: null,
    })),

  list: (
    query: { kind?: MediaKind; cursor?: string; limit?: number } = {},
  ): Promise<Paginated<MediaAssetView>> =>
    call('/media', { query }, () => page<MediaAssetView>([])),

  get: (mediaId: string): Promise<MediaAssetView | null> =>
    call(`/media/${mediaId}`, {}, () => null),

  delete: (mediaId: string): Promise<void> =>
    call(`/media/${mediaId}`, { method: 'DELETE' }, () => undefined),

  /** Reserved endpoint. The application currently returns `not_implemented`. */
  edit: (
    mediaId: string,
    ops: readonly MediaEditOperation[],
    idempotencyKey: string,
  ): Promise<MediaAssetView | null> =>
    call(`/media/${mediaId}/edits`, { method: 'POST', body: { ops }, idempotencyKey }, () => null),

  declareRights: (mediaId: string, input: RightsDeclarationInput): Promise<MediaAssetView | null> =>
    call(
      `/media/${mediaId}/rights`,
      { method: 'PUT', body: { ...input, confirmed: true } },
      () => null,
    ),

  setAltText: (
    mediaId: string,
    input: { altText: string | null; waived: boolean; waivedReason?: string | null },
  ): Promise<MediaAssetView | null> =>
    call(`/media/${mediaId}/alt-text`, { method: 'PUT', body: input }, () => null),
};
