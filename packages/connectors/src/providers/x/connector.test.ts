import { RelayError, summarizeCapabilities } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  expectPublished,
  testConnection,
  testDestinationRequest,
  testDraft,
  testGrant,
  testMedia,
  testMetricsRequest,
  testPublishRequest,
  testStatusRequest,
  testThreadItem,
} from '../shared/testing.js';
import { buildXCapabilities } from './capabilities.js';
import { createXConnector } from './connector.js';
import {
  X_CREATE_POST_FIXTURE,
  X_CREATE_REPLY_FIXTURE,
  X_DUPLICATE_ERROR_FIXTURE,
  X_POST_METRICS_FIXTURE,
  X_POST_METRICS_PARTIAL_FIXTURE,
  X_RATE_LIMIT_ERROR_FIXTURE,
  X_TIMELINE_FIXTURE,
  X_USER_ME_FIXTURE,
} from './__fixtures__/index.js';

const SCOPES = ['tweet.read', 'tweet.write', 'users.read', 'media.write', 'offline.access'];

const connection = testConnection({
  provider: 'x',
  scopes: SCOPES,
  externalAccountId: '4400000000000000001',
  metadata: { username: 'sample_studio_fake' },
});

const capabilities = buildXCapabilities({
  connection,
  observedAt: '2026-08-04T12:00:00.000Z',
  grantedScopes: SCOPES,
});

/** No post exists yet in the dispatch window, so the duplicate preflight finds nothing. */
const EMPTY_TIMELINE = { method: 'GET', match: '/tweets', body: { data: [] } } as const;

describe('X capability snapshot', () => {
  it('is honest about what the provider does not offer', () => {
    const summary = summarizeCapabilities(capabilities);
    expect(summary.unsupportedContentKinds).toContain('carousel');
    expect(summary.unsupportedContentKinds).toContain('document');
    expect(summary.drafts).toBe('unsupported');
    expect(summary.supportedContentKinds).toContain('text');
    expect(summary.supportedContentKinds).toContain('thread');
  });

  it('marks a capability gated behind an unfinished review as requires_review', () => {
    const summary = summarizeCapabilities(capabilities);
    expect(summary.reviewRequiredContentKinds).toContain('long_video');
    expect(capabilities.destinations[0]?.support).toBe('requires_review');
  });

  it('counts links at the fixed t.co width and reports the metered cost', () => {
    expect(capabilities.text.linkCounting).toEqual({ mode: 'fixed', charactersPerLink: 23 });
    expect(capabilities.cost).not.toBeNull();
    expect(summarizeCapabilities(capabilities).isMetered).toBe(true);
  });

  it('degrades to requires_review when the write scope was not granted', () => {
    const narrow = buildXCapabilities({
      connection,
      observedAt: '2026-08-04T12:00:00.000Z',
      grantedScopes: ['tweet.read', 'users.read'],
    });
    expect(narrow.contentKinds.text).toBe('requires_review');
  });
});

describe('X validateDraft', () => {
  it('reports the exact overflow for a post past the limit', async () => {
    const { deps } = createTestDeps();
    const connector = createXConnector(deps);
    const result = await connector.validateDraft(
      testDraft({ connection, capabilities, body: 'a'.repeat(300) }),
    );
    expect(result.ok).toBe(false);
    const issue = result.issues.find((entry) => entry.code === 'TEXT_TOO_LONG');
    expect(issue?.params['over']).toBe(20);
    expect(issue?.remediationKey).toBe('content_too_long');
  });

  it('carries a cost estimate on every draft', async () => {
    const { deps } = createTestDeps();
    const connector = createXConnector(deps);
    const result = await connector.validateDraft(
      testDraft({ connection, capabilities, body: 'Plain text only.' }),
    );
    expect(result.estimatedCostMinor).toBe(2);
  });

  it('rejects an animated GIF combined with another image', async () => {
    const { deps } = createTestDeps();
    const connector = createXConnector(deps);
    const result = await connector.validateDraft(
      testDraft({
        connection,
        capabilities,
        contentKind: 'image',
        media: [testMedia({ kind: 'gif', mimeType: 'image/gif' }), testMedia({ kind: 'image' })],
      }),
    );
    expect(result.issues.some((issue) => issue.code === 'GIF_MUST_BE_ONLY_MEDIA')).toBe(true);
  });
});

