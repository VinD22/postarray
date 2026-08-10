import { SLOT_REASON_KEYS } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { reasonLines } from './reasons';

const translate = (key: string, values?: Record<string, string | number>): string => {
  if (key === SLOT_REASON_KEYS.matchedRule) {
    return `The rule ${String(values?.['name'])} chose this time.`;
  }
  if (key === SLOT_REASON_KEYS.noRulesConfigured) {
    return 'No queue rules are configured.';
  }
  // Anything unknown comes back as the key, the way a real catalog behaves.
  return key;
};

describe('slot reasons', () => {
  it('renders each reason through the catalog with its arguments', () => {
    const lines = reasonLines(
      [
        { key: SLOT_REASON_KEYS.matchedRule, values: { name: 'Weekday mornings' } },
        { key: SLOT_REASON_KEYS.noRulesConfigured, values: {} },
      ],
      translate,
      'unavailable',
    );
    expect(lines.map((line) => line.text)).toEqual([
      'The rule Weekday mornings chose this time.',
      'No queue rules are configured.',
    ]);
  });

  it('never shows a raw dotted key to a reader', () => {
    const lines = reasonLines(
      [{ key: 'queue.reason.somethingNewer', values: {} }],
      translate,
      'unavailable',
    );
    expect(lines[0]?.text).toBe('unavailable');
  });

  it('survives a formatter that throws on a malformed argument set', () => {
    const lines = reasonLines(
      [{ key: SLOT_REASON_KEYS.matchedRule, values: {} }],
      () => {
        throw new Error('ICU_ARGUMENT_MISSING');
      },
      'unavailable',
    );
    expect(lines[0]?.text).toBe('unavailable');
  });

  it('gives every line a stable key even when a reason repeats', () => {
    const lines = reasonLines(
      [
        { key: SLOT_REASON_KEYS.noRulesConfigured, values: {} },
        { key: SLOT_REASON_KEYS.noRulesConfigured, values: {} },
      ],
      translate,
      'unavailable',
    );
    expect(new Set(lines.map((line) => line.id)).size).toBe(2);
  });
});
