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
 * The reciprocal hreflang cluster for a piece of content that does not exist
 * in every active locale, such as a blog article.
 *
 * `localeAlternates` assumes the same page renders at every active locale
 * path, which is true of catalog-driven marketing pages and false of an
 * article that was only ever written in some of them. Advertising all 25
 * languages for writing that exists in three is the duplicate content problem
 * this function exists to avoid: `languages` lists only `availableLocales`,
 * and the canonical points at the current locale only when that locale is one
 * of them. A reader on a locale with no translation is served the English
 * article, so the canonical for that request points at the English URL
 * instead of self-referencing a page that does not exist in that language.
 */
export function articleAlternates(
  path: string,
  locale: string,
  availableLocales: readonly string[],
): LocaleAlternates {
  const canonicalLocale = availableLocales.includes(locale) ? locale : DEFAULT_LOCALE;
  return {
    canonical: absoluteUrl(path, canonicalLocale),
    languages: {
      ...Object.fromEntries(
        availableLocales.map((available) => [available, absoluteUrl(path, available)]),
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

/**
 * Every Open Graph locale except the current one, deduplicated.
 *
 * Shared by `pageMetadata` and `articleMetadata` so the two cannot drift into
 * advertising different alternate locale sets for the same site.
 */
export function openGraphAlternateLocales(locale: string): string[] {
  return [
    ...new Set(
      ACTIVE_LOCALE_CODES.filter((activeLocale) => activeLocale !== locale)
        .map(toOpenGraphLocale)
        .filter((activeLocale): activeLocale is string => activeLocale !== undefined),
    ),
  ];
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
  const alternateOpenGraphLocales = openGraphAlternateLocales(locale);

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

/**
 * Metadata for a page whose title and description are content, not catalog
 * copy.
 *
 * `pageMetadata` takes message keys, which is right for interface copy that
 * every locale carries. A comparison page carries several hundred words of
 * dated, sourced English content loaded per slug, so its own title and
 * description arrive as strings for the same reason `articleMetadata` takes
 * them as strings. The difference from `articleMetadata` is the Open Graph
 * type: this is a `website` page with no author and no publication date, and
 * claiming otherwise in markup would be the same class of error as claiming a
 * rating.
 */
export async function contentPageMetadata(
  title: string,
  description: string,
  path: string,
  locale: string = DEFAULT_LOCALE,
): Promise<Metadata> {
  const t = await marketingTranslator(locale);
  const url = absoluteUrl(path, locale);
  const openGraphLocale = toOpenGraphLocale(locale);
  const alternateLocales = openGraphAlternateLocales(locale);

  return {
    title,
    description,
    alternates: localeAlternates(path, locale),
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: t.t('web.brand.name'),
      ...(openGraphLocale === undefined ? {} : { locale: openGraphLocale }),
      ...(alternateLocales.length === 0 ? {} : { alternateLocale: alternateLocales }),
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
  };
}

/**
 * Product metadata during public prelaunch.
 *
 * Checkout is closed, so the structured data deliberately has no `Offer` and
 * cannot tell a search engine that a paid product is in stock. The planned
 * prices remain visible as ordinary, clearly labelled page copy.
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

/**
 * The site itself.
 *
 * Deliberately without a `potentialAction` / `SearchAction`: sitelinks search
 * markup declares a search endpoint at a URL template, and this site has no
 * search of any kind. That would be markup for a feature that does not exist,
 * the same class of error as an invented rating.
 */
export async function websiteJsonLd(locale: string = DEFAULT_LOCALE): Promise<JsonLdNode> {
  const t = await marketingTranslator(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t.t('web.brand.name'),
    url: absoluteUrl(ROUTES.home, locale),
    description: t.t('web.brand.tagline'),
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: t.t('web.brand.name'),
      url: absoluteUrl(ROUTES.home, locale),
    },
  };
}

/** A calendar date as an ISO instant, with the zone stated rather than assumed. */
function calendarDateToInstant(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toISOString();
}

export interface ArticleSeoInput {
  /** Already-resolved article title. Article prose is content, not catalog copy. */
  readonly headline: string;
  readonly description: string;
  /** Site-relative path, for example `/blog/a-slug`. */
  readonly path: string;
  /** ISO calendar dates. `updated` is never earlier than `published`. */
  readonly published: string;
  readonly updated: string;
  /** The named desk or person accountable for the writing. Never invented. */
  readonly authorName: string;
  /** The named desk or person who checked the platform claims, when there is one. */
  readonly reviewerName?: string;
  /** Official documents the article relies on. */
  readonly sourceUrls?: readonly string[];
  readonly locale?: string;
  /**
   * The languages this article was actually written in. When present,
   * `articleMetadata` builds its alternates from `articleAlternates` rather
   * than assuming every active locale has a translation.
   */
  readonly availableLocales?: readonly string[];
}

/**
 * `Article` structured data.
 *
 * `author` and `reviewedBy` are required inputs rather than optional
 * decoration: markup that claims an article has an author without naming one
 * is worse than markup that omits the property. There is no `publisher.logo`,
 * because no logo asset exists at a stable URL yet and inventing one would put
 * a 404 into structured data.
 */
export async function articleJsonLd(input: ArticleSeoInput): Promise<JsonLdNode> {
  const locale = input.locale ?? DEFAULT_LOCALE;
  const t = await marketingTranslator(locale);
  const url = absoluteUrl(input.path, locale);
  const sourceUrls = input.sourceUrls ?? [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    inLanguage: locale,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: calendarDateToInstant(input.published),
    dateModified: calendarDateToInstant(input.updated),
    author: { '@type': 'Organization', name: input.authorName },
    ...(input.reviewerName === undefined
      ? {}
      : { reviewedBy: { '@type': 'Organization', name: input.reviewerName } }),
    publisher: {
      '@type': 'Organization',
      name: t.t('web.brand.name'),
      url: absoluteUrl(ROUTES.home, locale),
    },
    ...(sourceUrls.length === 0
      ? {}
      : { citation: sourceUrls.map((sourceUrl) => ({ '@type': 'CreativeWork', url: sourceUrl })) }),
  };
}

/**
 * Metadata for one article: the canonical and hreflang contract every other
 * route gets, plus an `article` Open Graph type with real publication and
 * modification times. Title and description arrive as strings because article
 * prose is content loaded per slug, not interface copy merged into every page.
 */
export async function articleMetadata(input: ArticleSeoInput): Promise<Metadata> {
  const locale = input.locale ?? DEFAULT_LOCALE;
  const t = await marketingTranslator(locale);
  const url = absoluteUrl(input.path, locale);
  const alternates =
    input.availableLocales === undefined
      ? localeAlternates(input.path, locale)
      : articleAlternates(input.path, locale, input.availableLocales);
  const openGraphLocale = toOpenGraphLocale(locale);
  const alternateLocales = openGraphAlternateLocales(locale);

  return {
    title: input.headline,
    description: input.description,
    alternates,
    openGraph: {
      type: 'article',
      url,
      title: input.headline,
      description: input.description,
      siteName: t.t('web.brand.name'),
      publishedTime: calendarDateToInstant(input.published),
      modifiedTime: calendarDateToInstant(input.updated),
      authors: [input.authorName],
      ...(openGraphLocale === undefined ? {} : { locale: openGraphLocale }),
      ...(alternateLocales.length === 0 ? {} : { alternateLocale: alternateLocales }),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.headline,
      description: input.description,
    },
  };
}
