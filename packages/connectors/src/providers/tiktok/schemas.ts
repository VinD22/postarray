import { z } from 'zod';

/**
 * TikTok Content Posting API response shapes.
 * Sources (retrieved 4 August 2026, re-verify before implementation):
 * - https://developers.tiktok.com/doc/content-posting-api-get-started
 * - https://developers.tiktok.com/doc/content-posting-api-reference-query-creator-info
 * - https://developers.tiktok.com/doc/content-posting-api-reference-direct-post
 * - https://developers.tiktok.com/doc/content-posting-api-reference-get-video-status
 * - https://developers.tiktok.com/doc/content-sharing-guidelines
 */

export const tikTokErrorSchema = z
  .object({
    code: z.string().optional(),
    message: z.string().optional(),
    log_id: z.string().optional(),
  })
  .loose();

export const tikTokEnvelopeSchema = z
  .object({ error: tikTokErrorSchema.optional() })
  .loose();

/**
 * Creator info, fetched immediately before compose or publish confirmation. These values
 * change, so they are never cached past a dispatch.
 */
export const tikTokCreatorInfoSchema = z
  .object({
    data: z
      .object({
        creator_avatar_url: z.string().optional(),
        creator_username: z.string().optional(),
        creator_nickname: z.string().optional(),
        privacy_level_options: z.array(z.string().min(1)).default([]),
        comment_disabled: z.boolean().optional(),
        duet_disabled: z.boolean().optional(),
        stitch_disabled: z.boolean().optional(),
        max_video_post_duration_sec: z.number().int().positive().optional(),
      })
      .loose(),
    error: tikTokErrorSchema.optional(),
  })
  .loose();
export type TikTokCreatorInfo = z.infer<typeof tikTokCreatorInfoSchema>;

export const tikTokPublishInitSchema = z
  .object({
    data: z
      .object({
        publish_id: z.string().min(1),
        upload_url: z.string().optional(),
      })
      .loose(),
    error: tikTokErrorSchema.optional(),
  })
  .loose();

export const TIKTOK_PUBLISH_STATUSES = [
  'PROCESSING_UPLOAD',
  'PROCESSING_DOWNLOAD',
  'SEND_TO_USER_INBOX',
  'PUBLISH_COMPLETE',
  'FAILED',
] as const;

export const tikTokPublishStatusSchema = z
  .object({
    data: z
      .object({
        status: z.string().min(1),
        fail_reason: z.string().optional(),
        publicaly_available_post_id: z.array(z.string().min(1)).optional(),
        uploaded_bytes: z.number().int().nonnegative().optional(),
        downloaded_bytes: z.number().int().nonnegative().optional(),
      })
      .loose(),
    error: tikTokErrorSchema.optional(),
  })
  .loose();
export type TikTokPublishStatus = z.infer<typeof tikTokPublishStatusSchema>;

export const tikTokUserInfoSchema = z
  .object({
    data: z
      .object({
        user: z
          .object({
            open_id: z.string().min(1),
            union_id: z.string().optional(),
            display_name: z.string().optional(),
            avatar_url: z.string().optional(),
            username: z.string().optional(),
            is_verified: z.boolean().optional(),
          })
          .loose(),
      })
      .loose(),
    error: tikTokErrorSchema.optional(),
  })
  .loose();

/**
 * TikTok specific draft options.
 *
 * Every one of these is an explicit user choice under TikTok's content sharing guidelines.
 * There is deliberately no default anywhere in this schema: an unset value is a validation
 * error, not something the adapter fills in.
 */
export const tikTokProviderOptionsSchema = z
  .object({
    /** Must be one of the creator's currently available privacy levels. Never defaulted. */
    privacyLevel: z.string().min(1).optional(),
    disableComment: z.boolean().optional(),
    disableDuet: z.boolean().optional(),
    disableStitch: z.boolean().optional(),
    /** The commercial content declaration and what kind it is. */
    commercialContent: z.boolean().optional(),
    /** Your own brand. Maps to `brand_organic_toggle`. */
    brandOrganic: z.boolean().optional(),
    /** A paid partnership. Maps to `brand_content_toggle`. */
    brandedContent: z.boolean().optional(),
    /** The user confirmed they hold the rights to the music in the video. */
    musicRightsConfirmed: z.boolean().optional(),
    videoCoverTimestampMs: z.number().int().nonnegative().optional(),
    /** The user saw the real preview and consented to publish. */
    consentConfirmed: z.boolean().optional(),
  })
  .strict();
export type TikTokProviderOptions = z.infer<typeof tikTokProviderOptionsSchema>;
