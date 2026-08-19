import { ROUTES } from '@/features/marketing/site';
import type { PublishingLimitProvider } from '@/features/marketing/data/publishing-limits-types';

import { PREFLIGHT_PROVIDERS } from './preflight';

/**
 * The deep link contract between the specs cluster and the preflight checker.
 *
 * A specs page states one limit; the checker is where a real draft gets
 * measured against it. Sending a reader there with the platform already ticked
 * is the difference between a reference page and a usable one, so both halves
 * of the contract live in this file rather than being spelled out at either
 * end.
 *
 * Both halves are pure string work, deliberately: the tool page is statically
 * rendered for every visitor, so a query parameter can only ever be read on
 * the client, and the parsing has to be testable without a browser.
 */

export const PREFLIGHT_PLATFORM_PARAM = 'platform';

/** URL segment for a provider. Underscores become hyphens; nothing else changes. */
function providerSlug(provider: PublishingLimitProvider): string {
  return provider.replace(/_/g, '-');
}

const BY_SLUG = new Map<string, PublishingLimitProvider>(
  PREFLIGHT_PROVIDERS.map((provider) => [providerSlug(provider), provider]),
);

/** `/tools/post-preflight?platform=instagram`. */
export function preflightPlatformHref(platformSlug: string): string {
  const query = new URLSearchParams({ [PREFLIGHT_PLATFORM_PARAM]: platformSlug });
  return `${ROUTES.toolPostPreflight}?${query.toString()}`;
}

/**
 * The platforms a `?platform=` query asks for, in the order the dataset
 * declares them.
 *
 * Repeated parameters and comma separated lists both work. An unknown slug is
 * dropped rather than guessed at, and an empty result means "the reader asked
 * for nothing usable", which the checker answers by keeping its own defaults
 * instead of unticking everything.
 */
export function parsePreflightPlatforms(search: string): readonly PublishingLimitProvider[] {
  const params = new URLSearchParams(search);
  const requested = new Set<PublishingLimitProvider>();

  for (const raw of params.getAll(PREFLIGHT_PLATFORM_PARAM)) {
    for (const candidate of raw.split(',')) {
      const provider = BY_SLUG.get(candidate.trim().toLowerCase());
      if (provider !== undefined) {
        requested.add(provider);
      }
    }
  }

  return PREFLIGHT_PROVIDERS.filter((provider) => requested.has(provider));
}
