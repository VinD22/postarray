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
   * Keys whose translated value is intentionally byte-identical to English:
   * proper nouns, ISO codes, symbols. The reviewer states them explicitly so
   * an untranslated sentence cannot hide among the legitimate ones.
   */
  readonly identicalToEnglish?: readonly string[];
}

/**
 * The fifteen locales the founder named as the public multilingual promise.
 *
 * This is the *target*, not a claim. Membership here changes no behaviour and
 * grants no locale a reviewed badge; it exists so the gate can report the gap
 * between the promise and the signed reviews, and so the marketing surface
 * never has to hardcode a count.
 */
export const REVIEW_PROMISE_LOCALE_CODES: readonly string[] = [
  'en',
  'es',
  'pt-BR',
  'fr',
  'de',
  'it',
  'nl',
  'pl',
  'tr',
  'id',
  'ar',
  'hi',
  'ja',
  'ko',
  'zh-Hans',
];

/**
 * Signed reviews. One entry per locale, added only after `review-gate.ts`
 * passes for it.
 *
 * Empty on purpose today. Every one of the fifteen catalogs is complete and
 * lint clean, but no named human reviewer exists for any of them, and naming a
 * reviewer is a founder decision, not an engineering one. Writing a name here
 * that nobody agreed to would make the reviewed badge a lie in fifteen
 * languages at once. See `docs/planning/15-multilingual-rollout.md`.
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
