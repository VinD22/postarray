import { ERROR_CODES, RelayError } from '@relay/contracts';
import type { ErrorCode } from '@relay/contracts';

/**
 * Exit codes.
 *
 * A script wrapping this CLI has to be able to branch on what went wrong
 * without parsing text. The mapping is a fixed table rather than a computed
 * range, so adding an error code is a deliberate decision about how automation
 * should react to it, and an existing code's exit value never moves.
 */

export const EXIT_OK = 0;
export const EXIT_UNKNOWN = 1;
/** The command line itself was wrong. Nothing was sent. */
export const EXIT_USAGE = 2;

export const EXIT_CODES = {
  AUTH_REQUIRED: 10,
  AUTH_INVALID_CREDENTIALS: 10,
  AUTH_MFA_REQUIRED: 11,
  FORBIDDEN: 12,
  SCOPE_INSUFFICIENT: 13,
  WORKSPACE_NOT_FOUND: 14,
  NOT_FOUND: 20,
  CONFLICT: 21,
  IDEMPOTENCY_MISMATCH: 22,
  DUPLICATE_CONTENT: 23,
  VALIDATION_FAILED: 30,
  CONTENT_INVALID: 31,
  MEDIA_INVALID: 32,
  MEDIA_TOO_LARGE: 33,
  UPLOAD_REJECTED: 34,
  SSRF_BLOCKED: 35,
  APPROVAL_REQUIRED: 40,
  POLICY_BLOCKED: 41,
  CADENCE_EXCEEDED: 42,
  CAPABILITY_UNSUPPORTED: 50,
  CAPABILITY_NOT_IMPLEMENTED: 51,
  CONNECTION_ACTION_REQUIRED: 52,
  RATE_LIMITED: 60,
  QUOTA_EXCEEDED: 61,
  ENTITLEMENT_REQUIRED: 62,
  TRIAL_EXPIRED: 63,
  PAYMENT_REQUIRED: 64,
  PROVIDER_TRANSIENT: 70,
  PROVIDER_PERMANENT: 71,
  PROVIDER_UNAVAILABLE: 72,
  AI_UNAVAILABLE: 80,
  AI_OUTPUT_INVALID: 81,
  INTERNAL: 90,
  UNKNOWN: EXIT_UNKNOWN,
} as const satisfies Record<ErrorCode, number>;

/** The exit code for one error code. */
export function exitCodeFor(code: ErrorCode): number {
  return EXIT_CODES[code];
}

/** Reverse lookup, so a wrapper script can be documented from one table. */
export function errorCodesForExit(exitCode: number): readonly ErrorCode[] {
  return (Object.keys(EXIT_CODES) as ErrorCode[]).filter(
    (code) => EXIT_CODES[code] === exitCode,
  );
}

/** True when trying the exact same command again could plausibly succeed. */
export function isRetryableExit(exitCode: number): boolean {
  return errorCodesForExit(exitCode).some((code) => {
    const error = new RelayError(ERROR_CODES[code]);
    return error.retryable;
  });
}
