/**
 * Locale routing.
 *
 * V1 ships English only, so no locale segment is written into a URL. The
 * negotiation, the direction, the time zone and the catalog are already
 * resolved per request through this module, which means adding a language is a
 * catalog file plus flipping its status to `active` in `@relay/i18n`. No route
 * changes, no component changes.
 */

import {
  ACTIVE_LOCALE_CODES,
  DEFAULT_LOCALE,
  getDirection,
  isActiveLocale,
  resolveLocale,
  type TextDirection,
} from '@relay/i18n';

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
 * Pick the locale for a request.
 *
 * Order: an explicit choice the user stored, then the browser's
 * Accept-Language, then the default. An inactive locale never wins, so a half
 * translated catalog cannot leak into production by way of a header.
 */
export function negotiateLocale(input: {
  readonly cookieValue?: string | undefined;
  readonly acceptLanguage?: string | undefined;
}): ResolvedLocale {
  const chosen =
    input.cookieValue !== undefined && isActiveLocale(input.cookieValue)
      ? input.cookieValue
      : resolveLocale(input.acceptLanguage ?? null);
  const locale = isActiveLocale(chosen) ? chosen : DEFAULT_LOCALE;
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
