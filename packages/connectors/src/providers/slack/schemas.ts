import { z } from 'zod';

/**
 * Slack Web API response schemas. Every payload is parsed, never cast. Slack answers
 * with `{ ok: true, ... }` or `{ ok: false, error: '...' }`, and an `ok: false` body is
 * an application level failure even though the transport succeeds.
 */

export const slackResponseSchema = z
  .object({
    ok: z.boolean(),
    error: z.string().nullable().default(null),
  })
  .passthrough();

export const slackAuthTestSchema = slackResponseSchema.extend({
  user_id: z.string().nullable().default(null),
  user: z.string().nullable().default(null),
  team_id: z.string().nullable().default(null),
  team: z.string().nullable().default(null),
  url: z.string().nullable().default(null),
});

export const slackChannelSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().nullable().default(null),
    is_channel: z.boolean().nullable().default(null),
    is_group: z.boolean().nullable().default(null),
    is_archived: z.boolean().nullable().default(null),
    is_private: z.boolean().nullable().default(null),
  })
  .strict();

export const slackConversationsListSchema = slackResponseSchema.extend({
  channels: z.array(slackChannelSchema).default([]),
});

export const slackMessageSchema = z
  .object({
    ts: z.string().min(1),
    channel: z.string().nullable().default(null),
    text: z.string().nullable().default(null),
  })
  .strict();

export const slackPostMessageSchema = slackResponseSchema.extend({
  ts: z.string().nullable().default(null),
  channel: z.string().nullable().default(null),
  message: slackMessageSchema.nullable().default(null),
});

export const slackConversationsHistorySchema = slackResponseSchema.extend({
  messages: z.array(slackMessageSchema).default([]),
});

export const slackPermalinkSchema = slackResponseSchema.extend({
  permalink: z.string().nullable().default(null),
});
