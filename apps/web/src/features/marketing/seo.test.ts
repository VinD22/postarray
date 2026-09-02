import { DEFAULT_LOCALE, PUBLIC_LOCALE_CODES } from '@relay/i18n';
import { describe, expect, it } from 'vitest';

import { MARKETING_ROUTES } from './site';
import {
  absoluteUrl,
  contentPageMetadata,
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
      for (const locale of PUBLIC_LOCALE_CODES) {
        const alternates = localeAlternates(path, locale);

        expect(alternates.canonical).toBe(absoluteUrl(path, locale));
        expect(alternates.languages[locale]).toBe(absoluteUrl(path, locale));
        expect(alternates.languages['x-default']).toBe(absoluteUrl(path, DEFAULT_LOCALE));

        for (const alternateLocale of PUBLIC_LOCALE_CODES) {
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

describe('the share card', () => {
  /**
   * The defect this pins: every builder here declares its own `openGraph`
   * object, and doing so stops Next merging the file-convention
   * `opengraph-image`. The live site carried zero `og:image` tags on every page
   * while `twitter.card` advertised `summary_large_image`, so every shared link
   * rendered bare. Nothing failed; the tags were simply absent.
   */
  it('is attached by every metadata builder, not left to Next to merge', async () => {
    const page = await pageMetadata(
      'web.meta.pricing.title',
      'web.meta.pricing.description',
      '/pricing',
    );
    const content = await contentPageMetadata(
      'A comparison',
      'A description',
      '/compare/platform-native-tools',
      DEFAULT_LOCALE,
      ['en'],
    );

    for (const metadata of [page, content]) {
      const images = metadata.openGraph?.images;
      expect(Array.isArray(images) && images.length > 0).toBe(true);
    }
  });

  it('points at the rendered card at its declared size', async () => {
    const metadata = await pageMetadata(
      'web.meta.home.title',
      'web.meta.home.description',
      '/',
    );
    const images = metadata.openGraph?.images;
    const first = Array.isArray(images) ? images[0] : undefined;

    expect(first).toMatchObject({
      url: absoluteUrl('/opengraph-image'),
      width: 1200,
      height: 630,
    });
  });
});

describe('page titles', () => {
  it('does not let the layout append the brand to a title that already names it', async () => {
    // "Post Array, the multilingual publishing control plane · Post Array" was
    // the live home title. `absolute` opts the page out of the root template.
    const home = await pageMetadata('web.meta.home.title', 'web.meta.home.description', '/');
    expect(home.title).toEqual({
      absolute: expect.stringContaining('Post Array') as unknown as string,
    });
  });

  it('leaves a title that does not name the brand for the template to complete', async () => {
    const pricing = await pageMetadata(
      'web.meta.pricing.title',
      'web.meta.pricing.description',
      '/pricing',
    );
    expect(typeof pricing.title).toBe('string');
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

  it('does not advertise untranslated content as a localized page', async () => {
    const metadata = await contentPageMetadata(
      'English comparison title',
      'English comparison description',
      '/compare/platform-native-tools',
      'de',
      ['en'],
    );

    expect(metadata.alternates?.canonical).toBe(
      absoluteUrl('/compare/platform-native-tools', 'en'),
    );
    expect(metadata.alternates?.languages).toEqual({
      en: absoluteUrl('/compare/platform-native-tools', 'en'),
      'x-default': absoluteUrl('/compare/platform-native-tools', 'en'),
    });
    expect(metadata.openGraph?.url).toBe(
      absoluteUrl('/compare/platform-native-tools', 'en'),
    );
    expect(metadata.openGraph?.locale).toBe('en_US');
    expect(metadata.openGraph?.alternateLocale).toBeUndefined();
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
