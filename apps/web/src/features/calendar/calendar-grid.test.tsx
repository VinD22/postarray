/**
 * The time grid's drop cells.
 *
 * A month cell promises the date and nothing else. A time grid cell promises
 * the hour as well, so the instant it advertises has to be that band on that
 * column's day, in the display zone. Getting it wrong would move a post by a
 * whole day and only show up in a browser.
 */

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n';
import { I18nProvider } from '@relay/i18n/react';

import { CalendarGrid } from './calendar-grid';
import { computeRange, toWallClock } from './date-range';
import { dropInstant } from './reschedule';
import type { CalendarEntry } from './types';

const BERLIN = 'Europe/Berlin';
const SCHEDULED_AT = '2026-08-06T07:30:00.000Z';

const entry: CalendarEntry = {
  publishJobId: 'job_01j000000000000000000001',
  contentItemId: 'post_01j000000000000000000001',
  title: 'Scheduled first comments are live',
  scheduledAt: SCHEDULED_AT,
  timeZone: BERLIN,
  state: 'scheduled',
  approvalState: 'approved',
  provider: 'x',
  accountLabel: '@acme',
  targetCount: 1,
  mediaKind: 'image',
};

function renderGrid() {
  const range = computeRange('week', new Date(SCHEDULED_AT), BERLIN, 1);
  return render(
    <I18nProvider locale="en" catalog={en} timeZone={BERLIN}>
      <CalendarGrid
        range={range}
        entries={[entry]}
        timeZone={BERLIN}
        hrefForEntry={(item) => `/posts/${item.contentItemId}`}
        grabbedKey={null}
        onPickUp={() => undefined}
        label="Week of 3 August 2026"
      />
    </I18nProvider>,
  );
}

describe('CalendarGrid drop cells', () => {
  it('advertises every hour band as a slot cell at that wall clock hour', () => {
    const { container } = renderGrid();
    const cells = Array.from(container.querySelectorAll('[data-drop-instant]'));
    expect(cells.length).toBeGreaterThan(0);

    for (const cell of cells) {
      expect(cell.getAttribute('data-drop-granularity')).toBe('slot');
      const wall = toWallClock(new Date(cell.getAttribute('data-drop-instant') ?? ''), BERLIN);
      expect(wall.minute).toBe(0);
    }
  });

  it('lands a drop on the hour of the cell and the minute of the post', () => {
    const { container } = renderGrid();
    const cell = container.querySelector('[data-drop-instant]');
    const instant = new Date(cell?.getAttribute('data-drop-instant') ?? '');

    const landed = toWallClock(
      dropInstant(entry, { instant, granularity: 'slot' }, BERLIN),
      BERLIN,
    );
    expect(landed.hour).toBe(toWallClock(instant, BERLIN).hour);
    expect(landed.minute).toBe(30);
  });
});
