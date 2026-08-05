import { RelayError, summarizeCapabilities } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { createTestDeps, testConnection, testDraft, testMedia } from '../shared/testing.js';
import { buildLinkedInCapabilities } from './capabilities.js';
import { createLinkedInConnector } from './connector.js';
import {
  LINKEDIN_ORGANIZATION_ACLS_FIXTURE,
  LINKEDIN_ORGANIZATION_SEARCH_FIXTURE,
  LINKEDIN_ROLE_MISSING_FIXTURE,
  LINKEDIN_SHARE_STATISTICS_FIXTURE,
  LINKEDIN_SOCIAL_ACTIONS_FIXTURE,
  LINKEDIN_USERINFO_FIXTURE,
} from './__fixtures__/index.js';

const MEMBER_SCOPES = ['openid', 'profile', 'w_member_social'];
const ORG_SCOPES = [
  'openid',
  'profile',
  'w_member_social',
  'w_organization_social',
  'r_organization_social',
  'rw_organization_admin',
];

const memberConnection = testConnection({
  provider: 'linkedin',
  accountType: 'personal_profile',
  externalAccountId: 'FAKEMEMBER0001',
  scopes: MEMBER_SCOPES,
});

const organizationConnection = testConnection({
  provider: 'linkedin',
  accountType: 'organization',
  externalAccountId: '99000001',
  scopes: ORG_SCOPES,
});

const memberCapabilities = buildLinkedInCapabilities({
  connection: memberConnection,
  observedAt: '2026-08-04T12:00:00.000Z',
  grantedScopes: MEMBER_SCOPES,
});

const organizationCapabilities = buildLinkedInCapabilities({
  connection: organizationConnection,
  observedAt: '2026-08-04T12:00:00.000Z',
  grantedScopes: ORG_SCOPES,
});

function request(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    preparedMedia: [],
    idempotencyKey: 'idem-linkedin-0001',
    capabilityVersion: organizationCapabilities.capabilityVersion,
    contentChecksum: 'c'.repeat(64),
    dispatchedAt: '2026-08-04T12:00:00.000Z',
    resume: {},
    ...overrides,
  };
}

describe('LinkedIn capability snapshot', () => {
  it('supports the document post, which is the differentiated format', () => {
    expect(summarizeCapabilities(organizationCapabilities).supportedContentKinds).toContain(
      'document',
    );
  });

  it('reports threads as a provider limitation rather than a gap of ours', () => {
    expect(organizationCapabilities.contentKinds.thread).toBe('unsupported');
    expect(organizationCapabilities.threads.support).toBe('unsupported');
  });

  it('is honest that member post read back is restricted for new applications', () => {
    expect(memberCapabilities.analytics.support).toBe('requires_review');
    expect(memberCapabilities.analytics.postMetrics).toEqual(['likes', 'comments']);
    expect(organizationCapabilities.analytics.support).toBe('supported');
    expect(organizationCapabilities.analytics.postMetrics).toContain('impressions');
  });

  it('resolves mentions to a real entity URN', () => {
    expect(organizationCapabilities.mentions.resolvesToExternalId).toBe(true);
  });

  it('does not invent a rate limit LinkedIn does not publish for our app', () => {
    expect(organizationCapabilities.rateLimit).toBeNull();
  });
});

describe('LinkedIn account discovery', () => {
  it('returns the member plus only the organizations with a publishing role', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'GET', match: '/v2/userinfo', body: LINKEDIN_USERINFO_FIXTURE },
        { method: 'GET', match: '/organizationAcls', body: LINKEDIN_ORGANIZATION_ACLS_FIXTURE },
      ],
    });
    const connector = createLinkedInConnector(deps);
    const accounts = await connector.discoverAccounts({
      provider: 'linkedin',
      accessToken: 'fake-test-access-token-not-a-real-credential',
      refreshToken: null,
      expiresAt: null,
      scopes: ORG_SCOPES,
      externalUserId: null,
      extra: {},
    });
    expect(accounts).toHaveLength(3);
    const analyst = accounts.find((account) => account.externalId === '99000002');
    expect(analyst?.connectable).toBe(false);
    expect(analyst?.blockedReasonKey).toBe('connectors.linkedin.page_role_required');
    const admin = accounts.find((account) => account.externalId === '99000001');
    expect(admin?.connectable).toBe(true);
  });

  it('still connects the member when the organization list is unavailable', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'GET', match: '/v2/userinfo', body: LINKEDIN_USERINFO_FIXTURE },
        { method: 'GET', match: '/organizationAcls', status: 403, body: LINKEDIN_ROLE_MISSING_FIXTURE },
      ],
    });
    const connector = createLinkedInConnector(deps);
    const accounts = await connector.discoverAccounts({
      provider: 'linkedin',
      accessToken: 'fake-test-access-token-not-a-real-credential',
      refreshToken: null,
      expiresAt: null,
      scopes: ORG_SCOPES,
      externalUserId: null,
      extra: {},
    });
    expect(accounts).toHaveLength(1);
  });
});

