import { z } from 'zod';

/**
 * LinkedIn REST response shapes, version `202603`.
 * Sources (retrieved 4 August 2026, re-verify before implementation, including the version
 * header value which changes on a published schedule):
 * - https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
 * - https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/images-api
 * - https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/videos-api
 * - https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/documents-api
 * - https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-access-control
 * - https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/network-update-social-actions
 */

/** `sub` is the member id; the member URN is `urn:li:person:{sub}`. */
export const linkedInUserInfoSchema = z
  .object({
    sub: z.string().min(1),
    name: z.string().optional(),
    given_name: z.string().optional(),
    family_name: z.string().optional(),
    picture: z.string().optional(),
    email: z.string().optional(),
  })
  .loose();

export const linkedInErrorSchema = z
  .object({
    message: z.string().optional(),
    status: z.number().int().optional(),
    serviceErrorCode: z.number().int().optional(),
    code: z.string().optional(),
  })
  .loose();

export const linkedInOrganizationSchema = z
  .object({
    id: z.number().int().optional(),
    localizedName: z.string().optional(),
    vanityName: z.string().optional(),
    name: z
      .object({ localized: z.record(z.string(), z.string()).optional() })
      .loose()
      .optional(),
    logoV2: z.unknown().optional(),
  })
  .loose();

export const linkedInOrganizationAclElementSchema = z
  .object({
    organizationalTarget: z.string().min(1),
    role: z.string(),
    state: z.string(),
    roleAssignee: z.string().optional(),
    organizationalTarget$: linkedInOrganizationSchema.optional(),
  })
  .loose();

export const linkedInOrganizationAclsSchema = z
  .object({
    elements: z.array(linkedInOrganizationAclElementSchema).default([]),
    paging: z
      .object({
        count: z.number().int().optional(),
        start: z.number().int().optional(),
        total: z.number().int().optional(),
      })
      .loose()
      .optional(),
  })
  .loose();

export const linkedInOrganizationSearchSchema = z
  .object({ elements: z.array(linkedInOrganizationSchema).default([]) })
  .loose();

export const linkedInImageInitializeSchema = z
  .object({
    value: z
      .object({
        uploadUrl: z.string().min(1),
        image: z.string().min(1),
        uploadUrlExpiresAt: z.number().int().optional(),
      })
      .loose(),
  })
  .loose();

export const linkedInDocumentInitializeSchema = z
  .object({
    value: z
      .object({
        uploadUrl: z.string().min(1),
        document: z.string().min(1),
        uploadUrlExpiresAt: z.number().int().optional(),
      })
      .loose(),
  })
  .loose();

export const linkedInVideoInitializeSchema = z
  .object({
    value: z
      .object({
        video: z.string().min(1),
        uploadUrlsExpireAt: z.number().int().optional(),
        uploadInstructions: z
          .array(
            z
              .object({
                uploadUrl: z.string().min(1),
                firstByte: z.number().int().nonnegative(),
                lastByte: z.number().int().nonnegative(),
              })
              .loose(),
          )
          .default([]),
      })
      .loose(),
  })
  .loose();

export const linkedInPostSchema = z
  .object({
    id: z.string().min(1),
    author: z.string().optional(),
    commentary: z.string().optional(),
    lifecycleState: z.string().optional(),
    createdAt: z.number().int().optional(),
  })
  .loose();

export const linkedInSocialActionsSchema = z
  .object({
    likesSummary: z
      .object({
        totalLikes: z.number().int().nonnegative().optional(),
        aggregatedTotalLikes: z.number().int().nonnegative().optional(),
      })
      .loose()
      .optional(),
    commentsSummary: z
      .object({
        aggregatedTotalComments: z.number().int().nonnegative().optional(),
        totalFirstLevelComments: z.number().int().nonnegative().optional(),
      })
      .loose()
      .optional(),
  })
  .loose();

export const linkedInShareStatisticsSchema = z
  .object({
    elements: z
      .array(
        z
          .object({
            totalShareStatistics: z
              .object({
                impressionCount: z.number().int().nonnegative().optional(),
                uniqueImpressionsCount: z.number().int().nonnegative().optional(),
                clickCount: z.number().int().nonnegative().optional(),
                likeCount: z.number().int().nonnegative().optional(),
                commentCount: z.number().int().nonnegative().optional(),
                shareCount: z.number().int().nonnegative().optional(),
              })
              .loose()
              .optional(),
          })
          .loose(),
      )
      .default([]),
  })
  .loose();

export const linkedInFollowerStatisticsSchema = z
  .object({
    elements: z
      .array(
        z
          .object({
            followerCountsByAssociationType: z.unknown().optional(),
            followerGains: z
              .object({
                organicFollowerGain: z.number().int().optional(),
                paidFollowerGain: z.number().int().optional(),
              })
              .loose()
              .optional(),
          })
          .loose(),
      )
      .default([]),
  })
  .loose();

/** Provider options a LinkedIn draft may carry. Parsed, never cast. */
export const linkedInProviderOptionsSchema = z
  .object({
    /** Required by LinkedIn for a document post and shown as the document's title. */
    documentTitle: z.string().min(1).max(200).optional(),
    /** LinkedIn's own reshare control on the created post. */
    disableReshare: z.boolean().optional(),
  })
  .strict();
export type LinkedInProviderOptions = z.infer<typeof linkedInProviderOptionsSchema>;
