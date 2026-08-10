import { describe, expect, it } from 'vitest';

import { SLOT_REASON_KEYS, type QueueRuleDefinition } from '@relay/contracts';

import {
  fallbackSlot,
  findNextSlot,
  nextCandidateForRule,
  type SlotFinderRule,
} from './slot-finder';
import { localDateIn, localDateTimeIn, resolveWallClock } from './zone-time';

/**
 * Slot mathematics.
 *
 * Both hemispheres are exercised on purpose. Europe/London springs forward in
 * March and falls back in October. Australia/Sydney does the opposite: it
 * springs forward in October and falls back in April. Sao Paulo was the obvious
 * southern candidate, but Brazil abolished daylight saving in 2019, so relying
 * on it would have tested nothing. Sydney still observes it.
 */

const RULE: QueueRuleDefinition = {
  name: 'Weekdays',
  ianaTimeZone: 'Europe/London',
  windows: [{ weekday: 1, startMinute: 9 * 60, endMinute: 17 * 60 }],
  minimumGapMinutes: 0,
  maximumPerDay: null,
  blackouts: [],
  connectionIds: [],
  priority: 0,
  enabled: true,
};

function rule(patch: Partial<SlotFinderRule> = {}): SlotFinderRule {
  return { ...RULE, ...patch };
}

function every(weekday: number, start: number, end: number) {
  return { weekday, startMinute: start, endMinute: end };
}

const ALL_WEEK = [1, 2, 3, 4, 5, 6, 7].map((day) => every(day, 9 * 60, 17 * 60));

describe('resolveWallClock', () => {
  it('resolves an ordinary local time exactly', () => {
    const resolved = resolveWallClock(
      { year: 2026, month: 6, day: 15, minuteOfDay: 10 * 60 },
      'Europe/London',
    );
    expect(resolved.kind).toBe('exact');
    if (resolved.kind === 'nonexistent') throw new Error('unreachable');
    expect(resolved.instant.toISOString()).toBe('2026-06-15T09:00:00.000Z');
  });

  it('reports a London spring-forward local time as nonexistent', () => {
    // 2026-03-29 01:00 UTC, clocks go 01:00 -> 02:00 local. 01:30 never happens.
    const resolved = resolveWallClock(
      { year: 2026, month: 3, day: 29, minuteOfDay: 60 + 30 },
      'Europe/London',
    );
    expect(resolved.kind).toBe('nonexistent');
  });

  it('reports a Sydney spring-forward local time as nonexistent', () => {
    // 2026-10-04, Sydney clocks go 02:00 -> 03:00. 02:30 never happens.
    const resolved = resolveWallClock(
      { year: 2026, month: 10, day: 4, minuteOfDay: 2 * 60 + 30 },
      'Australia/Sydney',
    );
    expect(resolved.kind).toBe('nonexistent');
  });

  it('resolves a London fall-back local time to the first occurrence', () => {
    // 2026-10-25, clocks go 02:00 -> 01:00. 01:30 happens twice: 00:30Z and 01:30Z.
    const resolved = resolveWallClock(
      { year: 2026, month: 10, day: 25, minuteOfDay: 60 + 30 },
      'Europe/London',
    );
    expect(resolved.kind).toBe('ambiguous');
    if (resolved.kind === 'nonexistent') throw new Error('unreachable');
    expect(resolved.instant.toISOString()).toBe('2026-10-25T00:30:00.000Z');
  });

  it('resolves a Sydney fall-back local time to the first occurrence', () => {
    // 2026-04-05, Sydney clocks go 03:00 -> 02:00. 02:30 happens twice.
    const resolved = resolveWallClock(
      { year: 2026, month: 4, day: 5, minuteOfDay: 2 * 60 + 30 },
      'Australia/Sydney',
    );
    expect(resolved.kind).toBe('ambiguous');
    if (resolved.kind === 'nonexistent') throw new Error('unreachable');
    // First occurrence is still on AEDT (+11), so 15:30Z the previous day.
    expect(resolved.instant.toISOString()).toBe('2026-04-04T15:30:00.000Z');
  });
});

