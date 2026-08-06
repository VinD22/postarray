import { describe, expect, it } from 'vitest';

import {
  getWebLocaleDirection,
  isWebLocale,
  pseudoLocalesAreEnabled,
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
});
