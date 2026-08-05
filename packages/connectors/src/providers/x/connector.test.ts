import { RelayError, summarizeCapabilities } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  testConnection,
  testDraft,
  testMedia,
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

function baseRequest(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    connection,
    preparedMedia: [],
    idempotencyKey: 'idem-test-00000001',
    capabilityVersion: capabilities.capabilityVersion,
    contentChecksum: 'b'.repeat(64),
    dispatchedAt: '2026-08-04T12:00:00.000Z',
    resume: {},
    ...overrides,
  };
}

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
    expect(result.currency).toBe('USD');
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
      routes: [{ method: 'POST', match: '/2/tweets', body: X_CREATE_POST_FIXTURE }],
    });
    const connector = createXConnector(deps);
    const result = await connector.publish(
      baseRequest({ draft: testDraft({ connection, capabilities, body: 'Hello.' }) }) as never,
    );
    expect(result.state).toBe('published');
    expect(result.externalPostId).toBe('1900000000000000001');
    expect(result.permalink).toBe(
      'https://x.com/sample_studio_fake/status/1900000000000000001',
    );
    expect(simulator.callsTo('/2/tweets')).toHaveLength(1);
  });

  it('builds a thread as replies to the previous part', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        { method: 'POST', match: '/2/tweets', body: X_CREATE_POST_FIXTURE, once: true },
        { method: 'POST', match: '/2/tweets', body: X_CREATE_REPLY_FIXTURE },
      ],
    });
    const connector = createXConnector(deps);
    const result = await connector.publish(
      baseRequest({
        draft: testDraft({
          connection,
          capabilities,
          body: 'Part one.',
          threadItems: [testThreadItem(1, 'Part two.')],
        }),
      }) as never,
    );
    expect(result.state).toBe('published');
    expect(result.items[0]?.externalPostId).toBe('1900000000000000002');
    const reply = simulator.callsTo('/2/tweets')[1];
    expect(reply?.json).toMatchObject({
      reply: { in_reply_to_tweet_id: '1900000000000000001' },
    });
  });

  it('leaves a delayed thread part for the worker instead of sleeping', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [{ method: 'POST', match: '/2/tweets', body: X_CREATE_POST_FIXTURE }],
    });
    const connector = createXConnector(deps);
    const result = await connector.publish(
      baseRequest({
        draft: testDraft({
          connection,
          capabilities,
          body: 'Part one.',
          threadItems: [testThreadItem(1, 'Later.', 'comment', 600)],
        }),
      }) as never,
    );
    expect(result.state).toBe('processing');
    expect(result.externalPostId).toBe('1900000000000000001');
    expect(result.items[0]?.state).toBe('processing');
    expect(simulator.callsTo('/2/tweets')).toHaveLength(1);
  });

  it('adopts an existing post on retry instead of creating a duplicate', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        { method: 'GET', match: '/tweets', body: X_TIMELINE_FIXTURE },
        { method: 'POST', match: '/2/tweets', body: X_CREATE_POST_FIXTURE },
      ],
    });
    const connector = createXConnector(deps);
    const result = await connector.publish(
      baseRequest({
        draft: testDraft({
          connection,
          capabilities,
          body: 'Sample root post for the connector contract tests.',
        }),
        resume: { attempted: true },
      }) as never,
    );
    expect(result.externalPostId).toBe('1900000000000000001');
    // The whole point: no second create was issued.
    expect(simulator.calls.filter((call) => call.method === 'POST')).toHaveLength(0);
  });

  it('classifies a duplicate rejection as content invalid, not a retryable failure', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'POST', match: '/2/tweets', status: 403, body: X_DUPLICATE_ERROR_FIXTURE },
      ],
    });
    const connector = createXConnector(deps);
    await expect(
      connector.publish(
        baseRequest({ draft: testDraft({ connection, capabilities, body: 'Same text.' }) }) as never,
      ),
    ).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error) && error.code === 'CONTENT_INVALID',
    );
  });

  it('keeps the root published when a thread part fails', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'POST', match: '/2/tweets', body: X_CREATE_POST_FIXTURE, once: true },
        { method: 'POST', match: '/2/tweets', status: 429, body: X_RATE_LIMIT_ERROR_FIXTURE },
      ],
    });
    const connector = createXConnector(deps);
    const result = await connector.publish(
      baseRequest({
        draft: testDraft({
          connection,
          capabilities,
          body: 'Part one.',
          threadItems: [testThreadItem(1, 'Part two.')],
        }),
      }) as never,
    );
    expect(result.state).toBe('partially_published');
    expect(result.root.state).toBe('published');
    expect(result.items[0]?.state).toBe('failed');
    expect(result.items[0]?.remediationKey).toBe('comment_failed_root_published');
  });
});

describe('X metrics', () => {
  it('maps provider fields onto normalized names', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/2/tweets/', body: X_POST_METRICS_FIXTURE }],
    });
    const connector = createXConnector(deps);
    const observations = await connector.fetchMetrics({
      connection,
      scope: 'post',
      externalPostId: '1900000000000000001',
    });
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
    const observations = await connector.fetchMetrics({
      connection,
      scope: 'post',
      externalPostId: '1900000000000000003',
    });
    const impressions = observations.find((entry) => entry.normalizedName === 'impressions');
    expect(impressions?.value).toBeNull();
    expect(impressions?.availability).toBe('unavailable_provider');
  });

  it('reports permission failures as unavailable_permission', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/2/tweets/', status: 403, body: { title: 'Forbidden' } }],
    });
    const connector = createXConnector(deps);
    const observations = await connector.fetchMetrics({
      connection,
      scope: 'post',
      externalPostId: '1900000000000000001',
    });
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
    const accounts = await connector.discoverAccounts({
      provider: 'x',
      accessToken: 'fake-test-access-token-not-a-real-credential',
      refreshToken: null,
      expiresAt: null,
      scopes: SCOPES,
      externalUserId: null,
      extra: {},
    });
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.handle).toBe('sample_studio_fake');
    expect(accounts[0]?.connectable).toBe(true);
  });

  it('reports communities as not implemented rather than pretending they do not exist', async () => {
    const { deps } = createTestDeps();
    const connector = createXConnector(deps);
    await expect(
      connector.listDestinations?.({ connection, kind: 'community' }),
    ).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error) && error.code === 'CAPABILITY_NOT_IMPLEMENTED',
    );
  });
});
