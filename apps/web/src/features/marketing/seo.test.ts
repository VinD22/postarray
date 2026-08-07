import { ACTIVE_LOCALE_CODES, DEFAULT_LOCALE } from '@relay/i18n';
import { describe, expect, it } from 'vitest';

import { MARKETING_ROUTES } from './site';
import {
  absoluteUrl,
  faqJsonLd,
  jsonLdScript,
  localeAlternates,
  offerJsonLd,
  organizationJsonLd,
  pageMetadata,
  toOpenGraphLocale,
} from './seo';

describe('localeAlternates', () => {
  it('keeps each canonical self-referential and emits a reciprocal cluster for every route', () => {
    for (const path of MARKETING_ROUTES) {
      for (const locale of ACTIVE_LOCALE_CODES) {
        const alternates = localeAlternates(path, locale);

        expect(alternates.canonical).toBe(absoluteUrl(path, locale));
        expect(alternates.languages[locale]).toBe(absoluteUrl(path, locale));
        expect(alternates.languages['x-default']).toBe(absoluteUrl(path, DEFAULT_LOCALE));

        for (const alternateLocale of ACTIVE_LOCALE_CODES) {
          expect(alternates.languages[alternateLocale]).toBe(absoluteUrl(path, alternateLocale));
        }
      }
    }
  });
});

describe('toOpenGraphLocale', () => {
  it.each([
    ['en', 'en_US'],
    ['de', 'de_DE'],
    ['pt-BR', 'pt_BR'],
    ['zh-Hans', 'zh_CN'],
    ['zh-Hant', 'zh_TW'],
  ])('converts %s to the Open Graph locale form', (locale, expected) => {
    expect(toOpenGraphLocale(locale)).toBe(expected);
  });

  it('omits the Spanish Latin America grouping because Open Graph has no equivalent', () => {
    expect(toOpenGraphLocale('es-419')).toBeUndefined();
  });

  it('omits malformed route values rather than failing metadata generation', () => {
    expect(toOpenGraphLocale('not a locale')).toBeUndefined();
  });
});

describe('localized metadata and structured data', () => {
  it('uses the locale for a self-canonical URL and Open Graph locale', async () => {
    const metadata = await pageMetadata(
      'web.meta.pricing.title',
      'web.meta.pricing.description',
      '/pricing',
      'de',
    );

    expect(metadata.alternates?.canonical).toBe(absoluteUrl('/pricing', 'de'));
    expect(metadata.openGraph?.locale).toBe('de_DE');
  });

  it('sets a language on application and FAQ markup without advertising a closed offer', async () => {
    const offer = JSON.parse(jsonLdScript(await offerJsonLd('de'))) as {
      readonly inLanguage: string;
      readonly offers?: readonly unknown[];
    };
    const faq = JSON.parse(jsonLdScript(faqJsonLd([], 'de'))) as { readonly inLanguage: string };

    expect(offer.inLanguage).toBe('de');
    expect(offer.offers).toBeUndefined();
    expect(faq.inLanguage).toBe('de');
  });

  it('does not advertise placeholder contact channels during public prelaunch', async () => {
    const organization = JSON.parse(jsonLdScript(await organizationJsonLd('en'))) as {
      readonly contactPoint?: readonly unknown[];
    };

    expect(organization.contactPoint).toBeUndefined();
    expect(JSON.stringify(organization)).not.toContain('@relay.example');
  });
});
