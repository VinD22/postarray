import { describe, expect, it } from 'vitest';

import DimensionsPlatformPage, {
  generateMetadata as platformMetadata,
  generateStaticParams as platformParams,
} from '@/app/[locale]/(marketing)/specs/dimensions/[platform]/page';
import DimensionsIndexPage, {
  generateMetadata as indexMetadata,
} from '@/app/[locale]/(marketing)/specs/dimensions/page';
import { absoluteUrl } from '@/features/marketing/seo';
import { MARKETING_ROUTES, ROUTES, dimensionsPlatformPath } from '@/features/marketing/site';

import { DIMENSION_PLATFORM_SLUGS } from './dimensions';

/**
 * Building a Server Component's element tree evaluates every `t.format` as a
 * prop, so awaiting each page proves the whole cluster resolves its copy, its
 * numbers and its citations without throwing. It is also the check that
 * catches a static param the route cannot serve.
 */

const LOCALE = 'en';

describe('every image dimensions route builds', () => {
  it('serves the index', async () => {
    await expect(
      DimensionsIndexPage({ params: Promise.resolve({ locale: LOCALE }) }),
    ).resolves.toBeDefined();

    const metadata = await indexMetadata({ params: Promise.resolve({ locale: LOCALE }) });
    expect(metadata.alternates?.canonical).toBe(absoluteUrl(ROUTES.specsDimensions, LOCALE));
  });

  it('declares one static param per platform and serves each', async () => {
    const params = platformParams();
    expect(params.map((entry) => entry.platform)).toEqual([...DIMENSION_PLATFORM_SLUGS]);
    expect(params.length).toBeGreaterThan(0);

    for (const { platform } of params) {
      await expect(
        DimensionsPlatformPage({ params: Promise.resolve({ locale: LOCALE, platform }) }),
        platform,
      ).resolves.toBeDefined();

      const metadata = await platformMetadata({
        params: Promise.resolve({ locale: LOCALE, platform }),
      });
      expect(metadata.alternates?.canonical, platform).toBe(
        absoluteUrl(dimensionsPlatformPath(platform), LOCALE),
      );
    }
  });

  it('registers every page it serves in the site map', () => {
    const routes = new Set(MARKETING_ROUTES);
    expect(routes.has(ROUTES.specsDimensions)).toBe(true);
    for (const slug of DIMENSION_PLATFORM_SLUGS) {
      expect(routes.has(dimensionsPlatformPath(slug)), slug).toBe(true);
    }
  });
});
