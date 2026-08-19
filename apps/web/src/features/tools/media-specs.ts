import type { MessageKey } from '@relay/i18n/translate';

import {
  PUBLISHING_LIMITS,
  PUBLISHING_LIMIT_PROVIDERS,
} from '@/features/marketing/data/publishing-limits';
import type {
  LimitMediaBlock,
  LimitSource,
  PublishingLimitProvider,
} from '@/features/marketing/data/publishing-limits-types';
import { platformSlug } from '@/features/platforms/registry';
import type { LimitValue } from '@/features/platforms/view-model';

/**
 * The consolidated media limits table.
 *
 * Every row is built from a field the generated dataset actually carries. A
 * null field produces no row, which is what keeps this page from printing a
 * ceiling nobody recorded, and a platform whose adapter is absent from this
 * build produces no table at all rather than a table of zeros.
 *
 * The one number that is allowed through as a zero is a count, because a count
 * of zero is a recorded fact rather than a gap: YouTube accepts no still images
 * on a video, Pinterest accepts no video on a Pin. Those render through
 * `web.schedule.value.files`, whose zero case is the word "None", so the page
 * never shows a bare `0` where a reader could mistake it for a limit.
 *
 * What the dataset does not carry is pixel dimensions. There is no
 * `recommendedWidth` in `ProviderLimits`, so no row here states one, and the
 * page says why in a paragraph instead of guessing at a crop.
 */

export interface MediaSpecRow {
  readonly id: string;
  readonly labelKey: MessageKey;
  /** Never `unavailable`. An absent value produces no row. */
  readonly value: LimitValue;
}

export interface MediaSpecPlatform {
  readonly provider: PublishingLimitProvider;
  readonly slug: string;
  readonly nameKey: MessageKey;
  /** At least one. A platform with none is not in `MEDIA_SPEC_PLATFORMS`. */
  readonly rows: readonly MediaSpecRow[];
  readonly source: LimitSource | null;
}

function bytesRow(id: string, labelKey: MessageKey, value: number | null): MediaSpecRow | null {
  return value === null ? null : { id, labelKey, value: { kind: 'bytes', bytes: value } };
}

function buildRows(media: LimitMediaBlock): readonly MediaSpecRow[] {
  const rows: (MediaSpecRow | null)[] = [
    {
      id: 'images',
      labelKey: 'web.schedule.limits.images',
      value: { kind: 'files', count: media.maxImages },
    },
    {
      id: 'videos',
      labelKey: 'web.schedule.limits.videos',
      value: { kind: 'files', count: media.maxVideos },
    },
    bytesRow('imageBytes', 'web.schedule.limits.imageBytes', media.maxImageBytes),
    bytesRow('gifBytes', 'web.schedule.limits.gifBytes', media.maxGifBytes),
    bytesRow('videoBytes', 'web.schedule.limits.videoBytes', media.maxVideoBytes),
    bytesRow('documentBytes', 'web.schedule.limits.documentBytes', media.maxDocumentBytes),
    media.maxDurationSeconds === null
      ? null
      : {
          id: 'videoDuration',
          labelKey: 'web.schedule.limits.videoDuration',
          value: {
            kind: 'seconds',
            max: media.maxDurationSeconds,
            min: media.minDurationSeconds,
          },
        },
    media.maxAltTextLength === null
      ? null
      : {
          id: 'altText',
          labelKey: 'web.schedule.limits.altText',
          value: { kind: 'characters', count: media.maxAltTextLength },
        },
    media.allowedMimeTypes.length === 0
      ? null
      : {
          id: 'mimeTypes',
          labelKey: 'web.schedule.limits.mimeTypes',
          value: { kind: 'list', items: media.allowedMimeTypes },
        },
  ];

  return rows.filter((row): row is MediaSpecRow => row !== null);
}

function toPlatform(provider: PublishingLimitProvider): MediaSpecPlatform | null {
  const limits = PUBLISHING_LIMITS[provider];
  if (!limits.adapterPresent || limits.media === null) {
    return null;
  }
  const rows = buildRows(limits.media);
  if (rows.length === 0) {
    return null;
  }
  return {
    provider,
    slug: platformSlug(provider),
    nameKey: `web.provider.${provider}` as MessageKey,
    rows,
    source: limits.source,
  };
}

export const MEDIA_SPEC_PLATFORMS: readonly MediaSpecPlatform[] = PUBLISHING_LIMIT_PROVIDERS.map(
  toPlatform,
).filter((platform): platform is MediaSpecPlatform => platform !== null);
