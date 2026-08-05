'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api, newIdempotencyKey } from '@/lib/api';

import { automationKeys } from './queries';
import type { FeedDraft, FeedHealthView, FeedSummaryView, FeedValidation } from './rss-types';

/**
 * RSS feeds.
 *
 * Validation is a server call rather than a browser fetch, and that is a
 * security property rather than an implementation detail: the server refuses
 * private network addresses and redirect chains that a browser would happily
 * follow. The wizard therefore cannot show a preview until the server has
 * fetched and parsed the feed itself.
 */

/** TODO(web): depends on `@/lib/api` publishing typed RSS view models. */
function adapt<T>(value: unknown): T {
  return value as T;
}

export function useFeeds() {
  return useQuery({
    queryKey: automationKeys.feeds,
    queryFn: async (): Promise<readonly FeedSummaryView[]> => {
      const result = await api.rss.list({});
      return adapt<{ readonly data: readonly FeedSummaryView[] }>(result).data;
    },
  });
}

export function useFeedHealth(feedId: string, enabled = true) {
  return useQuery({
    queryKey: automationKeys.feedHealth(feedId),
    enabled,
    queryFn: async (): Promise<FeedHealthView> =>
      adapt<FeedHealthView>(await api.rss.getHealth(feedId)),
  });
}

/**
 * Validate a feed URL on the server and return the parsed preview.
 *
 * A mutation rather than a query because the user asks for it explicitly, and
 * because fetching somebody else's server should happen when a person pressed a
 * button, not whenever a component remounted.
 */
export function useValidateFeed() {
  return useMutation({
    mutationFn: async (url: string): Promise<FeedValidation> =>
      adapt<FeedValidation>(await api.rss.validateFeed({ url })),
  });
}

export function useCreateFeed() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (draft: FeedDraft): Promise<FeedSummaryView> =>
      adapt<FeedSummaryView>(await api.rss.create(draft, newIdempotencyKey('feed'))),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: automationKeys.feeds });
    },
  });
}

export function useUpdateFeed() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      readonly feedId: string;
      readonly draft: Partial<FeedDraft>;
    }): Promise<FeedSummaryView> =>
      adapt<FeedSummaryView>(await api.rss.update(input.feedId, input.draft)),
    onSuccess: (_result, input) => {
      void client.invalidateQueries({ queryKey: automationKeys.feeds });
      void client.invalidateQueries({ queryKey: automationKeys.feed(input.feedId) });
      void client.invalidateQueries({ queryKey: automationKeys.feedHealth(input.feedId) });
    },
  });
}

export function useDeleteFeed() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (feedId: string): Promise<void> => {
      await api.rss.delete(feedId);
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: automationKeys.feeds });
    },
  });
}
