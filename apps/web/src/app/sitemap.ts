import type { MetadataRoute } from 'next';

import { localeAlternates } from '@/features/marketing/seo';
import { MARKETING_ROUTES } from '@/features/marketing/site';

/** One indexable marketing URL per route, with its complete hreflang cluster. */
export default function sitemap(): MetadataRoute.Sitemap {
  return MARKETING_ROUTES.map((path) => {
    const alternates = localeAlternates(path);
    return {
      url: alternates.canonical,
      alternates: { languages: alternates.languages },
    };
  });
}
