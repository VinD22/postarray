/**
 * Local time to absolute instant, always through a named IANA zone.
 *
 * A schedule computed in the browser's zone is a publishing incident, not a
 * cosmetic bug, so nothing in the composer converts a date and time without
 * saying which zone it means.
 */

/** The offset of a zone at a given instant, in minutes. */
function offsetMinutes(timeZone: string, at: Date): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = new Map(formatter.formatToParts(at).map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(parts.get('year')),
    Number(parts.get('month')) - 1,
    Number(parts.get('day')),
    Number(parts.get('hour')),
    Number(parts.get('minute')),
    Number(parts.get('second')),
  );
  return Math.round((asUtc - at.getTime()) / 60_000);
}

/**
 * Two passes, because the offset itself depends on the instant. That is exactly
 * the case a daylight saving transition creates, and it is the case that a one
 * pass conversion gets wrong by an hour.
 */
export function zonedToInstant(date: string, time: string, timeZone: string): string {
  const naive = Date.parse(`${date}T${time}:00Z`);
  const firstGuess = new Date(naive - offsetMinutes(timeZone, new Date(naive)) * 60_000);
  const corrected = new Date(naive - offsetMinutes(timeZone, firstGuess) * 60_000);
  return corrected.toISOString();
}

/** The calendar date of an instant, as `YYYY-MM-DD`, in the given zone. */
export function isoDateIn(instant: string, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(instant));
}

/** The wall clock time of an instant, as `HH:mm`, in the given zone. */
export function isoTimeIn(instant: string, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(instant));
}
