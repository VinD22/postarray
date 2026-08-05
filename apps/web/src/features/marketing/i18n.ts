import { DEFAULT_LOCALE } from '@relay/i18n/locales';
import { en } from '@relay/i18n/messages';
import { createTranslator, type MessageKey, type Translator } from '@relay/i18n/translate';

/**
 * The marketing site is public, static and English only in V1, so it does not
 * need the request scoped locale negotiation the product shell performs. It
 * needs one translator, created once, usable from a Server Component without
 * a provider and therefore without shipping React context to the browser.
 *
 * When a marketing locale ships, this becomes a function of the route segment
 * and every call site already reads from a catalog, so nothing else changes.
 */
let cached: Translator | null = null;

export function marketingTranslator(): Translator {
  cached ??= createTranslator(DEFAULT_LOCALE, en);
  return cached;
}

export type { MessageKey };

/**
 * Absolute dates on a public page.
 *
 * Fixed to the default locale and to UTC on purpose: a marketing page is
 * cached and served identically to everyone, so a server rendered date must
 * not depend on the machine that rendered it or on the reader time zone.
 */
const dateFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  dateStyle: 'long',
  timeZone: 'UTC',
});

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

// `dateStyle` and `timeStyle` cannot be combined with individual component
// options such as `timeZoneName`; Intl throws on the mix. The components are
// spelled out so the zone can still be shown, which matters because every
// verification date on these pages is stated in UTC.
const dateTimeFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
  timeZoneName: 'short',
});

export function formatDateTime(isoInstant: string): string {
  return dateTimeFormatter.format(new Date(isoInstant));
}
