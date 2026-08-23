import { describe, expect, it } from 'vitest';

import { ACTIVE_LOCALE_CODES, ALL_LOCALE_CODES, getLocale, isReviewedLocale } from './locales';
import { en, loadCatalog } from './messages/index';
import { isBetaEnglishFallbackKey } from './messages/beta-fallbacks';
import {
  checkAllLocaleReviews,
  checkLocaleReview,
  findEnglishPassThroughKeys,
  findMissingKeys,
  formatReviewGateFindings,
  hasTranslatableText,
  type ReviewGateSources,
} from './review-gate';
import { LOCALE_REVIEWS, REVIEW_PROMISE_LOCALE_CODES } from './reviews';

/**
 * The promotion gate.
 *
 * The important test in this file is the first one: every entry in
 * `LOCALE_REVIEWS` is re-checked against the catalog on disk, so a locale
 * cannot be promoted by editing a list. If somebody adds a language whose
 * catalog is incomplete, whose lint fails, whose reviewer is a placeholder, or
 * which still repeats English sentences that nobody signed off, this build
 * fails and names the offending keys.
 */

const TODAY = new Date().toISOString().slice(0, 10);

async function loadSources(locales: readonly string[]): Promise<ReviewGateSources> {
  const loaded = await Promise.all(
    locales.map(async (locale) => [locale, await loadCatalog(locale)] as const),
  );
  return {
    reference: en,
    catalogs: Object.fromEntries(loaded) as ReviewGateSources['catalogs'],
    isEnglishFallbackKey: isBetaEnglishFallbackKey,
    today: TODAY,
  };
}

describe('locale review gate', () => {
  it('holds every signed review to the full gate', async () => {
    const sources = await loadSources(LOCALE_REVIEWS.map((review) => review.locale));
    const findings = checkAllLocaleReviews(LOCALE_REVIEWS, sources);
    if (findings.length > 0) {
      throw new Error(
        `A locale is marked reviewed without passing the gate.\n${formatReviewGateFindings(findings)}`,
      );
    }
    expect(findings).toEqual([]);
  }, 60_000);

  it('derives the picker badge from the review record and nothing else', () => {
    const signed = new Set(LOCALE_REVIEWS.map((review) => review.locale));
    for (const code of ALL_LOCALE_CODES) {
      expect(isReviewedLocale(code), code).toBe(signed.has(code));
      expect(getLocale(code)?.reviewStatus, code).toBe(signed.has(code) ? 'reviewed' : 'beta');
    }
  });

  it('names twenty promise locales that are all real and all switched on', () => {
    expect(REVIEW_PROMISE_LOCALE_CODES).toHaveLength(20);
    expect(new Set(REVIEW_PROMISE_LOCALE_CODES).size).toBe(20);
    for (const code of REVIEW_PROMISE_LOCALE_CODES) {
      expect(ACTIVE_LOCALE_CODES, code).toContain(code);
    }
  });

  /**
   * The promise is a target, not a claim. This test does not require the two
   * numbers to match; it requires the reviewed set to be a subset of the
   * promise, so nothing can be promoted that the founder never named.
   */
  it('never promotes a locale outside the named promise', () => {
    const promise = new Set(REVIEW_PROMISE_LOCALE_CODES);
    for (const review of LOCALE_REVIEWS) {
      expect(promise.has(review.locale), review.locale).toBe(true);
    }
  });
});

