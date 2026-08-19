import { describe, expect, it } from 'vitest';

import { detectHashtags, detectMentions } from './social-tokens';

describe('detectHashtags', () => {
  it('finds every hashtag with its offset and length', () => {
    const body = 'Launch day #relaunch and #v2 today';
    const found = detectHashtags(body);

    expect(found.map((token) => token.text)).toEqual(['#relaunch', '#v2']);
    for (const token of found) {
      expect(body.slice(token.offset, token.offset + token.length)).toBe(token.text);
    }
  });

  it('does not treat a mid word hash as a hashtag', () => {
    expect(detectHashtags('price#1 is not a tag')).toEqual([]);
  });

  it('ignores a hashtag that only exists inside a URL', () => {
    const body = 'See https://example.test/search?q=%23fun for more, not #real';
    expect(detectHashtags(body).map((token) => token.text)).toEqual(['#real']);
  });

  it('supports non Latin letters', () => {
    expect(detectHashtags('#日本語 today').map((token) => token.text)).toEqual(['#日本語']);
  });

  it('finds nothing in a post with no hashtag', () => {
    expect(detectHashtags('just plain text')).toEqual([]);
  });
});

describe('detectMentions', () => {
  it('finds every mention, allowing dots for a handle style name', () => {
    const body = 'cc @jane and @john.doe';
    expect(detectMentions(body).map((token) => token.text)).toEqual(['@jane', '@john.doe']);
  });

  it('does not read an email address as a mention', () => {
    expect(detectMentions('reach me at hello@example.com')).toEqual([]);
  });

  it('ignores a mention that only exists inside a URL path', () => {
    const body = 'Follow at https://instagram.com/@realhandle, not @spoofed here';
    expect(detectMentions(body).map((token) => token.text)).toEqual(['@spoofed']);
  });

  it('finds a mention at the very start of the post', () => {
    const body = '@relay just shipped this';
    expect(detectMentions(body).map((token) => token.text)).toEqual(['@relay']);
  });
});
