import type { FailureExplanationView } from './insights-types';

/**
 * A failed publication, in plain language, with the one thing that fixes it.
 *
 * Pure and deterministic. The input is the sanitized error class and code the
 * worker stored on the job; a provider payload never reaches this function, so
 * nothing a provider said can leak into the sentence. The mapping is by code
 * first, because a code is more specific than a class, and by class second.
 *
 * Every key lives under `insight.failure.` in the catalog.
 */

const PREFIX = 'insight.failure';

type Explanation = Omit<FailureExplanationView, 'errorClass'>;

function explanation(reason: string, action: Explanation['action']): Explanation {
  return {
    messageKey: `${PREFIX}.${reason}.message`,
    fixKey: `${PREFIX}.${reason}.fix`,
    action,
  };
}

const BY_CODE: Readonly<Record<string, Explanation>> = {
  CONNECTION_ACTION_REQUIRED: explanation('reconnect', 'reconnect'),
  AUTH_REQUIRED: explanation('reconnect', 'reconnect'),
  AUTH_INVALID_CREDENTIALS: explanation('reconnect', 'reconnect'),
  SCOPE_INSUFFICIENT: explanation('reconnect', 'reconnect'),
  CONTENT_INVALID: explanation('content', 'edit'),
  VALIDATION_FAILED: explanation('content', 'edit'),
  DUPLICATE_CONTENT: explanation('duplicate', 'edit'),
  MEDIA_INVALID: explanation('media', 'edit'),
  MEDIA_TOO_LARGE: explanation('mediaTooLarge', 'edit'),
  UPLOAD_REJECTED: explanation('media', 'edit'),
  RATE_LIMITED: explanation('rateLimited', 'wait'),
  CADENCE_EXCEEDED: explanation('rateLimited', 'wait'),
  QUOTA_EXCEEDED: explanation('quota', 'wait'),
  POLICY_BLOCKED: explanation('policy', 'edit'),
  PROVIDER_TRANSIENT: explanation('providerBusy', 'retry'),
  PROVIDER_UNAVAILABLE: explanation('providerBusy', 'retry'),
  PROVIDER_PERMANENT: explanation('providerRefused', 'edit'),
  CAPABILITY_UNSUPPORTED: explanation('unsupported', null),
  CAPABILITY_NOT_IMPLEMENTED: explanation('unsupported', null),
};

const BY_CLASS: Readonly<Record<string, Explanation>> = {
  user_action_required: explanation('reconnect', 'reconnect'),
  content_invalid: explanation('content', 'edit'),
  transient_provider: explanation('providerBusy', 'retry'),
  permanent_provider: explanation('providerRefused', 'edit'),
  internal: explanation('internal', 'retry'),
  unknown: explanation('unknown', 'retry'),
};

/** Job states that mean "this destination did not get the post". */
const FAILED_STATES = new Set(['failed_permanently', 'action_required']);

export function isFailedState(state: string): boolean {
  return FAILED_STATES.has(state);
}

export function explainFailure(input: {
  readonly errorClass: string | null;
  readonly errorCode: string | null;
}): FailureExplanationView {
  const byCode = input.errorCode === null ? undefined : BY_CODE[input.errorCode];
  const byClass = input.errorClass === null ? undefined : BY_CLASS[input.errorClass];
  const chosen = byCode ?? byClass ?? explanation('unknown', 'retry');
  return { ...chosen, errorClass: input.errorClass };
}
