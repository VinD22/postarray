import {
  ACTIVE_LOCALE_CODES,
  getDirection,
  getPseudoLocale,
  isActiveLocale,
  isPseudoLocale,
  type TextDirection,
} from '@relay/i18n';

/**
 * Pseudo locales are a development-only layout test aid. They never appear in
 * production routes, metadata, sitemaps, or the customer-facing picker.
 */
export function pseudoLocalesAreEnabled(
  environment = process.env.NODE_ENV,
  enabled = process.env.NEXT_PUBLIC_ENABLE_PSEUDO_LOCALES,
): boolean {
  return environment === 'development' && enabled === 'true';
}

export const DEVELOPMENT_PSEUDO_LOCALES_ENABLED = pseudoLocalesAreEnabled();

/** A locale that the web router may render in this build. */
export function isWebLocale(
  locale: string,
  pseudoLocalesEnabled = DEVELOPMENT_PSEUDO_LOCALES_ENABLED,
): boolean {
  return isActiveLocale(locale) || (pseudoLocalesEnabled && isPseudoLocale(locale));
}

/** Pseudo locale metadata supplies the bidi direction not present in the registry. */
export function getWebLocaleDirection(locale: string): TextDirection {
  return getPseudoLocale(locale)?.direction ?? getDirection(locale);
}

/** Pseudo paths are generated only for an explicitly opted-in development build. */
export const STATIC_WEB_LOCALE_CODES: readonly string[] = DEVELOPMENT_PSEUDO_LOCALES_ENABLED
  ? [...ACTIVE_LOCALE_CODES, 'en-XA', 'en-XB']
  : ACTIVE_LOCALE_CODES;
