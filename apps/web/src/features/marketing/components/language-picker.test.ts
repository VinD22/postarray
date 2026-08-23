import { describe, expect, it } from 'vitest';

import {
  appendSearchParams,
  normalizeLanguagePickerSearch,
  unprefixedLocalePath,
} from './language-picker';

describe('LanguagePicker helpers', () => {
  it('matches language labels without diacritics', () => {
    expect(normalizeLanguagePickerSearch('Español (España)')).toContain('espanol');
    expect(normalizeLanguagePickerSearch('Čeština')).toBe('cestina');
  });

  it('removes only active locale prefixes before generating a localized link', () => {
    expect(unprefixedLocalePath('/pricing')).toBe('/pricing');
    expect(unprefixedLocalePath('/en/pricing')).toBe('/pricing');
  });

  it('preserves and safely serializes query parameters when changing locale', () => {
    expect(appendSearchParams('/de/pricing', 'utm_source=nav&next=/pricing')).toBe(
      '/de/pricing?utm_source=nav&next=%2Fpricing',
    );
    expect(appendSearchParams('/de/pricing', '')).toBe('/de/pricing');
  });
});
