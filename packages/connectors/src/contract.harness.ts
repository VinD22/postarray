import type {
  MediaPreparationRequest,
  MetricsRequest,
  OAuthGrant,
  ProviderConnection,
  ProviderDraft,
  PublishRequest,
  StatusRequest,
} from './providers/shared/contract-shape';

import { createFakeConnector } from './fake/connector';
import {
  fakeConnectionRef,
  fakeDraft,
  fakeImageAsset,
  fakeMediaPreparationRequest,
  fakeMetricsRequest,
  fakePublishRequest,
  fakeStatusRequest,
  fakeThreadItem,
} from './fake/fixtures';
import { fixedClock } from './ports';
import type { SocialConnector } from './contract';
import {
  createTestDeps,
  testConnection,
  testDraft,
  testGrant,
  testMedia,
  testMetricsRequest,
  testPublishRequest,
  testStatusRequest,
  type ScriptedRoute,
} from './providers/shared/testing';
import { createBlueskyConnector } from './providers/bluesky/connector';
import { buildBlueskyCapabilities } from './providers/bluesky/capabilities';
import {
  BLUESKY_CREATE_RECORD_FIXTURE,
  BLUESKY_POST_THREAD_FIXTURE,
  BLUESKY_SESSION_FIXTURE,
} from './providers/bluesky/__fixtures__/index';
import { createLinkedInConnector } from './providers/linkedin/connector';
import { buildLinkedInCapabilities } from './providers/linkedin/capabilities';
import {
  LINKEDIN_ORGANIZATION_ACLS_FIXTURE,
  LINKEDIN_POST_FIXTURE,
  LINKEDIN_SHARE_STATISTICS_FIXTURE,
  LINKEDIN_SOCIAL_ACTIONS_FIXTURE,
  LINKEDIN_USERINFO_FIXTURE,
} from './providers/linkedin/__fixtures__/index';
import { createXConnector } from './providers/x/connector';
import { buildXCapabilities } from './providers/x/capabilities';
import {
  X_CREATE_POST_FIXTURE,
  X_POST_METRICS_FIXTURE,
  X_USER_ME_FIXTURE,
} from './providers/x/__fixtures__/index';
import { createYouTubeConnector } from './providers/youtube/connector';
import { buildYouTubeCapabilities } from './providers/youtube/capabilities';
import {
  YOUTUBE_CHANNELS_FIXTURE,
  YOUTUBE_UPLOAD_COMPLETE_FIXTURE,
  YOUTUBE_UPLOAD_STARTED_HEADERS,
  YOUTUBE_VIDEO_PROCESSED_FIXTURE,
  YOUTUBE_VIDEO_STATISTICS_FIXTURE,
} from './providers/youtube/__fixtures__/index';
import { createTikTokConnector } from './providers/tiktok/connector';
import { buildTikTokCapabilities } from './providers/tiktok/capabilities';
import {
  TIKTOK_CREATOR_INFO_FIXTURE,
  TIKTOK_STATUS_COMPLETE_FIXTURE,
  TIKTOK_USER_INFO_FIXTURE,
} from './providers/tiktok/__fixtures__/index';
import { createInstagramConnector } from './providers/meta/instagram/connector';
import { buildInstagramCapabilities } from './providers/meta/instagram/capabilities';
import {
  INSTAGRAM_BUSINESS_ACCOUNT_FIXTURE,
  INSTAGRAM_CONTAINER_FINISHED_FIXTURE,
  INSTAGRAM_CONTAINER_FIXTURE,
  INSTAGRAM_MEDIA_FIXTURE,
  INSTAGRAM_MEDIA_INSIGHTS_FIXTURE,
  INSTAGRAM_PAGES_FIXTURE,
  INSTAGRAM_PUBLISH_FIXTURE,
} from './providers/meta/instagram/__fixtures__/index';
import { createFacebookConnector } from './providers/meta/facebook/connector';
import { buildFacebookCapabilities } from './providers/meta/facebook/capabilities';
import {
  FACEBOOK_FEED_POST_FIXTURE,
  FACEBOOK_PAGES_FIXTURE,
  FACEBOOK_POST_INSIGHTS_FIXTURE,
  FACEBOOK_POST_LOOKUP_FIXTURE,
} from './providers/meta/facebook/__fixtures__/index';
import { createThreadsConnector } from './providers/meta/threads/connector';
import { buildThreadsCapabilities } from './providers/meta/threads/capabilities';
import {
  THREADS_CONTAINER_FINISHED_FIXTURE,
  THREADS_CONTAINER_FIXTURE,
  THREADS_MEDIA_FIXTURE,
  THREADS_MEDIA_INSIGHTS_FIXTURE,
  THREADS_PROFILE_FIXTURE,
  THREADS_PUBLISH_FIXTURE,
} from './providers/meta/threads/__fixtures__/index';

