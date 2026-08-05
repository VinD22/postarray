import type { LinkCountingMode, TextCapability } from '@relay/contracts';

/**
 * Text measurement. Every provider counts differently and every off by one bug in a
 * character counter lives here, so the counting rules are explicit and tested rather than
 * implied by `String.length`.
 */

/** A URL as it appears in a body, with the exact slice it occupies. */
export interface DetectedUrl {
  readonly url: string;
  readonly offset: number;
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
    // Trailing sentence punctuation is part of the sentence, not of the link.
    const trimmed = value.replace(/[.,;:!?]+$/u, '');
    found.push({ url: trimmed, offset: match.index, length: trimmed.length });
  }
  return found;
}

export function containsUrl(body: string): boolean {
  return detectUrls(body).length > 0;
}

/** Count of grapheme clusters, which is what a human means by "characters". */
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
 * X's weighted counting. Code points inside the documented light ranges count as one and
 * everything else, including most emoji and CJK, counts as two.
 * Source: X developer documentation on counting characters, retrieved 4 August 2026.
 */
const X_LIGHT_RANGES: readonly (readonly [number, number])[] = [
  [0, 4351],
  [8192, 8205],
  [8208, 8223],
  [8242, 8247],
];

function isLightCodePoint(codePoint: number): boolean {
  return X_LIGHT_RANGES.some(([start, end]) => codePoint >= start && codePoint <= end);
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

export const COUNTING_UNITS = ['utf16', 'grapheme', 'weighted'] as const;
export type CountingUnit = (typeof COUNTING_UNITS)[number];

export interface CountOptions {
  readonly unit: CountingUnit;
  readonly linkCounting: {
    readonly mode: LinkCountingMode;
    readonly charactersPerLink: number | null;
  };
}

function countRaw(body: string, unit: CountingUnit): number {
  switch (unit) {
    case 'utf16':
      return countUtf16(body);
    case 'grapheme':
      return countGraphemes(body);
    case 'weighted':
      return countWeighted(body);
  }
}

/**
 * The number the composer's counter shows. When a provider rewrites links to a fixed
 * width (X's t.co), every URL is replaced by that fixed cost before counting.
 */
export function countText(body: string, options: CountOptions): number {
  const { mode, charactersPerLink } = options.linkCounting;
  if (mode !== 'fixed' || charactersPerLink === null) {
    return countRaw(body, options.unit);
  }
  const urls = detectUrls(body);
  if (urls.length === 0) {
    return countRaw(body, options.unit);
  }
  let remainder = '';
  let cursor = 0;
  for (const url of urls) {
    remainder += body.slice(cursor, url.offset);
    cursor = url.offset + url.length;
  }
  remainder += body.slice(cursor);
  return countRaw(remainder, options.unit) + urls.length * charactersPerLink;
}

export function countForCapability(
  body: string,
  text: TextCapability,
  unit: CountingUnit,
): number {
  return countText(body, { unit, linkCounting: text.linkCounting });
}

/**
 * The index at which the provider visually truncates, or null when the whole body fits.
 * The index is a UTF-16 offset so a renderer can slice the string directly.
 */
export function truncationIndex(
  body: string,
  limit: number,
  options: CountOptions,
): number | null {
  if (countText(body, options) <= limit) {
    return null;
  }
  let low = 0;
  let high = body.length;
  while (low < high) {
    const middle = Math.floor((low + high + 1) / 2);
    if (countText(body.slice(0, middle), options) <= limit) {
      low = middle;
    } else {
      high = middle - 1;
    }
  }
  return low;
}

/** Split a body into thread sized parts on whitespace, never mid word. */
export function splitIntoParts(body: string, limit: number, options: CountOptions): string[] {
  const tokens = body.split(/(\s+)/u).filter((token) => token !== '');
  const parts: string[] = [];
  let current = '';
  for (const token of tokens) {
    const candidate = current + token;
    if (current !== '' && countText(candidate, options) > limit) {
      parts.push(current.trimEnd());
      current = token.trimStart();
    } else {
      current = candidate;
    }
  }
  if (current.trim() !== '') {
    parts.push(current.trimEnd());
  }
  return parts;
}

/**
 * A stable, normalized form used for duplicate and substantially-similar detection.
 * Case, whitespace, URLs and punctuation are removed so two posts that differ only in a
 * tracking parameter are recognised as the same content.
 */
export function normalizeForSimilarity(body: string): string {
  return body
    .replace(URL_PATTERN, ' ')
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function tokenSet(body: string): Set<string> {
  return new Set(normalizeForSimilarity(body).split(' ').filter((token) => token !== ''));
}

/** Jaccard similarity over token sets. 1 means identical after normalization. */
export function similarity(left: string, right: string): number {
  const leftTokens = tokenSet(left);
  const rightTokens = tokenSet(right);
  if (leftTokens.size === 0 && rightTokens.size === 0) {
    return 1;
  }
  let shared = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      shared += 1;
    }
  }
  const union = leftTokens.size + rightTokens.size - shared;
  return union === 0 ? 0 : shared / union;
}

/**
 * The threshold above which two posts count as substantially similar. X prohibits posting
 * duplicate or substantially similar content across accounts, so the check is a publish
 * blocker rather than a warning.
 */
export const SUBSTANTIALLY_SIMILAR_THRESHOLD = 0.9;

export function isSubstantiallySimilar(left: string, right: string): boolean {
  return similarity(left, right) >= SUBSTANTIALLY_SIMILAR_THRESHOLD;
}
