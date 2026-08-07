'use client';

/**
 * The i18n entry point for client screens.
 *
 *   import { useTranslations, useFormatters } from '@/lib/i18n';
 *
 * Server components use `@/lib/i18n/server` instead.
 *
 * There is exactly one translator in the app. `@relay/i18n` owns the catalog,
 * the ICU runtime and the fallback policy; this module owns the request
 * negotiation and the provider placement.
 */

export {
  Trans,
  useDirectionAttributes,
  useI18n,
  useTranslations,
  type NamespaceTranslator,
} from '@relay/i18n/react';

export { useFormatters, type Formatters } from './formatters';
export { IntlProvider } from './provider';
export { useLocalizedRouter } from './use-localized-router';
export {
  LOCALE_COOKIE,
  TIME_ZONE_COOKIE,
  negotiateLocale,
  resolveTimeZone,
  routing,
  type ResolvedLocale,
} from './routing';
