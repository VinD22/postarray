import { ACTIVE_LOCALE_CODES, DEFAULT_LOCALE, en } from '@relay/i18n';
import { describe, expect, it } from 'vitest';

import {
  absoluteUrl,
  articleJsonLd,
  articleMetadata,
  jsonLdScript,
  websiteJsonLd,
} from '@/features/marketing/seo';

import { BLOG_ARTICLES, blogArticlePath } from './registry';

const article = BLOG_ARTICLES[0];

function requireArticle(): NonNullable<typeof article> {
  if (!article) throw new Error('The registry must carry at least one article.');
  return article;
}

describe('article metadata', () => {
  it('self-canonicalizes and emits a reciprocal hreflang cluster in every locale', async () => {
    const path = blogArticlePath(requireArticle().slug);

    for (const locale of ACTIVE_LOCALE_CODES) {
      const metadata = await articleMetadata({
        headline: requireArticle().title,
        description: requireArticle().description,
        path,
        published: requireArticle().published,
        updated: requireArticle().updated,
        authorName: en['web.blog.byline.editorial.name'],
        locale,
      });

      expect(metadata.alternates?.canonical).toBe(absoluteUrl(path, locale));

      // `Languages` is keyed by a template literal union, so a runtime lookup
      // by locale string needs the plain record view of it.
      const languages = (metadata.alternates?.languages ?? {}) as Readonly<
        Record<string, string | undefined>
      >;
      expect(languages['x-default']).toBe(absoluteUrl(path, DEFAULT_LOCALE));
      for (const alternate of ACTIVE_LOCALE_CODES) {
        expect(languages[alternate], `${locale} -> ${alternate}`).toBe(
          absoluteUrl(path, alternate),
        );
      }
    }
    // Every active locale's catalog is loaded to resolve the brand name.
  }, 30_000);

  it('marks the page as an article with real publication and modification times', async () => {
    const metadata = await articleMetadata({
      headline: requireArticle().title,
      description: requireArticle().description,
      path: blogArticlePath(requireArticle().slug),
      published: '2026-08-01',
      updated: '2026-08-10',
      authorName: en['web.blog.byline.editorial.name'],
      reviewerName: en['web.blog.byline.platform.name'],
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
    expect(openGraph?.locale).toBe('de_DE');
    expect(openGraph?.authors).toEqual([en['web.blog.byline.editorial.name']]);
  });
});

describe('article structured data', () => {
  it('names the author and the reviewer and cites the sources', async () => {
    const subject = requireArticle();
    const node = JSON.parse(
      jsonLdScript(
        await articleJsonLd({
          headline: subject.title,
          description: subject.description,
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
