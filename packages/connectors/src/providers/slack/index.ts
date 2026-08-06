/**
 * Slack adapter on the official Web API.
 *
 * OAuth2 app connect; public and private channels the bot is in are the destinations.
 * `chat.postMessage` returns the message timestamp synchronously, which is the external
 * evidence, and read-back goes through `conversations.history`. Text messages are
 * supported in V1; file uploads are not implemented yet and are declared honestly.
 */

export * from './connector';
export { buildSlackCapabilities } from './capabilities';
