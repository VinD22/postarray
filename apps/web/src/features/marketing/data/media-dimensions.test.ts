import { PROVIDER_IDS } from '@relay/contracts';
import { en } from '@relay/i18n';
import { describe, expect, it } from 'vitest';

import {
  DIMENSION_BASES,
  DIMENSION_VARIANTS,
  MEDIA_DIMENSIONS,
  MEDIA_DIMENSION_PLATFORMS,
  MEDIA_DIMENSION_STALE_AFTER_DAYS,
  MEDIA_SURFACES,
  basisLabelKey,
  daysSince,
  dimensionsForPlatform,
  formatPixels,
  staleDimensionRows,
  variantLabelKey,
} from './media-dimensions';

/**
 * The honesty contract for the one dataset in this folder that a person types
 * by hand.
 *
 * `publishing-limits.ts` is generated, so its numbers cannot be invented
 * without changing connector code that has its own tests. This file has no
 * such protection, which is exactly why the assertions below are stricter than
 * the ones next door: an unsourced pixel size on a page that presents itself as
 * a reference is the failure this repository's rules exist to prevent.
 */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('media dimensions dataset', () => {
  it('carries at least one row, and identifies each one uniquely', () => {
    expect(MEDIA_DIMENSIONS.length).toBeGreaterThan(0);

    const ids = MEDIA_DIMENSIONS.map((row) => `${row.platform}/${row.variant}`);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every row a source URL and a date a person read it', () => {
    for (const row of MEDIA_DIMENSIONS) {
      const label = `${row.platform}/${row.variant}`;

      expect(row.source.url, label).toMatch(/^https:\/\//);
      expect(row.source.title.trim().length, label).toBeGreaterThan(0);
      expect(row.source.readOn, label).toMatch(ISO_DATE);
      expect(Number.isNaN(Date.parse(row.source.readOn)), label).toBe(false);
    }
  });

  it('never reads a source in the future', () => {
    const now = new Date();
    for (const row of MEDIA_DIMENSIONS) {
      expect(daysSince(row.source.readOn, now), `${row.platform}/${row.variant}`).toBeGreaterThan(
        -1,
      );
    }
  });

  /**
   * The drift alarm. It is a failure rather than a console warning on purpose:
   * a silent staleness check is a staleness check nobody runs. When this goes
   * red, reopen each listed page, confirm or correct the numbers, and move
   * `readOn` forward. Do not move the date without reopening the page.
   */
  it('has no row whose reading is older than the staleness window', () => {
    const stale = staleDimensionRows(new Date());
    const report = stale.map((row) => `${row.platform}/${row.variant} read ${row.source.readOn}`);

    expect(
      report,
      `these rows have not been reverified in ${MEDIA_DIMENSION_STALE_AFTER_DAYS} days`,
    ).toEqual([]);
  });

  /**
   * Proof that the alarm above can actually go off.
   *
   * The test before this one asserts against today's dataset, so while every
   * row is fresh it passes whether or not the staleness check works at all. A
   * broken `daysSince` would keep it green forever. This one moves the clock
   * instead of the data: one day past the window every row must be reported,
   * and inside the window none may be.
   */
  it('reports every row once the clock passes the staleness window', () => {
    const newest = MEDIA_DIMENSIONS.map((row) => Date.parse(`${row.source.readOn}T00:00:00Z`)).sort(
      (left, right) => right - left,
    )[0];
    expect(newest).toBeDefined();

    const day = 86_400_000;
    const justPast = new Date((newest ?? 0) + (MEDIA_DIMENSION_STALE_AFTER_DAYS + 1) * day);
    expect(staleDimensionRows(justPast).length).toBe(MEDIA_DIMENSIONS.length);

    const stillFresh = new Date((newest ?? 0) + MEDIA_DIMENSION_STALE_AFTER_DAYS * day);
    expect(staleDimensionRows(stillFresh)).toEqual([]);
  });

  it('counts whole days from the read date', () => {
    expect(daysSince('2026-01-01', new Date('2026-01-01T00:00:00Z'))).toBe(0);
    expect(daysSince('2026-01-01', new Date('2026-01-02T23:59:59Z'))).toBe(1);
    expect(daysSince('2026-01-10', new Date('2026-01-01T00:00:00Z'))).toBe(-9);
  });

  it('states positive pixel dimensions and a known basis, surface and variant', () => {
    for (const row of MEDIA_DIMENSIONS) {
      const label = `${row.platform}/${row.variant}`;

      expect(Number.isInteger(row.width) && row.width > 0, label).toBe(true);
      expect(Number.isInteger(row.height) && row.height > 0, label).toBe(true);
      expect(MEDIA_SURFACES, label).toContain(row.surface);
      expect(DIMENSION_VARIANTS, label).toContain(row.variant);
      expect(DIMENSION_BASES, label).toContain(row.basis);
      expect(PROVIDER_IDS, label).toContain(row.platform);
    }
  });

  it('leaves an unstated aspect ratio null rather than computing one', () => {
    for (const row of MEDIA_DIMENSIONS) {
      if (row.aspectRatio !== null) {
        expect(row.aspectRatio.trim().length, `${row.platform}/${row.variant}`).toBeGreaterThan(0);
      }
    }
  });

  it('names every variant, basis and platform through the catalog', () => {
    for (const row of MEDIA_DIMENSIONS) {
      const label = `${row.platform}/${row.variant}`;
      expect(en[variantLabelKey(row.variant)], label).toBeTypeOf('string');
      expect(en[basisLabelKey(row.basis)], label).toBeTypeOf('string');
      expect(en[`web.provider.${row.platform}` as keyof typeof en], label).toBeTypeOf('string');
    }
  });

  it('groups rows by platform without losing any', () => {
    const regrouped = MEDIA_DIMENSION_PLATFORMS.flatMap((platform) =>
      dimensionsForPlatform(platform),
    );
    expect(regrouped.length).toBe(MEDIA_DIMENSIONS.length);
    expect(new Set(MEDIA_DIMENSION_PLATFORMS).size).toBe(MEDIA_DIMENSION_PLATFORMS.length);
  });

  it('formats pixels the same way everywhere', () => {
    const first = MEDIA_DIMENSIONS[0];
    expect(first).toBeDefined();
    if (first) {
      expect(formatPixels(first)).toBe(
        `${first.width.toLocaleString('en-US')} x ${first.height.toLocaleString('en-US')}`,
      );
    }
  });
});
