import { describe, expect, it } from 'vitest';

import { DEFAULT_LOCALE } from '@relay/i18n';

import { localeFromPathname } from './error';

describe('root error locale resolution', () => {
  it('resolves a public locale from a localized route', () => {
    expect(localeFromPathname('/ar/compose')).toBe('ar');
  });

  it('uses English for clean default routes and unknown prefixes', () => {
    expect(localeFromPathname('/compose')).toBe(DEFAULT_LOCALE);
    expect(localeFromPathname('/xx/compose')).toBe(DEFAULT_LOCALE);
    expect(localeFromPathname(null)).toBe(DEFAULT_LOCALE);
  });

  it('resolves active locales including es-419, cs, sv, fil and zh-Hant', () => {
    for (const locale of ['es-419', 'cs', 'sv', 'fil', 'zh-Hant', 'ar', 'he']) {
      expect(localeFromPathname(`/${locale}/compose`), locale).toBe(locale);
    }
  });
});
