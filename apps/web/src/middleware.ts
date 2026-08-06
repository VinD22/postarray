import { NextResponse, type NextRequest } from 'next/server';

import { DEFAULT_LOCALE } from '@relay/i18n';

import { isWebLocale } from '@/lib/i18n/development-pseudo-locales';
import { LOCALE_COOKIE } from '@/lib/i18n/routing';

const ONE_YEAR_IN_SECONDS = 31_536_000;

function withLocaleRewrite(request: NextRequest, locale: string, pathname: string): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-relay-locale', locale);
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

/**
 * Route locale-prefixed URLs to the segment tree while preserving clean English
 * URLs. Browser language is deliberately not consulted: explicit URLs are
 * crawlable and stable, including for Googlebot.
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/');
  const firstSegment = segments[1] ?? '';

  if (firstSegment === DEFAULT_LOCALE) {
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
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
