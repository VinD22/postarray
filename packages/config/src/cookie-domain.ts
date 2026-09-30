/**
 * The `Domain` attribute for the session cookies, or `undefined` for a
 * host-only cookie.
 *
 * The API sets the session on its own host (`api.postarray.com`), but the web
 * app reads it on another (`postarray.com`): the Next server forwards the
 * visitor's cookies to check the session, and the browser copies the CSRF
 * cookie into a request header. A host-only cookie on the API host is invisible
 * to both, so sign-in appears to work and then every page redirects back to it.
 *
 * When the API host is a subdomain of the web host, the cookie is scoped to the
 * web host, which covers both. When they share a host (local development) or
 * are unrelated, it stays host-only: there is no domain both can read, and
 * guessing a registrable domain from a host name needs the public suffix list.
 * `SESSION_COOKIE_DOMAIN` overrides the derivation for any other layout.
 */
export function resolveSessionCookieDomain(input: {
  readonly explicit: string | undefined;
  readonly appUrl: string | undefined;
  readonly apiUrl: string | undefined;
}): string | undefined {
  if (input.explicit !== undefined) {
    return input.explicit;
  }
  const appHost = hostOf(input.appUrl);
  const apiHost = hostOf(input.apiUrl);
  if (appHost === undefined || apiHost === undefined || appHost === apiHost) {
    return undefined;
  }
  if (isIpAddress(appHost) || appHost === 'localhost' || !appHost.includes('.')) {
    return undefined;
  }
  return apiHost.endsWith(`.${appHost}`) ? appHost : undefined;
}

function hostOf(url: string | undefined): string | undefined {
  if (url === undefined) {
    return undefined;
  }
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

function isIpAddress(host: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[');
}
