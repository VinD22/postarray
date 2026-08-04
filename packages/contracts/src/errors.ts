import { z } from 'zod';

/**
 * The single error taxonomy for every surface. A `RelayError` carries a stable
 * machine code, an i18n message key, an HTTP status, a retry hint and a details
 * bag that is redacted before it can reach a log, a webhook or a client.
 */

export const ERROR_CODES = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_MFA_REQUIRED: 'AUTH_MFA_REQUIRED',
  FORBIDDEN: 'FORBIDDEN',
  SCOPE_INSUFFICIENT: 'SCOPE_INSUFFICIENT',
  WORKSPACE_NOT_FOUND: 'WORKSPACE_NOT_FOUND',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  IDEMPOTENCY_MISMATCH: 'IDEMPOTENCY_MISMATCH',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  ENTITLEMENT_REQUIRED: 'ENTITLEMENT_REQUIRED',
  TRIAL_EXPIRED: 'TRIAL_EXPIRED',
  PAYMENT_REQUIRED: 'PAYMENT_REQUIRED',
  CONNECTION_ACTION_REQUIRED: 'CONNECTION_ACTION_REQUIRED',
  CAPABILITY_UNSUPPORTED: 'CAPABILITY_UNSUPPORTED',
  CAPABILITY_NOT_IMPLEMENTED: 'CAPABILITY_NOT_IMPLEMENTED',
  CONTENT_INVALID: 'CONTENT_INVALID',
  DUPLICATE_CONTENT: 'DUPLICATE_CONTENT',
  CADENCE_EXCEEDED: 'CADENCE_EXCEEDED',
  POLICY_BLOCKED: 'POLICY_BLOCKED',
  APPROVAL_REQUIRED: 'APPROVAL_REQUIRED',
  PROVIDER_TRANSIENT: 'PROVIDER_TRANSIENT',
  PROVIDER_PERMANENT: 'PROVIDER_PERMANENT',
  PROVIDER_UNAVAILABLE: 'PROVIDER_UNAVAILABLE',
  MEDIA_INVALID: 'MEDIA_INVALID',
  MEDIA_TOO_LARGE: 'MEDIA_TOO_LARGE',
  SSRF_BLOCKED: 'SSRF_BLOCKED',
  UPLOAD_REJECTED: 'UPLOAD_REJECTED',
  AI_UNAVAILABLE: 'AI_UNAVAILABLE',
  AI_OUTPUT_INVALID: 'AI_OUTPUT_INVALID',
  INTERNAL: 'INTERNAL',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const errorCodeSchema = z.enum(
  Object.values(ERROR_CODES) as [ErrorCode, ...ErrorCode[]],
);

export const ERROR_STATUS: Readonly<Record<ErrorCode, number>> = {
  AUTH_REQUIRED: 401,
  AUTH_INVALID_CREDENTIALS: 401,
  AUTH_MFA_REQUIRED: 401,
  FORBIDDEN: 403,
  SCOPE_INSUFFICIENT: 403,
  WORKSPACE_NOT_FOUND: 404,
  NOT_FOUND: 404,
  CONFLICT: 409,
  IDEMPOTENCY_MISMATCH: 409,
  VALIDATION_FAILED: 422,
  RATE_LIMITED: 429,
  QUOTA_EXCEEDED: 429,
  ENTITLEMENT_REQUIRED: 402,
  TRIAL_EXPIRED: 402,
  PAYMENT_REQUIRED: 402,
  CONNECTION_ACTION_REQUIRED: 409,
  CAPABILITY_UNSUPPORTED: 422,
  CAPABILITY_NOT_IMPLEMENTED: 501,
  CONTENT_INVALID: 422,
  DUPLICATE_CONTENT: 409,
  CADENCE_EXCEEDED: 429,
  POLICY_BLOCKED: 403,
  APPROVAL_REQUIRED: 403,
  PROVIDER_TRANSIENT: 502,
  PROVIDER_PERMANENT: 502,
  PROVIDER_UNAVAILABLE: 503,
  MEDIA_INVALID: 422,
  MEDIA_TOO_LARGE: 413,
  SSRF_BLOCKED: 400,
  UPLOAD_REJECTED: 400,
  AI_UNAVAILABLE: 503,
  AI_OUTPUT_INVALID: 502,
  INTERNAL: 500,
  UNKNOWN: 500,
};

