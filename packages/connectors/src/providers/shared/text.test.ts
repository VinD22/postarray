import { describe, expect, it } from 'vitest';

import {
  containsUrl,
  countGraphemes,
  countText,
  countUtf16,
  countWeighted,
  detectUrls,
  isSubstantiallySimilar,
  normalizeForSimilarity,
  similarity,
  splitIntoParts,
  truncationIndex,
} from './text.js';

const FIXED_23 = {
  unit: 'weighted' as const,
  linkCounting: { mode: 'fixed' as const, charactersPerLink: 23 },
};
const ACTUAL = {
  unit: 'grapheme' as const,
  linkCounting: { mode: 'actual' as const, charactersPerLink: null },
};

describe('URL detection', () => {
  it('finds every URL with its exact slice', () => {
    const text = 'See https://example.invalid/a and https://example.invalid/b too.';
    const urls = detectUrls(text);
    expect(urls).toHaveLength(2);
    expect(urls[0]?.url).toBe('https://example.invalid/a');
    expect(text.slice(urls[0]?.offset ?? 0, (urls[0]?.offset ?? 0) + (urls[0]?.length ?? 0))).toBe(
      'https://example.invalid/a',
    );
  });

  it('leaves trailing sentence punctuation out of the link', () => {
    const [url] = detectUrls('Read https://example.invalid/page.');
    expect(url?.url).toBe('https://example.invalid/page');
  });

  it('reports whether a body carries a link at all, which is what X prices on', () => {
    expect(containsUrl('No link here.')).toBe(false);
    expect(containsUrl('One at http://example.invalid')).toBe(true);
  });
});

describe('counting units', () => {
  it('counts UTF-16 code units, grapheme clusters and weighted units differently', () => {
    const family = '👨‍👩‍👧';
    expect(countUtf16(family)).toBeGreaterThan(1);
    expect(countGraphemes(family)).toBe(1);
    expect(countWeighted(family)).toBeGreaterThan(countGraphemes(family));
  });

  it('counts a Latin sentence identically under every unit that treats it as light', () => {
    const text = 'Plain ASCII sentence.';
    expect(countUtf16(text)).toBe(text.length);
    expect(countGraphemes(text)).toBe(text.length);
    expect(countWeighted(text)).toBe(text.length);
  });

  it('weights CJK at two units, as X documents', () => {
    expect(countWeighted('日本語')).toBe(6);
    expect(countGraphemes('日本語')).toBe(3);
  });

  it('replaces every link with the provider fixed width when the mode is fixed', () => {
    const text = 'Go: https://a-very-long-example-domain.invalid/with/a/long/path';
    expect(countText(text, FIXED_23)).toBe(countWeighted('Go: ') + 23);
    expect(countText(text, ACTUAL)).toBe(countGraphemes(text));
  });

  it('handles a body of only a link', () => {
    expect(countText('https://example.invalid/x', FIXED_23)).toBe(23);
  });
});

describe('truncation', () => {
  it('returns null when the body fits', () => {
    expect(truncationIndex('short', 100, ACTUAL)).toBeNull();
  });

  it('returns the last index that still fits', () => {
    const index = truncationIndex('a'.repeat(50), 10, ACTUAL);
    expect(index).toBe(10);
  });

  it('never splits inside a grapheme cluster count', () => {
    const body = '🌱'.repeat(20);
    const index = truncationIndex(body, 5, ACTUAL);
    expect(index).not.toBeNull();
    expect(countGraphemes(body.slice(0, index ?? 0))).toBeLessThanOrEqual(5);
  });
});

describe('splitting into thread parts', () => {
  it('never splits a word', () => {
    const parts = splitIntoParts('alpha beta gamma delta epsilon', 12, ACTUAL);
    expect(parts.every((part) => !part.startsWith(' '))).toBe(true);
    expect(parts.join(' ')).toBe('alpha beta gamma delta epsilon');
  });

  it('keeps every part inside the limit', () => {
    const parts = splitIntoParts('one two three four five six seven eight', 10, ACTUAL);
    expect(parts.every((part) => countText(part, ACTUAL) <= 10)).toBe(true);
  });
});

describe('duplicate and substantially similar detection', () => {
  it('ignores case, punctuation and URLs when normalizing', () => {
    expect(normalizeForSimilarity('Hello, World! https://a.invalid')).toBe('hello world');
  });

  it('treats two posts that differ only by a tracking parameter as identical', () => {
    const left = 'Read the launch note https://example.invalid/post?utm_source=x';
    const right = 'Read the launch note https://example.invalid/post?utm_source=linkedin';
    expect(similarity(left, right)).toBe(1);
    expect(isSubstantiallySimilar(left, right)).toBe(true);
  });

  it('does not flag genuinely different posts', () => {
    expect(
      isSubstantiallySimilar('We shipped the scheduler today.', 'Hiring a designer in Berlin.'),
    ).toBe(false);
  });

  it('treats two empty bodies as identical rather than dividing by zero', () => {
    expect(similarity('', '')).toBe(1);
  });
});
