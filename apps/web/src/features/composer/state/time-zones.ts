import { isoDateIn, isoTimeIn, zonedToInstant } from './time';

/**
 * Every IANA zone the runtime knows, with UTC and the zones already in play
 * (the workspace zone, the draft's current zone) always present, sorted once.
 * A runtime without `Intl.supportedValuesOf` still offers the zones in play.
 */
export function timeZoneOptions(pinned: readonly string[]): readonly string[] {
  let supported: readonly string[];
  try {
    supported = Intl.supportedValuesOf('timeZone');
  } catch {
    supported = [];
  }
  return [...new Set(['UTC', ...pinned, ...supported])].sort((a, b) => a.localeCompare(b, 'en'));
}

/**
 * Moving a schedule to another zone keeps the wall-clock time the person
 * typed: 09:00 in Berlin becomes 09:00 in New York, not 03:00. The instant is
 * recomputed through the new zone, never through the browser's.
 */
export function reZoneInstant(instant: string, fromZone: string, toZone: string): string {
  return zonedToInstant(isoDateIn(instant, fromZone), isoTimeIn(instant, fromZone), toZone);
}
