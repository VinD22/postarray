import { describe, expect, it } from 'vitest';

import {
  addBlackout,
  addWindow,
  draftIssues,
  emptyDraft,
  fromClock,
  isHourSelected,
  removeBlackoutAt,
  removeWindowAt,
  toClock,
  toInput,
  toggleHour,
} from './rule-draft';

describe('the weekly grid', () => {
  it('adds a single hour as a one hour window', () => {
    const windows = toggleHour([], 1, 9);
    expect(windows).toEqual([{ weekday: 1, startMinute: 540, endMinute: 540 }]);
    expect(isHourSelected(windows, 1, 9)).toBe(true);
    expect(isHourSelected(windows, 1, 10)).toBe(false);
    expect(isHourSelected(windows, 2, 9)).toBe(false);
  });

  it('merges adjacent hours into one window', () => {
    let windows = toggleHour([], 1, 9);
    windows = toggleHour(windows, 1, 10);
    windows = toggleHour(windows, 1, 11);
    expect(windows).toEqual([{ weekday: 1, startMinute: 540, endMinute: 660 }]);
  });

  it('splits a window when an hour in the middle is removed', () => {
    let windows = toggleHour([], 3, 9);
    windows = toggleHour(windows, 3, 10);
    windows = toggleHour(windows, 3, 11);
    windows = toggleHour(windows, 3, 10);
    expect(windows).toEqual([
      { weekday: 3, startMinute: 540, endMinute: 540 },
      { weekday: 3, startMinute: 660, endMinute: 660 },
    ]);
  });

  it('leaves other weekdays untouched', () => {
    let windows = toggleHour([], 1, 9);
    windows = toggleHour(windows, 5, 20);
    windows = toggleHour(windows, 1, 9);
    expect(windows).toEqual([{ weekday: 5, startMinute: 1200, endMinute: 1200 }]);
  });

  it('keeps windows in weekday then start order', () => {
    const windows = addWindow(addWindow([], { weekday: 5, startMinute: 600, endMinute: 660 }), {
      weekday: 1,
      startMinute: 900,
      endMinute: 960,
    });
    expect(windows.map((window) => window.weekday)).toEqual([1, 5]);
  });

  it('removes a window by position', () => {
    const windows = [
      { weekday: 1, startMinute: 540, endMinute: 600 },
      { weekday: 2, startMinute: 540, endMinute: 600 },
    ];
    expect(removeWindowAt(windows, 0)).toEqual([windows[1]]);
  });
});

describe('clock parsing', () => {
  it('round-trips a minute of the day', () => {
    expect(toClock(0)).toBe('00:00');
    expect(toClock(540)).toBe('09:00');
    expect(toClock(1439)).toBe('23:59');
    expect(fromClock('09:00')).toBe(540);
    expect(fromClock('23:59')).toBe(1439);
  });

  it('refuses a value that is not a wall clock', () => {
    expect(fromClock('9:00')).toBeNull();
    expect(fromClock('24:00')).toBeNull();
    expect(fromClock('09:60')).toBeNull();
    expect(fromClock('')).toBeNull();
  });
});

describe('blackouts', () => {
  it('keeps spans in date order and removes by position', () => {
    let spans = addBlackout([], { from: '2026-12-24', to: '2026-12-26' });
    spans = addBlackout(spans, { from: '2026-01-01', to: '2026-01-01' });
    expect(spans.map((span) => span.from)).toEqual(['2026-01-01', '2026-12-24']);
    expect(removeBlackoutAt(spans, 0).map((span) => span.from)).toEqual(['2026-12-24']);
  });
});

describe('draft issues', () => {
  it('names an unnamed rule and a rule with no window', () => {
    expect(draftIssues(emptyDraft('Europe/London'))).toEqual(['name_required', 'windows_required']);
  });

  it('accepts a zero daily maximum, which means zero rather than unlimited', () => {
    const draft = {
      ...emptyDraft('Europe/London'),
      name: 'Paused',
      windows: [{ weekday: 1, startMinute: 540, endMinute: 600 }],
      maximumPerDay: 0,
    };
    expect(draftIssues(draft)).toEqual([]);
    expect(toInput(draft, 'project_1').maximumPerDay).toBe(0);
  });

  it('carries a null daily maximum through as null, never as zero', () => {
    const draft = {
      ...emptyDraft('Europe/London'),
      name: 'Open',
      windows: [{ weekday: 1, startMinute: 540, endMinute: 600 }],
    };
    expect(toInput(draft, 'project_1').maximumPerDay).toBeNull();
  });

  it('trims the name it sends', () => {
    const draft = {
      ...emptyDraft('Europe/London'),
      name: '  Weekday mornings  ',
      windows: [{ weekday: 1, startMinute: 540, endMinute: 600 }],
    };
    expect(toInput(draft, 'project_1').name).toBe('Weekday mornings');
  });
});
