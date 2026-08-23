import { DEFAULT_LOCALE, PUBLIC_LOCALE_CODES } from '@relay/i18n';
import { describe, expect, it } from 'vitest';

import { BLOG_ARTICLES, blogArticlePath } from '@/features/blog/registry';
import { articleContent, articleLocales } from '@/features/blog/types';
import { absoluteUrl } from '@/features/marketing/seo';

import { GET, generateStaticParams } from './route';

function parseFeed(xml: string): Document {
  const document = new DOMParser().parseFromString(xml, 'application/xml');
  const failure = document.querySelector('parsererror');
  expect(failure?.textContent ?? null).toBeNull();
  return document;
}

describe('GET /[locale]/blog.xml', () => {
  it('generates one prefixed route for every public non-English locale', () => {
    expect(generateStaticParams()).toEqual(
      PUBLIC_LOCALE_CODES.filter((locale) => locale !== DEFAULT_LOCALE).map((locale) => ({
        locale,
      })),
    );
  });

  it('serves a locale feed with only articles actually written in that language', async () => {
    const locale = BLOG_ARTICLES.flatMap((article) => articleLocales(article)).find(
      (candidate) => candidate !== DEFAULT_LOCALE,
    );
    if (locale === undefined) return;

    const response = await GET(new Request('https://relay.example/blog.xml'), {
      params: Promise.resolve({ locale }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-language')).toBe(locale);
    const document = parseFeed(await response.text());
    expect(document.querySelector('channel > language')?.textContent).toBe(locale);

    for (const article of BLOG_ARTICLES) {
      const item = [...document.querySelectorAll('channel > item')].find(
        (candidate) =>
          candidate.querySelector('guid')?.textContent ===
          absoluteUrl(blogArticlePath(article.slug), locale),
      );
      if (articleLocales(article).includes(locale)) {
        expect(item, article.slug).toBeDefined();
        expect(item?.querySelector('title')?.textContent).toBe(
          articleContent(article, locale).title,
        );
      } else {
        expect(item, article.slug).toBeUndefined();
      }
    }
  });

  it('rejects an English-prefixed or unknown feed route', async () => {
    const request = new Request('https://relay.example/blog.xml');
    await expect(
      GET(request, { params: Promise.resolve({ locale: DEFAULT_LOCALE }) }),
    ).resolves.toMatchObject({ status: 404 });
    await expect(
      GET(request, { params: Promise.resolve({ locale: 'xx' }) }),
    ).resolves.toMatchObject({ status: 404 });
  });
});
