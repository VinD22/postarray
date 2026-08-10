import { describe, expect, it } from 'vitest';

import {
  countGraphemes,
  countText,
  countUtf16,
  countWeighted,
  detectUrls,
  takeGraphemes,
} from './text-count';

/** A family emoji: several code points joined by zero width joiners. */
const FAMILY = '\u{1F469}\u200d\u{1F469}\u200d\u{1F467}';
/** A flag: two regional indicator symbols. */
const FLAG = '\u{1F1EF}\u{1F1F5}';
/** Latin small e followed by a separate combining acute accent (decomposed). */
const COMBINING = 'e\u0301';
/** The same letter as one precomposed code point. */
const PRECOMPOSED = '\u00e9';
/** Arabic for "hello", written right to left. Five letters, no combining marks. */
const ARABIC = '\u0645\u0631\u062d\u0628\u0627';

describe('grapheme counting', () => {
  it('counts an emoji as one character and not as its code units', () => {
    expect(countGraphemes('a')).toBe(1);
    expect(countGraphemes(FAMILY)).toBe(1);
    expect(countUtf16(FAMILY)).toBe(8);
  });

  it('counts a flag as one character', () => {
    expect(countGraphemes(FLAG)).toBe(1);
    expect(countUtf16(FLAG)).toBe(4);
  });

  it('counts a base letter plus a combining mark as one character', () => {
    expect(countGraphemes(COMBINING)).toBe(1);
    expect(countUtf16(COMBINING)).toBe(2);
    expect(countGraphemes(`caf${COMBINING}`)).toBe(4);
    expect(countUtf16(`caf${COMBINING}`)).toBe(5);
    expect(countGraphemes(`caf${PRECOMPOSED}`)).toBe(4);
  });

  it('counts a right to left string by its letters, not its display order', () => {
    expect(countGraphemes(ARABIC)).toBe(5);
    expect(countUtf16(ARABIC)).toBe(5);
    expect(countGraphemes(`${ARABIC}${FLAG}`)).toBe(6);
  });

  it('weights non-Latin code points as two', () => {
    expect(countWeighted('hello')).toBe(5);
    expect(countWeighted('日本')).toBe(4);
    expect(countWeighted(FLAG)).toBe(4);
  });

  it('takes whole graphemes for a preview', () => {
    expect(takeGraphemes(`ab${FAMILY}cd`, 3)).toBe(`ab${FAMILY}`);
    expect(takeGraphemes('ab', 9)).toBe('ab');
  });
});

describe('link detection', () => {
  it('finds every http and https URL in order', () => {
    const urls = detectUrls('see https://example.test/a and http://example.test/b now');
    expect(urls.map((url) => url.url)).toEqual([
      'https://example.test/a',
      'http://example.test/b',
    ]);
  });

  it('leaves trailing sentence punctuation out of the link', () => {
    const [first] = detectUrls('read https://example.test/page.');
    expect(first?.url).toBe('https://example.test/page');
  });

  it('ignores text that is not a URL', () => {
    expect(detectUrls('example.test is not linked')).toEqual([]);
  });
});

describe('link counting modes', () => {
  const LONG = 'https://example.test/a-very-long-path-that-keeps-going-and-going';

  it('charges a flat cost per link under the fixed mode', () => {
    const body = `hi ${LONG}`;
    expect(
      countText(body, { unit: 'grapheme', linkCountingMode: 'fixed', charactersPerLink: 23 }),
    ).toBe(3 + 23);
  });

  it('charges every link separately under the fixed mode', () => {
    const body = `${LONG} ${LONG}`;
    expect(
      countText(body, { unit: 'grapheme', linkCountingMode: 'fixed', charactersPerLink: 23 }),
    ).toBe(23 + 1 + 23);
  });

  it('charges the real length under the actual mode', () => {
    const body = `hi ${LONG}`;
    expect(
      countText(body, { unit: 'grapheme', linkCountingMode: 'actual', charactersPerLink: null }),
    ).toBe(countGraphemes(body));
  });

  it('falls back to the raw count when a fixed mode carries no cost', () => {
    const body = `hi ${LONG}`;
    expect(
      countText(body, { unit: 'grapheme', linkCountingMode: 'fixed', charactersPerLink: null }),
    ).toBe(countGraphemes(body));
  });

  it('applies the unit to the text around a fixed cost link', () => {
    const body = `日本 ${LONG}`;
    expect(
      countText(body, { unit: 'weighted', linkCountingMode: 'fixed', charactersPerLink: 23 }),
    ).toBe(4 + 1 + 23);
  });
});
