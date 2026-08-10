import { describe, expect, it } from 'vitest';

import { PUBLISHING_LIMIT_PROVIDERS } from '@/features/marketing/data/publishing-limits';

import { PLATFORM_PAGES, PLATFORM_SLUGS, findPlatformPage, platformSlug } from './registry';
import { buildPlatformViewModel } from './view-model';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('platform page registry', () => {
  it('covers the launch cohort exactly, in cohort order', () => {
    expect(PLATFORM_PAGES.map((page) => page.provider)).toEqual([...PUBLISHING_LIMIT_PROVIDERS]);
  });

  it('gives every platform a unique, URL safe slug that resolves back', () => {
    expect(new Set(PLATFORM_SLUGS).size).toBe(PLATFORM_SLUGS.length);
    for (const page of PLATFORM_PAGES) {
      expect(page.slug).toMatch(/^[a-z0-9-]+$/);
      expect(findPlatformPage(page.slug)?.provider).toBe(page.provider);
    }
    expect(platformSlug('google_business_profile')).toBe('google-business-profile');
  });

  it('names every platform through the shared provider catalog', () => {
    for (const page of PLATFORM_PAGES) {
      expect(page.nameKey).toBe(`web.provider.${page.provider}`);
    }
  });
});

describe('platform view model', () => {
  const models = PLATFORM_PAGES.map((page) => ({ page, model: buildPlatformViewModel(page) }));

  it('never reports a capability as supported', () => {
    for (const { page, model } of models) {
      for (const row of model.capabilities ?? []) {
        expect(row.state, `${page.slug}:${row.column}`).not.toBe('supported');
      }
    }
  });

  it('carries a dated official source for every limit set it shows', () => {
    for (const { page, model } of models) {
      if (model.limitRows === null) {
        continue;
      }
      expect(model.limitSource, page.slug).not.toBeNull();
      expect(model.limitSource?.url, page.slug).toMatch(/^https:\/\//);
      expect(model.limitSource?.readOn, page.slug).toMatch(ISO_DATE);
    }
  });

  it('dates every capability citation it shows', () => {
    for (const { page, model } of models) {
      for (const row of model.capabilities ?? []) {
        if (row.citation === undefined) {
          continue;
        }
        expect(row.citation.url, `${page.slug}:${row.column}`).toMatch(/^https:\/\//);
        expect(row.citation.readOn, `${page.slug}:${row.column}`).toMatch(ISO_DATE);
      }
    }
  });

  it('dates both connector sources wherever it states a platform requirement', () => {
    for (const { page, model } of models) {
      if (model.requirements === null) {
        expect(model.apiSource, page.slug).toBeNull();
        expect(model.policySource, page.slug).toBeNull();
        continue;
      }
      expect(model.requirements).toHaveLength(3);
      expect(model.apiSource?.readOn, page.slug).toMatch(ISO_DATE);
      expect(model.policySource?.readOn, page.slug).toMatch(ISO_DATE);
    }
  });

  /**
   * The rule that matters most on these pages. A platform with no adapter in
   * this build has no recorded ceilings, and the honest render of that is
   * unavailable. A zero would read as "this platform allows none", which is a
   * different and false statement.
   */
  it('renders an absent adapter as unavailable and never as a number', () => {
    const withoutAdapter = models.filter(({ model }) => !model.adapterPresent);
    expect(withoutAdapter.length).toBeGreaterThan(0);

    for (const { page, model } of withoutAdapter) {
      expect(model.limitRows, page.slug).toBeNull();
      expect(model.limitSource, page.slug).toBeNull();
      expect(model.capabilities, page.slug).toBeNull();
      expect(model.requirements, page.slug).toBeNull();
    }
  });

  it('marks a missing limit unavailable rather than emitting a zero value', () => {
    for (const { page, model } of models) {
      for (const row of model.limitRows ?? []) {
        if (row.value.kind === 'characters' || row.value.kind === 'bytes') {
          const size = row.value.kind === 'characters' ? row.value.count : row.value.bytes;
          expect(size, `${page.slug}:${row.id}`).toBeGreaterThan(0);
        }
        if (row.value.kind === 'list') {
          expect(row.value.items.length, `${page.slug}:${row.id}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('states how characters and links are counted wherever a ceiling is shown', () => {
    for (const { page, model } of models) {
      if (model.limitRows === null) {
        continue;
      }
      const byId = new Map(model.limitRows.map((row) => [row.id, row]));
      expect(byId.get('text')?.value.kind, page.slug).toBe('characters');
      expect(byId.get('countingUnit')?.value.kind, page.slug).toBe('message');
      expect(byId.get('links')?.value.kind, page.slug).toBe('message');
    }
  });
});
