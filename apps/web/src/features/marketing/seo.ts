import type { Metadata } from 'next';
import { ACTIVE_LOCALE_CODES, DEFAULT_LOCALE } from '@relay/i18n';
import type { MessageKey } from '@relay/i18n/translate';

import { marketingTranslator } from './i18n';
import { ROUTES, SITE_ORIGIN } from './site';
import { localizedHref } from '@/lib/i18n/routing';

/**
 * Metadata and structured data for the public site.
 *
 * Structured data here describes only things that are true and checkable: the
 * organization, the site itself, the single offer with its real price and
 * currency, and the breadcrumb trail. There is no `aggregateRating`, no
 * `review` and no `AggregateOffer`, because we have no reviews and one offer,
 * and marking up ratings we do not have is both dishonest and a policy breach.
 */

export interface LocaleAlternates {
  readonly canonical: string;
  readonly languages: Readonly<Record<string, string>>;
}

/** Build an absolute URL for an indexable marketing route in an interface locale. */
export function absoluteUrl(path: string, locale: string = DEFAULT_LOCALE): string {
  return new URL(localizedHref(path, locale), SITE_ORIGIN).toString();
}

/**
 * The complete reciprocal hreflang cluster for one marketing route.
 *
 * The canonical deliberately points to the current locale. A localized page
 * canonicalizing to English would remove that language from search results.
 */
export function localeAlternates(path: string, locale: string = DEFAULT_LOCALE): LocaleAlternates {
  return {
    canonical: absoluteUrl(path, locale),
    languages: {
      ...Object.fromEntries(
        ACTIVE_LOCALE_CODES.map((activeLocale) => [activeLocale, absoluteUrl(path, activeLocale)]),
      ),
      'x-default': absoluteUrl(path, DEFAULT_LOCALE),
    },
  };
}

/**
 * Convert a BCP-47 interface locale into the underscore format Open Graph
 * expects. `es-419` is a region grouping, not an Open Graph locale, so it is
 * intentionally omitted instead of publishing an invalid value.
 */
export function toOpenGraphLocale(locale: string): string | undefined {
  if (locale === 'es-419') {
    return undefined;
  }

  let maximized: Intl.Locale;
  try {
    maximized = new Intl.Locale(locale).maximize();
  } catch {
    // Metadata can be evaluated before the locale layout rejects a malformed
    // dynamic segment. Omitting Open Graph locale is safe; failing the route
    // is not.
    return undefined;
  }

  return maximized.region === undefined
    ? maximized.language
    : `${maximized.language}_${maximized.region}`;
}

export async function pageMetadata(
  titleKey: MessageKey,
  descriptionKey: MessageKey,
  path: string,
  locale: string = DEFAULT_LOCALE,
): Promise<Metadata> {
  const t = await marketingTranslator(locale);
  const title = t.format(titleKey);
  const description = t.format(descriptionKey);
  const url = absoluteUrl(path, locale);
  const alternates = localeAlternates(path, locale);
  const openGraphLocale = toOpenGraphLocale(locale);
  const alternateOpenGraphLocales = [
    ...new Set(
      ACTIVE_LOCALE_CODES.filter((activeLocale) => activeLocale !== locale)
        .map(toOpenGraphLocale)
        .filter((activeLocale): activeLocale is string => activeLocale !== undefined),
    ),
  ];

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: t.t('web.brand.name'),
      ...(openGraphLocale === undefined ? {} : { locale: openGraphLocale }),
      ...(alternateOpenGraphLocales.length === 0
        ? {}
        : { alternateLocale: alternateOpenGraphLocales }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

interface JsonLdNode {
  readonly [key: string]: unknown;
}

export async function organizationJsonLd(locale: string = DEFAULT_LOCALE): Promise<JsonLdNode> {
  const t = await marketingTranslator(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t.t('web.brand.name'),
    url: absoluteUrl(ROUTES.home, locale),
    description: t.t('web.brand.tagline'),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'security',
        email: t.t('web.legal.contact.security'),
      },
      {
        '@type': 'ContactPoint',
        contactType: 'privacy',
        email: t.t('web.legal.contact.privacy'),
      },
    ],
  };
}

/**
 * The product and its single offer.
 *
 * `price` is the monthly figure and the annual figure is a second offer, so a
 * consumer of this markup sees exactly the two things a buyer sees, with no
 * invented "from" price and no struck through original.
 */
export async function offerJsonLd(locale: string = DEFAULT_LOCALE): Promise<JsonLdNode> {
  const t = await marketingTranslator(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t.t('web.brand.name'),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: t.t('web.meta.home.description'),
    inLanguage: locale,
    url: absoluteUrl(ROUTES.home, locale),
    offers: [
      {
        '@type': 'Offer',
        name: t.t('web.pricing.monthlyLabel'),
        price: '29.00',
        priceCurrency: 'USD',
        url: absoluteUrl(ROUTES.pricing, locale),
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '29.00',
          priceCurrency: 'USD',
          billingIncrement: 1,
          unitCode: 'MON',
        },
      },
      {
        '@type': 'Offer',
        name: t.t('web.pricing.annualLabel'),
        price: '300.00',
        priceCurrency: 'USD',
        url: absoluteUrl(ROUTES.pricing, locale),
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '300.00',
          priceCurrency: 'USD',
          billingIncrement: 1,
          unitCode: 'ANN',
        },
      },
    ],
  };
}

export function faqJsonLd(
  entries: readonly { question: string; answer: string }[],
  locale: string = DEFAULT_LOCALE,
): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

export function breadcrumbJsonLd(
  trail: readonly { readonly name: string; readonly path: string }[],
  locale: string = DEFAULT_LOCALE,
): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, locale),
    })),
  };
}

/** Serialize for a `<script type="application/ld+json">` tag safely. */
export function jsonLdScript(node: JsonLdNode): string {
  return JSON.stringify(node).replace(/</g, '\\u003c');
}
