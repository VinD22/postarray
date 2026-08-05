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
  YOUTUBE_UPLOADS_PER_DAY,
  buildYouTubeCapabilities,
  isUnaudited,
  youTubePrivacyOptions,
} from './capabilities.js';
import { createYouTubeConnector } from './connector.js';
import {
  YOUTUBE_CHANNELS_FIXTURE,
  YOUTUBE_COMMENT_THREAD_FIXTURE,
  YOUTUBE_QUOTA_EXCEEDED_FIXTURE,
  YOUTUBE_UPLOAD_COMPLETE_FIXTURE,
  YOUTUBE_UPLOAD_STARTED_HEADERS,
  YOUTUBE_VIDEO_PROCESSED_FIXTURE,
  YOUTUBE_VIDEO_PROCESSING_FIXTURE,
  YOUTUBE_VIDEO_REJECTED_FIXTURE,
  YOUTUBE_VIDEO_STATISTICS_FIXTURE,
  YOUTUBE_VIDEO_STATISTICS_HIDDEN_LIKES_FIXTURE,
} from './__fixtures__/index.js';

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl',
];

const connection = testConnection({
  provider: 'youtube',
  accountType: 'channel',
  externalAccountId: 'UCFAKECHANNEL0000000001',
  scopes: SCOPES,
  metadata: { longUploadsAllowed: false },
});

const capabilities = buildYouTubeCapabilities({
  connection,
  observedAt: '2026-08-04T12:00:00.000Z',
  grantedScopes: SCOPES,
  longUploadsAllowed: false,
  customThumbnailAllowed: false,
});

function videoDraft(overrides: Record<string, unknown> = {}) {
  return testDraft({
    capabilities,
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
    connection: { ...connection, metadata: { ...connection.metadata, providerOptions: { madeForKids: false } } },
    ...overrides,
  });
}

/** A video whose bytes an earlier attempt already uploaded. */
function preparedVideo(providerMediaId: string): Record<string, unknown> {
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
    idempotencyKey: 'idem-youtube-0001',
    capabilityVersion: capabilities.capabilityVersion,
    contentChecksum: '1'.repeat(64),
    dispatchedAt: '2026-08-04T12:00:00.000Z',
    resume: {},
    ...overrides,
  };
}

describe('YouTube unaudited constraint', () => {
  it('offers only the private privacy option while the project is unaudited', () => {
    expect(isUnaudited()).toBe(true);
    expect(youTubePrivacyOptions().map((option) => option.value)).toEqual(['private']);
    expect(capabilities.privacy.options).toHaveLength(1);
  });

  it('encodes the constraint in the snapshot rather than as a runtime surprise', () => {
    expect(capabilities.privacy.options[0]?.value).toBe('private');
    expect(capabilities.privacy.options[0]?.isDefault).toBe(true);
  });

  it('rejects a public upload at validation with the awaiting approval remediation', async () => {
    const { deps } = createTestDeps();
    const connector = createYouTubeConnector(deps);
    const result = await connector.validateDraft(videoDraft({ privacyValue: 'public' }));
    const issue = result.issues.find((entry) => entry.code === 'YOUTUBE_PRIVACY_NOT_AVAILABLE');
    expect(issue?.severity).toBe('error');
    expect(issue?.remediationKey).toBe('awaiting_provider_approval');
  });

  it('warns on a private upload so the user knows before scheduling', async () => {
    const { deps } = createTestDeps();
    const connector = createYouTubeConnector(deps);
    const result = await connector.validateDraft(videoDraft());
    expect(result.ok).toBe(true);
    expect(result.issues.some((issue) => issue.code === 'YOUTUBE_UPLOADS_ARE_PRIVATE')).toBe(true);
  });
});

describe('YouTube capability snapshot', () => {
  it('does not claim a separate Shorts API', () => {
    expect(capabilities.contentKinds.short_video).toBe('supported');
    expect(capabilities.contentKinds.video).toBe('supported');
  });

  it('gates long uploads behind channel verification', () => {
    expect(capabilities.contentKinds.long_video).toBe('requires_review');
    expect(capabilities.media.maxDurationSeconds).toBe(900);
    const verified = buildYouTubeCapabilities({
      connection,
      observedAt: '2026-08-04T12:00:00.000Z',
      grantedScopes: SCOPES,
      longUploadsAllowed: true,
      customThumbnailAllowed: false,
    });
    expect(verified.contentKinds.long_video).toBe('supported');
    expect(verified.media.maxDurationSeconds).toBe(43_200);
  });

  it('expresses the daily quota as an upload budget', () => {
    expect(capabilities.rateLimit).toEqual({
      windowSeconds: 86_400,
      maxRequests: YOUTUBE_UPLOADS_PER_DAY,
    });
    expect(YOUTUBE_UPLOADS_PER_DAY).toBe(6);
  });
});

