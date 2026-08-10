import type { CoreProviderId } from '@relay/contracts';

/**
 * The shape of the generated publishing-limits dataset.
 *
 * Hand written on purpose: the generator in `@relay/connectors` writes only the
 * values, so this file is where a reviewer sees what the public dataset is
 * allowed to contain. It mirrors `marketing-limits-grid.ts` in that package,
 * and the generator's own test fails if the two disagree.
 *
 * Nothing here describes whether a feature works. A limit is a fact about the
 * platform; readiness lives in the capability matrix and its own dataset.
 */

/** The launch cohort. Derived, so a cohort change is one edit in contracts. */
export type PublishingLimitProvider = CoreProviderId;

/**
 * How a platform charges a body for a link.
 *
 * `fixed` means the platform rewrites every URL to its own shortener and
 * charges a flat width regardless of how long the original was. `actual` means
 * the URL costs exactly the characters it occupies. `none` means links are not
 * counted at all.
 */
export type LimitLinkCountingMode = 'none' | 'fixed' | 'actual';

/**
 * The unit the platform's ceiling is expressed in. `grapheme` is what a person
 * means by "characters", `utf16` is what `String.length` returns, and
 * `weighted` is the two-tier scheme where most non-Latin code points cost two.
 */
export type LimitCountingUnit = 'utf16' | 'grapheme' | 'weighted';

export interface LimitSource {
  /** Official platform documentation. */
  readonly url: string;
  /** ISO date a person last read that page. */
  readonly readOn: string;
}

export interface LimitTextBlock {
  readonly maxLength: number;
  readonly minLength: number;
  readonly supportsMarkdown: boolean;
  readonly linkCountingMode: LimitLinkCountingMode;
  /** Only meaningful when the mode is `fixed`. */
  readonly charactersPerLink: number | null;
}

export interface LimitMediaBlock {
  readonly maxImages: number;
  readonly maxVideos: number;
  readonly allowedMimeTypes: readonly string[];
  readonly maxImageBytes: number | null;
  readonly maxGifBytes: number | null;
  readonly maxVideoBytes: number | null;
  readonly maxDocumentBytes: number | null;
  readonly maxDurationSeconds: number | null;
  readonly minDurationSeconds: number | null;
  readonly requiresThumbnail: boolean;
  readonly maxAltTextLength: number | null;
}

export interface ProviderLimits {
  readonly provider: PublishingLimitProvider;
  /** False when this build ships no adapter, so every number below is unknown. */
  readonly adapterPresent: boolean;
  readonly countingUnit: LimitCountingUnit | null;
  /** The separate title field, where the platform has one. */
  readonly maxTitleLength: number | null;
  readonly text: LimitTextBlock | null;
  readonly media: LimitMediaBlock | null;
  readonly source: LimitSource | null;
}
