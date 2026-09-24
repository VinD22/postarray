import type { Metadata } from 'next';
import { getRequestIntl } from '@/lib/i18n/server';
import type { ReactElement } from 'react';

import { FeedListScreen } from '@/features/automation/feed-list-screen';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('automation.rss.title') };
}

export default function FeedsPage(): ReactElement {
  return <FeedListScreen />;
}