describe('YouTube validation', () => {
  it('requires a title and an audience declaration', async () => {
    const { deps } = createTestDeps();
    const connector = createYouTubeConnector(deps);
    const result = await connector.validateDraft(
      videoDraft({
        title: null,
        connection: { ...connection, metadata: { ...connection.metadata, providerOptions: {} } },
      }),
    );
    expect(result.issues.some((issue) => issue.code === 'YOUTUBE_TITLE_REQUIRED')).toBe(true);
    expect(
      result.issues.some((issue) => issue.code === 'YOUTUBE_AUDIENCE_DECLARATION_REQUIRED'),
    ).toBe(true);
  });

  it('blocks a first comment when the uploader disabled comments', async () => {
    const { deps } = createTestDeps();
    const connector = createYouTubeConnector(deps);
    const result = await connector.validateDraft(
      videoDraft({
        connection: { ...connection, metadata: { ...connection.metadata, providerOptions: { madeForKids: false, commentsDisabled: true } } },
        threadItems: [
          { id: 'cmt_test_1', kind: 'comment', order: 1, body: 'First.', media: [], delaySeconds: 0 },
        ],
      }),
    );
    expect(result.issues.some((issue) => issue.code === 'YOUTUBE_COMMENTS_DISABLED')).toBe(true);
  });

  it('requires the altered content declaration when the draft says it is AI assisted', async () => {
    const { deps } = createTestDeps();
    const connector = createYouTubeConnector(deps);
    const result = await connector.validateDraft(
      videoDraft({
        disclosure: { aiAssisted: true, commercialContent: false, brandedContent: false },
      }),
    );
    expect(
      result.issues.some(
        (issue) => issue.code === 'YOUTUBE_ALTERED_CONTENT_DECLARATION_REQUIRED',
      ),
    ).toBe(true);
  });
});

