import { z } from 'zod';

import {
  contentKindSchema,
  metricDefinitionSchema,
  normalizedMetricNameSchema,
  providerIdSchema,
} from '@relay/contracts';
import type {
  ContentKind,
  MetricAvailability,
  MetricDefinition,
  MetricObservation,
  NormalizedMetricName,
  ProviderId,
} from '@relay/contracts';

/**
 * Shared types for the analytics domain.
 *
 * The one rule that shapes everything here: a number never travels without its
 * meaning. The provider's own field name, the provider's own definition, the
 * unit, the denominator and the observation time are kept alongside the
 * normalized value, and a metric we cannot read is `unavailable_*` with a
 * reason. It is never `0` and it is never quietly estimated.
 */

/**
 * A mapping from one provider field to one normalized metric.
 *
 * `needsReverification` is deliberately loud. Provider analytics change, and a
 * mapping that has not been checked against current provider documentation is
 * an assumption, not a fact.
 */
export const metricMappingSchema = z
  .object({
    definition: metricDefinitionSchema,
    /** Permission the connection must hold. `null` when none is required. */
    requiredPermission: z.string().min(1).nullable(),
    /** Other field names the same metric has appeared under. */
    aliases: z.array(z.string().min(1)),
    needsReverification: z.boolean(),
  })
  .strict();
export type MetricMapping = z.infer<typeof metricMappingSchema>;

/** Why a reading is not available. Mirrors `MetricAvailability` minus success. */
export type UnavailableReason = Exclude<MetricAvailability, 'available'>;

/** i18n keys the UI renders for each reason. No English lives in this package. */
export const UNAVAILABLE_REASON_KEYS: Readonly<Record<UnavailableReason, string>> = Object.freeze({
  unavailable_provider: 'analytics.value.unavailableReason.unsupported',
  unavailable_permission: 'analytics.value.unavailableReason.permission',
  unavailable_pending: 'analytics.value.unavailableReason.tooEarly',
  unavailable_stale: 'analytics.value.unavailableReason.syncFailed',
});

/** A reading plus everything needed to explain it. */
export interface NormalizedMetric {
  readonly observation: MetricObservation;
  readonly definition: MetricDefinition;
  /** The provider's own field name, preserved verbatim. */
  readonly providerField: string;
  /** The provider's raw value, kept even when normalization changed the unit. */
  readonly rawValue: number | string | boolean | null;
  readonly reason: UnavailableReason | null;
  readonly reasonKey: string | null;
  readonly needsReverification: boolean;
}

/** One published post, reduced to what a comparison needs. */
export const comparablePostSchema = z
  .object({
    receiptId: z.string().min(1),
    provider: providerIdSchema,
    contentKind: contentKindSchema,
    connectionId: z.string().min(1),
    publishedAt: z.string().min(1),
    /** True when the post carried at least one media asset. */
    hasMedia: z.boolean(),
    /** True when the post carried at least one outbound link. */
    hasLink: z.boolean(),
  })
  .strict();
export type ComparablePost = z.infer<typeof comparablePostSchema>;

/** A post together with the reading being compared. */
export interface ObservedPost {
  readonly post: ComparablePost;
  readonly observation: MetricObservation;
}

/** A reason a difference might not mean what it looks like. */
export interface Confounder {
  /** Stable machine code, mapped to a message key by the UI. */
  readonly code: string;
  readonly messageKey: string;
  readonly params: Readonly<Record<string, string | number | boolean | null>>;
}

export function confounder(
  code: string,
  messageKey: string,
  params: Readonly<Record<string, string | number | boolean | null>> = {},
): Confounder {
  return { code, messageKey, params: { ...params } };
}

/** Two posts are comparable only within one platform and one content kind. */
export function isComparable(left: ComparablePost, right: ComparablePost): boolean {
  return left.provider === right.provider && left.contentKind === right.contentKind;
}

/** Content kinds that are visually and behaviourally different enough to refuse. */
const KIND_FAMILIES: Readonly<Record<ContentKind, string>> = Object.freeze({
  text: 'text',
  thread: 'text',
  image: 'image',
  carousel: 'image',
  document: 'document',
  video: 'video',
  short_video: 'video',
  long_video: 'video',
});

export function kindFamily(kind: ContentKind): string {
  return KIND_FAMILIES[kind];
}

/** True when the two kinds are not merely different but not comparable at all. */
export function isIncompatibleKind(left: ContentKind, right: ContentKind): boolean {
  return kindFamily(left) !== kindFamily(right);
}

export type {
  ContentKind,
  MetricAvailability,
  MetricDefinition,
  MetricObservation,
  NormalizedMetricName,
  ProviderId,
};
export { contentKindSchema, normalizedMetricNameSchema, providerIdSchema };
