/**
 * The month grid's shape.
 *
 * `computeRange` pads a month out to whole weeks, so a third of the first row
 * and most of the last can belong to the months either side. Those days are
 * real and droppable, so they are rendered — but a grid whose edges look
 * exactly like its middle is a grid you have to count your way around, and
 * that is a defect you only ever notice by looking. These tests are the part
 * of it that can be checked without looking.
 *
 * The dense-day rules are here for the same reason: three chips and a link is
 * a promise about a cell that never scrolls, and a regression to "show them
 * all" would only show up on the one day of the month that has four posts.
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n';
import { I18nProvider } from '@relay/i18n/react';

import { CalendarMonth } from './calendar-month';
import { computeRange, toWallClock } from './date-range';
import { TODAY_CELL_ATTRIBUTE } from './mount-motion';
import type { CalendarEntry } from './types';

const BERLIN = 'Europe/Berlin';
/** August 2026 starts on a Saturday, so a Monday-first grid opens in July. */
const ANCHOR = new Date('2026-08-15T12:00:00.000Z');

function entry(overrides: Partial<CalendarEntry> = {}): CalendarEntry {
  return {
    publishJobId: 'job_01j000000000000000000001',
    contentItemId: 'post_01j000000000000000000001',
    title: 'Scheduled first comments are live',
    scheduledAt: '2026-08-12T07:30:00.000Z',
    timeZone: BERLIN,
    state: 'scheduled',
    approvalState: 'approved',
    provider: 'x',
    accountLabel: '@acme',
    targetCount: 1,
    mediaKind: 'image',
    ...overrides,
  };
}

function renderMonth(entries: readonly CalendarEntry[] = []) {
  const range = computeRange('month', ANCHOR, BERLIN, 1);
  return {
    range,
    ...render(
      <I18nProvider locale="en" catalog={en} timeZone={BERLIN}>
        <CalendarMonth
          range={range}
          entries={entries}
          timeZone={BERLIN}
          hrefForEntry={(item) => `/posts/${item.contentItemId}`}
          hrefForDay={(day) => `/calendar?day=${day.toISOString()}`}
          label="August 2026"
        />
      </I18nProvider>,
    ),
  };
}

function cells(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('[data-drop-granularity="day"]'));
}

describe('the padding weeks either side of the month', () => {
  it('sits on the sunken ground while the month itself sits on the canvas', () => {
    const { container, range } = renderMonth();
    const rendered = cells(container);
    expect(rendered).toHaveLength(range.days.length);

    for (const [index, cell] of rendered.entries()) {
      const day = range.days[index];
      expect(day).toBeDefined();
      const outside = toWallClock(day as Date, BERLIN).month !== 8;
      expect(cell.className.includes('bg-surface-sunken'), `day ${index}`).toBe(outside);
    }
  });

  it('quietens the date on a day that belongs to another month, except today', () => {
    const { container, range } = renderMonth();
    const links = Array.from(container.querySelectorAll<HTMLElement>('a[aria-label]'));

    for (const [index, link] of links.entries()) {
      const day = range.days[index];
      expect(day).toBeDefined();

      // Today wears the filled pill wherever it falls, including in the padding
      // weeks, so it is deliberately not muted. This assertion used to ignore
      // that and passed for most of the year by luck: it only fails on the days
      // when the real clock lands inside this fixed August 2026 grid's padding,
      // which is Jul 27 to 31 and Sep 1 to 6. It first went red on 2 September.
      if (link.hasAttribute(TODAY_CELL_ATTRIBUTE)) {
        expect(link.className.includes('bg-cta'), `day ${index} is today`).toBe(true);
        continue;
      }

      const outside = toWallClock(day as Date, BERLIN).month !== 8;
      expect(link.className.includes('text-text-tertiary'), `day ${index}`).toBe(outside);
    }
  });

  it('still advertises every padding day as a drop target', () => {
    const { container, range } = renderMonth();
    const instants = cells(container).map((cell) => cell.getAttribute('data-drop-instant'));
    expect(instants).toEqual(range.days.map((day) => day.toISOString()));
  });
});

describe('a dense day', () => {
  const day = '2026-08-12T07:30:00.000Z';
  const many = ['a', 'b', 'c', 'd', 'e'].map((suffix) =>
    entry({
      contentItemId: `post_${suffix}`,
      publishJobId: `job_${suffix}`,
      scheduledAt: day,
      title: `Post ${suffix}`,
    }),
  );

  it('shows three and links the rest into the day, never a scrolling cell', () => {
    const { container } = renderMonth(many);

    expect(container.querySelectorAll('article')).toHaveLength(3);
    // The overflow is a link into the day view. A cell that scrolled would
    // hide work, which is the failure this surface exists to prevent.
    const overflow = Array.from(container.querySelectorAll('a')).filter((link) =>
      link.textContent?.includes('2'),
    );
    expect(overflow.length).toBeGreaterThan(0);
    for (const cell of cells(container)) {
      expect(cell.className).not.toContain('overflow-y-auto');
    }
  });
});
