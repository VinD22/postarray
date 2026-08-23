import { describe, expect, it } from 'vitest';

import robots from './robots';

describe('robots', () => {
  it('allows marketing pages and excludes private routes with locale-prefixed variants', () => {
    const result = robots();
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    expect(rule?.allow).toBe('/');
    expect(rule?.disallow).toEqual(
      expect.arrayContaining([
        '/sign-in',
        '/sign-in/*',
        '/*/sign-in',
        '/*/sign-in/*',
        '/settings',
        '/settings/*',
        '/*/settings',
        '/*/settings/*',
        '/consent',
        '/consent/*',
        '/*/consent',
        '/*/consent/*',
        '/confirm',
        '/confirm/*',
        '/*/confirm',
        '/*/confirm/*',
      ]),
    );
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
