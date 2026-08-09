import type { MetadataRoute } from 'next';

import { SITE_ORIGIN } from '@/features/marketing/site';

const PRIVATE_PATHS = [
  '/action-center',
  '/analytics',
  '/automation',
  '/calendar',
  '/check-email',
  '/compose',
  '/connections',
  '/forgot-password',
  '/home',
  '/library',
  '/onboarding',
  '/posts',
  '/settings',
  '/sign-in',
  '/sign-up',
] as const;

/** Keep authenticated and onboarding routes out of crawlers, with or without a locale prefix. */
export default function robots(): MetadataRoute.Robots {
  const disallow = PRIVATE_PATHS.flatMap((path) => [path, `/*${path}`]);

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow,
    },
    sitemap: new URL('/sitemap.xml', SITE_ORIGIN).toString(),
  };
}
