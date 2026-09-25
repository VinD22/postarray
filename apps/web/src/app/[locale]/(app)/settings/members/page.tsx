import type { Metadata } from 'next';
import { getRequestIntl } from '@/lib/i18n/server';
import type { ReactNode } from 'react';

import { MembersScreen } from '@/features/settings/members/members-screen';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('settings.members.title') };
}

/**
 * Server component. It renders the screen and nothing else: every string on
 * this route comes from the catalog through the client component, so there is
 * no English literal here and no metadata to keep in sync with it.
 */
export default function Page(): ReactNode {
  return <MembersScreen />;
}
