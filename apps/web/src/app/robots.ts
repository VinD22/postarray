import type { MetadataRoute } from 'next';
import { ACTIVE_LOCALE_CODES } from '@relay/i18n';

import { SITE_ORIGIN } from '@/features/marketing/site';

const PRIVATE_PATHS = [
  '/action-center',
  '/analytics',
  '/approvals',
  '/automation',
  '/calendar',
  '/check-email',
  '/compose',
  '/confirm',
  '/consent',
  '/connections',
  '/forgot-password',
  '/growth',
  '/home',
  '/import',
  '/library',
  '/onboarding',
  '/posts',
  '/reset-password',
  '/settings',
  '/sign-in',
  '/sign-up',
  '/assistant',
] as const;

/**
 * AI crawlers named explicitly. A crawler that finds a group for its own
 * user agent ignores the `*` group entirely, so they share the `*` group's
 * private-path list: naming them is a statement that the public site is open
 * to them for search and answers, not a loophole into the app.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
] as const;

/** Keep authenticated and onboarding routes out of crawlers, with or without a locale prefix. */
export default function robots(): MetadataRoute.Robots {
  const localePrefixes = ACTIVE_LOCALE_CODES.map((locale) => `/${locale}`);
  const disallow = PRIVATE_PATHS.flatMap((path) =>
    ['', ...localePrefixes].flatMap((prefix) => [
      `${prefix}${path}$`,
      `${prefix}${path}?*`,
      `${prefix}${path}/*`,
    ]),
  );

  return {
    rules: [
      // One group with every user agent: repeating the list per crawler made
      // robots.txt about 400 KB, close to the 500 KiB limit Google reads.
      { userAgent: ['*', ...AI_CRAWLERS], allow: '/', disallow },
    ],
    sitemap: new URL('/sitemap.xml', SITE_ORIGIN).toString(),
  };
}
