import { describe, expect, it } from 'vitest';

import { localizedHref } from './routing';

describe('localizedHref', () => {
  it('keeps default-locale paths unprefixed', () => {
    expect(localizedHref('/', 'en')).toBe('/');
    expect(localizedHref('/pricing/', 'en')).toBe('/pricing/');
  });

  it('localizes the root without a trailing slash', () => {
    expect(localizedHref('/', 'de')).toBe('/de');
  });

  it('preserves trailing slashes for localized paths', () => {
    expect(localizedHref('/pricing/', 'de')).toBe('/de/pricing/');
  });

  it.each([
    ['es-419', '/pricing', '/es-419/pricing'],
    ['zh-Hans', '/capabilities', '/zh-Hans/capabilities'],
  ])('prefixes BCP-47 locale %s', (locale, path, expected) => {
    expect(localizedHref(path, locale)).toBe(expected);
  });
});
