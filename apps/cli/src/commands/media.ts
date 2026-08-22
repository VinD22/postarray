import { createHash } from 'node:crypto';
import { extname } from 'node:path';

import { RelayError, mediaKindSchema, operationRefSchema, webUrlSchema } from '@relay/contracts';
import type { UPLOADABLE_MEDIA_MIME_TYPES } from '@relay/contracts';

import { ROUTES } from '../api/routes';
import { mediaAssetViewSchema, paginated, uploadTicketSchema } from '../api/schemas';
import type { MediaAssetView, UploadTicket } from '../api/schemas';
import { requireCredential } from '../context';
import type { CliContext } from '../context';
import { renderSuccess, renderTable } from '../output';
import type { RenderInput } from '../output';

/**
 * `relay media`.
 *
 * The library, from a terminal. Nothing here generates media: V1 accepts
 * finished files and imports finished files, and there is deliberately no
 * command that would take a prompt.
 *
 * An upload is three server calls, in this order, and the CLI invents no part
 * of any of them: ask for a ticket, send the bytes exactly where and how the
 * ticket says, then hand the asset to the processing pipeline. The asset is
 * not usable until MIME sniffing, the checksum re-verification and the malware
 * scan have run, so `upload` reports `scanState` rather than pretending the
 * file is ready the moment the bytes land.
 */

/** Extension to declared type. A hint for the ticket, never a fact: the server decides from the bytes. */
const MIME_BY_EXTENSION: Readonly<Record<string, (typeof UPLOADABLE_MEDIA_MIME_TYPES)[number]>> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.pdf': 'application/pdf',
};

function invalid(reason: string): RelayError {
  return new RelayError('VALIDATION_FAILED', {
    messageKey: 'error.request_invalid.message',
    details: { reason },
  });
}

function baseName(path: string): string {
  const segments = path.split(/[\\/]/);
  return segments[segments.length - 1] ?? path;
}

/** The row every media command prints, so one asset always looks the same. */
function assetRows(asset: MediaAssetView): readonly (readonly string[])[] {
  return [
    ['mediaId', asset.id],
    ['kind', asset.kind],
    ['mimeType', asset.mimeType],
    ['byteSize', String(asset.byteSize)],
    // Dimensions are extracted by the pipeline. Before it has run they are not
    // known, and `unavailable` is not the same claim as `0`.
    ['width', asset.width === null ? 'unavailable' : String(asset.width)],
    ['height', asset.height === null ? 'unavailable' : String(asset.height)],
    ['durationMs', asset.durationMs === null ? 'unavailable' : String(asset.durationMs)],
    [
      'altText',
      asset.altText === null ? (asset.altTextWaived ? 'waived' : 'unset') : asset.altText,
    ],
    ['scanState', asset.scanState],
    ['storageAvailable', String(asset.storageAvailable)],
    ['retentionExpiresAt', asset.retentionExpiresAt],
  ];
}

export interface MediaListOptions {
  readonly projectId?: string | undefined;
  readonly kind?: string | undefined;
  readonly cursor?: string | undefined;
  readonly limit?: number | undefined;
}

export async function mediaList(
  context: CliContext,
  render: RenderInput,
  options: MediaListOptions,
): Promise<void> {
  const kind = options.kind === undefined ? undefined : mediaKindSchema.safeParse(options.kind);
  if (kind !== undefined && !kind.success) {
    throw invalid('MEDIA_KIND_UNKNOWN');
  }

  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.media(),
    schema: paginated(mediaAssetViewSchema),
    query: {
      cursor: options.cursor,
      limit: options.limit,
      projectId: options.projectId,
      kind: kind?.data,
    },
  });

  renderSuccess({ ...render, correlationId: response.correlationId }, response.data, [
    ...renderTable(
      ['mediaId', 'kind', 'mimeType', 'byteSize', 'scanState', 'fileName'],
      response.data.data.map((asset) => [
        asset.id,
        asset.kind,
        asset.mimeType,
        String(asset.byteSize),
        asset.scanState,
        asset.fileName ?? 'unavailable',
      ]),
    ),
  ]);
}

export async function mediaGet(
  context: CliContext,
  render: RenderInput,
  mediaId: string,
): Promise<void> {
  if (mediaId.length === 0) {
    throw invalid('MEDIA_ID_REQUIRED');
  }
  const response = await context.api().request({
    method: 'GET',
    path: ROUTES.mediaItem(mediaId),
    schema: mediaAssetViewSchema,
  });
  renderSuccess({ ...render, correlationId: response.correlationId }, response.data, [
    ...renderTable(['field', 'value'], assetRows(response.data)),
  ]);
}

/**
 * Send the bytes exactly as the ticket instructs.
 *
 * The authorization header goes only to our own API. A ticket that points at
 * an object store is presigned, and forwarding a bearer token to a third-party
 * host would leak the credential to somebody who never needed it.
 */
