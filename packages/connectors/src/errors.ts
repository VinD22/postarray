import {
  ERROR_CODES,
  RelayError,
  type ErrorClass,
  type ErrorCode,
  type ProviderId,
  isoInstantSchema,
  providerIdSchema,
} from '@relay/contracts';
import { z } from 'zod';

import { type Clock, systemClock } from './ports.js';
import { type SanitizeOptions, sanitizeProviderPayload, sanitizeText } from './sanitize.js';

/**
 * Provider error classification.
 *
 * Six classes, from `docs/research/02-development-handoff.md` section 7. The
 * class decides the retry policy and the campaign state. The remediation decides
 * what the Action Center says and what one-click action it offers.
 *
 * Only `TRANSIENT_PROVIDER` is ever retried automatically, and only for an
 * operation the caller declared safe to repeat. A create is not safe to repeat
 * until `ensureNotAlreadyPublished()` has answered "no".
 *
 * A connector never retries on its own: it classifies and returns, and Temporal
 * owns the retry policy (`docs/planning/05-social-connectors.md` section 1.2).
 */

export const PROVIDER_ERROR_CLASSES = [
  'USER_ACTION_REQUIRED',
  'CONTENT_INVALID',
  'TRANSIENT_PROVIDER',
  'PERMANENT_PROVIDER',
  'INTERNAL',
  'UNKNOWN',
] as const;
export const providerErrorClassSchema = z.enum(PROVIDER_ERROR_CLASSES);
export type ProviderErrorClass = z.infer<typeof providerErrorClassSchema>;

/** Only this class may be retried, and only for a declared-safe operation. */
export const RETRYABLE_PROVIDER_ERROR_CLASSES: readonly ProviderErrorClass[] = ['TRANSIENT_PROVIDER'];

export function isRetryableProviderClass(value: ProviderErrorClass): boolean {
  return RETRYABLE_PROVIDER_ERROR_CLASSES.includes(value);
}

/** Bridge to the lowercase `ErrorClass` stored on `publish_attempts`. */
export const CONTRACT_ERROR_CLASS: Readonly<Record<ProviderErrorClass, ErrorClass>> = Object.freeze({
  USER_ACTION_REQUIRED: 'user_action_required',
  CONTENT_INVALID: 'content_invalid',
  TRANSIENT_PROVIDER: 'transient_provider',
  PERMANENT_PROVIDER: 'permanent_provider',
  INTERNAL: 'internal',
  UNKNOWN: 'unknown',
});

export function toContractErrorClass(value: ProviderErrorClass): ErrorClass {
  return CONTRACT_ERROR_CLASS[value];
}

/**
 * Remediation codes. The first fifteen are the table in
 * `docs/planning/05-social-connectors.md` section 4.1 verbatim. The last three
 * are the generic fallbacks that table implies but does not name: a transient
 * provider problem with nothing for the user to do, a content problem with no
 * more specific cause, and an unclassifiable response.
 */
export const REMEDIATION_CODES = [
  'reconnect_account',
  'grant_additional_permission',
  'page_role_required',
  'switch_to_professional_account',
  'choose_privacy_option',
  'content_too_long',
  'media_invalid',
  'duplicate_content',
  'provider_rate_limited',
  'quota_exhausted',
  'usage_balance_required',
  'awaiting_provider_approval',
  'provider_rejected_content',
  'comment_failed_root_published',
  'contact_support',
  'wait_for_provider',
  'fix_content',
  'escalate_unclassified',
] as const;
export const remediationCodeSchema = z.enum(REMEDIATION_CODES);
export type RemediationCode = z.infer<typeof remediationCodeSchema>;

export const ONE_CLICK_ACTIONS = [
  'reconnect',
  'reconnect_with_scope',
  'connect_again',
  'retry',
  'retry_comment',
  'reschedule',
  'open_composer',
  'open_media_editor',
  'open_billing',
  'duplicate_as_draft',
  'read_more',
  'contact_support',
  'none',
] as const;
export const oneClickActionSchema = z.enum(ONE_CLICK_ACTIONS);
export type OneClickAction = z.infer<typeof oneClickActionSchema>;

