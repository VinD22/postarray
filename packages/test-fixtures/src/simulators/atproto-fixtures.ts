/** Fabricated AT Protocol lifecycle responses for the Bluesky simulator. */
export const BLUESKY_OAUTH_SESSION = Object.freeze({
  did: 'did:plc:fakebluesky0000000001',
  handle: 'fixture.bsky.example.test',
  accessJwt: 'fake-session-placeholder',
  refreshJwt: 'fake-refresh-placeholder',
});

export const BLUESKY_REFRESHED_SESSION = Object.freeze({
  did: BLUESKY_OAUTH_SESSION.did,
  handle: BLUESKY_OAUTH_SESSION.handle,
  accessJwt: 'fake-refreshed-session-placeholder',
  refreshJwt: 'fake-rotated-refresh-placeholder',
});

export const BLUESKY_PUBLISH_RECORD = Object.freeze({
  validationStatus: 'valid',
  commitRev: '3lfakerev',
});

export const BLUESKY_REVOKE_RESPONSE = Object.freeze({});

export const BLUESKY_DUPLICATE_ERROR = Object.freeze({
  error: 'InvalidRequest',
  message: 'Record already exists.',
});
