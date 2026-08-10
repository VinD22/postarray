/**
 * The gate a locale must pass before it may appear in `LOCALE_REVIEWS`.
 *
 * The point of this module is to remove judgement from the promotion. "This
 * one looks finished" is how a half-translated language ends up wearing a
 * reviewed badge. Everything below is mechanical: either the catalog is
 * complete, lint clean, signed by a named person on a real date, and free of
 * unacknowledged English pass-through strings, or the locale stays beta and
 * CI says so.
 *
 * Nothing here runs in the product. `reviews.ts` is the data; this is the
 * check, and `review-gate.test.ts` is where it is enforced.
 */

import { stripArguments } from './icu';
import { formatLintResult, lintCatalog } from './lint';
import { getLocale } from './locales';
import type { LocaleReview } from './reviews';

export type ReviewGateRule =
  | 'unknown-locale'
  | 'inactive-locale'
  | 'duplicate-review'
  | 'reviewer-missing'
  | 'review-date-invalid'
  | 'review-date-in-future'
  | 'catalog-missing'
  | 'catalog-incomplete'
  | 'catalog-lint-error'
  | 'untranslated-english'
  | 'stale-sign-off';

export interface ReviewGateFinding {
  readonly rule: ReviewGateRule;
  readonly locale: string;
  readonly detail: string;
}

