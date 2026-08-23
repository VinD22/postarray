import { describe, expect, it } from 'vitest';

import { PUBLIC_LOCALE_CODES } from '@relay/i18n';

import { BLOG_ARTICLES, blogArticlePath, blogDateToInstant } from '@/features/blog/registry';
import { articleLocales } from '@/features/blog/types';
import { COMPARISON_PAGES, comparisonPath } from '@/features/comparisons/registry';
import { comparisonLocales } from '@/features/comparisons/types';
import { absoluteUrl, articleAlternates, localeAlternates } from '@/features/marketing/seo';
import { COMPARISON_PAGE_ROUTES, MARKETING_ROUTES } from '@/features/marketing/site';

import sitemap from './sitemap';

describe('sitemap', () => {
  it('contains every non-comparison marketing route in every public locale', () => {
    const entries = sitemap();

    expect(entries).toHaveLength(
      MARKETING_ROUTES.filter((path) => !COMPARISON_PAGE_ROUTES.includes(path)).length *
        PUBLIC_LOCALE_CODES.length +
        COMPARISON_PAGES.reduce(
          (count, page) => count + comparisonLocales(page).length,
          0,
        ) +
        BLOG_ARTICLES.reduce((count, article) => count + articleLocales(article).length, 0),
    );
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);

    for (const path of MARKETING_ROUTES.filter(
      (candidate) => !COMPARISON_PAGE_ROUTES.includes(candidate),
    )) {
      for (const locale of PUBLIC_LOCALE_CODES) {
        const alternates = localeAlternates(path, locale);
        const entry = entries.find((candidate) => candidate.url === alternates.canonical);

        expect(entry).toBeDefined();
        expect(entry?.alternates?.languages).toEqual(alternates.languages);
      }
    }
  });

  it('lists only the written content locales for comparisons', () => {
    const entries = sitemap();

    for (const page of COMPARISON_PAGES) {
      const path = comparisonPath(page.slug);
      const locales = comparisonLocales(page);

      for (const locale of locales) {
        const alternates = articleAlternates(path, locale, locales);
        const entry = entries.find((candidate) => candidate.url === alternates.canonical);

        expect(entry, `${page.slug} (${locale})`).toBeDefined();
        expect(entry?.alternates?.languages).toEqual(alternates.languages);
      }

      for (const locale of PUBLIC_LOCALE_CODES.filter((candidate) => !locales.includes(candidate))) {
        expect(entries.some((entry) => entry.url === absoluteUrl(path, locale))).toBe(false);
      }
    }
  });

  it('lists every blog article locale with its last modified date and own hreflang cluster', () => {
    const entries = sitemap();

    expect(BLOG_ARTICLES.length).toBeGreaterThan(0);

    for (const article of BLOG_ARTICLES) {
      const path = blogArticlePath(article.slug);
      const locales = articleLocales(article);
      for (const locale of locales) {
        const alternates = articleAlternates(path, locale, locales);
        const entry = entries.find((candidate) => candidate.url === alternates.canonical);

        expect(entry, `${article.slug} (${locale})`).toBeDefined();
        expect(entry?.lastModified).toEqual(blogDateToInstant(article.updated));
        expect(entry?.alternates?.languages).toEqual(alternates.languages);
        // A locale the article was never written in must not appear as an
        // alternate: that would advertise a translation that does not exist.
        expect(Object.keys(entry?.alternates?.languages ?? {}).sort()).toEqual(
          [...locales, 'x-default'].sort(),
        );
      }
    }
  });

  it('does not put a last modified date on a route that has no meaningful edit date', () => {
    const entries = sitemap();
    const blogUrls = new Set(
      BLOG_ARTICLES.flatMap((article) => {
        const path = blogArticlePath(article.slug);
        const locales = articleLocales(article);
        return locales.map((locale) => articleAlternates(path, locale, locales).canonical);
      }),
    );

    for (const entry of entries) {
      if (!blogUrls.has(entry.url)) {
        expect(entry.lastModified, entry.url).toBeUndefined();
      }
    }
  });
});