export const remediationSchema = z
  .object({
    code: remediationCodeSchema,
    /** ICU key for the sentence that names what happened. */
    messageKey: z.string().min(1),
    /** ICU key for the sentence that names what happens next. */
    actionKey: z.string().min(1),
    /** ICU key for the button label, when there is a button. */
    actionLabelKey: z.string().min(1).nullable(),
    oneClickAction: oneClickActionSchema,
    defaultClass: providerErrorClassSchema,
    errorCode: z.string().min(1),
    retryable: z.boolean(),
    /** Every remediation appears in the Action Center, not only in a toast. */
    showsInActionCenter: z.boolean(),
  })
  .strict();
export type Remediation = Omit<z.infer<typeof remediationSchema>, 'errorCode'> & {
  readonly errorCode: ErrorCode;
};

function remediation(input: Remediation): Remediation {
  return Object.freeze(input);
}

export const REMEDIATIONS: Readonly<Record<RemediationCode, Remediation>> = Object.freeze({
  reconnect_account: remediation({
    code: 'reconnect_account',
    messageKey: 'error.connection_revoked.message',
    actionKey: 'error.connection_revoked.action',
    actionLabelKey: 'action.reconnect',
    oneClickAction: 'reconnect',
    defaultClass: 'USER_ACTION_REQUIRED',
    errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
    retryable: false,
    showsInActionCenter: true,
  }),
  grant_additional_permission: remediation({
    code: 'grant_additional_permission',
    messageKey: 'error.connection_permission_missing.message',
    actionKey: 'error.connection_permission_missing.action',
    actionLabelKey: 'action.reconnect',
    oneClickAction: 'reconnect_with_scope',
    defaultClass: 'USER_ACTION_REQUIRED',
    errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
    retryable: false,
    showsInActionCenter: true,
  }),
  page_role_required: remediation({
    code: 'page_role_required',
    messageKey: 'connection.incident.roleLost',
    actionKey: 'error.connection_permission_missing.action',
    actionLabelKey: 'action.retry',
    oneClickAction: 'retry',
    defaultClass: 'USER_ACTION_REQUIRED',
    errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
    retryable: false,
    showsInActionCenter: true,
  }),
  switch_to_professional_account: remediation({
    code: 'switch_to_professional_account',
    messageKey: 'error.connection_account_type_invalid.message',
    actionKey: 'error.connection_account_type_invalid.action',
    actionLabelKey: 'action.connect',
    oneClickAction: 'connect_again',
    defaultClass: 'USER_ACTION_REQUIRED',
    errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
    retryable: false,
    showsInActionCenter: true,
  }),
  choose_privacy_option: remediation({
    code: 'choose_privacy_option',
    messageKey: 'validation.privacy_setting_required.message',
    actionKey: 'validation.privacy_setting_required.hint',
    actionLabelKey: 'action.edit',
    oneClickAction: 'open_composer',
    defaultClass: 'CONTENT_INVALID',
    errorCode: ERROR_CODES.CONTENT_INVALID,
    retryable: false,
    showsInActionCenter: true,
  }),
  content_too_long: remediation({
    code: 'content_too_long',
    messageKey: 'validation.text_too_long.message',
    actionKey: 'validation.text_too_long.hint',
    actionLabelKey: 'action.edit',
    oneClickAction: 'open_composer',
    defaultClass: 'CONTENT_INVALID',
    errorCode: ERROR_CODES.CONTENT_INVALID,
    retryable: false,
    showsInActionCenter: true,
  }),
  media_invalid: remediation({
    code: 'media_invalid',
    messageKey: 'error.media_invalid.message',
    actionKey: 'error.media_invalid.action',
    actionLabelKey: 'action.edit',
    oneClickAction: 'open_media_editor',
    defaultClass: 'CONTENT_INVALID',
    errorCode: ERROR_CODES.MEDIA_INVALID,
    retryable: false,
    showsInActionCenter: true,
  }),
  duplicate_content: remediation({
    code: 'duplicate_content',
    messageKey: 'error.duplicate_content.message',
    actionKey: 'error.duplicate_content.action',
    actionLabelKey: 'action.edit',
    oneClickAction: 'open_composer',
    defaultClass: 'CONTENT_INVALID',
    errorCode: ERROR_CODES.DUPLICATE_CONTENT,
    retryable: false,
    showsInActionCenter: true,
  }),
  provider_rate_limited: remediation({
    code: 'provider_rate_limited',
    messageKey: 'error.provider_rate_limited.message',
    actionKey: 'error.provider_rate_limited.action',
    actionLabelKey: 'action.reschedule',
    oneClickAction: 'reschedule',
    defaultClass: 'TRANSIENT_PROVIDER',
    errorCode: ERROR_CODES.RATE_LIMITED,
    retryable: true,
    showsInActionCenter: true,
  }),
  quota_exhausted: remediation({
    code: 'quota_exhausted',
    messageKey: 'error.quota_exceeded.message',
    actionKey: 'error.quota_exceeded.action',
    actionLabelKey: 'action.reschedule',
    oneClickAction: 'reschedule',
    defaultClass: 'TRANSIENT_PROVIDER',
    errorCode: ERROR_CODES.QUOTA_EXCEEDED,
    retryable: true,
    showsInActionCenter: true,
  }),
  usage_balance_required: remediation({
    code: 'usage_balance_required',
    messageKey: 'error.payment_required.message',
    actionKey: 'error.payment_required.action',
    actionLabelKey: 'action.manageBilling',
    oneClickAction: 'open_billing',
    defaultClass: 'USER_ACTION_REQUIRED',
    errorCode: ERROR_CODES.PAYMENT_REQUIRED,
    retryable: false,
    showsInActionCenter: true,
  }),
  awaiting_provider_approval: remediation({
    code: 'awaiting_provider_approval',
    messageKey: 'error.connection_review_pending.message',
    actionKey: 'error.connection_review_pending.action',
    actionLabelKey: 'action.learnMore',
    oneClickAction: 'read_more',
    defaultClass: 'USER_ACTION_REQUIRED',
    errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
    retryable: false,
    showsInActionCenter: true,
  }),
  provider_rejected_content: remediation({
    code: 'provider_rejected_content',
    messageKey: 'error.provider_content_rejected.message',
    actionKey: 'error.provider_content_rejected.action',
    actionLabelKey: 'action.duplicate',
    oneClickAction: 'duplicate_as_draft',
    defaultClass: 'PERMANENT_PROVIDER',
    errorCode: ERROR_CODES.PROVIDER_PERMANENT,
    retryable: false,
    showsInActionCenter: true,
  }),
  comment_failed_root_published: remediation({
    code: 'comment_failed_root_published',
    messageKey: 'state.partially_published.label',
    actionKey: 'state.partially_published.description',
    actionLabelKey: 'action.retry',
    oneClickAction: 'retry_comment',
    defaultClass: 'TRANSIENT_PROVIDER',
    errorCode: ERROR_CODES.PROVIDER_TRANSIENT,
    retryable: true,
    showsInActionCenter: true,
  }),
  contact_support: remediation({
    code: 'contact_support',
    messageKey: 'error.internal.message',
    actionKey: 'error.internal.action',
    actionLabelKey: 'action.contactSupport',
    oneClickAction: 'contact_support',
    defaultClass: 'INTERNAL',
    errorCode: ERROR_CODES.INTERNAL,
    retryable: false,
    showsInActionCenter: true,
  }),
  wait_for_provider: remediation({
    code: 'wait_for_provider',
    messageKey: 'error.provider_transient.message',
    actionKey: 'error.provider_transient.action',
    actionLabelKey: null,
    oneClickAction: 'none',
    defaultClass: 'TRANSIENT_PROVIDER',
    errorCode: ERROR_CODES.PROVIDER_TRANSIENT,
    retryable: true,
    showsInActionCenter: true,
  }),
  fix_content: remediation({
    code: 'fix_content',
    messageKey: 'error.content_invalid.message',
    actionKey: 'error.content_invalid.action',
    actionLabelKey: 'action.edit',
    oneClickAction: 'open_composer',
    defaultClass: 'CONTENT_INVALID',
    errorCode: ERROR_CODES.CONTENT_INVALID,
    retryable: false,
    showsInActionCenter: true,
  }),
  escalate_unclassified: remediation({
    code: 'escalate_unclassified',
    messageKey: 'error.unknown.message',
    actionKey: 'error.unknown.action',
    actionLabelKey: 'action.contactSupport',
    oneClickAction: 'contact_support',
    defaultClass: 'UNKNOWN',
    errorCode: ERROR_CODES.UNKNOWN,
    retryable: false,
    showsInActionCenter: true,
  }),
});

