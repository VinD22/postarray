import { DEFAULT_LOCALE, PUBLIC_LOCALE_CODES, en } from '@relay/i18n';
import { describe, expect, it } from 'vitest';

import {
  absoluteUrl,
  articleAlternates,
  articleJsonLd,
  articleMetadata,
  jsonLdScript,
  toOpenGraphLocale,
  websiteJsonLd,
} from '@/features/marketing/seo';

import { BLOG_ARTICLES, blogArticlePath } from './registry';
import { articleContent, articleLocales } from './types';

const article = BLOG_ARTICLES[0];

function requireArticle(): NonNullable<typeof article> {
  if (!article) throw new Error('The registry must carry at least one article.');
  return article;
}

describe('article alternates', () => {
  it('lists exactly the languages the article was written in, plus x-default', () => {
    const subject = requireArticle();
    const path = blogArticlePath(subject.slug);
    const locales = articleLocales(subject);

    for (const requested of locales) {
      const alternates = articleAlternates(path, requested, locales);
      expect(alternates.canonical).toBe(absoluteUrl(path, requested));

      const languages = alternates.languages as Readonly<Record<string, string | undefined>>;
      expect(Object.keys(languages).sort()).toEqual([...locales, 'x-default'].sort());
      for (const locale of locales) {
        expect(languages[locale]).toBe(absoluteUrl(path, locale));
      }
      expect(languages['x-default']).toBe(absoluteUrl(path, DEFAULT_LOCALE));
    }
  });

  it('canonicals to English for a locale the article has no translation in', () => {
    const subject = requireArticle();
    const path = blogArticlePath(subject.slug);
    const locales = articleLocales(subject);
    const untranslated = PUBLIC_LOCALE_CODES.find((locale) => !locales.includes(locale));
    if (untranslated === undefined) {
      // Every active locale happens to have this article; nothing to assert.
      return;
    }

    const alternates = articleAlternates(path, untranslated, locales);
    expect(alternates.canonical).toBe(absoluteUrl(path, DEFAULT_LOCALE));
    const languages = alternates.languages as Readonly<Record<string, string | undefined>>;
    expect(languages[untranslated]).toBeUndefined();
  });
});

describe('article metadata', () => {
  it('marks the page as an article with real publication and modification times', async () => {
    const subject = requireArticle();
    const content = articleContent(subject, 'de');
    const metadata = await articleMetadata({
      headline: content.title,
      description: content.description,
      path: blogArticlePath(subject.slug),
      published: '2026-08-01',
      updated: '2026-08-10',
      authorName: en['web.blog.byline.editorial.name'],
      reviewerName: en['web.blog.byline.platform.name'],
      availableLocales: articleLocales(subject),
      locale: 'de',
    });

    const openGraph = metadata.openGraph as
      | {
          readonly type?: string;
          readonly publishedTime?: string;
          readonly modifiedTime?: string;
          readonly locale?: string;
          readonly authors?: readonly string[];
        }
      | undefined;

    expect(openGraph?.type).toBe('article');
    expect(openGraph?.publishedTime).toBe('2026-08-01T00:00:00.000Z');
    expect(openGraph?.modifiedTime).toBe('2026-08-10T00:00:00.000Z');
    const contentLocale = articleLocales(subject).includes('de') ? 'de' : 'en';
    expect(openGraph?.locale).toBe(toOpenGraphLocale(contentLocale));
    expect(openGraph?.authors).toEqual([en['web.blog.byline.editorial.name']]);
  });
});

describe('article structured data', () => {
  it('names the author and the reviewer and cites the sources', async () => {
    const subject = requireArticle();
    const content = articleContent(subject, 'en');
    const node = JSON.parse(
      jsonLdScript(
        await articleJsonLd({
          headline: content.title,
          description: content.description,
          path: blogArticlePath(subject.slug),
          published: subject.published,
          updated: subject.updated,
          authorName: en['web.blog.byline.editorial.name'],
          reviewerName: en['web.blog.byline.platform.name'],
          sourceUrls: subject.sources.map((source) => source.url),
        }),
      ),
    ) as {
      readonly '@type': string;
      readonly author: { readonly name: string };
      readonly reviewedBy?: { readonly name: string };
      readonly citation?: readonly { readonly url: string }[];
      readonly publisher: { readonly logo?: unknown };
      readonly mainEntityOfPage: { readonly '@id': string };
    };

    expect(node['@type']).toBe('Article');
    expect(node.author.name).toBe(en['web.blog.byline.editorial.name']);
    expect(node.reviewedBy?.name).toBe(en['web.blog.byline.platform.name']);
    expect(node.citation?.map((entry) => entry.url)).toEqual(
      subject.sources.map((source) => source.url),
    );
    expect(node.mainEntityOfPage['@id']).toBe(absoluteUrl(blogArticlePath(subject.slug)));
    // No logo asset exists at a stable URL, so none is claimed.
    expect(node.publisher.logo).toBeUndefined();
  });

  it('omits the reviewer rather than inventing one', async () => {
    const node = JSON.parse(
      jsonLdScript(
        await articleJsonLd({
          headline: 'A title',
          description: 'A description',
          path: '/blog/a-slug',
          published: '2026-08-01',
          updated: '2026-08-01',
          authorName: en['web.blog.byline.editorial.name'],
        }),
      ),
    ) as { readonly reviewedBy?: unknown; readonly citation?: unknown };

    expect(node.reviewedBy).toBeUndefined();
    expect(node.citation).toBeUndefined();
  });
});

describe('website structured data', () => {
  it('does not declare a search action for a site with no search', async () => {
    const node = JSON.parse(jsonLdScript(await websiteJsonLd('en'))) as {
      readonly '@type': string;
      readonly potentialAction?: unknown;
      readonly url: string;
    };

    expect(node['@type']).toBe('WebSite');
    expect(node.potentialAction).toBeUndefined();
    expect(node.url).toBe(absoluteUrl('/'));
  });
});
