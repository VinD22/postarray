import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { ApprovalsIndexScreen } from '@/features/approvals/approvals-index-screen';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return {
    title: intl.t.format('approval.title'),
    description: intl.t.format('web.approvals.index.description'),
  };
}

export default function ApprovalsPage(): ReactElement {
  return <ApprovalsIndexScreen />;
}
