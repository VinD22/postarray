import { z } from 'zod';

/**
 * Facebook Pages response shapes.
 * Sources (retrieved 4 August 2026, re-verify before implementation):
 * - https://developers.facebook.com/docs/pages-api/posts
 * - https://developers.facebook.com/docs/graph-api/reference/page/feed
 * - https://developers.facebook.com/docs/graph-api/reference/page/photos
 * - https://developers.facebook.com/docs/graph-api/reference/page/videos
 * - https://developers.facebook.com/docs/graph-api/reference/post/insights
 */

/** `/feed` returns the composite post id. `/photos` returns both ids. */
export const facebookPostSchema = z
  .object({
    id: z.string().min(1),
    post_id: z.string().optional(),
    permalink_url: z.string().optional(),
    message: z.string().optional(),
    created_time: z.string().optional(),
    is_published: z.boolean().optional(),
  })
  .loose();
export type FacebookPost = z.infer<typeof facebookPostSchema>;

export const facebookVideoSchema = z
  .object({
    id: z.string().min(1),
    status: z
      .object({
        video_status: z.string().optional(),
        processing_progress: z.number().int().nonnegative().optional(),
        uploading_phase: z.object({ status: z.string().optional() }).loose().optional(),
        processing_phase: z.object({ status: z.string().optional() }).loose().optional(),
        publishing_phase: z
          .object({ status: z.string().optional(), publish_status: z.string().optional() })
          .loose()
          .optional(),
      })
      .loose()
      .optional(),
    permalink_url: z.string().optional(),
  })
  .loose();

export const facebookInsightsSchema = z
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
              .array(z.object({ value: z.unknown().optional(), end_time: z.string().optional() }).loose())
              .default([]),
          })
          .loose(),
      )
      .default([]),
  })
  .loose();
export type FacebookInsights = z.infer<typeof facebookInsightsSchema>;

export const facebookCommentSchema = z.object({ id: z.string().min(1) }).loose();

export const facebookPostListSchema = z
  .object({ data: z.array(facebookPostSchema).default([]) })
  .loose();

/** Facebook specific draft options. Parsed, never cast. */
export const facebookProviderOptionsSchema = z
  .object({
    /** An explicit link to attach so Facebook renders its own link card. */
    link: z.string().url().optional(),
    /** Title shown on a video post. */
    videoTitle: z.string().min(1).max(255).optional(),
  })
  .strict();
export type FacebookProviderOptions = z.infer<typeof facebookProviderOptionsSchema>;
