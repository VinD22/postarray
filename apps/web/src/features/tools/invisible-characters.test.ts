import { describe, expect, it } from 'vitest';

import { findInvisibleCharacters, INVISIBLE_CHARACTERS } from './invisible-characters';

describe('INVISIBLE_CHARACTERS', () => {
  it('carries a distinct id, character and codepoint for every entry', () => {
    const ids = INVISIBLE_CHARACTERS.map((entry) => entry.id);
    const chars = INVISIBLE_CHARACTERS.map((entry) => entry.char);
    const codepoints = INVISIBLE_CHARACTERS.map((entry) => entry.codepoint);

    expect(new Set(ids).size).toBe(INVISIBLE_CHARACTERS.length);
    expect(new Set(chars).size).toBe(INVISIBLE_CHARACTERS.length);
    expect(new Set(codepoints).size).toBe(INVISIBLE_CHARACTERS.length);
  });

  it("states the codepoint as U+ followed by the character's real hex value", () => {
    for (const entry of INVISIBLE_CHARACTERS) {
      const hex = entry.char.codePointAt(0)?.toString(16).toUpperCase();
      expect(entry.codepoint).toBe(`U+${hex}`);
    }
  });

  it('lists at least the three characters the tool promises: braille blank, zero width space and zero width joiner', () => {
    const codepoints = new Set(INVISIBLE_CHARACTERS.map((entry) => entry.codepoint));
    expect(codepoints.has('U+2800')).toBe(true);
    expect(codepoints.has('U+200B')).toBe(true);
    expect(codepoints.has('U+200D')).toBe(true);
  });
});

describe('findInvisibleCharacters', () => {
  it('finds nothing in ordinary text', () => {
    expect(findInvisibleCharacters('just a normal caption')).toEqual([]);
  });

  it('finds a single pasted character and counts it once', () => {
    const zeroWidthSpace = INVISIBLE_CHARACTERS.find((entry) => entry.codepoint === 'U+200B');
    expect(zeroWidthSpace).toBeDefined();
    if (!zeroWidthSpace) {
      return;
    }

    const result = findInvisibleCharacters(`before${zeroWidthSpace.char}after`);
    expect(result).toEqual([{ entry: zeroWidthSpace, count: 1 }]);
  });

  it('counts repeats of the same character', () => {
    const brailleBlank = INVISIBLE_CHARACTERS.find((entry) => entry.codepoint === 'U+2800');
    expect(brailleBlank).toBeDefined();
    if (!brailleBlank) {
      return;
    }

    const pasted = brailleBlank.char.repeat(3);
    expect(findInvisibleCharacters(pasted)).toEqual([{ entry: brailleBlank, count: 3 }]);
  });

  it('reports every distinct character present, in catalog order', () => {
    const [first, second] = INVISIBLE_CHARACTERS;
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    if (!first || !second) {
      return;
    }

    const pasted = `${second.char}text${first.char}`;
    const result = findInvisibleCharacters(pasted);

    expect(result.map((match) => match.entry.id)).toEqual([first.id, second.id]);
  });
});