export const PROVIDER_OPERATIONS = [
  'other',
  'discover_accounts',
  'list_destinations',
  'search_mentions',
  'get_capabilities',
  'validate_draft',
  'prepare_media',
  'preview',
  'publish',
  'get_status',
  'delete_post',
  'fetch_metrics',
  'refresh_credential',
  'revoke',
] as const;
export const providerOperationSchema = z.enum(PROVIDER_OPERATIONS);
export type ProviderOperation = z.infer<typeof providerOperationSchema>;

/**
 * Operations that create an external side effect and must never blind-retry.
 * `other` is in the list on purpose: an operation we did not classify is
 * assumed to have a side effect until someone says otherwise.
 */
export const SIDE_EFFECTING_OPERATIONS: readonly ProviderOperation[] = [
  'publish',
  'delete_post',
  'prepare_media',
  'other',
];

/** Narrow a free-form operation name, defaulting to the conservative `other`. */
export function asProviderOperation(value: string): ProviderOperation {
  return (PROVIDER_OPERATIONS as readonly string[]).includes(value)
    ? (value as ProviderOperation)
    : 'other';
}

export const classifiedProviderErrorSchema = z
  .object({
    provider: providerIdSchema,
    operation: providerOperationSchema,
    errorClass: providerErrorClassSchema,
    contractErrorClass: z.enum([
      'user_action_required',
      'content_invalid',
      'transient_provider',
      'permanent_provider',
      'internal',
      'unknown',
    ]),
    errorCode: z.string().min(1),
    messageKey: z.string().min(1),
    remediationCode: remediationCodeSchema,
    retryable: z.boolean(),
    retryAfterSeconds: z.number().int().nonnegative().nullable(),
    httpStatus: z.number().int().nullable(),
    providerErrorCode: z.string().nullable(),
    providerErrorSubcode: z.string().nullable(),
    /** Provider wording, sanitized. Rendered only inside a quoted fragment. */
    providerMessage: z.string().nullable(),
    sanitizedResponse: z.record(z.string(), z.unknown()),
    observedAt: isoInstantSchema,
  })
  .strict();
