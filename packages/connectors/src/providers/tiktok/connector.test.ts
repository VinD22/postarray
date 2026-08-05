import { RelayError } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  expectPending,
  expectPublished,
  testConnection,
  testDraft,
  testGrant,
  testMedia,
  testMetricsRequest,
  testStatusRequest,
} from '../shared/testing.js';
import {
  buildTikTokCapabilities,
  interactionAvailability,
  isUnaudited,
  tikTokPrivacyOptions,
} from './capabilities.js';
import { createTikTokConnector, isVerifiedPullDomain } from './connector.js';
import {
  TIKTOK_CREATOR_INFO_FIXTURE,
  TIKTOK_CREATOR_INFO_PRIVATE_ONLY_FIXTURE,
  TIKTOK_PUBLISH_INIT_FIXTURE,
  TIKTOK_STATUS_COMPLETE_FIXTURE,
  TIKTOK_STATUS_FAILED_FIXTURE,
  TIKTOK_STATUS_PROCESSING_FIXTURE,
  TIKTOK_USER_INFO_FIXTURE,
} from './__fixtures__/index.js';

const SCOPES = ['user.info.basic', 'user.info.profile', 'video.publish', 'video.upload'];

const connection = testConnection({
  provider: 'tiktok',
  accountType: 'creator_profile',
  externalAccountId: 'fake-open-id-0000000001',
  scopes: SCOPES,
  metadata: { username: 'sample_studio_fake' },
});

const capabilities = buildTikTokCapabilities({
  connection,
  observedAt: '2026-08-04T12:00:00.000Z',
  grantedScopes: SCOPES,
  creatorInfo: { ...TIKTOK_CREATOR_INFO_FIXTURE.data, privacy_level_options: [...TIKTOK_CREATOR_INFO_FIXTURE.data.privacy_level_options] },
});

const COMPLETE_OPTIONS = {
  privacyLevel: 'SELF_ONLY',
  disableComment: false,
  disableDuet: false,
  disableStitch: true,
  commercialContent: false,
  musicRightsConfirmed: true,
  consentConfirmed: true,
};

function videoDraft(overrides: Record<string, unknown> = {}) {
  return testDraft({
    capabilities,
    contentKind: 'video',
    body: 'A calm caption with no watermark.',
    media: [
      testMedia({
        kind: 'video',
        mimeType: 'video/mp4',
        byteSize: 5_000_000,
        width: 1080,
        height: 1920,
        durationSeconds: 30,
      }),
    ],
    connection: { ...connection, metadata: { ...connection.metadata, providerOptions: COMPLETE_OPTIONS } },
    ...overrides,
  });
}

/** A publish an earlier attempt already initialized with TikTok. */
function preparedPublish(providerMediaId: string): Record<string, unknown> {
  return {
    mediaId: 'media_test_0001',
    derivativeId: null,
    providerMediaId,
    containerId: null,
    uploadState: 'processing',
    derivativeChecksum: 'e'.repeat(64),
    byteSize: 5_000_000,
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
    idempotencyKey: 'idem-tiktok-0001',
    capabilityVersion: capabilities.capabilityVersion,
    contentChecksum: '2'.repeat(64),
    dispatchedAt: '2026-08-04T12:00:00.000Z',
    resume: {},
    ...overrides,
  };
}

describe('TikTok privacy rules', () => {
  it('never marks a privacy option as the default', () => {
    const options = tikTokPrivacyOptions([
      'PUBLIC_TO_EVERYONE',
      'MUTUAL_FOLLOW_FRIENDS',
      'SELF_ONLY',
    ]);
    expect(options.every((option) => option.isDefault === false)).toBe(true);
  });

  it('requires an explicit choice in the capability snapshot', () => {
    expect(capabilities.privacy.mustBeExplicit).toBe(true);
  });

  it('restricts an unaudited app to the private option only', () => {
    expect(isUnaudited()).toBe(true);
    const options = tikTokPrivacyOptions(['PUBLIC_TO_EVERYONE', 'SELF_ONLY']);
    expect(options.map((option) => option.value)).toEqual(['SELF_ONLY']);
  });

  it('fails validation when no privacy was chosen', async () => {
    const { deps } = createTestDeps();
    const connector = createTikTokConnector(deps);
    const result = await connector.validateDraft(
      videoDraft({
        connection: { ...connection, metadata: { ...connection.metadata, providerOptions: { ...COMPLETE_OPTIONS, privacyLevel: undefined } } },
        privacyValue: null,
      }),
    );
    const issue = result.issues.find((entry) => entry.code === 'PRIVACY_CHOICE_REQUIRED');
    expect(issue?.severity).toBe('error');
    expect(issue?.remediationKey).toBe('choose_privacy_option');
  });
});

