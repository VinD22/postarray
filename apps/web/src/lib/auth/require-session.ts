import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ApiError, api, type SessionView } from '@/lib/api';

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

  try {
    return await api.session.get(cookieHeader);
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
    redirect(`/sign-in?next=${encodeURIComponent(currentPath)}`);
  }

  if (!session.onboardingComplete) {
    redirect('/onboarding');
  }

  return session;
}
