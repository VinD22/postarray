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

/**
 * No commercial entitlement may create more than this many active projects.
 *
 * The top tier saturates this exactly, so no surface can ever claim
 * "unlimited": the ceiling and the largest thing we sell are the same number by
 * construction. Raising it is a commercial decision and a database migration
 * (`0066_project_capacity_guard.sql` writes the same bound into a trigger), not
 * a constant edit.
 */
export const MAX_PROJECT_LIMIT = 25;

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
 * Ten is one account on each platform in the launch cohort: the promise a
 * project makes is "this business, everywhere", and an allowance that made a
 * project choose which half of the cohort to skip would break that sentence on
 * the cheapest plan, which is exactly where it is being tested.
 */
export const CHANNEL_ALLOWANCE_PER_PROJECT = 10;

/** No commercial entitlement may hold more than this many active channels. */
export const MAX_CHANNEL_LIMIT = 250;

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
 * the largest tier reaches exactly: 25 projects at ten channels each is 250,
 * so every project on every tier can hold one account on every launch
 * platform, and no surface can claim "unlimited connections".
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

/**
 * Publishing credits, and the free plan they exist for.
 *
 * There is no time-boxed trial. A workspace signs up, connects its accounts,
 * composes and schedules with everything the product does, and spends a credit
 * the moment a post is actually published. When the balance reaches zero the
 * next publish is refused and nothing else is: connections stay live, drafts
 * stay editable, schedules stay visible. A person finds out what the product is
 * worth by using it on their own accounts, not by watching a countdown.
 *
 * A credit is spent on publication, never on scheduling. Scheduling something
 * you then cancel must not cost anything, and a refund path for a cancelled
 * schedule is a reconciliation problem we decline to have.
 *
 * `FREE_POST_CREDIT_GRANT` is the opening balance, and it is deliberately one
 * constant rather than a rule spread across surfaces: it is expected to move as
 * we learn what "long enough to get the hang of it" actually is. Credits are
 * also granted by hand on top of it, which is how a referral or an affiliate
 * arrangement pays out today, so the balance is stored per workspace rather
 * than derived from this number.
 */
export const FREE_POST_CREDIT_GRANT = 3;

/**
 * The upper bound on a stored balance.
 *
 * Manual grants are typed by a human, so the balance takes the same treatment
 * as every other operator-set number here: bounded, so a slipped keystroke
 * cannot hand out a practically unlimited plan.
 */
export const MAX_POST_CREDIT_BALANCE = 1_000;

/** Numeric entitlement read by every surface that publishes a post. */
export const POST_CREDIT_ENTITLEMENT_KEY = 'publishing.credits.remaining';

/**
 * Missing or malformed credit data falls back to the opening grant.
 *
 * Not to zero: an unreadable balance is our failure, and the reader is a person
 * who has published nothing yet far more often than one who has spent
 * everything. Failing to the grant risks a handful of free posts; failing to
 * zero refuses a paying-intent customer at the one moment they were about to
 * see the product work.
 */
export function normalizePostCredits(value: number | null | undefined): number {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return FREE_POST_CREDIT_GRANT;
  }
  return Math.min(MAX_POST_CREDIT_BALANCE, Math.max(0, Math.trunc(value)));
}

/** One workspace owner plus five invited teammates. */
export const WORKSPACE_MEMBER_LIMIT = 6;

/** Media is removed thirty days after upload, whether or not it was posted. */
export const MEDIA_RETENTION_DAYS = 30;

/**
 * How far ahead a post may be scheduled, on every surface.
 *
 * The same thirty days as media retention, and not by coincidence: a post
 * scheduled further out than its media is kept would dispatch with nothing to
 * attach. Capping the schedule at the retention window keeps that failure
 * impossible by construction instead of by a cleanup job being polite, and it
 * is disclosed next to the picker rather than discovered at dispatch.
 */
export const MAX_SCHEDULE_HORIZON_DAYS = 30;

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
