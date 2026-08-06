/**
 * Mastodon adapter on the Mastodon REST API.
 *
 * Per-connection authentication mirrors the Bluesky connector: the user creates an
 * application on their own instance, pastes an access token, and everything else is read
 * from the connection metadata so any instance works, not just the configured default.
 *
 * The one honest limitation in V1: image posts are supported through the media upload
 * endpoint, but some small instances cap accepted mime types, so the capability snapshot
 * is conservative rather than promised.
 */

export * from './connector';
export { buildMastodonCapabilities } from './capabilities';
export { MASTODON_ACCOUNT_METRICS, MASTODON_POST_METRICS } from './metrics';
export { mastodonProviderOptionsSchema } from './schemas';
