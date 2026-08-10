import type { MessageKey } from '@relay/i18n/translate';

import { PUBLISHING_LIMIT_PROVIDERS } from '@/features/marketing/data/publishing-limits';
import type { PublishingLimitProvider } from '@/features/marketing/data/publishing-limits-types';

/**
 * The per platform scheduler pages.
 *
 * The list is derived from the generated publishing-limits dataset, which is
 * itself derived from the launch cohort in `@relay/contracts`. Nothing here
 * enumerates platforms by hand, so a cohort change produces or removes a page
 * without an edit in this file, and no page can exist for a platform the
 * product does not claim as part of the cohort.
 *
 * This module deliberately does not import `features/marketing/site`. The site
 * map imports these slugs to register the routes, and a cycle between the two
 * would be resolved by whichever module happened to evaluate first.
 */

export interface PlatformPage {
  readonly provider: PublishingLimitProvider;
  /** URL segment. Underscores become hyphens; nothing else changes. */
  readonly slug: string;
  /** Display name, from the shared provider catalog the product also uses. */
  readonly nameKey: MessageKey;
}

/** `google_business_profile` becomes `google-business-profile`. */
export function platformSlug(provider: PublishingLimitProvider): string {
  return provider.replace(/_/g, '-');
}

export const PLATFORM_PAGES: readonly PlatformPage[] = PUBLISHING_LIMIT_PROVIDERS.map(
  (provider) => ({
    provider,
    slug: platformSlug(provider),
    nameKey: `web.provider.${provider}` as MessageKey,
  }),
);

export const PLATFORM_SLUGS: readonly string[] = PLATFORM_PAGES.map((page) => page.slug);

const BY_SLUG = new Map(PLATFORM_PAGES.map((page) => [page.slug, page]));

export function findPlatformPage(slug: string): PlatformPage | undefined {
  return BY_SLUG.get(slug);
}
