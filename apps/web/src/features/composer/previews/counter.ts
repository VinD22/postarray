/**
 * The preview's character counter.
 *
 * It delegates to `readCounter` in `state/capability-rules.ts` rather than
 * counting again. That is deliberate and it is the whole point of this file:
 * `validate-draft.ts` blocks a publish with `TEXT_TOO_LONG` using exactly that
 * function, so a second implementation here could only ever produce a preview
 * that disagrees with the thing that stops the post going out. One counting
 * rule, two readers.
 *
 * `docs/planning/26-experience-frontend-design.md` section A asks for a
 * grapheme count through `Intl.Segmenter`. We do not do that here. Segmenting
 * by grapheme cluster gives a different number than the code point count the
 * validator uses (a family emoji is one grapheme and up to seven code points),
 * so adopting it in the preview alone would break the agreement the same
 * section requires. If the product wants grapheme counting, it has to change
 * in `capability-rules.ts` and both readers move together.
 */

import type { CapabilitySnapshot } from '@relay/contracts';

import { readCounter } from '../state/capability-rules';
import type { PreviewCounter } from './types';

/** The counter reading for one body against one connection's snapshot. */
export function readPreviewCounter(text: string, snapshot: CapabilitySnapshot): PreviewCounter {
  const reading = readCounter(text, snapshot);
  return {
    used: reading.used,
    max: reading.limit,
    remaining: reading.remaining,
    over: reading.level === 'over',
    nearLimit: reading.level === 'near',
  };
}

/** Which of the three announcement thresholds a reading sits at, if any. */
export type CounterThreshold = 'near' | 'over' | 'under';

/**
 * The threshold to announce, given where the counter was a keystroke ago.
 *
 * Announcing every keystroke makes a screen reader unusable while typing, so
 * only a crossing is announced: reaching ninety percent, going over, and
 * coming back under. Staying in a band announces nothing.
 */
export function crossedThreshold(
  previous: PreviewCounter | null,
  next: PreviewCounter,
): CounterThreshold | null {
  if (previous === null) {
    return null;
  }
  if (next.over && !previous.over) {
    return 'over';
  }
  if (!next.over && previous.over) {
    return 'under';
  }
  if (next.nearLimit && !previous.nearLimit && !previous.over) {
    return 'near';
  }
  return null;
}
