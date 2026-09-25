import type { MetadataRoute } from 'next';

import { BLOG_ARTICLES, blogArticlePath, blogDateToInstant } from '@/features/blog/registry';
import { articleLocales } from '@/features/blog/types';
import { COMPARISON_PAGES, comparisonPath } from '@/features/comparisons/registry';
import { comparisonLocales } from '@/features/comparisons/types';
import { DIMENSION_PLATFORMS, latestReadOn, surfaceSlug } from '@/features/specs/dimensions';
import { SPEC_PLATFORMS } from '@/features/specs/registry';

import { routeLocales } from './locale-eligibility';
import { articleAlternates } from './seo';
import {
  COMPARISON_PAGE_ROUTES,
  MARKETING_ROUTES,
  ROUTES,
  SITE_ORIGIN,
  dimensionsPlatformPath,
  dimensionsSurfacePath,
  specsConstraintPath,
  specsPlatformPath,
} from './site';

export type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * The sitemap, split by cluster so each file is small, and so a crawl report
 * says which family of pages has a problem.
 *
 * Google requires each URL in a hreflang cluster to have its own `<url>`
 * entry, and every entry repeats the same reciprocal cluster. Only locales a
 * route is actually translated into are listed (`routeLocales`): an English
 * source page under a German URL is a duplicate, not a translation.
 *
 * `lastModified` is set only where a real date exists: an article's update
 * date, and on the specs cluster the day a person last read the cited source.
 * A landing page has no meaningful edit date, and inventing one would make the
 * signal worthless where it is real.
 */
export const SITEMAP_CLUSTERS = ['pages', 'specs', 'tools', 'comparisons', 'blog'] as const;
export type SitemapCluster = (typeof SITEMAP_CLUSTERS)[number];

function entries(path: string, locales: readonly string[], lastModified?: Date): SitemapEntry[] {
  return locales.map((locale) => {
    const alternates = articleAlternates(path, locale, locales);
    return {
      url: alternates.canonical,
      ...(lastModified === undefined ? {} : { lastModified }),
      alternates: { languages: alternates.languages },
    };
  });
}

function calendarDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

/** Verified dates for the specs cluster, keyed by path. */
function specsDates(): ReadonlyMap<string, Date> {
  const dates = new Map<string, Date>();
  for (const platform of SPEC_PLATFORMS) {
    if (platform.source === null) {
      continue;
    }
    const date = calendarDate(platform.source.readOn);
    dates.set(specsPlatformPath(platform.slug), date);
    for (const entry of platform.entries) {
      dates.set(specsConstraintPath(platform.slug, entry.constraint.slug), date);
    }
  }
  for (const platform of DIMENSION_PLATFORMS) {
    dates.set(dimensionsPlatformPath(platform.slug), calendarDate(latestReadOn(platform)));
    for (const row of platform.rows) {
      dates.set(
        dimensionsSurfacePath(platform.slug, surfaceSlug(row.variant)),
        calendarDate(row.source.readOn),
      );
    }
  }
  return dates;
}

function isUnder(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export function clusterOf(path: string): Exclude<SitemapCluster, 'comparisons' | 'blog'> {
  if (isUnder(path, ROUTES.specs)) {
    return 'specs';
  }
  if (isUnder(path, ROUTES.tools)) {
    return 'tools';
  }
  return 'pages';
}

export function sitemapCluster(cluster: SitemapCluster): MetadataRoute.Sitemap {
  if (cluster === 'comparisons') {
    return COMPARISON_PAGES.flatMap((page) =>
      entries(comparisonPath(page.slug), comparisonLocales(page)),
    );
  }
  if (cluster === 'blog') {
    return BLOG_ARTICLES.flatMap((article) =>
      entries(
        blogArticlePath(article.slug),
        articleLocales(article),
        blogDateToInstant(article.updated),
      ),
    );
  }
  const comparisonRoutes = new Set(COMPARISON_PAGE_ROUTES);
  const dates = cluster === 'specs' ? specsDates() : new Map<string, Date>();
  return MARKETING_ROUTES.filter(
    (path) => !comparisonRoutes.has(path) && clusterOf(path) === cluster,
  ).flatMap((path) => entries(path, routeLocales(path), dates.get(path)));
}

/** Every entry across every cluster. */
export function allSitemapEntries(): MetadataRoute.Sitemap {
  return SITEMAP_CLUSTERS.flatMap(sitemapCluster);
}

/** The published path of one cluster's file. */
export function sitemapClusterPath(cluster: SitemapCluster): string {
  return `/sitemaps/sitemap/${cluster}.xml`;
}

/** The `/sitemap.xml` index body, listing one file per cluster. */
export function sitemapIndexXml(): string {
  const items = SITEMAP_CLUSTERS.map(
    (cluster) =>
      `  <sitemap>\n    <loc>${new URL(sitemapClusterPath(cluster), SITE_ORIGIN).toString()}</loc>\n  </sitemap>`,
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...items,
    '</sitemapindex>',
    '',
  ].join('\n');
}
