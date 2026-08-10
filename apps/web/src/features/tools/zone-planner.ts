import { crossesOffsetChange, getTimeZoneOffsetMinutes } from '@relay/i18n/format';

/**
 * The time zone planner's arithmetic.
 *
 * The only genuinely hard part is turning a wall clock reading in a named zone
 * into an instant. A zone's offset depends on the instant, and the instant is
 * what we are solving for, so it takes two passes: guess with the offset at the
 * naive UTC reading, then correct with the offset at the guessed instant. One
 * pass is wrong for any reading within an offset change of a transition, which
 * is precisely the case this tool exists to show.
 *
 * Everything here is pure and takes its zone explicitly. Nothing reads the
 * browser's zone by default, because a schedule shown in the wrong zone is a
 * publishing incident rather than a cosmetic bug.
 */

const MINUTE_MS = 60_000;
export const FOUR_WEEKS_MS = 28 * 24 * 60 * 60 * 1000;

/** A curated audience list. Broad coverage, one zone per region we can name. */
export const PLANNER_ZONES: readonly string[] = [
  'America/Los_Angeles',
  'America/New_York',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Berlin',
  'Africa/Lagos',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
  'UTC',
];

/**
 * The instant at which a wall clock in `timeZone` reads `date` and `time`.
 *
 * Returns null when either field is empty or malformed, so a half-filled form
 * renders a prompt rather than a wrong answer. During the hour a zone skips at
 * a spring transition the reading does not exist; the two-pass correction lands
 * on the instant immediately after the skip, which is what a scheduler does.
 */
export function wallTimeToInstant(date: string, time: string, timeZone: string): Date | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/u.exec(time);
  if (dateMatch === null || timeMatch === null) {
    return null;
  }
  const [, year, month, day] = dateMatch;
  const [, hour, minute] = timeMatch;
  const naive = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );
  if (Number.isNaN(naive)) {
    return null;
  }
  let instant = naive - getTimeZoneOffsetMinutes(timeZone, naive) * MINUTE_MS;
  instant = naive - getTimeZoneOffsetMinutes(timeZone, instant) * MINUTE_MS;
  return new Date(instant);
}

export interface ZoneRow {
  readonly timeZone: string;
  /** The instant, unchanged. Every row describes the same moment. */
  readonly instant: Date;
  /** The same weekday four weeks later, at the same wall time in the source zone. */
  readonly laterInstant: Date;
  /** True when this zone's offset differs between the two instants. */
  readonly shifts: boolean;
}

/**
 * One row per audience zone.
 *
 * The later instant is deliberately a fixed 28 day step from the first, not a
 * recomputed wall time: the question a weekly slot asks is "where is my regular
 * post an hour later for these readers", and the answer is a property of the
 * zone offsets on either side.
 */
export function planZones(instant: Date, zones: readonly string[]): readonly ZoneRow[] {
  const laterInstant = new Date(instant.getTime() + FOUR_WEEKS_MS);
  return zones.map((timeZone) => ({
    timeZone,
    instant,
    laterInstant,
    shifts: crossesOffsetChange(timeZone, instant, laterInstant),
  }));
}
