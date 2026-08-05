/**
 * Redirect URI validation.
 *
 * The allowlist is exact. A wildcard, a partial path or a query string turns
 * an authorization code into something another site can claim, so those are
 * rejected in the form rather than at the authorization endpoint where the
 * developer would only see a generic error.
 */

export type RedirectUriProblem =
  'not-a-url' | 'not-https' | 'has-wildcard' | 'has-query' | 'has-fragment' | 'has-credentials';

/** Null means the URI is acceptable exactly as written. */
export function checkRedirectUri(value: string, allowLoopback = true): RedirectUriProblem | null {
  const trimmed = value.trim();
  if (trimmed.includes('*')) {
    return 'has-wildcard';
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return 'not-a-url';
  }

  const loopback = allowLoopback && (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
  if (url.protocol !== 'https:' && !(loopback && url.protocol === 'http:')) {
    return 'not-https';
  }
  if (url.username.length > 0 || url.password.length > 0) {
    return 'has-credentials';
  }
  if (url.search.length > 0) {
    return 'has-query';
  }
  if (url.hash.length > 0) {
    return 'has-fragment';
  }
  return null;
}
