import { RelayError, summarizeCapabilities } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { createTestDeps, testConnection, testDraft, testMedia } from '../../shared/testing.js';
import { buildInstagramCapabilities } from './capabilities.js';
import { createInstagramConnector } from './connector.js';
import {
  INSTAGRAM_ACCOUNT_INSIGHTS_FIXTURE,
  INSTAGRAM_BUSINESS_ACCOUNT_FIXTURE,
  INSTAGRAM_CONSUMER_ACCOUNT_FIXTURE,
  INSTAGRAM_CONTAINER_ERROR_FIXTURE,
  INSTAGRAM_CONTAINER_FINISHED_FIXTURE,
  INSTAGRAM_CONTAINER_FIXTURE,
  INSTAGRAM_CONTAINER_IN_PROGRESS_FIXTURE,
  INSTAGRAM_MEDIA_FIXTURE,
  INSTAGRAM_MEDIA_INSIGHTS_FIXTURE,
  INSTAGRAM_PAGES_FIXTURE,
  INSTAGRAM_PERMISSION_ERROR_FIXTURE,
  INSTAGRAM_PUBLISH_FIXTURE,
} from './__fixtures__/index.js';

const SCOPES = [
  'instagram_basic',
  'instagram_content_publish',
  'instagram_manage_insights',
  'instagram_manage_comments',
  'pages_show_list',
];

const connection = testConnection({
  provider: 'instagram',
  accountType: 'business_profile',
  externalAccountId: '17840000000000001',
  parentExternalId: '61550000000001',
  scopes: SCOPES,
});

const capabilities = buildInstagramCapabilities({
  connection,
  observedAt: '2026-08-04T12:00:00.000Z',
  grantedScopes: SCOPES,
});

function request(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    connection,
    preparedMedia: [],
    idempotencyKey: 'idem-instagram-0001',
    capabilityVersion: capabilities.capabilityVersion,
    contentChecksum: 'd'.repeat(64),
    dispatchedAt: '2026-08-04T12:00:00.000Z',
    resume: {},
    ...overrides,
  };
}

const imageDraft = testDraft({
  connection,
  capabilities,
  contentKind: 'image',
  body: 'A quiet caption.',
  media: [testMedia({ kind: 'image', width: 1080, height: 1080 })],
});

describe('Instagram capability snapshot', () => {
  it('reports a text only post as a provider limitation', () => {
    expect(capabilities.contentKinds.text).toBe('unsupported');
  });

  it('reports deletion as unsupported because the API does not offer it', () => {
    expect(capabilities.deletion.support).toBe('unsupported');
  });

  it('carries the documented Instagram publishing quota', () => {
    expect(capabilities.rateLimit).toEqual({ windowSeconds: 86_400, maxRequests: 50 });
  });

  it('lists only the metrics Instagram actually returns', () => {
    const summary = summarizeCapabilities(capabilities);
    expect(capabilities.analytics.postMetrics).toContain('views');
    expect(capabilities.analytics.postMetrics).not.toContain('link_clicks');
    expect(summary.analytics).toBe('supported');
  });
});

describe('Instagram account discovery', () => {
  it('blocks a consumer account before OAuth completes, with the switch remediation', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'GET', match: '/me/accounts', body: INSTAGRAM_PAGES_FIXTURE },
        { method: 'GET', match: '/17840000000000001', body: INSTAGRAM_CONSUMER_ACCOUNT_FIXTURE },
      ],
    });
    const connector = createInstagramConnector(deps);
    const accounts = await connector.discoverAccounts({
      provider: 'instagram',
      accessToken: 'fake-test-access-token-not-a-real-credential',
      refreshToken: null,
      expiresAt: null,
      scopes: SCOPES,
      externalUserId: null,
      extra: {},
    });
    expect(accounts[0]?.connectable).toBe(false);
    expect(accounts[0]?.blockedReasonKey).toBe(
      'connectors.instagram.professional_account_required',
    );
  });

  it('connects a professional account linked to a page the user can publish to', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'GET', match: '/me/accounts', body: INSTAGRAM_PAGES_FIXTURE },
        { method: 'GET', match: '/17840000000000001', body: INSTAGRAM_BUSINESS_ACCOUNT_FIXTURE },
      ],
    });
    const connector = createInstagramConnector(deps);
    const accounts = await connector.discoverAccounts({
      provider: 'instagram',
      accessToken: 'fake-test-access-token-not-a-real-credential',
      refreshToken: null,
      expiresAt: null,
      scopes: SCOPES,
      externalUserId: null,
      extra: {},
    });
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.connectable).toBe(true);
    expect(accounts[0]?.parentExternalId).toBe('61550000000001');
  });
});