describe('LinkedIn validation', () => {
  it('requires a title on a document post', async () => {
    const { deps } = createTestDeps();
    const connector = createLinkedInConnector(deps);
    const result = await connector.validateDraft(
      testDraft({
        connection: organizationConnection,
        capabilities: organizationCapabilities,
        contentKind: 'document',
        media: [testMedia({ kind: 'document', mimeType: 'application/pdf' })],
      }),
    );
    expect(result.issues.some((issue) => issue.code === 'DOCUMENT_TITLE_REQUIRED')).toBe(true);
  });

  it('names the page role remediation when the organization scope is missing', async () => {
    const { deps } = createTestDeps();
    const connector = createLinkedInConnector(deps);
    const narrowConnection = testConnection({
      provider: 'linkedin',
      accountType: 'organization',
      externalAccountId: '99000001',
      scopes: MEMBER_SCOPES,
    });
    const result = await connector.validateDraft(
      testDraft({
        connection: narrowConnection,
        capabilities: buildLinkedInCapabilities({
          connection: narrowConnection,
          observedAt: '2026-08-04T12:00:00.000Z',
          grantedScopes: MEMBER_SCOPES,
        }),
      }),
    );
    const issue = result.issues.find((entry) => entry.code === 'ORGANIZATION_ROLE_REQUIRED');
    expect(issue?.remediationKey).toBe('page_role_required');
  });
});

describe('LinkedIn publish', () => {
  it('reads the created post URN from the response header', async () => {
    const { deps } = createTestDeps({
      routes: [
        {
          method: 'POST',
          match: '/rest/posts',
          status: 201,
          headers: { 'x-restli-id': 'urn:li:share:7100000000000000001' },
          body: {},
        },
      ],
    });
    const connector = createLinkedInConnector(deps);
    const result = await connector.publish(
      request({
        connection: organizationConnection,
        draft: testDraft({
          connection: organizationConnection,
          capabilities: organizationCapabilities,
          body: 'An organization update.',
        }),
      }) as never,
    );
    expect(result.state).toBe('published');
    expect(result.externalPostId).toBe('urn:li:share:7100000000000000001');
  });

  it('sends the reviewed version header on every request', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        {
          method: 'POST',
          match: '/rest/posts',
          status: 201,
          headers: { 'x-restli-id': 'urn:li:share:7100000000000000001' },
          body: {},
        },
      ],
    });
    const connector = createLinkedInConnector(deps);
    await connector.publish(
      request({
        connection: organizationConnection,
        draft: testDraft({
          connection: organizationConnection,
          capabilities: organizationCapabilities,
        }),
      }) as never,
    );
    expect(simulator.callsTo('/rest/posts')).toHaveLength(1);
  });

  it('maps a missing page role to a connection action, not a generic failure', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'POST', match: '/rest/posts', status: 403, body: LINKEDIN_ROLE_MISSING_FIXTURE },
      ],
    });
    const connector = createLinkedInConnector(deps);
    await expect(
      connector.publish(
        request({
          connection: organizationConnection,
          draft: testDraft({
            connection: organizationConnection,
            capabilities: organizationCapabilities,
          }),
        }) as never,
      ),
    ).rejects.toSatisfy(
      (error: unknown) =>
        RelayError.is(error) && error.code === 'CONNECTION_ACTION_REQUIRED',
    );
  });

  it('adopts an already created post rather than creating a second one', async () => {
    const { deps, simulator } = createTestDeps();
    const connector = createLinkedInConnector(deps);
    const result = await connector.publish(
      request({
        connection: organizationConnection,
        draft: testDraft({
          connection: organizationConnection,
          capabilities: organizationCapabilities,
        }),
        resume: { postUrn: 'urn:li:share:7100000000000000001' },
      }) as never,
    );
    expect(result.externalPostId).toBe('urn:li:share:7100000000000000001');
    expect(simulator.calls).toHaveLength(0);
  });
});

describe('LinkedIn metrics', () => {
  it('combines social actions with organization share statistics', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'GET', match: '/socialActions/', body: LINKEDIN_SOCIAL_ACTIONS_FIXTURE },
        {
          method: 'GET',
          match: '/organizationalEntityShareStatistics',
          body: LINKEDIN_SHARE_STATISTICS_FIXTURE,
        },
      ],
    });
    const connector = createLinkedInConnector(deps);
    const observations = await connector.fetchMetrics({
      connection: organizationConnection,
      scope: 'post',
      externalPostId: 'urn:li:share:7100000000000000001',
    });
    const impressions = observations.find((entry) => entry.normalizedName === 'impressions');
    expect(impressions?.value).toBe(8420);
  });

  it('reports member post impressions as unavailable because LinkedIn restricts them', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/socialActions/', body: LINKEDIN_SOCIAL_ACTIONS_FIXTURE }],
    });
    const connector = createLinkedInConnector(deps);
    const observations = await connector.fetchMetrics({
      connection: memberConnection,
      scope: 'post',
      externalPostId: 'urn:li:share:7100000000000000002',
    });
    const impressions = observations.find((entry) => entry.normalizedName === 'impressions');
    expect(impressions?.value).toBeNull();
    expect(impressions?.availability).toBe('unavailable_permission');
    const likes = observations.find((entry) => entry.normalizedName === 'likes');
    expect(likes?.value).toBe(57);
  });
});

describe('LinkedIn mentions', () => {
  it('resolves an organization to a URN so the tag is native', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'GET', match: '/rest/organizations', body: LINKEDIN_ORGANIZATION_SEARCH_FIXTURE },
      ],
    });
    const connector = createLinkedInConnector(deps);
    const mentions = await connector.searchMentions?.({
      connection: organizationConnection,
      query: '@sample-studio-fake',
    });
    expect(mentions?.[0]?.externalId).toBe('urn:li:organization:99000001');
    expect(mentions?.[0]?.resolved).toBe(true);
  });
});
