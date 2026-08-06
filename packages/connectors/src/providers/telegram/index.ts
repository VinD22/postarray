/**
 * Telegram adapter on the official Bot API.
 *
 * One bot token (configured in the environment) is one connected account. The user
 * chooses the chat or channel the bot posts into at connect time, and the chat id
 * travels in connection metadata. Text posts and image posts (by URL, which the Bot API
 * accepts) are supported; there is no official read-back for an arbitrary message, so a
 * status check that is not backed by the create response reports `unknown` honestly.
 */

export * from './connector';
export { buildTelegramCapabilities } from './capabilities';
