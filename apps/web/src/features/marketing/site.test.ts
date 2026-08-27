import { describe, expect, it } from 'vitest';

import {
  LOCAL_SITE_ORIGIN,
  MARKETING_ROUTES,
  resolveSiteOrigin,
  ROUTES,
  SITE_ORIGIN,
} from './site';

/**
 * The origin is not decoration. Every canonical, every hreflang alternate and
 * every sitemap entry is built from it, so a production build that cannot name
 * its own host has to stop rather than publish localhost URLs to search
 * engines. Locally the opposite is true: a build must work with no `.env` file.
 */
describe('resolveSiteOrigin in production', () => {
  it('refuses to build when the origin is unset', () => {
    expect(() => resolveSiteOrigin({ NODE_ENV: 'production' })).toThrow(/NEXT_PUBLIC_SITE_ORIGIN/);
  });

  it('refuses to build when the origin is blank or whitespace', () => {
    expect(() =>
      resolveSiteOrigin({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_ORIGIN: '' }),
    ).toThrow(/NEXT_PUBLIC_SITE_ORIGIN/);
    expect(() =>
      resolveSiteOrigin({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_ORIGIN: '   ' }),
    ).toThrow(/NEXT_PUBLIC_SITE_ORIGIN/);
  });

  it('refuses any localhost origin, however it is spelled', () => {
    for (const origin of [
      'http://localhost:3000',
      'https://localhost',
      'http://localhost:3000/',
      'http://app.localhost:3000',
    ]) {
      expect(() =>
        resolveSiteOrigin({ NODE_ENV: 'production', NEXT_PUBLIC_SITE_ORIGIN: origin }),
      ).toThrow(/localhost/);
    }
  });

  it('derives the origin from the domain Vercel already knows', () => {
    // Two failed production builds came from setting this by hand and getting
    // it wrong, when the host already knows its own production domain.
    expect(
      resolveSiteOrigin({
        NODE_ENV: 'production',
        VERCEL_PROJECT_PRODUCTION_URL: 'postarray.com',
      }),
    ).toBe('https://postarray.com');
  });

  it('lets an explicit origin beat the one Vercel derived', () => {
    // A deployment that must claim an origin the host does not know about has
    // to be able to say so, so the explicit value wins rather than merging.
    expect(
      resolveSiteOrigin({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_ORIGIN: 'https://postarray.com',
        VERCEL_PROJECT_PRODUCTION_URL: 'postarray-web.vercel.app',
      }),
    ).toBe('https://postarray.com');
  });

  it('still refuses a localhost origin that arrived through the host', () => {
    expect(() =>
      resolveSiteOrigin({ NODE_ENV: 'production', VERCEL_PROJECT_PRODUCTION_URL: 'localhost:3000' }),
    ).toThrow(/localhost/);
  });

  it('accepts a real public origin and trims incidental whitespace', () => {
    expect(
      resolveSiteOrigin({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_ORIGIN: '  https://relay.example  ',
      }),
    ).toBe('https://relay.example');
  });
});

describe('resolveSiteOrigin outside production', () => {
  it('falls back to localhost in development rather than throwing', () => {
    expect(() => resolveSiteOrigin({ NODE_ENV: 'development' })).not.toThrow();
    expect(resolveSiteOrigin({ NODE_ENV: 'development' })).toBe(LOCAL_SITE_ORIGIN);
  });

  it('falls back to localhost in test rather than throwing', () => {
    expect(() => resolveSiteOrigin({ NODE_ENV: 'test' })).not.toThrow();
    expect(resolveSiteOrigin({ NODE_ENV: 'test' })).toBe(LOCAL_SITE_ORIGIN);
    expect(
      resolveSiteOrigin({ NODE_ENV: 'test', NEXT_PUBLIC_SITE_ORIGIN: 'http://localhost:3000' }),
    ).toBe(LOCAL_SITE_ORIGIN);
  });

  it('still honours a configured origin locally, so a preview host can be pointed at', () => {
    expect(
      resolveSiteOrigin({
        NODE_ENV: 'development',
        NEXT_PUBLIC_SITE_ORIGIN: 'https://preview.test',
      }),
    ).toBe('https://preview.test');
  });
});

describe('SITE_ORIGIN', () => {
  it('resolves at module load, which is what makes the production check a build failure', () => {
    expect(SITE_ORIGIN).toBe(resolveSiteOrigin());
    expect(() => new URL('/sitemap.xml', SITE_ORIGIN)).not.toThrow();
  });
});

/**
 * `MARKETING_ROUTES` is assembled from six sources, several of them derived
 * from generated datasets and edited by different people at different times.
 * A route that appears twice becomes a duplicate sitemap entry and a duplicate
 * hreflang cluster, which is a self-inflicted SEO fault that nothing else in
 * the suite would catch.
 */
describe('MARKETING_ROUTES', () => {
  it('lists every public route exactly once', () => {
    const counts = new Map<string, number>();
    for (const route of MARKETING_ROUTES) {
      counts.set(route, (counts.get(route) ?? 0) + 1);
    }
    const duplicates = [...counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([route]) => route);

    expect(duplicates).toEqual([]);
  });

  it('keeps the private authentication routes out of the public map', () => {
    expect(MARKETING_ROUTES).not.toContain(ROUTES.signIn);
    expect(MARKETING_ROUTES).not.toContain(ROUTES.signUp);
  });

  it('starts every entry with a single leading slash', () => {
    for (const route of MARKETING_ROUTES) {
      expect(route.startsWith('/')).toBe(true);
      expect(route.startsWith('//')).toBe(false);
    }
  });
});
