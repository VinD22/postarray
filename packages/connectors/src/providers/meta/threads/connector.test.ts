import { RelayError } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  expectPartial,
  expectPending,
  expectPublished,
  testConnection,
  testDraft,
  testGrant,
  testMetricsRequest,
  testThreadItem,
} from '../../shared/testing.js';
import { buildThreadsCapabilities } from './capabilities.js';
import { createThreadsConnector } from './connector.js';
import {
  THREADS_CONTAINER_ERROR_FIXTURE,
  THREADS_CONTAINER_FINISHED_FIXTURE,
  THREADS_CONTAINER_FIXTURE,
  THREADS_CONTAINER_IN_PROGRESS_FIXTURE,
  THREADS_MEDIA_FIXTURE,
  THREADS_MEDIA_INSIGHTS_FIXTURE,
  THREADS_PERMISSION_ERROR_FIXTURE,
  THREADS_PROFILE_FIXTURE,
  THREADS_PUBLISH_FIXTURE,
} from './__fixtures__/index.js';

const SCOPES = [
  'threads_basic',
  'threads_content_publish',
  'threads_manage_replies',
  'threads_manage_insights',
];

const connection = testConnection({
  provider: 'threads',
  accountType: 'personal_profile',
  externalAccountId: '78000000000000001',
  scopes: SCOPES,
});

const capabilities = buildThreadsCapabilities({
  connection,
  observedAt: '2026-08-04T12:00:00.000Z',
  grantedScopes: SCOPES,
});

/** A prepared asset that already carries a provider container from an earlier attempt. */
function preparedWithContainer(containerId: string): Record<string, unknown> {
  return {
    mediaId: 'media_test_0001',
    derivativeId: null,
    providerMediaId: null,
    containerId,
    uploadState: 'ready',
    derivativeChecksum: 'e'.repeat(64),
    byteSize: 120_000,
    altTextApplied: false,
    publicUrl: null,
    expiresAt: null,
    reusedFromPreviousAttempt: true,
  };
}

function request(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    connection,
    preparedMedia: [],
    idempotencyKey: 'idem-threads-0001',
    capabilityVersion: capabilities.capabilityVersion,
    contentChecksum: 'f'.repeat(64),
    dispatchedAt: '2026-08-04T12:00:00.000Z',
    ...overrides,
  };
}

const draft = testDraft({ connection, capabilities, body: 'A sample Threads post.' });

describe('Threads capability snapshot', () => {
  it('supports a text only post and a chained thread', () => {
    expect(capabilities.contentKinds.text).toBe('supported');
    expect(capabilities.contentKinds.thread).toBe('supported');
  });

  it('carries a reply control with a safe default', () => {
    expect(capabilities.privacy.mustBeExplicit).toBe(false);
    expect(capabilities.privacy.options.find((option) => option.isDefault)?.value).toBe('everyone');
  });

  it('reports deletion as unsupported', () => {
    expect(capabilities.deletion.support).toBe('unsupported');
  });
});

