import { buildYourOwnIntegration } from './entries/build-your-own-integration';
import { platformNativeTools } from './entries/platform-native-tools';
import { COMPARISON_SLUGS, comparisonPath } from './slugs';
import type { ComparisonPage } from './types';

/**
 * The one list every comparison surface reads.
 *
 * The `/compare` index, `generateStaticParams` and the sitemap all derive from
 * this array. Publishing a comparison is one import here plus one slug in
 * `slugs.ts`, and `comparisons.test.ts` fails if those two disagree.
 *
 * Order is by the date each page was last checked, newest first, because on a
 * comparison the freshness of the check is the only ordering a reader cares
 * about.
 */
const PAGES: readonly ComparisonPage[] = [buildYourOwnIntegration, platformNativeTools];

export const COMPARISON_PAGES: readonly ComparisonPage[] = [...PAGES].sort((left, right) => {
  if (left.checked !== right.checked) return left.checked < right.checked ? 1 : -1;
  return left.slug < right.slug ? -1 : 1;
});

export function findComparisonPage(slug: string): ComparisonPage | undefined {
  return COMPARISON_PAGES.find((page) => page.slug === slug);
}

/** Every comparison route, for the site map and the sitemap. */
export const COMPARISON_ROUTES: readonly string[] = COMPARISON_SLUGS.map(comparisonPath);

/**
 * The most recent check across every comparison, as an ISO calendar date.
 *
 * `undefined` when nothing is published, so a caller renders the missing case
 * rather than an epoch date.
 */
export function latestComparisonCheck(): string | undefined {
  return COMPARISON_PAGES[0]?.checked;
}

export { COMPARISON_SLUGS, comparisonPath };
