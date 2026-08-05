import { z } from 'zod';

/**
 * YouTube Data API v3 response shapes.
 * Sources (retrieved 4 August 2026, re-verify before implementation):
 * - https://developers.google.com/youtube/v3/getting-started
 * - https://developers.google.com/youtube/v3/docs/videos/insert
 * - https://developers.google.com/youtube/v3/docs/videos/list
 * - https://developers.google.com/youtube/v3/docs/channels/list
 * - https://developers.google.com/youtube/v3/docs/commentThreads/insert
 * - https://developers.google.com/youtube/v3/guides/using_resumable_upload_protocol
 */

export const googleErrorSchema = z
  .object({
    error: z
      .object({
        code: z.number().int().optional(),
        message: z.string().optional(),
        status: z.string().optional(),
        errors: z
          .array(
            z
              .object({
                domain: z.string().optional(),
                reason: z.string().optional(),
                message: z.string().optional(),
              })
              .loose(),
          )
          .optional(),
      })
      .loose()
      .optional(),
  })
  .loose();
export type GoogleError = z.infer<typeof googleErrorSchema>;

export const youTubeChannelSchema = z
  .object({
    id: z.string().min(1),
    snippet: z
      .object({
        title: z.string().optional(),
        customUrl: z.string().optional(),
        description: z.string().optional(),
        thumbnails: z
          .object({ default: z.object({ url: z.string().optional() }).loose().optional() })
          .loose()
          .optional(),
      })
      .loose()
      .optional(),
    status: z
      .object({
        privacyStatus: z.string().optional(),
        isLinked: z.boolean().optional(),
        longUploadsStatus: z.string().optional(),
        madeForKids: z.boolean().optional(),
      })
      .loose()
      .optional(),
    statistics: z
      .object({
        viewCount: z.string().optional(),
        subscriberCount: z.string().optional(),
        videoCount: z.string().optional(),
        hiddenSubscriberCount: z.boolean().optional(),
      })
      .loose()
      .optional(),
    contentDetails: z
      .object({
        relatedPlaylists: z.object({ uploads: z.string().optional() }).loose().optional(),
      })
      .loose()
      .optional(),
  })
  .loose();
export type YouTubeChannel = z.infer<typeof youTubeChannelSchema>;

export const youTubeChannelListSchema = z
  .object({ items: z.array(youTubeChannelSchema).default([]) })
  .loose();

export const youTubeVideoSchema = z
  .object({
    id: z.string().min(1),
    snippet: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        publishedAt: z.string().optional(),
        channelId: z.string().optional(),
        tags: z.array(z.string()).optional(),
        categoryId: z.string().optional(),
      })
      .loose()
      .optional(),
    status: z
      .object({
        uploadStatus: z.string().optional(),
        failureReason: z.string().optional(),
        rejectionReason: z.string().optional(),
        privacyStatus: z.string().optional(),
        selfDeclaredMadeForKids: z.boolean().optional(),
      })
      .loose()
      .optional(),
    processingDetails: z
      .object({
        processingStatus: z.string().optional(),
        processingFailureReason: z.string().optional(),
        processingProgress: z
          .object({
            partsTotal: z.union([z.string(), z.number()]).optional(),
            partsProcessed: z.union([z.string(), z.number()]).optional(),
          })
          .loose()
          .optional(),
      })
      .loose()
      .optional(),
    statistics: z
      .object({
        viewCount: z.string().optional(),
        likeCount: z.string().optional(),
        dislikeCount: z.string().optional(),
        favoriteCount: z.string().optional(),
        commentCount: z.string().optional(),
      })
      .loose()
      .optional(),
  })
  .loose();
export type YouTubeVideo = z.infer<typeof youTubeVideoSchema>;

export const youTubeVideoListSchema = z
  .object({ items: z.array(youTubeVideoSchema).default([]) })
  .loose();

export const youTubeCommentThreadSchema = z.object({ id: z.string().min(1) }).loose();

/**
 * YouTube specific draft options. `privacyStatus` is deliberately not defaulted here: an
 * unaudited project may only upload as private and the capability snapshot says so, so the
 * value always comes from a validated choice rather than from a constant in the adapter.
 */
export const youTubeProviderOptionsSchema = z
  .object({
    categoryId: z.string().regex(/^\d+$/u).optional(),
    tags: z.array(z.string().min(1)).max(30).optional(),
    /** Required by YouTube for every upload. The composer must collect it. */
    madeForKids: z.boolean().optional(),
    /** The user's declaration that the video contains altered or synthetic content. */
    alteredContentDeclared: z.boolean().optional(),
    /** Set only when the channel is eligible for a custom thumbnail. */
    thumbnailMediaId: z.string().min(1).optional(),
    /** The uploader may disable comments, which makes a first comment impossible. */
    commentsDisabled: z.boolean().optional(),
    defaultLanguage: z.string().min(2).max(10).optional(),
  })
  .strict();
export type YouTubeProviderOptions = z.infer<typeof youTubeProviderOptionsSchema>;
