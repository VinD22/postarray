/**
 * Commercial limits shared by billing, authorization and every surface.
 *
 * `ACTIVE_CHANNEL_LIMIT` is the floor a workspace holds with **no** channel
 * entitlement at all: an unsubscribed, unverified or unreadable state. It is
 * not the ceiling and it is not what any tier grants. The number a subscribed
 * workspace holds is derived from the one thing we sell, active projects, by
 * `channelAllowanceForProjects`.
 */
export const ACTIVE_CHANNEL_LIMIT = 10;

/**
 * A project is the customer-facing publishing boundary inside a workspace.
 * An identifier minted before the storage rename keeps its `brand_` prefix
 * forever; the prefix is opaque once assigned. Every identifier minted since
 * carries the `project_` prefix instead, and both are equally valid.
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

/**
 * Channels a project is worth.
 *
 * Channel capacity is **derived, never sold**. A tier buys active projects and
 * nothing else, so a per-channel price cannot exist; but a ten or twenty
 * project tier that still capped the workspace at ten connections would be
 * unusable, so the connection allowance scales with the one number we sell.
 * Five is one account on each of the platform families a single project
 * realistically runs at once.
 */
export const CHANNEL_ALLOWANCE_PER_PROJECT = 5;

/** No commercial entitlement may hold more than this many active channels. */
export const MAX_CHANNEL_LIMIT = 100;

/** Numeric entitlement read by every surface that connects a channel. */
export const CHANNEL_LIMIT_ENTITLEMENT_KEY = 'channels.active.max';

/**
 * The channel allowance a project allowance implies.
 *
 * Pooled at workspace level on purpose. Real projects are uneven: one client
 * runs six accounts and the next runs one, and a per-project quota would refuse
 * the sixth connection while five slots sat unused next door. The workspace
 * holds one pool and spends it where the work is.
 *
 * Bounded below by the no-entitlement floor so a derived number can never be
 * worse than having no subscription, and above by `MAX_CHANNEL_LIMIT`, which
 * the twenty-project ceiling reaches exactly.
 */
export function channelAllowanceForProjects(projects: number): number {
  const projectCount = Number.isFinite(projects) ? Math.trunc(projects) : 0;
  const derived = projectCount * CHANNEL_ALLOWANCE_PER_PROJECT;
  return Math.min(MAX_CHANNEL_LIMIT, Math.max(ACTIVE_CHANNEL_LIMIT, derived));
}

/**
 * Missing or malformed entitlement data falls back to the no-entitlement floor.
 * Mirrors `normalizeProjectLimit`: operator grants are bounded so a bad value
 * cannot hand a workspace an unbounded connection budget.
 */
export function normalizeChannelLimit(value: number | null | undefined): number {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return ACTIVE_CHANNEL_LIMIT;
  }
  return Math.min(MAX_CHANNEL_LIMIT, Math.max(1, Math.trunc(value)));
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
