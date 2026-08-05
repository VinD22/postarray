import { REDACTED } from './vault.js';

/**
 * Provider payload sanitizer.
 *
 * Some providers echo the bearer token back inside an error body, so nothing a
 * provider returns is stored or logged before it passes through here. This runs
 * before a response reaches `publish_attempts`, a log line, a webhook payload or
 * an Action Center message.
 *
 * Three passes: header and field names, known secret values supplied by the
 * caller, and token shaped substrings.
 */

const SECRET_KEY_PATTERN =
  /(token|secret|password|passphrase|authorization|auth|cookie|api[-_]?key|credential|refresh|bearer|signature|private[-_]?key|access[-_]?key|session|verifier|challenge|assertion|client[-_]?id)/i;

/** Header names never kept, even when the value looks harmless. */
export const FORBIDDEN_HEADERS: readonly string[] = [
  'authorization',
  'proxy-authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'x-access-token',
  'x-csrf-token',
  'dpop',
];

/** Response headers worth keeping for debugging and rate limit accounting. */
export const SAFE_HEADER_ALLOWLIST: readonly string[] = [
  'content-type',
  'content-length',
  'date',
  'retry-after',
  'x-request-id',
  'x-requestid',
  'request-id',
  'x-correlation-id',
  'x-rate-limit-limit',
  'x-rate-limit-remaining',
  'x-rate-limit-reset',
  'x-ratelimit-limit',
  'x-ratelimit-remaining',
  'x-ratelimit-reset',
  'ratelimit-limit',
  'ratelimit-remaining',
  'ratelimit-reset',
  'x-app-usage',
  'x-business-use-case-usage',
  'x-li-uuid',
  'x-goog-quota-user',
];

const TOKEN_SHAPES: readonly RegExp[] = [
  // Authorization scheme followed by anything non blank.
  /\b(bearer|basic|dpop|oauth)\s+[\w\-._~+/=]{8,}/gi,
  // JSON Web Token.
  /\beyJ[\w-]{6,}\.[\w-]{6,}\.[\w-]{6,}\b/g,
  // Vendor prefixed keys.
  /\b(sk|pk|rk|ghp|gho|xoxb|xoxp|AKIA)[-_][A-Za-z0-9]{12,}\b/g,
  // A long opaque run, which in a provider payload is a credential far more
  // often than it is an identifier.
  /\b[A-Za-z0-9\-._~+/]{40,}={0,2}\b/g,
  // Query string credentials.
  /([?&](access_token|refresh_token|id_token|code|client_secret|signature)=)[^&\s"']+/gi,
];

const MAX_STRING = 512;
const MAX_DEPTH = 6;
const MAX_ARRAY = 25;
const MAX_KEYS = 50;

export interface SanitizeOptions {
  /** Exact values to remove wherever they appear, whatever their shape. */
  readonly knownSecrets?: readonly string[];
  readonly maxStringLength?: number;
}

/** Remove token shapes and any caller supplied secret from a free text string. */
export function sanitizeText(value: string, options: SanitizeOptions = {}): string {
  let output = value;
  for (const secret of options.knownSecrets ?? []) {
    if (secret.length >= 6) {
      output = output.split(secret).join(REDACTED);
    }
  }
  for (const shape of TOKEN_SHAPES) {
    output = output.replace(shape, (match, ...groups: unknown[]) => {
      // The query string rule keeps its `?key=` prefix so the shape stays readable.
      const first = groups[0];
      return typeof first === 'string' && /[?&]/.test(first) ? `${first}${REDACTED}` : REDACTED;
    });
  }
  const limit = options.maxStringLength ?? MAX_STRING;
  return output.length > limit ? `${output.slice(0, limit)}...` : output;
}

function sanitizeValue(value: unknown, depth: number, options: SanitizeOptions): unknown {
  if (value === null || typeof value === 'boolean' || typeof value === 'number') {
    return value;
  }
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (typeof value === 'string') {
    return sanitizeText(value, options);
  }
  if (typeof value === 'function' || typeof value === 'symbol' || value === undefined) {
    return REDACTED;
  }
  if (depth >= MAX_DEPTH) {
    return REDACTED;
  }
  if (Array.isArray(value)) {
    return value.slice(0, MAX_ARRAY).map((entry) => sanitizeValue(entry, depth + 1, options));
  }
  if (value instanceof Error) {
    return { name: value.name, message: sanitizeText(value.message, options) };
  }
  const output: Record<string, unknown> = {};
  let count = 0;
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (count >= MAX_KEYS) {
      output['...'] = 'truncated';
      break;
    }
    count += 1;
    output[key] = SECRET_KEY_PATTERN.test(key)
      ? REDACTED
      : sanitizeValue(entry, depth + 1, options);
  }
  return output;
}

/**
 * Sanitize any provider response body into a shape safe to store in
 * `publish_attempts.sanitized_response` and to render on a receipt.
 */
export function sanitizeProviderPayload(
  body: unknown,
  options: SanitizeOptions = {},
): Record<string, unknown> {
  if (body === undefined || body === null) {
    return {};
  }
  if (typeof body === 'string') {
    return { raw: sanitizeText(body, options) };
  }
  const sanitized = sanitizeValue(body, 0, options);
  if (typeof sanitized === 'object' && sanitized !== null && !Array.isArray(sanitized)) {
    return sanitized as Record<string, unknown>;
  }
  return { value: sanitized };
}

/** Keep only allowlisted headers, and never an authorization style header. */
export function sanitizeHeaders(
  headers: Readonly<Record<string, string | readonly string[] | undefined>> | Headers,
  options: SanitizeOptions = {},
): Record<string, string> {
  const entries: [string, string][] = [];
  if (typeof Headers !== 'undefined' && headers instanceof Headers) {
    headers.forEach((value, key) => entries.push([key, value]));
  } else {
    for (const [key, value] of Object.entries(
      headers as Record<string, string | readonly string[] | undefined>,
    )) {
      if (value === undefined) continue;
      entries.push([key, Array.isArray(value) ? value.join(', ') : String(value)]);
    }
  }
  const output: Record<string, string> = {};
  for (const [rawKey, rawValue] of entries) {
    const key = rawKey.toLowerCase();
    if (FORBIDDEN_HEADERS.includes(key)) {
      continue;
    }
    if (!SAFE_HEADER_ALLOWLIST.includes(key)) {
      continue;
    }
    output[key] = sanitizeText(rawValue, options);
  }
  return output;
}

/** True when a serialized value still contains a secret. Used by tests. */
export function containsSecret(serialized: string, secret: string): boolean {
  return secret.length > 0 && serialized.includes(secret);
}
