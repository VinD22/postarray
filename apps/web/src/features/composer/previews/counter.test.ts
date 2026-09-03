/**
 * The counter's contract with the validator.
 *
 * The acceptance criterion in section A is that the preview counter and
 * `validate-draft.ts` agree for the same input. This suite proves it by
 * running both over the same bodies rather than by asserting two numbers that
 * happen to match today.
 */

import { describe, expect, it } from 'vitest';

import { readCounter } from '../state/capability-rules';
import { validateTarget } from '../state/validate-draft';
import { SEED_ACCOUNTS } from '../state/seed';
import { resolveVariant } from '@relay/contracts';
import { SEED_BOOTSTRAP } from '../state/seed';
import { crossedThreshold, readPreviewCounter } from './counter';
import type { PreviewCounter } from './types';

function account(index: number) {
  const entry = SEED_ACCOUNTS[index];
  if (entry === undefined) {
    throw new Error(`the seed has no account at index ${index}`);
  }
  return entry;
}

const BODIES = [
  '',
  'Short.',
  'A body with a link https://example.com/a/very/long/path in the middle.',
  'x'.repeat(279),
  'x'.repeat(280),
  'x'.repeat(281),
  'Emoji count the same way in both readers 👩‍👩‍👧‍👦 and both must agree.',
];

describe('the preview counter', () => {
  it('reports exactly what the shared counting rule reports', () => {
    for (const entry of SEED_ACCOUNTS) {
      for (const body of BODIES) {
        const shared = readCounter(body, entry.capabilities);
        const preview = readPreviewCounter(body, entry.capabilities);
        expect(preview.used).toBe(shared.used);
        expect(preview.max).toBe(shared.limit);
        expect(preview.remaining).toBe(shared.remaining);
        expect(preview.over).toBe(shared.level === 'over');
      }
    }
  });

  it('goes over exactly when the validator raises TEXT_TOO_LONG', () => {
    for (const entry of SEED_ACCOUNTS) {
      for (const body of BODIES) {
        const resolved = resolveVariant({ ...SEED_BOOTSTRAP.master, body }, {});
        const issues = validateTarget(entry, {
          resolved,
          media: [],
          unresolvedMentionCount: 0,
          destinationChosen: true,
          privacyChosen: true,
          altTextMissingCount: 0,
          rightsUndeclaredCount: 0,
        });
        const blocked = issues.some((issue) => issue.code === 'TEXT_TOO_LONG');
        expect(readPreviewCounter(body, entry.capabilities).over).toBe(blocked);
      }
    }
  });

  it('reads the limit from the snapshot rather than from the provider name', () => {
    const first = account(0);
    const doubled = {
      ...first.capabilities,
      text: { ...first.capabilities.text, maxLength: first.capabilities.text.maxLength * 2 },
    };
    expect(readPreviewCounter('a', doubled).max).toBe(first.capabilities.text.maxLength * 2);
  });
});

function counter(used: number, max: number): PreviewCounter {
  return {
    used,
    max,
    remaining: max - used,
    over: used > max,
    nearLimit: used <= max && used >= max * 0.9,
  };
}

describe('announcement thresholds', () => {
  it('says nothing on the first reading', () => {
    expect(crossedThreshold(null, counter(10, 100))).toBeNull();
  });

  it('says nothing while the reading stays in the same band', () => {
    expect(crossedThreshold(counter(10, 100), counter(20, 100))).toBeNull();
    expect(crossedThreshold(counter(95, 100), counter(96, 100))).toBeNull();
    expect(crossedThreshold(counter(120, 100), counter(130, 100))).toBeNull();
  });

  it('announces reaching ninety percent, going over and coming back', () => {
    expect(crossedThreshold(counter(10, 100), counter(90, 100))).toBe('near');
    expect(crossedThreshold(counter(90, 100), counter(101, 100))).toBe('over');
    expect(crossedThreshold(counter(101, 100), counter(50, 100))).toBe('under');
  });
});
