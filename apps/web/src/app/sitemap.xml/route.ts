import { sitemapIndexXml } from '@/features/marketing/sitemap-clusters';

/**
 * The sitemap index. Search consoles and `robots.txt` have always pointed at
 * `/sitemap.xml`, so the split clusters are listed from here rather than
 * moving the URL crawlers already know.
 */
export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(sitemapIndexXml(), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
