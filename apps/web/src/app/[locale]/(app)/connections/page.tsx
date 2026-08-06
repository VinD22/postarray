import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { ConnectionsContainer } from '@/features/connections/connections-container';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return {
    title: intl.t.format('connection.title'),
    description: intl.t.format('connection.subtitle'),
  };
}

export default function ConnectionsPage(): ReactElement {
  return <ConnectionsContainer />;
}
