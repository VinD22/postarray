import type { MetricFieldMapping } from '../shared/metrics';

/**
 * Slack exposes no message engagement metrics through the Web API. The mapping tables are
 * empty and the capability snapshot declares analytics `unsupported`, so the adapter
 * never fabricates a number.
 */

export const SLACK_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
export const SLACK_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
