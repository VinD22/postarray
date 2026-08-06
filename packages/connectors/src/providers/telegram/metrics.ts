import type { MetricFieldMapping } from '../shared/metrics';

/**
 * Telegram has no official post or account metrics API for bots. The mapping tables are
 * empty and the capability snapshot declares analytics `unsupported`, so the adapter
 * never fabricates a number.
 */

export const TELEGRAM_POST_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
export const TELEGRAM_ACCOUNT_METRICS: readonly MetricFieldMapping[] = Object.freeze([]);
