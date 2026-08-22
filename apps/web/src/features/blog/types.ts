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
 * catalog copy under `web.blog.`; the prose is content loaded per slug.
 *
 * An article carries its own languages in `content`, keyed by BCP-47 tag, so
 * one module holds every translation of one piece of writing and a language is
 * added by adding a key. Titles and descriptions are written per language
 * rather than translated, because the query a reader types changes shape
 * between languages. A locale missing from `content` is missing from the
 * article's hreflang cluster, and that reader is served English with a
 * canonical pointing at the English URL.
 *
 * The prose rules from AGENTS.md still bind every string here: no em dash, no
 * hype word, and no claim that this product publishes to any platform today.
 */

/** Editorial groupings. Each maps to one `web.blog.cluster.*` catalog key. */
export const BLOG_CLUSTERS = [
  'cadence',
  'scheduling',
  'adaptation',
  'operations',
  'developers',
] as const;

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

/**
 * The interactive panels an article may embed.
 *
 * A closed union, not a component reference, for the same reason the block list
 * is closed: an article chooses from a menu the renderer owns. It cannot mount
 * arbitrary JSX, so no article can ship a script, break the measure, or put an
 * unlocalized panel in front of a reader. `article-tool.tsx` maps each id to a
 * client island and wraps it in the `web.tools.` catalog slice for the reader's
 * locale, so the panel speaks the language the prose around it is written in.
 */
export const BLOG_TOOLS = ['zone-planner', 'engagement-rate', 'preflight'] as const;

export type BlogToolId = (typeof BLOG_TOOLS)[number];

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
  | { readonly kind: 'cta'; readonly label: string; readonly href: string }
  /** The answer, before the argument. Sits directly under the lede. */
  | { readonly kind: 'takeaways'; readonly title: string; readonly items: readonly string[] }
  /** Questions a reader arrives with. Also the source of `FAQPage` markup. */
  | {
      readonly kind: 'faq';
      readonly items: readonly { readonly q: string; readonly a: string }[];
    }
  /**
   * One sourced figure, set large. `source` is the URL of the document the
   * number came from, and must appear in the article's `sources`, so a number
   * on this page can always be traced to a document a person read.
   */
  | {
      readonly kind: 'stat';
      readonly value: string;
      readonly label: string;
      readonly source: string;
    }
  | { readonly kind: 'tool'; readonly tool: BlogToolId; readonly caption: string };

/**
 * One language of one article.
 *
 * Title and description are per language rather than translations of the
 * English, because the question a reader types changes shape between languages.
 * A German reader searches for planning posts, a Japanese reader for scheduled
 * posting, and a Brazilian reader for the best hour to post. Translating the
 * English headline would answer none of them.
 */
export interface BlogArticleContent {
  readonly title: string;
  /** Meta description and index summary. One sentence, no adjective stack. */
  readonly description: string;
  /** The opening line under the title. Falls back to `description`. */
  readonly lede?: string;
  readonly blocks: readonly BlogBlock[];
}

export interface BlogArticle {
  /** URL segment. Lower case, hyphenated, stable once published. Never localized. */
  readonly slug: string;
  readonly cluster: BlogCluster;
  readonly author: BlogByline;
  /** Present whenever the article states a platform rule. */
  readonly reviewer?: BlogByline;
  /** ISO calendar date the article first went up. */
  readonly published: string;
  /** ISO calendar date of the last substantive edit. Never earlier than published. */
  readonly updated: string;
  readonly sources: readonly BlogSource[];
  /**
   * Every language this article exists in, keyed by BCP-47 tag. English is
   * required: it is the fallback a reader gets when their own language has no
   * translation, and the only language the RSS feed carries.
   *
   * A locale absent from this record is absent from the article's hreflang
   * cluster too. Advertising a translation that does not exist is the reason
   * this is a record rather than a flag.
   */
  readonly content: { readonly en: BlogArticleContent } & Readonly<
    Record<string, BlogArticleContent>
  >;
}

/** The languages an article was actually written in, English first. */
export function articleLocales(article: BlogArticle): readonly string[] {
  const rest = Object.keys(article.content)
    .filter((locale) => locale !== 'en')
    .sort();
  return ['en', ...rest];
}

/** True when this article was written in `locale`, rather than falling back. */
export function hasArticleLocale(article: BlogArticle, locale: string): boolean {
  return article.content[locale] !== undefined;
}

/** The article as `locale` reads it, or the English it falls back to. */
export function articleContent(article: BlogArticle, locale: string): BlogArticleContent {
  return article.content[locale] ?? article.content.en;
}

/** The opening line, which is the lede when one was written and the summary otherwise. */
export function articleLede(content: BlogArticleContent): string {
  return content.lede ?? content.description;
}

/** Every string in one language of an article that a reader will actually see. */
export function contentStrings(content: BlogArticleContent): readonly string[] {
  const fromBlocks = content.blocks.flatMap((block): readonly string[] => {
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
      case 'takeaways':
        return [block.title, ...block.items];
      case 'faq':
        return block.items.flatMap((item) => [item.q, item.a]);
      case 'stat':
        return [block.value, block.label];
      case 'tool':
        return [block.caption];
    }
  });

  return [
    content.title,
    content.description,
    ...(content.lede === undefined ? [] : [content.lede]),
    ...fromBlocks,
  ];
}

/** Every string in every language of an article, plus the source titles. */
export function articleStrings(article: BlogArticle): readonly string[] {
  return [
    ...Object.values(article.content).flatMap((content) => contentStrings(content)),
    ...article.sources.map((source) => source.title),
  ];
}

/** The heading blocks, in document order, for the on this page index. */
export function articleHeadings(
  content: BlogArticleContent,
): readonly { readonly id: string; readonly text: string }[] {
  return content.blocks
    .filter((block): block is Extract<BlogBlock, { kind: 'heading' }> => block.kind === 'heading')
    .map((block) => ({ id: block.id, text: block.text }));
}

/** The FAQ entries in one language, for `FAQPage` markup. Empty when there are none. */
export function articleFaq(
  content: BlogArticleContent,
): readonly { readonly q: string; readonly a: string }[] {
  return content.blocks.flatMap((block) => (block.kind === 'faq' ? block.items : []));
}
