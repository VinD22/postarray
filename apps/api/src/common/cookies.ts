/**
 * Cookie parsing and serialization.
 *
 * Hand written rather than pulled from a dependency because the flags below are
 * a security control, and a control we own is a control we can test. Every
 * cookie this API sets is `HttpOnly` unless it is explicitly the readable CSRF
 * companion token, and every cookie is `Secure` outside development.
 */

export const SESSION_COOKIE = 'relay_session';
export const REFRESH_COOKIE = 'relay_refresh';
export const CSRF_COOKIE = 'relay_csrf';
export const OAUTH_STATE_COOKIE = 'relay_oauth_state';

export type SameSite = 'Strict' | 'Lax' | 'None';

export interface CookieOptions {
  readonly maxAgeSeconds?: number;
  readonly path?: string;
  readonly domain?: string;
  readonly httpOnly?: boolean;
  readonly secure?: boolean;
  readonly sameSite?: SameSite;
}

const COOKIE_NAME_PATTERN = /^[A-Za-z0-9!#$%&'*+\-.^_`|~]+$/;

/** Parse a `Cookie` request header. Malformed pairs are dropped, not guessed. */
export function parseCookies(header: string | undefined): Readonly<Record<string, string>> {
  const jar: Record<string, string> = {};
  if (header === undefined || header.length === 0) {
    return jar;
  }
  for (const segment of header.split(';')) {
    const separator = segment.indexOf('=');
    if (separator <= 0) {
      continue;
    }
    const name = segment.slice(0, separator).trim();
    if (!COOKIE_NAME_PATTERN.test(name)) {
      continue;
    }
    let value = segment.slice(separator + 1).trim();
    if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
      value = value.slice(1, -1);
    }
    try {
      jar[name] = decodeURIComponent(value);
    } catch {
      jar[name] = value;
    }
  }
  return jar;
}

/** Serialize a `Set-Cookie` header value. */
export function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  if (!COOKIE_NAME_PATTERN.test(name)) {
    throw new RangeError('COOKIE_NAME_INVALID');
  }
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path ?? '/'}`);
  if (options.domain !== undefined) {
    parts.push(`Domain=${options.domain}`);
  }
  if (options.maxAgeSeconds !== undefined) {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAgeSeconds))}`);
  }
  if (options.httpOnly !== false) {
    parts.push('HttpOnly');
  }
  if (options.secure !== false) {
    parts.push('Secure');
  }
  parts.push(`SameSite=${options.sameSite ?? 'Lax'}`);
  return parts.join('; ');
}

/** Serialize the deletion form of a cookie, matching flags so browsers accept it. */
export function expireCookie(name: string, options: CookieOptions = {}): string {
  return serializeCookie(name, '', { ...options, maxAgeSeconds: 0 });
}