const clock = fixedClock('2026-08-04T12:00:00.000Z');

export interface ConnectorContractCase {
  readonly provider: string;
  readonly connector: SocialConnector;
  readonly connection: ProviderConnection;
  readonly draft: ProviderDraft;
  readonly grant: OAuthGrant;
  readonly mediaRequest: MediaPreparationRequest;
  readonly publishRequest: PublishRequest;
  readonly statusRequest: StatusRequest;
  readonly metricsRequest: MetricsRequest;
  readonly forbiddenSecret: string;
}

function caseFrom(input: {
  readonly provider: string;
  readonly routes: readonly ScriptedRoute[];
  readonly create: (deps: ReturnType<typeof createTestDeps>['deps']) => SocialConnector;
  readonly connection: ProviderConnection;
  readonly draft: ProviderDraft;
  readonly grant: OAuthGrant;
  readonly publishRequest: PublishRequest;
  readonly statusRequest: StatusRequest;
  readonly metricsRequest: MetricsRequest;
  readonly forbiddenSecret: string;
}): ConnectorContractCase {
  const { deps } = createTestDeps({ routes: input.routes });
  return {
    provider: input.provider,
    connector: input.create(deps),
    connection: input.connection,
    draft: input.draft,
    grant: input.grant,
    mediaRequest: fakeMediaPreparationRequest(input.draft),
    publishRequest: input.publishRequest,
    statusRequest: input.statusRequest,
    metricsRequest: input.metricsRequest,
    forbiddenSecret: input.forbiddenSecret,
  };
}

/** Providers that run the shared contract suite in CI. Production allow-list stays separate. */
export const CONTRACT_HARNESS_PROVIDERS = [
  'fake',
  'bluesky',
  'linkedin',
  'x',
  'youtube',
  'tiktok',
  'instagram',
  'facebook',
  'threads',
] as const;

