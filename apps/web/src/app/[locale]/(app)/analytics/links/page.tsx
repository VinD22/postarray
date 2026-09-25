import type { Metadata } from 'next';
import { getRequestIntl } from '@/lib/i18n/server';
import type { ReactElement } from 'react';

import { LinksListScreen } from '@/features/links/links-list-screen';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('analytics.links.title') };
}

export default function TrackedLinksPage(): ReactElement {
  return <LinksListScreen />;
}