describe('X publish', () => {
  it('reports published only with a real external post id', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [EMPTY_TIMELINE, { method: 'POST', match: '/2/tweets', body: X_CREATE_POST_FIXTURE }],
    });
    const connector = createXConnector(deps);
    const result = await connector.publish(
      testPublishRequest({ draft: testDraft({ connection, capabilities, body: 'Hello.' }) }),
    );
    expect(result.status).toBe('published');
    if (result.status !== 'published') return;
    expect(expectPublished(result).externalPostId).toBe('1900000000000000001');
    expect(expectPublished(result).permalink).toBe(
      'https://x.com/sample_studio_fake/status/1900000000000000001',
    );
    expect(simulator.calls.filter((call) => call.method === 'POST')).toHaveLength(1);
  });

  it('builds a thread as replies to the previous part', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        EMPTY_TIMELINE,
        { method: 'POST', match: '/2/tweets', body: X_CREATE_POST_FIXTURE, once: true },
        { method: 'POST', match: '/2/tweets', body: X_CREATE_REPLY_FIXTURE },
      ],
    });
    const connector = createXConnector(deps);
    const result = await connector.publish(
      testPublishRequest({
        draft: testDraft({
          connection,
          capabilities,
          body: 'Part one.',
          threadItems: [testThreadItem(1, 'Part two.')],
        }),
      }),
    );
    expect(result.status).toBe('published');
    if (result.status !== 'published') return;
    expect(expectPublished(result).items[1]?.externalPostId).toBe('1900000000000000002');
    const reply = simulator.calls.filter((call) => call.method === 'POST')[1];
    expect(reply?.json).toMatchObject({
      reply: { in_reply_to_tweet_id: '1900000000000000001' },
    });
  });

  it('charges the higher URL create price for every operation that carries a link', async () => {
    const { deps } = createTestDeps({
      routes: [
        EMPTY_TIMELINE,
        { method: 'POST', match: '/2/tweets', body: X_CREATE_POST_FIXTURE, once: true },
        { method: 'POST', match: '/2/tweets', body: X_CREATE_REPLY_FIXTURE },
      ],
    });
    const connector = createXConnector(deps);
    const result = await connector.publish(
      testPublishRequest({
        draft: testDraft({
          connection,
          capabilities,
          body: 'Read it at https://example.invalid/post',
          threadItems: [testThreadItem(1, 'No link here.')],
        }),
      }),
    );
    expect(result.status).toBe('published');
    if (result.status !== 'published') return;
    // $0.200 for the URL create plus $0.015 for the plain reply, in whole minor units.
    expect(expectPublished(result).costMinor).toBe(22);
    expect(expectPublished(result).currency).toBe('USD');
  });

  it('adopts an existing post instead of creating a duplicate', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        { method: 'GET', match: '/tweets', body: X_TIMELINE_FIXTURE },
        { method: 'POST', match: '/2/tweets', body: X_CREATE_POST_FIXTURE },
      ],
    });
    const connector = createXConnector(deps);
    const result = await connector.publish(
      testPublishRequest({
        draft: testDraft({
          connection,
          capabilities,
          body: 'Sample root post for the connector contract tests.',
        }),
      }),
    );
    expect(result.status).toBe('published');
    if (result.status !== 'published') return;
    expect(expectPublished(result).externalPostId).toBe('1900000000000000001');
    // The whole point: no second create was issued.
    expect(simulator.calls.filter((call) => call.method === 'POST')).toHaveLength(0);
  });

  it('classifies a duplicate rejection as content invalid, not a retryable failure', async () => {
    const { deps } = createTestDeps({
      routes: [
        EMPTY_TIMELINE,
        { method: 'POST', match: '/2/tweets', status: 403, body: X_DUPLICATE_ERROR_FIXTURE },
      ],
    });
    const connector = createXConnector(deps);
    await expect(
      connector.publish(
        testPublishRequest({ draft: testDraft({ connection, capabilities, body: 'Same text.' }) }),
      ),
    ).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error) && error.code === 'CONTENT_INVALID',
    );
  });

  it('keeps the root published when a thread part fails', async () => {
    const { deps } = createTestDeps({
      routes: [
        EMPTY_TIMELINE,
        { method: 'POST', match: '/2/tweets', body: X_CREATE_POST_FIXTURE, once: true },
        { method: 'POST', match: '/2/tweets', status: 429, body: X_RATE_LIMIT_ERROR_FIXTURE },
      ],
    });
    const connector = createXConnector(deps);
    const result = await connector.publish(
      testPublishRequest({
        draft: testDraft({
          connection,
          capabilities,
          body: 'Part one.',
          threadItems: [testThreadItem(1, 'Part two.')],
        }),
      }),
    );
    expect(result.status).toBe('partial');
    if (result.status !== 'partial') return;
    expect(expectPublished(result).externalPostId).toBe('1900000000000000001');
    expect(expectPublished(result).items).toHaveLength(1);
    expect(result.failures[0]?.error.remediationCode).toBe('comment_failed_root_published');
  });

  it('refuses to report a status without a post id to poll', async () => {
    const { deps } = createTestDeps();
    const connector = createXConnector(deps);
    const status = await connector.getStatus(testStatusRequest({ connection }));
    expect(status.state).toBe('unknown');
    expect(status.externalPostId).toBeNull();
  });
});

