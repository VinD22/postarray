import type { MetricFieldMapping } from '../../shared/metrics.js';

/**
 * Facebook Page metric mapping.
 *
 * Field availability varies by post type, by granted permission and by Page size for some
 * aggregate metrics. Where a metric is withheld we show `unavailable` with the reason, and
 * we never present a metric Facebook did not return.
 * Sources retrieved 4 August 2026: Post insights and Page insights references.
 */

export const FACEBOOK_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  {
    providerField: 'post_impressions',
    normalizedName: 'impressions',
    unit: 'count',
    denominator: 'none',
  },
  {
    providerField: 'post_impressions_unique',
    normalizedName: 'reach',
    unit: 'count',
    denominator: 'none',
  },
  { providerField: 'post_clicks', normalizedName: 'link_clicks', unit: 'count', denominator: 'none' },
  {
    providerField: 'post_video_views',
    normalizedName: 'views',
    unit: 'count',
    denominator: 'none',
  },
]);

export const FACEBOOK_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  {
    providerField: 'page_impressions',
    normalizedName: 'impressions',
    unit: 'count',
    denominator: 'none',
  },
  {
    providerField: 'page_impressions_unique',
    normalizedName: 'reach',
    unit: 'count',
    denominator: 'none',
  },
  {
    providerField: 'page_fan_adds_unique',
    normalizedName: 'follower_delta',
    unit: 'count',
    denominator: 'none',
  },
  {
    providerField: 'page_views_total',
    normalizedName: 'profile_views',
    unit: 'count',
    denominator: 'none',
  },
]);

/** Like, comment and share counts come from the post object rather than from insights. */
export const FACEBOOK_ENGAGEMENT_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  { providerField: 'like_count', normalizedName: 'likes', unit: 'count', denominator: 'none' },
  { providerField: 'comment_count', normalizedName: 'comments', unit: 'count', denominator: 'none' },
  { providerField: 'share_count', normalizedName: 'shares', unit: 'count', denominator: 'none' },
]);

export const FACEBOOK_POST_METRIC_QUERY = FACEBOOK_POST_METRICS.map(
  (mapping) => mapping.providerField,
).join(',');

export const FACEBOOK_ACCOUNT_METRIC_QUERY = FACEBOOK_ACCOUNT_METRICS.map(
  (mapping) => mapping.providerField,
).join(',');

export const FACEBOOK_POST_FIELDS =
  'id,permalink_url,created_time,message,is_published,likes.summary(true),comments.summary(true),shares';
