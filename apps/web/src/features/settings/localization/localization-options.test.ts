import { ACTIVE_LOCALES, ALL_LOCALES } from '@relay/i18n';
import { describe, expect, it } from 'vitest';

import { CONTENT_LOCALE_OPTIONS } from './localization-options';

describe('content locale options', () => {
  it('exposes only active locales, never planned or retired catalogs', () => {
    expect(CONTENT_LOCALE_OPTIONS.map((locale) => locale.bcp47)).toEqual(
      ACTIVE_LOCALES.map((locale) => locale.bcp47),
    );
    expect(CONTENT_LOCALE_OPTIONS.every((locale) => locale.status === 'active')).toBe(true);

    const unavailable = ALL_LOCALES.filter((locale) => locale.status !== 'active');
    for (const locale of unavailable) {
      expect(CONTENT_LOCALE_OPTIONS, locale.bcp47).not.toContain(locale);
    }
  });
});
