'use client';

/**
 * Signed read URLs for one media asset.
 *
 * The URLs expire, so the query's freshness is derived from the soonest expiry
 * minus a minute rather than from a fixed number. A thumbnail therefore
 * refreshes before it breaks instead of after somebody notices it has.
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { mediaReadUrlsStaleTimeMs, type MediaReadUrls } from '@relay/contracts';

import { api } from '@/lib/api/client';
import type { ApiError } from '@/lib/api/error';
import { keys } from '@/lib/api/keys';
import { useWorkspaceId } from '@/lib/auth/session-context';

export function mediaReadUrlsKey(workspaceId: string, mediaId: string): readonly unknown[] {
  return [...keys.media(workspaceId), 'read-urls', mediaId];
}

export function useMediaReadUrls(mediaId: string): UseQueryResult<MediaReadUrls, ApiError> {
  const workspaceId = useWorkspaceId();
  return useQuery({
    queryKey: mediaReadUrlsKey(workspaceId, mediaId),
    queryFn: () => api.media.getReadUrls(mediaId),
    staleTime: (query) => {
      const data = query.state.data;
      return data === undefined ? 0 : mediaReadUrlsStaleTimeMs(data, Date.now());
    },
  });
}
