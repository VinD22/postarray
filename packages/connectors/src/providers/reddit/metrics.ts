import type { MetricFieldMapping } from '../shared/metrics';

/**
 * Reddit's official API does not expose an engagement metrics product. The mapping
 * tables are empty and the capability snapshot declares analytics `unsupported`, so the
 * adapter never fabricates a number.
 */

export const REDDIT_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
export const REDDIT_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
