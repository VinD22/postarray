import { describe, expect, it } from 'vitest';

import robots from './robots';

describe('robots', () => {
  it('allows marketing pages and excludes private routes with locale-prefixed variants', () => {
    const result = robots();
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    expect(rule?.allow).toBe('/');
    expect(rule?.disallow).toEqual(
      expect.arrayContaining([
        '/sign-in$',
        '/sign-in/*',
        '/es/sign-in$',
        '/es/sign-in/*',
        '/settings$',
        '/settings/*',
        '/es/settings$',
        '/es/settings/*',
        '/consent$',
        '/consent/*',
        '/es/consent$',
        '/es/consent/*',
        '/confirm$',
        '/confirm/*',
        '/es/confirm$',
        '/es/confirm/*',
      ]),
    );
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });
  it('does not block public articles that start with private route names', () => {
    const rules = robots().rules;
    const rule = Array.isArray(rules) ? rules[0] : rules;
    const patterns = rule?.disallow;
    const disallow = Array.isArray(patterns) ? patterns : [patterns ?? ''];
    const blocked = (path: string) =>
      disallow.some((pattern) => {
        const escaped = pattern.replace(/[.+?^{}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
        return new RegExp(`^${escaped}`).test(path);
      });
    expect(blocked('/blog/connections-expire-before-you-notice')).toBe(false);
    expect(blocked('/en/blog/connections-expire-before-you-notice')).toBe(false);
    expect(blocked('/connections')).toBe(true);
    expect(blocked('/en/connections')).toBe(true);
    expect(blocked('/en/connections?filter=expired')).toBe(true);
    expect(blocked('/en/connections/conn_one')).toBe(true);
    expect(blocked('/blog/connections')).toBe(false);
  });
});
