import type { Metadata } from 'next';

import { marketingTranslator } from '@/features/marketing/i18n';
import { routeLocales } from '@/features/marketing/locale-eligibility';
import {
  canonicalLocaleFor,
  localeAlternates,
  openGraphAlternateLocales,
  shareCard,
  toOpenGraphLocale,
  twitterCard,
} from '@/features/marketing/seo';

/**
 * Page metadata whose title and description take an argument.
 *
 * `pageMetadata` in the marketing feature formats a key with no values, which
 * is right for every fixed page. Ten platform pages share two catalog strings
 * and differ only by the platform name, so they need the same canonical,
 * hreflang and Open Graph contract with a formatted title. Building it here
 * rather than overriding the result keeps Open Graph and Twitter from drifting
 * away from the document title, which is what a partial override causes.
 *
 * The canonical and the Open Graph locales follow `routeLocales`: a route
 * family kept on the English source (the specs cluster, for one) canonicalizes
 * every localized request to the English URL.
 */
export async function templatedPageMetadata(input: {
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly values: Readonly<Record<string, string>>;
  readonly path: string;
  readonly locale: string;
}): Promise<Metadata> {
  const t = await marketingTranslator(input.locale);
  return formattedPageMetadata({
    title: t.format(input.titleKey, input.values),
    description: t.format(input.descriptionKey, input.values),
    path: input.path,
    locale: input.locale,
    siteName: t.t('web.brand.name'),
  });
}

/** The same contract for a title and description already formatted by the caller. */
export function formattedPageMetadata(input: {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly locale: string;
  readonly siteName: string;
}): Metadata {
  const { title, description } = input;
  const canonicalLocale = canonicalLocaleFor(input.path, input.locale);
  const alternates = localeAlternates(input.path, input.locale);
  const openGraphLocale = toOpenGraphLocale(canonicalLocale);
  const alternateLocales = openGraphAlternateLocales(canonicalLocale, routeLocales(input.path));

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: 'website',
      url: alternates.canonical,
      title,
      description,
      images: shareCard(title),
      siteName: input.siteName,
      ...(openGraphLocale === undefined ? {} : { locale: openGraphLocale }),
      ...(alternateLocales.length === 0 ? {} : { alternateLocale: alternateLocales }),
    },
    twitter: { card: 'summary_large_image', title, description, images: twitterCard(title) },
  };
}
