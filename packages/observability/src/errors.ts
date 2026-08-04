import { redactRecord, redactString } from '@relay/config';
import type { ErrorClass } from '@relay/contracts';

import { contextFields } from './context.js';
import { getRootLogger } from './logger.js';

/**
 * Error reporting and the provider error taxonomy.
 *
 * `captureException` always logs and additionally forwards to Sentry when a DSN
 * is configured. `classifyProviderError` turns a provider response into one of
 * the six error classes the product reasons about, using a per provider
 * override table on top of the generic HTTP rules.
 *
 * Only `TRANSIENT_PROVIDER` is safe to retry automatically.
 */

const USER_ACTION_REQUIRED: ErrorClass = 'USER_ACTION_REQUIRED';
const CONTENT_INVALID: ErrorClass = 'CONTENT_INVALID';
const TRANSIENT_PROVIDER: ErrorClass = 'TRANSIENT_PROVIDER';
const PERMANENT_PROVIDER: ErrorClass = 'PERMANENT_PROVIDER';
const INTERNAL: ErrorClass = 'INTERNAL';
const UNKNOWN: ErrorClass = 'UNKNOWN';

export const RETRYABLE_ERROR_CLASSES: readonly ErrorClass[] = [TRANSIENT_PROVIDER];

export function isRetryableErrorClass(errorClass: ErrorClass): boolean {
  return RETRYABLE_ERROR_CLASSES.includes(errorClass);
}

export interface ProviderErrorInput {
  /** HTTP status, when the call reached the provider at all. */
  readonly status?: number;
  /** Parsed response body, raw text, or a thrown error. */
  readonly body?: unknown;
  /** Connector key: x, linkedin, instagram, facebook, threads, youtube, tiktok, bluesky, fake. */
  readonly provider?: string;
  /** Transport level code such as ECONNRESET or ETIMEDOUT. */
  readonly code?: string;
}

interface ProviderErrorFacts {
  readonly status: number | undefined;
  readonly text: string;
  readonly code: string | undefined;
  readonly subcode: string | undefined;
  readonly reason: string | undefined;
  readonly transientFlag: boolean;
  readonly transportCode: string | undefined;
  readonly internal: boolean;
}

const TRANSPORT_CODES = new Set([
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'EPIPE',
  'ECONNABORTED',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_HEADERS_TIMEOUT',
  'UND_ERR_SOCKET',
  'ABORT_ERR',
]);

const MAX_TEXT = 4000;

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function readString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim() !== '') return value.trim();
  if (typeof value === 'number') return String(value);
  return undefined;
}

function bodyText(body: unknown): string {
  if (body === undefined || body === null) return '';
  if (typeof body === 'string') return body.slice(0, MAX_TEXT).toLowerCase();
  if (body instanceof Error) return `${body.name}: ${body.message}`.slice(0, MAX_TEXT).toLowerCase();
  try {
    return JSON.stringify(body).slice(0, MAX_TEXT).toLowerCase();
  } catch {
    return String(body).slice(0, MAX_TEXT).toLowerCase();
  }
}

/**
 * Pull the few fields that actually carry meaning out of the many shapes
 * providers use: `{error:{code}}`, `{error:"slug"}`, `{errors:[{reason}]}`,
 * `{serviceErrorCode}`, `{error_code}`.
 */
function readFacts(input: ProviderErrorInput): ProviderErrorFacts {
  const record = asRecord(input.body);
  const errorNode = record === undefined ? undefined : asRecord(record['error']);
  const errorsArray = record !== undefined && Array.isArray(record['errors']) ? record['errors'] : [];
  const firstError = asRecord(errorsArray[0]);
  const errorString = record === undefined ? undefined : readString(record['error']);

  const code =
    (errorNode === undefined ? undefined : readString(errorNode['code'])) ??
    (record === undefined ? undefined : readString(record['code'])) ??
    (record === undefined ? undefined : readString(record['error_code'])) ??
    (record === undefined ? undefined : readString(record['serviceErrorCode'])) ??
    (firstError === undefined ? undefined : readString(firstError['code'])) ??
    errorString;

  const subcode =
    (errorNode === undefined ? undefined : readString(errorNode['error_subcode'])) ??
    (record === undefined ? undefined : readString(record['error_subcode'])) ??
    (errorNode === undefined ? undefined : readString(errorNode['subcode']));

  const reason =
    (firstError === undefined ? undefined : readString(firstError['reason'])) ??
    (errorNode === undefined ? undefined : readString(errorNode['reason'])) ??
    (errorNode === undefined ? undefined : readString(errorNode['status'])) ??
    (record === undefined ? undefined : readString(record['reason']));

  const transientFlag =
    errorNode !== undefined && errorNode['is_transient'] === true;

  const transportCode =
    input.code ??
    (input.body instanceof Error
      ? readString((input.body as unknown as Record<string, unknown>)['code'])
      : undefined);

  const internal =
    input.body instanceof TypeError ||
    input.body instanceof RangeError ||
    input.body instanceof SyntaxError ||
    input.body instanceof ReferenceError;

  return {
    status: input.status,
    text: bodyText(input.body),
    code: code?.toLowerCase(),
    subcode,
    reason: reason?.toLowerCase(),
    transientFlag,
    transportCode,
    internal,
  };
}

