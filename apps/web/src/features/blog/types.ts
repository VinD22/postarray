import type { MessageKey } from '@relay/i18n/translate';

import type { Citation } from '@/features/marketing/data/connectors';

/**
 * The article content model.
 *
 * Articles are typed TypeScript modules, not MDX and not database rows. Two
 * reasons, both load bearing:
 *
 *  1. There is no MDX toolchain in `apps/web`. Adding one would create a second
 *     content pipeline that skips the checks the catalog already runs, and the
 *     em dash rule and the forbidden-word rule are exactly the checks a
 *     marketing writer will trip. `registry.test.ts` runs the catalog linter
 *     over every rendered string in every article instead.
 *  2. A typed block union means heading level, spacing and list grammar are
 *     decided once, in the renderer, and cannot drift from one article to the
 *     next.
 *
 * Article prose is deliberately NOT in the ICU catalog. The English catalog is
 * merged into a single object that every page load resolves, so article bodies
 * there would be shipped to a reader who opened the pricing page. The page
 * chrome around the article (labels, headings, cluster names, feed strings) is
 * catalog copy under `web.blog.`; the prose is English-only content loaded per
 * slug. When a second language is warranted, an article gains a translated
 * sibling module, not 60 catalog keys.
 *
 * The prose rules from AGENTS.md still bind every string here: no em dash, no
 * hype word, and no claim that this product publishes to any platform today.
 */

/** Editorial groupings. Each maps to one `web.blog.cluster.*` catalog key. */
export const BLOG_CLUSTERS = ['cadence', 'scheduling', 'adaptation', 'operations'] as const;

export type BlogCluster = (typeof BLOG_CLUSTERS)[number];

export function clusterLabelKey(cluster: BlogCluster): MessageKey {
  return `web.blog.cluster.${cluster}` as MessageKey;
}

/**
 * A byline.
 *
 * Named through the catalog rather than hardcoded, because the desk names are
 * page chrome and because no real person's name may be invented to decorate a
 * page. These are the standing editorial desks that actually own the work: one
 * writes, one checks every platform sentence against its official source.
 */
export interface BlogByline {
  readonly nameKey: MessageKey;
  readonly roleKey: MessageKey;
}

/** An official document an article leans on, with the date a person read it. */
export interface BlogSource extends Citation {
  /** The document's own title. Never a summary of what we wish it said. */
  readonly title: string;
}

export type BlogBlock =
  | { readonly kind: 'heading'; readonly id: string; readonly text: string }
  | { readonly kind: 'paragraph'; readonly text: string }
  | { readonly kind: 'list'; readonly ordered?: boolean; readonly items: readonly string[] }
  | { readonly kind: 'callout'; readonly title: string; readonly body: string }
  | { readonly kind: 'code'; readonly caption: string; readonly lines: readonly string[] }
  | {
      readonly kind: 'table';
      readonly caption: string;
      readonly columns: readonly string[];
      readonly rows: readonly (readonly string[])[];
    }
  | { readonly kind: 'cta'; readonly label: string; readonly href: string };

export interface BlogArticle {
  /** URL segment. Lower case, hyphenated, stable once published. */
  readonly slug: string;
  readonly title: string;
  /** Meta description and index summary. One sentence, no adjective stack. */
  readonly description: string;
  readonly cluster: BlogCluster;
  readonly author: BlogByline;
  /** Present whenever the article states a platform rule. */
  readonly reviewer?: BlogByline;
  /** ISO calendar date the article first went up. */
  readonly published: string;
  /** ISO calendar date of the last substantive edit. Never earlier than published. */
  readonly updated: string;
  readonly sources: readonly BlogSource[];
  readonly blocks: readonly BlogBlock[];
}

/** Every string in an article that a reader will actually see. */
export function articleStrings(article: BlogArticle): readonly string[] {
  const fromBlocks = article.blocks.flatMap((block): readonly string[] => {
    switch (block.kind) {
      case 'heading':
        return [block.text];
      case 'paragraph':
        return [block.text];
      case 'list':
        return block.items;
      case 'callout':
        return [block.title, block.body];
      case 'code':
        return [block.caption, ...block.lines];
      case 'table':
        return [block.caption, ...block.columns, ...block.rows.flat()];
      case 'cta':
        return [block.label];
    }
  });

  return [
    article.title,
    article.description,
    ...fromBlocks,
    ...article.sources.map((source) => source.title),
  ];
}

/** The heading blocks, in document order, for the on this page index. */
export function articleHeadings(
  article: BlogArticle,
): readonly { readonly id: string; readonly text: string }[] {
  return article.blocks
    .filter((block): block is Extract<BlogBlock, { kind: 'heading' }> => block.kind === 'heading')
    .map((block) => ({ id: block.id, text: block.text }));
}
