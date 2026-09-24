import { DEFAULT_LOCALE } from '@relay/i18n';

import { absoluteUrl, type JsonLdNode } from './seo';

/**
 * `WebPage` plus `Dataset` structured data for a reference page that states
 * recorded values: a spec, a pixel size.
 *
 * `dateModified` is the day a person last read the cited document, not the
 * day the page was built, because that is the date the value is true as of.
 * A page with no citation gets no `Dataset` node: a dataset with no source is
 * exactly the unverifiable claim this markup must not make.
 */
export interface ReferencePageInput {
  readonly name: string;
  readonly description: string;
  readonly path: string;
  readonly locale?: string;
  /** ISO calendar date a person last read the source. */
  readonly verifiedOn?: string;
  readonly citationUrls: readonly string[];
  /** The site's own name, for `publisher` and `creator`. */
  readonly publisherName: string;
}

export function referencePageJsonLd(input: ReferencePageInput): JsonLdNode {
  const locale = input.locale ?? DEFAULT_LOCALE;
  const url = absoluteUrl(input.path, locale);
  const publisher = {
    '@type': 'Organization',
    name: input.publisherName,
    url: absoluteUrl('/', locale),
  };
  const citation = input.citationUrls.map((sourceUrl) => ({
    '@type': 'CreativeWork',
    url: sourceUrl,
  }));
  const dateModified = input.verifiedOn;

  const webPage = {
    '@type': 'WebPage',
    '@id': url,
    url,
    name: input.name,
    description: input.description,
    inLanguage: locale,
    ...(dateModified === undefined ? {} : { dateModified }),
    ...(citation.length === 0 ? {} : { citation }),
    publisher,
  };

  if (citation.length === 0) {
    return { '@context': 'https://schema.org', ...webPage };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      webPage,
      {
        '@type': 'Dataset',
        '@id': `${url}#dataset`,
        name: input.name,
        description: input.description,
        url,
        inLanguage: locale,
        isAccessibleForFree: true,
        ...(dateModified === undefined ? {} : { dateModified }),
        citation,
        creator: publisher,
        mainEntityOfPage: { '@id': url },
      },
    ],
  };
}
