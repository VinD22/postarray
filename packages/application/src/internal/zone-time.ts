/**
 * IANA zone arithmetic, isolated from the queue so it can be reasoned about on
 * its own. No database, no clock, no I/O: every answer is a function of its
 * arguments and the runtime's tz database.
 *
 * The one judgement call lives in `resolveWallClock`. A local time that occurs
 * twice, because the zone fell back over it, always resolves to the FIRST
 * occurrence, the one still on the pre-transition offset. First is what a person
 * means when they say "01:30" on that morning, it is stable under
 * recomputation, and it is always the earlier of the two instants, so it can
 * never push a post later than the wall clock the user was shown.
 */

const DAY_MS = 24 * 60 * 60_000;

interface LocalParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  /** ISO weekday, 1 Monday through 7 Sunday. */
  readonly weekday: number;
}

const PART_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  const cached = PART_FORMATTERS.get(timeZone);
  if (cached !== undefined) {
    return cached;
  }
  const created = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
  });
  PART_FORMATTERS.set(timeZone, created);
  return created;
}

const ISO_WEEKDAY: Readonly<Record<string, number>> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

export function partsOf(instant: Date, timeZone: string): LocalParts & { readonly second: number } {
  const found = new Map<string, string>();
  for (const part of formatterFor(timeZone).formatToParts(instant)) {
    found.set(part.type, part.value);
  }
  const read = (name: string): number => Number.parseInt(found.get(name) ?? '0', 10);
  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
    second: read('second'),
    weekday: ISO_WEEKDAY[found.get('weekday') ?? 'Mon'] ?? 1,
  };
}

/** Offset of `timeZone` at `instant`, in milliseconds east of UTC. */
function offsetMsAt(instant: Date, timeZone: string): number {
  const parts = partsOf(instant, timeZone);
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return asUtc - instant.getTime();
}

export type WallResolution =
  | { readonly kind: 'exact'; readonly instant: Date }
  | { readonly kind: 'ambiguous'; readonly instant: Date }
  | { readonly kind: 'nonexistent' };

/**
 * Resolve a wall clock in a zone to an absolute instant.
 *
 * The offsets in force a day either side of the wall clock are sampled, and the
 * naive reading is shifted by each of them. Around a transition the two samples
 * disagree, which is exactly how both occurrences of an ambiguous local time
 * are discovered; probing only at the naive reading would find one of them and
 * quietly lose the other. A candidate counts only if it round-trips back to the
 * requested wall clock, which is how a nonexistent time is detected.
 */
export function resolveWallClock(
  wall: { year: number; month: number; day: number; minuteOfDay: number },
  timeZone: string,
): WallResolution {
  const hour = Math.floor(wall.minuteOfDay / 60);
  const minute = wall.minuteOfDay % 60;
  const naive = Date.UTC(wall.year, wall.month - 1, wall.day, hour, minute, 0);

  const offsets = [
    offsetMsAt(new Date(naive - DAY_MS), timeZone),
    offsetMsAt(new Date(naive), timeZone),
    offsetMsAt(new Date(naive + DAY_MS), timeZone),
  ];
  const candidates = [...new Set(offsets.map((offset) => naive - offset))];

  const valid = candidates
    .filter((candidate) => {
      const parts = partsOf(new Date(candidate), timeZone);
      return (
        parts.year === wall.year &&
        parts.month === wall.month &&
        parts.day === wall.day &&
        parts.hour === hour &&
        parts.minute === minute
      );
    })
    .sort((left, right) => left - right);

  const first = valid[0];
  if (first === undefined) {
    return { kind: 'nonexistent' };
  }
  // Fall back: two real instants carry the same wall clock. Take the first.
  return valid.length > 1
    ? { kind: 'ambiguous', instant: new Date(first) }
    : { kind: 'exact', instant: new Date(first) };
}

export function pad(value: number, width = 2): string {
  return String(value).padStart(width, '0');
}

/** `YYYY-MM-DD` in the given zone. The unit "maximum per day" counts. */
export function localDateIn(instant: Date, timeZone: string): string {
  const parts = partsOf(instant, timeZone);
  return `${pad(parts.year, 4)}-${pad(parts.month)}-${pad(parts.day)}`;
}

/** `YYYY-MM-DDTHH:mm` in the given zone. Never stored without its zone. */
export function localDateTimeIn(instant: Date, timeZone: string): string {
  const parts = partsOf(instant, timeZone);
  return `${pad(parts.year, 4)}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}
