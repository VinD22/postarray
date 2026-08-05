import { z } from 'zod';

/**
 * Instagram Graph response shapes.
 * Sources (retrieved 4 August 2026, re-verify before implementation; Meta documentation
 * changes frequently and was intermittently rate limited during research):
 * - https://developers.facebook.com/docs/instagram-platform/content-publishing
 * - https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user
 * - https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/insights
 * - https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/content_publishing_limit
 */

export const instagramAccountSchema = z
  .object({
    id: z.string().min(1),
    username: z.string().optional(),
    name: z.string().optional(),
    profile_picture_url: z.string().optional(),
    /** `BUSINESS`, `MEDIA_CREATOR`, or `PERSONAL`. Only the first two may publish. */
    account_type: z.string().optional(),
    followers_count: z.number().int().nonnegative().optional(),
    media_count: z.number().int().nonnegative().optional(),
  })
  .loose();
export type InstagramAccount = z.infer<typeof instagramAccountSchema>;

export const instagramMediaSchema = z
  .object({
    id: z.string().min(1),
    permalink: z.string().optional(),
    media_type: z.string().optional(),
    media_product_type: z.string().optional(),
    timestamp: z.string().optional(),
    caption: z.string().optional(),
    like_count: z.number().int().nonnegative().optional(),
    comments_count: z.number().int().nonnegative().optional(),
  })
  .loose();

export const instagramMediaListSchema = z
  .object({ data: z.array(instagramMediaSchema).default([]) })
  .loose();

export const instagramInsightsSchema = z
  .object({
    data: z
      .array(
        z
          .object({
            name: z.string().min(1),
            period: z.string().optional(),
            title: z.string().optional(),
            description: z.string().optional(),
            values: z
              .array(
                z
                  .object({ value: z.unknown().optional(), end_time: z.string().optional() })
                  .loose(),
              )
              .default([]),
            total_value: z.object({ value: z.number().optional() }).loose().optional(),
          })
          .loose(),
      )
      .default([]),
  })
  .loose();
export type InstagramInsights = z.infer<typeof instagramInsightsSchema>;

export const instagramPublishingLimitSchema = z
  .object({
    data: z
      .array(
        z
          .object({
            quota_usage: z.number().int().nonnegative().optional(),
            config: z
              .object({
                quota_total: z.number().int().positive().optional(),
                quota_duration: z.number().int().positive().optional(),
              })
              .loose()
              .optional(),
          })
          .loose(),
      )
      .default([]),
  })
  .loose();

export const instagramCommentSchema = z.object({ id: z.string().min(1) }).loose();

/**
 * Instagram specific draft options. Stories and Reels are product surfaces, not content
 * kinds, so they are chosen here and validated against the capability snapshot.
 */
export const instagramProviderOptionsSchema = z
  .object({
    surface: z.enum(['FEED', 'REELS', 'STORIES']).optional(),
    /** Reels only: show the reel in the main feed as well. */
    shareToFeed: z.boolean().optional(),
    /** Reels and video only: a cover frame offset in milliseconds. */
    thumbOffsetMs: z.number().int().nonnegative().optional(),
    /** Collaborators, where the account is eligible. */
    collaborators: z.array(z.string().min(1)).max(3).optional(),
  })
  .strict();
export type InstagramProviderOptions = z.infer<typeof instagramProviderOptionsSchema>;
