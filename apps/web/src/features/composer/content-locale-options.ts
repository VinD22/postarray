import { ACTIVE_LOCALES, PUBLIC_LOCALE_CODES } from '@relay/i18n';

/**
 * Content languages offered by the composer. Keep this tied to the public
 * roster so the editor cannot silently fall behind the marketing/site locale
 * picker as languages are added or retired.
 */
export const COMPOSER_CONTENT_LOCALES = PUBLIC_LOCALE_CODES;

export function contentLocaleLabel(locale: string): string {
  return ACTIVE_LOCALES.find((entry) => entry.bcp47 === locale)?.endonym ?? locale;
}
