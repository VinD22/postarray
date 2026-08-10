import { describe, expect, it } from 'vitest';

import { composeUtmUrl, utmParameterName } from './utm';

describe('utm parameter names', () => {
  it('prefixes every field', () => {
    expect(utmParameterName('source')).toBe('utm_source');
    expect(utmParameterName('content')).toBe('utm_content');
  });
});

describe('utm composition', () => {
  it('adds parameters to a bare URL', () => {
    const result = composeUtmUrl('https://example.test/landing', {
      source: 'bluesky',
      medium: 'social',
      campaign: 'spring',
    });
    expect(result.url).toBe(
      'https://example.test/landing?utm_source=bluesky&utm_medium=social&utm_campaign=spring',
    );
    expect(result.preservedExistingQuery).toBe(false);
    expect(result.replaced).toEqual([]);
  });

  it('keeps an existing query string intact', () => {
    const result = composeUtmUrl('https://example.test/p?ref=news&page=2', { source: 'x' });
    expect(result.url).toBe('https://example.test/p?ref=news&page=2&utm_source=x');
    expect(result.preservedExistingQuery).toBe(true);
  });

  it('keeps a fragment at the end of the URL', () => {
    const result = composeUtmUrl('https://example.test/p?a=1#section-two', { medium: 'social' });
    expect(result.url).toBe('https://example.test/p?a=1&utm_medium=social#section-two');
  });

  it('replaces a UTM parameter the URL already carried, and says so', () => {
    const result = composeUtmUrl('https://example.test/p?utm_source=old&keep=yes', {
      source: 'new',
    });
    expect(result.url).toBe('https://example.test/p?utm_source=new&keep=yes');
    expect(result.replaced).toEqual(['source']);
    expect(result.preservedExistingQuery).toBe(true);
  });

  it('encodes spaces and accented characters', () => {
    const result = composeUtmUrl('https://example.test/p', { campaign: 'été spécial' });
    expect(result.url).toBe('https://example.test/p?utm_campaign=%C3%A9t%C3%A9+sp%C3%A9cial');
  });

  it('does not double encode a value that is already encoded', () => {
    const result = composeUtmUrl('https://example.test/p', { campaign: 'a%20b' });
    expect(result.url).toBe('https://example.test/p?utm_campaign=a%2520b');
    expect(new URL(result.url ?? '').searchParams.get('utm_campaign')).toBe('a%20b');
  });

  it('escapes a value that would otherwise inject another parameter', () => {
    const result = composeUtmUrl('https://example.test/p', { source: 'a&utm_medium=evil' });
    expect(new URL(result.url ?? '').searchParams.get('utm_source')).toBe('a&utm_medium=evil');
    expect(new URL(result.url ?? '').searchParams.get('utm_medium')).toBeNull();
  });

  it('skips empty and whitespace only values', () => {
    const result = composeUtmUrl('https://example.test/p', {
      source: 'x',
      term: '   ',
      content: '',
    });
    expect(result.url).toBe('https://example.test/p?utm_source=x');
  });

  it('returns null for anything that is not an http URL', () => {
    expect(composeUtmUrl('', { source: 'x' }).url).toBeNull();
    expect(composeUtmUrl('not a url', { source: 'x' }).url).toBeNull();
    expect(composeUtmUrl('example.test/p', { source: 'x' }).url).toBeNull();
    expect(composeUtmUrl('javascript:alert(1)', { source: 'x' }).url).toBeNull();
    expect(composeUtmUrl('mailto:someone@example.test', { source: 'x' }).url).toBeNull();
  });

  it('trims the destination before parsing it', () => {
    expect(composeUtmUrl('  https://example.test/p  ', {}).url).toBe('https://example.test/p');
  });
});
