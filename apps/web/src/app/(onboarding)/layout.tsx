import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { OnboardingStepList } from '@/components/onboarding/step-list';
import { getSession } from '@/lib/auth/require-session';
import { SessionProvider } from '@/lib/auth/session-context';
import { getRequestIntl } from '@/lib/i18n/server';

/**
 * The onboarding frame.
 *
 * Quieter than the app shell: no navigation rail, no Action center, nothing to
 * click away into. The step list stays visible so the remaining work is never a
 * mystery, and "Finish later" is always available because a setup flow with no
 * exit is a trap.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function OnboardingLayout({ children }: { readonly children: ReactNode }) {
  const [session, intl] = await Promise.all([getSession(), getRequestIntl()]);

  if (session === null) {
    redirect('/sign-in?next=%2Fonboarding');
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-dvh bg-surface-canvas">
        <header className="border-b border-border-default">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6">
            <p className="text-title-sm text-text-primary">{intl.t.format('shell.appName')}</p>
            <Link
              href="/"
              className="min-h-9 text-body-sm text-text-secondary hover:text-text-primary hover:underline"
            >
              {intl.t.format('onboarding.exit')}
            </Link>
          </div>
        </header>

        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
          <div className="lg:pt-1">
            <p className="pb-4 text-body-md text-text-secondary">
              {intl.t.format('onboarding.goal')}
            </p>
            <OnboardingStepList />
          </div>

          <main id="main" className="min-w-0">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
