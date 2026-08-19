import { describe, expect, it } from 'vitest';

import { findCharacterCounterPage } from './character-counter';
import { splitThread, type CharacterCounterPage } from './thread-splitter';

function xPage(): CharacterCounterPage {
  const page = findCharacterCounterPage('x');
  if (!page) {
    throw new Error('expected the x character counter page to exist');
  }
  return page;
}

/** A small, easy to reason about ceiling: plain UTF-16 count, no link rule. */
function testPage(maxLength: number): CharacterCounterPage {
  return {
    ...xPage(),
    maxLength,
    countingUnit: 'utf16',
    linkCountingMode: 'none',
    charactersPerLink: null,
  };
}

describe('splitThread: trivial cases', () => {
  it('returns no parts for an empty or whitespace-only body', () => {
    expect(splitThread('', testPage(50)).parts).toEqual([]);
    expect(splitThread('   \n\n  ', testPage(50)).parts).toEqual([]);
  });

  it('returns one part when the whole body already fits', () => {
    const result = splitThread('Hello there', testPage(50));

    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toMatchObject({ index: 1, text: 'Hello there', over: 0 });
    expect(result.limit).toBe(50);
  });

  it('numbers parts starting at one, in order', () => {
    const body = 'aaaaaaaaaa\n\nbbbbbbbbbb\n\ncccccccccc';
    const result = splitThread(body, testPage(10));

    expect(result.parts.map((part) => part.index)).toEqual([1, 2, 3]);
  });
});

describe('splitThread: paragraph boundaries', () => {
  it('splits at a paragraph break rather than joining paragraphs that would overflow', () => {
    const first = 'a'.repeat(40);
    const second = 'b'.repeat(40);
    const result = splitThread(`${first}\n\n${second}`, testPage(50));

    expect(result.parts.map((part) => part.text)).toEqual([first, second]);
    expect(result.parts.every((part) => part.over === 0)).toBe(true);
  });

  it('packs several short paragraphs onto one part when they fit together', () => {
    const result = splitThread('one\n\ntwo\n\nthree', testPage(100));

    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]?.text).toBe('one\n\ntwo\n\nthree');
  });
});

describe('splitThread: sentence boundaries', () => {
  it('breaks an over-long paragraph at sentence ends rather than the paragraph vanishing whole', () => {
    const paragraph = 'One sentence here. A second sentence follows. A third sentence closes it.';
    const result = splitThread(paragraph, testPage(40));

    expect(result.parts.length).toBeGreaterThan(1);
    expect(result.parts.every((part) => part.over === 0)).toBe(true);
    // Every sentence survives whole, in order, split only between sentences.
    expect(result.parts.map((part) => part.text).join(' ')).toBe(
      'One sentence here. A second sentence follows. A third sentence closes it.',
    );
  });
});

describe('splitThread: word boundaries', () => {
  it('breaks an over-long sentence at word gaps and never mid-word', () => {
    const sentence = Array.from({ length: 10 }, (_, i) => `word${i}`).join(' ');
    const result = splitThread(sentence, testPage(20));

    expect(result.parts.length).toBeGreaterThan(1);
    expect(result.parts.every((part) => part.over === 0)).toBe(true);

    // Reassembling every part's words reproduces every original word, whole.
    const originalWords = sentence.split(' ');
    const rebuiltWords = result.parts.flatMap((part) => part.text.split(' '));
    expect(rebuiltWords).toEqual(originalWords);
  });

  it('never splits inside a single word, even one word is not a full sentence', () => {
    const result = splitThread('supercalifragilisticexpialidocious and friends', testPage(15));

    for (const part of result.parts) {
      for (const word of part.text.split(' ')) {
        expect(word).not.toBe('');
      }
    }
    expect(result.parts.flatMap((part) => part.text.split(' '))).toEqual([
      'supercalifragilisticexpialidocious',
      'and',
      'friends',
    ]);
  });

  it('lets a single word that cannot fit any part stand alone, flagged over the limit', () => {
    const longWord = 'a'.repeat(30);
    const result = splitThread(longWord, testPage(10));

    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toMatchObject({ text: longWord, over: 20 });
  });
});

describe('splitThread reuses the shared link counting rule', () => {
  it('measures a part on X the same way the character counter does: a link costs the fixed 23, not its real length', () => {
    const longUrl = 'https://example.test/a-path-that-is-far-longer-than-twenty-three-characters';
    const page = xPage();
    expect(page.maxLength).toBe(280);
    expect(page.charactersPerLink).toBe(23);
    expect(longUrl.length).toBeGreaterThan(23);

    // Literal length is well past 280, but the link is charged at 23, so the
    // whole thing fits in one part rather than being split in two.
    const body = `${'a'.repeat(240)} ${longUrl}`;
    expect(body.length).toBeGreaterThan(280);

    const result = splitThread(body, page);

    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]?.count).toBe(240 + 1 + 23);
    expect(result.parts[0]?.over).toBe(0);
  });

  it('splits where the fixed-rule count, not the literal count, actually overflows', () => {
    const longUrl = 'https://example.test/a-path-that-is-far-longer-than-twenty-three-characters';
    const page = xPage();
    // Each sentence alone fits under the fixed-rule count; together they do
    // not, so the split has to land between the two sentences.
    const body = `${'a'.repeat(200)} ${longUrl}. ${'b'.repeat(200)} ${longUrl}.`;

    const result = splitThread(body, page);

    expect(result.parts.length).toBeGreaterThan(1);
    expect(result.parts.every((part) => part.over === 0)).toBe(true);
  });
});

describe('splitThread: every part respects the stated limit field', () => {
  it('stamps the same limit onto the result and every part', () => {
    const result = splitThread('a\n\nb\n\nc'.repeat(5), testPage(12));

    expect(result.limit).toBe(12);
    for (const part of result.parts) {
      expect(part.limit).toBe(12);
    }
  });
});
