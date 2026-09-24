import { DEFAULT_MINIMUM_SAMPLE, median } from '@relay/analytics-domain';

import { decimalToNumber } from '../internal/mappers';
import type { Db } from '../internal/runtime';
import { parseStoredMaster } from '../internal/stored-content';
import { mediaUnderstandingOutputSchema } from './media-analysis-types';
import type { WhatWorksRowView, WhatWorksView } from './insights-types';

/**
 * "What works for you": image traits a model saw, joined with the account's
 * own readings.
 *
 * The traits come from stored `media_analyses` rows, which only exist for a
 * workspace that opted in to image analysis. The comparison is deterministic:
 * the median reading of posts with the trait against the median of every post
 * on the same platform with a reading of the same metric.
 *
 * Two rules keep it honest. A row is shown only when both groups clear the
 * sample threshold, and every surface that renders a row renders the
 * no-causation caveat with it. A post whose image was never analysed is not
 * counted as lacking the trait; it is left out of the trait group and kept in
 * the baseline, because "we did not look" is not "it was not there".
 */

const LOOKBACK_DAYS = 180;
const RECEIPT_LIMIT = 300;
const METRICS = ['impressions', 'reach', 'views', 'likes'] as const;
const TRAITS = ['person', 'text_in_image', 'logo'] as const;
type Trait = (typeof TRAITS)[number];

export const WHAT_WORKS_MINIMUM_SAMPLE = DEFAULT_MINIMUM_SAMPLE;

function safeMediaIds(payload: unknown): readonly string[] {
  try {
    return parseStoredMaster(payload).mediaIds;
  } catch {
    return [];
  }
}

export async function readWhatWorks(
  db: Db,
  workspaceId: string,
  now: Date,
): Promise<WhatWorksView> {
  const since = new Date(now.getTime() - LOOKBACK_DAYS * 86_400_000);
  const receipts = await db.publicationReceipt.findMany({
    where: { workspaceId, publishedAt: { gte: since } },
    orderBy: { publishedAt: 'desc' },
    take: RECEIPT_LIMIT,
    select: { id: true, provider: true, contentVersion: { select: { payload: true } } },
  });
  if (receipts.length === 0) {
    return empty('insight.whatWorks.empty.noPosts');
  }

  const receiptIds = receipts.map((receipt) => receipt.id);
  const observations = await db.metricObservation.findMany({
    where: {
      workspaceId,
      receiptId: { in: receiptIds },
      availability: 'available',
      metricDefinition: { normalizedName: { in: [...METRICS] } },
    },
    orderBy: { observedAt: 'desc' },
    select: {
      receiptId: true,
      normalizedValue: true,
      rawValue: true,
      metricDefinition: { select: { normalizedName: true } },
    },
  });
  // Latest reading per receipt and metric. Missing stays missing, never zero.
  const readings = new Map<string, Map<string, number>>();
  for (const row of observations) {
    if (row.receiptId === null) continue;
    const value = decimalToNumber(row.normalizedValue ?? row.rawValue);
    if (value === null) continue;
    const perMetric = readings.get(row.receiptId) ?? new Map<string, number>();
    if (!perMetric.has(row.metricDefinition.normalizedName)) {
      perMetric.set(row.metricDefinition.normalizedName, value);
    }
    readings.set(row.receiptId, perMetric);
  }

  const mediaByReceipt = new Map(
    receipts.map((receipt) => [receipt.id, safeMediaIds(receipt.contentVersion.payload)]),
  );
  const mediaIds = [...new Set([...mediaByReceipt.values()].flat())];
  const analyses =
    mediaIds.length === 0
      ? []
      : await db.mediaAnalysis.findMany({
          where: { workspaceId, mediaAssetId: { in: mediaIds } },
          orderBy: { createdAt: 'desc' },
          select: { mediaAssetId: true, result: true },
        });
  if (analyses.length === 0) {
    return empty('insight.whatWorks.empty.noAnalyses');
  }
  const traitsByMedia = new Map<string, Set<Trait>>();
  for (const analysis of analyses) {
    if (traitsByMedia.has(analysis.mediaAssetId)) continue;
    const parsed = mediaUnderstandingOutputSchema.safeParse(analysis.result);
    if (!parsed.success) continue;
    const traits = new Set<Trait>();
    if (parsed.data.sensitive.faces) traits.add('person');
    if (parsed.data.visibleText.length > 0) traits.add('text_in_image');
    if (parsed.data.sensitive.logos.length > 0) traits.add('logo');
    traitsByMedia.set(analysis.mediaAssetId, traits);
  }

  const rows: WhatWorksRowView[] = [];
  const providers = [...new Set(receipts.map((receipt) => receipt.provider))].sort();
  for (const provider of providers) {
    const onProvider = receipts.filter((receipt) => receipt.provider === provider);
    for (const metric of METRICS) {
      const measured = onProvider.filter((receipt) => readings.get(receipt.id)?.has(metric));
      if (measured.length < WHAT_WORKS_MINIMUM_SAMPLE * 2) continue;
      const baselineValues = measured.map((receipt) => readings.get(receipt.id)?.get(metric) ?? 0);
      const baselineMedian = median(baselineValues);
      if (baselineMedian === null || baselineMedian <= 0) continue;
      for (const trait of TRAITS) {
        const withTrait = measured.filter((receipt) => {
          const media = mediaByReceipt.get(receipt.id) ?? [];
          return media.some((id) => traitsByMedia.get(id)?.has(trait) === true);
        });
        const without = measured.length - withTrait.length;
        if (withTrait.length < WHAT_WORKS_MINIMUM_SAMPLE || without < WHAT_WORKS_MINIMUM_SAMPLE) {
          continue;
        }
        const traitMedian = median(
          withTrait.map((receipt) => readings.get(receipt.id)?.get(metric) ?? 0),
        );
        if (traitMedian === null) continue;
        rows.push({
          provider,
          trait,
          metric,
          ratio: Math.round((traitMedian / baselineMedian) * 10) / 10,
          sampleSize: withTrait.length,
          baselineSize: measured.length,
          evidenceIds: withTrait.map((receipt) => receipt.id).slice(0, 20),
        });
      }
      // One metric per platform: the first one the account can read enough of.
      break;
    }
  }

  return rows.length === 0
    ? empty('insight.whatWorks.empty.smallSample')
    : { minimumSample: WHAT_WORKS_MINIMUM_SAMPLE, rows, emptyReasonKey: null };
}

function empty(reasonKey: string): WhatWorksView {
  return { minimumSample: WHAT_WORKS_MINIMUM_SAMPLE, rows: [], emptyReasonKey: reasonKey };
}
