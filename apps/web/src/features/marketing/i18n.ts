import { DEFAULT_LOCALE } from '@relay/i18n/locales';
import { loadCatalog } from '@relay/i18n/messages';
import { createTranslator, type MessageKey, type Translator } from '@relay/i18n/translate';

/**
 * The marketing site is public and static, but its translator is still a
 * function of the locale route segment. Cache the promise, rather than one
 * resolved translator, so simultaneous prerenders of a locale share its lazy
 * catalog load and a warm instance can never reuse another locale's catalog.
 */
const translators = new Map<string, Promise<Translator>>();

export function marketingTranslator(locale: string = DEFAULT_LOCALE): Promise<Translator> {
  let translator = translators.get(locale);
  if (!translator) {
    translator = loadCatalog(locale).then((catalog) => createTranslator(locale, catalog));
    translators.set(locale, translator);
  }
  return translator;
}

export type { MessageKey };

/**
 * Absolute dates on a public page.
 *
 * Fixed to the route locale and to UTC on purpose: a marketing page is
 * cached and served identically to everyone, so a server rendered date must
 * not depend on the machine that rendered it or on the reader time zone.
 */
const dateFormatters = new Map<string, Intl.DateTimeFormat>();

export function formatDate(isoDate: string, locale: string = DEFAULT_LOCALE): string {
  let formatter = dateFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      dateStyle: 'long',
      timeZone: 'UTC',
    });
    dateFormatters.set(locale, formatter);
  }
  return formatter.format(new Date(isoDate));
}

// `dateStyle` and `timeStyle` cannot be combined with individual component
// options such as `timeZoneName`; Intl throws on the mix. The components are
// spelled out so the zone can still be shown, which matters because every
// verification date on these pages is stated in UTC.
const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();

export function formatDateTime(isoInstant: string, locale: string = DEFAULT_LOCALE): string {
  let formatter = dateTimeFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    });
    dateTimeFormatters.set(locale, formatter);
  }
  return formatter.format(new Date(isoInstant));
}
