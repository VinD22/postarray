/**
 * `/compose?at=<iso>&tz=<zone>`: the calendar's empty-slot link.
 *
 * Clicking an empty slot should open the composer already pointed at that
 * moment. The two parameters are read together, because a time without its zone
 * is not a schedule: the workspace rule is that an instant is stored beside the
 * IANA zone it was chosen in, and a browser-local guess would quietly move the
 * post for anybody in another country.
 *
 * Validation is `scheduleSpecSchema` from `@relay/contracts`, the same schema
 * the API parses a schedule with, rather than a second definition of what a
 * valid time looks like. Anything that fails it is ignored rather than
 * corrected: a malformed link opens an ordinary empty composer, because
 * guessing a time out of a broken parameter would schedule a post nobody asked
 * for.
 */

import { scheduleSpecSchema, type ScheduleSpec } from '@relay/contracts';

/** True when this runtime knows the zone. An unknown zone is not a schedule. */
function isKnownTimeZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat('en', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

export function scheduleFromQuickCreate(input: {
  readonly at: string | null;
  readonly tz: string | null;
}): ScheduleSpec | null {
  if (input.at === null || input.tz === null || !isKnownTimeZone(input.tz)) {
    return null;
  }
  const parsed = scheduleSpecSchema.safeParse({
    instant: input.at,
    ianaTimeZone: input.tz,
    repeat: null,
  });
  return parsed.success ? parsed.data : null;
}
