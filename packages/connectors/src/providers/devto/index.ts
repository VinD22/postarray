/**
 * Dev.to adapter on the official Forem API.
 *
 * One per-account API key (configured in the environment) is one connected account.
 * Articles are Markdown and publish instantly; the create response carries the canonical
 * URL, which is the external evidence.
 */

export * from './connector';
export { buildDevtoCapabilities } from './capabilities';
