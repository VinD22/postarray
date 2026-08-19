import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n';

import { PUBLISHING_LIMITS } from '@/features/marketing/data/publishing-limits';
import type { ProviderLimits } from '@/features/marketing/data/publishing-limits-types';
import {
  MARKETING_ROUTES,
  specsConstraintPath,
  specsPlatformPath,
} from '@/features/marketing/site';
import { PLATFORM_PAGES } from '@/features/platforms/registry';
import type { LimitValue } from '@/features/platforms/view-model';

import { SPEC_CONSTRAINTS, SPEC_CONSTRAINT_SLUGS, type SpecConstraintSlug } from './constraints';
import { SPEC_PAIRS, SPEC_PLATFORMS, findSpecEntry, findSpecPlatform } from './registry';

/**
 * The guard the whole `/specs` cluster exists behind.
 *
 * The cluster's one promise is that a page states a limit only where the
 * generated dataset actually carries one. That promise is worth nothing if it
 * is checked by reading the same resolvers that build the pages, so the
 * expectation below is derived a second time, straight off `PUBLISHING_LIMITS`,
 * field by field and by hand. If a resolver starts inventing a page, the two
 * derivations disagree and this file fails and names the pair.
 *
 * The second half is the same structural check the `/schedule` pages carry:
 * the route files must contain no platform name, no ceiling and no source URL
 * of their own, so the honesty survives an edit by somebody who never read
 * this comment.
 */

/** The pairs that must exist, read directly from the dataset. */
function expectedPairs(): readonly string[] {
  const pairs: string[] = [];

  for (const page of PLATFORM_PAGES) {
    const limits: ProviderLimits = PUBLISHING_LIMITS[page.provider];
    if (!limits.adapterPresent) {
      continue;
    }
    const media = limits.media;
    const add = (constraint: SpecConstraintSlug): void => {
      pairs.push(`${page.slug}/${constraint}`);
    };

    if (limits.text !== null) {
      add('character-limit');
    }
    if (limits.maxTitleLength !== null) {
      add('title-limit');
    }
    if (media !== null && media.maxImageBytes !== null) {
      add('image-size');
    }
    if (media !== null && media.maxVideoBytes !== null) {
      add('video-size');
    }
    if (media !== null && media.maxDurationSeconds !== null) {
      add('video-length');
    }
    if (media !== null && media.maxImages > 0) {
      add('image-count');
    }
    if (media !== null && media.maxAltTextLength !== null) {
      add('alt-text-limit');
    }
    if (media !== null && media.allowedMimeTypes.length > 0) {
      add('file-types');
    }
  }

  return pairs;
}

const GENERATED_PAIRS = SPEC_PAIRS.map((pair) => `${pair.platform}/${pair.constraint}`);

