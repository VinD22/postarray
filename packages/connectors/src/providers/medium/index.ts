/**
 * Medium adapter on the official integration API.
 *
 * OAuth2 connect, Markdown article creation. The create response carries the post id and
 * canonical URL, which is the external evidence. The integration API has no read-back or
 * delete endpoints, so `getStatus` reports `unknown` and `delete_post` is not declared.
 */

export * from './connector';
export { buildMediumCapabilities } from './capabilities';