export const ERROR_RETRYABLE: Readonly<Record<ErrorCode, boolean>> = {
  AUTH_REQUIRED: false,
  AUTH_INVALID_CREDENTIALS: false,
  AUTH_MFA_REQUIRED: false,
  FORBIDDEN: false,
  SCOPE_INSUFFICIENT: false,
  WORKSPACE_NOT_FOUND: false,
  NOT_FOUND: false,
  CONFLICT: false,
  IDEMPOTENCY_MISMATCH: false,
  VALIDATION_FAILED: false,
  RATE_LIMITED: true,
  QUOTA_EXCEEDED: false,
  ENTITLEMENT_REQUIRED: false,
  TRIAL_EXPIRED: false,
  PAYMENT_REQUIRED: false,
  CONNECTION_ACTION_REQUIRED: false,
  CAPABILITY_UNSUPPORTED: false,
  CAPABILITY_NOT_IMPLEMENTED: false,
  CONTENT_INVALID: false,
  DUPLICATE_CONTENT: false,
  CADENCE_EXCEEDED: false,
  POLICY_BLOCKED: false,
  APPROVAL_REQUIRED: false,
  PROVIDER_TRANSIENT: true,
  PROVIDER_PERMANENT: false,
  PROVIDER_UNAVAILABLE: true,
  MEDIA_INVALID: false,
  MEDIA_TOO_LARGE: false,
  SSRF_BLOCKED: false,
  UPLOAD_REJECTED: false,
  AI_UNAVAILABLE: true,
  AI_OUTPUT_INVALID: true,
  INTERNAL: false,
  UNKNOWN: false,
};

export const PROBLEM_TYPE_NAMESPACE = 'urn:relay:error';

export const REDACTION_PLACEHOLDER = '[redacted]';
const REDACTED_KEY_PATTERN =
  /(token|secret|password|passphrase|authorization|cookie|api[-_]?key|credential|refresh|bearer|signature|private[-_]?key|access[-_]?key|session)/i;
const MAX_DETAIL_STRING_LENGTH = 512;
const MAX_DETAIL_DEPTH = 4;
const MAX_DETAIL_ARRAY_LENGTH = 20;

function redactValue(value: unknown, depth: number): unknown {
  if (value === null || typeof value === 'boolean' || typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    return value.length > MAX_DETAIL_STRING_LENGTH
      ? value.slice(0, MAX_DETAIL_STRING_LENGTH)
      : value;
  }
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (depth >= MAX_DETAIL_DEPTH) {
    return REDACTION_PLACEHOLDER;
  }
  if (Array.isArray(value)) {
    return value.slice(0, MAX_DETAIL_ARRAY_LENGTH).map((entry) => redactValue(entry, depth + 1));
  }
  if (typeof value === 'object') {
    const output: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      output[key] = REDACTED_KEY_PATTERN.test(key)
        ? REDACTION_PLACEHOLDER
        : redactValue(entry, depth + 1);
    }
    return output;
  }
  return REDACTION_PLACEHOLDER;
}

/** Strip secret-looking keys, truncate long strings and bound depth and width. */
export function redactDetails(details: Readonly<Record<string, unknown>>): Record<string, unknown> {
  const redacted = redactValue({ ...details }, 0);
  return typeof redacted === 'object' && redacted !== null && !Array.isArray(redacted)
    ? (redacted as Record<string, unknown>)
    : {};
}

export interface ProblemJson {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly code: ErrorCode;
  readonly messageKey: string;
  readonly retryable: boolean;
  readonly detail?: Record<string, unknown>;
  readonly instance?: string;
  readonly correlationId?: string;
}

export interface RelayErrorOptions {
  readonly messageKey?: string;
  readonly status?: number;
  readonly retryable?: boolean;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly correlationId?: string;
  readonly instance?: string;
  readonly cause?: unknown;
}

export function defaultMessageKey(code: ErrorCode): string {
  return `errors.${code.toLowerCase()}`;
}

/** The base error type. Never construct a bare `Error` on a product path. */
export class RelayError extends Error {
  readonly code: ErrorCode;
  readonly messageKey: string;
  readonly status: number;
  readonly retryable: boolean;
  readonly details: Readonly<Record<string, unknown>>;
  readonly correlationId: string | undefined;
  readonly instance: string | undefined;

