import { CORE_PROVIDER_IDS, type CoreProviderId, type ProviderId } from '@relay/contracts';

import { PINTEREST_MAX_TITLE_CHARACTERS } from './providers/pinterest/capabilities';
import { YOUTUBE_MAX_TITLE_LENGTH } from './providers/youtube/capabilities';
import type { ConnectorRegistry } from './registry';
import type { ProviderConnection } from './providers/shared/contract-shape';
import type { CountingUnit } from './providers/shared/text';

/**
 * Publishing limits for the public marketing site and its free tools.
 *
 * The capability snapshot each adapter returns already carries the real numbers:
 * text ceiling, link counting rule, image and video counts, allowed MIME types,
 * byte caps by kind and duration caps. This module projects the subset a reader
 * outside the product can act on, so a public page never restates a number that
 * the adapter would contradict.
 *
 * Three deliberate boundaries:
 *
 *  - Only limits. Whether a feature is `supported` or `not_implemented` belongs
 *    to `marketing-capability-grid.ts` and its own generated file. Mixing the
 *    two invites a page that reads a byte cap as a promise to publish.
 *  - The baseline account. Snapshots are read for a freshly connected account
 *    with no elevated eligibility, which is the conservative number. YouTube in
 *    particular raises its duration ceiling once a channel is verified.
 *  - A provider with no adapter in this build carries `null` everywhere and an
 *    `adapterPresent: false` flag, so the site can render "unavailable" rather
 *    than a zero it would have invented.
 */

/** Providers the public limits dataset covers: the launch cohort, in its order. */
export const LIMIT_PROVIDERS: readonly CoreProviderId[] = CORE_PROVIDER_IDS;

/**
 * The unit each adapter measures a body in when it validates a draft.
 *
 * Sourced from the `unit:` argument the adapter passes to `validateDraftShape`
 * in its own `connector.ts`; `marketing-limits-grid.test.ts` reads those files
 * back and fails if this map and the adapter disagree.
 */
export const PROVIDER_COUNTING_UNITS: Readonly<Partial<Record<CoreProviderId, CountingUnit>>> =
  Object.freeze({
    x: 'weighted',
    instagram: 'grapheme',
    facebook: 'utf16',
    linkedin: 'utf16',
    tiktok: 'grapheme',
    youtube: 'utf16',
    pinterest: 'grapheme',
    bluesky: 'grapheme',
    threads: 'grapheme',
  });

/**
 * Title ceilings. A title is a separate field with its own limit, so it is not
 * part of the snapshot's `text` block and is read from the adapter's exported
 * constant instead.
 */
export const PROVIDER_TITLE_LIMITS: Readonly<Partial<Record<CoreProviderId, number>>> =
  Object.freeze({
    youtube: YOUTUBE_MAX_TITLE_LENGTH,
    pinterest: PINTEREST_MAX_TITLE_CHARACTERS,
  });

export interface LimitSource {
  /** Official documentation URL. Never a blog post, never invented here. */
  readonly url: string;
  /** ISO date a person last read that source. */
  readonly readOn: string;
}

export interface LimitTextBlock {
  readonly maxLength: number;
  readonly minLength: number;
  readonly supportsMarkdown: boolean;
  readonly linkCountingMode: 'none' | 'fixed' | 'actual';
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
  readonly provider: CoreProviderId;
  /** False when this build ships no adapter for the provider. */
  readonly adapterPresent: boolean;
  readonly countingUnit: CountingUnit | null;
  readonly maxTitleLength: number | null;
  readonly text: LimitTextBlock | null;
  readonly media: LimitMediaBlock | null;
  readonly source: LimitSource | null;
}

export type ProviderLimitsTable = Readonly<Record<CoreProviderId, ProviderLimits>>;

export interface BuildLimitsOptions {
  /**
   * A synthetic connection for a provider. Only the shape matters: the numeric
   * limits in a snapshot do not vary with the token or the granted scopes.
   */
  readonly connectionFor: (provider: ProviderId) => ProviderConnection;
  /** Citations keyed by provider. A provider with no citation carries `null`. */
  readonly citations?: Readonly<Partial<Record<CoreProviderId, LimitSource>>>;
}