export type ClassifiedProviderError = Omit<
  z.infer<typeof classifiedProviderErrorSchema>,
  'errorCode'
> & { readonly errorCode: ErrorCode };

export interface ProviderErrorFacts {
  readonly status: number | undefined;
  readonly lowerText: string;
  readonly providerErrorCode: string | undefined;
  readonly providerErrorSubcode: string | undefined;
  readonly providerMessage: string | undefined;
  readonly transportCode: string | undefined;
  readonly retryAfterSeconds: number | undefined;
  readonly operation: ProviderOperation;
  readonly provider: ProviderId;
}

/**
 * A provider adapter may refine the generic rules but never loosen them: it
 * returns a class and a remediation, or `undefined` to fall through.
 */
export type ProviderErrorRefiner = (
  facts: ProviderErrorFacts,
) => { errorClass: ProviderErrorClass; remediationCode: RemediationCode } | undefined;

const refiners = new Map<ProviderId, ProviderErrorRefiner>();

/** Provider adapters register their own table at module load. */
export function registerProviderErrorRefiner(
  provider: ProviderId,
  refiner: ProviderErrorRefiner,
): void {
  refiners.set(provider, refiner);
}

export function getProviderErrorRefiner(provider: ProviderId): ProviderErrorRefiner | undefined {
  return refiners.get(provider);
}

export interface ClassifyProviderErrorInput {
  readonly provider: ProviderId;
  readonly operation: ProviderOperation;
  readonly status?: number;
  readonly body?: unknown;
  readonly headers?: Readonly<Record<string, string>>;
  /** Transport level code such as ECONNRESET or UND_ERR_HEADERS_TIMEOUT. */
  readonly transportCode?: string;
  readonly clock?: Clock;
  readonly sanitize?: SanitizeOptions;
  readonly refiner?: ProviderErrorRefiner;
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
  'UND_ERR_BODY_TIMEOUT',
  'UND_ERR_SOCKET',
  'ABORT_ERR',
]);

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

function bodyToText(body: unknown): string {
  if (body === undefined || body === null) return '';
  if (typeof body === 'string') return body;
  if (body instanceof Error) return `${body.name}: ${body.message}`;
  try {
    return JSON.stringify(body);
  } catch {
    return String(body);
  }
}

