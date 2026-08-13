import { describe, expect, it, vi } from 'vitest';

import type { ContentService, ServiceDeps, WorkerActivityContext } from '../types';

let activeDb: Record<string, unknown>;
vi.mock('../internal/runtime', () => ({
  runInWorkspace: async (
    _deps: unknown,
    _ctx: unknown,
    handler: (db: unknown) => Promise<unknown>,
  ) => handler(activeDb),
}));

const safeFetch = vi.fn();
vi.mock('@relay/connectors', () => ({ safeFetch: (...args: unknown[]) => safeFetch(...args) }));

import { createWorkerRssService } from './worker-rss';
import { feedItemFingerprint } from './rss';

const ctx: WorkerActivityContext = {
  workspaceId: 'ws_1',
  correlationId: 'corr_1',
  actorId: 'worker',
  actorType: 'system',
  surface: 'automation_rule',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

const FEED_XML = [
  '<rss><channel><title>Blog</title>',
  '<item><title>A release</title><link>https://example.test/a</link><guid>g-a</guid></item>',
  '</channel></rss>',
].join('');

const feedRow = {
  id: 'rss_1',
  brandId: 'brand_1',
  feedUrl: 'https://example.test/feed.xml',
  title: 'Blog',
  publishPolicy: 'draft',
  pausedAt: null,
};

function service(content: Partial<ContentService> = {}) {
  return createWorkerRssService(
    { clock: { now: () => new Date('2026-08-13T00:00:00.000Z') } } as ServiceDeps,
    { createDraft: vi.fn(), ...content } as unknown as ContentService,
  );
}

function response(overrides: Record<string, unknown> = {}) {
  return {
    status: 200,
    headers: { etag: 'W/"v2"', 'last-modified': 'Tue, 12 Aug 2026 00:00:00 GMT' },
    body: new TextEncoder().encode(FEED_XML),
    ...overrides,
  };
}

describe('worker feed fetch', () => {
  it('sends the stored validators and reports an unchanged feed as unchanged', async () => {
    activeDb = { rssFeed: { findFirst: vi.fn().mockResolvedValue(feedRow) } };
    safeFetch.mockResolvedValue(response({ status: 304, headers: {}, body: new Uint8Array(0) }));

    const result = await service().fetchFeed({
      ctx,
      feedId: 'rss_1',
      etag: 'W/"v1"',
      lastModified: 'Mon, 11 Aug 2026 00:00:00 GMT',
    });

    expect(safeFetch).toHaveBeenCalledWith(
      feedRow.feedUrl,
      expect.objectContaining({
        headers: expect.objectContaining({
          'if-none-match': 'W/"v1"',
          'if-modified-since': 'Mon, 11 Aug 2026 00:00:00 GMT',
        }),
      }),
    );
    // A 304 keeps the validators it was given. Dropping them would make every
    // later poll unconditional.
    expect(result).toMatchObject({ changed: false, etag: 'W/"v1"', items: [], errorCode: null });
  });

  it('reports a blocked URL as an error code instead of throwing', async () => {
    activeDb = { rssFeed: { findFirst: vi.fn().mockResolvedValue(feedRow) } };
    const { SsrfBlockedError } = await import('@relay/contracts');
    safeFetch.mockRejectedValue(
      new SsrfBlockedError({ messageKey: 'errors.url_private_address_blocked', details: {} }),
    );

    const result = await service().fetchFeed({
      ctx,
      feedId: 'rss_1',
      etag: null,
      lastModified: null,
    });

    expect(result).toMatchObject({ changed: false, errorCode: 'SSRF_BLOCKED', items: [] });
  });

  it('fingerprints each item over its guid, link and title together', async () => {
    activeDb = { rssFeed: { findFirst: vi.fn().mockResolvedValue(feedRow) } };
    safeFetch.mockResolvedValue(response());

    const result = await service().fetchFeed({
      ctx,
      feedId: 'rss_1',
      etag: null,
      lastModified: null,
    });

    expect(result.changed).toBe(true);
    expect(result.etag).toBe('W/"v2"');
    expect(result.items).toEqual([
      {
        guid: 'g-a',
        link: 'https://example.test/a',
        contentFingerprint: feedItemFingerprint({
          guid: 'g-a',
          link: 'https://example.test/a',
          title: 'A release',
        }),
        publishedAt: null,
      },
    ]);
  });
});

describe('worker feed deduplication', () => {
  it('keeps only the items no stored row already claims', async () => {
    activeDb = {
      rssFeedItem: { findMany: vi.fn().mockResolvedValue([{ fingerprint: 'seen' }]) },
    };

    const result = await service().filterNewFeedItems({
      ctx,
      feedId: 'rss_1',
      items: [
        { guid: 'a', link: null, contentFingerprint: 'seen', publishedAt: null },
        { guid: 'b', link: null, contentFingerprint: 'fresh', publishedAt: null },
      ],
    });

    expect(result.duplicateCount).toBe(1);
    expect(result.newItems.map((item) => item.guid)).toEqual(['b']);
  });
});

describe('worker feed processing', () => {
  it('creates a draft through the content service and never names a connection', async () => {
    const createDraft = vi.fn().mockResolvedValue({ id: 'content_1' });
    activeDb = {
      rssFeed: { findFirst: vi.fn().mockResolvedValue(feedRow) },
      rssFeedItem: { upsert: vi.fn().mockResolvedValue({ id: 'rssitem_1' }) },
    };
    safeFetch.mockResolvedValue(response());
    const fingerprint = feedItemFingerprint({
      guid: 'g-a',
      link: 'https://example.test/a',
      title: 'A release',
    });

    const result = await service({ createDraft }).processFeedItems({
      ctx,
      feedId: 'rss_1',
      items: [
        {
          guid: 'g-a',
          link: 'https://example.test/a',
          contentFingerprint: fingerprint,
          publishedAt: null,
        },
      ],
    });

    expect(result.createdContentItemIds).toEqual(['content_1']);
    const draft = createDraft.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(draft['brandId']).toBe('brand_1');
    // The standing rule: inbound automation may propose a post, never decide
    // which account publishes it.
    expect(draft).not.toHaveProperty('targets');
    expect(JSON.stringify(draft)).not.toContain('conn_');
  });

  it('does nothing at all for a paused feed', async () => {
    const createDraft = vi.fn();
    activeDb = {
      rssFeed: { findFirst: vi.fn().mockResolvedValue({ ...feedRow, pausedAt: new Date() }) },
    };

    const result = await service({ createDraft }).processFeedItems({
      ctx,
      feedId: 'rss_1',
      items: [{ guid: 'g-a', link: null, contentFingerprint: 'f', publishedAt: null }],
    });

    expect(createDraft).not.toHaveBeenCalled();
    expect(result).toEqual({ createdContentItemIds: [], skippedCount: 1 });
  });
});

describe('worker feed health', () => {
  it('records a failed poll as degraded, carrying the error code', async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    activeDb = { rssFeed: { updateMany } };

    await service().recordFeedPoll({
      ctx,
      feedId: 'rss_1',
      polledAt: '2026-08-13T00:00:00.000Z',
      itemCount: 0,
      newItemCount: 0,
      errorCode: 'PROVIDER_UNAVAILABLE',
    });

    expect(updateMany.mock.calls[0]?.[0]?.data).toMatchObject({
      health: 'degraded',
      lastError: 'PROVIDER_UNAVAILABLE',
    });
  });

  it('records a healthy poll and stamps the last new item only when there was one', async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    activeDb = { rssFeed: { updateMany } };

    await service().recordFeedPoll({
      ctx,
      feedId: 'rss_1',
      polledAt: '2026-08-13T00:00:00.000Z',
      itemCount: 3,
      newItemCount: 0,
      errorCode: null,
    });

    const data = updateMany.mock.calls[0]?.[0]?.data as Record<string, unknown>;
    expect(data['health']).toBe('healthy');
    expect(data).not.toHaveProperty('lastNewItemAt');
  });
});
