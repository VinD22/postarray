import type { MetricFieldMapping } from '../shared/metrics.js';

/**
 * X metric mapping.
 *
 * Only fields X actually returns are listed. `impression_count` is present in
 * `public_metrics` for posts the authenticated user owns, subject to the paid access tier;
 * when the tier does not return it the observation is `unavailable_permission`, never 0.
 * Sources retrieved 4 August 2026: X API post metrics and user lookup documentation.
 */

export const X_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  {
    providerField: 'impression_count',
    normalizedName: 'impressions',
    unit: 'count',
    denominator: 'none',
  },
  { providerField: 'like_count', normalizedName: 'likes', unit: 'count', denominator: 'none' },
  { providerField: 'reply_count', normalizedName: 'comments', unit: 'count', denominator: 'none' },
  { providerField: 'retweet_count', normalizedName: 'shares', unit: 'count', denominator: 'none' },
  { providerField: 'bookmark_count', normalizedName: 'saves', unit: 'count', denominator: 'none' },
  {
    providerField: 'url_link_clicks',
    normalizedName: 'link_clicks',
    unit: 'count',
    denominator: 'none',
  },
]);

/**
 * Account level. X returns the user's lifetime post count. It does not return profile
 * views or a follower delta through this endpoint, and we never derive one, so those
 * normalized names are simply absent from the capability snapshot.
 */
export const X_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  {
    providerField: 'tweet_count',
    normalizedName: 'published_count',
    unit: 'count',
    denominator: 'none',
  },
]);

/**
 * The `tweet.fields` and `user.fields` we request. Requesting more than we map would be
 * reading data we do not use, which app review asks us not to do.
 */
export const X_POST_FIELDS = 'public_metrics,non_public_metrics,created_at,text';
export const X_USER_FIELDS = 'public_metrics,profile_image_url,protected';
