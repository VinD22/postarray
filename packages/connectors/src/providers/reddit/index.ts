/**
 * Reddit adapter on the official OAuth v2 API.
 *
 * OAuth2 connect, self and link posts into the subreddits the user may post to. The
 * submit response returns the created post id, and `/api/info` provides read-back and a
 * permalink. Write scopes require app review, which is stated as the beta limitation.
 */

export * from './connector';
export { buildRedditCapabilities } from './capabilities';
