import { ACTIVE_LOCALE_CODES, DEFAULT_LOCALE } from '@relay/i18n';

/**
 * Comparing a pathname against a nav href.
 *
 * `usePathname()` returns the URL as the browser has it, which for every
 * locale but the default carries a prefix: `/de/analytics`, not `/analytics`.
 * Nav hrefs are written unprefixed, because `components/link.tsx` adds the
 * prefix on the way out. So `pathname === '/analytics'` is false for every
 * reader who is not on English, and the tab they are looking at does not
 * highlight. Three navs had their own copy of that comparison and all three
 * had the same bug.
 *
 * The prefix is stripped rather than added to the href for two reasons. It
 * needs no hook, so a server component and a plain function can both use it.
 * And it is stable under the pseudo-locales, which are active codes in
 * development and would otherwise each need their own case.
 */

const PREFIXES: readonly string[] = ACTIVE_LOCALE_CODES.filter(
  (code) => code !== DEFAULT_LOCALE,
).map((code) => `/${code}`);

/**
 * The path with its locale prefix removed.
 *
 * `/de/analytics` becomes `/analytics`, `/analytics` stays as it is, and `/de`
 * becomes `/` rather than the empty string, so a caller can compare it against
 * a real href without a second special case.
 */
export function stripLocalePrefix(pathname: string): string {
  for (const prefix of PREFIXES) {
    if (pathname === prefix) return '/';
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname;
}

/**
 * True when `pathname` is this destination or somewhere inside it.
 *
 * `exact` is for a section index that has children of its own: `/analytics`
 * must not stay lit while the reader is on `/analytics/experiments`, or two
 * tabs claim to be current at once.
 */
export function isPathActive(pathname: string, href: string, exact = false): boolean {
  const path = stripLocalePrefix(pathname);
  return exact ? path === href : path === href || path.startsWith(`${href}/`);
}
