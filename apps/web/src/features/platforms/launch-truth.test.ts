import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n';

import { CONNECTORS } from '@/features/marketing/data/connectors';
import { PUBLISHING_LIMITS } from '@/features/marketing/data/publishing-limits';

import { PLATFORM_PAGES } from './registry';
import { USE_CASE_PAGES } from './use-cases';

/**
 * The sibling of `packages/i18n/src/messages/launch-truth.test.ts`, for the
 * pages C5 added.
 *
 * Two things are checked, and they are different in kind.
 *
 * The first is that the page sources hold no capability claim of their own: no
 * platform name, no ceiling, no capability state, no external link. Everything
 * a platform page says has to arrive through the generated datasets, so the
 * honesty is structural rather than editorial.
 *
 * The second is that the copy these pages do own keeps its denials. A notice
 * that quietly loses "no connector has passed its definition of done" turns
 * ten pages into a claim that scheduling works, which it does not.
 */

const PAGE_SOURCES = [
  '../../app/[locale]/(marketing)/schedule/page.tsx',
  '../../app/[locale]/(marketing)/schedule/[platform]/page.tsx',
  '../../app/[locale]/(marketing)/use-cases/page.tsx',
  '../../app/[locale]/(marketing)/use-cases/[useCase]/page.tsx',
].map((relative) => ({
  path: relative,
  source: readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8'),
}));

/**
 * Every display name a page could be tempted to type instead of read.
 *
 * One-and-two character names are excluded because a substring search for them
 * matches ordinary source text and would fail for the wrong reason. The names
 * that could plausibly be hardcoded in prose are all longer than that.
 */
const PLATFORM_NAMES: readonly string[] = PLATFORM_PAGES.map((page) =>
  String(en[page.nameKey]),
).filter((name) => name.length > 2);

/** Numbers big enough that they can only be a platform limit, not a layout value. */
const LIMIT_NUMBERS = [
  ...new Set(
    Object.values(PUBLISHING_LIMITS).flatMap((limits) =>
      [
        limits.maxTitleLength,
        limits.text?.maxLength,
        limits.text?.charactersPerLink,
        limits.media?.maxImageBytes,
        limits.media?.maxVideoBytes,
        limits.media?.maxGifBytes,
        limits.media?.maxDocumentBytes,
        limits.media?.maxDurationSeconds,
        limits.media?.maxAltTextLength,
      ].filter((value): value is number => typeof value === 'number' && value >= 100),
    ),
  ),
];

const CAPABILITY_STATE_WORDS = ['supported', 'unsupported', 'not_implemented', 'requires_review'];

describe('platform pages hold no claim of their own', () => {
  it.each(PAGE_SOURCES)('$path names no platform', ({ source }) => {
    for (const name of PLATFORM_NAMES) {
      expect(source.includes(name), name).toBe(false);
    }
  });

  it.each(PAGE_SOURCES)('$path states no platform limit', ({ source }) => {
    expect(LIMIT_NUMBERS.length).toBeGreaterThan(5);
    for (const value of LIMIT_NUMBERS) {
      expect(source.includes(String(value)), String(value)).toBe(false);
    }
  });

  it.each(PAGE_SOURCES)('$path writes no capability state', ({ source }) => {
    for (const word of CAPABILITY_STATE_WORDS) {
      expect(source.includes(`'${word}'`), word).toBe(false);
      expect(source.includes(`"${word}"`), word).toBe(false);
    }
  });

  it.each(PAGE_SOURCES)('$path links to no source it typed itself', ({ source }) => {
    expect(source).not.toMatch(/https?:\/\//);
  });

  it('reads its platform list from the generated cohort, not from a literal', () => {
    expect(PLATFORM_PAGES).toHaveLength(Object.keys(PUBLISHING_LIMITS).length);
    for (const page of PLATFORM_PAGES) {
      expect(PUBLISHING_LIMITS[page.provider]).toBeDefined();
    }
  });

  it('has a cohort platform with no connector record, which the page must survive', () => {
    const uncovered = PLATFORM_PAGES.filter(
      (page) => !CONNECTORS.some((connector) => connector.id === page.provider),
    );
    expect(uncovered.length).toBeGreaterThan(0);
  });
});

describe('C5 copy keeps its denials', () => {
  it('opens every platform page by saying nothing publishes', () => {
    expect(en['web.schedule.notice.body']).toContain('definition of done');
    expect(en['web.schedule.notice.body']).toContain('not describe a working scheduler');
    expect(en['web.schedule.notice.title']).toContain('yet');
  });

  it('says plainly that a missing adapter means no recorded numbers', () => {
    expect(en['web.schedule.limits.unavailable.body']).toContain('no adapter');
    expect(en['web.schedule.capabilities.unavailable.body']).toContain('no adapter');
  });

  it('keeps the capability framing that separates platform facts from build facts', () => {
    expect(en['web.schedule.capabilities.lede']).toContain('Not offered by the platform');
    expect(en['web.schedule.capabilities.lede']).toContain('Not built yet');
  });

  it('states on the use case pages that this is a design, not a running service', () => {
    expect(en['web.useCases.notice.body']).toContain('No connector is verified in production');
    expect(en['web.useCases.notice.body']).toContain('nothing on this page publishes');
  });

  it('ends every use case with what is actually built', () => {
    for (const page of USE_CASE_PAGES) {
      const today = en[page.todayKey];
      expect(typeof today, page.slug).toBe('string');
      expect(String(today), page.slug).toMatch(/not built|Nothing publishes|nowhere to go|cannot/);
    }
  });
});
