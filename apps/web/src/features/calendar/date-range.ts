/**
 * Calendar arithmetic, done in an explicit IANA zone.
 *
 * Every function here takes the display zone as an argument. Nothing reads the
 * browser's zone, because a schedule drawn in the wrong zone is a publishing
 * incident rather than a cosmetic bug, and a workspace in Berlin viewed from a
 * laptop in Lisbon must show Berlin.
 *
 * The technique throughout: format an instant into its wall clock parts in the
 * target zone, do the arithmetic on those parts, then convert back by probing
 * the offset. Probing twice handles the hour that repeats or disappears at a
 * daylight saving transition, which naive `setHours` arithmetic gets wrong
 * exactly twice a year for exactly the posts people care most about.
 */

import { getTimeZoneOffsetMinutes } from '@relay/i18n';
import type { CalendarRange, CalendarView } from './types';

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

export interface WallClock {
  readonly year: number;
  /** 1 to 12. */
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
}

const PART_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

const partFormatters = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = partFormatters.get(timeZone);
  if (cached) return cached;
  const created = new Intl.DateTimeFormat('en-US-u-ca-gregory', {
    ...PART_FORMAT_OPTIONS,
    timeZone,
  });
  partFormatters.set(timeZone, created);
  return created;
}

function part(parts: readonly Intl.DateTimeFormatPart[], type: string): number {
  for (const entry of parts) {
    if (entry.type === type) return Number(entry.value);
  }
  return 0;
}

/** The wall clock reading of an instant in a zone. */
export function toWallClock(instant: Date, timeZone: string): WallClock {
  const parts = partsFormatter(timeZone).formatToParts(instant);
  return {
    year: part(parts, 'year'),
    month: part(parts, 'month'),
    day: part(parts, 'day'),
    // `hour12: false` renders midnight as 24 in some ICU versions.
    hour: part(parts, 'hour') % 24,
    minute: part(parts, 'minute'),
  };
}

/**
 * The instant at which a wall clock reading occurs in a zone.
 *
 * Two passes. The first guesses the offset from the naive UTC interpretation,
 * the second re-reads the offset at that guess. On a spring-forward gap the
 * result lands on the first valid instant after the gap, which is what a
 * scheduler should do rather than silently rejecting the time.
 */
export function fromWallClock(wall: WallClock, timeZone: string): Date {
  const naive = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, 0, 0);
  const firstGuess = new Date(naive - getTimeZoneOffsetMinutes(timeZone, naive) * MINUTE_MS);
  const secondOffset = getTimeZoneOffsetMinutes(timeZone, firstGuess);
  return new Date(naive - secondOffset * MINUTE_MS);
}

/** Midnight at the start of the calendar day an instant falls on, in a zone. */
export function startOfDay(instant: Date, timeZone: string): Date {
  const wall = toWallClock(instant, timeZone);
  return fromWallClock({ ...wall, hour: 0, minute: 0 }, timeZone);
}

/** Add whole calendar days, keeping the wall clock time where the zone allows. */
export function addDays(instant: Date, days: number, timeZone: string): Date {
  const wall = toWallClock(instant, timeZone);
  const shifted = new Date(Date.UTC(wall.year, wall.month - 1, wall.day + days));
  return fromWallClock(
    {
      year: shifted.getUTCFullYear(),
      month: shifted.getUTCMonth() + 1,
      day: shifted.getUTCDate(),
      hour: wall.hour,
      minute: wall.minute,
    },
    timeZone,
  );
}

