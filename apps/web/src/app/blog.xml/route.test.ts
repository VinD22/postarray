import { describe, expect, it } from 'vitest';

import { BLOG_ARTICLES, blogArticlePath } from '@/features/blog/registry';
import { absoluteUrl } from '@/features/marketing/seo';

import { GET } from './route';

/** Parse strictly: a feed reader will, and a malformed feed fails silently. */
function parseFeed(xml: string): Document {
  const document = new DOMParser().parseFromString(xml, 'application/xml');
  const failure = document.querySelector('parsererror');
  expect(failure?.textContent ?? null).toBeNull();
  return document;
}

describe('GET /blog.xml', () => {
  it('serves well formed RSS with the right content type', async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/rss+xml; charset=utf-8');

    const document = parseFeed(await response.text());
    expect(document.documentElement.nodeName).toBe('rss');
    expect(document.documentElement.getAttribute('version')).toBe('2.0');
    expect(document.querySelector('channel > title')?.textContent).toBeTruthy();
    expect(document.querySelector('channel > description')?.textContent).toBeTruthy();
  });

  it('lists every article once, with an absolute link and a permanent guid', async () => {
    const document = parseFeed(await (await GET()).text());
    const items = [...document.querySelectorAll('channel > item')];

    expect(items).toHaveLength(BLOG_ARTICLES.length);

    for (const article of BLOG_ARTICLES) {
      const expected = absoluteUrl(blogArticlePath(article.slug));
      const item = items.find(
        (candidate) => candidate.querySelector('link')?.textContent === expected,
      );

      expect(item, article.slug).toBeDefined();
      expect(item?.querySelector('title')?.textContent).toBe(article.title);
      expect(item?.querySelector('guid')?.textContent).toBe(expected);
      expect(item?.querySelector('guid')?.getAttribute('isPermaLink')).toBe('true');
      expect(item?.querySelector('description')?.textContent).toBe(article.description);
      expect(item?.querySelector('pubDate')?.textContent).toContain('GMT');
    }
  });

  it('uses absolute URLs everywhere, including the self link', async () => {
    const xml = await (await GET()).text();
    const document = parseFeed(xml);

    const urls = [
      document.querySelector('channel > link')?.textContent ?? '',
      document.querySelector('channel > atom\\:link')?.getAttribute('href') ??
        /href="([^"]+)"/.exec(xml)?.[1] ??
        '',
      ...[...document.querySelectorAll('channel > item > link')].map(
        (node) => node.textContent ?? '',
      ),
    ];

    expect(urls.length).toBeGreaterThan(1);
    for (const url of urls) {
      expect(url, url).toMatch(/^https?:\/\//);
      expect(() => new URL(url)).not.toThrow();
    }
  });
});
