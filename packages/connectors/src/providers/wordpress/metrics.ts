import type { MetricFieldMapping } from '../shared/metrics';

/**
 * WordPress exposes no engagement metrics through its REST API without an analytics
 * plugin. The mapping tables are empty and the capability snapshot declares analytics
 * `unsupported`, so the adapter never fabricates a number.
 */

export const WORDPRESS_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
export const WORDPRESS_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
