/**
 * The one error type every component renders.
 *
 * An `ApiError` always knows three things: the machine code, the catalog key
 * for the sentence a person reads, and the values that sentence interpolates.
 * A component therefore never falls back to "Something went wrong": it renders
 * `error.<code>.message` plus `error.<code>.action`, which always exist.
 */

import { ERROR_CODES, type ErrorCode, type ProblemJson } from '@relay/contracts';

/** The finer-grained code the i18n catalog keys on. */
export type MessageCode = string;

/**
 * Contracts carries one broad code per HTTP behaviour. The catalog carries a
 * finer sentence per situation. The API sends the finer key in `messageKey`;
 * this map is the floor when it does not.
 */
const FALLBACK_MESSAGE_CODE: Readonly<Record<ErrorCode, MessageCode>> = {
  AUTH_REQUIRED: 'unauthenticated',
  AUTH_INVALID_CREDENTIALS: 'unauthenticated',
  AUTH_MFA_REQUIRED: 'mfa_required',
  FORBIDDEN: 'forbidden',
  SCOPE_INSUFFICIENT: 'insufficient_scope',
  WORKSPACE_NOT_FOUND: 'workspace_not_found',
  NOT_FOUND: 'not_found',
  CONFLICT: 'conflict',
  IDEMPOTENCY_MISMATCH: 'idempotency_key_reused',
  VALIDATION_FAILED: 'validation_failed',
  RATE_LIMITED: 'rate_limited',
  QUOTA_EXCEEDED: 'quota_exceeded',
  ENTITLEMENT_REQUIRED: 'entitlement_missing',
  TRIAL_EXPIRED: 'trial_expired',
  PAYMENT_REQUIRED: 'payment_required',
  CONNECTION_ACTION_REQUIRED: 'user_action_required',
  CAPABILITY_UNSUPPORTED: 'capability_unsupported',
  CAPABILITY_NOT_IMPLEMENTED: 'capability_not_implemented',
  CONTENT_INVALID: 'content_invalid',
  DUPLICATE_CONTENT: 'duplicate_content',
  CADENCE_EXCEEDED: 'cadence_limit_reached',
  POLICY_BLOCKED: 'forbidden',
  APPROVAL_REQUIRED: 'approval_required',
  PROVIDER_TRANSIENT: 'provider_transient',
  PROVIDER_PERMANENT: 'provider_permanent',
  PROVIDER_UNAVAILABLE: 'provider_unavailable',
  MEDIA_INVALID: 'media_invalid',
  MEDIA_TOO_LARGE: 'media_too_large',
  SSRF_BLOCKED: 'request_invalid',
  UPLOAD_REJECTED: 'media_invalid',
  AI_UNAVAILABLE: 'ai_unavailable',
  AI_OUTPUT_INVALID: 'ai_output_invalid',
  INTERNAL: 'internal',
  UNKNOWN: 'unknown',
};

/**
 * `messageKey` may arrive as `errors.rate_limited`, `error.rate_limited` or the
 * bare code. Reduce all three to the bare code the catalog uses.
 */
function normalizeMessageCode(messageKey: string | undefined, code: ErrorCode): MessageCode {
  if (!messageKey) {
    return FALLBACK_MESSAGE_CODE[code];
  }
  const bare = messageKey.replace(/^errors?\./, '').replace(/\.(message|action)$/, '');
  return bare.length > 0 ? bare : FALLBACK_MESSAGE_CODE[code];
}

/** Values a details bag may safely carry into an ICU message. */
export type ErrorDetailValue = string | number | boolean | null;

export interface ApiErrorInit {
  readonly code: ErrorCode;
  readonly status: number;
  readonly messageCode: MessageCode;
  readonly retryable: boolean;
  readonly details: Readonly<Record<string, unknown>>;
  readonly correlationId: string | null;
  /** Seconds until a rate-limited request may be repeated. */
  readonly retryAfterSeconds: number | null;
}

