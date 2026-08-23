import { describe, expect, it } from 'vitest';
import { PUBLIC_LOCALE_CODES } from '@relay/i18n';

import {
  getWebLocaleDirection,
  isWebLocale,
  pseudoLocalesAreEnabled,
  STATIC_WEB_LOCALE_CODES,
} from './development-pseudo-locales';

describe('pseudoLocalesAreEnabled', () => {
  it('requires an explicit development-only opt-in', () => {
    expect(pseudoLocalesAreEnabled('development', 'true')).toBe(true);
    expect(pseudoLocalesAreEnabled('development', 'false')).toBe(false);
    expect(pseudoLocalesAreEnabled('test', 'true')).toBe(false);
    expect(pseudoLocalesAreEnabled('production', 'true')).toBe(false);
  });

  it('admits pseudo routes only when the flag is enabled and preserves bidi direction', () => {
    expect(isWebLocale('en-XA', false)).toBe(false);
    expect(isWebLocale('en-XA', true)).toBe(true);
    expect(isWebLocale('en-XB', true)).toBe(true);
    expect(getWebLocaleDirection('en-XA')).toBe('ltr');
    expect(getWebLocaleDirection('en-XB')).toBe('rtl');
  });

  it('generates every public locale for the localized route tree', () => {
    expect(STATIC_WEB_LOCALE_CODES).toHaveLength(PUBLIC_LOCALE_CODES.length);
    expect(new Set(STATIC_WEB_LOCALE_CODES)).toEqual(new Set(PUBLIC_LOCALE_CODES));
  });
});
