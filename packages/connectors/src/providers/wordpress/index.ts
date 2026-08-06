/**
 * WordPress adapter on the official REST API.
 *
 * A connection is one site plus an application password (or OAuth bearer token). The site
 * URL travels in connection metadata, so any self-hosted or WordPress.com site works.
 * Text and Markdown posts are supported in V1; media upload is not implemented yet and is
 * declared honestly.
 */

export * from './connector';
export { buildWordpressCapabilities } from './capabilities';
