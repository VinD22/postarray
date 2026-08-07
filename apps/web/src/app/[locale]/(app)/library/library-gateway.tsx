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
import type { AccountRule, LibraryStatus, MediaAsset, UploadTransport } from '@/features/media';
import { sha256File } from '@/features/media/state/file-checksum';

import { LibraryClient } from './library-client';

export interface LibraryGatewayProps {
  readonly status: LibraryStatus;
  readonly assets: readonly MediaAsset[];
  readonly rules: readonly AccountRule[];
  readonly timeZone: string;
  readonly errorReference?: string;
  readonly rateLimitResetAt?: string;
  /** True when no API is configured and the screen is showing seeded content. */
  readonly readOnly: boolean;
}

export function LibraryGateway(props: LibraryGatewayProps): ReactNode {
  const router = useRouter();
  const refresh = useCallback(() => router.refresh(), [router]);

  const transport = useMemo<UploadTransport>(() => {
    const headersByUrl = new Map<string, Readonly<Record<string, string>>>();
    return {
      createUploadUrl: async (file, signal) => {
        const sha256 = await sha256File(file, signal);
        const created = await api.media.createUploadUrl(
          {
            filename: file.name,
            mimeType: file.type,
            byteSize: file.size,
            sha256,
          },
          newIdempotencyKey('media_upload'),
        );
        headersByUrl.set(created.uploadUrl, created.headers);
        // The reserved media id is the handle the resumable session is
        // finalized against, so it travels with the queue item as its upload id.
        return { uploadUrl: created.uploadUrl, uploadId: created.mediaId };
      },
      // Neon accepts one signed PUT. A retry reuses the media reservation but
      // sends the current file again; the UI does not claim byte-level resume.
      sendChunk: async (uploadUrl, file, offset, signal) => {
        if (offset > 0) {
          return file.size;
        }
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            ...headersByUrl.get(uploadUrl),
          },
          body: file,
          signal,
        });
        if (!response.ok) {
          throw new Error('UPLOAD_CHUNK_FAILED');
        }
        return file.size;
      },
      // Finalization re-reads object metadata and verifies it against the
      // checksum recorded when the ticket was created.
      finalize: async (uploadId, _file) => {
        const finalized = await api.media.finalizeUpload(
          uploadId,
          newIdempotencyKey('media_finalize'),
        );
        if (finalized === null) {
          throw new Error('UPLOAD_FINALIZE_FAILED');
        }
        return { mediaId: finalized.id };
      },
    };
  }, []);

  return (
    <LibraryClient
      status={props.status}
      assets={props.assets}
      rules={props.rules}
      timeZone={props.timeZone}
      {...(props.rateLimitResetAt ? { rateLimitResetAt: props.rateLimitResetAt } : {})}
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
          waived: input.waived,
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
    />
  );
}
