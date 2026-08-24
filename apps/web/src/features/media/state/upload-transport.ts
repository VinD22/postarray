'use client';

/**
 * The one upload transport.
 *
 * The library and the composer both put files into the same place, so they use
 * the same transport rather than each hand-rolling a `fetch`. The bytes go
 * through `sendUpload`, which decides by origin whether the ticket points at
 * Post Array's own storage endpoint (session cookie, CSRF token and workspace
 * header required, because web and api are different origins) or at a remote
 * presigned URL (no cookies, no Post Array headers, the signature is the credential).
 */

import { api, newIdempotencyKey, sendUpload } from '@/lib/api';

import type { UploadTransport } from '../hooks/use-upload-queue';
import { sha256File } from './file-checksum';

export function createUploadTransport(projectId: string | null): UploadTransport {
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
          projectId,
        },
        newIdempotencyKey('media_upload'),
      );
      headersByUrl.set(created.uploadUrl, created.headers);
      // The reserved media id is the handle the session is finalized against,
      // so it travels with the queue item as its upload id.
      return { uploadUrl: created.uploadUrl, uploadId: created.mediaId };
    },

    // One signed PUT per file. A retry reuses the media reservation but sends
    // the current file again; the UI does not claim byte-level resume.
    sendChunk: async (uploadUrl, file, offset, signal) => {
      if (offset > 0) {
        return file.size;
      }
      const ticketHeaders = headersByUrl.get(uploadUrl);
      await sendUpload(uploadUrl, file, {
        ...(ticketHeaders === undefined ? {} : { ticketHeaders }),
        signal,
      });
      return file.size;
    },

    // Finalization re-reads object metadata and verifies it against the
    // checksum recorded when the ticket was created.
    finalize: async (uploadId) => {
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
}
