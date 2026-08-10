/**
 * The published comparison slugs, declared with no imports.
 *
 * `features/marketing/site.ts` needs this list to put the pages in the site map
 * and the sitemap, and the comparison entries need `ROUTES` from that same
 * module for their internal source links. Keeping the bare slug list in a
 * module that imports nothing breaks what would otherwise be an import cycle.
 *
 * `comparisons.test.ts` asserts this list and the registry agree, so the two
 * cannot drift.
 */
export const COMPARISON_SLUGS = ['build-your-own-integration', 'platform-native-tools'] as const;

export type ComparisonSlug = (typeof COMPARISON_SLUGS)[number];

/** `/compare/build-your-own-integration`, and so on. */
export function comparisonPath(slug: string): string {
  return `/compare/${slug}`;
}
