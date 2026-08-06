import type { HttpClient } from '../../http';
import { type ProviderMedia } from './contract-shape';

/**
 * A minimal multipart/form-data builder for the adapters whose provider only accepts
 * uploaded bytes (Mastodon media, for example).
 *
 * It builds the exact bytes for one `Uint8Array` body plus the matching `content-type`
 * header, which is all the shared HTTP client needs. Values are always either text fields
 * or one binary part; there is no file list, because no adapter in this package needs one.
 *
 * A boundary is random per body so a retried request never reuses the same bytes.
 */

const CRLF = '\r\n';

function encoder() {
  return new TextEncoder();
}

/** A UTF-8 safe byte length. */
function utf8Length(value: string): number {
  return encoder().encode(value).length;
}

export interface MultipartField {
  readonly name: string;
  readonly value: string;
}

export interface MultipartFile {
  readonly name: string;
  readonly filename: string;
  readonly contentType: string;
  readonly bytes: Uint8Array;
}

export interface MultipartBody {
  readonly body: Uint8Array;
  readonly contentType: string;
}

function randomBoundary(): string {
  const random = Math.random().toString(36).slice(2);
  return `----relay-${random}`;
}

export function buildMultipart(
  fields: readonly MultipartField[],
  files: readonly MultipartFile[],
): MultipartBody {
  const boundary = randomBoundary();
  const chunks: (Uint8Array | string)[] = [];

  for (const field of fields) {
    chunks.push(`--${boundary}${CRLF}`);
    chunks.push(`Content-Disposition: form-data; name="${field.name}"${CRLF}${CRLF}`);
    chunks.push(field.value);
    chunks.push(CRLF);
  }

  for (const file of files) {
    chunks.push(`--${boundary}${CRLF}`);
    chunks.push(
      `Content-Disposition: form-data; name="${file.name}"; filename="${file.filename}"${CRLF}`,
    );
    chunks.push(`Content-Type: ${file.contentType}${CRLF}${CRLF}`);
    chunks.push(file.bytes);
    chunks.push(CRLF);
  }

  chunks.push(`--${boundary}--${CRLF}`);

  const encoder_ = encoder();
  const total = chunks.reduce(
    (sum, chunk) => sum + (typeof chunk === 'string' ? utf8Length(chunk) : chunk.byteLength),
    0,
  );
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    const bytes = typeof chunk === 'string' ? encoder_.encode(chunk) : chunk;
    body.set(bytes, offset);
    offset += bytes.byteLength;
  }

  return { body, contentType: `multipart/form-data; boundary=${boundary}` };
}

/** Fetch a media item's bytes from its signed source URL, for upload based adapters. */
export async function fetchMediaBytes(
  http: HttpClient,
  media: ProviderMedia,
  provider: string,
): Promise<Uint8Array> {
  if (media.sourceUrl === null) {
    throw new Error('MEDIA_SOURCE_URL_MISSING');
  }
  const response = await http.request({
    method: 'GET',
    url: media.sourceUrl,
    accept: 'binary',
    provider,
    operation: `${provider}.fetch_source`,
  });
  if (!response.ok) {
    throw new Error(`SOURCE_FETCH_FAILED_${response.status}`);
  }
  return response.bytes;
}
