/**
 * Redaction.
 *
 * Nothing in Relay logs, traces, receipts or support tooling may contain a
 * token. `redact` deep clones a value, masks any key that looks like a secret,
 * and masks anything inside a string that looks like a JWT or a bearer token.
 *
 * This runs before serialization, not after, so a secret never reaches a
 * transport buffer in the first place.
 */

export const REDACTION_MASK = '[redacted]';

/** Key name patterns that always mask their value. */
export const REDACTED_KEYS: readonly RegExp[] = [
  /token/i,
  /secret/i,
  /(^|[^a-z])key([^a-z]|$)/i,
  /password/i,
  /passwd/i,
  /authorization/i,
  /\bauth\b/i,
  /cookie/i,
  /credential/i,
  /refresh/i,
  /bearer/i,
  /api[-_]?key/i,
  /jwt/i,
  /signature/i,
  /private/i,
  /session/i,
  /otp/i,
  /pin\b/i,
];

/** Key names that match a pattern but are safe and useful to keep. */
export const REDACTION_ALLOWLIST: readonly RegExp[] = [
  /^key_?version$/i,
  /^keys$/i,
  /^token_?type$/i,
  /^refresh_?after$/i,
  /^refresh_?at$/i,
  /^idempotency_?key$/i,
  /^partition_?key$/i,
  /^cache_?key$/i,
  /^public_?key_?id$/i,
  /^kms_?key_?id$/i,
  /^session_?id$/i,
];

const JWT_PATTERN = /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{4,}(?:\.[A-Za-z0-9_-]*)?/g;
const BEARER_PATTERN = /\b(bearer|basic|token)\s+[A-Za-z0-9._~+/=-]{8,}/gi;
// `authorization` is deliberately absent: BEARER_PATTERN already covers
// `Authorization: Bearer <credential>` and would otherwise mask the scheme name
// instead of the credential.
const AUTH_ASSIGNMENT_PATTERN =
  /\b((?:access|refresh|id|api|auth|client)[_-]?(?:token|secret|key)|password)\b(\s*[=:]\s*)("?)[^\s"'&,;]{6,}\3/gi;
const URL_CREDENTIALS_PATTERN = /\b([a-z][a-z0-9+.-]*:\/\/)([^/\s:@]+):([^/\s@]+)@/gi;
const QUERY_SECRET_PATTERN =
  /([?&](?:access_token|refresh_token|id_token|api_key|apikey|key|token|signature|code|state)=)[^&\s]+/gi;

/**
 * `apiKey`, `api_key`, `API-KEY` and `ApiKey` are the same field. Normalizing
 * camel case into snake case before matching keeps the patterns readable and
 * stops `monkey` from matching `key`.
 */
export function normalizeKeyName(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-.\s]+/g, '_')
    .toLowerCase();
}

export function isRedactedKey(key: string): boolean {
  const normalized = normalizeKeyName(key);
  if (REDACTION_ALLOWLIST.some((pattern) => pattern.test(normalized))) return false;
  return REDACTED_KEYS.some((pattern) => pattern.test(normalized));
}

/** Mask secret-looking substrings inside free text. */
export function redactString(value: string): string {
  return value
    .replace(URL_CREDENTIALS_PATTERN, (_match, scheme: string, user: string) =>
      `${scheme}${user}:${REDACTION_MASK}@`,
    )
    .replace(QUERY_SECRET_PATTERN, (_match, prefix: string) => `${prefix}${REDACTION_MASK}`)
    .replace(JWT_PATTERN, REDACTION_MASK)
    .replace(BEARER_PATTERN, (_match, scheme: string) => `${scheme} ${REDACTION_MASK}`)
    .replace(
      AUTH_ASSIGNMENT_PATTERN,
      (_match, name: string, separator: string, quote: string) =>
        `${name}${separator}${quote}${REDACTION_MASK}${quote}`,
    );
}

export interface RedactOptions {
  /** Maximum object depth to walk. Deeper values become "[depth exceeded]". */
  readonly maxDepth?: number;
  /** Extra key patterns for a specific call site. */
  readonly extraKeys?: readonly RegExp[];
}

const DEFAULT_MAX_DEPTH = 12;
const DEPTH_EXCEEDED = '[depth exceeded]';
const CIRCULAR = '[circular]';

function shouldMaskKey(key: string, extra: readonly RegExp[]): boolean {
  if (extra.some((pattern) => pattern.test(key))) return true;
  return isRedactedKey(key);
}

function redactError(error: Error, walk: (value: unknown) => unknown): Record<string, unknown> {
  const output: Record<string, unknown> = {
    name: error.name,
    message: redactString(error.message),
  };
  if (typeof error.stack === 'string') output['stack'] = redactString(error.stack);
  for (const key of Object.keys(error)) {
    if (key === 'name' || key === 'message' || key === 'stack') continue;
    const value = (error as unknown as Record<string, unknown>)[key];
    output[key] = shouldMaskKey(key, []) ? REDACTION_MASK : walk(value);
  }
  if (error.cause !== undefined) output['cause'] = walk(error.cause);
  return output;
}

/**
 * Deep clone `value` with secrets masked. The result is always safe to
 * serialize: no getters are invoked twice, cycles become "[circular]".
 */
export function redact<T>(value: T, options: RedactOptions = {}): unknown {
  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
  const extra = options.extraKeys ?? [];
  const seen = new WeakSet<object>();

  const walk = (input: unknown, depth: number): unknown => {
    if (input === null || input === undefined) return input;
    if (typeof input === 'string') return redactString(input);
    if (typeof input === 'number' || typeof input === 'boolean' || typeof input === 'bigint') {
      return input;
    }
    if (typeof input === 'function' || typeof input === 'symbol') return undefined;
    if (depth > maxDepth) return DEPTH_EXCEEDED;

    if (input instanceof Date) return input.toISOString();
    if (input instanceof RegExp) return input.source;
    if (input instanceof URL) return redactString(input.toString());
    if (input instanceof Error) {
      if (seen.has(input)) return CIRCULAR;
      seen.add(input);
      return redactError(input, (nested) => walk(nested, depth + 1));
    }

    if (typeof input === 'object') {
      if (seen.has(input)) return CIRCULAR;
      seen.add(input);

      if (Array.isArray(input)) {
        return input.map((entry) => walk(entry, depth + 1));
      }
      if (input instanceof Set) {
        return [...input].map((entry) => walk(entry, depth + 1));
      }
      if (input instanceof Map) {
        const output: Record<string, unknown> = {};
        for (const [key, entry] of input) {
          const name = String(key);
          output[name] = shouldMaskKey(name, extra)
            ? REDACTION_MASK
            : walk(entry, depth + 1);
        }
        return output;
      }
      if (ArrayBuffer.isView(input) || input instanceof ArrayBuffer) {
        return REDACTION_MASK;
      }

      const output: Record<string, unknown> = {};
      for (const [key, entry] of Object.entries(input as Record<string, unknown>)) {
        if (entry === undefined) continue;
        output[key] = shouldMaskKey(key, extra) ? REDACTION_MASK : walk(entry, depth + 1);
      }
      return output;
    }

    return undefined;
  };

  return walk(value, 0);
}

/** Convenience wrapper for log payloads, which are always plain records. */
export function redactRecord(
  value: Record<string, unknown>,
  options?: RedactOptions,
): Record<string, unknown> {
  const result = redact(value, options);
  return typeof result === 'object' && result !== null && !Array.isArray(result)
    ? (result as Record<string, unknown>)
    : {};
}