/** Add whole calendar months, clamping the day of month. 31 Jan plus 1 is 28 Feb. */
export function addMonths(instant: Date, months: number, timeZone: string): Date {
  const wall = toWallClock(instant, timeZone);
  const targetMonthIndex = wall.month - 1 + months;
  const year = wall.year + Math.floor(targetMonthIndex / 12);
  const month = ((targetMonthIndex % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return fromWallClock(
    {
      year,
      month: month + 1,
      day: Math.min(wall.day, lastDay),
      hour: wall.hour,
      minute: wall.minute,
    },
    timeZone,
  );
}

/** Add exact minutes to an instant. Wall clock time may shift across a DST edge. */
export function addMinutes(instant: Date, minutes: number): Date {
  return new Date(instant.getTime() + minutes * MINUTE_MS);
}

/**
 * Move an instant by whole days while preserving the wall clock time, then by
 * exact minutes. This is what a keyboard reschedule does: `ArrowDown` is a slot
 * of minutes, `ArrowRight` is a calendar day at the same local hour.
 */
export function shiftSchedule(
  instant: Date,
  timeZone: string,
  step: { readonly days?: number; readonly minutes?: number },
): Date {
  const afterDays = step.days ? addDays(instant, step.days, timeZone) : instant;
  return step.minutes ? addMinutes(afterDays, step.minutes) : afterDays;
}

/** True when both instants fall on the same calendar day in the zone. */
export function isSameDay(a: Date, b: Date, timeZone: string): boolean {
  const left = toWallClock(a, timeZone);
  const right = toWallClock(b, timeZone);
  return left.year === right.year && left.month === right.month && left.day === right.day;
}

/**
 * The first day of the week containing `instant`.
 *
 * `weekStartsOn` is 0 for Sunday through 6 for Saturday and comes from the
 * locale descriptor, never from a constant, because Monday-start and
 * Sunday-start weeks are both correct depending on where the reader is.
 */
export function startOfWeek(instant: Date, timeZone: string, weekStartsOn: number): Date {
  const dayStart = startOfDay(instant, timeZone);
  const wall = toWallClock(dayStart, timeZone);
  const weekday = new Date(Date.UTC(wall.year, wall.month - 1, wall.day)).getUTCDay();
  const back = (weekday - weekStartsOn + 7) % 7;
  return back === 0 ? dayStart : startOfDay(addDays(dayStart, -back, timeZone), timeZone);
}

/** The first day of the month containing `instant`. */
export function startOfMonth(instant: Date, timeZone: string): Date {
  const wall = toWallClock(instant, timeZone);
  return fromWallClock({ ...wall, day: 1, hour: 0, minute: 0 }, timeZone);
}

function daysBetween(start: Date, end: Date, timeZone: string): Date[] {
  const days: Date[] = [];
  let cursor = start;
  // A guard rather than a while(true): a month grid is at most six weeks.
  for (let index = 0; index < 60 && cursor.getTime() < end.getTime(); index += 1) {
    days.push(cursor);
    cursor = startOfDay(addDays(cursor, 1, timeZone), timeZone);
  }
  return days;
}

/**
 * The visible window for a view.
 *
 * The month view returns whole weeks so the grid is rectangular, which is what
 * lets the month cells be a plain CSS grid with no placeholder rows.
 */
export function computeRange(
  view: CalendarView,
  anchor: Date,
  timeZone: string,
  weekStartsOn: number,
): CalendarRange {
  if (view === 'day') {
    const start = startOfDay(anchor, timeZone);
    const end = startOfDay(addDays(start, 1, timeZone), timeZone);
    return { start, end, days: [start] };
  }

  if (view === 'month') {
    const monthStart = startOfMonth(anchor, timeZone);
    const gridStart = startOfWeek(monthStart, timeZone, weekStartsOn);
    const nextMonth = startOfMonth(addMonths(monthStart, 1, timeZone), timeZone);
    const lastDay = startOfDay(addDays(nextMonth, -1, timeZone), timeZone);
    const afterGrid = startOfDay(
      addDays(startOfWeek(lastDay, timeZone, weekStartsOn), 7, timeZone),
      timeZone,
    );
    return { start: gridStart, end: afterGrid, days: daysBetween(gridStart, afterGrid, timeZone) };
  }

  // Week, and the list view, which shows the same window as a table.
  const start = startOfWeek(anchor, timeZone, weekStartsOn);
  const end = startOfDay(addDays(start, 7, timeZone), timeZone);
  return { start, end, days: daysBetween(start, end, timeZone) };
}

/** Step the anchor one whole period forward or back. */
export function stepAnchor(
  view: CalendarView,
  anchor: Date,
  direction: 1 | -1,
  timeZone: string,
): Date {
  if (view === 'month') return addMonths(anchor, direction, timeZone);
  if (view === 'day') return addDays(anchor, direction, timeZone);
  return addDays(anchor, direction * 7, timeZone);
}

/** True when the instant falls inside the half-open range. */
export function isWithin(range: CalendarRange, instant: Date): boolean {
  const time = instant.getTime();
  return time >= range.start.getTime() && time < range.end.getTime();
}

/**
 * Fractional position of an instant inside its day, 0 at midnight and 1 at the
 * next midnight. Used to place an entry in the week grid without a pixel
 * constant, so the grid rescales with the row height at any zoom level.
 */
export function dayFraction(instant: Date, timeZone: string): number {
  const wall = toWallClock(instant, timeZone);
  return (wall.hour * 60 + wall.minute) / 1440;
}

/** Whole days between two instants, measured on the calendar in the zone. */
export function calendarDayDelta(from: Date, to: Date, timeZone: string): number {
  const left = startOfDay(from, timeZone).getTime();
  const right = startOfDay(to, timeZone).getTime();
  return Math.round((right - left) / DAY_MS);
}