async function sendBytes(
  context: CliContext,
  ticket: UploadTicket,
  bytes: Uint8Array,
  mimeType: string,
): Promise<void> {
  const fetchImpl = context.deps.fetch ?? globalThis.fetch;
  const sameHost = new URL(ticket.uploadUrl).origin === new URL(context.apiUrl).origin;
  const headers: Record<string, string> = {
    ...ticket.headers,
    'content-type': mimeType,
    ...(sameHost ? { authorization: `Bearer ${requireCredential(context).accessToken}` } : {}),
  };

  const response = await fetchImpl(ticket.uploadUrl, {
    method: ticket.method,
    headers,
    body: bytes,
  });
  if (response.status < 200 || response.status >= 300) {
    // The storage write is not the API surface, so its status is reported as
    // a reason rather than reclassified into a domain error we did not receive.
    throw new RelayError('INTERNAL', {
      messageKey: 'error.internal.message',
      details: { reason: 'MEDIA_UPLOAD_REJECTED', httpStatus: response.status },
    });
  }
}

export interface MediaUploadOptions {
  readonly projectId?: string | undefined;
  readonly idempotencyKey?: string | undefined;
}

export async function mediaUpload(
  context: CliContext,
  render: RenderInput,
  file: string,
  options: MediaUploadOptions,
): Promise<void> {
  if (file.length === 0) {
    throw invalid('FILE_REQUIRED');
  }
  const mimeType = MIME_BY_EXTENSION[extname(file).toLowerCase()];
  if (mimeType === undefined) {
    throw invalid('MEDIA_TYPE_NOT_UPLOADABLE');
  }
  if (options.idempotencyKey === undefined) {
    // An upload creates a durable, billable object. Repeating the same key
    // returns the original asset instead of storing the file twice.
    throw invalid('IDEMPOTENCY_KEY_REQUIRED');
  }

  const bytes = await context.deps.readFile(file);
  if (bytes.byteLength === 0) {
    throw invalid('FILE_EMPTY');
  }
  const sha256 = createHash('sha256').update(bytes).digest('hex');

  const ticket = await context.api().request({
    method: 'POST',
    path: ROUTES.mediaUploads(),
    schema: uploadTicketSchema,
    body: {
      filename: baseName(file),
      mimeType,
      byteSize: bytes.byteLength,
      sha256,
      ...(options.projectId === undefined ? {} : { projectId: options.projectId }),
    },
    idempotencyKey: options.idempotencyKey,
  });

  await sendBytes(context, ticket.data, bytes, mimeType);

  const finalized = await context.api().request({
    method: 'POST',
    path: ROUTES.mediaFinalize(ticket.data.mediaId),
    schema: mediaAssetViewSchema,
    idempotencyKey: `${options.idempotencyKey}:finalize`,
  });

  renderSuccess({ ...render, correlationId: finalized.correlationId }, finalized.data, [
    `uploaded sha256=${sha256}`,
    ...renderTable(['field', 'value'], assetRows(finalized.data)),
  ]);
}

export interface MediaImportOptions {
  readonly projectId?: string | undefined;
  readonly idempotencyKey?: string | undefined;
}

/**
 * Import by URL.
 *
 * The server fetches the URL, so this returns an operation handle rather than
 * an asset: the fetch, the scan and the metadata extraction happen after the
 * response. `resourceId` is the media id once the operation has succeeded and
 * `null` while it has not, which is a state a script can branch on without
 * guessing.
 */
export async function mediaImport(
  context: CliContext,
  render: RenderInput,
  url: string,
  options: MediaImportOptions,
): Promise<void> {
  const destination = webUrlSchema.safeParse(url);
  if (!destination.success) {
    throw invalid('MEDIA_IMPORT_URL_MALFORMED');
  }
  if (options.idempotencyKey === undefined) {
    throw invalid('IDEMPOTENCY_KEY_REQUIRED');
  }

  const response = await context.api().request({
    method: 'POST',
    path: ROUTES.mediaImports(),
    schema: operationRefSchema,
    body: {
      url: destination.data,
      ...(options.projectId === undefined ? {} : { projectId: options.projectId }),
    },
    idempotencyKey: options.idempotencyKey,
  });

  const operation = response.data;
  renderSuccess({ ...render, correlationId: response.correlationId }, operation, [
    ...renderTable(
      ['field', 'value'],
      [
        ['operationId', operation.operationId],
        ['status', operation.status],
        ['resourceType', operation.resourceType ?? 'unavailable'],
        ['mediaId', operation.resourceId ?? 'unavailable'],
        ['createdAt', operation.createdAt],
        ['completedAt', operation.completedAt ?? 'unavailable'],
        ['errorCode', operation.error === null ? '' : operation.error.code],
      ],
    ),
  ]);
}
