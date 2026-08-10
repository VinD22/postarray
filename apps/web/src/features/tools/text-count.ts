import type { LimitCountingUnit } from '@/features/marketing/data/publishing-limits-types';

/**
 * Text measurement for the public tools.
 *
 * These rules are the same ones the connector package applies before it
 * validates a draft. They are restated here rather than imported because
 * `apps/web` may not depend on `@relay/connectors`, and because this code has
 * to run in the reader's browser with no server round trip. The connector
 * implementation stays the source of truth for publishing; this one exists so a
 * public page can show the same number without an account.
 *
 * The rules, in the order they matter:
 *
 *  1. A character is a grapheme cluster. `String.length` counts UTF-16 code
 *     units, which makes one emoji two and a family emoji seven, and makes a
 *     combining mark its own character. `Intl.Segmenter` counts what a reader
 *     would count.
 *  2. Some platforms document a different unit anyway, so the unit is a
 *     parameter rather than an assumption.
 *  3. A platform that rewrites links to its own shortener charges a flat width
 *     per link. The real URL length is irrelevant on those platforms.
 */

export interface DetectedUrl {
  readonly url: string;
  /** UTF-16 offset of the first character of the URL in the body. */
  readonly offset: number;
  /** UTF-16 length of the URL as it appears in the body. */
  readonly length: number;
}

const URL_PATTERN = /\bhttps?:\/\/[^\s<>"')\]]+/giu;

/** Every http or https URL in the body, in order of appearance. */
export function detectUrls(body: string): DetectedUrl[] {
  const found: DetectedUrl[] = [];
  for (const match of body.matchAll(URL_PATTERN)) {
    const [value] = match;
    if (value === undefined || match.index === undefined) {
      continue;
    }
    // Trailing sentence punctuation belongs to the sentence, not to the link.
    const trimmed = value.replace(/[.,;:!?]+$/u, '');
    found.push({ url: trimmed, offset: match.index, length: trimmed.length });
  }
  return found;
}

/**
 * Count of grapheme clusters. A locale is not passed: grapheme segmentation is
 * the same for every locale in the Unicode rules we care about here, and a
 * fixed segmenter keeps the number identical for every reader.
 */
export function countGraphemes(body: string): number {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  let total = 0;
  for (const _segment of segmenter.segment(body)) {
    total += 1;
  }
  return total;
}

/** Count of UTF-16 code units, which is what `String.length` returns. */
export function countUtf16(body: string): number {
  return body.length;
}

/**
 * Two-tier weighted counting. Code points inside the documented light ranges
 * cost one; everything else, which includes most emoji and all CJK, costs two.
 */
const LIGHT_RANGES: readonly (readonly [number, number])[] = [
  [0, 4351],
  [8192, 8205],
  [8208, 8223],
  [8242, 8247],
];

function isLightCodePoint(codePoint: number): boolean {
  return LIGHT_RANGES.some(([start, end]) => codePoint >= start && codePoint <= end);
}

export function countWeighted(body: string): number {
  let total = 0;
  for (const character of body) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) {
      continue;
    }
    total += isLightCodePoint(codePoint) ? 1 : 2;
  }
  return total;
}

export function countRaw(body: string, unit: LimitCountingUnit): number {
  switch (unit) {
    case 'utf16':
      return countUtf16(body);
    case 'weighted':
      return countWeighted(body);
    case 'grapheme':
      return countGraphemes(body);
  }
}

export interface CountOptions {
  readonly unit: LimitCountingUnit;
  readonly linkCountingMode: 'none' | 'fixed' | 'actual';
  readonly charactersPerLink: number | null;
}

/**
 * The number the platform would measure.
 *
 * Under `fixed`, every detected URL is removed from the body and replaced by
 * the flat per-link cost, which is how a shortener-rewriting platform counts.
 * Under `actual` and `none` the body is counted as written.
 */
export function countText(body: string, options: CountOptions): number {
  const { unit, linkCountingMode, charactersPerLink } = options;
  if (linkCountingMode !== 'fixed' || charactersPerLink === null) {
    return countRaw(body, unit);
  }
  const urls = detectUrls(body);
  if (urls.length === 0) {
    return countRaw(body, unit);
  }
  let remainder = '';
  let cursor = 0;
  for (const url of urls) {
    remainder += body.slice(cursor, url.offset);
    cursor = url.offset + url.length;
  }
  remainder += body.slice(cursor);
  return countRaw(remainder, unit) + urls.length * charactersPerLink;
}

/**
 * The first `count` graphemes of a body, for a preview that does not split an
 * emoji in half. Returns the whole body when it is already short enough.
 */
export function takeGraphemes(body: string, count: number): string {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  let taken = 0;
  let out = '';
  for (const segment of segmenter.segment(body)) {
    if (taken >= count) {
      return out;
    }
    out += segment.segment;
    taken += 1;
  }
  return out;
}
