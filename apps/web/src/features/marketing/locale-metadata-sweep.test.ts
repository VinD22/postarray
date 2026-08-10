import { describe, expect, it } from 'vitest';
import {
  ACTIVE_LOCALE_CODES,
  DEFAULT_LOCALE,
  REVIEWED_LOCALE_CODE_LIST,
  REVIEW_PROMISE_LOCALE_CODES,
  getLocale,
} from '@relay/i18n';
import type { MessageKey } from '@relay/i18n/translate';

import { getWebLocaleDirection, isWebLocale } from '@/lib/i18n/development-pseudo-locales';
import { localizedHref } from '@/lib/i18n/routing';

import { marketingTranslator } from './i18n';
import { absoluteUrl, pageMetadata } from './seo';
import { ROUTES } from './site';

/**
 * The multilingual promise, swept end to end.
 *
 * A reviewed badge is a claim about a language, and a claim about a language is
 * only worth something if the pages in that language are actually addressable:
 * correct `lang` and `dir` on the document, a canonical that points at itself
 * rather than at English, a reciprocal hreflang cluster, and a title and
 * description that are not the English source showing through.
 *
 * The sweep runs over the fifteen promise locales rather than only the
 * reviewed ones, because a vacuous pass on an empty reviewed set would tell
 * nobody anything. Every reviewed locale is asserted to be inside that set, so
 * promoting a language cannot route around this test.
 *
 * `lang` and `dir` are asserted through the two helpers the root layout reads
 * (`isWebLocale` and `getWebLocaleDirection`) rather than by rendering the
 * layout, which would drag `next/font` into a unit test to check two strings.
 */

interface SweepRoute {
  readonly path: string;
  readonly titleKey: MessageKey;
  readonly descriptionKey: MessageKey;
}

/**
 * The routes a translated visitor actually lands on. Pricing, legal, the blog
 * and the free tools are deliberately absent: their copy is on the B5 English
 * fallback list by policy, so asserting a translated title there would assert
 * the opposite of what the project decided.
 */
const SWEEP_ROUTES: readonly SweepRoute[] = [
  {
    path: ROUTES.home,
    titleKey: 'web.meta.home.title',
    descriptionKey: 'web.meta.home.description',
  },
  {
    path: ROUTES.product,
    titleKey: 'web.meta.product.title',
    descriptionKey: 'web.meta.product.description',
  },
  {
    path: ROUTES.integrations,
    titleKey: 'web.meta.integrations.title',
    descriptionKey: 'web.meta.integrations.description',
  },
  {
    path: ROUTES.capabilities,
    titleKey: 'web.meta.capabilities.title',
    descriptionKey: 'web.meta.capabilities.description',
  },
  {
    path: ROUTES.creators,
    titleKey: 'web.meta.creators.title',
    descriptionKey: 'web.meta.creators.description',
  },
  {
    path: ROUTES.agencies,
    titleKey: 'web.meta.agencies.title',
    descriptionKey: 'web.meta.agencies.description',
  },
  {
    path: ROUTES.developers,
    titleKey: 'web.meta.developers.title',
    descriptionKey: 'web.meta.developers.description',
  },
  {
    path: ROUTES.resources,
    titleKey: 'web.meta.resources.title',
    descriptionKey: 'web.meta.resources.description',
  },
  {
    path: ROUTES.methodology,
    titleKey: 'web.meta.methodology.title',
    descriptionKey: 'web.meta.methodology.description',
  },
  {
    path: ROUTES.compare,
    titleKey: 'web.meta.compare.title',
    descriptionKey: 'web.meta.compare.description',
  },
];

const SWEEP_LOCALES = REVIEW_PROMISE_LOCALE_CODES.filter((locale) => locale !== DEFAULT_LOCALE);

describe('locale metadata sweep', () => {
  it('sweeps every locale that carries a reviewed badge', () => {
    for (const locale of REVIEWED_LOCALE_CODE_LIST) {
      expect(REVIEW_PROMISE_LOCALE_CODES, locale).toContain(locale);
    }
  });

  it.each(SWEEP_LOCALES)('renders %s with a truthful lang and dir', (locale) => {
    const descriptor = getLocale(locale);

    expect(descriptor, locale).toBeDefined();
    expect(isWebLocale(locale), locale).toBe(true);
    expect(getWebLocaleDirection(locale), locale).toBe(descriptor?.direction);
    expect(localizedHref(ROUTES.home, locale)).toBe(`/${locale}`);
  });

  it.each(SWEEP_LOCALES)('gives %s a self-canonical and a reciprocal cluster', async (locale) => {
    for (const route of SWEEP_ROUTES) {
      const metadata = await pageMetadata(route.titleKey, route.descriptionKey, route.path, locale);
      const alternates = metadata.alternates;
      const languages = alternates?.languages as Record<string, string> | undefined;

      expect(alternates?.canonical, `${locale} ${route.path}`).toBe(
        absoluteUrl(route.path, locale),
      );
      expect(languages?.[locale], `${locale} ${route.path}`).toBe(absoluteUrl(route.path, locale));
      expect(languages?.['x-default'], `${locale} ${route.path}`).toBe(
        absoluteUrl(route.path, DEFAULT_LOCALE),
      );

      for (const alternate of ACTIVE_LOCALE_CODES) {
        expect(languages?.[alternate], `${locale} ${route.path} to ${alternate}`).toBe(
          absoluteUrl(route.path, alternate),
        );
      }
    }
  });

  it.each(SWEEP_LOCALES)(
    'does not show the English title through on %s',
    async (locale) => {
      const [t, english] = await Promise.all([
        marketingTranslator(locale),
        marketingTranslator(DEFAULT_LOCALE),
      ]);

      for (const route of SWEEP_ROUTES) {
        const metadata = await pageMetadata(
          route.titleKey,
          route.descriptionKey,
          route.path,
          locale,
        );

        expect(t.has(route.titleKey), `${locale} ${route.titleKey}`).toBe(true);
        expect(t.has(route.descriptionKey), `${locale} ${route.descriptionKey}`).toBe(true);
        expect(metadata.title, `${locale} ${route.path}`).not.toBe(english.format(route.titleKey));
        expect(metadata.description, `${locale} ${route.path}`).not.toBe(
          english.format(route.descriptionKey),
        );
      }
    },
    20_000,
  );
});
