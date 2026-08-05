import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  expectPublished,
  testConnection,
  testDraft,
  testGrant,
  testMetricsRequest,
  testStatusRequest,
} from '../../shared/testing.js';
import { buildFacebookCapabilities } from './capabilities.js';
import { createFacebookConnector } from './connector.js';
import {
  FACEBOOK_FEED_POST_FIXTURE,
  FACEBOOK_PAGES_FIXTURE,
  FACEBOOK_PAGE_INSIGHTS_FIXTURE,
  FACEBOOK_POST_INSIGHTS_FIXTURE,
  FACEBOOK_POST_LOOKUP_FIXTURE,
  FACEBOOK_VIDEO_PROCESSING_FIXTURE,
} from './__fixtures__/index.js';

const SCOPES = [
  'pages_show_list',
  'pages_manage_posts',
  'pages_read_engagement',
  'pages_manage_engagement',
  'read_insights',
];

const connection = testConnection({
  provider: 'facebook',
  accountType: 'page',
  externalAccountId: '61550000000001',
  scopes: SCOPES,
});

const capabilities = buildFacebookCapabilities({
  connection,
  observedAt: '2026-08-04T12:00:00.000Z',
  grantedScopes: SCOPES,
});

function request(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    connection,
    preparedMedia: [],
    idempotencyKey: 'idem-facebook-0001',
    capabilityVersion: capabilities.capabilityVersion,
    contentChecksum: 'e'.repeat(64),
    dispatchedAt: '2026-08-04T12:00:00.000Z',
    resume: {},
    ...overrides,
  };
}

describe('Facebook capability snapshot', () => {
  it('targets Pages only', () => {
    const { deps } = createTestDeps();
    const connector = createFacebookConnector(deps);
    expect(connector.identity().accountTypes).toEqual(['page']);
  });

  it('marks groups as a gap of ours rather than a provider limitation', () => {
    const groups = capabilities.destinations.find((entry) => entry.kind === 'group');
    expect(groups?.support).toBe('not_implemented');
  });

  it('marks Reels as not implemented rather than unsupported', () => {
    expect(capabilities.contentKinds.short_video).toBe('not_implemented');
  });
});

describe('Facebook account discovery', () => {
  it('only offers Pages the user can create content on', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/me/accounts', body: FACEBOOK_PAGES_FIXTURE }],
    });
    const connector = createFacebookConnector(deps);
    const accounts = await connector.discoverAccounts(testGrant({ provider: 'facebook', scopes: SCOPES }));
    expect(accounts).toHaveLength(2);
    expect(accounts.find((account) => account.externalAccountId === '61550000000001')?.eligible).toBe(
      true,
    );
    const analyzeOnly = accounts.find((account) => account.externalAccountId === '61550000000003');
    expect(analyzeOnly?.eligible).toBe(false);
    expect(analyzeOnly?.ineligibleReasonKey).toBe('connectors.facebook.page_role_required');
  });

  it('records the page tasks so a later role change is detectable', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/me/accounts', body: FACEBOOK_PAGES_FIXTURE }],
    });
    const connector = createFacebookConnector(deps);
    const accounts = await connector.discoverAccounts(testGrant({ provider: 'facebook', scopes: SCOPES }));
    expect(accounts[0]?.metadata['tasks']).toContain('CREATE_CONTENT');
  });
});

describe('Facebook publish', () => {
  it('creates the post and reads its permalink', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'POST', match: '/feed', body: FACEBOOK_FEED_POST_FIXTURE },
        {
          method: 'GET',
          match: '/61550000000001_122000000000001',
          body: FACEBOOK_POST_LOOKUP_FIXTURE,
        },
      ],
    });
    const connector = createFacebookConnector(deps);
    const result = await connector.publish(
      request({
        draft: testDraft({ connection, capabilities, body: 'A sample Page post.' }),
      }) as never,
    );
    expect(result.status).toBe('published');
    expect(expectPublished(result).externalPostId).toBe('61550000000001_122000000000001');
    expect(expectPublished(result).permalink).toBe(
      'https://www.facebook.com/61550000000001/posts/122000000000001',
    );
  });

  it('adopts an already created post rather than creating a second one', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        {
          method: 'GET',
          match: '/61550000000001_122000000000001',
          body: FACEBOOK_POST_LOOKUP_FIXTURE,
        },
      ],
    });
    const connector = createFacebookConnector(deps);
    const result = await connector.publish(
      request({
        draft: testDraft({ connection, capabilities }),
        resume: { postId: '61550000000001_122000000000001' },
      }) as never,
    );
    expect(expectPublished(result).externalPostId).toBe('61550000000001_122000000000001');
    expect(simulator.calls.filter((call) => call.method === 'POST')).toHaveLength(0);
  });

  it('reports a video that is still processing as processing, not published', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'GET', match: '/122000000000500', body: FACEBOOK_VIDEO_PROCESSING_FIXTURE },
      ],
    });
    const connector = createFacebookConnector(deps);
    const status = await connector.getStatus(testStatusRequest({ connection, providerJobId: '122000000000500' }));
    expect(status.state).toBe('processing');
    expect(status.externalPostId).toBeNull();
  });
});

describe('Facebook metrics', () => {
  it('combines post insights with the engagement summaries on the post object', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'GET', match: '/insights', body: FACEBOOK_POST_INSIGHTS_FIXTURE },
        {
          method: 'GET',
          match: '/61550000000001_122000000000001',
          body: FACEBOOK_POST_LOOKUP_FIXTURE,
        },
      ],
    });
    const connector = createFacebookConnector(deps);
    const observations = await connector.fetchMetrics(testMetricsRequest({ connection, scope: 'post', externalPostId: '61550000000001_122000000000001' }));
    expect(observations.find((entry) => entry.normalizedName === 'impressions')?.value).toBe(15_400);
    expect(observations.find((entry) => entry.normalizedName === 'likes')?.value).toBe(64);
    expect(observations.find((entry) => entry.normalizedName === 'shares')?.value).toBe(3);
  });

  it('marks a withheld page metric as unavailable rather than zero', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/insights', body: FACEBOOK_PAGE_INSIGHTS_FIXTURE }],
    });
    const connector = createFacebookConnector(deps);
    const observations = await connector.fetchMetrics(testMetricsRequest({ connection, scope: 'account' }));
    const profileViews = observations.find((entry) => entry.normalizedName === 'profile_views');
    expect(profileViews?.value).toBeNull();
    expect(profileViews?.availability).toBe('unavailable_provider');
  });
});
