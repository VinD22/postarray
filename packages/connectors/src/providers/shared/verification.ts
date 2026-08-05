/**
 * Source verification metadata.
 *
 * Every number, limit, scope and price in these adapters comes from an official provider
 * document listed in `docs/research/06-source-register.md`, compiled 4 August 2026. The
 * date travels with the capability snapshot version so a stale snapshot is visible in a
 * diff and in the admin panel rather than only in a runbook nobody opens.
 */

/** The date every provider fact in this directory was last verified against a source. */
export const SOURCE_VERIFIED_ON = '2026-08-04';

/**
 * Build a capability version string. It changes whenever a provider fact changes, which is
 * what an approved content version pins so that approval drift can be detected.
 */
export function capabilityVersion(provider: string, revision: number): string {
  return `${provider}@${SOURCE_VERIFIED_ON}.${revision}`;
}

/** App review status for a connector, which is product state and not a runtime detail. */
export const REVIEW_STATES = [
  'not_started',
  'submitted',
  'approved',
  'rejected',
  'unaudited_restricted',
] as const;
export type ReviewState = (typeof REVIEW_STATES)[number];

export interface ProviderReviewStatus {
  readonly state: ReviewState;
  /** i18n key describing what the user sees while the review is incomplete. */
  readonly noticeKey: string | null;
}

/**
 * The review state as of the verification date. None of the six connectors has completed
 * production review yet, so anything gated behind review is `requires_review` in the
 * capability snapshot rather than `supported`. Update this table, not the adapters, when
 * an approval lands.
 */
export const REVIEW_STATUS: Readonly<Record<string, ProviderReviewStatus>> = Object.freeze({
  x: { state: 'not_started', noticeKey: 'connectors.x.review_pending' },
  linkedin: { state: 'not_started', noticeKey: 'connectors.linkedin.review_pending' },
  instagram: { state: 'not_started', noticeKey: 'connectors.instagram.review_pending' },
  facebook: { state: 'not_started', noticeKey: 'connectors.facebook.review_pending' },
  threads: { state: 'not_started', noticeKey: 'connectors.threads.review_pending' },
  youtube: {
    state: 'unaudited_restricted',
    noticeKey: 'connectors.youtube.unaudited_private_only',
  },
  tiktok: { state: 'unaudited_restricted', noticeKey: 'connectors.tiktok.unaudited_private_only' },
  bluesky: { state: 'approved', noticeKey: null },
});

export function reviewStatus(provider: string): ProviderReviewStatus {
  return REVIEW_STATUS[provider] ?? { state: 'not_started', noticeKey: null };
}

/**
 * True when the provider's production review is complete. A capability that the provider
 * offers but our review does not cover is `requires_review`, never `supported`.
 */
export function reviewApproved(provider: string): boolean {
  return reviewStatus(provider).state === 'approved';
}
