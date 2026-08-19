import { CHARACTER_COUNTER_PAGES, type CharacterCounterPage } from './character-counter';
import { countText } from './text-count';

/**
 * Thread splitting.
 *
 * The counting itself is not reimplemented here: `countText` from
 * `text-count.ts` is the same function the per platform character counters
 * use, so a network that rewrites links to a fixed width (X's 23 character
 * rule, among others) is measured here exactly as it is measured there. This
 * module only decides where to cut.
 *
 * The cut always prefers the largest boundary that still fits: a paragraph
 * break over a sentence break, a sentence break over a word break, and a word
 * is never split. A paragraph or a sentence that is too long on its own is
 * broken down one level finer and re-packed, which is what lets a single
 * run-on paragraph become several parts without losing a paragraph break that
 * would have fit as-is elsewhere. A single word (most often a very long URL
 * under a platform that counts links at their real length) that still does not
 * fit alone becomes its own oversized part rather than being cut mid-word: a
 * broken link is worse than a part that needs trimming by hand.
 */

export { CHARACTER_COUNTER_PAGES, type CharacterCounterPage };

export interface ThreadPart {
  /** 1-based position in the stack. */
  readonly index: number;
  readonly text: string;
  readonly count: number;
  readonly limit: number;
  /** Characters over the limit. Zero when the part fits. */
  readonly over: number;
}

export interface ThreadSplitResult {
  readonly limit: number;
  readonly parts: readonly ThreadPart[];
}

function splitParagraphs(body: string): readonly string[] {
  return body
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== '');
}

function splitSentences(paragraph: string): readonly string[] {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'sentence' });
  return [...segmenter.segment(paragraph)]
    .map((entry) => entry.segment.trim())
    .filter((sentence) => sentence !== '');
}

function splitWords(text: string): readonly string[] {
  return text.split(/\s+/u).filter((word) => word !== '');
}

type Fits = (candidate: string) => boolean;

interface FinerLevel {
  /** Break one oversized unit into the next, smaller granularity. */
  readonly split: (unit: string) => readonly string[];
  readonly joiner: string;
}

/**
 * Greedily pack `units` (all of the same granularity) into parts joined by
 * `joiner`. A unit too large to start a fresh, empty part is broken down into
 * the next entry in `finer` and packed recursively with whatever levels
 * remain after that, so a sentence that is still too long on its own can fall
 * through to words rather than standing as one oversized part. When `finer`
 * is empty the unit is already a single word: it becomes its own oversized
 * part, because cutting inside it would break it rather than the thread.
 */
function pack(
  units: readonly string[],
  joiner: string,
  fits: Fits,
  finer: readonly FinerLevel[],
): string[] {
  const parts: string[] = [];
  let current = '';

  for (const unit of units) {
    const candidate = current === '' ? unit : `${current}${joiner}${unit}`;
    if (fits(candidate)) {
      current = candidate;
      continue;
    }

    if (current !== '') {
      parts.push(current);
      current = '';
    }

    if (fits(unit)) {
      current = unit;
      continue;
    }

    const [next, ...rest] = finer;
    if (next) {
      const subParts = pack(next.split(unit), next.joiner, fits, rest);
      if (subParts.length > 0) {
        parts.push(...subParts.slice(0, -1));
        current = subParts[subParts.length - 1] ?? '';
      }
      continue;
    }

    // Already at word granularity and the single word does not fit alone
    // (almost always a link longer than the platform's whole ceiling). It
    // stands as its own part; the caller reports it as over the limit.
    parts.push(unit);
  }

  if (current !== '') {
    parts.push(current);
  }
  return parts;
}

/** Split `body` into numbered parts that each fit `page`'s ceiling. */
export function splitThread(body: string, page: CharacterCounterPage): ThreadSplitResult {
  const trimmed = body.trim();
  if (trimmed === '') {
    return { limit: page.maxLength, parts: [] };
  }

  const measure = (text: string): number =>
    countText(text, {
      unit: page.countingUnit,
      linkCountingMode: page.linkCountingMode,
      charactersPerLink: page.charactersPerLink,
    });
  const fits: Fits = (candidate) => measure(candidate) <= page.maxLength;

  const paragraphs = splitParagraphs(trimmed);
  const texts = pack(paragraphs, '\n\n', fits, [
    { split: splitSentences, joiner: ' ' },
    { split: splitWords, joiner: ' ' },
  ]);

  return {
    limit: page.maxLength,
    parts: texts.map((text, position) => {
      const count = measure(text);
      return {
        index: position + 1,
        text,
        count,
        limit: page.maxLength,
        over: Math.max(0, count - page.maxLength),
      };
    }),
  };
}
