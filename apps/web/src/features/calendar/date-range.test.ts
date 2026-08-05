import { describe, expect, it } from 'vitest';

import {
  addDays,
  addMonths,
  calendarDayDelta,
  computeRange,
  dayFraction,
  fromWallClock,
  isSameDay,
  shiftSchedule,
  startOfWeek,
  stepAnchor,
  toWallClock,
} from './date-range';

const BERLIN = 'Europe/Berlin';
const CHATHAM = 'Pacific/Chatham';

describe('wall clock conversion', () => {
  it('reads an instant in the requested zone, not the machine zone', () => {
    const instant = new Date('2026-08-06T07:30:00.000Z');
    expect(toWallClock(instant, BERLIN)).toEqual({
      year: 2026,
      month: 8,
      day: 6,
      hour: 9,
      minute: 30,
    });
    expect(toWallClock(instant, 'UTC').hour).toBe(7);
  });

  it('renders midnight as hour zero rather than twenty four', () => {
    const midnight = new Date('2026-08-05T22:00:00.000Z');
    expect(toWallClock(midnight, BERLIN).hour).toBe(0);
    expect(toWallClock(midnight, BERLIN).day).toBe(6);
  });

  it('round trips through a zone with a 45 minute offset', () => {
    const wall = { year: 2026, month: 3, day: 2, hour: 9, minute: 30 };
    const instant = fromWallClock(wall, CHATHAM);
    expect(toWallClock(instant, CHATHAM)).toEqual(wall);
  });
});

describe('daylight saving transitions', () => {
  it('keeps the local hour when adding days across the autumn change', () => {
    // 25 October 2026 is the European autumn transition.
    const before = fromWallClock({ year: 2026, month: 10, day: 24, hour: 9, minute: 30 }, BERLIN);
    const after = addDays(before, 1, BERLIN);
    expect(toWallClock(after, BERLIN)).toEqual({
      year: 2026,
      month: 10,
      day: 25,
      hour: 9,
      minute: 30,
    });
    // The wall clock is identical but the instants are 25 hours apart.
    expect(after.getTime() - before.getTime()).toBe(25 * 3_600_000);
  });

  it('lands on a real instant when the requested local time does not exist', () => {
    // 29 March 2026, 02:30 Europe/Berlin is inside the spring forward gap.
    const inGap = fromWallClock({ year: 2026, month: 3, day: 29, hour: 2, minute: 30 }, BERLIN);
    const readBack = toWallClock(inGap, BERLIN);
    expect(readBack.day).toBe(29);
    // The gap pushes the reading to 03:30 local, which is a real time.
    expect(readBack.hour).toBe(3);
    expect(readBack.minute).toBe(30);
  });

  it('shifts by exact minutes without preserving the wall clock', () => {
    const before = fromWallClock({ year: 2026, month: 10, day: 25, hour: 2, minute: 30 }, BERLIN);
    const later = shiftSchedule(before, BERLIN, { minutes: 60 });
    expect(later.getTime() - before.getTime()).toBe(3_600_000);
  });
});

describe('month arithmetic', () => {
  it('clamps the day of month rather than rolling into the next month', () => {
    const jan31 = fromWallClock({ year: 2026, month: 1, day: 31, hour: 12, minute: 0 }, BERLIN);
    expect(toWallClock(addMonths(jan31, 1, BERLIN), BERLIN)).toMatchObject({
      month: 2,
      day: 28,
    });
  });

  it('steps backwards across a year boundary', () => {
    const jan = fromWallClock({ year: 2026, month: 1, day: 15, hour: 12, minute: 0 }, BERLIN);
    expect(toWallClock(addMonths(jan, -1, BERLIN), BERLIN)).toMatchObject({
      year: 2025,
      month: 12,
      day: 15,
    });
  });
});

describe('week start', () => {
  it('honours a Monday start locale', () => {
    const wednesday = fromWallClock({ year: 2026, month: 8, day: 5, hour: 15, minute: 0 }, BERLIN);
    expect(toWallClock(startOfWeek(wednesday, BERLIN, 1), BERLIN)).toMatchObject({
      day: 3,
      hour: 0,
      minute: 0,
    });
  });

  it('honours a Sunday start locale', () => {
    const wednesday = fromWallClock({ year: 2026, month: 8, day: 5, hour: 15, minute: 0 }, BERLIN);
    expect(toWallClock(startOfWeek(wednesday, BERLIN, 0), BERLIN)).toMatchObject({ day: 2 });
  });
});

describe('computeRange', () => {
  const anchor = new Date('2026-08-05T12:00:00.000Z');

  it('gives one day for the day view', () => {
    const range = computeRange('day', anchor, BERLIN, 1);
    expect(range.days).toHaveLength(1);
    expect(range.end.getTime() - range.start.getTime()).toBe(86_400_000);
  });

  it('gives seven days for the week view', () => {
    const range = computeRange('week', anchor, BERLIN, 1);
    expect(range.days).toHaveLength(7);
    expect(toWallClock(range.days[0] as Date, BERLIN).day).toBe(3);
  });

  it('gives whole weeks for the month view so the grid is rectangular', () => {
    const range = computeRange('month', anchor, BERLIN, 1);
    expect(range.days.length % 7).toBe(0);
    expect(range.days.length).toBeGreaterThanOrEqual(28);
    // The first cell is on or before the first of the month.
    expect(toWallClock(range.days[0] as Date, BERLIN).month).not.toBe(9);
  });

  it('uses the same window for the list view as for the week', () => {
    const week = computeRange('week', anchor, BERLIN, 1);
    const list = computeRange('list', anchor, BERLIN, 1);
    expect(list.start.toISOString()).toBe(week.start.toISOString());
    expect(list.end.toISOString()).toBe(week.end.toISOString());
  });
});

describe('stepAnchor', () => {
  const anchor = new Date('2026-08-05T12:00:00.000Z');

  it('steps a week at a time in the week view', () => {
    expect(calendarDayDelta(anchor, stepAnchor('week', anchor, 1, BERLIN), BERLIN)).toBe(7);
  });

  it('steps a month at a time in the month view', () => {
    expect(toWallClock(stepAnchor('month', anchor, -1, BERLIN), BERLIN).month).toBe(7);
  });
});

describe('placement helpers', () => {
  it('places 09:30 at the right fraction of the day', () => {
    const instant = fromWallClock({ year: 2026, month: 8, day: 6, hour: 9, minute: 30 }, BERLIN);
    expect(dayFraction(instant, BERLIN)).toBeCloseTo(570 / 1440, 6);
  });

  it('compares calendar days in the display zone, not in UTC', () => {
    // 23:30 in Berlin is 21:30 UTC, still the same Berlin day.
    const late = new Date('2026-08-06T21:30:00.000Z');
    const earlier = new Date('2026-08-06T07:00:00.000Z');
    expect(isSameDay(late, earlier, BERLIN)).toBe(true);
    // 00:30 Berlin on the 7th is 22:30 UTC on the 6th.
    const justAfterMidnight = new Date('2026-08-06T22:30:00.000Z');
    expect(isSameDay(justAfterMidnight, earlier, BERLIN)).toBe(false);
    expect(isSameDay(justAfterMidnight, earlier, 'UTC')).toBe(true);
  });
});
