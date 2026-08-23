import { DEFAULT_LOCALE, PUBLIC_LOCALE_CODES } from '@relay/i18n';

import {
  BLOG_FEED_CONTENT_TYPE,
  blogFeedXml,
} from '@/features/blog/feed';

/**
 * One static RSS feed per public non-English locale. The English feed stays at
 * `/blog.xml` because the default locale has no URL prefix.
 */
export const dynamic = 'force-static';

export function generateStaticParams(): readonly { readonly locale: string }[] {
  return PUBLIC_LOCALE_CODES.filter((locale) => locale !== DEFAULT_LOCALE).map((locale) => ({
    locale,
  }));
}

export async function GET(
  _request: Request,
  { params }: { readonly params: Promise<{ readonly locale: string }> },
): Promise<Response> {
  const { locale } = await params;

  if (!PUBLIC_LOCALE_CODES.some((publicLocale) => publicLocale === locale) || locale === DEFAULT_LOCALE) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(await blogFeedXml(locale), {
    headers: {
      'content-type': BLOG_FEED_CONTENT_TYPE,
      'content-language': locale,
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
