import { type MetricFieldMapping } from '../shared/metrics';

/**
 * Mastodon metric mappings.
 *
 * Account counts come from `verify_credentials`/`GET /api/v1/accounts/:id`; post counts
 * come from the public status object. Both are public numbers the server computes, never
 * fabricated, and the UI labels their freshness. Mastodon offers no impression or reach
 * figure, so those normalized names are absent rather than reported as unavailable.
 *
 * Sources retrieved 4 August 2026.
 */

export const MASTODON_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  {
    providerField: 'statuses_count',
    normalizedName: 'published_count',
    unit: 'count',
    denominator: 'none',
  },
]);

export const MASTODON_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([
  {
    providerField: 'reblogs_count',
    normalizedName: 'shares',
    unit: 'count',
    denominator: 'none',
  },
  {
    providerField: 'favourites_count',
    normalizedName: 'likes',
    unit: 'count',
    denominator: 'none',
  },
  {
    providerField: 'replies_count',
    normalizedName: 'comments',
    unit: 'count',
    denominator: 'none',
  },
]);
