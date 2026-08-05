'use client';

/**
 * A resumable upload queue.
 *
 * Two behaviours matter here. First, a file is validated against the accounts
 * in play before a single byte leaves the browser, so a rejection is a sentence
 * rather than a failed request. Second, a paused or dropped upload keeps its
 * session URL and its sent byte count, so reconnecting continues instead of
 * starting again.
 */

import { useCallback, useRef, useState } from 'react';
import { useAnnouncer } from '@relay/design-system/hooks';
import type { MediaKind } from '@relay/contracts';

import { checkFile, type AccountRule } from '../state/media-rules';
import type { UploadItem } from '../types';

export interface UploadTransport {
  /** Reserve a resumable session. Returns the URL bytes are sent to. */
  createUploadUrl: (file: File) => Promise<{ uploadUrl: string; uploadId: string }>;
  /** Send one chunk. Resolves with the total bytes the server now holds. */
  sendChunk: (
    uploadUrl: string,
    file: File,
    offset: number,
    signal: AbortSignal,
  ) => Promise<number>;
  /**
   * Commit the upload and return the stored media id. The file is handed back
   * so the caller can checksum the bytes it sent before committing them.
   */
  finalize: (uploadId: string, file: File) => Promise<{ mediaId: string }>;
}

export interface UploadQueueMessages {
  readonly progress: (name: string, percent: string) => string;
  readonly complete: (name: string) => string;
  readonly failed: (name: string) => string;
}

function kindOf(mimeType: string): MediaKind {
  if (mimeType === 'image/gif') return 'gif';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
}

export interface UseUploadQueueOptions {
  readonly rules: readonly AccountRule[];
  readonly transport: UploadTransport;
  readonly messages: UploadQueueMessages;
  readonly onUploaded: (mediaId: string) => void;
}

export interface UploadQueue {
  readonly items: readonly UploadItem[];
  readonly enqueue: (files: readonly File[]) => void;
  readonly pause: (id: string) => void;
  readonly resume: (id: string) => void;
  readonly cancel: (id: string) => void;
  readonly retry: (id: string) => void;
}

export function useUploadQueue({
  rules,
  transport,
  messages,
  onUploaded,
}: UseUploadQueueOptions): UploadQueue {
  const { announce } = useAnnouncer();
  const [items, setItems] = useState<readonly UploadItem[]>([]);
  const files = useRef(new Map<string, File>());
  const controllers = useRef(new Map<string, AbortController>());

  // A ref mirror so `run` reads the current progress without re-subscribing.
  const itemsRef = useRef<readonly UploadItem[]>([]);
  itemsRef.current = items;

  const patch = useCallback((id: string, next: Partial<UploadItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...next } : item)));
  }, []);

  const run = useCallback(
    async (id: string) => {
      const file = files.current.get(id);
      if (!file) {
        return;
      }
      const controller = new AbortController();
      controllers.current.set(id, controller);

      try {
        setItems((current) =>
          current.map((item) =>
            item.id === id ? { ...item, status: 'uploading' as const } : item,
          ),
        );

        let session = itemsRef.current.find((item) => item.id === id)?.uploadUrl ?? null;
        let uploadId = id;
        if (session === null) {
          const created = await transport.createUploadUrl(file);
          session = created.uploadUrl;
          uploadId = created.uploadId;
          patch(id, { uploadUrl: session });
        }

        let offset = itemsRef.current.find((item) => item.id === id)?.sentBytes ?? 0;
        while (offset < file.size) {
          if (controller.signal.aborted) {
            return;
          }
          offset = await transport.sendChunk(session, file, offset, controller.signal);
          patch(id, { sentBytes: offset });
          announce(
            messages.progress(file.name, `${Math.round((offset / file.size) * 100)}%`),
            'polite',
          );
        }

        patch(id, { status: 'finalizing' });
        const { mediaId } = await transport.finalize(uploadId, file);
        patch(id, { status: 'done', mediaId });
        announce(messages.complete(file.name), 'polite');
        onUploaded(mediaId);
      } catch {
        if (!controller.signal.aborted) {
          patch(id, { status: 'failed' });
          announce(messages.failed(file.name), 'assertive');
        }
      } finally {
        controllers.current.delete(id);
      }
    },
    [announce, messages, onUploaded, patch, transport],
  );

  const enqueue = useCallback(
    (incoming: readonly File[]) => {
      const created: UploadItem[] = [];
      for (const file of incoming) {
        const id = `upload_${file.name}_${file.size}_${Date.now()}`;
        files.current.set(id, file);
        const verdict = checkFile(
          {
            name: file.name,
            mimeType: file.type,
            bytes: file.size,
            kind: kindOf(file.type),
          },
          rules,
        );
        const firstRejection = verdict.rejections[0];
        created.push({
          id,
          name: file.name,
          mimeType: file.type,
          bytes: file.size,
          sentBytes: 0,
          status: verdict.usable ? 'queued' : 'rejected',
          uploadUrl: null,
          reason:
            verdict.usable || firstRejection === undefined
              ? null
              : { key: firstRejection.key, values: firstRejection.values },
          mediaId: null,
        });
      }
      setItems((current) => [...current, ...created]);
      for (const item of created) {
        if (item.status === 'queued') {
          void run(item.id);
        }
      }
    },
    [rules, run],
  );

  const pause = useCallback(
    (id: string) => {
      controllers.current.get(id)?.abort();
      patch(id, { status: 'paused' });
    },
    [patch],
  );

  const resume = useCallback((id: string) => void run(id), [run]);

  const cancel = useCallback((id: string) => {
    controllers.current.get(id)?.abort();
    files.current.delete(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const retry = useCallback(
    (id: string) => {
      patch(id, { status: 'queued' });
      void run(id);
    },
    [patch, run],
  );

  return { items, enqueue, pause, resume, cancel, retry };
}
