/**
 * Recorded Threads response shapes. Every id and URL is fabricated.
 * Retrieved 4 August 2026 from the official Meta Threads collection.
 */

export const THREADS_PROFILE_FIXTURE = {
  id: '78000000000000001',
  username: 'sample_studio_fake',
  name: 'Sample Studio',
  threads_profile_picture_url: 'https://example.invalid/threads-avatar.jpg',
} as const;

export const THREADS_CONTAINER_FIXTURE = { id: '18000000000000001' } as const;
export const THREADS_REPLY_CONTAINER_FIXTURE = { id: '18000000000000002' } as const;

export const THREADS_CONTAINER_IN_PROGRESS_FIXTURE = {
  id: '18000000000000001',
  status: 'IN_PROGRESS',
} as const;

export const THREADS_CONTAINER_FINISHED_FIXTURE = {
  id: '18000000000000001',
  status: 'FINISHED',
} as const;

export const THREADS_CONTAINER_ERROR_FIXTURE = {
  id: '18000000000000001',
  status: 'ERROR',
  error_message: 'The media could not be processed.',
} as const;

export const THREADS_PUBLISH_FIXTURE = { id: '19000000000000001' } as const;
export const THREADS_REPLY_PUBLISH_FIXTURE = { id: '19000000000000002' } as const;

export const THREADS_MEDIA_FIXTURE = {
  id: '19000000000000001',
  permalink: 'https://www.threads.net/@sample_studio_fake/post/FAKESHORTCODE1',
  text: 'A sample Threads post.',
  timestamp: '2026-08-04T12:00:03+0000',
  media_type: 'TEXT_POST',
  shortcode: 'FAKESHORTCODE1',
} as const;

export const THREADS_REPLY_MEDIA_FIXTURE = {
  id: '19000000000000002',
  permalink: 'https://www.threads.net/@sample_studio_fake/post/FAKESHORTCODE2',
  text: 'The second part of the thread.',
  media_type: 'TEXT_POST',
  shortcode: 'FAKESHORTCODE2',
} as const;

export const THREADS_MEDIA_INSIGHTS_FIXTURE = {
  data: [
    { name: 'views', period: 'lifetime', total_value: { value: 3120 }, values: [] },
    { name: 'likes', period: 'lifetime', total_value: { value: 84 }, values: [] },
    { name: 'replies', period: 'lifetime', total_value: { value: 6 }, values: [] },
  ],
} as const;

export const THREADS_PERMISSION_ERROR_FIXTURE = {
  error: {
    message: 'Insufficient permission to access this insight',
    type: 'OAuthException',
    code: 200,
    fbtrace_id: 'FakeTraceId0005',
  },
} as const;