  constructor(code: ErrorCode, options: RelayErrorOptions = {}) {
    super(code, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = 'RelayError';
    this.code = code;
    this.messageKey = options.messageKey ?? defaultMessageKey(code);
    this.status = options.status ?? ERROR_STATUS[code];
    this.retryable = options.retryable ?? ERROR_RETRYABLE[code];
    this.details = Object.freeze(redactDetails(options.details ?? {}));
    this.correlationId = options.correlationId;
    this.instance = options.instance;
  }

  /** RFC 9457 problem document. Human text is supplied by the i18n layer. */
  toProblemJson(): ProblemJson {
    const problem: ProblemJson = {
      type: `${PROBLEM_TYPE_NAMESPACE}:${this.code.toLowerCase()}`,
      title: this.code,
      status: this.status,
      code: this.code,
      messageKey: this.messageKey,
      retryable: this.retryable,
      ...(Object.keys(this.details).length > 0 ? { detail: { ...this.details } } : {}),
      ...(this.instance === undefined ? {} : { instance: this.instance }),
      ...(this.correlationId === undefined ? {} : { correlationId: this.correlationId }),
    };
    return problem;
  }

  toJSON(): ProblemJson {
    return this.toProblemJson();
  }

  static is(value: unknown): value is RelayError {
    return value instanceof RelayError;
  }

  /** Normalise anything thrown into a `RelayError` without leaking internals. */
  static fromUnknown(error: unknown, correlationId?: string): RelayError {
    if (error instanceof RelayError) {
      return error;
    }
    if (error instanceof z.ZodError) {
      return new ValidationFailedError({
        details: {
          issues: error.issues.slice(0, MAX_DETAIL_ARRAY_LENGTH).map((issue) => ({
            path: issue.path.map((segment) => String(segment)).join('.'),
            code: issue.code,
          })),
        },
        correlationId,
        cause: error,
      });
    }
    if (error instanceof Error) {
      return new InternalError({
        details: { name: error.name },
        correlationId,
        cause: error,
      });
    }
    return new RelayError(ERROR_CODES.UNKNOWN, {
      details: { valueType: typeof error },
      correlationId,
      cause: error,
    });
  }
}

export class AuthRequiredError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.AUTH_REQUIRED, options);
    this.name = 'AuthRequiredError';
  }
}

export class ForbiddenError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.FORBIDDEN, options);
    this.name = 'ForbiddenError';
  }
}

export class ScopeInsufficientError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.SCOPE_INSUFFICIENT, options);
    this.name = 'ScopeInsufficientError';
  }
}

export class NotFoundError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.NOT_FOUND, options);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.CONFLICT, options);
    this.name = 'ConflictError';
  }
}

export class IdempotencyMismatchError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.IDEMPOTENCY_MISMATCH, options);
    this.name = 'IdempotencyMismatchError';
  }
}

export class ValidationFailedError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.VALIDATION_FAILED, options);
    this.name = 'ValidationFailedError';
  }
}

export class RateLimitedError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.RATE_LIMITED, options);
    this.name = 'RateLimitedError';
  }
}

export class EntitlementRequiredError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.ENTITLEMENT_REQUIRED, options);
    this.name = 'EntitlementRequiredError';
  }
}

export class ConnectionActionRequiredError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.CONNECTION_ACTION_REQUIRED, options);
    this.name = 'ConnectionActionRequiredError';
  }
}

export class CapabilityUnsupportedError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.CAPABILITY_UNSUPPORTED, options);
    this.name = 'CapabilityUnsupportedError';
  }
}

export class CapabilityNotImplementedError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED, options);
    this.name = 'CapabilityNotImplementedError';
  }
}

export class ContentInvalidError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.CONTENT_INVALID, options);
    this.name = 'ContentInvalidError';
  }
}

export class PolicyBlockedError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.POLICY_BLOCKED, options);
    this.name = 'PolicyBlockedError';
  }
}

export class ApprovalRequiredError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.APPROVAL_REQUIRED, options);
    this.name = 'ApprovalRequiredError';
  }
}

export class ProviderTransientError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.PROVIDER_TRANSIENT, options);
    this.name = 'ProviderTransientError';
  }
}

export class ProviderPermanentError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.PROVIDER_PERMANENT, options);
    this.name = 'ProviderPermanentError';
  }
}

export class ProviderUnavailableError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.PROVIDER_UNAVAILABLE, options);
    this.name = 'ProviderUnavailableError';
  }
}

export class MediaInvalidError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.MEDIA_INVALID, options);
    this.name = 'MediaInvalidError';
  }
}

export class SsrfBlockedError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.SSRF_BLOCKED, options);
    this.name = 'SsrfBlockedError';
  }
}

export class AiOutputInvalidError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.AI_OUTPUT_INVALID, options);
    this.name = 'AiOutputInvalidError';
  }
}

export class InternalError extends RelayError {
  constructor(options: RelayErrorOptions = {}) {
    super(ERROR_CODES.INTERNAL, options);
    this.name = 'InternalError';
  }
}

export const problemJsonSchema = z
  .object({
    type: z.string(),
    title: z.string(),
    status: z.number().int(),
    code: errorCodeSchema,
    messageKey: z.string(),
    retryable: z.boolean(),
    detail: z.record(z.string(), z.unknown()).optional(),
    instance: z.string().optional(),
    correlationId: z.string().optional(),
  })
  .strict();
