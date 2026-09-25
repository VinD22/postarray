'use client';

/**
 * Everything the preview needs to know about the draft's attachments.
 *
 * One query per attachment, fetching its metadata and its read URLs together.
 * The library screen and the picker fetch the same rows under the same keys,
 * so opening the preview after choosing a file usually costs nothing.
 *
 * An id that has not answered yet reports `loading`, which the tile renders as
 * a skeleton. An asset whose bytes are gone reports `available: false`, which
 * is a different tile with a different sentence, because "we are still asking"
 * and "this file is not there" are different facts.
 */

import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { mediaReadUrlsStaleTimeMs } from '@relay/contracts';

import { api } from '@/lib/api/client';
import { keys } from '@/lib/api/keys';
import { useWorkspaceId } from '@/lib/auth/session-context';

import type { PreviewMediaFacts, PreviewMediaLookup } from './build-preview-model';
import { displayableMediaUrl } from './media-source';

interface Loaded {
  readonly asset: Awaited<ReturnType<typeof api.media.get>>;
  readonly urls: Awaited<ReturnType<typeof api.media.getReadUrls>>;
}

export function usePreviewMedia(mediaIds: readonly string[]): PreviewMediaLookup {
  const workspaceId = useWorkspaceId();
  const unique = useMemo(() => [...new Set(mediaIds)], [mediaIds]);

  const results = useQueries({
    queries: unique.map((mediaId) => ({
      queryKey: [...keys.media(workspaceId), 'preview', mediaId] as const,
      queryFn: async (): Promise<Loaded> => {
        const [asset, urls] = await Promise.all([
          api.media.get(mediaId),
          api.media.getReadUrls(mediaId),
        ]);
        return { asset, urls };
      },
      staleTime: (query: { state: { data?: Loaded } }) => {
        const data = query.state.data;
        return data === undefined ? 0 : mediaReadUrlsStaleTimeMs(data.urls, Date.now());
      },
    })),
  });

  return useMemo(() => {
    const byId = new Map<string, PreviewMediaFacts>();
    unique.forEach((mediaId, index) => {
      const result = results[index];
      if (result === undefined) {
        return;
      }
      if (result.isPending) {
        byId.set(mediaId, {
          id: mediaId,
          kind: 'image',
          altText: null,
          altTextWaived: false,
          width: null,
          height: null,
          durationMs: null,
          available: true,
          loading: true,
          thumbnailUrl: null,
        });
        return;
      }
      const asset = result.data?.asset ?? null;
      const urls = result.data?.urls ?? null;
      const kind = asset?.kind ?? 'image';
      byId.set(mediaId, {
        id: mediaId,
        kind,
        altText: asset?.altText ?? null,
        altTextWaived: asset?.altTextWaived ?? false,
        width: asset?.width ?? null,
        height: asset?.height ?? null,
        durationMs: asset?.durationMs ?? null,
        available: asset?.storageAvailable ?? false,
        loading: false,
        thumbnailUrl: displayableMediaUrl(kind, urls),
      });
    });
    return { get: (mediaId: string) => byId.get(mediaId) ?? null };
    // `results` is a new array each render; its contents are what matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unique, results.map((result) => `${result.status}:${result.dataUpdatedAt}`).join('|')]);
}
