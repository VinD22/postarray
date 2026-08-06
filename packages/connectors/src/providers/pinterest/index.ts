/**
 * Pinterest adapter on the official v5 API.
 *
 * OAuth2 connect; a pin is created on a board the user owns. The v5 API fetches image
 * bytes from a URL, so media preparation is a pass through of the short-lived source URL.
 * A pin without media is impossible, so the adapter requires it.
 */

export * from './connector';
export { buildPinterestCapabilities } from './capabilities';
