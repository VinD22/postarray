import { createHash } from 'node:crypto';

import {
  ERROR_CODES,
  IMAGE_UPLOAD_LIMIT_BYTES,
  MediaInvalidError,
  RelayError,
  UPLOADABLE_MEDIA_MIME_TYPES,
  VIDEO_UPLOAD_LIMIT_BYTES,
} from '@relay/contracts';

import type { StoragePort } from '../types';

export interface RemoteMediaFetchResult {
  readonly finalUrl: string;
  readonly status: number;
  readonly body: Uint8Array;
  readonly contentType: string | null;
  readonly redirectChain: readonly string[];
  readonly resolvedAddresses: readonly string[];
}

export type RemoteMediaFetch = (
  url: string,
  options: { readonly maxBytes: number },
) => Promise<RemoteMediaFetchResult>;

export interface ImportedMediaObject {
  readonly checksumSha256: string;
  readonly storageKey: string;
  readonly mimeType: (typeof UPLOADABLE_MEDIA_MIME_TYPES)[number];
  readonly byteSize: number;
  readonly fileName: string;
  readonly finalUrl: string;
  readonly redirectCount: number;
  readonly resolvedAddressCount: number;
}

function invalid(reason: string, details: Record<string, unknown> = {}): MediaInvalidError {
  return new MediaInvalidError({
    messageKey: 'error.media_invalid.message',
    details: { provider: 'this workspace', reason, ...details },
  });
}

function withoutControlCharacters(value: string): string {
  return [...value]
    .filter((character) => {
      const codePoint = character.codePointAt(0);
      return codePoint !== undefined && codePoint >= 32 && codePoint !== 127;
    })
    .join('');
}

function normalizedMimeType(
  contentType: string | null,
): (typeof UPLOADABLE_MEDIA_MIME_TYPES)[number] {
  const mimeType = contentType?.split(';', 1)[0]?.trim().toLowerCase() ?? '';
  const allowedMimeType = UPLOADABLE_MEDIA_MIME_TYPES.find((allowed) => allowed === mimeType);
  if (allowedMimeType === undefined) {
    throw invalid('remote_media_type_not_allowed', { mimeType: mimeType || 'unavailable' });
  }
  return allowedMimeType;
}

function startsWith(bytes: Uint8Array, signature: readonly number[]): boolean {
  return signature.every((value, index) => bytes[index] === value);
}

function asciiAt(bytes: Uint8Array, start: number, length: number): string {
  return String.fromCharCode(...bytes.slice(start, start + length));
}

/** Reject an HTML or JSON response wearing an allowed Content-Type header. */
export function signatureMatchesMimeType(bytes: Uint8Array, mimeType: string): boolean {
  switch (mimeType) {
    case 'image/jpeg':
      return startsWith(bytes, [0xff, 0xd8, 0xff]);
    case 'image/png':
      return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case 'image/gif':
      return asciiAt(bytes, 0, 6) === 'GIF87a' || asciiAt(bytes, 0, 6) === 'GIF89a';
    case 'image/webp':
      return asciiAt(bytes, 0, 4) === 'RIFF' && asciiAt(bytes, 8, 4) === 'WEBP';
    case 'image/avif': {
      const header = asciiAt(bytes, 4, Math.min(28, Math.max(0, bytes.length - 4)));
      return header.startsWith('ftyp') && (header.includes('avif') || header.includes('avis'));
    }
    case 'video/mp4':
    case 'video/quicktime':
    case 'audio/mp4':
      return asciiAt(bytes, 4, 4) === 'ftyp';
    case 'video/webm':
      return startsWith(bytes, [0x1a, 0x45, 0xdf, 0xa3]);
    case 'audio/mpeg':
      return (
        asciiAt(bytes, 0, 3) === 'ID3' ||
        (bytes[0] === 0xff && bytes[1] !== undefined && (bytes[1] & 0xe0) === 0xe0)
      );
    case 'application/pdf':
      return asciiAt(bytes, 0, 5) === '%PDF-';
    default:
      return false;
  }
}

export function fileNameFromRemoteUrl(rawUrl: string, mimeType: string): string {
  const extension =
    mimeType === 'image/jpeg'
      ? 'jpg'
      : mimeType === 'video/quicktime'
        ? 'mov'
        : mimeType === 'audio/mpeg'
          ? 'mp3'
          : mimeType === 'application/pdf'
            ? 'pdf'
            : (mimeType.split('/')[1] ?? 'bin');
  try {
    const rawName = new URL(rawUrl).pathname.split('/').filter(Boolean).at(-1) ?? '';
    const decoded = withoutControlCharacters(decodeURIComponent(rawName)).trim();
    return (decoded || `imported-media.${extension}`).slice(0, 255);
  } catch {
    return `imported-media.${extension}`;
  }
}

/** Preserve useful provenance without persisting signed-query credentials. */
export function provenanceUrlFor(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    parsed.username = '';
    parsed.password = '';
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return 'unavailable';
  }
}

/**
 * Fetch, validate and store a remote media object behind one small interface.
 * The fetch adapter owns DNS and redirect safety; this module owns media rules
 * and content-addressed storage so every caller gets identical behaviour.
 */
export async function fetchAndStoreRemoteMedia(input: {
  readonly workspaceId: string;
  readonly url: string;
  readonly fetchRemote: RemoteMediaFetch;
  readonly storage: StoragePort;
}): Promise<ImportedMediaObject> {
  const fetched = await input.fetchRemote(input.url, { maxBytes: VIDEO_UPLOAD_LIMIT_BYTES });
  if (fetched.status < 200 || fetched.status >= 300) {
    throw invalid('remote_media_http_status', { status: fetched.status });
  }

  const mimeType = normalizedMimeType(fetched.contentType);
  const byteSize = fetched.body.byteLength;
  if (byteSize === 0) {
    throw invalid('remote_media_empty');
  }
  const limit = mimeType.startsWith('video/') ? VIDEO_UPLOAD_LIMIT_BYTES : IMAGE_UPLOAD_LIMIT_BYTES;
  if (byteSize > limit) {
    throw new RelayError(ERROR_CODES.MEDIA_TOO_LARGE, {
      messageKey: 'error.media_too_large.message',
      details: { provider: 'this workspace', byteSize, limit },
    });
  }
  if (!signatureMatchesMimeType(fetched.body, mimeType)) {
    throw invalid('remote_media_signature_mismatch', { mimeType });
  }

  const checksumSha256 = createHash('sha256').update(fetched.body).digest('hex');
  const storageKey = `${input.workspaceId}/${checksumSha256}`;
  const stored = await input.storage.write(storageKey, fetched.body, mimeType);
  if (
    stored.byteSize !== byteSize ||
    stored.checksumSha256 !== checksumSha256 ||
    stored.key !== storageKey
  ) {
    throw new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
      messageKey: 'error.storage_unavailable.message',
      details: { reason: 'remote_media_storage_verification_failed' },
    });
  }

  return {
    checksumSha256,
    storageKey,
    mimeType,
    byteSize,
    fileName: fileNameFromRemoteUrl(fetched.finalUrl, mimeType),
    finalUrl: provenanceUrlFor(fetched.finalUrl),
    redirectCount: fetched.redirectChain.length,
    resolvedAddressCount: fetched.resolvedAddresses.length,
  };
}
