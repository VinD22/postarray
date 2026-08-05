/**
 * Recorded AT Protocol / Bluesky response shapes. Every DID, handle, CID and URI is
 * fabricated. Retrieved 4 August 2026.
 */

export const BLUESKY_SESSION_FIXTURE = {
  did: 'did:plc:fakedidfakedidfake01',
  handle: 'sample-studio.fake.invalid',
  active: true,
} as const;

export const BLUESKY_BLOB_FIXTURE = {
  blob: {
    $type: 'blob',
    ref: { $link: 'bafkreifakeblobreferencefakeblobreferencefake0001' },
    mimeType: 'image/jpeg',
    size: 120_000,
  },
} as const;

export const BLUESKY_CREATE_RECORD_FIXTURE = {
  uri: 'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/fakerkey0001',
  cid: 'bafyreifakerecordcidfakerecordcidfakerecordcid001',
  commit: { cid: 'bafyreifakecommitcid0001', rev: '3kfakerev0001' },
  validationStatus: 'valid',
} as const;

export const BLUESKY_CREATE_REPLY_FIXTURE = {
  uri: 'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/fakerkey0002',
  cid: 'bafyreifakerecordcidfakerecordcidfakerecordcid002',
} as const;

export const BLUESKY_POST_THREAD_FIXTURE = {
  thread: {
    $type: 'app.bsky.feed.defs#threadViewPost',
    post: {
      uri: 'at://did:plc:fakedidfakedidfake01/app.bsky.feed.post/fakerkey0001',
      cid: 'bafyreifakerecordcidfakerecordcidfakerecordcid001',
      author: { did: 'did:plc:fakedidfakedidfake01', handle: 'sample-studio.fake.invalid' },
      replyCount: 4,
      repostCount: 11,
      likeCount: 57,
      quoteCount: 2,
      indexedAt: '2026-08-04T12:00:01.000Z',
    },
  },
} as const;

export const BLUESKY_POST_NOT_FOUND_FIXTURE = {
  thread: {
    $type: 'app.bsky.feed.defs#notFoundPost',
    notFound: true,
  },
} as const;

export const BLUESKY_PROFILE_FIXTURE = {
  did: 'did:plc:fakedidfakedidfake01',
  handle: 'sample-studio.fake.invalid',
  displayName: 'Sample Studio',
  followersCount: 812,
  followsCount: 190,
  postsCount: 437,
} as const;

export const BLUESKY_ACTOR_SEARCH_FIXTURE = {
  actors: [
    {
      did: 'did:plc:fakedidfakedidfake02',
      handle: 'someone-else.fake.invalid',
      displayName: 'Someone Else',
    },
  ],
} as const;

export const BLUESKY_RATE_LIMIT_FIXTURE = {
  error: 'RateLimitExceeded',
  message: 'Rate limit exceeded',
} as const;

export const BLUESKY_BLOB_TOO_LARGE_FIXTURE = {
  error: 'BlobTooLarge',
  message: 'This file is too large. It is 2.10MB but the maximum size is 1MB.',
} as const;

export const BLUESKY_EXPIRED_TOKEN_FIXTURE = {
  error: 'ExpiredToken',
  message: 'Token has expired',
} as const;
