import { ERROR_CODES, RelayError } from '@relay/contracts';

/**
 * Every failure this package raises is a `RelayError` with a stable code and an
 * i18n message key from the shipped English catalog. No English literal ever
 * leaves this package.
 */

export const AI_MESSAGE_KEYS = {
  unavailable: 'error.ai_unavailable.message',
  unavailableAction: 'error.ai_unavailable.action',
  outputInvalid: 'error.ai_output_invalid.message',
  budgetExceeded: 'error.ai_budget_exceeded.message',
  notConfigured: 'error.ai_unavailable.message',
} as const;

export interface AiErrorContext {
  readonly correlationId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly cause?: unknown;
}

/**
 * Assistance is not usable right now. This is deliberately retryable and never
 * blocks the user's real work: callers degrade rather than fail.
 */
export function aiUnavailableError(reason: string, context: AiErrorContext = {}): RelayError {
  return new RelayError(ERROR_CODES.AI_UNAVAILABLE, {
    messageKey: AI_MESSAGE_KEYS.unavailable,
    details: { reason, ...(context.details ?? {}) },
    ...(context.correlationId === undefined ? {} : { correlationId: context.correlationId }),
    ...(context.cause === undefined ? {} : { cause: context.cause }),
  });
}

/** The model produced something the schema or the post-processor rejected. */
export function aiOutputInvalidError(reason: string, context: AiErrorContext = {}): RelayError {
  return new RelayError(ERROR_CODES.AI_OUTPUT_INVALID, {
    messageKey: AI_MESSAGE_KEYS.outputInvalid,
    details: { reason, ...(context.details ?? {}) },
    ...(context.correlationId === undefined ? {} : { correlationId: context.correlationId }),
    ...(context.cause === undefined ? {} : { cause: context.cause }),
  });
}

/** A per-workspace call, token or spend ceiling stopped the call before it ran. */
export function aiBudgetExceededError(limit: string, context: AiErrorContext = {}): RelayError {
  return new RelayError(ERROR_CODES.QUOTA_EXCEEDED, {
    messageKey: AI_MESSAGE_KEYS.budgetExceeded,
    retryable: false,
    details: { limit, ...(context.details ?? {}) },
    ...(context.correlationId === undefined ? {} : { correlationId: context.correlationId }),
  });
}

/** Guardrails refused the input or the output. Never surfaced as a model answer. */
export function aiPolicyBlockedError(rule: string, context: AiErrorContext = {}): RelayError {
  return new RelayError(ERROR_CODES.POLICY_BLOCKED, {
    messageKey: AI_MESSAGE_KEYS.outputInvalid,
    details: { rule, ...(context.details ?? {}) },
    ...(context.correlationId === undefined ? {} : { correlationId: context.correlationId }),
  });
}
