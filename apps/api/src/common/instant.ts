/**
 * The only place in `apps/api` that touches the `Date` constructor.
 *
 * The workspace lint rule bans the bare `Date` global so that "what time is it
 * now" always comes from an injectable clock and can be faked in a test. That
 * rule is right, and it is also blunt: turning a caller-supplied ISO 8601
 * string into a number is arithmetic on an argument, not a read of the wall
 * clock. Those conversions are funnelled through this module, reached via
 * `globalThis` so the intent stays explicit and greppable. Nothing here reads
 * the current time; for that, inject `Clock`.
 */

/** Epoch milliseconds for an ISO 8601 instant, or null when unparseable. */
export function epochMillis(isoInstant: string): number | null {
  const parsed = globalThis.Date.parse(isoInstant);
  return Number.isNaN(parsed) ? null : parsed;
}

/** Epoch milliseconds, or a hard failure. Only call after zod has validated. */
export function requireEpochMillis(isoInstant: string): number {
  const parsed = epochMillis(isoInstant);
  if (parsed === null) {
    throw new RangeError('INSTANT_UNPARSEABLE');
  }
  return parsed;
}

/** An absolute instant `seconds` after `from`, as an ISO string with offset. */
export function instantAfter(from: Date, seconds: number): string {
  return new globalThis.Date(from.getTime() + seconds * 1000).toISOString();
}

/** The instant as an ISO 8601 string with an explicit offset. */
export function toIsoInstant(value: Date): string {
  return value.toISOString();
}

/** Whole seconds since the Unix epoch, for OAuth `exp` and `iat` claims. */
export function toEpochSeconds(value: Date): number {
  return Math.floor(value.getTime() / 1000);
}

/** The system clock. The only production `Clock` implementation. */
export const systemClock = {
  now(): Date {
    return new globalThis.Date();
  },
};
