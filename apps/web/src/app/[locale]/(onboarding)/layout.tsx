import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { PageTransitionProvider } from '@/components/motion';
import { ProductMark } from '@/components/brand/product-mark';
import { OnboardingStepList } from '@/components/onboarding/step-list';
import { Link } from '@/components/link';
import { getSession } from '@/lib/auth/require-session';
import { SessionProvider } from '@/lib/auth/session-context';
import { localizedHref } from '@/lib/i18n/routing';
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
    redirect(localizedHref('/sign-in?next=%2Fonboarding', intl.locale));
  }

  return (
    <SessionProvider session={session}>
      <div className="bg-surface-sunken min-h-dvh p-2 md:p-3">
        <header className="border-border-default bg-surface-raised shadow-raised rounded-lg border">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-3 py-2 md:px-4">
            <p className="text-title-sm text-text-primary flex items-center gap-3 font-semibold">
              <ProductMark className="size-7 p-[6px]" />
              <span>{intl.t.format('shell.appName')}</span>
            </p>
            <Link
              href="/"
              className="text-body-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary flex min-h-10 items-center rounded-md px-3"
            >
              {intl.t.format('onboarding.exit')}
            </Link>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-3 pt-3 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="border-border-default bg-surface-raised shadow-raised rounded-lg border p-5 lg:sticky lg:top-3 lg:self-start">
            <p className="text-body-md text-text-secondary pb-4">
              {intl.t.format('onboarding.goal')}
            </p>
            <OnboardingStepList />
          </aside>

          <main
            id="main"
            className="relay-onboarding-panel border-border-default bg-surface-canvas shadow-raised min-w-0 rounded-lg border p-5 md:p-8 [&_h1]:text-[clamp(2.25rem,1.8rem+1.5vw,3.5rem)] [&_h1]:leading-[0.98] [&_h1]:font-bold [&_h1]:tracking-[-0.04em]"
          >
            <PageTransitionProvider tier="onboarding">{children}</PageTransitionProvider>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
