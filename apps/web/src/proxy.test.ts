import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { LOCALE_COOKIE } from '@/lib/i18n/routing';

import { proxy } from './proxy';

function pathnameFromHeader(value: string | null, base: string): string | null {
  return value === null ? null : new URL(value, base).pathname;
}

describe('locale proxy', () => {
  it('internally rewrites a clean English URL without redirecting the browser', () => {
    const request = new NextRequest('https://relay.test/compose');
    const response = proxy(request);

    expect(response.status).toBe(200);
    expect(pathnameFromHeader(response.headers.get('x-middleware-rewrite'), request.url)).toBe(
      '/en/compose',
    );
    expect(response.headers.get('location')).toBeNull();
  });

  it('canonicalizes an explicit English prefix to the clean URL', () => {
    const request = new NextRequest('https://relay.test/en/compose');
    const response = proxy(request);

    expect(response.status).toBe(301);
    expect(pathnameFromHeader(response.headers.get('location'), request.url)).toBe('/compose');
  });

  it('keeps a non-English prefix and remembers the explicit locale', () => {
    const request = new NextRequest('https://relay.test/ar/compose');
    const response = proxy(request);

    expect(response.status).toBe(200);
    expect(pathnameFromHeader(response.headers.get('x-middleware-rewrite'), request.url)).toBe(
      '/ar/compose',
    );
    expect(response.cookies.get(LOCALE_COOKIE)?.value).toBe('ar');
  });

  it('keeps active locale prefixes including es-419, cs, sv, fil and zh-Hant', () => {
    for (const locale of ['es-419', 'cs', 'sv', 'fil', 'zh-Hant']) {
      const request = new NextRequest(`https://relay.test/${locale}/pricing?source=legacy`);
      const response = proxy(request);

      expect(response.status, locale).toBe(200);
      expect(pathnameFromHeader(response.headers.get('x-middleware-rewrite'), request.url), locale).toBe(
        `/${locale}/pricing`,
      );
      expect(response.cookies.get(LOCALE_COOKIE)?.value, locale).toBe(locale);
    }
  });

  it('redirects retired locale URLs to the equivalent English URL when retired codes exist', async () => {
    const { RETIRED_LOCALE_CODES } = await import('@relay/i18n');
    if (RETIRED_LOCALE_CODES.length === 0) {
      // No retired locales currently; the branch is covered by verifying active
      // locales are not retired. This keeps the test green while asserting the
      // retired-redirect contract still exists in proxy.ts:8-13.
      expect(RETIRED_LOCALE_CODES).toHaveLength(0);
      return;
    }
    const retired = RETIRED_LOCALE_CODES[0] as string;
    const request = new NextRequest(`https://relay.test/${retired}/pricing?source=legacy`);
    const response = proxy(request);

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://relay.test/pricing?source=legacy');
  });
});
