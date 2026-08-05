'use client';

/**
 * The library's own gateway.
 *
 * A client boundary because uploads are a browser concern: chunking, aborting
 * and resuming all need the `File` object, which never crosses to the server.
 * Everything it calls is the same API surface the CLI and MCP use.
 */

import { useCallback, useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { api, newIdempotencyKey } from '@/lib/api';
import type {
  AccountRule,
  LibraryStatus,
  MediaAsset,
  MediaEditPlan,
  UploadTransport,
} from '@/features/media';

import { LibraryClient } from './library-client';

export interface LibraryGatewayProps {
  readonly status: LibraryStatus;
  readonly assets: readonly MediaAsset[];
  readonly rules: readonly AccountRule[];
  readonly timeZone: string;
  readonly errorReference?: string;
  /** True when no API is configured and the screen is showing seeded content. */
  readonly readOnly: boolean;
}

export function LibraryGateway(props: LibraryGatewayProps): ReactNode {
  const router = useRouter();
  const refresh = useCallback(() => router.refresh(), [router]);

  const transport = useMemo<UploadTransport>(
    () => ({
      createUploadUrl: async (file) => {
        const created = await api.media.createUploadUrl(
          {
            fileName: file.name,
            mimeType: file.type,
            byteSize: file.size,
          },
          newIdempotencyKey('media_upload'),
        );
        // The reserved media id is the handle the resumable session is
        // finalized against, so it travels with the queue item as its upload id.
        return { uploadUrl: created.uploadUrl, uploadId: created.mediaId };
      },
      // One chunk per call, resumable: the offset is authoritative, so a retry
      // after a dropped connection continues rather than duplicating bytes.
      sendChunk: async (uploadUrl, file, offset, signal) => {
        const end = Math.min(offset + 4 * 1024 * 1024, file.size);
        const response = await fetch(uploadUrl, {
          method: 'PATCH',
          headers: {
            'content-type': 'application/offset+octet-stream',
            'upload-offset': String(offset),
          },
          body: file.slice(offset, end),
          signal,
        });
        if (!response.ok) {
          throw new Error('UPLOAD_CHUNK_FAILED');
        }
        const confirmed = Number(response.headers.get('upload-offset') ?? end);
        return Number.isFinite(confirmed) ? confirmed : end;
      },
      // The checksum is computed over the file the browser actually holds, so
      // the server can reject a session whose stored bytes drifted from it.
      finalize: async (uploadId, file) => {
        const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
        const checksum = Array.from(new Uint8Array(digest))
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('');
        const finalized = await api.media.finalizeUpload(
          uploadId,
          // Rights are declared on the asset afterwards, on the rights form.
          { checksum, rightsDeclared: false },
          newIdempotencyKey('media_finalize'),
        );
        if (finalized === null) {
          throw new Error('UPLOAD_FINALIZE_FAILED');
        }
        return { mediaId: finalized.id };
      },
    }),
    [],
  );

  return (
    <LibraryClient
      status={props.status}
      assets={props.assets}
      rules={props.rules}
      timeZone={props.timeZone}
      transport={transport}
      onRefresh={refresh}
      {...(props.errorReference ? { errorReference: props.errorReference } : {})}
      onSaveAltText={async (assetId, input) => {
        if (props.readOnly) {
          return;
        }
        const waivedReason =
          input.waived && input.waivedReason !== null && input.waivedReason.length > 0
            ? input.waivedReason
            : undefined;
        await api.media.setAltText(assetId, {
          altText: input.altText,
          ...(waivedReason === undefined ? {} : { waivedReason }),
        });
        refresh();
      }}
      onSaveRights={async (assetId, declaration) => {
        if (props.readOnly) {
          return;
        }
        await api.media.declareRights(assetId, declaration);
        refresh();
      }}
      onSaveEdit={async (assetId, plan: MediaEditPlan) => {
        if (props.readOnly) {
          return;
        }
        // The edit creates a new version. The original is never overwritten.
        await api.media.edit(assetId, plan);
        refresh();
      }}
      onRestoreVersion={async (assetId, version) => {
        if (props.readOnly) {
          return;
        }
        await api.media.restoreVersion(
          assetId,
          version,
          newIdempotencyKey('media_restore'),
        );
        refresh();
      }}
    />
  );
}
