import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  expectPartial,
  expectPublished,
  type TestDepsOptions,
} from '../shared/testing';
import {
  testConnection,
  testDraft,
  testGrant,
  testMedia,
  testPublishRequest,
  testStatusRequest,
  testThreadItem,
} from '../shared/testing';
import { createMastodonConnector } from './connector';
import { buildMastodonCapabilities } from './capabilities';

const NOW = '2026-08-04T12:00:00.000Z';

function connectorFor(routes: TestDepsOptions['routes']) {
  return createTestDeps({ routes, now: new Date(NOW) });
}

const connection = () =>
  testConnection({
    provider: 'mastodon',
    externalAccountId: 'account-1234',
    metadata: { acct: 'sam@mastodon.invalid', instanceUrl: 'https://mastodon.invalid' },
  });

const accountRoute = {
  method: 'GET' as const,
  match: '/api/v1/accounts/verify_credentials',
  body: {
    id: 'account-1234',
    username: 'sam',
    acct: 'sam@mastodon.invalid',
    display_name: 'Sam Sample',
    avatar: null,
    url: 'https://mastodon.invalid/@sam',
    statuses_count: 12,
    followers_count: 34,
    following_count: 5,
  },
};

const statusRoute = {
  method: 'POST' as const,
  match: '/api/v1/statuses',
  body: {
    id: 'status-9001',
    uri: 'https://mastodon.invalid/@sam/status-9001',
    url: 'https://mastodon.invalid/@sam/status-9001',
    content: '<p>A post</p>',
    created_at: NOW,
    reblogs_count: 0,
    favourites_count: 0,
    replies_count: 0,
  },
};

describe('mastodon connector', () => {
  it('declares honest identity metadata', () => {
    const { deps } = connectorFor([]);
    const connector = createMastodonConnector(deps);
    expect(connector.identity().provider).toBe('mastodon');
    expect(connector.identity().features['publish']).toBe('supported');
    expect(connector.identity().features['provider_idempotency']).toBe('unsupported');
  });

  it('discovers exactly the connected account', async () => {
    const { deps } = connectorFor([accountRoute]);
    const connector = createMastodonConnector(deps);
    const grant = testGrant({ provider: 'mastodon', scopes: ['read', 'write:statuses'] });
    const accounts = await connector.discoverAccounts(grant);
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.externalAccountId).toBe('account-1234');
    expect(accounts[0]?.handle).toBe('sam@mastodon.invalid');
    expect(accounts[0]?.metadata).toEqual({
      acct: 'sam@mastodon.invalid',
      instanceUrl: 'https://mastodon.invalid',
    });
  });

  it('publishes a text post and returns external evidence', async () => {
    const { deps, simulator } = connectorFor([statusRoute]);
    const connector = createMastodonConnector(deps);
    const snap = buildMastodonCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      body: 'A calm, specific sentence about the product.',
      privacyValue: 'public',
    });
    const result = expectPublished(
      await connector.publish(testPublishRequest({ draft, preparedMedia: [] })),
    );
    expect(result.externalPostId).toBe('status-9001');
    expect(result.permalink).toBe('https://mastodon.invalid/@sam/status-9001');

    const sent = simulator.callsTo('/api/v1/statuses')[0];
    expect(sent?.json).toMatchObject({
      status: 'A calm, specific sentence about the product.',
      visibility: 'public',
    });
  });

  it('reports delayed thread parts as pending instead of creating them', async () => {
    const { deps } = connectorFor([statusRoute]);
    const connector = createMastodonConnector(deps);
    const snap = buildMastodonCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      body: 'Root',
      threadItems: [testThreadItem(1, 'A delayed part', 'thread', 60)],
    });
    // The delayed part is handed to a later activity by the worker.
    const partial = expectPartial(
      await connector.publish(testPublishRequest({ draft, preparedMedia: [] })),
    );
    expect(partial.externalPostId).toBe('status-9001');
  });

  it('uploads image media through the multipart media endpoint', async () => {
    const { deps, simulator } = connectorFor([
      {
        method: 'GET',
        match: 'storage.invalid/media/sample',
        bytes: new Uint8Array([1, 2, 3, 4]),
      },
      { method: 'POST', match: '/api/v1/media', body: { id: 'media-77', type: 'image' } },
    ]);
    const connector = createMastodonConnector(deps);
    const snap = buildMastodonCapabilities({ connection: connection(), observedAt: NOW });
    const media = [testMedia({ altText: 'A sample photograph.' })];
    const prepared = await connector.prepareMedia({
      connection: connection(),
      postVariantId: 'pv_test_0001',
      contentKind: 'image',
      media,
      idempotencyKey: 'idem-test-00000001',
      capabilities: snap,
    });
    expect(prepared[0]?.providerMediaId).toBe('media-77');
    expect(simulator.callsTo('/api/v1/media')[0]?.url).toContain('mastodon.invalid');
  });

  it('reads post status and reports a 404 as permanent failure', async () => {
    const { deps } = connectorFor([
      {
        method: 'GET',
        match: '/api/v1/statuses/status-9001',
        body: { ...statusRoute.body },
      },
    ]);
    const connector = createMastodonConnector(deps);
    const status = await connector.getStatus(
      testStatusRequest({ connection: connection(), externalPostId: 'status-9001' }),
    );
    expect(status.state).toBe('published');
    expect(status.externalPostId).toBe('status-9001');

    const missing = createMastodonConnector(
      createTestDeps({
        routes: [{ method: 'GET', match: '/api/v1/statuses/status-404', status: 404 }],
      }).deps,
    );
    const failed = await missing.getStatus(
      testStatusRequest({ connection: connection(), externalPostId: 'status-404' }),
    );
    expect(failed.state).toBe('failed');
  });

  it('rejects an over-limit draft deterministically', async () => {
    const { deps } = connectorFor([]);
    const connector = createMastodonConnector(deps);
    const snap = buildMastodonCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      body: 'x'.repeat(501),
    });
    const result = await connector.validateDraft(draft);
    expect(result.issues.some((issue) => issue.code === 'TEXT_TOO_LONG')).toBe(true);
  });

  it('maps account and post metrics, never fabricating missing values', async () => {
    const { deps } = connectorFor([
      {
        method: 'GET',
        match: '/api/v1/accounts/account-1234',
        body: { ...accountRoute.body },
      },
      { method: 'GET', match: '/api/v1/statuses/status-9001', body: { ...statusRoute.body } },
    ]);
    const connector = createMastodonConnector(deps);
    const accountMetrics = await connector.fetchMetrics({
      connection: connection(),
      scope: 'account',
      externalPostId: null,
      rangeFrom: null,
      rangeTo: null,
      metrics: [],
    });
    expect(
      accountMetrics.find((metric) => metric.normalizedName === 'published_count')?.value,
    ).toBe(12);

    const postMetrics = await connector.fetchMetrics({
      connection: connection(),
      scope: 'post',
      externalPostId: 'status-9001',
      rangeFrom: null,
      rangeTo: null,
      metrics: [],
    });
    expect(postMetrics.every((metric) => metric.value !== null)).toBe(true);
  });
});
