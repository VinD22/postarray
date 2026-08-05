import 'server-only';

import { cookies, headers } from 'next/headers';

import { createTranslator, loadCatalog, type PartialCatalog, type Translator } from '@relay/i18n';

import { LOCALE_COOKIE, negotiateLocale, resolveTimeZone, TIME_ZONE_COOKIE } from './routing.js';

/** Everything a server component needs to render text for this request. */
export interface RequestIntl {
  readonly locale: string;
  readonly direction: 'ltr' | 'rtl';
  readonly timeZone: string;
  readonly catalog: PartialCatalog;
  readonly t: Translator;
}

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
  const prefix = namespace === undefined ? '' : namespace.endsWith('.') ? namespace : `${namespace}.`;
  return (key, values) => intl.t.format(`${prefix}${key}`, values);
}
