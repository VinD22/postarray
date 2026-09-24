import {
  summarizeExperiment,
  tagBeforePublication,
  type Experiment,
  type ObservedPost,
} from '@relay/analytics-domain';
import { normalizedMetricNameSchema } from '@relay/contracts';
import { z } from 'zod';

import { invalid, notFound } from '../internal/errors';
import type { Db } from '../internal/runtime';
import type { OpenExperimentView, PostExperimentView } from './insights-types';

/**
 * Experiments on a post: tag a draft into a variant before it publishes, and
 * summarize the experiment it belongs to on the post detail.
 *
 * Tagging goes through `tagBeforePublication`, which refuses once the post
 * exists externally, so the analysis is never assembled after the fact. The
 * summary goes through `summarizeExperiment`, which never names a leading
 * variant unless every variant met its sample and the difference is outside
 * the noise band. Variant membership is stored by content item id in the
 * experiment's `variants` JSON.
 */

const storedVariantSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  receiptIds: z.array(z.string()).default([]),
});

export const tagExperimentRequestSchema = z
  .object({
    experimentId: z.string().trim().min(1),
    variantId: z.string().trim().min(1),
  })
  .strict();

const MINIMUM_PER_VARIANT = 3;
const PRIMARY_METRIC_FALLBACK = 'impressions';

interface ExperimentRow {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly hypothesis: string;
  readonly variants: unknown;
  readonly successMetric: string;
  readonly windowStart: Date;
  readonly windowEnd: Date;
  readonly state: string;
}

const EXPERIMENT_SELECT = {
  id: true,
  workspaceId: true,
  name: true,
  hypothesis: true,
  variants: true,
  successMetric: true,
  windowStart: true,
  windowEnd: true,
  state: true,
} as const;

function variantsOf(value: unknown): z.infer<typeof storedVariantSchema>[] {
  const parsed = z.array(storedVariantSchema).safeParse(value);
  return parsed.success ? parsed.data : [];
}

function toDomain(row: ExperimentRow): Experiment | null {
  const metric = normalizedMetricNameSchema.safeParse(row.successMetric);
  const variants = variantsOf(row.variants);
  if (variants.length < 2) return null;
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    hypothesis: row.hypothesis,
    successMetric: metric.success ? metric.data : PRIMARY_METRIC_FALLBACK,
    variants: variants.slice(0, 4),
    windowStart: row.windowStart.toISOString(),
    windowEnd: row.windowEnd.toISOString(),
    minimumSamplePerVariant: MINIMUM_PER_VARIANT,
    // The stored `planned` and `collecting` both accept tags.
    state:
      row.state === 'complete' || row.state === 'completed'
        ? 'complete'
        : row.state === 'abandoned' || row.state === 'stopped'
          ? 'abandoned'
          : 'running',
    caveats: [],
  };
}

/** Attach an unpublished post to one variant. Returns the updated membership. */
export async function tagPostIntoVariant(
  db: Db,
  workspaceId: string,
  contentItemId: string,
  input: z.infer<typeof tagExperimentRequestSchema>,
): Promise<{ readonly before: unknown; readonly after: unknown }> {
  const row = await db.experiment.findFirst({
    where: { id: input.experimentId, workspaceId },
    select: EXPERIMENT_SELECT,
  });
  const experiment = row === null ? null : toDomain(row);
  if (row === null || experiment === null) {
    throw notFound('experiment', input.experimentId);
  }
  const published = await db.publicationReceipt.findFirst({
    where: { workspaceId, publishJob: { contentItemId } },
    select: { id: true },
  });
  const result = tagBeforePublication({
    experiment,
    variantId: input.variantId,
    contentItemId,
    alreadyPublished: published !== null,
  });
  if (!result.ok) {
    throw invalid(`insight.experiment.refused.${String(result.error).toLowerCase()}`, {
      reason: String(result.error),
    });
  }
  const after = result.experiment.variants.map((variant) => ({
    id: variant.id,
    label: variant.label,
    receiptIds: [...variant.receiptIds],
  }));
  await db.experiment.update({
    where: { id: row.id },
    data: { variants: after },
  });
  return { before: row.variants, after };
}

