import type { MetadataRoute } from 'next';
import { PUBLIC_LOCALE_CODES } from '@relay/i18n';

import { BLOG_ARTICLES, blogArticlePath, blogDateToInstant } from '@/features/blog/registry';
import { articleLocales } from '@/features/blog/types';
import { COMPARISON_PAGE_ROUTES } from '@/features/marketing/site';
import { COMPARISON_PAGES, comparisonPath } from '@/features/comparisons/registry';
import { comparisonLocales } from '@/features/comparisons/types';
import { articleAlternates, localeAlternates } from '@/features/marketing/seo';
import { MARKETING_ROUTES } from '@/features/marketing/site';

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * Emit one sitemap URL for every eligible localized page.
 *
 * Google requires each URL in a hreflang cluster to have its own `<url>`
 * entry. A single English entry with alternate links is not equivalent: it
 * leaves the localized URLs undiscovered by sitemap crawlers and makes the
 * cluster asymmetric. Every entry repeats the same reciprocal cluster while
 * its own locale becomes the canonical URL.
 */
function localizedEntries(
  path: string,
  locales: readonly string[],
  lastModified?: Date,
): SitemapEntry[] {
  return locales.map((locale) => {
    const alternates = localeAlternates(path, locale);
    return {
      url: alternates.canonical,
      ...(lastModified === undefined ? {} : { lastModified }),
      alternates: { languages: alternates.languages },
    };
  });
}

function articleEntries(
  path: string,
  locales: readonly string[],
  lastModified?: Date,
): SitemapEntry[] {
  return locales.map((locale) => {
    const alternates = articleAlternates(path, locale, locales);
    return {
      url: alternates.canonical,
      ...(lastModified === undefined ? {} : { lastModified }),
      alternates: { languages: alternates.languages },
    };
  });
}

/**
 * Every indexable locale URL per route, with its complete hreflang cluster.
 *
 * Articles come from the blog registry rather than from a second list, so
 * publishing one adds its sitemap entry with no edit here. They are the only
 * entries carrying `lastModified`: a landing page has no meaningful edit date,
 * and inventing one for every route would make the signal worthless on the
 * pages where it is real.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const comparisonRoutes = new Set(COMPARISON_PAGE_ROUTES);
  const routes = MARKETING_ROUTES.filter((path) => !comparisonRoutes.has(path)).flatMap((path) =>
    localizedEntries(path, PUBLIC_LOCALE_CODES),
  );

  const comparisons = COMPARISON_PAGES.flatMap((page) =>
    articleEntries(comparisonPath(page.slug), comparisonLocales(page)),
  );

  const articles = BLOG_ARTICLES.flatMap((article) => {
    const path = blogArticlePath(article.slug);
    const locales = articleLocales(article);
    return articleEntries(path, locales, blogDateToInstant(article.updated));
  });

  return [...routes, ...comparisons, ...articles];
}
