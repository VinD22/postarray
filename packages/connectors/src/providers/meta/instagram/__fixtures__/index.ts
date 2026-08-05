/**
 * Recorded Instagram Graph response shapes. Every id, handle and URL is fabricated.
 * Retrieved 4 August 2026. Meta documentation changes frequently; re-capture on version
 * change.
 */

export const INSTAGRAM_PAGES_FIXTURE = {
  data: [
    {
      id: '61550000000001',
      name: 'Sample Studio Page',
      access_token: 'fake-page-token-not-a-real-credential',
      tasks: ['CREATE_CONTENT', 'MANAGE', 'MODERATE'],
      instagram_business_account: { id: '17840000000000001' },
    },
    {
      id: '61550000000002',
      name: 'Page Without Instagram',
      access_token: 'fake-page-token-not-a-real-credential',
      tasks: ['ANALYZE'],
    },
  ],
} as const;

export const INSTAGRAM_BUSINESS_ACCOUNT_FIXTURE = {
  id: '17840000000000001',
  username: 'sample_studio_fake',
  name: 'Sample Studio',
  profile_picture_url: 'https://example.invalid/ig-avatar.jpg',
  account_type: 'BUSINESS',
} as const;

export const INSTAGRAM_CONSUMER_ACCOUNT_FIXTURE = {
  id: '17840000000000002',
  username: 'sample_person_fake',
  name: 'Sample Person',
  account_type: 'PERSONAL',
} as const;

export const INSTAGRAM_CONTAINER_FIXTURE = { id: '17990000000000001' } as const;

export const INSTAGRAM_CONTAINER_IN_PROGRESS_FIXTURE = {
  id: '17990000000000001',
  status_code: 'IN_PROGRESS',
} as const;

export const INSTAGRAM_CONTAINER_FINISHED_FIXTURE = {
  id: '17990000000000001',
  status_code: 'FINISHED',
} as const;

export const INSTAGRAM_CONTAINER_ERROR_FIXTURE = {
  id: '17990000000000001',
  status_code: 'ERROR',
  status: 'Error: 2207026 - Unsupported video format',
} as const;

export const INSTAGRAM_PUBLISH_FIXTURE = { id: '17880000000000001' } as const;

export const INSTAGRAM_MEDIA_FIXTURE = {
  id: '17880000000000001',
  permalink: 'https://www.instagram.com/p/FAKEPOSTCODE1/',
  media_type: 'IMAGE',
  media_product_type: 'FEED',
  timestamp: '2026-08-04T12:00:05+0000',
  like_count: 128,
  comments_count: 11,
} as const;

export const INSTAGRAM_MEDIA_INSIGHTS_FIXTURE = {
  data: [
    { name: 'views', period: 'lifetime', total_value: { value: 9540 }, values: [] },
    { name: 'reach', period: 'lifetime', total_value: { value: 7210 }, values: [] },
    { name: 'likes', period: 'lifetime', total_value: { value: 128 }, values: [] },
    { name: 'comments', period: 'lifetime', total_value: { value: 11 }, values: [] },
    { name: 'saved', period: 'lifetime', total_value: { value: 22 }, values: [] },
  ],
} as const;

export const INSTAGRAM_ACCOUNT_INSIGHTS_FIXTURE = {
  data: [
    { name: 'reach', period: 'day', total_value: { value: 4310 }, values: [] },
    { name: 'profile_views', period: 'day', total_value: { value: 190 }, values: [] },
  ],
} as const;

export const INSTAGRAM_PERMISSION_ERROR_FIXTURE = {
  error: {
    message: 'Application does not have permission for this action',
    type: 'OAuthException',
    code: 200,
    fbtrace_id: 'FakeTraceId0001',
  },
} as const;

export const INSTAGRAM_TOKEN_EXPIRED_FIXTURE = {
  error: {
    message: 'Error validating access token: Session has expired',
    type: 'OAuthException',
    code: 190,
    error_subcode: 463,
    fbtrace_id: 'FakeTraceId0002',
  },
} as const;

export const INSTAGRAM_PUBLISHING_LIMIT_FIXTURE = {
  data: [{ quota_usage: 12, config: { quota_total: 50, quota_duration: 86_400 } }],
} as const;
