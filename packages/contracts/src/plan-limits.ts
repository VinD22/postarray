/** Commercial limits shared by billing, authorization and every surface. */
export const ACTIVE_CHANNEL_LIMIT = 10;

/** One workspace owner plus five invited teammates. */
export const WORKSPACE_MEMBER_LIMIT = 6;

/** Media is removed thirty days after upload, whether or not it was posted. */
export const MEDIA_RETENTION_DAYS = 30;

export const IMAGE_UPLOAD_LIMIT_BYTES = 20 * 1024 * 1024;
export const VIDEO_UPLOAD_LIMIT_BYTES = 500 * 1024 * 1024;

/** Accepted at the product boundary. Provider limits are applied afterwards. */
export const UPLOADABLE_MEDIA_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'audio/mpeg',
  'audio/mp4',
  'application/pdf',
] as const;
