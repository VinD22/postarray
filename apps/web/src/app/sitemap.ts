import type { MetadataRoute } from 'next';

import { BLOG_ARTICLES, blogArticlePath, blogDateToInstant } from '@/features/blog/registry';
import { articleLocales } from '@/features/blog/types';
import { articleAlternates, localeAlternates } from '@/features/marketing/seo';
import { MARKETING_ROUTES } from '@/features/marketing/site';

/**
 * One indexable URL per route, with its complete hreflang cluster.
 *
 * Articles come from the blog registry rather than from a second list, so
 * publishing one adds its sitemap entry with no edit here. They are the only
 * entries carrying `lastModified`: a landing page has no meaningful edit date,
 * and inventing one for every route would make the signal worthless on the
 * pages where it is real.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = MARKETING_ROUTES.map((path) => {
    const alternates = localeAlternates(path);
    return {
      url: alternates.canonical,
      alternates: { languages: alternates.languages },
    };
  });

  const articles = BLOG_ARTICLES.map((article) => {
    const path = blogArticlePath(article.slug);
    const alternates = articleAlternates(path, 'en', articleLocales(article));
    return {
      url: alternates.canonical,
      lastModified: blogDateToInstant(article.updated),
      alternates: { languages: alternates.languages },
    };
  });

  return [...routes, ...articles];
}