export function buildConnectorContractCases(): readonly ConnectorContractCase[] {
  const fakeConnection = fakeConnectionRef({}, { clock });
  const fakeContractDraft = fakeDraft(
    {
      contentKind: 'image',
      media: [fakeImageAsset()],
      threadItems: [fakeThreadItem()],
    },
    { clock, connection: fakeConnection },
  );

  const blueskyConnection = testConnection({
    provider: 'bluesky',
    externalAccountId: 'did:plc:fakedidfakedidfake01',
    metadata: { handle: 'sample-studio.fake.invalid', serviceUrl: 'https://bsky.invalid' },
  });
  const blueskyContractDraft = testDraft({
    connection: blueskyConnection,
    capabilities: buildBlueskyCapabilities({
      connection: blueskyConnection,
      observedAt: '2026-08-04T12:00:00.000Z',
    }),
    contentKind: 'text',
  });

  const linkedInOrgScopes = [
    'openid',
    'profile',
    'w_member_social',
    'w_organization_social',
    'r_organization_social',
    'rw_organization_admin',
  ];
  const linkedInConnection = testConnection({
    provider: 'linkedin',
    accountType: 'organization',
    externalAccountId: '99000001',
    scopes: linkedInOrgScopes,
  });
  const linkedInCapabilities = buildLinkedInCapabilities({
    connection: linkedInConnection,
    observedAt: '2026-08-04T12:00:00.000Z',
    grantedScopes: linkedInOrgScopes,
  });
  const linkedInDraft = testDraft({
    connection: linkedInConnection,
    capabilities: linkedInCapabilities,
    body: 'An organization update.',
  });
  const linkedInPostUrn = 'urn:li:share:7100000000000000001';

  const xScopes = ['tweet.read', 'tweet.write', 'users.read', 'media.write', 'offline.access'];
  const xConnection = testConnection({
    provider: 'x',
    scopes: xScopes,
    externalAccountId: '4400000000000000001',
    metadata: { username: 'sample_studio_fake' },
  });
  const xCapabilities = buildXCapabilities({
    connection: xConnection,
    observedAt: '2026-08-04T12:00:00.000Z',
    grantedScopes: xScopes,
  });
  const xDraft = testDraft({
    connection: xConnection,
    capabilities: xCapabilities,
    body: 'Hello.',
  });
  const xPostId = '1900000000000000001';

  const youTubeScopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.force-ssl',
  ];
  const youTubeConnection = testConnection({
    provider: 'youtube',
    accountType: 'channel',
    externalAccountId: 'UCFAKECHANNEL0000000001',
    scopes: youTubeScopes,
    metadata: { longUploadsAllowed: false },
  });
  const youTubeCapabilities = buildYouTubeCapabilities({
    connection: youTubeConnection,
    observedAt: '2026-08-04T12:00:00.000Z',
    grantedScopes: youTubeScopes,
    longUploadsAllowed: false,
    customThumbnailAllowed: false,
  });
  const youTubeDraft = testDraft({
    capabilities: youTubeCapabilities,
    contentKind: 'video',
    title: 'Sample upload',
    body: 'A sample description.',
    media: [
      testMedia({
        kind: 'video',
        mimeType: 'video/mp4',
        byteSize: 5_000_000,
        width: 1920,
        height: 1080,
        durationSeconds: 120,
      }),
    ],
    privacyValue: 'private',
    connection: {
      ...youTubeConnection,
      metadata: { ...youTubeConnection.metadata, providerOptions: { madeForKids: false } },
    },
  });
  const youTubeVideoId = 'FAKEVIDEOID001';

  const tikTokScopes = ['user.info.basic', 'user.info.profile', 'video.publish', 'video.upload'];
  const tikTokConnection = testConnection({
    provider: 'tiktok',
    accountType: 'creator_profile',
    externalAccountId: 'fake-open-id-0000000001',
    scopes: tikTokScopes,
    metadata: { username: 'sample_studio_fake' },
  });
  const tikTokCompleteOptions = {
    privacyLevel: 'SELF_ONLY',
    disableComment: false,
    disableDuet: false,
    disableStitch: true,
    commercialContent: false,
    musicRightsConfirmed: true,
    consentConfirmed: true,
  };
  const tikTokCapabilities = buildTikTokCapabilities({
    connection: tikTokConnection,
    observedAt: '2026-08-04T12:00:00.000Z',
    grantedScopes: tikTokScopes,
    creatorInfo: {
      ...TIKTOK_CREATOR_INFO_FIXTURE.data,
      privacy_level_options: [...TIKTOK_CREATOR_INFO_FIXTURE.data.privacy_level_options],
    },
  });
  const tikTokDraft = testDraft({
    capabilities: tikTokCapabilities,
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
    connection: {
      ...tikTokConnection,
      metadata: { ...tikTokConnection.metadata, providerOptions: tikTokCompleteOptions },
    },
  });
  const tikTokPublishId = 'v_pub_fake~publish.id.0000000001';

  const instagramScopes = [
    'instagram_basic',
    'instagram_content_publish',
    'instagram_manage_insights',
    'instagram_manage_comments',
    'pages_show_list',
  ];
  const instagramConnection = testConnection({
    provider: 'instagram',
    accountType: 'business_profile',
    externalAccountId: '17840000000000001',
    parentExternalId: '61550000000001',
    scopes: instagramScopes,
  });
  const instagramCapabilities = buildInstagramCapabilities({
    connection: instagramConnection,
    observedAt: '2026-08-04T12:00:00.000Z',
    grantedScopes: instagramScopes,
  });
  const instagramDraft = testDraft({
    connection: instagramConnection,
    capabilities: instagramCapabilities,
    contentKind: 'image',
    body: 'A quiet caption.',
    media: [testMedia({ kind: 'image', width: 1080, height: 1080 })],
  });
  const instagramMediaId = '17880000000000001';

  const facebookScopes = [
    'pages_show_list',
    'pages_manage_posts',
    'pages_read_engagement',
    'pages_manage_engagement',
    'read_insights',
  ];
  const facebookConnection = testConnection({
    provider: 'facebook',
    accountType: 'page',
    externalAccountId: '61550000000001',
    scopes: facebookScopes,
  });
  const facebookCapabilities = buildFacebookCapabilities({
    connection: facebookConnection,
    observedAt: '2026-08-04T12:00:00.000Z',
    grantedScopes: facebookScopes,
  });
  const facebookDraft = testDraft({
    connection: facebookConnection,
    capabilities: facebookCapabilities,
    body: 'A sample Page post.',
  });
  const facebookPostId = '61550000000001_122000000000001';

  const threadsScopes = [
    'threads_basic',
    'threads_content_publish',
    'threads_manage_replies',
    'threads_manage_insights',
  ];
  const threadsConnection = testConnection({
    provider: 'threads',
    accountType: 'personal_profile',
    externalAccountId: '78000000000000001',
    scopes: threadsScopes,
  });
  const threadsCapabilities = buildThreadsCapabilities({
    connection: threadsConnection,
    observedAt: '2026-08-04T12:00:00.000Z',
    grantedScopes: threadsScopes,
  });
  const threadsDraft = testDraft({
    connection: threadsConnection,
    capabilities: threadsCapabilities,
    body: 'A sample Threads post.',
  });
  const threadsMediaId = '19000000000000001';

  return [
    caseFrom({
      provider: 'fake',
      routes: [],
      create: () => createFakeConnector({ clock, instant: true }),
      connection: fakeConnection,
      draft: fakeContractDraft,
      grant: {
        provider: 'fake',
        workspaceId: 'ws_1',
        accessToken: fakeConnection.accessToken,
        refreshToken: null,
        grantedScopes: ['fake.read'],
        obtainedAt: '2026-08-04T12:00:00.000Z',
        accessTokenExpiresAt: null,
        grantMetadata: {},
      },
      publishRequest: fakePublishRequest(fakeContractDraft, {}, { clock }),
      statusRequest: fakeStatusRequest(fakeContractDraft, {}, { clock }),
      metricsRequest: fakeMetricsRequest(fakeContractDraft, 'fkp_anything'),
      forbiddenSecret: 'fake-access-token-for-local-development',
    }),
    caseFrom({
      provider: 'bluesky',
      routes: [
        { method: 'GET', match: 'com.atproto.server.getSession', body: BLUESKY_SESSION_FIXTURE },
        {
          method: 'POST',
          match: 'com.atproto.repo.createRecord',
          body: BLUESKY_CREATE_RECORD_FIXTURE,
        },
        { method: 'GET', match: 'app.bsky.feed.getPostThread', body: BLUESKY_POST_THREAD_FIXTURE },
      ],
      create: (deps) => createBlueskyConnector(deps),
      connection: blueskyConnection,
      draft: blueskyContractDraft,
      grant: testGrant({ provider: 'bluesky' }),
      publishRequest: testPublishRequest({ draft: blueskyContractDraft }),
      statusRequest: testStatusRequest({
        connection: blueskyConnection,
        externalPostId: BLUESKY_CREATE_RECORD_FIXTURE.uri,
      }),
      metricsRequest: testMetricsRequest({
        connection: blueskyConnection,
        scope: 'post',
        externalPostId: BLUESKY_CREATE_RECORD_FIXTURE.uri,
      }),
      forbiddenSecret: 'fake-test-access-token-not-a-real-credential',
    }),
    caseFrom({
      provider: 'linkedin',
      routes: [
        { method: 'GET', match: '/v2/userinfo', body: LINKEDIN_USERINFO_FIXTURE },
        { method: 'GET', match: '/organizationAcls', body: LINKEDIN_ORGANIZATION_ACLS_FIXTURE },
        {
          method: 'POST',
          match: '/rest/posts',
          status: 201,
          headers: { 'x-restli-id': linkedInPostUrn },
          body: {},
        },
        { method: 'GET', match: 'urn%3Ali%3Ashare', body: LINKEDIN_POST_FIXTURE },
        { method: 'GET', match: 'socialActions', body: LINKEDIN_SOCIAL_ACTIONS_FIXTURE },
        {
          method: 'GET',
          match: 'organizationalEntityShareStatistics',
          body: LINKEDIN_SHARE_STATISTICS_FIXTURE,
        },
      ],
      create: (deps) => createLinkedInConnector(deps),
      connection: linkedInConnection,
      draft: linkedInDraft,
      grant: testGrant({ provider: 'linkedin', scopes: linkedInOrgScopes }),
      publishRequest: testPublishRequest({ draft: linkedInDraft }),
      statusRequest: testStatusRequest({
        connection: linkedInConnection,
        externalPostId: linkedInPostUrn,
      }),
      metricsRequest: testMetricsRequest({
        connection: linkedInConnection,
        scope: 'post',
        externalPostId: linkedInPostUrn,
      }),
      forbiddenSecret: 'fake-test-access-token-not-a-real-credential',
    }),
    caseFrom({
      provider: 'x',
      routes: [
        {
          method: 'GET',
          match: `/users/${xConnection.externalAccountId}/tweets`,
          body: { data: [] },
        },
        { method: 'POST', match: '/2/tweets', body: X_CREATE_POST_FIXTURE },
        { method: 'GET', match: `/2/tweets/${xPostId}`, body: X_POST_METRICS_FIXTURE },
        { method: 'GET', match: '/2/users/me', body: X_USER_ME_FIXTURE },
      ],
      create: (deps) => createXConnector(deps),
      connection: xConnection,
      draft: xDraft,
      grant: testGrant({ provider: 'x', scopes: xScopes }),
      publishRequest: testPublishRequest({ draft: xDraft }),
      statusRequest: testStatusRequest({ connection: xConnection, externalPostId: xPostId }),
      metricsRequest: testMetricsRequest({
        connection: xConnection,
        scope: 'post',
        externalPostId: xPostId,
      }),
      forbiddenSecret: 'fake-test-access-token-not-a-real-credential',
    }),
    caseFrom({
      provider: 'youtube',
      routes: [
        { method: 'GET', match: '/channels', body: YOUTUBE_CHANNELS_FIXTURE },
        {
          method: 'POST',
          match: '/upload/youtube/v3/videos',
          status: 200,
          headers: YOUTUBE_UPLOAD_STARTED_HEADERS,
        },
        { method: 'GET', match: 'storage.invalid', bytes: new Uint8Array(1024) },
        {
          method: 'PUT',
          match: 'upload_id=FAKEUPLOADSESSION001',
          body: YOUTUBE_UPLOAD_COMPLETE_FIXTURE,
        },
        { method: 'PUT', match: '/videos', body: {} },
        { method: 'GET', match: youTubeVideoId, body: YOUTUBE_VIDEO_PROCESSED_FIXTURE },
        { method: 'GET', match: '/videos', body: YOUTUBE_VIDEO_STATISTICS_FIXTURE },
      ],
      create: (deps) => createYouTubeConnector(deps),
      connection: youTubeConnection,
      draft: youTubeDraft,
      grant: testGrant({ provider: 'youtube', scopes: youTubeScopes }),
      publishRequest: testPublishRequest({
        draft: youTubeDraft,
        preparedMedia: [
          {
            mediaId: 'media_test_video',
            derivativeId: null,
            providerMediaId: youTubeVideoId,
            containerId: null,
            uploadState: 'processing',
            derivativeChecksum: 'b'.repeat(64),
            byteSize: 5_000_000,
            altTextApplied: false,
            publicUrl: null,
            expiresAt: null,
            reusedFromPreviousAttempt: true,
          },
        ],
      }),
      statusRequest: testStatusRequest({
        connection: youTubeConnection,
        providerJobId: youTubeVideoId,
      }),
      metricsRequest: testMetricsRequest({
        connection: youTubeConnection,
        scope: 'post',
        externalPostId: youTubeVideoId,
      }),
      forbiddenSecret: 'fake-test-access-token-not-a-real-credential',
    }),
    caseFrom({
      provider: 'tiktok',
      routes: [
        { method: 'GET', match: '/user/info/', body: TIKTOK_USER_INFO_FIXTURE },
        { method: 'POST', match: '/creator_info/query/', body: TIKTOK_CREATOR_INFO_FIXTURE },
        { method: 'POST', match: '/status/fetch/', body: TIKTOK_STATUS_COMPLETE_FIXTURE },
      ],
      create: (deps) => createTikTokConnector(deps),
      connection: tikTokConnection,
      draft: tikTokDraft,
      grant: testGrant({ provider: 'tiktok', scopes: tikTokScopes }),
      publishRequest: testPublishRequest({
        draft: tikTokDraft,
        preparedMedia: [
          {
            mediaId: 'media_test_video',
            derivativeId: null,
            providerMediaId: tikTokPublishId,
            containerId: null,
            uploadState: 'processing',
            derivativeChecksum: 'e'.repeat(64),
            byteSize: 5_000_000,
            altTextApplied: false,
            publicUrl: null,
            expiresAt: null,
            reusedFromPreviousAttempt: true,
          },
        ],
      }),
      statusRequest: testStatusRequest({
        connection: tikTokConnection,
        providerJobId: tikTokPublishId,
      }),
      metricsRequest: testMetricsRequest({ connection: tikTokConnection, scope: 'post' }),
      forbiddenSecret: 'fake-test-access-token-not-a-real-credential',
    }),
    caseFrom({
      provider: 'instagram',
      routes: [
        { method: 'GET', match: '/me/accounts', body: INSTAGRAM_PAGES_FIXTURE },
        { method: 'GET', match: '/17840000000000001', body: INSTAGRAM_BUSINESS_ACCOUNT_FIXTURE },
        { method: 'POST', match: '/media', body: INSTAGRAM_CONTAINER_FIXTURE },
        { method: 'GET', match: '/17990000000000001', body: INSTAGRAM_CONTAINER_FINISHED_FIXTURE },
        { method: 'POST', match: '/media_publish', body: INSTAGRAM_PUBLISH_FIXTURE },
        { method: 'GET', match: `/${instagramMediaId}`, body: INSTAGRAM_MEDIA_FIXTURE },
        { method: 'GET', match: '/insights', body: INSTAGRAM_MEDIA_INSIGHTS_FIXTURE },
      ],
      create: (deps) => createInstagramConnector(deps),
      connection: instagramConnection,
      draft: instagramDraft,
      grant: testGrant({ provider: 'instagram', scopes: instagramScopes }),
      publishRequest: testPublishRequest({ draft: instagramDraft }),
      statusRequest: testStatusRequest({
        connection: instagramConnection,
        externalPostId: instagramMediaId,
      }),
      metricsRequest: testMetricsRequest({
        connection: instagramConnection,
        scope: 'post',
        externalPostId: instagramMediaId,
      }),
      forbiddenSecret: 'fake-page-token-not-a-real-credential',
    }),
    caseFrom({
      provider: 'facebook',
      routes: [
        { method: 'GET', match: '/me/accounts', body: FACEBOOK_PAGES_FIXTURE },
        { method: 'POST', match: '/feed', body: FACEBOOK_FEED_POST_FIXTURE },
        { method: 'GET', match: facebookPostId, body: FACEBOOK_POST_LOOKUP_FIXTURE },
        { method: 'GET', match: '/insights', body: FACEBOOK_POST_INSIGHTS_FIXTURE },
      ],
      create: (deps) => createFacebookConnector(deps),
      connection: facebookConnection,
      draft: facebookDraft,
      grant: testGrant({ provider: 'facebook', scopes: facebookScopes }),
      publishRequest: testPublishRequest({ draft: facebookDraft }),
      statusRequest: testStatusRequest({
        connection: facebookConnection,
        externalPostId: facebookPostId,
      }),
      metricsRequest: testMetricsRequest({
        connection: facebookConnection,
        scope: 'post',
        externalPostId: facebookPostId,
      }),
      forbiddenSecret: 'fake-page-token-not-a-real-credential',
    }),
    caseFrom({
      provider: 'threads',
      routes: [
        { method: 'GET', match: '/me', body: THREADS_PROFILE_FIXTURE },
        { method: 'POST', match: '/threads', body: THREADS_CONTAINER_FIXTURE },
        { method: 'GET', match: '/18000000000000001', body: THREADS_CONTAINER_FINISHED_FIXTURE },
        { method: 'POST', match: '/threads_publish', body: THREADS_PUBLISH_FIXTURE },
        { method: 'GET', match: `/${threadsMediaId}`, body: THREADS_MEDIA_FIXTURE },
        { method: 'GET', match: '/insights', body: THREADS_MEDIA_INSIGHTS_FIXTURE },
      ],
      create: (deps) => createThreadsConnector(deps),
      connection: threadsConnection,
      draft: threadsDraft,
      grant: testGrant({ provider: 'threads', scopes: threadsScopes }),
      publishRequest: testPublishRequest({ draft: threadsDraft }),
      statusRequest: testStatusRequest({
        connection: threadsConnection,
        providerJobId: threadsMediaId,
      }),
      metricsRequest: testMetricsRequest({
        connection: threadsConnection,
        scope: 'post',
        externalPostId: threadsMediaId,
      }),
      forbiddenSecret: 'fake-test-access-token-not-a-real-credential',
    }),
  ];
}
