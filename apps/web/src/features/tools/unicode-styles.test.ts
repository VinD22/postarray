import { describe, expect, it } from 'vitest';

import {
  COMBINING_STRIKETHROUGH,
  COMBINING_UNDERLINE,
  UNICODE_STYLES,
  styleText,
  stylesFor,
  unicodeStyle,
  type UnicodeStyleId,
} from './unicode-styles';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Code points Unicode has reserved inside the styled alphabet blocks. */
function hasUnassignedCodePoint(text: string): boolean {
  for (const char of text) {
    const point = char.codePointAt(0) ?? 0;
    // The holes inside the Mathematical Alphanumeric Symbols block.
    const reserved = [
      0x1d455, 0x1d49d, 0x1d4a0, 0x1d4a1, 0x1d4a3, 0x1d4a4, 0x1d4a7, 0x1d4a8, 0x1d4ad, 0x1d4ba,
      0x1d4bc, 0x1d4c4, 0x1d506, 0x1d50b, 0x1d50c, 0x1d515, 0x1d51d, 0x1d53a, 0x1d53f, 0x1d545,
      0x1d547, 0x1d548, 0x1d549, 0x1d551,
    ];
    if (reserved.includes(point)) {
      return true;
    }
  }
  return false;
}

describe('UNICODE_STYLES', () => {
  it('carries a distinct id per style', () => {
    const ids = UNICODE_STYLES.map((style) => style.id);
    expect(new Set(ids).size).toBe(UNICODE_STYLES.length);
  });

  it('never emits a reserved code point for any letter', () => {
    for (const style of UNICODE_STYLES) {
      expect(hasUnassignedCodePoint(style.transform(ALPHABET)), style.id).toBe(false);
    }
  });

  it('changes the alphabet in every style, so no style is a silent no-op', () => {
    for (const style of UNICODE_STYLES) {
      expect(style.transform(ALPHABET), style.id).not.toBe(ALPHABET);
    }
  });

  it('leaves an empty input empty', () => {
    for (const style of UNICODE_STYLES) {
      expect(style.transform(''), style.id).toBe('');
    }
  });

  it('preserves newlines, so a pasted bio keeps its line breaks', () => {
    for (const style of UNICODE_STYLES) {
      expect(style.transform('one\ntwo').split('\n')).toHaveLength(2);
    }
  });

  it('passes an emoji through whole rather than splitting a surrogate pair', () => {
    for (const style of UNICODE_STYLES) {
      expect(style.transform('a🌱b'), style.id).toContain('🌱');
    }
  });
});

describe('individual mappings', () => {
  it('maps the serif bold alphabet to the Mathematical Alphanumeric Symbols block', () => {
    expect(unicodeStyle('boldSerif')?.transform('Relay 12')).toBe('𝐑𝐞𝐥𝐚𝐲 𝟏𝟐');
  });

  it('uses the Planck constant sign for italic h, because U+1D455 is reserved', () => {
    expect(unicodeStyle('italicSerif')?.transform('h')).toBe('ℎ');
  });

  it('uses the letterlike forms where the script block has holes', () => {
    expect(unicodeStyle('script')?.transform('BEFHILMR')).toBe('ℬℰℱℋℐℒℳℛ');
    expect(unicodeStyle('script')?.transform('ego')).toBe('ℯℊℴ');
  });

  it('uses the letterlike forms where the fraktur and double-struck blocks have holes', () => {
    expect(unicodeStyle('fraktur')?.transform('CHIRZ')).toBe('ℭℌℑℜℨ');
    expect(unicodeStyle('doubleStruck')?.transform('CHNPQRZ')).toBe('ℂℍℕℙℚℝℤ');
  });

  it('circles zero with the circled digit zero rather than the code point before circled one', () => {
    expect(unicodeStyle('circled')?.transform('012')).toBe('⓪①②');
  });

  it('leaves x alone in small capitals, because Unicode has no small capital X', () => {
    expect(unicodeStyle('smallCaps')?.transform('box')).toBe('ʙᴏx');
  });

  it('upper-cases before squaring, because the squared block has no lower case', () => {
    expect(unicodeStyle('squared')?.transform('ab')).toBe(unicodeStyle('squared')?.transform('AB'));
  });

  it('follows each character with the combining mark for the two line styles', () => {
    expect(unicodeStyle('strikethrough')?.transform('ab')).toBe(
      `a${COMBINING_STRIKETHROUGH}b${COMBINING_STRIKETHROUGH}`,
    );
    expect(unicodeStyle('underline')?.transform('ab')).toBe(
      `a${COMBINING_UNDERLINE}b${COMBINING_UNDERLINE}`,
    );
  });

  it('leaves punctuation and unmapped characters exactly as typed', () => {
    expect(unicodeStyle('boldSerif')?.transform('@relay #ok!')).toContain('@');
    expect(unicodeStyle('boldSerif')?.transform('@relay #ok!')).toContain('#');
    expect(unicodeStyle('boldSerif')?.transform('@relay #ok!')).toContain('!');
  });
});

describe('stylesFor', () => {
  it('returns the requested styles in the module order, not the caller order', () => {
    const ids: readonly UnicodeStyleId[] = ['smallCaps', 'boldSerif', 'script'];
    expect(stylesFor(ids).map((style) => style.id)).toEqual(['boldSerif', 'script', 'smallCaps']);
  });

  it('returns nothing for an empty request', () => {
    expect(stylesFor([])).toHaveLength(0);
  });

  it('never returns a style twice for a repeated id', () => {
    expect(stylesFor(['script', 'script'])).toHaveLength(1);
  });
});

describe('styleText', () => {
  it('renders one sample per requested style, each carrying its own copy keys', () => {
    const samples = styleText('relay', ['boldSerif', 'script']);
    expect(samples.map((sample) => sample.id)).toEqual(['boldSerif', 'script']);
    for (const sample of samples) {
      expect(sample.nameKey.startsWith('web.toolDirectory.fontGenerator.style.')).toBe(true);
      expect(sample.noteKey.startsWith('web.toolDirectory.fontGenerator.style.')).toBe(true);
      expect(sample.text).not.toBe('relay');
    }
  });

  it('is pure: the same input gives the same output every time', () => {
    const ids: readonly UnicodeStyleId[] = ['boldSerif', 'fraktur', 'underline'];
    expect(styleText('hello there', ids)).toEqual(styleText('hello there', ids));
  });
});