const has = (text: string, ...needles: readonly string[]): boolean =>
  needles.some((needle) => text.includes(needle));

type ProviderClassifier = (facts: ProviderErrorFacts) => ErrorClass | undefined;

const META_RATE_LIMIT_CODES = new Set([
  '4',
  '17',
  '32',
  '341',
  '613',
  '80001',
  '80002',
  '80003',
  '80004',
  '80005',
  '80006',
  '80007',
]);
const META_AUTH_CODES = new Set(['102', '190', '458', '459', '460', '463', '464', '467']);
const META_PERMISSION_CODES = new Set(['3', '10', '200', '294', '299']);

const classifyMeta: ProviderClassifier = (facts) => {
  const code = facts.code;
  if (facts.transientFlag) return TRANSIENT_PROVIDER;
  if (code !== undefined) {
    if (META_AUTH_CODES.has(code)) return USER_ACTION_REQUIRED;
    if (META_PERMISSION_CODES.has(code)) return USER_ACTION_REQUIRED;
    if (META_RATE_LIMIT_CODES.has(code)) return TRANSIENT_PROVIDER;
    if (code === '1' || code === '2') return TRANSIENT_PROVIDER;
    if (code === '368') return PERMANENT_PROVIDER;
    if (code === '100') {
      if (facts.subcode !== undefined && facts.subcode.startsWith('33')) {
        return USER_ACTION_REQUIRED;
      }
      return CONTENT_INVALID;
    }
    if (code === '9004' || code === '9007') return CONTENT_INVALID;
  }
  if (has(facts.text, 'media upload has failed', 'aspect ratio', 'unsupported format')) {
    return CONTENT_INVALID;
  }
  return undefined;
};

const classifyX: ProviderClassifier = (facts) => {
  if (has(facts.text, 'duplicate content', 'status is a duplicate')) return CONTENT_INVALID;
  if (has(facts.text, 'client-not-enrolled', 'client forbidden', 'not permitted to access')) {
    return USER_ACTION_REQUIRED;
  }
  if (has(facts.text, 'unsupported-authentication', 'unauthorized_client')) {
    return USER_ACTION_REQUIRED;
  }
  if (facts.status === 402 || has(facts.text, 'usage-capped', 'payment required')) {
    return USER_ACTION_REQUIRED;
  }
  if (facts.status === 403 && has(facts.text, 'suspended', 'restricted')) {
    return PERMANENT_PROVIDER;
  }
  return undefined;
};

const classifyLinkedIn: ProviderClassifier = (facts) => {
  if (has(facts.text, 'revoked_access_token', 'expired_access_token', 'invalid_access_token')) {
    return USER_ACTION_REQUIRED;
  }
  if (facts.code === '65600' || facts.code === '65601' || facts.code === '65604') {
    return USER_ACTION_REQUIRED;
  }
  if (has(facts.text, 'access_denied', 'not enough permissions', 'member does not have permission')) {
    return USER_ACTION_REQUIRED;
  }
  if (facts.status === 422) return CONTENT_INVALID;
  if (has(facts.text, 'duplicate', 'content is not valid')) return CONTENT_INVALID;
  return undefined;
};

const GOOGLE_TRANSIENT_REASONS = new Set([
  'quotaexceeded',
  'ratelimitexceeded',
  'userratelimitexceeded',
  'backenderror',
  'uploadlimitexceeded',
  'servicererror',
  'internalerror',
]);
const GOOGLE_USER_ACTION_REASONS = new Set([
  'forbidden',
  'youtubesignuprequired',
  'authenticatedusernotchannelowner',
  'insufficientpermissions',
  'accountclosed',
  'accountsuspended',
  'unauthorized',
  'authenticationrequired',
]);
const GOOGLE_CONTENT_REASONS = new Set([
  'invalidvideometadata',
  'invalidtitle',
  'invaliddescription',
  'invalidtags',
  'invalidcategoryid',
  'invalidfilename',
  'mediabodyrequired',
  'invalidrecordingdetails',
  'failedprecondition',
]);

