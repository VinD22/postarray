import { describe, expect, it } from 'vitest';

import { countHashtagsAndMentions } from './hashtag-counter';

describe('countHashtagsAndMentions', () => {
  it('counts hashtags and mentions separately', () => {
    const result = countHashtagsAndMentions('New drop #launch #sale cc @jane @john');

    expect(result.hashtagCount).toBe(2);
    expect(result.mentionCount).toBe(2);
    expect(result.hashtags.map((token) => token.text)).toEqual(['#launch', '#sale']);
    expect(result.mentions.map((token) => token.text)).toEqual(['@jane', '@john']);
  });

  it('reports no duplicates when every hashtag is distinct', () => {
    const result = countHashtagsAndMentions('#one #two #three');

    expect(result.duplicateHashtags).toEqual([]);
    expect(result.uniqueHashtagCount).toBe(3);
  });

  it('flags a repeated hashtag once, with its total count', () => {
    const result = countHashtagsAndMentions('#launch big day #Launch again #launch #other');

    expect(result.hashtagCount).toBe(4);
    expect(result.duplicateHashtags).toEqual([{ text: '#launch', count: 3 }]);
    expect(result.uniqueHashtagCount).toBe(2);
  });

  it('treats hashtags as case insensitive duplicates but keeps the first casing seen', () => {
    const result = countHashtagsAndMentions('#Relay then #RELAY then #relay');

    expect(result.duplicateHashtags).toEqual([{ text: '#Relay', count: 3 }]);
  });

  it('can report more than one distinct duplicate group', () => {
    const result = countHashtagsAndMentions('#a #b #a #b #c');

    expect(result.duplicateHashtags).toEqual([
      { text: '#a', count: 2 },
      { text: '#b', count: 2 },
    ]);
    expect(result.uniqueHashtagCount).toBe(3);
  });

  it('does not count a hashtag or mention that only appears inside a URL', () => {
    const result = countHashtagsAndMentions(
      'Profile https://instagram.com/@handle and search ?q=%23nope, real tag #ship',
    );

    expect(result.hashtagCount).toBe(1);
    expect(result.mentionCount).toBe(0);
  });

  it('returns zero for a post with neither', () => {
    const result = countHashtagsAndMentions('just a plain caption');

    expect(result.hashtagCount).toBe(0);
    expect(result.mentionCount).toBe(0);
    expect(result.uniqueHashtagCount).toBe(0);
    expect(result.duplicateHashtags).toEqual([]);
  });

  it('handles an empty body without throwing', () => {
    const result = countHashtagsAndMentions('');

    expect(result.hashtagCount).toBe(0);
    expect(result.mentionCount).toBe(0);
  });
});