describe('the specs cluster claims exactly what the dataset carries', () => {
  it('generates a page for every recorded value and for nothing else', () => {
    expect([...GENERATED_PAIRS].sort()).toEqual([...expectedPairs()].sort());
  });

  it('generates enough pages to be worth having, and no duplicates', () => {
    expect(GENERATED_PAIRS.length).toBeGreaterThan(40);
    expect(new Set(GENERATED_PAIRS).size).toBe(GENERATED_PAIRS.length);
  });

  it('never states a value the dataset does not have', () => {
    for (const platform of SPEC_PLATFORMS) {
      const limits = PUBLISHING_LIMITS[platform.provider];
      for (const entry of platform.entries) {
        const label = `${platform.slug}/${entry.constraint.slug}`;
        expect(assertMatchesDataset(entry.constraint.slug, entry.value, limits), label).toBe(true);
      }
    }
  });

  it('never renders a zero as if it were a recorded limit', () => {
    for (const platform of SPEC_PLATFORMS) {
      for (const entry of platform.entries) {
        const label = `${platform.slug}/${entry.constraint.slug}`;
        if (entry.value.kind === 'files' || entry.value.kind === 'characters') {
          expect(entry.value.count, label).toBeGreaterThan(0);
        }
        if (entry.value.kind === 'bytes') {
          expect(entry.value.bytes, label).toBeGreaterThan(0);
        }
        if (entry.value.kind === 'seconds') {
          expect(entry.value.max, label).toBeGreaterThan(0);
        }
        if (entry.value.kind === 'list') {
          expect(entry.value.items.length, label).toBeGreaterThan(0);
        }
        expect(entry.value.kind, label).not.toBe('unavailable');
      }
    }
  });

  it('publishes no page for a platform this build ships no adapter for', () => {
    const withoutAdapter = PLATFORM_PAGES.filter(
      (page) => !PUBLISHING_LIMITS[page.provider].adapterPresent,
    );

    expect(withoutAdapter.length).toBeGreaterThan(0);
    for (const page of withoutAdapter) {
      expect(findSpecPlatform(page.slug), page.slug).toBeUndefined();
      expect(
        SPEC_PAIRS.some((pair) => pair.platform === page.slug),
        page.slug,
      ).toBe(false);
    }
  });

  it('answers no route for a pair the dataset has no value for', () => {
    const expected = new Set(expectedPairs());
    for (const page of PLATFORM_PAGES) {
      for (const constraint of SPEC_CONSTRAINT_SLUGS) {
        if (expected.has(`${page.slug}/${constraint}`)) {
          continue;
        }
        expect(findSpecEntry(page.slug, constraint), `${page.slug}/${constraint}`).toBeUndefined();
      }
    }
  });

  it('gives every page a dated official source to stand on', () => {
    for (const platform of SPEC_PLATFORMS) {
      expect(platform.source, platform.slug).not.toBeNull();
      expect(platform.source?.url, platform.slug).toMatch(/^https:\/\//);
      expect(platform.source?.readOn, platform.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('carries copy for every constraint it can publish', () => {
    expect(SPEC_CONSTRAINTS.map((constraint) => constraint.slug)).toEqual([
      ...SPEC_CONSTRAINT_SLUGS,
    ]);
    for (const constraint of SPEC_CONSTRAINTS) {
      for (const key of [
        constraint.nameKey,
        constraint.titleKey,
        constraint.ledeKey,
        constraint.descriptionKey,
      ]) {
        expect(en[key], key).toBeTypeOf('string');
      }
      expect(String(en[constraint.titleKey]), constraint.slug).toContain('{platform}');
      expect(String(en[constraint.nameKey]), constraint.slug).not.toContain('{platform}');
    }
  });

  it('puts every generated page in the sitemap', () => {
    const routes = new Set(MARKETING_ROUTES);
    for (const platform of SPEC_PLATFORMS) {
      expect(routes.has(specsPlatformPath(platform.slug)), platform.slug).toBe(true);
      for (const entry of platform.entries) {
        const path = specsConstraintPath(platform.slug, entry.constraint.slug);
        expect(routes.has(path), path).toBe(true);
      }
    }
  });
});

/** Re-read the raw field this value claims to report, and compare it. */
function assertMatchesDataset(
  slug: SpecConstraintSlug,
  value: LimitValue,
  limits: ProviderLimits,
): boolean {
  const media = limits.media;
  switch (slug) {
    case 'character-limit':
      return value.kind === 'characters' && value.count === limits.text?.maxLength;
    case 'title-limit':
      return value.kind === 'characters' && value.count === limits.maxTitleLength;
    case 'image-size':
      return value.kind === 'bytes' && value.bytes === media?.maxImageBytes;
    case 'video-size':
      return value.kind === 'bytes' && value.bytes === media?.maxVideoBytes;
    case 'video-length':
      return (
        value.kind === 'seconds' &&
        value.max === media?.maxDurationSeconds &&
        value.min === (media?.minDurationSeconds ?? null)
      );
    case 'image-count':
      return value.kind === 'files' && value.count === media?.maxImages;
    case 'alt-text-limit':
      return value.kind === 'characters' && value.count === media?.maxAltTextLength;
    case 'file-types':
      return (
        value.kind === 'list' &&
        media !== null &&
        value.items.join('|') === media.allowedMimeTypes.join('|')
      );
  }
}

const PAGE_SOURCES = [
  '../../app/[locale]/(marketing)/specs/page.tsx',
  '../../app/[locale]/(marketing)/specs/[platform]/page.tsx',
  '../../app/[locale]/(marketing)/specs/[platform]/[constraint]/page.tsx',
].map((relative) => ({
  path: relative,
  source: readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8'),
}));

/** Display names long enough that a substring search means something. */
const PLATFORM_NAMES: readonly string[] = PLATFORM_PAGES.map((page) =>
  String(en[page.nameKey]),
).filter((name) => name.length > 2);

const LIMIT_NUMBERS = [
  ...new Set(
    Object.values(PUBLISHING_LIMITS).flatMap((limits) =>
      [
        limits.maxTitleLength,
        limits.text?.maxLength,
        limits.media?.maxImageBytes,
        limits.media?.maxVideoBytes,
        limits.media?.maxDurationSeconds,
        limits.media?.maxAltTextLength,
      ].filter((value): value is number => typeof value === 'number' && value >= 100),
    ),
  ),
];

describe('the specs route files hold no claim of their own', () => {
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

  it.each(PAGE_SOURCES)('$path links to no source it typed itself', ({ source }) => {
    expect(source).not.toMatch(/https?:\/\//);
  });
});
