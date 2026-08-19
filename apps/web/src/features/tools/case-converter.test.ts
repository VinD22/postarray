import { describe, expect, it } from 'vitest';

import { convertCase } from './case-converter';

describe('convertCase: upper and lower', () => {
  it('upper-cases plain text but leaves a URL, hashtag and mention untouched', () => {
    const body = 'check this out https://Example.test/Path #Launch @Jane';
    const result = convertCase(body, 'upper');

    expect(result.text).toBe('CHECK THIS OUT https://Example.test/Path #Launch @Jane');
    expect(result.preservedCount).toBe(3);
  });

  it('lower-cases plain text but leaves a URL, hashtag and mention untouched', () => {
    const body = 'CHECK THIS OUT https://Example.test/Path #Launch @Jane';
    const result = convertCase(body, 'lower');

    expect(result.text).toBe('check this out https://Example.test/Path #Launch @Jane');
  });
});

describe('convertCase: title', () => {
  it('capitalizes the first letter of every plain word and lowercases the rest', () => {
    const result = convertCase('THE quick BROWN fox', 'title');
    expect(result.text).toBe('The Quick Brown Fox');
  });

  it('never title-cases inside a URL, a hashtag or a mention', () => {
    const body = 'read the recap at https://example.test/MyPost #bigNews from @TeamRelay';
    const result = convertCase(body, 'title');

    expect(result.text).toBe('Read The Recap At https://example.test/MyPost #bigNews From @TeamRelay');
  });

  it('keeps an apostrophe inside a word as one token', () => {
    expect(convertCase("don't stop", 'title').text).toBe("Don't Stop");
  });
});

describe('convertCase: sentence', () => {
  it('capitalizes the first letter of the body and after every sentence end', () => {
    const result = convertCase('hello world. is this working? yes it is!', 'sentence');
    expect(result.text).toBe('Hello world. Is this working? Yes it is!');
  });

  it('does not let a protected span consume the pending capital, so the word right after it still opens capitalized', () => {
    const result = convertCase('@relay just shipped. #v2 is live', 'sentence');
    expect(result.text).toBe('@relay Just shipped. #v2 Is live');
  });

  it('leaves a leading mention exactly as typed while still capitalizing the sentence content after it', () => {
    const result = convertCase('@RELAY hello there. NEW post', 'sentence');
    expect(result.text).toBe('@RELAY Hello there. New post');
  });

  it('treats the punctuation after a URL as the real sentence end, even though the URL itself is untouched', () => {
    const result = convertCase('SEE https://Example.test/Path. it works', 'sentence');
    expect(result.text).toBe('See https://Example.test/Path. It works');
  });
});

describe('convertCase: general', () => {
  it('reports how many spans were preserved', () => {
    expect(convertCase('no tags here', 'upper').preservedCount).toBe(0);
    expect(convertCase('#one #two @three', 'upper').preservedCount).toBe(3);
  });

  it('handles an empty body without throwing', () => {
    for (const mode of ['sentence', 'title', 'upper', 'lower'] as const) {
      expect(convertCase('', mode).text).toBe('');
    }
  });

  it('round trips a body with no protected spans at all', () => {
    expect(convertCase('Plain Caption Text', 'lower').text).toBe('plain caption text');
  });
});
