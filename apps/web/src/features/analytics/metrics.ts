import type { NormalizedMetricName } from '@relay/contracts';
import type { MetricAvailability as DesignSystemAvailability } from '@relay/design-system/patterns';

import type { FreshnessState, MetricAvailabilityCode, MetricReading, OutcomeGroup } from './types';

/**
 * The rules that decide what a metric looks like on screen.
 *
 * All of it is pure so it can be tested without a renderer, and none of it
 * contains English: every function returns a message key that the calling
 * component resolves through the translator.
 */

/** Which question each normalized metric answers. */
const OUTCOME_BY_METRIC: Readonly<Record<NormalizedMetricName, OutcomeGroup>> = {
  impressions: 'awareness',
  reach: 'awareness',
  profile_views: 'awareness',
  follower_delta: 'awareness',
  published_count: 'awareness',
  views: 'consumption',
  watch_time: 'consumption',
  avg_view_duration: 'consumption',
  likes: 'interaction',
  comments: 'interaction',
  shares: 'interaction',
  saves: 'interaction',
  link_clicks: 'conversion',
};

export function outcomeGroupOf(metric: NormalizedMetricName): OutcomeGroup {
  return OUTCOME_BY_METRIC[metric];
}

export const OUTCOME_GROUPS: readonly OutcomeGroup[] = [
  'awareness',
  'consumption',
  'interaction',
  'conversion',
];

/** Metrics that belong to one group, in the order they are usually read. */
export function metricsInGroup(
  group: OutcomeGroup,
  metrics: readonly NormalizedMetricName[],
): readonly NormalizedMetricName[] {
  return metrics.filter((metric) => outcomeGroupOf(metric) === group);
}

/** The catalog key for a normalized metric name. */
export function metricLabelKey(metric: NormalizedMetricName): string {
  const byName: Readonly<Record<NormalizedMetricName, string>> = {
    impressions: 'analytics.metric.impressions',
    reach: 'analytics.metric.reach',
    views: 'analytics.metric.views',
    likes: 'analytics.metric.likes',
    comments: 'analytics.metric.comments',
    shares: 'analytics.metric.shares',
    saves: 'analytics.metric.saves',
    link_clicks: 'analytics.metric.linkClicks',
    watch_time: 'analytics.metric.watchTime',
    avg_view_duration: 'analytics.metric.averageViewDuration',
    follower_delta: 'analytics.metric.followerChange',
    profile_views: 'analytics.metric.profileViews',
    published_count: 'analytics.metric.publishedCount',
  };
  return byName[metric];
}

export function outcomeGroupLabelKey(group: OutcomeGroup): string {
  return `analytics.outcome.${group}`;
}

export function outcomeGroupHelpKey(group: OutcomeGroup): string {
  const byGroup: Readonly<Record<OutcomeGroup, string>> = {
    awareness: 'analytics.outcome.awarenessHelp',
    consumption: 'analytics.outcome.consumptionHelp',
    interaction: 'analytics.outcome.interactionHelp',
    conversion: 'analytics.outcome.conversionHelp',
  };
  return byGroup[group];
}

/**
 * Map the wire availability onto the design system's vocabulary.
 *
 * The two lists differ on purpose. `unavailable_provider` means the provider
 * has no such field, which the design system calls `unsupported`, and
 * `unavailable_not_implemented` means Post Array has not written the mapping, which
 * it calls `not_implemented`. Merging them would tell a user that a platform
 * cannot do something when in fact we have not built it, which is the exact
 * confusion `AGENTS.md` rule 7 exists to prevent.
 */
export function toDesignSystemAvailability(
  availability: MetricAvailabilityCode,
): DesignSystemAvailability {
  switch (availability) {
    case 'available':
      return 'available';
    case 'unavailable_provider':
      return 'unsupported';
    case 'unavailable_not_implemented':
      return 'not_implemented';
    case 'unavailable_permission':
      return 'permission_required';
    case 'unavailable_pending':
      return 'pending';
    case 'unavailable_stale':
      return 'unavailable';
    default: {
      const exhaustive: never = availability;
      return exhaustive;
    }
  }
}

/** The catalog key explaining why there is no number, and its ICU arguments. */
export function unavailableReasonKey(availability: MetricAvailabilityCode): string {
  switch (availability) {
    case 'unavailable_permission':
      return 'analytics.value.unavailableReason.permission';
    case 'unavailable_provider':
      return 'analytics.value.unavailableReason.unsupported';
    case 'unavailable_not_implemented':
      return 'analytics.value.unavailableReason.notImplemented';
    case 'unavailable_pending':
      return 'analytics.value.unavailableReason.tooEarly';
    case 'unavailable_stale':
      return 'analytics.value.unavailableReason.syncFailed';
    case 'available':
    default:
      return '';
  }
}

/** True only when there is a real provider supplied number to render. */
export function hasValue(reading: MetricReading): reading is MetricReading & {
  readonly value: number;
} {
  return reading.availability === 'available' && reading.value !== null;
}

/** One hour aging, six hours stale. Providers below that lag are normal. */
export const AGING_AFTER_SECONDS = 60 * 60;
export const STALE_AFTER_SECONDS = 60 * 60 * 6;

export function freshnessStateOf(
  freshnessSeconds: number | null,
  options: { readonly syncing?: boolean } = {},
): FreshnessState {
  if (options.syncing) {
    return 'syncing';
  }
  if (freshnessSeconds === null) {
    return 'never';
  }
  if (freshnessSeconds >= STALE_AFTER_SECONDS) {
    return 'stale';
  }
  if (freshnessSeconds >= AGING_AFTER_SECONDS) {
    return 'aging';
  }
  return 'fresh';
}

/**
 * How a value should be formatted, derived from its unit.
 *
 * Seconds become a duration, ratios become a percent, and everything else is a
 * plain number with grouping. A count is never abbreviated in a place where the
 * exact figure matters, which is why compact notation is opt in.
 */
export type ValueShape = 'count' | 'duration' | 'percent' | 'ratio' | 'currency';

export function valueShapeOf(unit: MetricReading['definition']['unit']): ValueShape {
  switch (unit) {
    case 'seconds':
      return 'duration';
    case 'percent':
      return 'percent';
    case 'ratio':
      return 'ratio';
    case 'currency_minor':
      return 'currency';
    case 'count':
    default:
      return 'count';
  }
}

/**
 * The metrics a user may rank the comparison table by.
 *
 * Deliberately short. Offering every metric here invites the reader to treat
 * the list as a leaderboard, and the point of this control is that the reader
 * chooses one clearly defined metric and the header then names it.
 */
export const RANKABLE_METRICS: readonly NormalizedMetricName[] = [
  'impressions',
  'reach',
  'views',
  'likes',
  'comments',
  'shares',
  'saves',
  'link_clicks',
];
