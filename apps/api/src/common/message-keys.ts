import { ERROR_CODES, type ErrorCode } from '@relay/contracts';

/**
 * Every `RelayError` code the API can emit, mapped to the key of the sentence a
 * person actually reads. The catalog lives in `@relay/i18n`; the API never
 * carries English. A client renders `messageKey` (and its `.action` sibling)
 * through the translator for the caller's locale.
 *
 * `RelayError` has its own default (`errors.<code>`), which is a placeholder
 * shape rather than a catalog key. Where a real catalog entry exists we use it,
 * so the wire format is directly renderable.
 */
export const ERROR_MESSAGE_KEYS: Readonly<Record<ErrorCode, string>> = {
  [ERROR_CODES.AUTH_REQUIRED]: 'error.unauthenticated.message',
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'error.unauthenticated.message',
  [ERROR_CODES.AUTH_MFA_REQUIRED]: 'error.mfa_required.message',
  [ERROR_CODES.FORBIDDEN]: 'error.forbidden.message',
  [ERROR_CODES.SCOPE_INSUFFICIENT]: 'error.insufficient_scope.message',
  [ERROR_CODES.WORKSPACE_NOT_FOUND]: 'error.workspace_not_found.message',
  [ERROR_CODES.NOT_FOUND]: 'error.not_found.message',
  [ERROR_CODES.CONFLICT]: 'error.conflict.message',
  [ERROR_CODES.IDEMPOTENCY_MISMATCH]: 'error.idempotency_key_reused.message',
  [ERROR_CODES.VALIDATION_FAILED]: 'error.validation_failed.message',
  [ERROR_CODES.RATE_LIMITED]: 'error.rate_limited.message',
  [ERROR_CODES.QUOTA_EXCEEDED]: 'error.quota_exceeded.message',
  [ERROR_CODES.ENTITLEMENT_REQUIRED]: 'error.entitlement_missing.message',
  [ERROR_CODES.TRIAL_EXPIRED]: 'error.trial_expired.message',
  [ERROR_CODES.PAYMENT_REQUIRED]: 'error.payment_required.message',
  [ERROR_CODES.CONNECTION_ACTION_REQUIRED]: 'error.user_action_required.message',
  [ERROR_CODES.CAPABILITY_UNSUPPORTED]: 'error.capability_unsupported.message',
  [ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED]: 'error.capability_not_implemented.message',
  [ERROR_CODES.CONTENT_INVALID]: 'error.content_invalid.message',
  [ERROR_CODES.DUPLICATE_CONTENT]: 'error.duplicate_content.message',
  [ERROR_CODES.CADENCE_EXCEEDED]: 'error.cadence_limit_reached.message',
  [ERROR_CODES.POLICY_BLOCKED]: 'error.automation_rule_not_permitted.message',
  [ERROR_CODES.APPROVAL_REQUIRED]: 'error.approval_required.message',
  [ERROR_CODES.PROVIDER_TRANSIENT]: 'error.provider_transient.message',
  [ERROR_CODES.PROVIDER_PERMANENT]: 'error.provider_permanent.message',
  [ERROR_CODES.PROVIDER_UNAVAILABLE]: 'error.provider_unavailable.message',
  [ERROR_CODES.MEDIA_INVALID]: 'error.media_invalid.message',
  [ERROR_CODES.MEDIA_TOO_LARGE]: 'error.media_too_large.message',
  [ERROR_CODES.SSRF_BLOCKED]: 'error.short_link_destination_blocked.message',
  [ERROR_CODES.UPLOAD_REJECTED]: 'error.media_invalid.message',
  [ERROR_CODES.AI_UNAVAILABLE]: 'error.ai_unavailable.message',
  [ERROR_CODES.AI_OUTPUT_INVALID]: 'error.ai_output_invalid.message',
  [ERROR_CODES.INTERNAL]: 'error.internal.message',
  [ERROR_CODES.UNKNOWN]: 'error.unknown.message',
};

/** The catalog key for the "what can I do next" sentence beside the message. */
export function actionKeyFor(messageKey: string): string {
  return messageKey.endsWith('.message')
    ? `${messageKey.slice(0, -'.message'.length)}.action`
    : messageKey;
}

/** The renderable catalog key for a code, falling back to the generic one. */
export function messageKeyFor(code: ErrorCode): string {
  return ERROR_MESSAGE_KEYS[code] ?? 'error.unknown.message';
}
