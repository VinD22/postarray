import { apiConfig } from '@/lib/api/config';

import { safeReturnPath } from './safe-return-path';

/**
 * Where to go after signing in.
 *
 * Usually a path inside this app. There is exactly one other destination: an
 * OAuth authorization request on our own API. A person who opens Claude's
 * "Connect" while signed out is sent here with the authorize URL as `next`, and
 * after signing in has to land back on it for the flow to continue.
 *
 * That exception is as narrow as it can be, because a sign-in page that
 * redirects anywhere is an open redirector: the origin must equal the
 * configured API origin exactly, the path must be `/oauth/authorize`, and there
 * may be no credentials or fragment in it. Anything else falls back to the
 * same-origin path rules.
 */

export type ReturnTarget =
  | { readonly kind: 'path'; readonly path: string }
  | { readonly kind: 'authorize'; readonly url: string };

const AUTHORIZE_PATH = '/oauth/authorize';

function authorizeUrl(value: string, apiBaseUrl: string | null): string | null {
  if (apiBaseUrl === null || !/^https?:\/\//i.test(value)) {
    return null;
  }
  let target: URL;
  let api: URL;
  try {
    target = new URL(value);
    api = new URL(apiBaseUrl);
  } catch {
    return null;
  }
  if (
    target.origin !== api.origin ||
    target.pathname !== AUTHORIZE_PATH ||
    target.username !== '' ||
    target.password !== '' ||
    target.hash !== ''
  ) {
    return null;
  }
  return target.toString();
}

export function resolveReturnTarget(
  value: string | null,
  apiBaseUrl: string | null = apiConfig.baseUrl,
  fallback = '/home',
): ReturnTarget {
  const authorize = value === null ? null : authorizeUrl(value, apiBaseUrl);
  if (authorize !== null) {
    return { kind: 'authorize', url: authorize };
  }
  return { kind: 'path', path: safeReturnPath(value, fallback) };
}

/** The `next` value to carry forward to another auth screen. */
export function returnTargetParam(target: ReturnTarget): string {
  return target.kind === 'authorize' ? target.url : target.path;
}