describe('TikTok capability snapshot', () => {
  it('hides the first comment because the API cannot express it for our app', () => {
    expect(capabilities.firstComment.support).toBe('unsupported');
    expect(capabilities.firstComment.maxItems).toBe(0);
  });

  it('reports analytics as requiring approval rather than returning zeros', () => {
    expect(capabilities.analytics.support).toBe('requires_review');
    expect(capabilities.analytics.postMetrics).toEqual([]);
  });

  it('takes the maximum duration from creator info rather than a constant', () => {
    const restricted = buildTikTokCapabilities({
      connection,
      observedAt: '2026-08-04T12:00:00.000Z',
      grantedScopes: SCOPES,
      creatorInfo: { ...TIKTOK_CREATOR_INFO_PRIVATE_ONLY_FIXTURE.data, privacy_level_options: [...TIKTOK_CREATOR_INFO_PRIVATE_ONLY_FIXTURE.data.privacy_level_options] },
    });
    expect(restricted.media.maxDurationSeconds).toBe(60);
    expect(capabilities.media.maxDurationSeconds).toBe(600);
  });

  it('reads what the creator currently permits', () => {
    const availability = interactionAvailability({
      ...TIKTOK_CREATOR_INFO_FIXTURE.data,
      privacy_level_options: [...TIKTOK_CREATOR_INFO_FIXTURE.data.privacy_level_options],
    });
    expect(availability.commentAllowed).toBe(true);
    expect(availability.stitchAllowed).toBe(false);
  });
});

describe('TikTok validation', () => {
  it('requires an explicit comment, duet and stitch choice', async () => {
    const { deps } = createTestDeps();
    const connector = createTikTokConnector(deps);
    const result = await connector.validateDraft(
      videoDraft({
        connection: { ...connection, metadata: { ...connection.metadata, providerOptions: {
          privacyLevel: 'SELF_ONLY',
          commercialContent: false,
          musicRightsConfirmed: true,
          consentConfirmed: true,
        } } },
      }),
    );
    const interaction = result.issues.filter(
      (issue) => issue.code === 'TIKTOK_INTERACTION_CHOICE_REQUIRED',
    );
    expect(interaction).toHaveLength(3);
  });

  it('requires the commercial content declaration and its kind', async () => {
    const { deps } = createTestDeps();
    const connector = createTikTokConnector(deps);
    const missing = await connector.validateDraft(
      videoDraft({
        connection: { ...connection, metadata: { ...connection.metadata, providerOptions: { ...COMPLETE_OPTIONS, commercialContent: undefined } } },
      }),
    );
    expect(
      missing.issues.some((issue) => issue.code === 'TIKTOK_COMMERCIAL_DECLARATION_REQUIRED'),
    ).toBe(true);

    const unkinded = await connector.validateDraft(
      videoDraft({
        connection: { ...connection, metadata: { ...connection.metadata, providerOptions: { ...COMPLETE_OPTIONS, commercialContent: true } } },
      }),
    );
    expect(unkinded.issues.some((issue) => issue.code === 'TIKTOK_COMMERCIAL_KIND_REQUIRED')).toBe(
      true,
    );
  });

  it('requires the music rights confirmation and explicit consent', async () => {
    const { deps } = createTestDeps();
    const connector = createTikTokConnector(deps);
    const result = await connector.validateDraft(
      videoDraft({
        connection: { ...connection, metadata: { ...connection.metadata, providerOptions: {
          ...COMPLETE_OPTIONS,
          musicRightsConfirmed: undefined,
          consentConfirmed: undefined,
        } } },
      }),
    );
    expect(
      result.issues.some((issue) => issue.code === 'TIKTOK_MUSIC_RIGHTS_CONFIRMATION_REQUIRED'),
    ).toBe(true);
    expect(result.issues.some((issue) => issue.code === 'TIKTOK_CONSENT_REQUIRED')).toBe(true);
  });

  it('rejects a first comment because TikTok does not offer it to us', async () => {
    const { deps } = createTestDeps();
    const connector = createTikTokConnector(deps);
    const result = await connector.validateDraft(
      videoDraft({
        threadItems: [
          { id: 'cmt_test_1', kind: 'comment', order: 1, body: 'First.', media: [], delaySeconds: 0 },
        ],
      }),
    );
    expect(result.issues.some((issue) => issue.code === 'TIKTOK_FIRST_COMMENT_UNSUPPORTED')).toBe(
      true,
    );
  });

  it('accepts a complete, consented draft', async () => {
    const { deps } = createTestDeps();
    const connector = createTikTokConnector(deps);
    const result = await connector.validateDraft(videoDraft({ privacyValue: 'SELF_ONLY' }));
    expect(result.ok).toBe(true);
  });
});

