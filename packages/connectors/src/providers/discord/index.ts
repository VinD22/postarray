/**
 * Discord adapter on the official Bot API.
 *
 * One bot token (configured in the environment) is one connected account. Text channels
 * across the guilds the bot can see are the destinations. Text messages are supported in
 * V1; file attachments are not implemented yet and are declared honestly.
 */

export * from './connector';
export { buildDiscordCapabilities } from './capabilities';
