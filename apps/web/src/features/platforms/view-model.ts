import type { CapabilityState } from '@relay/design-system/patterns';
import type { MessageKey } from '@relay/i18n/translate';

import {
  CAPABILITY_COLUMNS,
  CONNECTORS,
  capabilityLabelKey,
  capabilityStateLabelKey,
  type CapabilityColumn,
  type Citation,
} from '@/features/marketing/data/connectors';
import { PUBLISHING_LIMITS } from '@/features/marketing/data/publishing-limits';
import type {
  LimitSource,
  ProviderLimits,
  PublishingLimitProvider,
} from '@/features/marketing/data/publishing-limits-types';

import type { PlatformPage } from './registry';

/**
 * The view model behind one per platform scheduler page.
 *
 * Every field is read from a generated dataset: the publishing-limits grid for
 * the numbers and the connector registry for the capability states. Nothing in
 * this module, and nothing in the page that renders it, can state a capability
 * or a ceiling of its own. That is the whole point: if the connectors do not
 * have it, the page cannot say it.
 *
 * A platform with no adapter in this build produces `limits: null` and
 * `capabilities: null`, which the page renders as unavailable. It never
 * produces a zero.
 */

export type LimitValue =
  | { readonly kind: 'unavailable' }
  /** A catalog sentence, for the limits that are a rule rather than a number. */
  | { readonly kind: 'message'; readonly key: MessageKey; readonly count?: number }
  | { readonly kind: 'characters'; readonly count: number }
  | { readonly kind: 'files'; readonly count: number }
  | { readonly kind: 'bytes'; readonly bytes: number }
  | { readonly kind: 'seconds'; readonly max: number; readonly min: number | null }
  | { readonly kind: 'list'; readonly items: readonly string[] };

export interface LimitRow {
  readonly id: string;
  readonly labelKey: MessageKey;
  readonly value: LimitValue;
}

export interface CapabilityRow {
  readonly column: CapabilityColumn;
  readonly labelKey: MessageKey;
  readonly state: CapabilityState;
  readonly stateLabelKey: MessageKey;
  readonly noteKey?: MessageKey;
  readonly citation?: Citation;
}

export interface RequirementRow {
  readonly id: 'accountTypes' | 'restriction' | 'cost';
  readonly labelKey: MessageKey;
  readonly bodyKey: MessageKey;
}

export interface PlatformViewModel {
  readonly provider: PublishingLimitProvider;
  readonly slug: string;
  readonly nameKey: MessageKey;
  /** False when this build ships no adapter, so every number is unknown. */
  readonly adapterPresent: boolean;
  readonly limitRows: readonly LimitRow[] | null;
  readonly limitSource: LimitSource | null;
  readonly requirements: readonly RequirementRow[] | null;
  readonly apiSource: Citation | null;
  readonly policySource: Citation | null;
  readonly capabilities: readonly CapabilityRow[] | null;
}

function characters(value: number | null): LimitValue {
  return value === null ? { kind: 'unavailable' } : { kind: 'characters', count: value };
}

function bytes(value: number | null): LimitValue {
  return value === null ? { kind: 'unavailable' } : { kind: 'bytes', bytes: value };
}

function countingUnitValue(limits: ProviderLimits): LimitValue {
  if (limits.countingUnit === null) {
    return { kind: 'unavailable' };
  }
  return { kind: 'message', key: `web.schedule.unit.${limits.countingUnit}` as MessageKey };
}

function linkValue(limits: ProviderLimits): LimitValue {
  const text = limits.text;
  if (text === null) {
    return { kind: 'unavailable' };
  }
  if (text.linkCountingMode === 'fixed') {
    if (text.charactersPerLink === null) {
      return { kind: 'unavailable' };
    }
    return { kind: 'message', key: 'web.schedule.link.fixed', count: text.charactersPerLink };
  }
  return { kind: 'message', key: `web.schedule.link.${text.linkCountingMode}` as MessageKey };
}

function durationValue(limits: ProviderLimits): LimitValue {
  const media = limits.media;
  if (media === null || media.maxDurationSeconds === null) {
    return { kind: 'unavailable' };
  }
  return { kind: 'seconds', max: media.maxDurationSeconds, min: media.minDurationSeconds };
}