describe('YouTube upload and publish', () => {
  it('starts a resumable session and records the session URI for a resume', async () => {
    const { deps } = createTestDeps({
      routes: [
        {
          method: 'POST',
          match: '/upload/youtube/v3/videos',
          status: 200,
          headers: YOUTUBE_UPLOAD_STARTED_HEADERS,
        },
        {
          method: 'GET',
          match: 'storage.invalid',
          bytes: new Uint8Array(1024),
        },
        {
          method: 'PUT',
          match: 'upload_id=FAKEUPLOADSESSION001',
          body: YOUTUBE_UPLOAD_COMPLETE_FIXTURE,
        },
      ],
    });
    const connector = createYouTubeConnector(deps);
    const prepared = await connector.prepareMedia({
      connection,
      draft: videoDraft(),
      media: videoDraft().media,
      idempotencyKey: 'idem-youtube-0001',
    } as never);
    expect(prepared[0]?.providerMediaId).toBe('FAKEVIDEOID001');
    expect(prepared[0]?.uploadState).toBe('processing');
  });

  it('classifies quota exhaustion as reschedulable, not as a permanent failure', async () => {
    const { deps } = createTestDeps({
      routes: [
        {
          method: 'POST',
          match: '/upload/youtube/v3/videos',
          status: 403,
          body: YOUTUBE_QUOTA_EXCEEDED_FIXTURE,
        },
      ],
    });
    const connector = createYouTubeConnector(deps);
    await expect(
      connector.prepareMedia({
        connection,
        draft: videoDraft(),
        media: videoDraft().media,
        idempotencyKey: 'idem-youtube-0002',
      } as never),
    ).rejects.toSatisfy((error: unknown) => RelayError.is(error));
  });

  it('reports a video that is still processing as pending, never published', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'PUT', match: '/videos', body: {} },{ method: 'GET', match: '/videos', body: YOUTUBE_VIDEO_PROCESSING_FIXTURE }],
    });
    const connector = createYouTubeConnector(deps);
    const result = await connector.publish(
      request({ draft: videoDraft(), preparedMedia: [preparedVideo('FAKEVIDEOID001')] }) as never,
    );
    expect(result.status).toBe('pending');
    expect(expectPending(result).providerJobId).toBe('FAKEVIDEOID001');
  });

  it('reports the video id and watch URL once YouTube finished processing', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'PUT', match: '/videos', body: {} },{ method: 'GET', match: '/videos', body: YOUTUBE_VIDEO_PROCESSED_FIXTURE }],
    });
    const connector = createYouTubeConnector(deps);
    const result = await connector.publish(
      request({ draft: videoDraft(), preparedMedia: [preparedVideo('FAKEVIDEOID001')] }) as never,
    );
    expect(result.status).toBe('published');
    expect(expectPublished(result).externalPostId).toBe('FAKEVIDEOID001');
    expect(expectPublished(result).permalink).toBe('https://www.youtube.com/watch?v=FAKEVIDEOID001');
  });

  it('fails permanently when YouTube rejected the video', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'PUT', match: '/videos', body: {} },{ method: 'GET', match: '/videos', body: YOUTUBE_VIDEO_REJECTED_FIXTURE }],
    });
    const connector = createYouTubeConnector(deps);
    const status = await connector.getStatus(testStatusRequest({ connection, providerJobId: 'FAKEVIDEOID002' }));
    expect(status.state).toBe('failed');
    expect(status.error?.remediationCode).toBe('provider_rejected_content');
  });

  it('posts a first comment after the video is live', async () => {
    const { deps, simulator } = createTestDeps({
      routes: [
        { method: 'PUT', match: '/videos', body: {} },
        { method: 'GET', match: '/videos', body: YOUTUBE_VIDEO_PROCESSED_FIXTURE },
        { method: 'POST', match: '/commentThreads', body: YOUTUBE_COMMENT_THREAD_FIXTURE },
      ],
    });
    const connector = createYouTubeConnector(deps);
    const result = await connector.publish(
      request({
        draft: videoDraft({
          threadItems: [
            {
              threadItemId: 'cmt_test_1',
              kind: 'comment',
              order: 1,
              body: 'Chapters below.',
              media: [],
              delaySeconds: 0,
              links: [],
            },
          ],
        }),
        preparedMedia: [preparedVideo('FAKEVIDEOID001')],
      }) as never,
    );
    expect(result.status).toBe('published');
    expect(expectPublished(result).items[0]?.kind).toBe('root');
    expect(expectPublished(result).items[1]?.externalPostId).toBe('FAKECOMMENTTHREAD001');
    expect(simulator.callsTo('/commentThreads')).toHaveLength(1);
  });
});

describe('YouTube metrics', () => {
  it('maps the statistics YouTube returned', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'PUT', match: '/videos', body: {} },{ method: 'GET', match: '/videos', body: YOUTUBE_VIDEO_STATISTICS_FIXTURE }],
    });
    const connector = createYouTubeConnector(deps);
    const observations = await connector.fetchMetrics(testMetricsRequest({ connection, scope: 'post', externalPostId: 'FAKEVIDEOID001' }));
    expect(observations.find((entry) => entry.normalizedName === 'views')?.value).toBe(15_230);
    expect(observations.find((entry) => entry.normalizedName === 'likes')?.value).toBe(412);
  });

  it('reports a hidden like count as unavailable rather than zero', async () => {
    const { deps } = createTestDeps({
      routes: [
        { method: 'PUT', match: '/videos', body: {} },
        { method: 'GET', match: '/videos', body: YOUTUBE_VIDEO_STATISTICS_HIDDEN_LIKES_FIXTURE },
      ],
    });
    const connector = createYouTubeConnector(deps);
    const observations = await connector.fetchMetrics(testMetricsRequest({ connection, scope: 'post', externalPostId: 'FAKEVIDEOID003' }));
    const likes = observations.find((entry) => entry.normalizedName === 'likes');
    expect(likes?.value).toBeNull();
    expect(likes?.availability).toBe('unavailable_provider');
  });

  it('discovers channels on the Google account', async () => {
    const { deps } = createTestDeps({
      routes: [{ method: 'GET', match: '/channels', body: YOUTUBE_CHANNELS_FIXTURE }],
    });
    const connector = createYouTubeConnector(deps);
    const accounts = await connector.discoverAccounts(testGrant({ provider: 'youtube', scopes: SCOPES }));
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.externalAccountId).toBe('UCFAKECHANNEL0000000001');
    expect(accounts[0]?.metadata['longUploadsAllowed']).toBe(false);
  });
});
