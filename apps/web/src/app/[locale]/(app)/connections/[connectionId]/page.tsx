import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { ConnectionDetailScreen } from '@/features/connections/connection-detail-screen';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('capability.title') };
}

/**
 * One connected account: its health, its permissions and exactly what it can
 * and cannot do, generated from its own versioned capability snapshot rather
 * than from the platform in general.
 */
export default async function ConnectionDetailPage({
  params,
}: {
  readonly params: Promise<{ readonly connectionId: string }>;
}): Promise<ReactElement> {
  const { connectionId } = await params;
  return <ConnectionDetailScreen connectionId={connectionId} listHref="/connections" />;
}