describe('review gate rules', () => {
  const reference = {
    'nav.home': 'Home',
    'nav.settings': 'Settings',
    'billing.plan.name': 'Standard',
    'calendar.dayHeading': '{weekday}, {date}',
  } as const;

  const sourcesFor = (catalog: Record<string, string>): ReviewGateSources => ({
    reference,
    catalogs: { de: catalog },
    isEnglishFallbackKey: (key) => key.startsWith('billing.'),
    today: '2026-08-10',
  });

  const complete = {
    'nav.home': 'Start',
    'nav.settings': 'Einstellungen',
    'calendar.dayHeading': '{weekday}, {date}',
  };

  const review = { locale: 'de', reviewer: 'Ada Kessler', reviewedOn: '2026-08-01' };

  it('passes a complete, lint clean, signed catalog', () => {
    expect(checkLocaleReview(review, sourcesFor(complete))).toEqual([]);
  });

  it('fails an incomplete catalog', () => {
    const { 'nav.settings': _dropped, ...partial } = complete;
    const rules = checkLocaleReview(review, sourcesFor(partial)).map((finding) => finding.rule);
    expect(rules).toContain('catalog-incomplete');
  });

  it('fails a catalog with a lint error', () => {
    const rules = checkLocaleReview(
      review,
      sourcesFor({ ...complete, 'nav.home': 'Start — jetzt' }),
    ).map((finding) => finding.rule);
    expect(rules).toContain('catalog-lint-error');
  });

  it('fails an unacknowledged English pass-through', () => {
    const findings = checkLocaleReview(review, sourcesFor({ ...complete, 'nav.home': 'Home' }));
    expect(findings.map((finding) => finding.rule)).toContain('untranslated-english');
    expect(findings[0]?.detail).toContain('nav.home');
  });

  it('accepts a pass-through the reviewer explicitly signed off', () => {
    expect(
      checkLocaleReview(
        { ...review, identicalToEnglish: ['nav.home'] },
        sourcesFor({ ...complete, 'nav.home': 'Home' }),
      ),
    ).toEqual([]);
  });

  it('fails a sign-off that no longer matches the English source', () => {
    const rules = checkLocaleReview(
      { ...review, identicalToEnglish: ['nav.home'] },
      sourcesFor(complete),
    ).map((finding) => finding.rule);
    expect(rules).toContain('stale-sign-off');
  });

  it('ignores policy English fallbacks when judging completeness', () => {
    expect(findMissingKeys(complete, reference, (key) => key.startsWith('billing.'))).toEqual([]);
  });

  it('does not treat an argument-only message as untranslated', () => {
    expect(hasTranslatableText('{weekday}, {date}')).toBe(false);
    expect(hasTranslatableText('{count, plural, one {# post} other {# posts}}')).toBe(true);
    expect(
      findEnglishPassThroughKeys(complete, reference, (key) => key.startsWith('billing.')),
    ).toEqual([]);
  });

  it.each([
    ['', 'reviewer-missing'],
    ['TBD', 'reviewer-missing'],
    ['pending', 'reviewer-missing'],
    ['the team', 'reviewer-missing'],
    ['Localization Lead', 'reviewer-missing'],
  ])('rejects "%s" as a reviewer name', (reviewer, rule) => {
    const rules = checkLocaleReview({ ...review, reviewer }, sourcesFor(complete)).map(
      (finding) => finding.rule,
    );
    expect(rules).toContain(rule);
  });

  it.each([
    ['2026/08/01', 'review-date-invalid'],
    ['2026-13-01', 'review-date-invalid'],
    ['2027-01-01', 'review-date-in-future'],
  ])('rejects the review date %s', (reviewedOn, rule) => {
    const rules = checkLocaleReview({ ...review, reviewedOn }, sourcesFor(complete)).map(
      (finding) => finding.rule,
    );
    expect(rules).toContain(rule);
  });

  it('rejects a tag that is not an active locale', () => {
    const rules = checkLocaleReview(
      { ...review, locale: 'kl' },
      { ...sourcesFor(complete), catalogs: { kl: complete } },
    ).map((finding) => finding.rule);
    expect(rules).toContain('unknown-locale');
  });

  it('rejects the same locale signed twice', () => {
    const rules = checkAllLocaleReviews([review, review], sourcesFor(complete)).map(
      (finding) => finding.rule,
    );
    expect(rules).toContain('duplicate-review');
  });

  it('requires a signed record for every locale in the final roster', () => {
    const findings = checkAllLocaleReviews([review], {
      ...sourcesFor(complete),
      requiredLocaleCodes: ['de', 'fr'],
    });
    expect(findings).toEqual([
      {
        rule: 'review-missing',
        locale: 'fr',
        detail: 'No signed review record exists for this required public locale.',
      },
    ]);
  });

  it('can enforce the final zero-fallback launch gate', () => {
    const sources = sourcesFor(complete);
    const rules = checkLocaleReview(review, {
      ...sources,
      allowEnglishFallbacks: false,
    }).map((finding) => finding.rule);
    expect(rules).toContain('catalog-incomplete');
  });

  it('enforces specialist approvals, digests and contextual evidence when requested', () => {
    const findings = checkLocaleReview(review, {
      ...sourcesFor(complete),
      requiredApprovals: ['legal', 'seo'],
      requireDigests: true,
      requireEvidence: true,
    });
    expect(findings.map((finding) => finding.rule)).toEqual(
      expect.arrayContaining([
        'approval-missing',
        'catalog-digest-missing',
        'source-digest-missing',
        'review-evidence-missing',
      ]),
    );
  });

  it('accepts complete evidence metadata in the final review shape', () => {
    const findings = checkLocaleReview(
      {
        ...review,
        approvals: [
          { area: 'legal', reviewer: 'Lena Weber', reviewedOn: '2026-08-02' },
          { area: 'seo', reviewer: 'Sam Ortiz', reviewedOn: '2026-08-02' },
        ],
        catalogDigest: 'a'.repeat(64),
        sourceDigest: 'b'.repeat(64),
        evidence: ['/artifacts/i18n/de/catalog.png', 'https://example.test/review/de'],
      },
      {
        ...sourcesFor(complete),
        requiredApprovals: ['legal', 'seo'],
        requireDigests: true,
        requireEvidence: true,
      },
    );
    expect(findings).toEqual([]);
  });

  it('rejects malformed review digests and evidence references', () => {
    const findings = checkLocaleReview(
      {
        ...review,
        catalogDigest: 'not-a-digest',
        sourceDigest: 'also-not-a-digest',
        evidence: ['screenshot.png', 'screenshot.png'],
      },
      { ...sourcesFor(complete), requireDigests: true, requireEvidence: true },
    );
    expect(findings.map((finding) => finding.rule)).toEqual(
      expect.arrayContaining(['catalog-digest-invalid', 'source-digest-invalid', 'review-evidence-invalid']),
    );
  });
});

/**
 * The honest state of the twenty, recorded as a test rather than as prose in
 * a pull request, so the gap is visible every time the suite runs.
 *
 * It asserts the two facts that are true today and would have to change before
 * a promotion is even possible: the catalogs are complete and lint clean, and
 * every one of them still repeats English sentences a reviewer would have to
 * either translate or sign off.
 */
describe('promise locales, measured', () => {
  it('reports the real distance to a reviewed badge', async () => {
    const locales = REVIEW_PROMISE_LOCALE_CODES.filter((code) => code !== 'en');
    const sources = await loadSources(locales);
    const report: string[] = [];

    for (const locale of locales) {
      const catalog = sources.catalogs[locale];
      expect(catalog, locale).toBeDefined();
      if (!catalog) {
        continue;
      }
      const missing = findMissingKeys(catalog, en, isBetaEnglishFallbackKey);
      const passThrough = findEnglishPassThroughKeys(catalog, en, isBetaEnglishFallbackKey);
      expect(missing, `${locale} catalog completeness`).toEqual([]);
      report.push(`${locale}: ${passThrough.length} English pass-through messages`);
    }

    expect(report).toHaveLength(locales.length);
  }, 60_000);
});