describe('Instagram publish', () => {
  it('does not call a container creation a publication', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        { method: 'POST', match: '/media', body: INSTAGRAM_CONTAINER_FIXTURE },
        {
          method: 'GET',
          match: '/17990000000000001',
          body: INSTAGRAM_CONTAINER_IN_PROGRESS_FIXTURE,
        },
      ],
    });
    const connector = createInstagramConnector(deps);
    const result = await connector.publish(request({ draft: imageDraft }) as never);
    expect(result.state).toBe('processing');
    expect(result.externalPostId).toBeNull();
    expect(result.resume['containerId']).toBe('17990000000000001');
    expect(simulator.callsTo('/media_publish')).toHaveLength(0);
  });

  it('publishes the container and reports the media id and permalink', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'POST', match: '/media_publish', body: INSTAGRAM_PUBLISH_FIXTURE },
        { method: 'POST', match: '/media', body: INSTAGRAM_CONTAINER_FIXTURE },
        { method: 'GET', match: '/17990000000000001', body: INSTAGRAM_CONTAINER_FINISHED_FIXTURE },
        { method: 'GET', match: '/17880000000000001', body: INSTAGRAM_MEDIA_FIXTURE },
      ],
    });
    const connector = createInstagramConnector(deps);
    const result = await connector.publish(request({ draft: imageDraft }) as never);
    expect(result.state).toBe('published');
    expect(result.externalPostId).toBe('17880000000000001');
    expect(result.permalink).toBe('https://www.instagram.com/p/FAKEPOSTCODE1/');
  });

  it('reuses a stored container on retry instead of creating a second one', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        { method: 'GET', match: '/17990000000000001', body: INSTAGRAM_CONTAINER_FINISHED_FIXTURE },
        { method: 'POST', match: '/media_publish', body: INSTAGRAM_PUBLISH_FIXTURE },
        { method: 'GET', match: '/17880000000000001', body: INSTAGRAM_MEDIA_FIXTURE },
      ],
    });
    const connector = createInstagramConnector(deps);
    const result = await connector.publish(
      request({ draft: imageDraft, resume: { containerId: '17990000000000001' } }) as never,
    );
    expect(result.externalPostId).toBe('17880000000000001');
    expect(
      simulator.calls.filter(
        (call) => call.method === 'POST' && call.url.endsWith('/media'),
      ),
    ).toHaveLength(0);
  });

  it('adopts an already published media id after a crash before the receipt', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [{ method: 'GET', match: '/17880000000000001', body: INSTAGRAM_MEDIA_FIXTURE }],
    });
    const connector = createInstagramConnector(deps);
    const result = await connector.publish(
      request({ draft: imageDraft, resume: { mediaId: '17880000000000001' } }) as never,
    );
    expect(result.state).toBe('published');
    expect(simulator.calls.filter((call) => call.method === 'POST')).toHaveLength(0);
  });

  it('maps a container error to the provider stated reason', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'POST', match: '/media', body: INSTAGRAM_CONTAINER_FIXTURE },
        { method: 'GET', match: '/17990000000000001', body: INSTAGRAM_CONTAINER_ERROR_FIXTURE },
      ],
    });
    const connector = createInstagramConnector(deps);
    await expect(connector.publish(request({ draft: imageDraft }) as never)).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error),
    );
  });
});

describe('Instagram validation', () => {
  it('refuses a Stories publish until the account is proven eligible', async () => {
    const { deps } = createTestDeps();
    const connector = createInstagramConnector(deps);
    const result = await connector.validateDraft(
      testDraft({
        connection,
        capabilities,
        contentKind: 'image',
        media: [testMedia({ kind: 'image' })],
        providerOptions: { surface: 'STORIES' },
      }),
    );
    const issue = result.issues.find(
      (entry) => entry.code === 'INSTAGRAM_STORIES_REQUIRES_REVIEW',
    );
    expect(issue?.remediationKey).toBe('awaiting_provider_approval');
  });

  it('requires a 9:16 frame for a reel', async () => {
    const { deps } = createTestDeps();
    const connector = createInstagramConnector(deps);
    const result = await connector.validateDraft(
      testDraft({
        connection,
        capabilities,
        contentKind: 'short_video',
        media: [testMedia({ kind: 'video', width: 1080, height: 1350, durationSeconds: 30 })],
        providerOptions: { surface: 'REELS' },
      }),
    );
    expect(result.issues.some((issue) => issue.code === 'REELS_ASPECT_RATIO_INVALID')).toBe(true);
  });

  it('requires at least two items in a carousel', async () => {
    const { deps } = createTestDeps();
    const connector = createInstagramConnector(deps);
    const result = await connector.validateDraft(
      testDraft({
        connection,
        capabilities,
        contentKind: 'carousel',
        media: [testMedia({ kind: 'image' })],
      }),
    );
    expect(result.issues.some((issue) => issue.code === 'CAROUSEL_TOO_FEW_ITEMS')).toBe(true);
  });
});

describe('Instagram metrics', () => {
  it('marks a field this media type did not return as unavailable, not zero', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/insights', body: INSTAGRAM_MEDIA_INSIGHTS_FIXTURE }],
    });
    const connector = createInstagramConnector(deps);
    const observations = await connector.fetchMetrics({
      connection,
      scope: 'post',
      externalPostId: '17880000000000001',
    });
    const shares = observations.find((entry) => entry.normalizedName === 'shares');
    expect(shares?.value).toBeNull();
    expect(shares?.availability).toBe('unavailable_provider');
    const views = observations.find((entry) => entry.normalizedName === 'views');
    expect(views?.value).toBe(9540);
  });

  it('reports a permission failure honestly', async () => {
    const { deps } = createTestDeps({
      routes: [
        {
          method: 'GET',
          match: '/insights',
          status: 403,
          body: INSTAGRAM_PERMISSION_ERROR_FIXTURE,
        },
      ],
    });
    const connector = createInstagramConnector(deps);
    const observations = await connector.fetchMetrics({
      connection,
      scope: 'account',
    });
    expect(observations.every((entry) => entry.availability === 'unavailable_permission')).toBe(
      true,
    );
  });

  it('reads account insights when the scope is granted', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/insights', body: INSTAGRAM_ACCOUNT_INSIGHTS_FIXTURE }],
    });
    const connector = createInstagramConnector(deps);
    const observations = await connector.fetchMetrics({ connection, scope: 'account' });
    const reach = observations.find((entry) => entry.normalizedName === 'reach');
    expect(reach?.value).toBe(4310);
    const followerDelta = observations.find((entry) => entry.normalizedName === 'follower_delta');
    expect(followerDelta?.value).toBeNull();
  });
});
