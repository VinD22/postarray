'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api, newIdempotencyKey } from '@/lib/api';
import type {
  FeedHealthView as ApiFeedHealthView,
  FeedInput,
  FeedPreviewView,
  FeedView,
} from '@/lib/api';
import { useSession } from '@/lib/auth/session-context';

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

/**
 * The wizard's draft in the shape the API records. The wizard calls the feed's
 * name its title, which is the only place the two shapes disagree.
 */
export function toFeedInput(draft: FeedDraft, projectId: string): FeedInput {
  return {
    projectId,
    title: draft.title,
    feedUrl: draft.url,
    connectionIds: [...draft.connectionIds],
    publishPolicy: draft.policy,
    pollIntervalSeconds: 900,
  };
}

function toPartialFeedInput(draft: Partial<FeedDraft> & { readonly paused?: boolean }): Partial<
  Pick<FeedInput, 'title' | 'connectionIds' | 'publishPolicy' | 'pollIntervalSeconds'>
> & {
  readonly paused?: boolean;
} {
  return {
    ...(draft.title === undefined ? {} : { title: draft.title }),
    ...(draft.connectionIds === undefined ? {} : { connectionIds: [...draft.connectionIds] }),
    ...(draft.policy === undefined ? {} : { publishPolicy: draft.policy }),
    ...(draft.paused === undefined ? {} : { paused: draft.paused }),
  };
}

function requireValue<T>(value: T | null, code: string): T {
  if (value === null) throw new Error(code);
  return value;
}

function feedState(
  health: FeedView['health'] | ApiFeedHealthView['health'],
  paused: boolean,
): FeedSummaryView['health'] {
  if (paused) return 'paused';
  if (health === 'healthy') return 'ok';
  if (health === 'stalled') return 'stalled';
  return 'failing';
}

export function toFeedSummary(feed: FeedView): FeedSummaryView {
  return {
    id: feed.id,
    title: feed.title,
    url: feed.feedUrl,
    policy: feed.publishPolicy === 'approval' ? 'approval' : 'draft',
    health: feedState(feed.health, feed.paused),
    paused: feed.paused,
    lastPollAt: feed.lastPolledAt,
    lastNewItemAt: feed.lastNewItemAt,
  };
}

export function toFeedValidation(preview: FeedPreviewView): FeedValidation {
  const items = preview.sampleItems.flatMap((item, index) =>
    item.link === null
      ? []
      : [
          {
            id: item.guid || `${item.link}:${String(index)}`,
            title: item.title ?? item.link,
            summary: null,
            link: item.link,
            author: null,
            publishedAt: item.publishedAt,
            imageUrl: null,
            imageAlt: null,
            categories: [],
          },
        ],
  );
  const availableFields: FeedValidation['availableFields'] = [
    ...(preview.sampleItems.some((item) => item.title !== null) ? (['title'] as const) : []),
    ...(preview.sampleItems.some((item) => item.link !== null) ? (['link'] as const) : []),
    ...(preview.sampleItems.some((item) => item.publishedAt !== null)
      ? (['published'] as const)
      : []),
  ];
  return {
    url: preview.url,
    resolvedUrl: preview.url,
    title: preview.title ?? preview.url,
    itemCount: preview.itemCount,
    items,
    availableFields,
    reachable: preview.reachable,
    issueKeys: preview.issueKeys,
  };
}

export function toFeedHealth(health: ApiFeedHealthView): FeedHealthView {
  const paused = health.issueKeys.includes('rss.issue.paused');
  return {
    feedId: health.feedId,
    state: feedState(health.health, paused),
    lastPollAt: health.lastPolledAt,
    lastNewItemAt: health.lastNewItemAt,
    consecutiveFailures: health.consecutiveFailures,
    issueKeys: health.issueKeys,
    itemsLast30Days: health.itemsLast30Days,
    paused,
  };
}

export function useFeeds() {
  const { project } = useSession();
  return useQuery({
    queryKey: [...automationKeys.feeds, project?.id ?? 'none'],
    enabled: project !== null,
    queryFn: async (): Promise<readonly FeedSummaryView[]> => {
      const result = await api.rss.list({});
      return result.data.filter((feed) => feed.projectId === project?.id).map(toFeedSummary);
    },
  });
}

export function useFeedHealth(feedId: string, enabled = true) {
  return useQuery({
    queryKey: automationKeys.feedHealth(feedId),
    enabled,
    queryFn: async (): Promise<FeedHealthView> =>
      toFeedHealth(requireValue(await api.rss.getHealth(feedId), 'FEED_HEALTH_NOT_AVAILABLE')),
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
      toFeedValidation(
        requireValue(await api.rss.validateFeed({ url }), 'FEED_PREVIEW_NOT_AVAILABLE'),
      ),
  });
}

export function useCreateFeed() {
  const client = useQueryClient();
  const { project } = useSession();
  return useMutation({
    mutationFn: async (draft: FeedDraft): Promise<FeedSummaryView> => {
      const projectId = project?.id;
      if (projectId === undefined) throw new Error('ACTIVE_PROJECT_REQUIRED');
      return toFeedSummary(
        requireValue(
          await api.rss.create(toFeedInput(draft, projectId), newIdempotencyKey('feed')),
          'FEED_SAVE_NOT_AVAILABLE',
        ),
      );
    },
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
      readonly draft: Partial<FeedDraft> & { readonly paused?: boolean };
    }): Promise<FeedSummaryView> =>
      toFeedSummary(
        requireValue(
          await api.rss.update(input.feedId, toPartialFeedInput(input.draft)),
          'FEED_SAVE_NOT_AVAILABLE',
        ),
      ),
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