/** Every row a platform page shows, in reading order. */
function buildLimitRows(limits: ProviderLimits): readonly LimitRow[] {
  const text = limits.text;
  const media = limits.media;

  return [
    {
      id: 'text',
      labelKey: 'web.schedule.limits.text',
      value: characters(text === null ? null : text.maxLength),
    },
    {
      id: 'title',
      labelKey: 'web.schedule.limits.title_field',
      value: characters(limits.maxTitleLength),
    },
    {
      id: 'countingUnit',
      labelKey: 'web.schedule.limits.countingUnit',
      value: countingUnitValue(limits),
    },
    { id: 'links', labelKey: 'web.schedule.limits.links', value: linkValue(limits) },
    {
      id: 'markdown',
      labelKey: 'web.schedule.limits.markdown',
      value:
        text === null
          ? { kind: 'unavailable' }
          : {
              kind: 'message',
              key: text.supportsMarkdown
                ? 'web.schedule.value.markdownYes'
                : 'web.schedule.value.markdownNo',
            },
    },
    {
      id: 'images',
      labelKey: 'web.schedule.limits.images',
      value: media === null ? { kind: 'unavailable' } : { kind: 'files', count: media.maxImages },
    },
    {
      id: 'videos',
      labelKey: 'web.schedule.limits.videos',
      value: media === null ? { kind: 'unavailable' } : { kind: 'files', count: media.maxVideos },
    },
    {
      id: 'videoDuration',
      labelKey: 'web.schedule.limits.videoDuration',
      value: durationValue(limits),
    },
    {
      id: 'imageBytes',
      labelKey: 'web.schedule.limits.imageBytes',
      value: bytes(media === null ? null : media.maxImageBytes),
    },
    {
      id: 'gifBytes',
      labelKey: 'web.schedule.limits.gifBytes',
      value: bytes(media === null ? null : media.maxGifBytes),
    },
    {
      id: 'videoBytes',
      labelKey: 'web.schedule.limits.videoBytes',
      value: bytes(media === null ? null : media.maxVideoBytes),
    },
    {
      id: 'documentBytes',
      labelKey: 'web.schedule.limits.documentBytes',
      value: bytes(media === null ? null : media.maxDocumentBytes),
    },
    {
      id: 'altText',
      labelKey: 'web.schedule.limits.altText',
      value: characters(media === null ? null : media.maxAltTextLength),
    },
    {
      id: 'mimeTypes',
      labelKey: 'web.schedule.limits.mimeTypes',
      value:
        media === null || media.allowedMimeTypes.length === 0
          ? { kind: 'unavailable' }
          : { kind: 'list', items: media.allowedMimeTypes },
    },
  ];
}

function buildCapabilityRows(provider: PublishingLimitProvider): readonly CapabilityRow[] | null {
  const connector = CONNECTORS.find((record) => record.id === provider);
  if (!connector) {
    return null;
  }
  return CAPABILITY_COLUMNS.map((column) => {
    const cell = connector.capabilities[column];
    return {
      column,
      labelKey: capabilityLabelKey(column),
      state: cell.state,
      stateLabelKey: capabilityStateLabelKey(cell.state),
      ...(cell.noteKey === undefined ? {} : { noteKey: cell.noteKey }),
      ...(cell.citation === undefined ? {} : { citation: cell.citation }),
    };
  });
}

export function buildPlatformViewModel(page: PlatformPage): PlatformViewModel {
  const limits = PUBLISHING_LIMITS[page.provider];
  const connector = CONNECTORS.find((record) => record.id === page.provider);

  return {
    provider: page.provider,
    slug: page.slug,
    nameKey: page.nameKey,
    adapterPresent: limits.adapterPresent,
    limitRows: limits.adapterPresent ? buildLimitRows(limits) : null,
    limitSource: limits.source,
    requirements: connector
      ? [
          {
            id: 'accountTypes',
            labelKey: 'web.schedule.requirements.accountTypes',
            bodyKey: connector.accountTypesKey,
          },
          {
            id: 'restriction',
            labelKey: 'web.schedule.requirements.restriction',
            bodyKey: connector.restrictionKey,
          },
          { id: 'cost', labelKey: 'web.schedule.requirements.cost', bodyKey: connector.costKey },
        ]
      : null,
    apiSource: connector ? connector.primarySource : null,
    policySource: connector ? connector.policySource : null,
    capabilities: buildCapabilityRows(page.provider),
  };
}
