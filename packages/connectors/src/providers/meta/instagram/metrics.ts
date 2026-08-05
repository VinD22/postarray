import type { MetricFieldMapping } from '../../shared/metrics.js';

/**
 * Instagram metric mapping.
 *
 * Reels, feed images and carousels do not return the same field set. Presenting them in
 * one comparison without labels would be misleading, so every observation carries the
 * provider field name and a field the media type does not return is `unavailable_provider`
 * rather than 0.
 *
 * Sources retrieved 4 August 2026: IG Media insights and IG User insights reference.
 */

export const INSTAGRAM_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  { providerField: 'views', normalizedName: 'views', unit: 'count', denominator: 'none' },
  { providerField: 'reach', normalizedName: 'reach', unit: 'count', denominator: 'none' },
  { providerField: 'likes', normalizedName: 'likes', unit: 'count', denominator: 'none' },
  { providerField: 'comments', normalizedName: 'comments', unit: 'count', denominator: 'none' },
  { providerField: 'saved', normalizedName: 'saves', unit: 'count', denominator: 'none' },
  { providerField: 'shares', normalizedName: 'shares', unit: 'count', denominator: 'none' },
]);

export const INSTAGRAM_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  { providerField: 'reach', normalizedName: 'reach', unit: 'count', denominator: 'none' },
  {
    providerField: 'profile_views',
    normalizedName: 'profile_views',
    unit: 'count',
    denominator: 'none',
  },
  {
    providerField: 'follower_count',
    normalizedName: 'follower_delta',
    unit: 'count',
    denominator: 'none',
  },
]);

/** The `metric` query values, derived from the mappings so the two cannot drift. */
export const INSTAGRAM_POST_METRIC_QUERY = INSTAGRAM_POST_METRICS.map(
  (mapping) => mapping.providerField,
).join(',');

export const INSTAGRAM_ACCOUNT_METRIC_QUERY = INSTAGRAM_ACCOUNT_METRICS.map(
  (mapping) => mapping.providerField,
).join(',');

export const INSTAGRAM_MEDIA_FIELDS =
  'id,permalink,media_type,media_product_type,timestamp,like_count,comments_count';
