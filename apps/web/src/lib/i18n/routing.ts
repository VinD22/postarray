/**
 * Locale routing.
 *
 * The default locale has no URL prefix. Other active locales are represented by
 * their BCP-47 tag at the start of the path. Request negotiation remains a
 * fallback for the bare root and for locale suggestions; an explicit locale in
 * a URL always wins.
 */

import {
  ACTIVE_LOCALE_CODES,
  DEFAULT_LOCALE,
  getDirection,
  resolveLocale,
  type TextDirection,
} from '@relay/i18n';

import { isWebLocale } from './development-pseudo-locales';

export const LOCALE_COOKIE = 'relay_locale';
export const TIME_ZONE_COOKIE = 'relay_tz';

export const routing = {
  locales: ACTIVE_LOCALE_CODES,
  defaultLocale: DEFAULT_LOCALE,
  /**
   * `as-needed`: the default locale has no prefix. With one active locale this
   * produces the clean URLs V1 wants, and a second locale starts prefixing
   * itself without touching a single route file.
   */
  localePrefix: 'as-needed',
} as const;

export interface ResolvedLocale {
  readonly locale: string;
  readonly direction: TextDirection;
}

/**
 * Return a path at the URL for an interface locale.
 *
 * English remains unprefixed. The root path is special-cased so its localized
 * form is `/de`, not `/de/`; all other trailing slashes are deliberately
 * preserved because routing may distinguish them.
 */
export function localizedHref(path: string, locale: string): string {
  if (locale === DEFAULT_LOCALE) {
    return path;
  }

  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/**
 * Pick the locale for a request.
 *
 * This is a fallback only. A locale explicitly present in the URL takes
 * precedence before this function is called. For a URL without a locale, pick
 * an explicit stored choice, then the browser's Accept-Language, then the
 * default. An inactive locale never wins, so a half translated catalog cannot
 * leak into production by way of a header.
 */
export function negotiateLocale(input: {
  readonly cookieValue?: string | undefined;
  readonly acceptLanguage?: string | undefined;
}): ResolvedLocale {
  const chosen =
    input.cookieValue !== undefined && isWebLocale(input.cookieValue)
      ? input.cookieValue
      : resolveLocale(input.acceptLanguage ?? null);
  const locale = isWebLocale(chosen) ? chosen : DEFAULT_LOCALE;
  return { locale, direction: getDirection(locale) };
}

/**
 * The time zone every date on the screen is rendered in.
 *
 * Never the browser zone by default: a schedule computed in the viewer's zone
 * is how a post goes out at the wrong hour. The workspace zone wins, and the
 * stored value is only a fallback for screens rendered before a session exists.
 */
export function resolveTimeZone(input: {
  readonly workspaceTimeZone?: string | undefined;
  readonly cookieValue?: string | undefined;
}): string {
  return input.workspaceTimeZone ?? input.cookieValue ?? 'UTC';
}