export function parseRetryAfterSeconds(
  headers: Readonly<Record<string, string>> | undefined,
  clock: Clock,
): number | undefined {
  if (headers === undefined) return undefined;
  const lower: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    lower[key.toLowerCase()] = value;
  }
  const retryAfter = lower['retry-after'];
  if (retryAfter !== undefined) {
    const asNumber = Number(retryAfter);
    if (Number.isFinite(asNumber) && asNumber >= 0) {
      return Math.ceil(asNumber);
    }
    // eslint-disable-next-line no-restricted-globals -- parsing an HTTP date, not reading the clock.
    const asDate = Date.parse(retryAfter);
    if (Number.isFinite(asDate)) {
      return Math.max(0, Math.ceil((asDate - clock.now().getTime()) / 1000));
    }
  }
  for (const key of ['x-rate-limit-reset', 'x-ratelimit-reset', 'ratelimit-reset']) {
    const value = lower[key];
    if (value === undefined) continue;
    const asNumber = Number(value);
    if (!Number.isFinite(asNumber)) continue;
    // A value above one year of seconds is an absolute epoch second, not a delta.
    const nowSeconds = Math.floor(clock.now().getTime() / 1000);
    return asNumber > 31_536_000 ? Math.max(0, Math.ceil(asNumber - nowSeconds)) : Math.ceil(asNumber);
  }
  return undefined;
}

function readFacts(input: ClassifyProviderErrorInput, clock: Clock): ProviderErrorFacts {
  const record = asRecord(input.body);
  const errorNode = record === undefined ? undefined : asRecord(record['error']);
  const errorsArray =
    record !== undefined && Array.isArray(record['errors']) ? record['errors'] : [];
  const firstError = asRecord(errorsArray[0]);

  const providerErrorCode =
    (errorNode === undefined ? undefined : readString(errorNode['code'])) ??
    (record === undefined ? undefined : readString(record['code'])) ??
    (record === undefined ? undefined : readString(record['error_code'])) ??
    (record === undefined ? undefined : readString(record['serviceErrorCode'])) ??
    (firstError === undefined ? undefined : readString(firstError['code'])) ??
    (record === undefined ? undefined : readString(record['error']));

  const providerErrorSubcode =
    (errorNode === undefined ? undefined : readString(errorNode['error_subcode'])) ??
    (record === undefined ? undefined : readString(record['error_subcode']));

  const rawMessage =
    (errorNode === undefined ? undefined : readString(errorNode['message'])) ??
    (record === undefined ? undefined : readString(record['message'])) ??
    (record === undefined ? undefined : readString(record['error_description'])) ??
    (firstError === undefined ? undefined : readString(firstError['message'])) ??
    (record === undefined ? undefined : readString(record['detail']));

  const transportCode =
    input.transportCode ??
    (input.body instanceof Error
      ? readString((input.body as unknown as Record<string, unknown>)['code'])
      : undefined);

  const facts: ProviderErrorFacts = {
    status: input.status,
    lowerText: bodyToText(input.body).slice(0, 4000).toLowerCase(),
    providerErrorCode: providerErrorCode?.toLowerCase(),
    providerErrorSubcode,
    providerMessage:
      rawMessage === undefined ? undefined : sanitizeText(rawMessage, input.sanitize ?? {}),
    transportCode,
    retryAfterSeconds: parseRetryAfterSeconds(input.headers, clock),
    operation: input.operation,
    provider: input.provider,
  };
  return facts;
}

const has = (text: string, ...needles: readonly string[]): boolean =>
  needles.some((needle) => text.includes(needle));

interface Verdict {
  readonly errorClass: ProviderErrorClass;
  readonly remediationCode: RemediationCode;
}

