import type { MessageKey } from '@relay/i18n/translate';

import { PUBLISHING_LIMITS } from '@/features/marketing/data/publishing-limits';
import type {
  LimitSource,
  PublishingLimitProvider,
} from '@/features/marketing/data/publishing-limits-types';
import { PLATFORM_PAGES, type PlatformPage } from '@/features/platforms/registry';
import type { LimitValue } from '@/features/platforms/view-model';

import { SPEC_CONSTRAINTS, type SpecConstraint } from './constraints';

/**
 * The generated `/specs` cluster.
 *
 * The whole tree is derived here, once, from the publishing-limits dataset:
 * which platforms get a page, which constraints get a page under them, and the
 * value each of those pages states. The route files below only render what
 * this module already decided exists, which is why none of them needs a branch
 * for missing data. There is no branch, because there is no page.
 *
 * Two exclusions, both deliberate:
 *
 *  - A provider whose adapter is absent from this build has nulls for every
 *    field, so it produces no constraints and therefore no platform page. The
 *    SEO strategy states the same rule from the other side: no dataset row, no
 *    page. The `/schedule` cluster still lists that platform and says plainly
 *    that its limits are not recorded, so the cohort is not hidden.
 *  - A constraint whose value is absent for a platform produces no page for
 *    that pair. See `constraints.ts` for what counts as absent.
 *
 * This module must not import `features/marketing/site`: the site map imports
 * these lists to register the routes, and a cycle between the two would be
 * resolved by whichever module happened to evaluate first.
 */

export interface SpecEntry {
  readonly constraint: SpecConstraint;
  /** Never null. A null value never becomes an entry. */
  readonly value: LimitValue;
}

export interface SpecPlatform {
  readonly provider: PublishingLimitProvider;
  readonly slug: string;
  readonly nameKey: MessageKey;
  /** At least one. A platform with none is not in `SPEC_PLATFORMS` at all. */
  readonly entries: readonly SpecEntry[];
  /** The official document every value on the platform's pages came from. */
  readonly source: LimitSource | null;
}

function buildEntries(page: PlatformPage): readonly SpecEntry[] {
  const limits = PUBLISHING_LIMITS[page.provider];
  if (!limits.adapterPresent) {
    return [];
  }
  const entries: SpecEntry[] = [];
  for (const constraint of SPEC_CONSTRAINTS) {
    const value = constraint.resolve(limits);
    if (value !== null) {
      entries.push({ constraint, value });
    }
  }
  return entries;
}

export const SPEC_PLATFORMS: readonly SpecPlatform[] = PLATFORM_PAGES.map((page) => ({
  provider: page.provider,
  slug: page.slug,
  nameKey: page.nameKey,
  entries: buildEntries(page),
  source: PUBLISHING_LIMITS[page.provider].source,
})).filter((platform) => platform.entries.length > 0);

export const SPEC_PLATFORM_SLUGS: readonly string[] = SPEC_PLATFORMS.map(
  (platform) => platform.slug,
);

/** Every `(platform, constraint)` pair that has a page, in reading order. */
export const SPEC_PAIRS: readonly {
  readonly platform: string;
  readonly constraint: string;
}[] = SPEC_PLATFORMS.flatMap((platform) =>
  platform.entries.map((entry) => ({
    platform: platform.slug,
    constraint: entry.constraint.slug,
  })),
);

const PLATFORM_BY_SLUG = new Map(SPEC_PLATFORMS.map((platform) => [platform.slug, platform]));

export function findSpecPlatform(slug: string): SpecPlatform | undefined {
  return PLATFORM_BY_SLUG.get(slug);
}

/** The one entry a constraint detail page renders, or `undefined` for a 404. */
export function findSpecEntry(
  platformSlug: string,
  constraintSlug: string,
): { readonly platform: SpecPlatform; readonly entry: SpecEntry } | undefined {
  const platform = PLATFORM_BY_SLUG.get(platformSlug);
  if (!platform) {
    return undefined;
  }
  const entry = platform.entries.find((candidate) => candidate.constraint.slug === constraintSlug);
  return entry === undefined ? undefined : { platform, entry };
}
