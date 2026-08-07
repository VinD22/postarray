import { ERROR_CODES, RelayError } from '@relay/contracts';

/**
 * The browser cookie must carry the exact state the application put in the
 * provider URL. The transport never generates a second nonce.
 */
export function stateFromAuthorizationUrl(authorizationUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(authorizationUrl);
  } catch {
    throw new RelayError(ERROR_CODES.INTERNAL, {
      details: { reason: 'oauth_authorization_url_malformed' },
    });
  }
  const state = parsed.searchParams.get('state');
  if (state === null || state.length < 16) {
    throw new RelayError(ERROR_CODES.INTERNAL, {
      details: { reason: 'oauth_authorization_state_missing' },
    });
  }
  return state;
}
