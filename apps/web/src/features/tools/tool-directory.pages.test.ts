import { describe, expect, it } from 'vitest';

import CharacterCounterRoute, {
  generateMetadata as counterMetadata,
  generateStaticParams as counterParams,
} from '@/app/[locale]/(marketing)/tools/character-counter/[platform]/page';
import ToolsIndexRoute, {
  generateMetadata as indexMetadata,
} from '@/app/[locale]/(marketing)/tools/page';
import ImageSizesRoute, {
  generateMetadata as imageSizesMetadata,
} from '@/app/[locale]/(marketing)/tools/social-media-image-sizes/page';
import { marketingTranslator } from '@/features/marketing/i18n';
import { absoluteUrl } from '@/features/marketing/seo';
import { MARKETING_ROUTES, ROUTES, characterCounterPath } from '@/features/marketing/site';

import { CHARACTER_COUNTER_PAGES, CHARACTER_COUNTER_SLUGS, linkRule } from './character-counter';

/**
 * Every generated tool route, built once.
 *
 * Constructing a Server Component's element tree evaluates the copy it passes
 * as props, so awaiting each page proves the route resolves its values and its
 * links without throwing. The second half of the file does what awaiting the
 * page cannot: it formats the shared per platform sentences for every platform
 * and checks that each one came out as a sentence about that platform, because
 * a message that fails to format falls back to its own text with the arguments
 * stripped, which looks fine until you notice the platform name is missing.
 */

const LOCALE = 'en';

/** Every key the counter pages share. One set of sentences, nine platforms. */
const TEMPLATED_KEYS = [
  'web.toolDirectory.counter.title',
  'web.toolDirectory.counter.lede',
  'web.toolDirectory.counter.explainer.title',
  'web.toolDirectory.counter.explainer.body',
  'web.toolDirectory.counter.faq.counting.q',
  'web.toolDirectory.counter.faq.counting.a',
  'web.toolDirectory.counter.faq.links.q',
  'web.meta.toolDirectory.counter.title',
  'web.meta.toolDirectory.counter.description',
] as const;

describe('the tools index', () => {
  it('builds and canonicalizes to itself', async () => {
    await expect(
      ToolsIndexRoute({ params: Promise.resolve({ locale: LOCALE }) }),
    ).resolves.toBeDefined();

    const metadata = await indexMetadata({ params: Promise.resolve({ locale: LOCALE }) });
    expect(metadata.alternates?.canonical).toBe(absoluteUrl(ROUTES.tools, LOCALE));
  });
});

describe('the media limits table', () => {
  it('builds and canonicalizes to itself', async () => {
    await expect(
      ImageSizesRoute({ params: Promise.resolve({ locale: LOCALE }) }),
    ).resolves.toBeDefined();

    const metadata = await imageSizesMetadata({ params: Promise.resolve({ locale: LOCALE }) });
    expect(metadata.alternates?.canonical).toBe(absoluteUrl(ROUTES.toolImageSizes, LOCALE));
  });

  it('is registered as an indexable route', () => {
    expect(MARKETING_ROUTES).toContain(ROUTES.toolImageSizes);
  });
});

describe('every generated character counter route', () => {
  it('declares one static param per page and serves each', async () => {
    const params = counterParams();
    expect(params.map((entry) => entry.platform)).toEqual([...CHARACTER_COUNTER_SLUGS]);

    for (const { platform } of params) {
      await expect(
        CharacterCounterRoute({ params: Promise.resolve({ locale: LOCALE, platform }) }),
        platform,
      ).resolves.toBeDefined();
    }
  });

  it('canonicalizes each page to itself and names the platform in the title', async () => {
    const t = await marketingTranslator(LOCALE);

    for (const page of CHARACTER_COUNTER_PAGES) {
      const metadata = await counterMetadata({
        params: Promise.resolve({ locale: LOCALE, platform: page.slug }),
      });

      expect(metadata.alternates?.canonical, page.slug).toBe(
        absoluteUrl(characterCounterPath(page.slug), LOCALE),
      );
      expect(String(metadata.title), page.slug).toContain(t.format(page.nameKey));
      expect(String(metadata.title), page.slug).not.toContain('{platform}');
    }
  });

  it('is registered as an indexable route, one per page and no more', () => {
    for (const page of CHARACTER_COUNTER_PAGES) {
      expect(MARKETING_ROUTES, page.slug).toContain(characterCounterPath(page.slug));
    }
    expect(new Set(MARKETING_ROUTES).size).toBe(MARKETING_ROUTES.length);
  });

  it('returns no metadata for a platform that has no page', async () => {
    const metadata = await counterMetadata({
      params: Promise.resolve({ locale: LOCALE, platform: 'google-business-profile' }),
    });
    expect(metadata).toEqual({});
  });
});

describe('the shared per platform sentences', () => {
  it('resolves for every platform, with that platform named in each one', async () => {
    const t = await marketingTranslator(LOCALE);

    for (const page of CHARACTER_COUNTER_PAGES) {
      const platform = t.format(page.nameKey);
      const values = {
        platform,
        limit: page.maxLength,
        unit: page.countingUnit,
        mode: linkRule(page),
        cost: page.charactersPerLink,
      };

      for (const key of TEMPLATED_KEYS) {
        const text = t.format(key, values);
        expect(text, `${page.slug}:${key}`).toContain(platform);
        expect(text, `${page.slug}:${key}`).not.toContain('{');
      }
    }
  });

  it('answers the link question with the width the platform actually charges', async () => {
    const t = await marketingTranslator(LOCALE);

    function answerFor(slug: string): string {
      const page = CHARACTER_COUNTER_PAGES.find((candidate) => candidate.slug === slug);
      if (!page) {
        throw new Error(`no character counter page for ${slug}`);
      }
      return t.format('web.toolDirectory.counter.faq.links.a', {
        platform: t.format(page.nameKey),
        mode: linkRule(page),
        cost: page.charactersPerLink,
      });
    }

    expect(answerFor('x')).toContain('23');
    expect(answerFor('instagram')).not.toContain('23');
  });
});
