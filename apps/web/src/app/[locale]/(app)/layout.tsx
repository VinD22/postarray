import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';

import { AppShell } from '@/components/shell';
import { SessionProvider } from '@/lib/auth/session-context';
import { ACTIVE_PROJECT_COOKIE } from '@/lib/auth/project-selection';
import { requireSession } from '@/lib/auth/require-session';
import { IntlProvider } from '@/lib/i18n/provider';
import { getRequestIntl } from '@/lib/i18n/server';

/**
 * The signed-in area.
 *
 * The session is resolved once here, on the server, and handed to the client
 * tree. Every workspace-scoped cache key reads from it, so a workspace switch
 * cannot leave another tenant's rows on the screen.
 */
// The product is behind a session. Nothing here belongs in a search index.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AppLayout({ children }: { readonly children: ReactNode }) {
  const session = await requireSession('/home');
  const cookieStore = await cookies();
  const activeProjectId = cookieStore.get(ACTIVE_PROJECT_COOKIE)?.value ?? null;
  // This tree is already per request because of the session, so resolving the
  // reader's locale and the workspace time zone here costs nothing extra. The
  // inner provider overrides the static default set in the root layout.
  const intl = await getRequestIntl(session.workspace.timeZone);

  return (
    <SessionProvider session={session} activeProjectId={activeProjectId}>
      <IntlProvider locale={intl.locale} timeZone={intl.timeZone} catalog={intl.catalog}>
        <AppShell>{children}</AppShell>
      </IntlProvider>
    </SessionProvider>
  );
}
