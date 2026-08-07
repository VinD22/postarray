import { describe, expect, it } from 'vitest';

import { localizeNavigationHref } from './use-localized-router';

describe('localizeNavigationHref', () => {
  it('prefixes an internal destination for a non-default locale', () => {
    expect(localizeNavigationHref('/settings?tab=data', 'de')).toBe('/de/settings?tab=data');
  });

  it('keeps English clean and does not double-prefix an explicit locale', () => {
    expect(localizeNavigationHref('/settings', 'en')).toBe('/settings');
    expect(localizeNavigationHref('/fr/settings', 'de')).toBe('/fr/settings');
  });

  it('does not rewrite external or protocol-relative destinations', () => {
    expect(localizeNavigationHref('https://example.test', 'de')).toBe('https://example.test');
    expect(localizeNavigationHref('//example.test', 'de')).toBe('//example.test');
  });
});
