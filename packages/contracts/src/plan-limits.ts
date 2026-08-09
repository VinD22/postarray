/** Commercial limits shared by billing, authorization and every surface. */
export const ACTIVE_CHANNEL_LIMIT = 10;

/**
 * A project is the customer-facing publishing boundary inside a workspace.
 * Existing Brand identifiers remain the compatible storage and API shape.
 */
export const BASE_PROJECT_LIMIT = 3;

/** No commercial entitlement may create more than this many active projects. */
export const MAX_PROJECT_LIMIT = 20;

/** Numeric entitlement read by every surface that creates a project. */
export const PROJECT_LIMIT_ENTITLEMENT_KEY = 'projects.active.max';

/**
 * Missing or malformed entitlement data falls back to the base allowance.
 * Operator grants are bounded so a bad value cannot bypass the database guard.
 */
export function normalizeProjectLimit(value: number | null | undefined): number {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return BASE_PROJECT_LIMIT;
  }
  return Math.min(MAX_PROJECT_LIMIT, Math.max(1, Math.trunc(value)));
}

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
