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
 * user agent ignores the `*` group entirely, so each group repeats the same
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
      { userAgent: '*', allow: '/', disallow },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    sitemap: new URL('/sitemap.xml', SITE_ORIGIN).toString(),
  };
}
