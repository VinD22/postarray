import type { Metadata } from 'next';
import type { MessageKey } from '@relay/i18n/translate';

import { marketingTranslator } from './i18n';
import { ROUTES, SITE_ORIGIN } from './site';

/**
 * Metadata and structured data for the public site.
 *
 * Structured data here describes only things that are true and checkable: the
 * organization, the site itself, the single offer with its real price and
 * currency, and the breadcrumb trail. There is no `aggregateRating`, no
 * `review` and no `AggregateOffer`, because we have no reviews and one offer,
 * and marking up ratings we do not have is both dishonest and a policy breach.
 */

export function pageMetadata(
  titleKey: MessageKey,
  descriptionKey: MessageKey,
  path: string,
): Metadata {
  const t = marketingTranslator();
  const title = t.format(titleKey);
  const description = t.format(descriptionKey);
  const url = new URL(path, SITE_ORIGIN).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: t.t('web.brand.name'),
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

export function organizationJsonLd(): JsonLdNode {
  const t = marketingTranslator();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t.t('web.brand.name'),
    url: SITE_ORIGIN,
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
export function offerJsonLd(): JsonLdNode {
  const t = marketingTranslator();
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t.t('web.brand.name'),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: t.t('web.meta.home.description'),
    url: SITE_ORIGIN,
    offers: [
      {
        '@type': 'Offer',
        name: t.t('web.pricing.monthlyLabel'),
        price: '29.00',
        priceCurrency: 'USD',
        url: new URL(ROUTES.pricing, SITE_ORIGIN).toString(),
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
        url: new URL(ROUTES.pricing, SITE_ORIGIN).toString(),
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

export function faqJsonLd(entries: readonly { question: string; answer: string }[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

export function breadcrumbJsonLd(
  trail: readonly { readonly name: string; readonly path: string }[],
): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_ORIGIN).toString(),
    })),
  };
}

/** Serialize for a `<script type="application/ld+json">` tag safely. */
export function jsonLdScript(node: JsonLdNode): string {
  return JSON.stringify(node).replace(/</g, '\\u003c');
}
