/**
 * `@relay/analytics-domain`
 *
 * Metric normalization and the honest feedback engine.
 *
 * Three rules hold everywhere in this package:
 *  - a number never travels without its meaning. The provider field name, the
 *    provider's own definition, the unit, the denominator and the observation
 *    time stay attached to it.
 *  - a metric we cannot read is `unavailable_*` with a reason. It is never `0`
 *    and it is never estimated silently.
 *  - a comparison is against the account's own trailing median, with the sample
 *    size and the confounders stated. There is no universal score and no cross
 *    platform leaderboard unless the caller names one defined metric.
 */

export {
  UNAVAILABLE_REASON_KEYS,
  comparablePostSchema,
  confounder,
  contentKindSchema,
  isComparable,
  isIncompatibleKind,
  kindFamily,
  metricMappingSchema,
  normalizedMetricNameSchema,
  providerIdSchema,
} from './types';
export type {
  ComparablePost,
  Confounder,
  ContentKind,
  MetricAvailability,
  MetricDefinition,
  MetricMapping,
  MetricObservation,
  NormalizedMetric,
  NormalizedMetricName,
  ObservedPost,
  ProviderId,
  UnavailableReason,
} from './types';

export { fixedClock, parseInstant, secondsBetween, systemClock } from './time';
export type { Clock } from './time';

export {
  METRIC_MAPPINGS,
  definitionsDiffer,
  mappingForMetric,
  mappingsFor,
  supportedMetrics,
} from './registry';

export { findMetric, normalizeMetrics, presentMetrics, unavailableByReason } from './normalize';
export type { NormalizeInput } from './normalize';

export {
  BASELINE_DIRECTIONS,
  BASELINE_OUTCOMES,
  DEFAULT_HISTORY_LIMIT,
  DEFAULT_MINIMUM_SAMPLE,
  NOISE_BAND,
  SMALL_SAMPLE_THRESHOLD,
  compareToTrailingMedian,
  median,
} from './baseline';
export type { BaselineDirection, BaselineInput, BaselineOutcome, BaselineResult } from './baseline';

export {
  CONFIDENCES,
  INSIGHT_KINDS,
  buildBaselineInsights,
  buildNextTestInsight,
  buildUnavailabilityInsights,
  compareAcrossPlatforms,
} from './insights';
export type {
  CrossPlatformComparison,
  CrossPlatformRequest,
  CrossPlatformRow,
  Insight,
  InsightConfidence,
  InsightKind,
  InsightParam,
} from './insights';

export {
  EXPERIMENT_STATES,
  TAGGING_ERRORS,
  detectCompletion,
  experimentSchema,
  experimentStateSchema,
  experimentVariantSchema,
  summarizeExperiment,
  tagBeforePublication,
  variantAgainstBaseline,
} from './experiments';
export type {
  CompletionCheck,
  Experiment,
  ExperimentState,
  ExperimentSummary,
  ExperimentVariant,
  TagInput,
  TagResult,
  TaggingError,
  VariantSummary,
} from './experiments';

export {
  DEFAULT_STALE_AFTER_SECONDS,
  FRESHNESS_LABELS,
  FRESHNESS_MESSAGE_KEYS,
  computeCoverage,
  computeFreshness,
  markStaleMetrics,
} from './freshness';
export type {
  CoverageInput,
  CoverageReport,
  FreshnessInput,
  FreshnessLabel,
  FreshnessReport,
} from './freshness';
