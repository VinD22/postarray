import { ACTIVE_LOCALES, PUBLIC_LOCALE_CODES } from '@relay/i18n';
import { describe, expect, it } from 'vitest';

import { COMPOSER_CONTENT_LOCALES, contentLocaleLabel } from './content-locale-options';

describe('composer content locale options', () => {
  it('offers every public locale and no retired or planned locale', () => {
    expect(COMPOSER_CONTENT_LOCALES).toEqual(PUBLIC_LOCALE_CODES);
    expect(COMPOSER_CONTENT_LOCALES).toHaveLength(20);
    expect(new Set(COMPOSER_CONTENT_LOCALES).size).toBe(20);
  });

  it('renders the locale endonym instead of exposing a raw locale code', () => {
    for (const locale of ACTIVE_LOCALES) {
      expect(contentLocaleLabel(locale.bcp47)).toBe(locale.endonym);
    }
  });

  it('keeps an unknown provider/content locale visible as a safe fallback', () => {
    expect(contentLocaleLabel('x-example')).toBe('x-example');
  });
});
