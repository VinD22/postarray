import type { MetricFieldMapping } from '../../shared/metrics.js';

/**
 * Threads metric mapping. Insights are available where the Threads insights permission is
 * granted. Sources retrieved 4 August 2026. Re-verify before implementation.
 */

export const THREADS_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  { providerField: 'views', normalizedName: 'views', unit: 'count', denominator: 'none' },
  { providerField: 'likes', normalizedName: 'likes', unit: 'count', denominator: 'none' },
  { providerField: 'replies', normalizedName: 'comments', unit: 'count', denominator: 'none' },
  { providerField: 'reposts', normalizedName: 'shares', unit: 'count', denominator: 'none' },
  { providerField: 'shares', normalizedName: 'saves', unit: 'count', denominator: 'none' },
]);

export const THREADS_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  { providerField: 'views', normalizedName: 'views', unit: 'count', denominator: 'none' },
  {
    providerField: 'followers_count',
    normalizedName: 'follower_delta',
    unit: 'count',
    denominator: 'none',
  },
]);

export const THREADS_POST_METRIC_QUERY = THREADS_POST_METRICS.map(
  (mapping) => mapping.providerField,
).join(',');

export const THREADS_ACCOUNT_METRIC_QUERY = THREADS_ACCOUNT_METRICS.map(
  (mapping) => mapping.providerField,
).join(',');

export const THREADS_MEDIA_FIELDS = 'id,permalink,text,timestamp,media_type,shortcode';
