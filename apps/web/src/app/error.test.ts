import { describe, expect, it } from 'vitest';

import { DEFAULT_LOCALE } from '@relay/i18n';

import { localeFromPathname } from './error';

describe('root error locale resolution', () => {
  it('resolves a public locale from a localized route', () => {
    expect(localeFromPathname('/ar/compose')).toBe('ar');
  });

  it('uses English for clean default routes and retired or unknown prefixes', () => {
    expect(localeFromPathname('/compose')).toBe(DEFAULT_LOCALE);
    expect(localeFromPathname('/es-419/compose')).toBe(DEFAULT_LOCALE);
    expect(localeFromPathname('/xx/compose')).toBe(DEFAULT_LOCALE);
    expect(localeFromPathname(null)).toBe(DEFAULT_LOCALE);
  });
});
