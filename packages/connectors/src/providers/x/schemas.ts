import { z } from 'zod';

/**
 * X API v2 response shapes. Every response is parsed before a field is read.
 * Sources (all retrieved 4 August 2026, re-verify before implementation):
 * - https://docs.x.com/x-api/posts/creation-of-a-post
 * - https://docs.x.com/x-api/posts/post-lookup-by-post-id
 * - https://docs.x.com/x-api/users/user-lookup-me
 * - https://docs.x.com/x-api/media/media-upload
 */

export const xErrorDetailSchema = z
  .object({
    title: z.string().optional(),
    detail: z.string().optional(),
    type: z.string().optional(),
    status: z.number().int().optional(),
    reason: z.string().optional(),
  })
  .loose();

export const xErrorBodySchema = z
  .object({
    title: z.string().optional(),
    detail: z.string().optional(),
    type: z.string().optional(),
    status: z.number().int().optional(),
    errors: z.array(xErrorDetailSchema).optional(),
  })
  .loose();
export type XErrorBody = z.infer<typeof xErrorBodySchema>;

export const xPublicMetricsSchema = z
  .object({
    retweet_count: z.number().int().nonnegative().optional(),
    reply_count: z.number().int().nonnegative().optional(),
    like_count: z.number().int().nonnegative().optional(),
    quote_count: z.number().int().nonnegative().optional(),
    bookmark_count: z.number().int().nonnegative().optional(),
    impression_count: z.number().int().nonnegative().optional(),
  })
  .loose();

export const xUserPublicMetricsSchema = z
  .object({
    followers_count: z.number().int().nonnegative().optional(),
    following_count: z.number().int().nonnegative().optional(),
    tweet_count: z.number().int().nonnegative().optional(),
    listed_count: z.number().int().nonnegative().optional(),
  })
  .loose();

export const xUserSchema = z
  .object({
    id: z.string().min(1),
    name: z.string(),
    username: z.string().min(1),
    profile_image_url: z.string().optional(),
    protected: z.boolean().optional(),
    public_metrics: xUserPublicMetricsSchema.optional(),
  })
  .loose();
export type XUser = z.infer<typeof xUserSchema>;

export const xUserResponseSchema = z
  .object({ data: xUserSchema, errors: z.array(xErrorDetailSchema).optional() })
  .loose();

export const xPostSchema = z
  .object({
    id: z.string().min(1),
    text: z.string().optional(),
    created_at: z.string().optional(),
    author_id: z.string().optional(),
    edit_history_tweet_ids: z.array(z.string()).optional(),
    public_metrics: xPublicMetricsSchema.optional(),
    non_public_metrics: z
      .object({
        impression_count: z.number().int().nonnegative().optional(),
        url_link_clicks: z.number().int().nonnegative().optional(),
        user_profile_clicks: z.number().int().nonnegative().optional(),
      })
      .loose()
      .optional(),
  })
  .loose();
export type XPost = z.infer<typeof xPostSchema>;

export const xCreatePostResponseSchema = z
  .object({ data: xPostSchema, errors: z.array(xErrorDetailSchema).optional() })
  .loose();
export type XCreatePostResponse = z.infer<typeof xCreatePostResponseSchema>;

export const xPostLookupResponseSchema = z
  .object({ data: xPostSchema.optional(), errors: z.array(xErrorDetailSchema).optional() })
  .loose();

export const xTimelineResponseSchema = z
  .object({
    data: z.array(xPostSchema).optional(),
    meta: z
      .object({
        result_count: z.number().int().nonnegative().optional(),
        next_token: z.string().optional(),
        newest_id: z.string().optional(),
        oldest_id: z.string().optional(),
      })
      .loose()
      .optional(),
    errors: z.array(xErrorDetailSchema).optional(),
  })
  .loose();

export const xDeleteResponseSchema = z
  .object({ data: z.object({ deleted: z.boolean() }).loose() })
  .loose();

/** Chunked media upload. INIT and FINALIZE both return the media id. */
export const xMediaUploadResponseSchema = z
  .object({
    data: z
      .object({
        id: z.string().min(1),
        media_key: z.string().optional(),
        expires_after_secs: z.number().int().optional(),
        processing_info: z
          .object({
            state: z.enum(['pending', 'in_progress', 'failed', 'succeeded']),
            check_after_secs: z.number().int().nonnegative().optional(),
            progress_percent: z.number().int().nonnegative().optional(),
            error: z
              .object({
                code: z.number().int().optional(),
                name: z.string().optional(),
                message: z.string().optional(),
              })
              .loose()
              .optional(),
          })
          .loose()
          .optional(),
      })
      .loose(),
  })
  .loose();
export type XMediaUploadResponse = z.infer<typeof xMediaUploadResponseSchema>;

export const xCommunitySchema = z
  .object({
    id: z.string().min(1),
    name: z.string(),
    description: z.string().optional(),
    member_count: z.number().int().nonnegative().optional(),
    access: z.string().optional(),
  })
  .loose();

export const xCommunitiesResponseSchema = z
  .object({
    data: z.array(xCommunitySchema).optional(),
    errors: z.array(xErrorDetailSchema).optional(),
  })
  .loose();

export const xUserSearchResponseSchema = z
  .object({
    data: z.array(xUserSchema).optional(),
    errors: z.array(xErrorDetailSchema).optional(),
  })
  .loose();

/**
 * Provider options a draft may carry for X. Parsed, never cast, so an unknown key from an
 * API or MCP caller is a validation error rather than a silently ignored setting.
 */
export const xProviderOptionsSchema = z
  .object({
    /** `made_with_ai` style disclosure, where the account is eligible to set it. */
    replySettings: z.enum(['everyone', 'mentionedUsers', 'following', 'subscribers']).optional(),
    quotePostId: z.string().min(1).optional(),
    communityId: z.string().min(1).optional(),
    /** Explicit confirmation the operator accepts the metered API cost of this campaign. */
    costAcknowledged: z.boolean().optional(),
  })
  .strict();
export type XProviderOptions = z.infer<typeof xProviderOptionsSchema>;