function classifyByText(facts: ProviderErrorFacts): Verdict | undefined {
  const text = facts.lowerText;
  if (has(text, 'duplicate content', 'is a duplicate', 'already posted', 'duplicate post')) {
    return { errorClass: 'CONTENT_INVALID', remediationCode: 'duplicate_content' };
  }
  if (has(text, 'too long', 'exceeds the maximum length', 'text is too long')) {
    return { errorClass: 'CONTENT_INVALID', remediationCode: 'content_too_long' };
  }
  if (
    has(
      text,
      'aspect ratio',
      'unsupported format',
      'unsupported media',
      'media upload has failed',
      'invalid video',
      'invalid image',
      'file too large',
      'duration',
      'resolution',
    )
  ) {
    return { errorClass: 'CONTENT_INVALID', remediationCode: 'media_invalid' };
  }
  if (has(text, 'privacy', 'privacy_level', 'must select who can view')) {
    return { errorClass: 'CONTENT_INVALID', remediationCode: 'choose_privacy_option' };
  }
  if (has(text, 'professional account', 'business account is required', 'creator account')) {
    return { errorClass: 'USER_ACTION_REQUIRED', remediationCode: 'switch_to_professional_account' };
  }
  if (has(text, 'page role', 'not an admin of', 'requires the content admin', 'admin role')) {
    return { errorClass: 'USER_ACTION_REQUIRED', remediationCode: 'page_role_required' };
  }
  if (has(text, 'unaudited', 'pending review', 'app is in review', 'not yet approved')) {
    return { errorClass: 'USER_ACTION_REQUIRED', remediationCode: 'awaiting_provider_approval' };
  }
  if (has(text, 'insufficient balance', 'usage-capped', 'payment required', 'add funds')) {
    return { errorClass: 'USER_ACTION_REQUIRED', remediationCode: 'usage_balance_required' };
  }
  if (has(text, 'quota', 'daily limit', 'quotaexceeded')) {
    return { errorClass: 'TRANSIENT_PROVIDER', remediationCode: 'quota_exhausted' };
  }
  if (has(text, 'rate limit', 'ratelimitexceeded', 'too many requests', 'slow down')) {
    return { errorClass: 'TRANSIENT_PROVIDER', remediationCode: 'provider_rate_limited' };
  }
  if (
    has(
      text,
      'invalid_grant',
      'invalid_token',
      'expired_access_token',
      'revoked_access_token',
      'token has been expired or revoked',
      'reauthenticate',
      'session has expired',
    )
  ) {
    return { errorClass: 'USER_ACTION_REQUIRED', remediationCode: 'reconnect_account' };
  }
  if (
    has(
      text,
      'insufficient scope',
      'missing permission',
      'not enough permissions',
      'scope_not_authorized',
      'scope_permission_missed',
    )
  ) {
    return { errorClass: 'USER_ACTION_REQUIRED', remediationCode: 'grant_additional_permission' };
  }
  if (has(text, 'suspended', 'banned', 'permanently disabled', 'account restricted', 'takedown')) {
    return { errorClass: 'PERMANENT_PROVIDER', remediationCode: 'provider_rejected_content' };
  }
  return undefined;
}

function classifyByStatus(facts: ProviderErrorFacts): Verdict {
  const status = facts.status;
  if (status === undefined) {
    if (facts.transportCode !== undefined && TRANSPORT_CODES.has(facts.transportCode)) {
      return { errorClass: 'TRANSIENT_PROVIDER', remediationCode: 'wait_for_provider' };
    }
    if (has(facts.lowerText, 'timeout', 'socket hang up', 'network error', 'aborted')) {
      return { errorClass: 'TRANSIENT_PROVIDER', remediationCode: 'wait_for_provider' };
    }
    return { errorClass: 'UNKNOWN', remediationCode: 'escalate_unclassified' };
  }
  if (status >= 500) {
    return { errorClass: 'TRANSIENT_PROVIDER', remediationCode: 'wait_for_provider' };
  }
  if (status === 429) {
    return { errorClass: 'TRANSIENT_PROVIDER', remediationCode: 'provider_rate_limited' };
  }
  if (status === 408 || status === 425) {
    return { errorClass: 'TRANSIENT_PROVIDER', remediationCode: 'wait_for_provider' };
  }
  if (status === 401) {
    return { errorClass: 'USER_ACTION_REQUIRED', remediationCode: 'reconnect_account' };
  }
  if (status === 402) {
    return { errorClass: 'USER_ACTION_REQUIRED', remediationCode: 'usage_balance_required' };
  }
  if (status === 403) {
    return { errorClass: 'USER_ACTION_REQUIRED', remediationCode: 'grant_additional_permission' };
  }
  if (status === 404 || status === 410) {
    return { errorClass: 'PERMANENT_PROVIDER', remediationCode: 'provider_rejected_content' };
  }
  if (status === 409) {
    return { errorClass: 'CONTENT_INVALID', remediationCode: 'duplicate_content' };
  }
  if (status === 413) {
    return { errorClass: 'CONTENT_INVALID', remediationCode: 'media_invalid' };
  }
  if (status === 415 || status === 422 || status === 400) {
    return { errorClass: 'CONTENT_INVALID', remediationCode: 'fix_content' };
  }
  return { errorClass: 'UNKNOWN', remediationCode: 'escalate_unclassified' };
}

