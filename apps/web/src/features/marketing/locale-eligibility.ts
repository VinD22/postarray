import { DEFAULT_LOCALE, PUBLIC_LOCALE_CODES } from '@relay/i18n';

import { ROUTES, TOOL_LINKS } from './site';

/**
 * Which locales actually carry a translation of a marketing route.
 *
 * Every page renders at every public locale path, but some route families keep
 * their copy on the reviewed English source in every beta locale (see the
 * `web.specs.`, `web.meta.dimensions.`, `web.toolDirectory.`, `web.pricing.`
 * and `web.legal.` entries in `packages/i18n/src/messages/beta-fallbacks.ts`).
 * Advertising `/de/specs/x/character-limit` in hreflang and the sitemap would
 * publish an English page under a German URL, which is the duplicate content
 * problem `articleAlternates` already solves for the blog. Those families are
 * English only here: their localized URLs still render, and canonicalize to
 * the English page.
 */
const ENGLISH_ONLY_PREFIXES: readonly string[] = [
  ROUTES.specs,
  ROUTES.pricing,
  ROUTES.legal,
  `${ROUTES.tools}/character-counter`,
];

const ENGLISH_ONLY_TOOL_ROUTES: ReadonlySet<string> = new Set(
  TOOL_LINKS.filter((link) => link.labelKey.startsWith('web.toolDirectory.')).map(
    (link) => link.href,
  ),
);

const ENGLISH_ONLY: readonly string[] = [DEFAULT_LOCALE];

function matchesPrefix(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

/** The locales a route is genuinely translated into. Never empty. */
export function routeLocales(path: string): readonly string[] {
  if (
    ENGLISH_ONLY_TOOL_ROUTES.has(path) ||
    ENGLISH_ONLY_PREFIXES.some((prefix) => matchesPrefix(path, prefix))
  ) {
    return ENGLISH_ONLY;
  }
  return PUBLIC_LOCALE_CODES;
}
