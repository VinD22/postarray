import type { MetricFieldMapping } from '../shared/metrics';

/**
 * Discord exposes no message engagement metrics through the Bot API. The mapping tables
 * are empty and the capability snapshot declares analytics `unsupported`, so the adapter
 * never fabricates a number.
 */

export const DISCORD_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
export const DISCORD_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
