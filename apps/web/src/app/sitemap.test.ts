import { describe, expect, it } from 'vitest';

import { BLOG_ARTICLES, blogArticlePath, blogDateToInstant } from '@/features/blog/registry';
import { localeAlternates } from '@/features/marketing/seo';
import { MARKETING_ROUTES } from '@/features/marketing/site';

import sitemap from './sitemap';

describe('sitemap', () => {
  it('contains every marketing route once, each with its complete alternate cluster', () => {
    const entries = sitemap();

    expect(entries).toHaveLength(MARKETING_ROUTES.length + BLOG_ARTICLES.length);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);

    for (const path of MARKETING_ROUTES) {
      const alternates = localeAlternates(path);
      const entry = entries.find((candidate) => candidate.url === alternates.canonical);

      expect(entry).toBeDefined();
      expect(entry?.alternates?.languages).toEqual(alternates.languages);
    }
  });

  it('lists every blog article with its last modified date and hreflang cluster', () => {
    const entries = sitemap();

    expect(BLOG_ARTICLES.length).toBeGreaterThan(0);

    for (const article of BLOG_ARTICLES) {
      const alternates = localeAlternates(blogArticlePath(article.slug));
      const entry = entries.find((candidate) => candidate.url === alternates.canonical);

      expect(entry, article.slug).toBeDefined();
      expect(entry?.lastModified).toEqual(blogDateToInstant(article.updated));
      expect(entry?.alternates?.languages).toEqual(alternates.languages);
    }
  });

  it('does not put a last modified date on a route that has no meaningful edit date', () => {
    const entries = sitemap();
    const blogUrls = new Set(
      BLOG_ARTICLES.map((article) => localeAlternates(blogArticlePath(article.slug)).canonical),
    );

    for (const entry of entries) {
      if (!blogUrls.has(entry.url)) {
        expect(entry.lastModified, entry.url).toBeUndefined();
      }
    }
  });
});
