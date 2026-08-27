import { NextResponse, type NextRequest } from 'next/server';

import { DEFAULT_LOCALE, RETIRED_LOCALE_CODES } from '@relay/i18n';

import { isWebLocale } from '@/lib/i18n/development-pseudo-locales';
import { LOCALE_COOKIE } from '@/lib/i18n/routing';

const ONE_YEAR_IN_SECONDS = 31_536_000;

function withLocaleRewrite(request: NextRequest, locale: string, pathname: string): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-postarray-locale', locale);
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

/**
 * Route locale-prefixed URLs to the segment tree while preserving clean English
 * URLs. Browser language is deliberately not consulted: explicit URLs are
 * crawlable and stable, including for Googlebot.
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/');
  const firstSegment = segments[1] ?? '';

  if (firstSegment === DEFAULT_LOCALE) {
    const redirectUrl = request.nextUrl.clone();
    const remainder = segments.slice(2).join('/');
    redirectUrl.pathname = remainder.length === 0 ? '/' : `/${remainder}`;
    return NextResponse.redirect(redirectUrl, 301);
  }

  // Retired locales remain in the catalog registry for compatibility, but
  // must not leave crawlable duplicate URLs behind. Preserve the route and
  // query string while sending old navigational URLs to English.
  if (
    RETIRED_LOCALE_CODES.some((code) => code.toLowerCase() === firstSegment.toLowerCase())
  ) {
    const redirectUrl = request.nextUrl.clone();
    const remainder = segments.slice(2).join('/');
    redirectUrl.pathname = remainder.length === 0 ? '/' : `/${remainder}`;
    return NextResponse.redirect(redirectUrl, 301);
  }

  if (isWebLocale(firstSegment)) {
    const response = withLocaleRewrite(request, firstSegment, pathname);
    response.cookies.set(LOCALE_COOKIE, firstSegment, {
      path: '/',
      sameSite: 'lax',
      maxAge: ONE_YEAR_IN_SECONDS,
      httpOnly: false,
    });
    return response;
  }

  return withLocaleRewrite(request, DEFAULT_LOCALE, `/${DEFAULT_LOCALE}${pathname}`);
}

export const config = {
  // The exclusions are the routes that must reach the app root untouched.
  // `_next` and anything with a file extension were always excluded; the
  // generated metadata routes have neither a prefix nor an extension, so
  // without naming them the fallthrough rewrote `/icon` to `/en/icon`, which
  // does not exist, and every share card and favicon 404ed.
  matcher: ['/((?!_next|api|icon|apple-icon|opengraph-image|twitter-image|.*\\..*).*)'],
};
