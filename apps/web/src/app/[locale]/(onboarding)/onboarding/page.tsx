import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { nextIncompleteStep, ONBOARDING_STEPS } from '@/components/onboarding/steps';
import { api } from '@/lib/api';
import type { ForwardAuth } from '@/lib/api/transport';
import { isDemoMode } from '@/lib/api/config';
import { getSession } from '@/lib/auth/require-session';
import { localizedHref } from '@/lib/i18n/routing';
import { getRequestIntl } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

/**
 * The onboarding entry point.
 *
 * It resolves the first unfinished step and sends the user there, so closing
 * the tab mid-setup and coming back resumes rather than restarts.
 *
 * The session is resolved with `getSession`, never `requireSession`: that
 * helper redirects an unfinished account *to this route*, so calling it here
 * would be a redirect loop.
 */
export default async function OnboardingIndex() {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const forward: ForwardAuth = {
    forwardCookie: cookieStore
      .getAll()
      .map((entry) => `${entry.name}=${entry.value}`)
      .join('; '),
    forwardHeaders: {
      userAgent: requestHeaders.get('user-agent') ?? undefined,
      acceptLanguage: requestHeaders.get('accept-language') ?? undefined,
    },
  };
  if (!isDemoMode) {
    const session = await getSession();
    if (session === null) {
      const { locale } = await getRequestIntl();
      redirect(localizedHref('/sign-in?next=%2Fonboarding', locale));
    }
  }
  // This read is its own request from the Next server, so it needs the session
  // cookie and the client fingerprint forwarded explicitly, exactly as
  // `/compose` and `/library` do. Without it the API sees no cookie and Node's
  // own user agent, and the entry point 401s for a healthy session.
  const state = await api.onboarding.getState(forward);
  if (state.complete) {
    // Somebody who already finished, following an old link or a stale tab.
    // The setup sequence has nothing left to tell them.
    redirect('/home');
  }
  const next = nextIncompleteStep({
    checkoutConfirmed: state.checkoutConfirmed,
    workspaceNamed: state.workspaceNamed,
    useCaseChosen: state.useCase !== null,
    connectionCount: state.connectionCount,
    firstPostScheduled: state.firstPostScheduled,
  });

  const step = ONBOARDING_STEPS.find((entry) => entry.id === next) ?? ONBOARDING_STEPS[0];
  redirect(step.href);
}
