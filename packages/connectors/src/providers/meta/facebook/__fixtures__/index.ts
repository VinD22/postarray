/**
 * Recorded Facebook Pages response shapes. Every id and URL is fabricated.
 * Retrieved 4 August 2026.
 */

export const FACEBOOK_PAGES_FIXTURE = {
  data: [
    {
      id: '61550000000001',
      name: 'Sample Studio Page',
      access_token: 'fake-page-token-not-a-real-credential',
      category: 'Software Company',
      tasks: ['CREATE_CONTENT', 'MANAGE', 'MODERATE', 'ANALYZE'],
      picture: { data: { url: 'https://example.invalid/page-avatar.jpg' } },
    },
    {
      id: '61550000000003',
      name: 'Analytics Only Page',
      access_token: 'fake-page-token-not-a-real-credential',
      category: 'Software Company',
      tasks: ['ANALYZE'],
    },
  ],
} as const;

export const FACEBOOK_FEED_POST_FIXTURE = {
  id: '61550000000001_122000000000001',
  post_id: '61550000000001_122000000000001',
} as const;

export const FACEBOOK_POST_LOOKUP_FIXTURE = {
  id: '61550000000001_122000000000001',
  permalink_url: 'https://www.facebook.com/61550000000001/posts/122000000000001',
  message: 'A sample Page post.',
  created_time: '2026-08-04T12:00:02+0000',
  is_published: true,
  likes: { summary: { total_count: 64 } },
  comments: { summary: { total_count: 8 } },
  shares: { count: 3 },
} as const;

export const FACEBOOK_UNPUBLISHED_PHOTO_FIXTURE = { id: '122000000000900' } as const;

export const FACEBOOK_VIDEO_PROCESSING_FIXTURE = {
  id: '122000000000500',
  status: {
    video_status: 'processing',
    processing_progress: 42,
    uploading_phase: { status: 'complete' },
    processing_phase: { status: 'in_progress' },
  },
} as const;

export const FACEBOOK_VIDEO_READY_FIXTURE = {
  id: '122000000000500',
  status: { video_status: 'ready', processing_progress: 100 },
  permalink_url: 'https://www.facebook.com/61550000000001/videos/122000000000500',
} as const;

export const FACEBOOK_POST_INSIGHTS_FIXTURE = {
  data: [
    {
      name: 'post_impressions',
      period: 'lifetime',
      values: [{ value: 15_400 }],
      title: 'Post impressions',
      description: 'The number of times the post entered a person screen.',
    },
    { name: 'post_impressions_unique', period: 'lifetime', values: [{ value: 11_200 }] },
    { name: 'post_clicks', period: 'lifetime', values: [{ value: 340 }] },
  ],
} as const;

export const FACEBOOK_PAGE_INSIGHTS_FIXTURE = {
  data: [
    { name: 'page_impressions', period: 'day', values: [{ value: 22_000 }] },
    { name: 'page_impressions_unique', period: 'day', values: [{ value: 17_500 }] },
    { name: 'page_fan_adds_unique', period: 'day', values: [{ value: 41 }] },
  ],
} as const;

export const FACEBOOK_ROLE_REMOVED_FIXTURE = {
  error: {
    message: 'The user must be an administrator of the page in order to impersonate it',
    type: 'OAuthException',
    code: 190,
    error_subcode: 492,
    fbtrace_id: 'FakeTraceId0003',
  },
} as const;

export const FACEBOOK_PAGE_RESTRICTED_FIXTURE = {
  error: {
    message: 'This Page is currently restricted',
    type: 'OAuthException',
    code: 368,
    error_user_title: 'Page restricted',
    error_user_msg: 'This Page cannot post right now. Check its status in Meta Business Suite.',
    fbtrace_id: 'FakeTraceId0004',
  },
} as const;
