/**
 * Recorded LinkedIn response shapes, API version `202603`.
 * Every id, URN and name below is fabricated. Retrieved 4 August 2026.
 */

export const LINKEDIN_USERINFO_FIXTURE = {
  sub: 'FAKEMEMBER0001',
  name: 'Sample Member',
  given_name: 'Sample',
  family_name: 'Member',
  picture: 'https://example.invalid/member.png',
} as const;

export const LINKEDIN_ORGANIZATION_ACLS_FIXTURE = {
  elements: [
    {
      organizationalTarget: 'urn:li:organization:99000001',
      role: 'ADMINISTRATOR',
      state: 'APPROVED',
      roleAssignee: 'urn:li:person:FAKEMEMBER0001',
      organizationalTarget$: {
        id: 99_000_001,
        localizedName: 'Sample Studio Ltd',
        vanityName: 'sample-studio-fake',
      },
    },
    {
      organizationalTarget: 'urn:li:organization:99000002',
      role: 'ANALYST',
      state: 'APPROVED',
      roleAssignee: 'urn:li:person:FAKEMEMBER0001',
      organizationalTarget$: {
        id: 99_000_002,
        localizedName: 'Sample Analytics Ltd',
        vanityName: 'sample-analytics-fake',
      },
    },
  ],
  paging: { count: 100, start: 0, total: 2 },
} as const;

export const LINKEDIN_ORGANIZATION_SEARCH_FIXTURE = {
  elements: [
    { id: 99_000_001, localizedName: 'Sample Studio Ltd', vanityName: 'sample-studio-fake' },
  ],
} as const;

export const LINKEDIN_IMAGE_INITIALIZE_FIXTURE = {
  value: {
    uploadUrl: 'https://upload.linkedin.invalid/images/fake-upload-target',
    image: 'urn:li:image:D4E10AQFAKEIMAGE0001',
    uploadUrlExpiresAt: 1_785_000_000_000,
  },
} as const;

export const LINKEDIN_DOCUMENT_INITIALIZE_FIXTURE = {
  value: {
    uploadUrl: 'https://upload.linkedin.invalid/documents/fake-upload-target',
    document: 'urn:li:document:D4E10AQFAKEDOC0001',
    uploadUrlExpiresAt: 1_785_000_000_000,
  },
} as const;

export const LINKEDIN_VIDEO_INITIALIZE_FIXTURE = {
  value: {
    video: 'urn:li:video:D4E10AQFAKEVIDEO0001',
    uploadUrlsExpireAt: 1_785_000_000_000,
    uploadInstructions: [
      {
        uploadUrl: 'https://upload.linkedin.invalid/videos/fake-part-1',
        firstByte: 0,
        lastByte: 999,
      },
    ],
  },
} as const;

export const LINKEDIN_SOCIAL_ACTIONS_FIXTURE = {
  likesSummary: { totalLikes: 57, aggregatedTotalLikes: 57 },
  commentsSummary: { aggregatedTotalComments: 9, totalFirstLevelComments: 7 },
} as const;

export const LINKEDIN_SHARE_STATISTICS_FIXTURE = {
  elements: [
    {
      totalShareStatistics: {
        impressionCount: 8420,
        uniqueImpressionsCount: 6100,
        clickCount: 231,
        likeCount: 57,
        commentCount: 9,
        shareCount: 4,
      },
    },
  ],
} as const;

export const LINKEDIN_FOLLOWER_STATISTICS_FIXTURE = {
  elements: [{ followerGains: { organicFollowerGain: 34, paidFollowerGain: 0 } }],
} as const;

export const LINKEDIN_POST_FIXTURE = {
  id: 'urn:li:share:7100000000000000001',
  author: 'urn:li:organization:99000001',
  commentary: 'A sample organization post.',
  lifecycleState: 'PUBLISHED',
} as const;

export const LINKEDIN_VERSION_REJECTED_FIXTURE = {
  message: 'The LinkedIn-Version header value is not supported',
  status: 426,
} as const;

export const LINKEDIN_ROLE_MISSING_FIXTURE = {
  message: 'Not enough permissions to access: POST /posts',
  status: 403,
  serviceErrorCode: 100,
} as const;