const classifyGoogle: ProviderClassifier = (facts) => {
  const reason = facts.reason;
  if (reason !== undefined) {
    if (GOOGLE_TRANSIENT_REASONS.has(reason)) return TRANSIENT_PROVIDER;
    if (GOOGLE_USER_ACTION_REASONS.has(reason)) return USER_ACTION_REQUIRED;
    if (GOOGLE_CONTENT_REASONS.has(reason)) return CONTENT_INVALID;
  }
  if (has(facts.text, 'quotaexceeded', 'ratelimitexceeded')) return TRANSIENT_PROVIDER;
  if (has(facts.text, 'youtubesignuprequired', 'authenticatedusernotchannelowner')) {
    return USER_ACTION_REQUIRED;
  }
  if (has(facts.text, 'invalid_grant', 'token has been expired or revoked')) {
    return USER_ACTION_REQUIRED;
  }
  return undefined;
};

const TIKTOK_USER_ACTION_CODES = new Set([
  'access_token_invalid',
  'scope_not_authorized',
  'scope_permission_missed',
  'unaudited_client_can_only_post_to_private_accounts',
  'user_has_no_permission',
]);
const TIKTOK_CONTENT_CODES = new Set([
  'file_format_check_failed',
  'duration_check_failed',
  'frame_rate_check_failed',
  'picture_size_check_failed',
  'video_pull_failed',
  'photo_pull_failed',
  'invalid_file_upload',
  'invalid_params',
]);

const classifyTikTok: ProviderClassifier = (facts) => {
  const code = facts.code;
  if (code !== undefined) {
    if (TIKTOK_USER_ACTION_CODES.has(code)) return USER_ACTION_REQUIRED;
    if (TIKTOK_CONTENT_CODES.has(code)) return CONTENT_INVALID;
    if (code === 'spam_risk_user_banned_from_posting') return PERMANENT_PROVIDER;
    if (code.startsWith('spam_risk') || code === 'rate_limit_exceeded') return TRANSIENT_PROVIDER;
    if (code === 'internal_error' || code === 'server_error') return TRANSIENT_PROVIDER;
    if (code === 'ok') return UNKNOWN;
  }
  return undefined;
};

const classifyBluesky: ProviderClassifier = (facts) => {
  const code = facts.code;
  if (code !== undefined) {
    if (['expiredtoken', 'invalidtoken', 'authenticationrequired', 'authrequired'].includes(code)) {
      return USER_ACTION_REQUIRED;
    }
    if (code === 'ratelimitexceeded') return TRANSIENT_PROVIDER;
    if (code === 'upstreamfailure' || code === 'notenoughresources' || code === 'upstreamtimeout') {
      return TRANSIENT_PROVIDER;
    }
    if (code === 'invalidrequest' || code === 'blobtoolarge' || code === 'invalidmimetype') {
      return CONTENT_INVALID;
    }
    if (code === 'accounttakedown' || code === 'accountdeactivated') return PERMANENT_PROVIDER;
  }
  return undefined;
};

/** The provider override table. A provider may only refine the generic rules. */
export const PROVIDER_CLASSIFIERS: Readonly<Record<string, ProviderClassifier>> = {
  x: classifyX,
  linkedin: classifyLinkedIn,
  instagram: classifyMeta,
  facebook: classifyMeta,
  threads: classifyMeta,
  youtube: classifyGoogle,
  google: classifyGoogle,
  tiktok: classifyTikTok,
  bluesky: classifyBluesky,
};

