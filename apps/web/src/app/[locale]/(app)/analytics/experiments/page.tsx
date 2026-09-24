import type { Metadata } from 'next';
import { getRequestIntl } from '@/lib/i18n/server';
import type { ReactElement } from 'react';

import { ExperimentsScreen } from '@/features/analytics/experiments-screen';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('analytics.experiment.title') };
}

export default function ExperimentsPage(): ReactElement {
  return <ExperimentsScreen />;
}
