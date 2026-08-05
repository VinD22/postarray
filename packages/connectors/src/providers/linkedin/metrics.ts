import type { MetricFieldMapping } from '../shared/metrics.js';

/**
 * LinkedIn metric mapping.
 *
 * Two different surfaces are involved and they do not return the same fields:
 *
 * - `socialActions` returns like and comment counts and is available for both member and
 *   organization posts.
 * - `organizationalEntityShareStatistics` returns impressions, clicks and shares, and is
 *   available only for organization posts under approved community access.
 *
 * New applications do not get read access to member post statistics. That is a LinkedIn
 * restriction, not a gap of ours, and the UI must say which. We never substitute a zero.
 * Sources retrieved 4 August 2026.
 */

/** Available for member and organization posts through the social actions endpoint. */
export const LINKEDIN_SOCIAL_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  { providerField: 'totalLikes', normalizedName: 'likes', unit: 'count', denominator: 'none' },
  {
    providerField: 'aggregatedTotalComments',
    normalizedName: 'comments',
    unit: 'count',
    denominator: 'none',
  },
]);

/** Organization posts only, under approved community access. */
export const LINKEDIN_ORGANIZATION_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  {
    providerField: 'impressionCount',
    normalizedName: 'impressions',
    unit: 'count',
    denominator: 'none',
  },
  {
    providerField: 'uniqueImpressionsCount',
    normalizedName: 'reach',
    unit: 'count',
    denominator: 'none',
  },
  {
    providerField: 'clickCount',
    normalizedName: 'link_clicks',
    unit: 'count',
    denominator: 'none',
  },
  { providerField: 'likeCount', normalizedName: 'likes', unit: 'count', denominator: 'none' },
  { providerField: 'commentCount', normalizedName: 'comments', unit: 'count', denominator: 'none' },
  { providerField: 'shareCount', normalizedName: 'shares', unit: 'count', denominator: 'none' },
]);

/** Organization account level, under approved community access. */
export const LINKEDIN_ORGANIZATION_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  {
    providerField: 'organicFollowerGain',
    normalizedName: 'follower_delta',
    unit: 'count',
    denominator: 'none',
  },
]);
