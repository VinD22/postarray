import 'server-only';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ApiError, api, type SessionView } from '@/lib/api';
import { localizedHref } from '@/lib/i18n/routing';
import { getRequestIntl } from '@/lib/i18n/server';

/**
 * Resolve the session on the server.
 *
 * Returns `null` when there is no session rather than throwing, so a caller can
 * decide between redirecting and rendering a public page.
 */
export async function getSession(): Promise<SessionView | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join('; ');

  // The API binds a session to a fingerprint of the signin request's
  // user-agent and accept-language and rejects a mismatch. This call runs on
  // the Next server, not in the visitor's browser, so without forwarding the
  // real incoming headers it would carry Node's own (or none) and every
  // signed-in page load would 401 into a redirect loop back to sign-in.
  const requestHeaders = await headers();
  const forwardHeaders = {
    userAgent: requestHeaders.get('user-agent') ?? undefined,
    acceptLanguage: requestHeaders.get('accept-language') ?? undefined,
  };

  try {
    return await api.session.get(cookieHeader, forwardHeaders);
  } catch (error) {
    if (ApiError.is(error) && (error.isAuthentication || error.status === 404)) {
      return null;
    }
    // A transport failure is not "signed out". Let the route error boundary
    // render the real reason instead of bouncing the user to sign in.
    throw error;
  }
}

/**
 * The session, or a redirect.
 *
 * The current path is carried in `next` so the user lands back where they were
 * after signing in. Onboarding is enforced here too: a workspace without a
 * confirmed subscription and a first post has nothing useful to show on Home.
 */
export async function requireSession(currentPath: string): Promise<SessionView> {
  const session = await getSession();

  if (session === null) {
    const { locale } = await getRequestIntl();
    redirect(localizedHref(`/sign-in?next=${encodeURIComponent(currentPath)}`, locale));
  }

  if (!session.onboardingComplete) {
    const { locale } = await getRequestIntl(session.workspace.timeZone);
    redirect(localizedHref('/onboarding', locale));
  }

  return session;
}
