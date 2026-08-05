import type { MetricFieldMapping } from '../shared/metrics';

/**
 * Bluesky metric mapping.
 *
 * These are public engagement counts read from the post thread view. They are not
 * platform-reported insights and the UI labels them as public counts. The AT Protocol
 * offers no impression or reach figure, so those normalized names are simply absent rather
 * than reported as unavailable, and never estimated.
 *
 * Sources retrieved 4 August 2026.
 */

export const BLUESKY_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  { providerField: 'likeCount', normalizedName: 'likes', unit: 'count', denominator: 'none' },
  { providerField: 'replyCount', normalizedName: 'comments', unit: 'count', denominator: 'none' },
  { providerField: 'repostCount', normalizedName: 'shares', unit: 'count', denominator: 'none' },
  { providerField: 'quoteCount', normalizedName: 'saves', unit: 'count', denominator: 'none' },
]);

export const BLUESKY_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  {
    providerField: 'postsCount',
    normalizedName: 'published_count',
    unit: 'count',
    denominator: 'none',
  },
]);
