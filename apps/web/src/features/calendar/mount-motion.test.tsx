/**
 * The calendar's mount-only flourishes.
 *
 * The whole risk with these two is that they stop being mount-only. This
 * surface re-renders on every filter change, every arrow key of a keyboard
 * move and every pointer move of a drag, and a today pulse that fired on any
 * of those would make the calendar feel broken rather than alive. So the
 * tests here are about the guards, and about the week and today still being
 * completely readable when neither animation runs at all.
 */

import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { en } from '@relay/i18n';
import { I18nProvider } from '@relay/i18n/react';

import {
  inlineTransformsIn,
  mockMotionPreference,
  restoreMotionPreference,
} from '@/components/motion/motion-test-media';

import { CalendarGrid } from './calendar-grid';
import { CalendarMonth } from './calendar-month';
import { computeRange } from './date-range';
import { TODAY_CELL_ATTRIBUTE, WEEK_CELL_ATTRIBUTE } from './mount-motion';
import type { CalendarEntry } from './types';

afterEach(restoreMotionPreference);

const BERLIN = 'Europe/Berlin';
const TODAY = new Date();

const entry: CalendarEntry = {
  publishJobId: 'job_01j000000000000000000001',
  contentItemId: 'post_01j000000000000000000001',
  title: 'Scheduled first comments are live',
  scheduledAt: TODAY.toISOString(),
  timeZone: BERLIN,
  state: 'scheduled',
  approvalState: 'approved',
  provider: 'x',
  accountLabel: '@acme',
  targetCount: 1,
  mediaKind: 'image',
};

function renderWeek() {
  const range = computeRange('week', TODAY, BERLIN, 1);
  return render(
    <I18nProvider locale="en" catalog={en} timeZone={BERLIN}>
      <CalendarGrid
        range={range}
        entries={[entry]}
        timeZone={BERLIN}
        hrefForEntry={(item) => `/posts/${item.contentItemId}`}
        grabbedKey={null}
        onPickUp={() => undefined}
        label="This week"
      />
    </I18nProvider>,
  );
}

function renderMonth() {
  const range = computeRange('month', TODAY, BERLIN, 1);
  return render(
    <I18nProvider locale="en" catalog={en} timeZone={BERLIN}>
      <CalendarMonth
        range={range}
        entries={[entry]}
        timeZone={BERLIN}
        hrefForEntry={(item) => `/posts/${item.contentItemId}`}
        hrefForDay={() => '/calendar'}
        label="This month"
      />
    </I18nProvider>,
  );
}

describe('the week fill and the today pulse, with motion off', () => {
  it('renders the whole week already in place', () => {
    mockMotionPreference('reduce');
    const { container } = renderWeek();

    const cells = container.querySelectorAll(`[${WEEK_CELL_ATTRIBUTE}]`);
    expect(cells.length).toBe(7);
    // Nothing staggered, nothing offset: the finished week is the first frame.
    expect(inlineTransformsIn(container)).toEqual([]);
    for (const cell of cells) {
      expect(cell).toBeVisible();
    }
  });

  it('marks exactly one cell as today, in both views', () => {
    mockMotionPreference('reduce');
    const week = renderWeek();
    expect(week.container.querySelectorAll(`[${TODAY_CELL_ATTRIBUTE}]`)).toHaveLength(1);
    week.unmount();

    const month = renderMonth();
    expect(month.container.querySelectorAll(`[${TODAY_CELL_ATTRIBUTE}]`)).toHaveLength(1);
  });

  it('leaves the month grid unmoved as well', () => {
    mockMotionPreference('reduce');
    const { container } = renderMonth();
    expect(inlineTransformsIn(container)).toEqual([]);
  });
});

describe('the target slot preview', () => {
  it('fills the hovered cell only while a pointer is carrying a post', () => {
    mockMotionPreference('no-preference');
    const range = computeRange('week', TODAY, BERLIN, 1);
    const proposal = {
      entry,
      fromInstant: entry.scheduledAt,
      toInstant: entry.scheduledAt,
      keepsLocalTime: true,
    };

    const withoutDrag = render(
      <I18nProvider locale="en" catalog={en} timeZone={BERLIN}>
        <CalendarGrid
          range={range}
          entries={[entry]}
          timeZone={BERLIN}
          hrefForEntry={(item) => `/posts/${item.contentItemId}`}
          grabbedKey={null}
          onPickUp={() => undefined}
          proposal={proposal}
          draggingKey={null}
          label="This week"
        />
      </I18nProvider>,
    );
    // A keyboard move keeps the dashed outline and nothing more, so a step
    // through slots snaps instead of repainting a fill.
    expect(withoutDrag.container.querySelector('[data-drop-instant].bg-accent-subtle')).toBeNull();
    expect(withoutDrag.container.querySelector('.outline-dashed')).not.toBeNull();
    withoutDrag.unmount();

    const withDrag = render(
      <I18nProvider locale="en" catalog={en} timeZone={BERLIN}>
        <CalendarGrid
          range={range}
          entries={[entry]}
          timeZone={BERLIN}
          hrefForEntry={(item) => `/posts/${item.contentItemId}`}
          grabbedKey={null}
          onPickUp={() => undefined}
          proposal={proposal}
          draggingKey="dragging-something"
          label="This week"
        />
      </I18nProvider>,
    );
    expect(withDrag.container.querySelector('[data-drop-instant].bg-accent-subtle')).not.toBeNull();
  });
});
