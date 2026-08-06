import { z } from 'zod';

/**
 * Mastodon response and provider-option schemas.
 *
 * Every payload that crosses the adapter boundary is parsed, never cast. The provider
 * options travel in `connection.metadata.providerOptions` and are strict: an unknown key
 * is a validation error, not a silently ignored setting.
 */

export const mastodonAccountSchema = z
  .object({
    id: z.string().min(1),
    username: z.string().min(1),
    acct: z.string().min(1),
    display_name: z.string().nullable().default(null),
    avatar: z.string().nullable().default(null),
    url: z.string().nullable().default(null),
    statuses_count: z.number().nullable().default(null),
    followers_count: z.number().nullable().default(null),
    following_count: z.number().nullable().default(null),
    bot: z.boolean().nullable().default(null),
  })
  .strict();

export const mastodonStatusSchema = z
  .object({
    id: z.string().min(1),
    uri: z.string().nullable().default(null),
    url: z.string().nullable().default(null),
    content: z.string().nullable().default(null),
    created_at: z.string().min(1),
    reblogs_count: z.number().nullable().default(null),
    favourites_count: z.number().nullable().default(null),
    replies_count: z.number().nullable().default(null),
    in_reply_to_id: z.string().nullable().default(null),
  })
  .strict();

export const mastodonMediaSchema = z
  .object({
    id: z.string().min(1),
    url: z.string().nullable().default(null),
    type: z.enum(['image', 'video', 'gifv', 'audio', 'unknown']).default('unknown'),
  })
  .strict();

/** The JSON a successful `POST /api/v1/statuses` returns. */
export const mastodonStatusCreateSchema = mastodonStatusSchema;

/** The payload of `POST /api/v1/media`, keyed by its `id` for attachments. */
export const mastodonMediaCreateSchema = mastodonMediaSchema;

export const mastodonSearchSchema = z
  .object({
    accounts: z.array(mastodonAccountSchema).default([]),
  })
  .strict();

/** Per-connection provider options for Mastodon. */
export const mastodonProviderOptionsSchema = z
  .object({
    // The status `visibility` on Mastodon.
    visibility: z.enum(['public', 'unlisted', 'private']).optional(),
    // The value the user chose through the composer's privacy selector.
    privacyValue: z.enum(['public', 'unlisted', 'private']).optional(),
    sensitive: z.boolean().optional(),
    // A reply links the new status to an existing one.
    replyRootId: z.string().optional(),
  })
  .strict();
