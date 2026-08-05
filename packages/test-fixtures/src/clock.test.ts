import { describe, expect, it, vi } from 'vitest';

import { DAY_MS, FakeClock, frozenClock, steppingClock } from './clock';

describe('FakeClock', () => {
  it('starts where it is told and never moves on its own', () => {
    const clock = new FakeClock('2026-08-04T12:00:00.000Z');
    expect(clock.iso()).toBe('2026-08-04T12:00:00.000Z');
    expect(clock.iso()).toBe('2026-08-04T12:00:00.000Z');
    expect(clock.epochSeconds()).toBe(1_785_844_800);
  });

  it('advances by the units a billing or scheduling test needs', () => {
    const clock = new FakeClock('2026-08-04T12:00:00.000Z');
    clock.advanceSeconds(30);
    expect(clock.iso()).toBe('2026-08-04T12:00:30.000Z');
    clock.advanceMinutes(30);
    expect(clock.iso()).toBe('2026-08-04T12:30:30.000Z');
    clock.advanceHours(1);
    expect(clock.iso()).toBe('2026-08-04T13:30:30.000Z');
    clock.advanceDays(7);
    expect(clock.iso()).toBe('2026-08-11T13:30:30.000Z');
  });

  it('refuses to travel backwards through advanceTo', () => {
    const clock = new FakeClock('2026-08-04T12:00:00.000Z');
    expect(() => {
      clock.advanceTo('2026-08-03T12:00:00.000Z');
    }).toThrow(RangeError);
    clock.advanceTo('2026-08-05T12:00:00.000Z');
    expect(clock.iso()).toBe('2026-08-05T12:00:00.000Z');
  });

  it('allows a deliberate reset with set', () => {
    const clock = new FakeClock('2026-08-04T12:00:00.000Z');
    clock.set('2026-01-01T00:00:00.000Z');
    expect(clock.iso()).toBe('2026-01-01T00:00:00.000Z');
  });

  it('rejects an unparseable start', () => {
    expect(() => new FakeClock('not a date')).toThrow(RangeError);
  });

  it('notifies listeners on every move, which is how fake schedulers fire', () => {
    const clock = new FakeClock('2026-08-04T12:00:00.000Z');
    const listener = vi.fn();
    const unsubscribe = clock.onTick(listener);
    clock.advance(DAY_MS);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    clock.advance(DAY_MS);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('hands out copies, so a caller cannot mutate the clock through a Date', () => {
    const clock = new FakeClock('2026-08-04T12:00:00.000Z');
    const first = clock.now();
    first.setUTCFullYear(2000);
    expect(clock.iso()).toBe('2026-08-04T12:00:00.000Z');
  });
});

describe('frozenClock and steppingClock', () => {
  it('freezes an instant', () => {
    const clock = frozenClock('2026-08-04T12:00:00.000Z');
    expect(clock.now().toISOString()).toBe(clock.now().toISOString());
  });

  it('steps forward on every read, for duration assertions', () => {
    const clock = steppingClock('2026-08-04T12:00:00.000Z', 250);
    const first = clock.now().getTime();
    const second = clock.now().getTime();
    expect(second - first).toBe(250);
  });
});
