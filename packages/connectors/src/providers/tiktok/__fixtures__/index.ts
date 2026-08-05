/**
 * Recorded TikTok Content Posting API response shapes. Every id and URL is fabricated.
 * Retrieved 4 August 2026.
 */

export const TIKTOK_USER_INFO_FIXTURE = {
  data: {
    user: {
      open_id: 'fake-open-id-0000000001',
      union_id: 'fake-union-id-0000000001',
      display_name: 'Sample Studio',
      username: 'sample_studio_fake',
      avatar_url: 'https://example.invalid/tiktok-avatar.jpg',
      is_verified: false,
    },
  },
  error: { code: 'ok', message: '', log_id: 'FakeLogId0001' },
} as const;

/** An approved app sees several privacy levels. */
export const TIKTOK_CREATOR_INFO_FIXTURE = {
  data: {
    creator_avatar_url: 'https://example.invalid/tiktok-avatar.jpg',
    creator_username: 'sample_studio_fake',
    creator_nickname: 'Sample Studio',
    privacy_level_options: ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'SELF_ONLY'],
    comment_disabled: false,
    duet_disabled: false,
    stitch_disabled: true,
    max_video_post_duration_sec: 600,
  },
  error: { code: 'ok', message: '', log_id: 'FakeLogId0002' },
} as const;

/** An unaudited app, or a creator who restricted their account. */
export const TIKTOK_CREATOR_INFO_PRIVATE_ONLY_FIXTURE = {
  data: {
    creator_username: 'sample_studio_fake',
    creator_nickname: 'Sample Studio',
    privacy_level_options: ['SELF_ONLY'],
    comment_disabled: true,
    duet_disabled: true,
    stitch_disabled: true,
    max_video_post_duration_sec: 60,
  },
  error: { code: 'ok', message: '', log_id: 'FakeLogId0003' },
} as const;

export const TIKTOK_PUBLISH_INIT_FIXTURE = {
  data: {
    publish_id: 'v_pub_fake~publish.id.0000000001',
    upload_url: 'https://open-upload.tiktokapis.invalid/upload/?upload_id=FAKEUPLOAD0001',
  },
  error: { code: 'ok', message: '', log_id: 'FakeLogId0004' },
} as const;

export const TIKTOK_STATUS_PROCESSING_FIXTURE = {
  data: { status: 'PROCESSING_UPLOAD', uploaded_bytes: 5_000_000 },
  error: { code: 'ok', message: '', log_id: 'FakeLogId0005' },
} as const;

export const TIKTOK_STATUS_COMPLETE_FIXTURE = {
  data: {
    status: 'PUBLISH_COMPLETE',
    publicaly_available_post_id: ['7400000000000000001'],
  },
  error: { code: 'ok', message: '', log_id: 'FakeLogId0006' },
} as const;

export const TIKTOK_STATUS_FAILED_FIXTURE = {
  data: { status: 'FAILED', fail_reason: 'video_format_not_supported' },
  error: { code: 'ok', message: '', log_id: 'FakeLogId0007' },
} as const;

export const TIKTOK_UNAUDITED_ERROR_FIXTURE = {
  error: {
    code: 'unaudited_client_can_only_post_to_private_accounts',
    message: 'Unaudited clients can only post to private accounts.',
    log_id: 'FakeLogId0008',
  },
} as const;

export const TIKTOK_SPAM_RISK_FIXTURE = {
  error: {
    code: 'spam_risk_too_many_posts',
    message: 'The daily post cap from API is reached.',
    log_id: 'FakeLogId0009',
  },
} as const;