/**
 * Classify one provider failure.
 *
 * ```ts
 * const classified = classifyProviderError({
 *   provider: 'x',
 *   operation: 'publish',
 *   status: 429,
 *   headers: { 'retry-after': '90' },
 * });
 * // classified.errorClass === 'TRANSIENT_PROVIDER'
 * // classified.remediationCode === 'provider_rate_limited'
 * // classified.retryAfterSeconds === 90
 * ```
 */
export function classifyProviderError(
  input: ClassifyProviderErrorInput,
): ClassifiedProviderError {
  const clock = input.clock ?? systemClock;
  const facts = readFacts(input, clock);

  const isOurBug =
    input.body instanceof TypeError ||
    input.body instanceof RangeError ||
    input.body instanceof SyntaxError ||
    input.body instanceof ReferenceError;

  const verdict: Verdict = isOurBug
    ? { errorClass: 'INTERNAL', remediationCode: 'contact_support' }
    : ((input.refiner ?? refiners.get(input.provider))?.(facts) ??
      classifyByText(facts) ??
      classifyByStatus(facts));

  const chosen = REMEDIATIONS[verdict.remediationCode];
  const retryable =
    isRetryableProviderClass(verdict.errorClass) &&
    chosen.retryable &&
    !SIDE_EFFECTING_OPERATIONS.includes(facts.operation);

  const classified: ClassifiedProviderError = {
    provider: input.provider,
    operation: input.operation,
    errorClass: verdict.errorClass,
    contractErrorClass: toContractErrorClass(verdict.errorClass),
    errorCode:
      verdict.errorClass === 'UNKNOWN' && chosen.errorCode === ERROR_CODES.INTERNAL
        ? ERROR_CODES.UNKNOWN
        : chosen.errorCode,
    messageKey: chosen.messageKey,
    remediationCode: chosen.code,
    retryable,
    retryAfterSeconds: facts.retryAfterSeconds ?? null,
    httpStatus: input.status ?? null,
    providerErrorCode: facts.providerErrorCode ?? null,
    providerErrorSubcode: facts.providerErrorSubcode ?? null,
    providerMessage: facts.providerMessage ?? null,
    sanitizedResponse: sanitizeProviderPayload(input.body, input.sanitize ?? {}),
    observedAt: clock.now().toISOString(),
  };
  classifiedProviderErrorSchema.parse(classified);
  return classified;
}

/** Look up the full remediation descriptor the Action Center renders. */
export function remediationFor(classified: ClassifiedProviderError): Remediation {
  return REMEDIATIONS[classified.remediationCode];
}

/**
 * Turn a classified provider failure into the `RelayError` every surface
 * understands. The provider payload never reaches the message, only the
 * sanitized fields the receipt already stores.
 */
export function toRelayError(
  classified: ClassifiedProviderError,
  options: { readonly correlationId?: string; readonly cause?: unknown } = {},
): RelayError {
  return new RelayError(classified.errorCode, {
    messageKey: classified.messageKey,
    retryable: classified.retryable,
    details: {
      provider: classified.provider,
      operation: classified.operation,
      errorClass: classified.errorClass,
      remediationCode: classified.remediationCode,
      httpStatus: classified.httpStatus,
      providerErrorCode: classified.providerErrorCode,
      retryAfterSeconds: classified.retryAfterSeconds,
    },
    ...(options.correlationId === undefined ? {} : { correlationId: options.correlationId }),
    ...(options.cause === undefined ? {} : { cause: options.cause }),
  });
}

/** A `RelayError` carrying a classified provider failure end to end. */
export class ProviderCallError extends RelayError {
  readonly classified: ClassifiedProviderError;

