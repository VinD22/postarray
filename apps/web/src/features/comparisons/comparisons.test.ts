import { en } from '@relay/i18n';
import { formatLintResult, lintCatalog } from '@relay/i18n/lint';
import { describe, expect, it } from 'vitest';

import { MARKETING_ROUTES, ROUTES } from '@/features/marketing/site';

import { comparisonDisclosures } from './disclosures';
import {
  COMPARISON_PAGES,
  COMPARISON_ROUTES,
  comparisonPath,
  findComparisonPage,
} from './registry';
import { COMPARISON_SLUGS } from './slugs';
import { comparisonSources, comparisonStrings, isInternalSource } from './types';

/**
 * The invariants that make a comparison page safe to publish.
 *
 * A comparison is the page a product is most tempted to lie on, so these are
 * stricter than the blog's equivalents. The load bearing ones:
 *
 *  - every cell that asserts anything carries a source and a date,
 *  - `notVerified` is the only verdict allowed to have no source,
 *  - each page states what this product does not do, through the derived
 *    disclosures rather than through hand written prose,
 *  - no page carries review or rating markup, which is enforced by the route
 *    test below reading the page source.
 */

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('comparison registry', () => {
  it('publishes the slugs the site map declares, and nothing else', () => {
    expect(COMPARISON_PAGES.length).toBeGreaterThan(0);
    expect([...COMPARISON_PAGES].map((page) => page.slug).sort()).toEqual(
      [...COMPARISON_SLUGS].sort(),
    );
    expect(new Set(COMPARISON_SLUGS).size).toBe(COMPARISON_SLUGS.length);

    for (const page of COMPARISON_PAGES) {
      expect(page.slug, page.slug).toMatch(SLUG);
      expect(findComparisonPage(page.slug)).toBe(page);
      expect(comparisonPath(page.slug)).toBe(`/compare/${page.slug}`);
    }
  });

  it('puts every comparison in the marketing route map', () => {
    for (const route of COMPARISON_ROUTES) {
      expect(MARKETING_ROUTES, route).toContain(route);
    }
  });

  it('orders the index by the freshest check', () => {
    const checked = COMPARISON_PAGES.map((page) => page.checked);
    expect([...checked].sort().reverse()).toEqual(checked);
  });

  it('dates every page and schedules the next check after it', () => {
    for (const page of COMPARISON_PAGES) {
      expect(page.checked, page.slug).toMatch(ISO_DATE);
      expect(page.nextReview, page.slug).toMatch(ISO_DATE);
      expect(page.nextReview > page.checked, page.slug).toBe(true);
      expect(page.description.length, page.slug).toBeLessThanOrEqual(200);
    }
  });

  it('sources every cell that asserts anything, and only leaves not verified empty', () => {
    for (const page of COMPARISON_PAGES) {
      expect(page.rows.length, page.slug).toBeGreaterThan(2);
      const ids = page.rows.map((row) => row.id);
      expect(new Set(ids).size, page.slug).toBe(ids.length);

      for (const row of page.rows) {
        expect(row.id, `${page.slug}: ${row.id}`).toMatch(SLUG);
        for (const cell of [row.ours, row.theirs]) {
          expect(cell.detail.trim().length, `${page.slug}: ${row.id}`).toBeGreaterThan(0);

          if (cell.verdict === 'notVerified') {
            expect(cell.source, `${page.slug}: ${row.id} guesses`).toBeUndefined();
            continue;
          }

          const source = cell.source;
          expect(source, `${page.slug}: ${row.id} asserts without a source`).toBeDefined();
          if (source === undefined) continue;
          expect(source.readOn, `${page.slug}: ${row.id}`).toMatch(ISO_DATE);
          expect(source.title.trim().length, `${page.slug}: ${row.id}`).toBeGreaterThan(0);
          expect(source.readOn <= page.checked, `${page.slug}: ${row.id}`).toBe(true);

          if (isInternalSource(source)) {
            expect(MARKETING_ROUTES, `${page.slug}: ${source.url}`).toContain(source.url);
          } else {
            expect(source.url, `${page.slug}: ${row.id}`).toMatch(/^https:\/\//);
          }
        }
      }
    }
  });

  it('states what this product does not do, from live counts rather than prose', () => {
    const disclosures = comparisonDisclosures();
    expect(disclosures.map((entry) => entry.id)).toEqual(['connectors', 'locales', 'tiers']);

    for (const disclosure of disclosures) {
      expect(en[disclosure.messageKey], disclosure.id).toBeTypeOf('string');
      expect(Number.isInteger(disclosure.count), disclosure.id).toBe(true);
      expect(disclosure.count, disclosure.id).toBeGreaterThanOrEqual(0);
    }

    // Today's truth, and the reason the section exists. When any of these
    // changes, the sentence on every comparison page changes with it.
    const byId = new Map(disclosures.map((entry) => [entry.id, entry.count]));
    expect(byId.get('connectors')).toBe(0);
    expect(byId.get('locales')).toBe(0);
    // Was "greater than zero" while Growth and Studio were undecided
    // placeholders. Both now carry real prices, so the disclosure renders its
    // `=0` case: every tier has been decided. Pinned to the exact count rather
    // than relaxed, because the sentence is only worth anything if it changes
    // the day the fact does.
    expect(byId.get('tiers')).toBe(0);
  });

  it('renders the questions it marks up, and cites at least one external source', () => {
    for (const page of COMPARISON_PAGES) {
      expect(page.questions.length, page.slug).toBeGreaterThan(0);
      for (const entry of page.questions) {
        expect(entry.question.trim().endsWith('?'), `${page.slug}: ${entry.question}`).toBe(true);
        expect(entry.answer.trim().length, page.slug).toBeGreaterThan(0);
      }

      const external = comparisonSources(page).filter((source) => !isInternalSource(source));
      expect(external.length, `${page.slug} cites no official source`).toBeGreaterThan(0);
    }
  });

  it('never uses an em dash in a rendered string', () => {
    for (const page of COMPARISON_PAGES) {
      for (const value of comparisonStrings(page)) {
        expect(value.includes('—'), `${page.slug}: ${value}`).toBe(false);
        expect(value.includes('―'), `${page.slug}: ${value}`).toBe(false);
      }
    }
  });

  it('never names the product in a claim, and never links off the site map', () => {
    const brand = en['web.brand.name'];
    for (const page of COMPARISON_PAGES) {
      for (const row of page.rows) {
        expect(row.claim.includes(brand), `${page.slug}: ${row.claim}`).toBe(false);
      }
      for (const source of comparisonSources(page)) {
        if (isInternalSource(source)) {
          expect(Object.values(ROUTES), source.url).toContain(source.url);
        }
      }
    }
  });

  it('passes the same catalog lint every other user visible string passes', () => {
    const catalog: Record<string, string> = {};
    COMPARISON_PAGES.forEach((page, pageIndex) => {
      comparisonStrings(page).forEach((value, valueIndex) => {
        catalog[`compare.p${pageIndex}.s${valueIndex}`] = value;
      });
    });

    const result = lintCatalog(catalog, { locale: 'en', requireCoverage: false });
    if (!result.ok) {
      throw new Error(formatLintResult(result));
    }
    expect(result.errorCount).toBe(0);
  });
});
