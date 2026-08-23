import { DEFAULT_LOCALE } from '@relay/i18n';

import { marketingTranslator } from '@/features/marketing/i18n';
import { absoluteUrl } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

import { BLOG_ARTICLES, blogArticlePath, blogDateToInstant } from './registry';
import { articleContent, clusterLabelKey, hasArticleLocale } from './types';

/**
 * The RSS feed.
 *
 * Each locale has its own feed document. A feed is a subscription to writing,
 * and a subscriber expects every item in the language they subscribed in. An
 * article without a translation is omitted from that locale's feed instead of
 * publishing English content at a localized URL.
 *
 * Every URL is absolute. A relative link in a feed resolves against whatever
 * the reader's client guesses, which is usually nothing.
 */

export const BLOG_FEED_PATH = '/blog.xml';

export const BLOG_FEED_CONTENT_TYPE = 'application/rss+xml; charset=utf-8';

/** The five characters that are not safe as XML character data. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RFC 822 date, which is what RSS 2.0 requires and what readers parse. */
function toRfc822(isoDate: string): string {
  return blogDateToInstant(isoDate).toUTCString();
}

export async function blogFeedXml(locale: string = DEFAULT_LOCALE): Promise<string> {
  const t = await marketingTranslator(locale);
  const feedUrl = absoluteUrl(BLOG_FEED_PATH, locale);
  const indexUrl = absoluteUrl(ROUTES.blog, locale);
  const articles = BLOG_ARTICLES.filter(
    (article) => locale === DEFAULT_LOCALE || hasArticleLocale(article, locale),
  );
  const newest = articles[0];

  const items = articles.map((article) => {
    const url = absoluteUrl(blogArticlePath(article.slug), locale);
    const content = articleContent(article, locale);
    return [
      '    <item>',
      `      <title>${escapeXml(content.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${toRfc822(article.published)}</pubDate>`,
      `      <description>${escapeXml(content.description)}</description>`,
      `      <category>${escapeXml(t.format(clusterLabelKey(article.cluster)))}</category>`,
      '    </item>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(t.t('web.blog.feed.title'))}</title>`,
    `    <link>${escapeXml(indexUrl)}</link>`,
    `    <description>${escapeXml(t.t('web.blog.feed.description'))}</description>`,
    `    <language>${escapeXml(locale)}</language>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    ...(newest === undefined
      ? []
      : [`    <lastBuildDate>${toRfc822(newest.updated)}</lastBuildDate>`]),
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