describe('Threads publish', () => {
  it('discovers exactly one account', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/me', body: THREADS_PROFILE_FIXTURE }],
    });
    const connector = createThreadsConnector(deps);
    const accounts = await connector.discoverAccounts(testGrant({ provider: 'threads', scopes: SCOPES }));
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.handle).toBe('sample_studio_fake');
  });

  it('treats a container that is still building as pending, never published', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        { method: 'POST', match: '/threads', body: THREADS_CONTAINER_FIXTURE },
        { method: 'GET', match: '/18000000000000001', body: THREADS_CONTAINER_IN_PROGRESS_FIXTURE },
      ],
    });
    const connector = createThreadsConnector(deps);
    const result = await connector.publish(request({ draft }) as never);
    expect(result.status).toBe('pending');
    expect(expectPending(result).providerJobId).not.toBe('');
    expect(simulator.callsTo('threads_publish')).toHaveLength(0);
  });

  it('publishes the container and reports the permalink', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'POST', match: '/threads_publish', body: THREADS_PUBLISH_FIXTURE },
        { method: 'POST', match: '/threads', body: THREADS_CONTAINER_FIXTURE },
        { method: 'GET', match: '/18000000000000001', body: THREADS_CONTAINER_FINISHED_FIXTURE },
        { method: 'GET', match: '/19000000000000001', body: THREADS_MEDIA_FIXTURE },
      ],
    });
    const connector = createThreadsConnector(deps);
    const result = await connector.publish(request({ draft }) as never);
    expect(result.status).toBe('published');
    expect(expectPublished(result).externalPostId).toBe('19000000000000001');
    expect(expectPublished(result).permalink).toBe(
      'https://www.threads.net/@sample_studio_fake/post/FAKESHORTCODE1',
    );
  });

  it('reuses a stored container instead of creating a second one', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        { method: 'GET', match: '/18000000000000001', body: THREADS_CONTAINER_FINISHED_FIXTURE },
        { method: 'POST', match: '/threads_publish', body: THREADS_PUBLISH_FIXTURE },
        { method: 'GET', match: '/19000000000000001', body: THREADS_MEDIA_FIXTURE },
      ],
    });
    const connector = createThreadsConnector(deps);
    const result = await connector.publish(
      request({ draft, preparedMedia: [preparedWithContainer('18000000000000001')] }) as never,
    );
    expect(expectPublished(result).externalPostId).toBe('19000000000000001');
    expect(
      simulator.calls.filter((call) => call.method === 'POST' && call.url.endsWith('/threads')),
    ).toHaveLength(0);
  });

  it('maps a container error to the provider stated reason', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'POST', match: '/threads', body: THREADS_CONTAINER_FIXTURE },
        { method: 'GET', match: '/18000000000000001', body: THREADS_CONTAINER_ERROR_FIXTURE },
      ],
    });
    const connector = createThreadsConnector(deps);
    await expect(connector.publish(request({ draft }) as never)).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error),
    );
  });

  it('publishes the root and leaves a delayed thread part for the worker', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'POST', match: '/threads_publish', body: THREADS_PUBLISH_FIXTURE },
        { method: 'POST', match: '/threads', body: THREADS_CONTAINER_FIXTURE },
        { method: 'GET', match: '/18000000000000001', body: THREADS_CONTAINER_FINISHED_FIXTURE },
        { method: 'GET', match: '/19000000000000001', body: THREADS_MEDIA_FIXTURE },
      ],
    });
    const connector = createThreadsConnector(deps);
    const result = await connector.publish(
      request({
        draft: testDraft({
          connection,
          capabilities,
          body: 'Part one.',
          threadItems: [testThreadItem(1, 'Part two.', 'thread', 300)],
        }),
      }) as never,
    );
    // The root exists externally, so a reply that is not yet live is a partial
    // success carrying the posts that do exist, never a failed publish.
    // The root is live and nothing failed. The delayed reply belongs to the
    // thread sequence workflow, which gives it its own receipt.
    expect(result.status).toBe('published');
    const published = expectPublished(result);
    expect(published.items[0]?.kind).toBe('root');
    expect(published.items).toHaveLength(1);
  });
});

describe('Threads metrics', () => {
  it('reports a metric Threads did not return as unavailable', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/insights', body: THREADS_MEDIA_INSIGHTS_FIXTURE }],
    });
    const connector = createThreadsConnector(deps);
    const observations = await connector.fetchMetrics(testMetricsRequest({ connection, scope: 'post', externalPostId: '19000000000000001' }));
    expect(observations.find((entry) => entry.normalizedName === 'views')?.value).toBe(3120);
    const shares = observations.find((entry) => entry.normalizedName === 'shares');
    expect(shares?.value).toBeNull();
    expect(shares?.availability).toBe('unavailable_provider');
  });

  it('reports a missing insights permission honestly', async () => {
    const { deps } = createTestDeps({
      routes: [
        {
          method: 'GET',
          match: '/insights',
          status: 403,
          body: THREADS_PERMISSION_ERROR_FIXTURE,
        },
      ],
    });
    const connector = createThreadsConnector(deps);
    const observations = await connector.fetchMetrics(testMetricsRequest({ connection, scope: 'post', externalPostId: '19000000000000001' }));
    expect(observations.every((entry) => entry.availability === 'unavailable_permission')).toBe(
      true,
    );
  });
});