describe('X metrics', () => {
  it('maps provider fields onto normalized names', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/2/tweets/', body: X_POST_METRICS_FIXTURE }],
    });
    const connector = createXConnector(deps);
    const observations = await connector.fetchMetrics(
      testMetricsRequest({ connection, scope: 'post', externalPostId: '1900000000000000001' }),
    );
    const impressions = observations.find((entry) => entry.normalizedName === 'impressions');
    expect(impressions?.value).toBe(5120);
    expect(impressions?.providerField).toBe('impression_count');
    expect(impressions?.availability).toBe('available');
  });

  it('reports a field the access tier withheld as unavailable, never as zero', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/2/tweets/', body: X_POST_METRICS_PARTIAL_FIXTURE }],
    });
    const connector = createXConnector(deps);
    const observations = await connector.fetchMetrics(
      testMetricsRequest({ connection, scope: 'post', externalPostId: '1900000000000000003' }),
    );
    const impressions = observations.find((entry) => entry.normalizedName === 'impressions');
    expect(impressions?.value).toBeNull();
    expect(impressions?.availability).toBe('unavailable_provider');
  });

  it('reports permission failures as unavailable_permission', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/2/tweets/', status: 403, body: { title: 'Forbidden' } }],
    });
    const connector = createXConnector(deps);
    const observations = await connector.fetchMetrics(
      testMetricsRequest({ connection, scope: 'post', externalPostId: '1900000000000000001' }),
    );
    expect(observations.every((entry) => entry.value === null)).toBe(true);
    expect(observations[0]?.availability).toBe('unavailable_permission');
  });
});

describe('X discovery and destinations', () => {
  it('discovers exactly one user account and never auto-connects it', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/2/users/me', body: X_USER_ME_FIXTURE }],
    });
    const connector = createXConnector(deps);
    const accounts = await connector.discoverAccounts(testGrant({ provider: 'x', scopes: SCOPES }));
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.handle).toBe('sample_studio_fake');
    expect(accounts[0]?.externalAccountId).toBe('4400000000000000001');
    expect(accounts[0]?.eligible).toBe(true);
  });

  it('marks an account without the write scope ineligible rather than hiding it', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/2/users/me', body: X_USER_ME_FIXTURE }],
    });
    const connector = createXConnector(deps);
    const accounts = await connector.discoverAccounts(
      testGrant({ provider: 'x', scopes: ['tweet.read', 'users.read'] }),
    );
    expect(accounts[0]?.eligible).toBe(false);
    expect(accounts[0]?.ineligibleReasonKey).toBe('connectors.x.write_scope_missing');
  });

  it('reports communities as not implemented rather than pretending they do not exist', async () => {
    const { deps } = createTestDeps();
    const connector = createXConnector(deps);
    await expect(
      connector.listDestinations?.(testDestinationRequest(connection, 'community')),
    ).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error) && error.code === 'CAPABILITY_NOT_IMPLEMENTED',
    );
  });
});
