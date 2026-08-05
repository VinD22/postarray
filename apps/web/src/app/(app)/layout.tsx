import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AppShell } from '@/components/shell';
import { SessionProvider } from '@/lib/auth/session-context';
import { requireSession } from '@/lib/auth/require-session';

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
  const session = await requireSession('/');

  return (
    <SessionProvider session={session}>
      <AppShell>{children}</AppShell>
    </SessionProvider>
  );
}
