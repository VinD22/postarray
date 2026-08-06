import type { MetricFieldMapping } from '../shared/metrics';

/**
 * Medium exposes no engagement metrics through the integration API. The mapping tables
 * are empty and the capability snapshot declares analytics `unsupported`, so the adapter
 * never fabricates a number.
 */

export const MEDIUM_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
export const MEDIUM_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
