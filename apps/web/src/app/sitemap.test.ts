import { describe, expect, it } from 'vitest';

import { localeAlternates } from '@/features/marketing/seo';
import { MARKETING_ROUTES } from '@/features/marketing/site';

import sitemap from './sitemap';

describe('sitemap', () => {
  it('contains every marketing route once, each with its complete alternate cluster', () => {
    const entries = sitemap();

    expect(entries).toHaveLength(MARKETING_ROUTES.length);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(MARKETING_ROUTES.length);

    for (const path of MARKETING_ROUTES) {
      const alternates = localeAlternates(path);
      const entry = entries.find((candidate) => candidate.url === alternates.canonical);

      expect(entry).toBeDefined();
      expect(entry?.alternates?.languages).toEqual(alternates.languages);
    }
  });
});
