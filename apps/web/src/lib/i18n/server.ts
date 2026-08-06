import 'server-only';

import { cookies, headers } from 'next/headers';

import { createTranslator, loadCatalog, type PartialCatalog, type Translator } from '@relay/i18n';

import { LOCALE_COOKIE, negotiateLocale, resolveTimeZone, TIME_ZONE_COOKIE } from './routing';
import { ACTIVE_LOCALE_CODES, DEFAULT_LOCALE, getLocale } from '@relay/i18n';

/** Everything a server component needs to render text for this request. */
export interface RequestIntl {
  readonly locale: string;
  readonly direction: 'ltr' | 'rtl';
  readonly timeZone: string;
  readonly catalog: PartialCatalog;
  readonly t: Translator;
}

/**
 * The locale a page gets when it does not read the request.
 *
 * Reading `cookies()` or `headers()` in the root layout opts the entire route
 * tree out of static rendering, including the marketing and legal pages, which
 * are the same bytes for everyone. Those pages use this instead.
 *
 * While one locale is active the two answers are identical, so nothing is lost.
 * When a second locale ships, a page that must vary per visitor moves to
 * `getRequestIntl` and pays for the dynamic render deliberately, rather than
 * every page paying for it silently.
 */
export async function getStaticIntl(): Promise<RequestIntl> {
  const locale = DEFAULT_LOCALE;
  const direction = getLocale(locale)?.direction ?? 'ltr';
  const catalog = await loadCatalog(locale);
  return {
    locale,
    direction,
    // A static page cannot know the reader's zone. Anything date-shaped on these
    // pages states its zone explicitly; the product resolves the real one below.
    timeZone: 'UTC',
    catalog,
    t: createTranslator(locale, catalog),
  };
}

/** True while exactly one locale is active, so negotiation cannot change the answer. */
export const localeNegotiationIsMeaningful = ACTIVE_LOCALE_CODES.length > 1;

/**
 * Resolve the locale, the direction, the time zone and the catalog for the
 * current request.
 *
 * `workspaceTimeZone` comes from the session when there is one. Auth and
 * marketing screens have no session, so they fall back to the stored value.
 */
export async function getRequestIntl(workspaceTimeZone?: string): Promise<RequestIntl> {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);

  const { locale, direction } = negotiateLocale({
    cookieValue: cookieStore.get(LOCALE_COOKIE)?.value,
    acceptLanguage: headerList.get('accept-language') ?? undefined,
  });

  const timeZone = resolveTimeZone({
    workspaceTimeZone,
    cookieValue: cookieStore.get(TIME_ZONE_COOKIE)?.value,
  });

  const catalog = await loadCatalog(locale);
  return { locale, direction, timeZone, catalog, t: createTranslator(locale, catalog) };
}

/**
 * A namespace-scoped translator for a server component.
 *
 *   const t = await getTranslations('home');
 *   <h1>{t('title')}</h1>
 */
export async function getTranslations(
  namespace?: string,
): Promise<(key: string, values?: Record<string, string | number | boolean | Date>) => string> {
  const intl = await getRequestIntl();
  const prefix =
    namespace === undefined ? '' : namespace.endsWith('.') ? namespace : `${namespace}.`;
  return (key, values) => intl.t.format(`${prefix}${key}`, values);
}
