import type { Metadata } from 'next';

import { marketingTranslator } from '@/features/marketing/i18n';
import {
  absoluteUrl,
  localeAlternates,
  openGraphAlternateLocales,
  toOpenGraphLocale,
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
 */
export async function templatedPageMetadata(input: {
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly values: Readonly<Record<string, string>>;
  readonly path: string;
  readonly locale: string;
}): Promise<Metadata> {
  const t = await marketingTranslator(input.locale);
  const title = t.format(input.titleKey, input.values);
  const description = t.format(input.descriptionKey, input.values);
  const url = absoluteUrl(input.path, input.locale);
  const openGraphLocale = toOpenGraphLocale(input.locale);
  const alternateLocales = openGraphAlternateLocales(input.locale);

  return {
    title,
    description,
    alternates: localeAlternates(input.path, input.locale),
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: t.t('web.brand.name'),
      ...(openGraphLocale === undefined ? {} : { locale: openGraphLocale }),
      ...(alternateLocales.length === 0 ? {} : { alternateLocale: alternateLocales }),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}