describe('daylight saving in a window', () => {
  it('skips forward over a London spring-forward gap instead of throwing', () => {
    const sunday = rule({
      windows: [every(7, 60, 4 * 60)],
      ianaTimeZone: 'Europe/London',
    });
    const proposal = findNextSlot({
      rules: [sunday],
      occupied: [],
      reserved: [],
      after: new Date('2026-03-29T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    // 01:00 local does not exist on that date; the first that does is 02:00.
    expect(proposal.localDateTime).toBe('2026-03-29T02:00');
    expect(proposal.instant).toBe('2026-03-29T01:00:00.000Z');
    expect(proposal.reasons.map((entry) => entry.key)).toContain(
      SLOT_REASON_KEYS.dstNonexistentSkipped,
    );
  });

  it('skips forward over a Sydney spring-forward gap', () => {
    const sunday = rule({
      ianaTimeZone: 'Australia/Sydney',
      windows: [every(7, 2 * 60, 5 * 60)],
    });
    const proposal = findNextSlot({
      rules: [sunday],
      occupied: [],
      reserved: [],
      after: new Date('2026-10-03T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(proposal.localDateTime).toBe('2026-10-04T03:00');
    expect(proposal.reasons.map((entry) => entry.key)).toContain(
      SLOT_REASON_KEYS.dstNonexistentSkipped,
    );
  });

  it('takes the first occurrence of an ambiguous London local time', () => {
    const sunday = rule({ windows: [every(7, 60, 3 * 60)] });
    const proposal = findNextSlot({
      rules: [sunday],
      occupied: [],
      reserved: [],
      after: new Date('2026-10-24T23:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(proposal.localDateTime).toBe('2026-10-25T01:00');
    // 01:00 BST, not 01:00 GMT. The earlier of the two real instants.
    expect(proposal.instant).toBe('2026-10-25T00:00:00.000Z');
    expect(proposal.reasons.map((entry) => entry.key)).toContain(
      SLOT_REASON_KEYS.dstAmbiguousFirst,
    );
  });

  it('takes the first occurrence of an ambiguous Sydney local time', () => {
    const sunday = rule({
      ianaTimeZone: 'Australia/Sydney',
      windows: [every(7, 2 * 60, 3 * 60)],
    });
    const proposal = findNextSlot({
      rules: [sunday],
      occupied: [],
      reserved: [],
      after: new Date('2026-04-04T14:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(proposal.localDateTime).toBe('2026-04-05T02:00');
    expect(proposal.instant).toBe('2026-04-04T15:00:00.000Z');
    expect(proposal.reasons.map((entry) => entry.key)).toContain(
      SLOT_REASON_KEYS.dstAmbiguousFirst,
    );
  });
});

describe('window edges', () => {
  it('accepts the exact first minute of a window', () => {
    const proposal = findNextSlot({
      rules: [rule({ windows: [every(1, 9 * 60, 17 * 60)] })],
      occupied: [],
      reserved: [],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(proposal.localDateTime).toBe('2026-06-08T09:00');
  });

  it('accepts the exact last minute of a window and never one past it', () => {
    // A one-minute-wide window at 17:00 with an hourly step offers 17:00 only.
    const narrow = rule({ windows: [every(1, 17 * 60, 17 * 60)] });
    const first = findNextSlot({
      rules: [narrow],
      occupied: [],
      reserved: [],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(first.localDateTime).toBe('2026-06-08T17:00');

    const taken = [{ instant: first.instant }];
    const second = findNextSlot({
      rules: [narrow],
      occupied: taken,
      reserved: [],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    // It rolls to the next Monday rather than spilling past the window edge.
    expect(second.localDateTime).toBe('2026-06-15T17:00');
  });

  it('never proposes an instant at or before the after instant', () => {
    const proposal = findNextSlot({
      rules: [rule({ windows: ALL_WEEK })],
      occupied: [],
      reserved: [],
      after: new Date('2026-06-08T08:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(Date.parse(proposal.instant)).toBeGreaterThan(Date.parse('2026-06-08T08:00:00.000Z'));
  });
});

describe('minimum gap', () => {
  it('refuses a candidate inside the gap and offers the next one clear of it', () => {
    const spaced = rule({ windows: [every(1, 9 * 60, 17 * 60)], minimumGapMinutes: 180 });
    const proposal = findNextSlot({
      rules: [spaced],
      occupied: [{ instant: '2026-06-08T08:00:00.000Z' }],
      reserved: [],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    // 09:00 and 12:00 local are 08:00Z and 11:00Z. 08:00Z is taken, and 09:00Z
    // (the next step) is inside the three hour gap, so 11:00Z is the first.
    expect(proposal.instant).toBe('2026-06-08T11:00:00.000Z');
  });

  it('counts a live reservation exactly like a scheduled job', () => {
    const spaced = rule({ windows: [every(1, 9 * 60, 17 * 60)], minimumGapMinutes: 120 });
    const proposal = findNextSlot({
      rules: [spaced],
      occupied: [],
      reserved: [{ instant: '2026-06-08T08:00:00.000Z' }],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(proposal.instant).toBe('2026-06-08T10:00:00.000Z');
  });

  it('with no gap configured only refuses an exact collision', () => {
    const proposal = findNextSlot({
      rules: [rule({ windows: [every(1, 9 * 60, 17 * 60)] })],
      occupied: [{ instant: '2026-06-08T08:00:00.000Z' }],
      reserved: [],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(proposal.instant).toBe('2026-06-08T09:00:00.000Z');
  });
});

describe('maximum per day', () => {
  it('rolls over at local midnight in the rule zone, not UTC midnight', () => {
    // Sydney is +10 in June, so 2026-06-08T23:00Z is already the 9th locally.
    const sydney = rule({
      ianaTimeZone: 'Australia/Sydney',
      windows: ALL_WEEK,
      maximumPerDay: 1,
    });
    const proposal = findNextSlot({
      rules: [sydney],
      occupied: [
        // 2026-06-09 09:00 Sydney local. Fills the 9th, leaves the 8th free.
        { instant: '2026-06-08T23:00:00.000Z' },
      ],
      reserved: [],
      after: new Date('2026-06-07T23:30:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    // The 8th local is still open, so the proposal lands there, and only a
    // UTC-day counter would have wrongly considered it full.
    expect(localDateIn(new Date(proposal.instant), 'Australia/Sydney')).toBe('2026-06-08');
  });

  it('skips a day that is already at its ceiling', () => {
    const capped = rule({ windows: ALL_WEEK, maximumPerDay: 2 });
    const proposal = findNextSlot({
      rules: [capped],
      occupied: [{ instant: '2026-06-08T08:00:00.000Z' }, { instant: '2026-06-08T09:00:00.000Z' }],
      reserved: [],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(localDateIn(new Date(proposal.instant), 'Europe/London')).toBe('2026-06-09');
  });

  it('treats zero as zero and never as unlimited', () => {
    const none = rule({ windows: ALL_WEEK, maximumPerDay: 0 });
    expect(nextCandidateForRule(none, [], new Date('2026-06-08T00:00:00.000Z'), 60)).toBeNull();
  });

  it('treats null as unlimited', () => {
    const unlimited = rule({ windows: ALL_WEEK, maximumPerDay: null });
    const many = Array.from({ length: 8 }, (_, index) => ({
      instant: new Date(Date.UTC(2026, 5, 8, 8 + index)).toISOString(),
    }));
    const proposal = findNextSlot({
      rules: [unlimited],
      occupied: many,
      reserved: [],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(localDateIn(new Date(proposal.instant), 'Europe/London')).toBe('2026-06-08');
  });
});

describe('blackouts', () => {
  it('skips every local date inside a blackout span and says how many', () => {
    const holiday = rule({
      windows: ALL_WEEK,
      blackouts: [{ from: '2026-06-08', to: '2026-06-10' }],
    });
    const proposal = findNextSlot({
      rules: [holiday],
      occupied: [],
      reserved: [],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(localDateIn(new Date(proposal.instant), 'Europe/London')).toBe('2026-06-11');
    const skipped = proposal.reasons.find(
      (entry) => entry.key === SLOT_REASON_KEYS.blackoutSkipped,
    );
    expect(skipped?.values['days']).toBe(3);
  });
});

describe('multiple rules', () => {
  it('uses the highest priority rule even when a lower one is earlier', () => {
    const urgent = rule({
      name: 'Evenings',
      priority: 10,
      windows: [every(1, 20 * 60, 21 * 60)],
    });
    const relaxed = rule({ name: 'Mornings', priority: 1, windows: [every(1, 9 * 60, 10 * 60)] });
    const proposal = findNextSlot({
      rules: [relaxed, urgent],
      occupied: [],
      reserved: [],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(proposal.localDateTime).toBe('2026-06-08T20:00');
    expect(
      proposal.reasons.find((entry) => entry.key === SLOT_REASON_KEYS.matchedRule)?.values['name'],
    ).toBe('Evenings');
  });

  it('falls through to the next rule when the first cannot offer anything', () => {
    const impossible = rule({ name: 'Closed', priority: 10, windows: [], maximumPerDay: 0 });
    const open = rule({ name: 'Mornings', priority: 1, windows: [every(1, 9 * 60, 10 * 60)] });
    const proposal = findNextSlot({
      rules: [impossible, open],
      occupied: [],
      reserved: [],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(proposal.localDateTime).toBe('2026-06-08T09:00');
  });

  it('ignores a disabled rule entirely', () => {
    const off = rule({ name: 'Evenings', priority: 10, enabled: false });
    const on = rule({ name: 'Mornings', priority: 1, windows: [every(1, 9 * 60, 10 * 60)] });
    const proposal = findNextSlot({
      rules: [off, on],
      occupied: [],
      reserved: [],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(proposal.localDateTime).toBe('2026-06-08T09:00');
  });
});

describe('connection scope', () => {
  it('only counts occupancy on the connections the rule is scoped to', () => {
    const scoped = rule({
      windows: [every(1, 9 * 60, 17 * 60)],
      connectionIds: ['conn_a'],
      minimumGapMinutes: 120,
    });
    const proposal = findNextSlot({
      rules: [scoped],
      occupied: [{ instant: '2026-06-08T08:00:00.000Z', connectionId: 'conn_b' }],
      reserved: [],
      after: new Date('2026-06-08T00:00:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(proposal.instant).toBe('2026-06-08T08:00:00.000Z');
    expect(proposal.reasons.map((entry) => entry.key)).toContain(SLOT_REASON_KEYS.connectionScoped);
  });
});

describe('the labelled fallback', () => {
  it('says in so many words that no rules are configured', () => {
    const proposal = findNextSlot({
      rules: [],
      occupied: [],
      reserved: [],
      after: new Date('2026-06-08T08:15:00.000Z'),
      fallbackTimeZone: 'Europe/London',
    });
    expect(proposal.queueRuleId).toBeNull();
    expect(proposal.instant).toBe('2026-06-08T09:00:00.000Z');
    expect(proposal.reasons.map((entry) => entry.key)).toEqual([
      SLOT_REASON_KEYS.noRulesConfigured,
      SLOT_REASON_KEYS.fallbackFirstFreeHour,
    ]);
  });

  it('keeps the old first-free-hour behaviour', () => {
    const proposal = fallbackSlot(
      [{ instant: '2026-06-08T09:00:00.000Z' }, { instant: '2026-06-08T10:00:00.000Z' }],
      new Date('2026-06-08T08:15:00.000Z'),
      'UTC',
    );
    expect(proposal.instant).toBe('2026-06-08T11:00:00.000Z');
  });

  it('falls back when every rule is disabled', () => {
    const proposal = findNextSlot({
      rules: [rule({ enabled: false })],
      occupied: [],
      reserved: [],
      after: new Date('2026-06-08T08:15:00.000Z'),
      fallbackTimeZone: 'UTC',
    });
    expect(proposal.reasons[0]?.key).toBe(SLOT_REASON_KEYS.noRulesConfigured);
  });
});

describe('local formatting', () => {
  it('renders the wall clock in the rule zone, never in UTC', () => {
    expect(localDateTimeIn(new Date('2026-06-08T08:00:00.000Z'), 'Europe/London')).toBe(
      '2026-06-08T09:00',
    );
    expect(localDateTimeIn(new Date('2026-06-08T23:30:00.000Z'), 'Australia/Sydney')).toBe(
      '2026-06-09T09:30',
    );
  });
});
