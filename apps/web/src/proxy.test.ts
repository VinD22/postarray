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
});
