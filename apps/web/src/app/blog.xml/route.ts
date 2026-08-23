import { BLOG_FEED_CONTENT_TYPE, blogFeedXml } from '@/features/blog/feed';

/** The default English RSS feed. Localized feeds live at `/{locale}/blog.xml`. */
export const dynamic = 'force-static';

export async function GET(): Promise<Response> {
  return new Response(await blogFeedXml(), {
    headers: {
      'content-type': BLOG_FEED_CONTENT_TYPE,
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
