import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { getRequestIntl } from '@/lib/i18n/server';

/**
 * The signed-out frame.
 *
 * A form column and, from 1024px, a quiet editorial column that says what the
 * product does in three factual sentences. No logos, no testimonials, no
 * screenshots of invented dashboards: nothing on this page claims anything we
 * cannot show.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AuthLayout({ children }: { readonly children: ReactNode }) {
  const intl = await getRequestIntl();

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <main id="main" className="flex flex-col justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[26rem]">
          <p className="pb-8 text-title-md text-text-primary">{intl.t.format('shell.appName')}</p>
          {children}
        </div>
      </main>

      <aside className="hidden flex-col justify-center border-s border-border-subtle bg-surface-sunken px-12 py-10 lg:flex">
        <div className="max-w-[34ch]">
          <h2 className="font-serif text-title-lg text-balance text-text-primary">
            {intl.t.format('auth.aside.title')}
          </h2>
          <ul className="flex flex-col gap-4 pt-6">
            {[
              'auth.aside.point.receipts',
              'auth.aside.point.approvals',
              'auth.aside.point.surfaces',
            ].map((key) => (
              <li key={key} className="border-t border-border-subtle pt-4 text-body-md text-text-secondary">
                {intl.t.format(key)}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
