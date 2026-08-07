import { ERROR_CODES, RelayError } from '@relay/contracts';

/**
 * A callback is a browser navigation, not an API client request. Once the
 * provider has redirected back, a JSON error leaves the person stranded on an
 * opaque API page. Keep the redirect vocabulary deliberately small so no
 * provider payload, internal message or transaction identifier reaches the
 * address bar.
 */
export const OAUTH_FAILURE_REASONS = [
  'not_implemented',
  'unsupported',
  'provider',
  'failed',
] as const;
export type OAuthFailureReason = (typeof OAUTH_FAILURE_REASONS)[number];

export function oauthFailureReason(error: unknown): OAuthFailureReason {
  if (!RelayError.is(error)) {
    return 'failed';
  }
  switch (error.code) {
    case ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED:
      return 'not_implemented';
    case ERROR_CODES.CAPABILITY_UNSUPPORTED:
      return 'unsupported';
    case ERROR_CODES.PROVIDER_TRANSIENT:
    case ERROR_CODES.PROVIDER_PERMANENT:
    case ERROR_CODES.PROVIDER_UNAVAILABLE:
      return 'provider';
    default:
      return 'failed';
  }
}
