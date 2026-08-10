import { describe, expect, it } from 'vitest';

import {
  isUnlimitedPerDay,
  queueBlackoutSchema,
  queueRuleDefinitionSchema,
  queueRuleSnapshotSchema,
  queueWindowSchema,
  slotProposalSchema,
  SLOT_REASON_KEYS,
} from './queue-rules';

const BASE = {
  name: 'Weekdays',
  ianaTimeZone: 'Europe/London',
  windows: [{ weekday: 1, startMinute: 540, endMinute: 1020 }],
  minimumGapMinutes: 90,
  maximumPerDay: 3,
};

describe('queue window', () => {
  it('accepts a window that starts and ends on the same minute', () => {
    expect(queueWindowSchema.parse({ weekday: 7, startMinute: 0, endMinute: 0 })).toEqual({
      weekday: 7,
      startMinute: 0,
      endMinute: 0,
    });
  });

  it('refuses an inverted window', () => {
    expect(
      queueWindowSchema.safeParse({ weekday: 1, startMinute: 600, endMinute: 300 }).success,
    ).toBe(false);
  });

  it('refuses a weekday outside Monday through Sunday', () => {
    expect(queueWindowSchema.safeParse({ weekday: 0, startMinute: 0, endMinute: 60 }).success).toBe(
      false,
    );
    expect(queueWindowSchema.safeParse({ weekday: 8, startMinute: 0, endMinute: 60 }).success).toBe(
      false,
    );
  });

  it('refuses a minute past the end of a day', () => {
    expect(
      queueWindowSchema.safeParse({ weekday: 1, startMinute: 0, endMinute: 1440 }).success,
    ).toBe(false);
  });
});

describe('blackout spans', () => {
  it('accepts a single day', () => {
    expect(queueBlackoutSchema.parse({ from: '2026-12-25', to: '2026-12-25' })).toEqual({
      from: '2026-12-25',
      to: '2026-12-25',
    });
  });

  it('refuses a span that ends before it starts', () => {
    expect(queueBlackoutSchema.safeParse({ from: '2026-12-26', to: '2026-12-25' }).success).toBe(
      false,
    );
  });
});

describe('maximum per day', () => {
  it('accepts null for no ceiling', () => {
    const parsed = queueRuleDefinitionSchema.parse({ ...BASE, maximumPerDay: null });
    expect(parsed.maximumPerDay).toBeNull();
    expect(isUnlimitedPerDay(parsed.maximumPerDay)).toBe(true);
  });

  it('accepts zero and never reads it as unlimited', () => {
    const parsed = queueRuleDefinitionSchema.parse({ ...BASE, maximumPerDay: 0 });
    expect(parsed.maximumPerDay).toBe(0);
    expect(isUnlimitedPerDay(parsed.maximumPerDay)).toBe(false);
  });

  it('refuses a negative ceiling', () => {
    expect(queueRuleDefinitionSchema.safeParse({ ...BASE, maximumPerDay: -1 }).success).toBe(false);
  });
});

describe('rule defaults', () => {
  it('defaults blackouts, connection scope, priority and enabled', () => {
    const parsed = queueRuleDefinitionSchema.parse(BASE);
    expect(parsed.blackouts).toEqual([]);
    expect(parsed.connectionIds).toEqual([]);
    expect(parsed.priority).toBe(0);
    expect(parsed.enabled).toBe(true);
  });

  it('refuses an unknown key rather than silently dropping it', () => {
    expect(queueRuleDefinitionSchema.safeParse({ ...BASE, quietHours: true }).success).toBe(false);
  });

  it('refuses a zone the runtime does not know', () => {
    expect(
      queueRuleDefinitionSchema.safeParse({ ...BASE, ianaTimeZone: 'Mars/Olympus' }).success,
    ).toBe(false);
  });
});

describe('reasons and proposals', () => {
  it('keeps every reason as an ICU key, never as English', () => {
    for (const key of Object.values(SLOT_REASON_KEYS)) {
      expect(key.startsWith('queue.reason.')).toBe(true);
      expect(key).not.toMatch(/\s/u);
    }
  });

  it('parses a proposal with a null rule id for the labelled fallback', () => {
    const parsed = slotProposalSchema.parse({
      instant: '2026-06-08T09:00:00.000Z',
      ianaTimeZone: 'Europe/London',
      localDateTime: '2026-06-08T10:00',
      queueRuleId: null,
      reasons: [{ key: SLOT_REASON_KEYS.noRulesConfigured, values: {} }],
    });
    expect(parsed.queueRuleId).toBeNull();
  });
});

describe('the frozen snapshot', () => {
  it('carries the rule, the moment it was captured and the reasons', () => {
    const snapshot = queueRuleSnapshotSchema.parse({
      ...BASE,
      blackouts: [],
      connectionIds: [],
      priority: 5,
      enabled: true,
      queueRuleId: 'qrule_1',
      capturedAt: '2026-06-05T10:00:00.000Z',
      reasons: [{ key: SLOT_REASON_KEYS.matchedRule, values: { name: 'Weekdays' } }],
    });
    expect(snapshot.queueRuleId).toBe('qrule_1');
    expect(snapshot.reasons[0]?.values['name']).toBe('Weekdays');
  });

  it('allows an empty name so the fallback can say there was no rule', () => {
    const snapshot = queueRuleSnapshotSchema.parse({
      name: '',
      ianaTimeZone: 'UTC',
      windows: [],
      minimumGapMinutes: 0,
      maximumPerDay: null,
      blackouts: [],
      connectionIds: [],
      priority: 0,
      enabled: true,
      queueRuleId: null,
      capturedAt: '2026-06-05T10:00:00.000Z',
      reasons: [{ key: SLOT_REASON_KEYS.noRulesConfigured, values: {} }],
    });
    expect(snapshot.name).toBe('');
    expect(snapshot.queueRuleId).toBeNull();
  });
});
