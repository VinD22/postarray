/**
 * Telling an exhausted AI allowance apart from an ordinary rate limit.
 *
 * The gateway raises `QUOTA_EXCEEDED` with the budget message key when a
 * workspace has spent its allowance for the period. `describeApiError` groups
 * that with rate limits, which is right for retry behaviour and wrong for what
 * the screen should say: a rate limit clears in seconds, an allowance does not.
 */

import type { DescribedError } from '@/features/settings/lib/api-error';

export const AI_BUDGET_MESSAGE_KEY = 'error.ai_budget_exceeded.message';

export function isOverBudget(described: DescribedError): boolean {
  return described.code === 'QUOTA_EXCEEDED' && described.messageKey === AI_BUDGET_MESSAGE_KEY;
}
