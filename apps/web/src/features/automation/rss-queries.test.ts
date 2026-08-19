import { describe, expect, it } from 'vitest';

import { toFeedHealth, toFeedInput, toFeedValidation } from './rss-queries';

describe('RSS API adapters', () => {
  it('sends only feed settings the application service persists', () => {
    expect(
      toFeedInput(
        {
          url: 'https://example.test/feed.xml',
          title: 'Example feed',
          connectionIds: ['conn_01'],
          policy: 'approval',
        },
        'project_01',
      ),
    ).toEqual({
      projectId: 'project_01',
      title: 'Example feed',
      feedUrl: 'https://example.test/feed.xml',
      connectionIds: ['conn_01'],
      publishPolicy: 'approval',
      pollIntervalSeconds: 900,
    });
  });

  it('keeps the reported item count while omitting samples without a usable link', () => {
    const result = toFeedValidation({
      url: 'https://example.test/feed.xml',
      title: 'Example feed',
      itemCount: 12,
      latestItemAt: '2026-08-06T00:00:00.000Z',
      reachable: true,
      issueKeys: [],
      sampleItems: [
        {
          guid: 'one',
          title: 'One',
          link: 'https://example.test/one',
          publishedAt: '2026-08-06T00:00:00.000Z',
        },
        { guid: 'two', title: 'Two', link: null, publishedAt: null },
      ],
    });

    expect(result.itemCount).toBe(12);
    expect(result.items).toHaveLength(1);
    expect(result.availableFields).toEqual(['title', 'link', 'published']);
  });

  it('reports a paused feed from the server issue state', () => {
    expect(
      toFeedHealth({
        feedId: 'feed_01',
        health: 'healthy',
        lastPolledAt: null,
        lastNewItemAt: null,
        consecutiveFailures: 0,
        issueKeys: ['rss.issue.paused'],
        itemsLast30Days: 0,
      }),
    ).toMatchObject({ state: 'paused', paused: true, itemsLast30Days: 0 });
  });
});
