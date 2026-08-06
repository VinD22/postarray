import { z } from 'zod';

/**
 * Discord Bot API response schemas. Every payload is parsed, never cast.
 */

export const discordUserSchema = z
  .object({
    id: z.string().min(1),
    username: z.string().min(1),
    global_name: z.string().nullable().default(null),
  })
  .strict();

export const discordGuildSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().nullable().default(null),
  })
  .strict();

export const discordChannelSchema = z
  .object({
    id: z.string().min(1),
    guild_id: z.string().nullable().default(null),
    name: z.string().nullable().default(null),
    type: z.number().int(),
  })
  .strict();

export const discordMessageSchema = z
  .object({
    id: z.string().min(1),
    channel_id: z.string().min(1),
    guild_id: z.string().nullable().default(null),
    content: z.string().nullable().default(null),
  })
  .strict();

export const discordUserListSchema = z.array(discordUserSchema);
export const discordGuildListSchema = z.array(discordGuildSchema);
export const discordChannelListSchema = z.array(discordChannelSchema);
