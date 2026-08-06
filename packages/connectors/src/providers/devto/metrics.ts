import type { MetricFieldMapping } from '../shared/metrics';

/**
 * Dev.to has no official engagement metrics API. The mapping tables are empty and the
 * capability snapshot declares analytics `unsupported`, so the adapter never fabricates
 * a number.
 */

export const DEVTO_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
export const DEVTO_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