export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly messageCode: MessageCode;
  readonly retryable: boolean;
  readonly details: Readonly<Record<string, unknown>>;
  readonly correlationId: string | null;
  readonly retryAfterSeconds: number | null;

  constructor(init: ApiErrorInit) {
    super(`${init.code} (${init.status})`);
    this.name = 'ApiError';
    this.code = init.code;
    this.status = init.status;
    this.messageCode = init.messageCode;
    this.retryable = init.retryable;
    this.details = init.details;
    this.correlationId = init.correlationId;
    this.retryAfterSeconds = init.retryAfterSeconds;
  }

  /** `error.connection_expired.message` */
  get messageKey(): string {
    return `error.${this.messageCode}.message`;
  }

  /** `error.connection_expired.action` */
  get actionKey(): string {
    return `error.${this.messageCode}.action`;
  }

  /** Only the scalar details, safe to hand to an ICU formatter. */
  get messageValues(): Readonly<Record<string, string | number>> {
    const values: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(this.details)) {
      if (typeof value === 'string' || typeof value === 'number') {
        values[key] = value;
      }
    }
    return values;
  }

  /** True when the user needs to sign in again rather than retry. */
  get isAuthentication(): boolean {
    return (
      this.code === ERROR_CODES.AUTH_REQUIRED ||
      this.code === ERROR_CODES.AUTH_INVALID_CREDENTIALS ||
      this.code === ERROR_CODES.AUTH_MFA_REQUIRED
    );
  }

  /** True when the user's role or credential is the blocker, not the request. */
  get isAuthorization(): boolean {
    return (
      this.code === ERROR_CODES.FORBIDDEN ||
      this.code === ERROR_CODES.SCOPE_INSUFFICIENT ||
      this.code === ERROR_CODES.POLICY_BLOCKED
    );
  }

  get isRateLimited(): boolean {
    return this.code === ERROR_CODES.RATE_LIMITED || this.code === ERROR_CODES.CADENCE_EXCEEDED;
  }

  get isOffline(): boolean {
    return this.code === ERROR_CODES.UNKNOWN && this.messageCode === 'offline';
  }

  static is(value: unknown): value is ApiError {
    return value instanceof ApiError;
  }

  /** Build from an RFC 9457 problem document. */
  static fromProblem(
    problem: Partial<ProblemJson>,
    status: number,
    correlationId: string | null,
    retryAfterSeconds: number | null,
  ): ApiError {
    const code = (problem.code ?? ERROR_CODES.UNKNOWN) as ErrorCode;
    return new ApiError({
      code,
      status: problem.status ?? status,
      messageCode: normalizeMessageCode(problem.messageKey, code),
      retryable: problem.retryable ?? false,
      details: problem.detail ?? {},
      correlationId: problem.correlationId ?? correlationId,
      retryAfterSeconds,
    });
  }

  /** The browser could not reach the API at all. */
  static offline(correlationId: string | null): ApiError {
    return new ApiError({
      code: ERROR_CODES.UNKNOWN,
      status: 0,
      messageCode: 'offline',
      retryable: true,
      details: {},
      correlationId,
      retryAfterSeconds: null,
    });
  }

  /** The request failed before it reached the API for a reason that is not offline. */
  static network(correlationId: string | null): ApiError {
    return new ApiError({
      code: ERROR_CODES.UNKNOWN,
      status: 0,
      messageCode: 'network_unreachable',
      retryable: true,
      details: {},
      correlationId,
      retryAfterSeconds: null,
    });
  }

  /** Anything thrown that is not already an `ApiError`. */
  static fromUnknown(value: unknown, correlationId: string | null): ApiError {
    if (ApiError.is(value)) {
      return value;
    }
    return new ApiError({
      code: ERROR_CODES.UNKNOWN,
      status: 0,
      messageCode: 'unknown',
      retryable: false,
      details: {},
      correlationId,
      retryAfterSeconds: null,
    });
  }
}