  constructor(classified: ClassifiedProviderError, options: { readonly cause?: unknown } = {}) {
    super(classified.errorCode, {
      messageKey: classified.messageKey,
      retryable: classified.retryable,
      details: {
        provider: classified.provider,
        operation: classified.operation,
        errorClass: classified.errorClass,
        remediationCode: classified.remediationCode,
        httpStatus: classified.httpStatus,
        providerErrorCode: classified.providerErrorCode,
        retryAfterSeconds: classified.retryAfterSeconds,
      },
      ...(options.cause === undefined ? {} : { cause: options.cause }),
    });
    this.name = 'ProviderCallError';
    this.classified = classified;
  }

  static is(value: unknown): value is ProviderCallError {
    return value instanceof ProviderCallError;
  }
}

/* --------------------------------------------------- adapter facing helpers */

/**
 * The remediation codes, as a named map.
 *
 * Adapters reference `REMEDIATION.reconnectAccount` rather than a bare string so
 * a typo is a compile error and a renamed code is one edit.
 */
export const REMEDIATION = Object.freeze({
  reconnectAccount: 'reconnect_account',
  grantAdditionalPermission: 'grant_additional_permission',
  pageRoleRequired: 'page_role_required',
  switchToProfessionalAccount: 'switch_to_professional_account',
  choosePrivacyOption: 'choose_privacy_option',
  contentTooLong: 'content_too_long',
  mediaInvalid: 'media_invalid',
  duplicateContent: 'duplicate_content',
  providerRateLimited: 'provider_rate_limited',
  quotaExhausted: 'quota_exhausted',
  usageBalanceRequired: 'usage_balance_required',
  awaitingProviderApproval: 'awaiting_provider_approval',
  providerRejectedContent: 'provider_rejected_content',
  commentFailedRootPublished: 'comment_failed_root_published',
  contactSupport: 'contact_support',
  waitForProvider: 'wait_for_provider',
  fixContent: 'fix_content',
  escalateUnclassified: 'escalate_unclassified',
}) satisfies Readonly<Record<string, RemediationCode>>;

/** The minimum a helper needs to classify a response. */
export interface ProviderResponseLike {
  readonly status: number;
  readonly ok: boolean;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: unknown;
}

export interface ProviderFailureContext {
  readonly provider: ProviderId;
  readonly operation: string;
  readonly response?: ProviderResponseLike;
  readonly cause?: unknown;
  /** Force a specific remediation when the adapter knows better than the rules. */
  readonly remediationCode?: RemediationCode;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly clock?: Clock;
  readonly sanitize?: SanitizeOptions;
}

/** Classify a provider failure and wrap it in the error every surface handles. */
export function providerFailure(context: ProviderFailureContext): ProviderCallError {
  const classified = classifyProviderError({
    provider: context.provider,
    operation: asProviderOperation(context.operation),
    ...(context.response === undefined
      ? {}
      : {
          status: context.response.status,
          body: context.response.body,
          headers: context.response.headers,
        }),
    ...(context.response === undefined && context.cause !== undefined
      ? { body: context.cause }
      : {}),
    ...(context.clock === undefined ? {} : { clock: context.clock }),
    ...(context.sanitize === undefined ? {} : { sanitize: context.sanitize }),
    ...(context.remediationCode === undefined
      ? {}
      : {
          refiner: (): { errorClass: ProviderErrorClass; remediationCode: RemediationCode } => ({
            errorClass: REMEDIATIONS[context.remediationCode ?? 'contact_support'].defaultClass,
            remediationCode: context.remediationCode ?? 'contact_support',
          }),
        }),
  });
  return new ProviderCallError(classified, {
    ...(context.cause === undefined ? {} : { cause: context.cause }),
  });
}

/** Throw a classified failure when the response is not a success. */
export function ensureOk(response: ProviderResponseLike, context: ProviderFailureContext): void {
  if (response.ok) {
    return;
  }
  throw providerFailure({ ...context, response });
}

/**
 * Parse a provider body with zod. A parse failure is `UNKNOWN` with sanitized
 * evidence, never a crash and never a silent success.
 */
export function parseProviderBody<T>(
  schema: { safeParse(value: unknown): { success: true; data: T } | { success: false; error: unknown } },
  response: ProviderResponseLike,
  context: ProviderFailureContext,
): T {
  const result = schema.safeParse(response.body);
  if (result.success) {
    return result.data;
  }
  throw providerFailure({
    ...context,
    response: {
      ...response,
      body: { message: 'provider response did not match the expected schema' },
    },
    remediationCode: 'escalate_unclassified',
    cause: result.error,
  });
}
