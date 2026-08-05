import { z } from 'zod';

/**
 * Threads Graph response shapes, `v1.0`.
 * Sources (retrieved 4 August 2026 from the official Meta Threads Postman collection and
 * the Threads API reference, re-verify before implementation):
 * - https://developers.facebook.com/docs/threads
 * - https://developers.facebook.com/docs/threads/create-posts
 * - https://developers.facebook.com/docs/threads/insights
 */

export const threadsProfileSchema = z
  .object({
    id: z.string().min(1),
    username: z.string().optional(),
    name: z.string().optional(),
    threads_profile_picture_url: z.string().optional(),
    threads_biography: z.string().optional(),
  })
  .loose();

/** The container status field on Threads is `status`, not `status_code`. */
export const threadsContainerStatusSchema = z
  .object({
    id: z.string().min(1),
    status: z.enum(['EXPIRED', 'ERROR', 'FINISHED', 'IN_PROGRESS', 'PUBLISHED']).optional(),
    error_message: z.string().optional(),
  })
  .loose();

export const threadsMediaSchema = z
  .object({
    id: z.string().min(1),
    permalink: z.string().optional(),
    text: z.string().optional(),
    timestamp: z.string().optional(),
    media_type: z.string().optional(),
    shortcode: z.string().optional(),
  })
  .loose();

export const threadsMediaListSchema = z
  .object({ data: z.array(threadsMediaSchema).default([]) })
  .loose();

export const threadsInsightsSchema = z
  .object({
    data: z
      .array(
        z
          .object({
            name: z.string().min(1),
            period: z.string().optional(),
            title: z.string().optional(),
            description: z.string().optional(),
            values: z.array(z.object({ value: z.number().optional() }).loose()).default([]),
            total_value: z.object({ value: z.number().optional() }).loose().optional(),
          })
          .loose(),
      )
      .default([]),
  })
  .loose();
export type ThreadsInsights = z.infer<typeof threadsInsightsSchema>;

/** Threads specific draft options. Parsed, never cast. */
export const threadsProviderOptionsSchema = z
  .object({
    /** Who may reply. Threads offers a real audience control on replies. */
    replyControl: z.enum(['everyone', 'accounts_you_follow', 'mentioned_only']).optional(),
    /** Continue an existing thread by replying to a post we already published. */
    replyToId: z.string().min(1).optional(),
  })
  .strict();
export type ThreadsProviderOptions = z.infer<typeof threadsProviderOptionsSchema>;
