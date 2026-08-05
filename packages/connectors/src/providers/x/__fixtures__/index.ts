/**
 * Recorded X response shapes.
 *
 * Every id, handle and URL below is fabricated. Nothing token shaped appears in this file,
 * which is enforced by the repository secret scan. Shapes follow the official X API v2
 * documentation retrieved 4 August 2026 and are re-captured when the API version changes.
 */

export const X_CREATE_POST_FIXTURE = {
  data: {
    id: '1900000000000000001',
    text: 'Sample root post for the connector contract tests.',
    edit_history_tweet_ids: ['1900000000000000001'],
  },
} as const;

export const X_CREATE_REPLY_FIXTURE = {
  data: {
    id: '1900000000000000002',
    text: 'Second part of the sample thread.',
    edit_history_tweet_ids: ['1900000000000000002'],
  },
} as const;

export const X_USER_ME_FIXTURE = {
  data: {
    id: '4400000000000000001',
    name: 'Sample Studio',
    username: 'sample_studio_fake',
    profile_image_url: 'https://example.invalid/avatar.png',
    protected: false,
    public_metrics: {
      followers_count: 1234,
      following_count: 210,
      tweet_count: 87,
      listed_count: 4,
    },
  },
} as const;

export const X_POST_METRICS_FIXTURE = {
  data: {
    id: '1900000000000000001',
    text: 'Sample root post for the connector contract tests.',
    created_at: '2026-08-04T09:15:00.000Z',
    public_metrics: {
      retweet_count: 3,
      reply_count: 2,
      like_count: 41,
      quote_count: 1,
      bookmark_count: 6,
      impression_count: 5120,
    },
    non_public_metrics: {
      url_link_clicks: 18,
      user_profile_clicks: 7,
    },
  },
} as const;

/** A post whose impression count the access tier does not return. */
export const X_POST_METRICS_PARTIAL_FIXTURE = {
  data: {
    id: '1900000000000000003',
    text: 'A post whose paid metrics are outside our access tier.',
    public_metrics: {
      retweet_count: 0,
      reply_count: 0,
      like_count: 2,
      quote_count: 0,
    },
  },
} as const;

export const X_TIMELINE_FIXTURE = {
  data: [
    {
      id: '1900000000000000001',
      text: 'Sample root post for the connector contract tests.',
      created_at: '2026-08-04T09:15:00.000Z',
    },
    {
      id: '1900000000000000000',
      text: 'An earlier and unrelated post.',
      created_at: '2026-08-04T08:00:00.000Z',
    },
  ],
  meta: { result_count: 2, newest_id: '1900000000000000001', oldest_id: '1900000000000000000' },
} as const;

export const X_DUPLICATE_ERROR_FIXTURE = {
  title: 'Forbidden',
  status: 403,
  detail: 'You are not allowed to create a Post with duplicate content.',
  type: 'https://api.x.com/2/problems/duplicate-rules',
} as const;

export const X_RATE_LIMIT_ERROR_FIXTURE = {
  title: 'Too Many Requests',
  status: 429,
  detail: 'Too Many Requests',
  type: 'https://api.x.com/2/problems/usage-capped',
} as const;

export const X_MEDIA_INITIALIZE_FIXTURE = {
  data: {
    id: '1700000000000000001',
    media_key: '3_1700000000000000001',
    expires_after_secs: 86_400,
  },
} as const;

export const X_MEDIA_FINALIZE_VIDEO_FIXTURE = {
  data: {
    id: '1700000000000000002',
    media_key: '7_1700000000000000002',
    processing_info: { state: 'in_progress', check_after_secs: 5, progress_percent: 40 },
  },
} as const;

export const X_DELETE_FIXTURE = { data: { deleted: true } } as const;
