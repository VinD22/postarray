import type { MetricFieldMapping } from '../shared/metrics';

/**
 * Pinterest exposes no engagement metrics through the v5 API without analytics access.
 * The mapping tables are empty and the capability snapshot declares analytics
 * `unsupported`, so the adapter never fabricates a number.
 */

export const PINTEREST_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
export const PINTEREST_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
