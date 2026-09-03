import { describe, expect, it } from 'vitest';

import { scheduleFromQuickCreate } from './quick-create';

/**
 * A calendar slot becomes a composer with a time in it. What is held here is
 * that a broken link opens an ordinary empty composer rather than a post
 * pointed at a time nobody chose, and that a time never arrives without the
 * zone it was chosen in.
 */

describe('scheduleFromQuickCreate', () => {
  it('carries the instant and the zone the slot was clicked in', () => {
    const schedule = scheduleFromQuickCreate({
      at: '2026-09-10T09:00:00.000Z',
      tz: 'Europe/Berlin',
    });

    expect(schedule).toEqual({
      instant: '2026-09-10T09:00:00.000Z',
      ianaTimeZone: 'Europe/Berlin',
      repeat: null,
    });
  });

  it('seeds nothing when either half is missing', () => {
    expect(scheduleFromQuickCreate({ at: '2026-09-10T09:00:00.000Z', tz: null })).toBeNull();
    expect(scheduleFromQuickCreate({ at: null, tz: 'Europe/Berlin' })).toBeNull();
  });

  it('seeds nothing from a time this runtime cannot place', () => {
    expect(scheduleFromQuickCreate({ at: 'tomorrow', tz: 'Europe/Berlin' })).toBeNull();
    expect(
      scheduleFromQuickCreate({ at: '2026-09-10T09:00:00.000Z', tz: 'Mars/Olympus' }),
    ).toBeNull();
  });
});
