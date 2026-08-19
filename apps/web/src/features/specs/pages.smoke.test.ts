import { describe, expect, it } from 'vitest';

import SpecsConstraintPage, {
  generateMetadata as constraintMetadata,
  generateStaticParams as constraintParams,
} from '@/app/[locale]/(marketing)/specs/[platform]/[constraint]/page';
import SpecsPlatformPage, {
  generateMetadata as platformMetadata,
  generateStaticParams as platformParams,
} from '@/app/[locale]/(marketing)/specs/[platform]/page';
import SpecsIndexPage, {
  generateMetadata as indexMetadata,
} from '@/app/[locale]/(marketing)/specs/page';
import { absoluteUrl } from '@/features/marketing/seo';
import { ROUTES, specsConstraintPath, specsPlatformPath } from '@/features/marketing/site';

import { SPEC_PAIRS, SPEC_PLATFORM_SLUGS } from './registry';

/**
 * Every page in the cluster, built once.
 *
 * Constructing a Server Component's element tree evaluates every `t.format`
 * and every value formatter eagerly, because they are props. So awaiting each
 * page is enough to prove that all sixty-four routes resolve their copy, their
 * numbers and their links without throwing, which no amount of checking the
 * registry alone can show. It is also the check that catches a static param
 * the route cannot actually serve.
 */

const LOCALE = 'en';

describe('every generated specs route builds', () => {
  it('serves the index', async () => {
    await expect(
      SpecsIndexPage({ params: Promise.resolve({ locale: LOCALE }) }),
    ).resolves.toBeDefined();

    const metadata = await indexMetadata({ params: Promise.resolve({ locale: LOCALE }) });
    expect(metadata.alternates?.canonical).toBe(absoluteUrl(ROUTES.specs, LOCALE));
  });

  it('declares one static param per platform page and serves each', async () => {
    const params = platformParams();
    expect(params.map((entry) => entry.platform)).toEqual([...SPEC_PLATFORM_SLUGS]);

    for (const { platform } of params) {
      await expect(
        SpecsPlatformPage({ params: Promise.resolve({ locale: LOCALE, platform }) }),
        platform,
      ).resolves.toBeDefined();

      const metadata = await platformMetadata({
        params: Promise.resolve({ locale: LOCALE, platform }),
      });
      expect(metadata.alternates?.canonical, platform).toBe(
        absoluteUrl(specsPlatformPath(platform), LOCALE),
      );
      expect(typeof metadata.title, platform).toBe('string');
      expect(String(metadata.title), platform).not.toContain('{platform}');
    }
  });

  it('declares one static param per constraint page and serves each', async () => {
    const params = constraintParams();
    expect(params).toEqual(
      SPEC_PAIRS.map((pair) => ({ platform: pair.platform, constraint: pair.constraint })),
    );

    for (const { platform, constraint } of params) {
      const label = `${platform}/${constraint}`;
      await expect(
        SpecsConstraintPage({
          params: Promise.resolve({ locale: LOCALE, platform, constraint }),
        }),
        label,
      ).resolves.toBeDefined();

      const metadata = await constraintMetadata({
        params: Promise.resolve({ locale: LOCALE, platform, constraint }),
      });
      expect(metadata.alternates?.canonical, label).toBe(
        absoluteUrl(specsConstraintPath(platform, constraint), LOCALE),
      );
      expect(String(metadata.title), label).not.toContain('{platform}');
      expect(String(metadata.description), label).not.toContain('{platform}');
    }
  });

  it('returns empty metadata rather than inventing a page for an unknown pair', async () => {
    expect(
      await platformMetadata({
        params: Promise.resolve({ locale: LOCALE, platform: 'google-business-profile' }),
      }),
    ).toEqual({});
    expect(
      await constraintMetadata({
        params: Promise.resolve({
          locale: LOCALE,
          platform: 'youtube',
          constraint: 'image-count',
        }),
      }),
    ).toEqual({});
  });
});
