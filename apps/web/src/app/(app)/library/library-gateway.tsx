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

import { api } from '@/lib/api';
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
        const created = await api.media.createUploadUrl({
          filename: file.name,
          mimeType: file.type,
          bytes: file.size,
        });
        return { uploadUrl: created.uploadUrl, uploadId: created.uploadId };
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
      finalize: async (uploadId) => {
        const finalized = await api.media.finalizeUpload(uploadId);
        return { mediaId: finalized.mediaId };
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
        await api.media.setAltText(assetId, {
          altText: input.altText,
          waived: input.waived,
          waivedReason: input.waivedReason,
        });
        refresh();
      }}
      onSaveRights={async (assetId, declaration) => {
        if (props.readOnly) {
          return;
        }
        await api.media.edit(assetId, { rights: declaration });
        refresh();
      }}
      onSaveEdit={async (assetId, plan: MediaEditPlan) => {
        if (props.readOnly) {
          return;
        }
        // The edit creates a new version. The original is never overwritten.
        await api.media.edit(assetId, { edit: plan });
        refresh();
      }}
      onRestoreVersion={async (assetId, version) => {
        if (props.readOnly) {
          return;
        }
        await api.media.edit(assetId, { restoreVersion: version });
        refresh();
      }}
    />
  );
}