function classifyByStatus(facts: ProviderErrorFacts): ErrorClass {
  const status = facts.status;
  if (status === undefined) {
    if (facts.transportCode !== undefined && TRANSPORT_CODES.has(facts.transportCode)) {
      return TRANSIENT_PROVIDER;
    }
    if (has(facts.text, 'timeout', 'socket hang up', 'network error')) return TRANSIENT_PROVIDER;
    return UNKNOWN;
  }

  if (status >= 500) return TRANSIENT_PROVIDER;
  if (status === 429 || status === 408 || status === 425) return TRANSIENT_PROVIDER;
  if (status === 401) return USER_ACTION_REQUIRED;
  if (status === 402) return USER_ACTION_REQUIRED;
  if (status === 403) {
    if (has(facts.text, 'rate limit', 'quota', 'too many requests')) return TRANSIENT_PROVIDER;
    if (has(facts.text, 'suspended', 'banned', 'permanently disabled', 'account restricted')) {
      return PERMANENT_PROVIDER;
    }
    return USER_ACTION_REQUIRED;
  }
  if (status === 404 || status === 410) return PERMANENT_PROVIDER;
  if (status === 409) return CONTENT_INVALID;
  if (status === 413 || status === 415 || status === 422) return CONTENT_INVALID;
  if (status === 400) {
    if (
      has(
        facts.text,
        'invalid_grant',
        'invalid_token',
        'expired',
        'revoked',
        'unauthorized',
        'reauthenticate',
      )
    ) {
      return USER_ACTION_REQUIRED;
    }
    return CONTENT_INVALID;
  }
  if (status >= 200 && status < 300) return UNKNOWN;
  return UNKNOWN;
}

/**
 * Classify a provider failure.
 *
 * ```ts
 * classifyProviderError({ status: 429, provider: 'x', body: {} });
 * // 'TRANSIENT_PROVIDER'
 * ```
 */
export function classifyProviderError(input: ProviderErrorInput): ErrorClass {
  const facts = readFacts(input);
  if (facts.internal) return INTERNAL;

  const provider = input.provider?.toLowerCase();
  if (provider !== undefined) {
    const override = PROVIDER_CLASSIFIERS[provider];
    const classified = override?.(facts);
    if (classified !== undefined) return classified;
  }

  return classifyByStatus(facts);
}

export interface ErrorReportingOptions {
  readonly dsn?: string;
  readonly environment?: string;
  readonly release?: string;
  readonly serviceName?: string;
  readonly tracesSampleRate?: number;
}

interface SentryLike {
  init(options: Record<string, unknown>): void;
  captureException(error: unknown, hint?: Record<string, unknown>): string;
  flush(timeout?: number): Promise<boolean>;
}

let sentry: SentryLike | undefined;

export function isErrorReportingEnabled(): boolean {
  return sentry !== undefined;
}

/**
 * Initialise Sentry when a DSN is configured. Returns false otherwise, which is
 * the normal local development state: errors are still logged.
 */
export async function initErrorReporting(options: ErrorReportingOptions = {}): Promise<boolean> {
  if (sentry !== undefined) return true;
  const dsn = options.dsn ?? process.env['SENTRY_DSN'];
  if (dsn === undefined || dsn.trim() === '') return false;

  try {
    const module = (await import('@sentry/node')) as unknown as SentryLike;
    module.init({
      dsn,
      environment: options.environment ?? process.env['NODE_ENV'] ?? 'development',
      release: options.release,
      serverName: options.serviceName,
      tracesSampleRate: options.tracesSampleRate ?? 0,
      // Payload scrubbing happens here as well as in the logger, because a
      // breadcrumb can carry a request body we never logged.
      beforeSend: (event: Record<string, unknown>) => redactRecord(event),
      beforeBreadcrumb: (breadcrumb: Record<string, unknown>) => redactRecord(breadcrumb),
    });
    sentry = module;
    return true;
  } catch (error) {
    getRootLogger().warn({ err: error, component: 'errors' }, 'error_reporting.init_failed');
    return false;
  }
}

export async function shutdownErrorReporting(timeoutMs = 2000): Promise<void> {
  const module = sentry;
  sentry = undefined;
  if (module === undefined) return;
  try {
    await module.flush(timeoutMs);
  } catch {
    // Shutdown telemetry is best effort.
  }
}

export interface CaptureContext {
  readonly correlationId?: string;
  readonly workspaceId?: string;
  readonly jobId?: string;
  readonly connectionId?: string;
  readonly provider?: string;
  readonly errorClass?: ErrorClass;
  readonly component?: string;
  readonly [key: string]: unknown;
}

/**
 * Log an exception, and report it when Sentry is configured. Always safe to
 * call: it never throws, and the payload is redacted before it leaves.
 */
export function captureException(error: unknown, context: CaptureContext = {}): void {
  const payload = redactRecord({ ...contextFields(), ...context });
  const normalized =
    error instanceof Error ? error : new Error(redactString(String(error)));

  try {
    getRootLogger().error({ ...payload, err: normalized }, 'error.captured');
  } catch {
    // A broken logger must not mask the original failure.
  }

  if (sentry === undefined) return;
  try {
    sentry.captureException(normalized, { extra: payload });
  } catch {
    // Reporting is best effort.
  }
}
