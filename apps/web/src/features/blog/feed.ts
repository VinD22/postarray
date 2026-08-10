import { DEFAULT_LOCALE } from '@relay/i18n';

import { marketingTranslator } from '@/features/marketing/i18n';
import { absoluteUrl } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

import { BLOG_ARTICLES, blogArticlePath, blogDateToInstant } from './registry';
import { clusterLabelKey } from './types';

/**
 * The RSS feed.
 *
 * English only, deliberately. A feed is a subscription to writing, and the
 * writing exists in one language today; publishing 25 feeds where 24 carry
 * English items with translated chrome would be a worse experience than one
 * honest feed. When an article gains a translation, that locale gets its own
 * feed document rather than a mixed one.
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

export async function blogFeedXml(): Promise<string> {
  const t = await marketingTranslator(DEFAULT_LOCALE);
  const feedUrl = new URL(BLOG_FEED_PATH, absoluteUrl(ROUTES.home, DEFAULT_LOCALE)).toString();
  const indexUrl = absoluteUrl(ROUTES.blog, DEFAULT_LOCALE);
  const newest = BLOG_ARTICLES[0];

  const items = BLOG_ARTICLES.map((article) => {
    const url = absoluteUrl(blogArticlePath(article.slug), DEFAULT_LOCALE);
    return [
      '    <item>',
      `      <title>${escapeXml(article.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${toRfc822(article.published)}</pubDate>`,
      `      <description>${escapeXml(article.description)}</description>`,
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
    `    <language>${DEFAULT_LOCALE}</language>`,
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
