import { z } from 'zod';

/**
 * Telegram Bot API response schemas. Every payload is parsed, never cast.
 */

export const telegramUserSchema = z
  .object({
    id: z.number().int(),
    is_bot: z.boolean(),
    first_name: z.string().nullable().default(null),
    username: z.string().nullable().default(null),
  })
  .strict();

export const telegramChatSchema = z
  .object({
    id: z.number().int(),
    type: z.string().min(1),
    title: z.string().nullable().default(null),
    username: z.string().nullable().default(null),
  })
  .strict();

export const telegramMessageSchema = z
  .object({
    message_id: z.number().int(),
    chat: telegramChatSchema,
    text: z.string().nullable().default(null),
  })
  .strict();

export const telegramApiResponseSchema = z
  .object({
    ok: z.boolean(),
    result: z.unknown(),
    description: z.string().nullable().default(null),
  })
  .strict();

/** Per-connection provider options. The chat id is the destination. */
export const telegramProviderOptionsSchema = z
  .object({
    chatId: z.string().min(1).optional(),
    // The exact chat the composer destination resolved to.
    destinationChatId: z.string().min(1).optional(),
  })
  .strict();
