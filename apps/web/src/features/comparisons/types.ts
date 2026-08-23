/**
 * The comparison content model.
 *
 * A comparison page is where a product is most tempted to lie, so the type
 * itself is the first line of defence:
 *
 *  1. A cell carries a `verdict` **and** the source that verdict came from.
 *     `notVerified` is the only verdict allowed to have no source, and it is
 *     the honest answer whenever a fact could not be read on the other option's
 *     own public documentation on the day of the check.
 *  2. `ours` and `theirs` are the same shape. There is no field the product's
 *     own column has that the alternative's column does not, so the table
 *     cannot be built to flatter one side.
 *  3. Every page carries `checked` and `nextReview`, so a reader can see how
 *     old the page is without reading a changelog.
 *
 * Prose here is English-only typed content, on the same reasoning that governs
 * `features/blog/types.ts`: the ICU catalog is merged into one object that
 * every page load resolves, so several thousand words of comparison detail in
 * the catalog would be shipped to a reader who opened the pricing page. Page
 * chrome (labels, state words, section headings) stays in the catalog under
 * `web.comparison.`; the claims are content loaded per slug.
 *
 * `comparisons.test.ts` runs the same catalog linter over every rendered
 * string, which is the trade that makes that acceptable.
 */

/**
 * What a cell asserts.
 *
 * `partial` exists because "yes with a condition" is the most common truthful
 * answer about a publishing tool, and forcing it into yes or no is how a
 * comparison table starts lying.
 */
export type ComparisonVerdict = 'yes' | 'no' | 'partial' | 'notVerified';

/** A document a claim came from, with the date a person read it. */
export interface ComparisonSource {
  /** The document's own title. Never a summary of what we wish it said. */
  readonly title: string;
  /** An official page. A route this site owns is written as a leading `/`. */
  readonly url: string;
  /** ISO calendar date a person read that page. */
  readonly readOn: string;
}

export interface ComparisonCell {
  readonly verdict: ComparisonVerdict;
  /** One sentence saying what the verdict means in practice. */
  readonly detail: string;
  /** Required for every verdict except `notVerified`. Enforced by test. */
  readonly source?: ComparisonSource;
}

export interface ComparisonRow {
  readonly id: string;
  /** The claim being tested, phrased so both columns answer the same question. */
  readonly claim: string;
  readonly ours: ComparisonCell;
  readonly theirs: ComparisonCell;
}

export interface ComparisonQuestion {
  readonly question: string;
  readonly answer: string;
}

export interface ComparisonPage {
  /** URL segment under `/compare`. Stable once published. */
  readonly slug: string;
  /**
   * Languages in which the comparison claims and prose are actually written.
   * The page may still render localized interface chrome for another locale,
   * but SEO must not advertise that page as translated until this list says it
   * is. English is required because it is the canonical fallback.
   */
  readonly contentLocales: readonly string[];
  readonly title: string;
  /** Meta description and index summary. One sentence. */
  readonly description: string;
  /**
   * What the other option is called.
   *
   * These are categories of approach, not vendors, because a category can be
   * sourced from official platform and standards documentation while a
   * vendor's current feature set cannot be sourced without reading that
   * vendor's own pages on the day of publication.
   */
  readonly alternative: string;
  readonly lede: string;
  /** Who each option actually suits. Both sides required, both honest. */
  readonly bestForOurs: string;
  readonly bestForAlternative: string;
  readonly rows: readonly ComparisonRow[];
  /** Paragraphs under the table. Context, never a second sales pitch. */
  readonly notes: readonly string[];
  /** Rendered on the page, and the only thing eligible for FAQ structured data. */
  readonly questions: readonly ComparisonQuestion[];
  /** ISO calendar date every row above was last checked. */
  readonly checked: string;
  /** ISO calendar date the next check is due. Never earlier than `checked`. */
  readonly nextReview: string;
}

/** The content languages eligible for a comparison's indexable URL cluster. */
export function comparisonLocales(page: ComparisonPage): readonly string[] {
  return page.contentLocales;
}

/** Every string on a comparison page that a reader will actually see. */
export function comparisonStrings(page: ComparisonPage): readonly string[] {
  const fromRows = page.rows.flatMap((row): readonly string[] => [
    row.claim,
    row.ours.detail,
    row.theirs.detail,
    ...(row.ours.source === undefined ? [] : [row.ours.source.title]),
    ...(row.theirs.source === undefined ? [] : [row.theirs.source.title]),
  ]);

  return [
    page.title,
    page.description,
    page.alternative,
    page.lede,
    page.bestForOurs,
    page.bestForAlternative,
    ...fromRows,
    ...page.notes,
    ...page.questions.flatMap((entry) => [entry.question, entry.answer]),
  ];
}

/** Every distinct external source cited by a page, in first-cited order. */
export function comparisonSources(page: ComparisonPage): readonly ComparisonSource[] {
  const seen = new Map<string, ComparisonSource>();
  for (const row of page.rows) {
    for (const cell of [row.ours, row.theirs]) {
      if (cell.source !== undefined && !seen.has(cell.source.url)) {
        seen.set(cell.source.url, cell.source);
      }
    }
  }
  return [...seen.values()];
}

/** A source that points at a page this site owns rather than an external one. */
export function isInternalSource(source: ComparisonSource): boolean {
  return source.url.startsWith('/');
}