export interface ReviewGateSources {
  /** The controlling English catalog. */
  readonly reference: Readonly<Record<string, string>>;
  /** Loaded catalogs by BCP-47 tag. */
  readonly catalogs: Readonly<Record<string, Readonly<Record<string, string>>>>;
  /**
   * Keys that are allowed to stay in English by policy, which today is the
   * B5 beta-fallback list. A locale is not penalised for those.
   */
  readonly isEnglishFallbackKey: (key: string) => boolean;
  /** Today as an ISO calendar date, so a future review date is catchable. */
  readonly today: string;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Strings that read like a name but name nobody. A reviewed badge has to point
 * at a person who can be asked what they checked.
 */
const PLACEHOLDER_REVIEWER =
  /^(tbd|tba|pending|todo|none|n\/?a|unknown|team|the team|localization|localization lead|localisation lead|i18n|reviewer|founder|anonymous|\?+|-+)$/i;

/** At least one Latin or non-Latin letter, so "2026" is not a name. */
const HAS_LETTER = /\p{L}/u;

/** A run of letters long enough that a translator would have changed it. */
const TRANSLATABLE_WORD = /\p{L}{3,}/u;

/**
 * Whether a message would visibly change under translation.
 *
 * Arguments are stripped first, so `{weekday}, {date}` is correctly treated as
 * having no translatable text at all and never counts as a pass-through.
 */
export function hasTranslatableText(message: string): boolean {
  return TRANSLATABLE_WORD.test(stripArguments(message));
}

/**
 * Keys where the locale repeats the English source verbatim and the source has
 * real words in it. Proper nouns land here too, which is why the review record
 * carries an explicit acknowledgement list rather than a heuristic allow list.
 */
export function findEnglishPassThroughKeys(
  catalog: Readonly<Record<string, string>>,
  reference: Readonly<Record<string, string>>,
  isEnglishFallbackKey: (key: string) => boolean,
): readonly string[] {
  return Object.keys(reference)
    .filter((key) => !isEnglishFallbackKey(key))
    .filter((key) => catalog[key] !== undefined && catalog[key] === reference[key])
    .filter((key) => hasTranslatableText(reference[key] ?? ''));
}

/** English keys a locale has not translated at all, ignoring policy fallbacks. */
export function findMissingKeys(
  catalog: Readonly<Record<string, string>>,
  reference: Readonly<Record<string, string>>,
  isEnglishFallbackKey: (key: string) => boolean,
): readonly string[] {
  return Object.keys(reference).filter(
    (key) => !isEnglishFallbackKey(key) && catalog[key] === undefined,
  );
}

function checkReviewer(review: LocaleReview, add: (rule: ReviewGateRule, detail: string) => void) {
  const reviewer = review.reviewer.trim();
  if (reviewer.length < 2 || !HAS_LETTER.test(reviewer) || PLACEHOLDER_REVIEWER.test(reviewer)) {
    add(
      'reviewer-missing',
      `"${review.reviewer}" does not name a person. A reviewed locale needs someone who can be asked what they checked.`,
    );
  }
}

function checkDate(
  review: LocaleReview,
  today: string,
  add: (rule: ReviewGateRule, detail: string) => void,
) {
  if (!ISO_DATE.test(review.reviewedOn)) {
    add('review-date-invalid', `"${review.reviewedOn}" is not an ISO YYYY-MM-DD calendar date.`);
    return;
  }
  const parsed = new Date(`${review.reviewedOn}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== review.reviewedOn) {
    add('review-date-invalid', `"${review.reviewedOn}" is not a real calendar date.`);
    return;
  }
  if (review.reviewedOn > today) {
    add('review-date-in-future', `Reviewed on ${review.reviewedOn}, which is after ${today}.`);
  }
}

/** Run every rule for one signed review. An empty result means it may ship. */
export function checkLocaleReview(
  review: LocaleReview,
  sources: ReviewGateSources,
): readonly ReviewGateFinding[] {
  const findings: ReviewGateFinding[] = [];
  const add = (rule: ReviewGateRule, detail: string): void => {
    findings.push({ rule, locale: review.locale, detail });
  };

  const descriptor = getLocale(review.locale);
  if (!descriptor) {
    add('unknown-locale', 'Not a tag in the locale registry.');
  } else if (descriptor.status !== 'active') {
    add(
      'inactive-locale',
      `Status is "${descriptor.status}". Only an active locale can be reviewed.`,
    );
  }

  checkReviewer(review, add);
  checkDate(review, sources.today, add);

  const catalog = sources.catalogs[review.locale];
  if (catalog === undefined) {
    add('catalog-missing', 'No catalog was loaded for this tag.');
    return findings;
  }

  const missing = findMissingKeys(catalog, sources.reference, sources.isEnglishFallbackKey);
  if (missing.length > 0) {
    add(
      'catalog-incomplete',
      `${missing.length} keys are untranslated, starting with ${missing.slice(0, 5).join(', ')}.`,
    );
  }

  // `requireCoverage` is off because the completeness check above is strictly
  // stronger: it compares against every key in the reference catalog, not just
  // the error, state and validation families the coverage rules enumerate.
  const lint = lintCatalog(catalog, {
    locale: review.locale,
    reference: sources.reference,
    requireCoverage: false,
  });
  if (!lint.ok) {
    add('catalog-lint-error', formatLintResult(lint));
  }

  const acknowledged = new Set(review.identicalToEnglish ?? []);
  const passThrough = findEnglishPassThroughKeys(
    catalog,
    sources.reference,
    sources.isEnglishFallbackKey,
  );
  const unacknowledged = passThrough.filter((key) => !acknowledged.has(key));
  if (unacknowledged.length > 0) {
    add(
      'untranslated-english',
      `${unacknowledged.length} messages repeat the English source verbatim and are not listed in identicalToEnglish, starting with ${unacknowledged.slice(0, 5).join(', ')}.`,
    );
  }

  const passThroughSet = new Set(passThrough);
  const stale = [...acknowledged].filter((key) => !passThroughSet.has(key));
  if (stale.length > 0) {
    add(
      'stale-sign-off',
      `identicalToEnglish lists ${stale.length} keys that no longer match the English source, starting with ${stale.slice(0, 5).join(', ')}. Remove them so the list keeps meaning something.`,
    );
  }

  return findings;
}

/** The whole review record at once, including duplicate entries. */
export function checkAllLocaleReviews(
  reviews: readonly LocaleReview[],
  sources: ReviewGateSources,
): readonly ReviewGateFinding[] {
  const findings: ReviewGateFinding[] = [];
  const seen = new Set<string>();
  for (const review of reviews) {
    if (seen.has(review.locale)) {
      findings.push({
        rule: 'duplicate-review',
        locale: review.locale,
        detail: 'Listed more than once. One signature per locale.',
      });
      continue;
    }
    seen.add(review.locale);
    findings.push(...checkLocaleReview(review, sources));
  }
  return findings;
}

/** Render findings as something a person can act on. */
export function formatReviewGateFindings(findings: readonly ReviewGateFinding[]): string {
  if (findings.length === 0) {
    return 'Every signed locale review passes the gate.';
  }
  return findings
    .map((finding) => `${finding.locale}  [${finding.rule}]  ${finding.detail}`)
    .join('\n');
}
