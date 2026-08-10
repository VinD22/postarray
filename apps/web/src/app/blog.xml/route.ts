import { BLOG_FEED_CONTENT_TYPE, blogFeedXml } from '@/features/blog/feed';

/**
 * The RSS feed.
 *
 * Static like the rest of the public site: the feed is the same bytes for
 * every reader, so it is generated once at build rather than per request.
 *
 * The path has no locale prefix on purpose. The articles are English, so there
 * is one feed, and a reader subscribing from a German browser should get the
 * writing that exists rather than a German URL serving English items.
 */
export const dynamic = 'force-static';

export async function GET(): Promise<Response> {
  return new Response(await blogFeedXml(), {
    headers: {
      'content-type': BLOG_FEED_CONTENT_TYPE,
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
