/**
 * Reading a thrown `ApiError` without depending on its class identity.
 *
 * Every method on `@/lib/api` throws an error carrying the RelayError code, a
 * message key and a sanitized details object. This duck types that shape so a
 * component renders the real remediation sentence instead of a shrug, and so a
 * transport failure (fetch rejects with a TypeError when the network is gone)
 * is still classified correctly.
 */

export type ErrorKind =
  | 'permission'
  | 'rate-limit'
  | 'offline'
  | 'not-found'
  | 'conflict'
  | 'payment'
  | 'validation'
  | 'unknown';

export interface DescribedError {
  readonly kind: ErrorKind;
  /** Stable machine code, for example `SCOPE_INSUFFICIENT`. */
  readonly code: string;
  /** Catalog key for the message, when the API supplied one. */
  readonly messageKey: string | null;
  /** Sanitized detail values, safe to interpolate into a message. */
  readonly values: Readonly<Record<string, string | number>>;
  /** The scopes or roles the caller is missing, when the API named them. */
  readonly requirements: readonly string[];
  /** When a rate limit resets, as an ISO instant. */
  readonly resetAt: string | null;
  /** Seconds until a rate limited request may be repeated. */
  readonly retryAfterSeconds: number | null;
  readonly usedRequests: number | null;
  readonly limitRequests: number | null;
  /** A support reference the user can quote. Never an internal identifier. */
  readonly correlationId: string | null;
  /** True only when retrying cannot duplicate an external side effect. */
  readonly retrySafe: boolean;
}

const PERMISSION_CODES = new Set([
  'FORBIDDEN',
  'SCOPE_INSUFFICIENT',
  'AUTH_MFA_REQUIRED',
  'POLICY_BLOCKED',
]);
const RATE_LIMIT_CODES = new Set(['RATE_LIMITED', 'QUOTA_EXCEEDED', 'CADENCE_EXCEEDED']);
const PAYMENT_CODES = new Set(['PAYMENT_REQUIRED', 'TRIAL_EXPIRED', 'ENTITLEMENT_REQUIRED']);
const RETRY_SAFE_CODES = new Set([
  'PROVIDER_TRANSIENT',
  'PROVIDER_UNAVAILABLE',
  'RATE_LIMITED',
  'INTERNAL',
  'UNKNOWN',
  'AI_UNAVAILABLE',
]);

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function text(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function count(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function stringList(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === 'string');
}

function scalarValues(details: Record<string, unknown>): Record<string, string | number> {
  const values: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(details)) {
    if (typeof value === 'string' || typeof value === 'number') {
      values[key] = value;
    }
  }
  return values;
}

function kindFor(code: string, offline: boolean): ErrorKind {
  if (offline) {
    return 'offline';
  }
  if (PERMISSION_CODES.has(code)) {
    return 'permission';
  }
  if (RATE_LIMIT_CODES.has(code)) {
    return 'rate-limit';
  }
  if (PAYMENT_CODES.has(code)) {
    return 'payment';
  }
  if (code === 'NOT_FOUND' || code === 'WORKSPACE_NOT_FOUND') {
    return 'not-found';
  }
  if (code === 'CONFLICT' || code === 'IDEMPOTENCY_MISMATCH') {
    return 'conflict';
  }
  if (code === 'VALIDATION_FAILED' || code === 'CONTENT_INVALID') {
    return 'validation';
  }
  return 'unknown';
}

/**
 * True when the failure is the browser having no network at all.
 *
 * `ApiError.offline()` already classifies this, and it surfaces as
 * `messageCode: 'offline'`. The other two checks cover a rejection that never
 * reached the client's own error mapping.
 */
function looksOffline(error: unknown): boolean {
  const shape = record(error);
  if (shape.messageCode === 'offline') {
    return true;
  }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return true;
  }
  return error instanceof TypeError;
}

export function describeApiError(error: unknown): DescribedError {
  const shape = record(error);
  const details = record(shape.details);
  const offline = looksOffline(error);
  const code = text(shape.code) ?? (offline ? 'OFFLINE' : 'UNKNOWN');

  const retryAfterSeconds = count(shape.retryAfterSeconds);

  return {
    kind: kindFor(code, offline),
    code,
    messageKey: text(shape.messageKey),
    values: scalarValues(details),
    requirements: [...stringList(details.requiredScopes), ...stringList(details.requiredRoles)],
    resetAt: text(details.resetAt),
    retryAfterSeconds,
    usedRequests: count(details.used),
    limitRequests: count(details.limit),
    correlationId: text(shape.correlationId) ?? text(details.correlationId),
    retrySafe:
      offline ||
      (typeof shape.retryable === 'boolean' ? shape.retryable : RETRY_SAFE_CODES.has(code)),
  };
}