/** The experiment this post belongs to, summarized. Null when it has none. */
export async function readPostExperiment(
  db: Db,
  workspaceId: string,
  contentItemId: string,
): Promise<PostExperimentView | null> {
  const rows = await db.experiment.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: EXPERIMENT_SELECT,
  });
  const row = rows.find((candidate) =>
    variantsOf(candidate.variants).some((variant) => variant.receiptIds.includes(contentItemId)),
  );
  const experiment = row === undefined ? null : toDomain(row);
  if (row === undefined || experiment === null) {
    return null;
  }

  const members = experiment.variants.flatMap((variant) => variant.receiptIds);
  const receipts = await db.publicationReceipt.findMany({
    where: { workspaceId, publishJob: { contentItemId: { in: members } } },
    select: {
      id: true,
      provider: true,
      connectionId: true,
      publishedAt: true,
      publishJob: { select: { contentItemId: true } },
    },
    take: 200,
  });
  const observed: ObservedPost[] = [];
  for (const receipt of receipts) {
    const reading = await db.metricObservation.findFirst({
      where: {
        workspaceId,
        receiptId: receipt.id,
        metricDefinition: { normalizedName: experiment.successMetric },
      },
      orderBy: { observedAt: 'desc' },
      select: { availability: true, normalizedValue: true, observedAt: true },
    });
    const value =
      reading?.availability === 'available' && reading.normalizedValue !== null
        ? Number(reading.normalizedValue.toString())
        : null;
    observed.push({
      post: {
        // Membership is by content item, so the summary is keyed the same way.
        receiptId: receipt.publishJob.contentItemId,
        provider: receipt.provider as ObservedPost['post']['provider'],
        contentKind: 'text',
        connectionId: receipt.connectionId,
        publishedAt: receipt.publishedAt.toISOString(),
        hasMedia: false,
        hasLink: false,
      },
      observation: {
        normalizedName: experiment.successMetric,
        provider: receipt.provider as ObservedPost['post']['provider'],
        providerField: experiment.successMetric,
        scope: 'post',
        value: Number.isFinite(value) ? value : null,
        unit: 'count',
        denominator: 'none',
        availability: value === null ? 'unavailable_pending' : 'available',
        observedAt: (reading?.observedAt ?? receipt.publishedAt).toISOString(),
        freshnessSeconds: 0,
        rawProviderPayloadHash: '0'.repeat(64),
      },
    });
  }

  const summary = summarizeExperiment(experiment, observed);
  const variantId =
    experiment.variants.find((variant) => variant.receiptIds.includes(contentItemId))?.id ?? null;
  return {
    experimentId: row.id,
    name: row.name,
    metric: summary.metric,
    variantId,
    conclusive: summary.conclusive,
    leadingVariantId: summary.leadingVariantId,
    relativeDifference: summary.relativeDifference,
    variants: summary.variants.map((variant) => ({
      variantId: variant.variantId,
      label: variant.label,
      sampleSize: variant.sampleSize,
      medianValue: variant.medianValue,
      unavailableCount: variant.unavailableCount,
    })),
    caveatKeys: summary.caveats.map((entry) => entry.messageKey),
  };
}

/** Experiments a draft can still join, with their variants. */
export async function readOpenExperiments(
  db: Db,
  workspaceId: string,
): Promise<readonly OpenExperimentView[]> {
  const rows = await db.experiment.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: EXPERIMENT_SELECT,
  });
  return rows.flatMap((row): OpenExperimentView[] => {
    const experiment = toDomain(row);
    if (experiment === null || experiment.state !== 'running') return [];
    return [
      {
        experimentId: row.id,
        name: row.name,
        variants: experiment.variants.map((variant) => ({ id: variant.id, label: variant.label })),
      },
    ];
  });
}
