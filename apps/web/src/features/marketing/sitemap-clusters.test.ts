import { describe, expect, it } from 'vitest';

import { PUBLIC_LOCALE_CODES } from '@relay/i18n';

import { BLOG_ARTICLES, blogArticlePath, blogDateToInstant } from '@/features/blog/registry';
import { articleLocales } from '@/features/blog/types';
import { COMPARISON_PAGES, comparisonPath } from '@/features/comparisons/registry';
import { comparisonLocales } from '@/features/comparisons/types';

import { routeLocales } from './locale-eligibility';
import { absoluteUrl, articleAlternates, localeAlternates } from './seo';
import {
  SITEMAP_CLUSTERS,
  allSitemapEntries,
  sitemapCluster,
  sitemapIndexXml,
} from './sitemap-clusters';
import { COMPARISON_PAGE_ROUTES, MARKETING_ROUTES, ROUTES } from './site';

describe('sitemap clusters', () => {
  it('lists every marketing route once per eligible locale, with no duplicates', () => {
    const entries = allSitemapEntries();
    const routes = MARKETING_ROUTES.filter((path) => !COMPARISON_PAGE_ROUTES.includes(path));

    expect(entries).toHaveLength(
      routes.reduce((count, path) => count + routeLocales(path).length, 0) +
        COMPARISON_PAGES.reduce((count, page) => count + comparisonLocales(page).length, 0) +
        BLOG_ARTICLES.reduce((count, article) => count + articleLocales(article).length, 0),
    );
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);

    for (const path of routes) {
      for (const locale of routeLocales(path)) {
        const alternates = localeAlternates(path, locale);
        const entry = entries.find((candidate) => candidate.url === alternates.canonical);
        expect(entry, `${path} (${locale})`).toBeDefined();
        expect(entry?.alternates?.languages).toEqual(alternates.languages);
      }
    }
  });

  it('keeps English-only families out of other locales', () => {
    const entries = allSitemapEntries();
    const specPath = MARKETING_ROUTES.find((path) => path.startsWith(`${ROUTES.specs}/`));
    expect(specPath).toBeDefined();
    for (const path of [ROUTES.specs, ROUTES.pricing, ROUTES.terms, specPath ?? '']) {
      expect(routeLocales(path)).toEqual(['en']);
      expect(entries.some((entry) => entry.url === absoluteUrl(path, 'de'))).toBe(false);
      expect(localeAlternates(path, 'de').canonical).toBe(absoluteUrl(path, 'en'));
    }
    expect(routeLocales(ROUTES.product)).toEqual(PUBLIC_LOCALE_CODES);
  });

  it('dates the specs cluster by the verified source date and nothing else by invention', () => {
    const specs = sitemapCluster('specs');
    expect(specs.some((entry) => entry.lastModified !== undefined)).toBe(true);
    for (const entry of [...sitemapCluster('pages'), ...sitemapCluster('tools')]) {
      expect(entry.lastModified, entry.url).toBeUndefined();
    }
  });

  it('lists only the written content locales for comparisons', () => {
    const entries = sitemapCluster('comparisons');
    for (const page of COMPARISON_PAGES) {
      const path = comparisonPath(page.slug);
      const locales = comparisonLocales(page);
      for (const locale of PUBLIC_LOCALE_CODES.filter(
        (candidate) => !locales.includes(candidate),
      )) {
        expect(entries.some((entry) => entry.url === absoluteUrl(path, locale))).toBe(false);
      }
    }
  });

  it('lists every blog article locale with its last modified date', () => {
    const entries = sitemapCluster('blog');
    for (const article of BLOG_ARTICLES) {
      const path = blogArticlePath(article.slug);
      const locales = articleLocales(article);
      for (const locale of locales) {
        const alternates = articleAlternates(path, locale, locales);
        const entry = entries.find((candidate) => candidate.url === alternates.canonical);
        expect(entry, `${article.slug} (${locale})`).toBeDefined();
        expect(entry?.lastModified).toEqual(blogDateToInstant(article.updated));
      }
    }
  });

  it('indexes one file per cluster', () => {
    const xml = sitemapIndexXml();
    for (const cluster of SITEMAP_CLUSTERS) {
      expect(xml).toContain(`/sitemaps/sitemap/${cluster}.xml</loc>`);
    }
  });
});
