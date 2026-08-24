/**
 * Human translation review records.
 *
 * `LocaleDescriptor.reviewStatus` is derived from this file and nothing else. A
 * locale is `reviewed` when, and only when, a named person has signed their
 * name against a date here. Everything else is `beta`, which is what the
 * language picker badges.
 *
 * This file deliberately imports nothing. `locales.ts` reads it at module
 * evaluation time, so a dependency of any kind here would create an import
 * cycle. The gate that decides whether an entry is *allowed* to exist lives in
 * `review-gate.ts`, which may import freely because only tests call it.
 *
 * ## How a locale gets promoted
 *
 * Adding a locale is one object literal below. Before adding it, the gate in
 * `review-gate.ts` must pass for that locale, and `review-gate.test.ts` runs
 * that gate over every entry in CI. So the promotion cannot be a judgement
 * call made in a pull request description: an incomplete catalog, a catalog
 * with lint errors, a missing reviewer name, a malformed date, or an
 * unacknowledged English pass-through string all fail the build.
 *
 * `docs/planning/15-multilingual-rollout.md` carries the full procedure.
 */

export interface LocaleReview {
  /** BCP-47 tag. Must be an active locale in `locales.ts`. */
  readonly locale: string;
  /**
   * The person accountable for the review. A real name, never a team alias,
   * never "pending", never a placeholder. If nobody has read the catalog, the
   * locale has no entry here.
   */
  readonly reviewer: string;
  /** ISO 8601 calendar date, `YYYY-MM-DD`, in UTC. The day the review ended. */
  readonly reviewedOn: string;
  /**
   * Optional specialist sign-offs for copy whose correctness is not purely
   * linguistic. The final launch gate can require these areas without making
   * a beta review record pretend that a legal or security review happened.
   */
  readonly approvals?: readonly LocaleReviewApproval[];
  /** SHA-256 digest of the reviewed locale catalog, when recorded by CI. */
  readonly catalogDigest?: string;
  /** SHA-256 digest of the reviewed English source, when recorded by CI. */
  readonly sourceDigest?: string;
  /** Links or repository paths containing the contextual review evidence. */
  readonly evidence?: readonly string[];
  /**
   * Keys whose translated value is intentionally byte-identical to English:
   * proper nouns, ISO codes, symbols. The reviewer states them explicitly so
   * an untranslated sentence cannot hide among the legitimate ones.
   */
  readonly identicalToEnglish?: readonly string[];
}

export type LocaleReviewArea =
  | 'catalog'
  | 'editorial'
  | 'seo'
  | 'legal'
  | 'billing'
  | 'security'
  | 'accessibility';

export interface LocaleReviewApproval {
  readonly area: LocaleReviewArea;
  readonly reviewer: string;
  readonly reviewedOn: string;
}

/**
 * The twenty-five locales the founder named as the public multilingual promise.
 *
 * This is the *target*, not a claim. Membership here changes no behaviour and
 * grants no locale a reviewed badge; it exists so the gate can report the gap
 * between the promise and the signed reviews, and so the marketing surface
 * never has to hardcode a count.
 *
 * Widening from 20 to 25 was a one-line change here plus flipping the five
 * retired locales to active in `locales.ts`. See `docs/planning/23`.
 */
export const REVIEW_PROMISE_LOCALE_CODES: readonly string[] = [
  'en',
  'es',
  'es-419',
  'pt-BR',
  'fr',
  'de',
  'it',
  'nl',
  'pl',
  'cs',
  'sv',
  'tr',
  'ru',
  'uk',
  'ar',
  'he',
  'hi',
  'id',
  'vi',
  'th',
  'fil',
  'zh-Hans',
  'zh-Hant',
  'ja',
  'ko',
];

/**
 * Signed reviews. One entry per locale, added only after `review-gate.ts`
 * passes for it.
 *
 * Empty on purpose today. Every catalog may be lint clean while still lacking
 * a named human reviewer. Writing a name here that nobody agreed to would make
 * the reviewed badge a lie in all twenty languages at once.
 */
export const LOCALE_REVIEWS: readonly LocaleReview[] = [];

/** Reviewed tags, for the `O(1)` lookup `locales.ts` needs. */
export const REVIEWED_LOCALE_CODES: ReadonlySet<string> = new Set(
  LOCALE_REVIEWS.map((review) => review.locale),
);

/**
 * The signed review for a tag, when there is one.
 *
 * Ask `isReviewedLocale` from `./locales` for the badge; this is for surfaces
 * that want to name the reviewer or show the date.
 */
export function getLocaleReview(code: string): LocaleReview | undefined {
  return LOCALE_REVIEWS.find((review) => review.locale === code);
}
