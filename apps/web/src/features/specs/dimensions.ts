import type { ProviderId } from '@relay/contracts';
import type { MessageKey } from '@relay/i18n/translate';

import {
  MEDIA_DIMENSIONS,
  type MediaDimensionRow,
  dimensionsForPlatform,
} from '@/features/marketing/data/media-dimensions';

/**
 * The `/specs/dimensions` cluster.
 *
 * Same rule as the generated `/specs` registry beside it: a page exists
 * because a value exists. The difference is only where the value comes from.
 * `registry.ts` reads the generated publishing-limits dataset; this module
 * reads the hand maintained `media-dimensions.ts`, which pays for being hand
 * maintained with a per row source URL, a per row read date and a staleness
 * test. A platform with no sourced row gets no page here, and there is no
 * code path that renders a pixel size nobody recorded.
 *
 * This module must not import `features/marketing/site`, for the same reason
 * `registry.ts` must not: the site map imports these lists to register routes,
 * and a cycle would be resolved by whichever module evaluated first.
 */

export interface DimensionPlatform {
  readonly platform: ProviderId;
  readonly slug: string;
  readonly nameKey: MessageKey;
  /** At least one. A platform with none is not in this list at all. */
  readonly rows: readonly MediaDimensionRow[];
}

const PLATFORMS: readonly DimensionPlatform[] = [
  ...new Set(MEDIA_DIMENSIONS.map((row) => row.platform)),
]
  .map((platform) => ({
    platform,
    slug: platform.replace(/_/g, '-'),
    nameKey: `web.provider.${platform}` as MessageKey,
    rows: dimensionsForPlatform(platform),
  }))
  .filter((entry) => entry.rows.length > 0)
  .sort((left, right) => (left.slug < right.slug ? -1 : 1));

export const DIMENSION_PLATFORMS: readonly DimensionPlatform[] = PLATFORMS;

export const DIMENSION_PLATFORM_SLUGS: readonly string[] = PLATFORMS.map((entry) => entry.slug);

const BY_SLUG = new Map(PLATFORMS.map((entry) => [entry.slug, entry]));

export function findDimensionPlatform(slug: string): DimensionPlatform | undefined {
  return BY_SLUG.get(slug);
}

/** The most recent read date across a platform's rows. Never `undefined`: a
 *  platform with no rows is not in this registry. */
export function latestReadOn(entry: DimensionPlatform): string {
  return entry.rows.reduce(
    (latest, row) => (row.source.readOn > latest ? row.source.readOn : latest),
    entry.rows[0]?.source.readOn ?? '',
  );
}