function emptyRow(provider: CoreProviderId, source: LimitSource | null): ProviderLimits {
  return {
    provider,
    adapterPresent: false,
    countingUnit: null,
    maxTitleLength: null,
    text: null,
    media: null,
    source,
  };
}

/** Read every launch cohort provider's limits out of the connector registry. */
export async function buildProviderLimits(
  registry: ConnectorRegistry,
  options: BuildLimitsOptions,
): Promise<ProviderLimitsTable> {
  const citations = options.citations ?? {};
  const rows = {} as Record<CoreProviderId, ProviderLimits>;
  for (const provider of LIMIT_PROVIDERS) {
    const source = citations[provider] ?? null;
    if (!registry.has(provider)) {
      rows[provider] = emptyRow(provider, source);
      continue;
    }
    const snapshot = await registry.get(provider).getCapabilities(options.connectionFor(provider));
    const bytes = snapshot.media.maxBytesByKind;
    rows[provider] = {
      provider,
      adapterPresent: true,
      countingUnit: PROVIDER_COUNTING_UNITS[provider] ?? null,
      maxTitleLength: PROVIDER_TITLE_LIMITS[provider] ?? null,
      text: {
        maxLength: snapshot.text.maxLength,
        minLength: snapshot.text.minLength,
        supportsMarkdown: snapshot.text.supportsMarkdown,
        linkCountingMode: snapshot.text.linkCounting.mode,
        charactersPerLink: snapshot.text.linkCounting.charactersPerLink,
      },
      media: {
        maxImages: snapshot.media.maxImages,
        maxVideos: snapshot.media.maxVideos,
        allowedMimeTypes: [...snapshot.media.allowedMimeTypes],
        maxImageBytes: bytes.image ?? null,
        maxGifBytes: bytes.gif ?? null,
        maxVideoBytes: bytes.video ?? null,
        maxDocumentBytes: bytes.document ?? null,
        maxDurationSeconds: snapshot.media.maxDurationSeconds,
        minDurationSeconds: snapshot.media.minDurationSeconds,
        requiresThumbnail: snapshot.media.requiresThumbnail,
        maxAltTextLength: snapshot.media.maxAltTextLength,
      },
      source,
    };
  }
  return rows;
}

/** JSON with arrays kept on one line, so the generated file stays readable. */
function compactJson(value: unknown, indent: string): string {
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  const inner = indent + '  ';
  const entries = Object.entries(value as Record<string, unknown>).map(
    ([key, item]) => `${inner}${JSON.stringify(key)}: ${compactJson(item, inner)}`,
  );
  return entries.length === 0 ? '{}' : `{\n${entries.join(',\n')}\n${indent}}`;
}

const FILE_HEADER = `/**
 * Generated from the @relay/connectors registry. Do not edit by hand.
 * Run \`pnpm generate:publishing-limits\`.
 *
 * Numbers come from each provider adapter's capability snapshot, read for a
 * freshly connected account with no elevated eligibility. Every citation is
 * copied from the reviewed marketing connector records; none is invented here.
 * A provider with no adapter in this build carries nulls and
 * \`adapterPresent: false\`, and must render as unavailable rather than as zero.
 */
import type { ProviderLimits, PublishingLimitProvider } from './publishing-limits-types';
`;

export function serializeProviderLimits(table: ProviderLimitsTable): string {
  const body = compactJson(table, '');
  return [
    FILE_HEADER,
    '/** The launch cohort, in the order the cohort declares it. */',
    `export const PUBLISHING_LIMIT_PROVIDERS: readonly PublishingLimitProvider[] = ${JSON.stringify(
      LIMIT_PROVIDERS,
    )};\n`,
    `export const PUBLISHING_LIMITS: Readonly<Record<PublishingLimitProvider, ProviderLimits>> = ${body};\n`,
  ].join('\n');
}