describe('TikTok publish', () => {
  it('re-fetches creator info at dispatch and stops when the option is gone', async () => {
    const { deps } = createTestDeps({
      routes: [
        {
          method: 'POST',
          match: '/creator_info/query/',
          body: TIKTOK_CREATOR_INFO_PRIVATE_ONLY_FIXTURE,
        },
      ],
    });
    const connector = createTikTokConnector(deps);
    await expect(
      connector.publish(
        request({
          draft: videoDraft({
            connection: { ...connection, metadata: { ...connection.metadata, providerOptions: { ...COMPLETE_OPTIONS, privacyLevel: 'PUBLIC_TO_EVERYONE' } } },
          }),
        }) as never,
      ),
    ).rejects.toSatisfy(
      (error: unknown) => RelayError.is(error) && error.code === 'CONNECTION_ACTION_REQUIRED',
    );
  });

  it('does not treat an upload as a publication', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'POST', match: '/creator_info/query/', body: TIKTOK_CREATOR_INFO_FIXTURE },
        { method: 'POST', match: '/video/init/', body: TIKTOK_PUBLISH_INIT_FIXTURE },
        { method: 'GET', match: 'storage.invalid', bytes: new Uint8Array(1024) },
        { method: 'PUT', match: 'open-upload.tiktokapis.invalid', status: 201 },
        { method: 'POST', match: '/status/fetch/', body: TIKTOK_STATUS_PROCESSING_FIXTURE },
      ],
    });
    const connector = createTikTokConnector(deps);
    const result = await connector.publish(request({ draft: videoDraft() }) as never);
    expect(result.status).toBe('pending');
    expect(expectPending(result).providerJobId).not.toBe('');
    expect(expectPending(result).providerJobId).toBe('v_pub_fake~publish.id.0000000001');
  });

  it('reports published only with a real post id from the status endpoint', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'POST', match: '/creator_info/query/', body: TIKTOK_CREATOR_INFO_FIXTURE },
        { method: 'POST', match: '/video/init/', body: TIKTOK_PUBLISH_INIT_FIXTURE },
        { method: 'GET', match: 'storage.invalid', bytes: new Uint8Array(1024) },
        { method: 'PUT', match: 'open-upload.tiktokapis.invalid', status: 201 },
        { method: 'POST', match: '/status/fetch/', body: TIKTOK_STATUS_COMPLETE_FIXTURE },
      ],
    });
    const connector = createTikTokConnector(deps);
    const result = await connector.publish(request({ draft: videoDraft() }) as never);
    expect(result.status).toBe('published');
    expect(expectPublished(result).externalPostId).toBe('7400000000000000001');
    expect(expectPublished(result).permalink).toBe(
      'https://www.tiktok.com/@sample_studio_fake/video/7400000000000000001',
    );
  });

  it('reports a terminal failure with the provider reason', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'POST', match: '/status/fetch/', body: TIKTOK_STATUS_FAILED_FIXTURE }],
    });
    const connector = createTikTokConnector(deps);
    const status = await connector.getStatus(testStatusRequest({ connection, providerJobId: 'v_pub_fake~publish.id.0000000001' }));
    expect(status.state).toBe('failed');
    expect(status.error?.remediationCode).toBe('provider_rejected_content');
  });

  it('never re-initializes a publish it already started', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [{ method: 'POST', match: '/status/fetch/', body: TIKTOK_STATUS_COMPLETE_FIXTURE }],
    });
    const connector = createTikTokConnector(deps);
    const result = await connector.publish(
      request({
        draft: videoDraft(),
        preparedMedia: [preparedPublish('v_pub_fake~publish.id.0000000001')],
      }) as never,
    );
    expect(expectPublished(result).externalPostId).toBe('7400000000000000001');
    expect(simulator.callsTo('/video/init/')).toHaveLength(0);
  });

  it('only pulls from a verified owned domain', () => {
    expect(isVerifiedPullDomain('https://cdn.relay.example/video.mp4', ['relay.example'])).toBe(
      true,
    );
    expect(isVerifiedPullDomain('https://storage.invalid/video.mp4', ['relay.example'])).toBe(
      false,
    );
    expect(isVerifiedPullDomain('not a url', ['relay.example'])).toBe(false);
  });
});

describe('TikTok metrics and discovery', () => {
  it('returns no observations rather than zeros while no insights product is approved', async () => {
    const { deps } = createTestDeps();
    const connector = createTikTokConnector(deps);
    const observations = await connector.fetchMetrics(testMetricsRequest({ connection, scope: 'post' }));
    expect(observations).toEqual([]);
  });

  it('discovers the creator account', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/user/info/', body: TIKTOK_USER_INFO_FIXTURE }],
    });
    const connector = createTikTokConnector(deps);
    const accounts = await connector.discoverAccounts(testGrant({ provider: 'tiktok', scopes: SCOPES }));
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.handle).toBe('sample_studio_fake');
    expect(accounts[0]?.metadata['unaudited']).toBe(true);
  });
});
