import type { Metadata } from 'next';

import { ActionCenterScreen } from '@/components/shell/action-center-screen';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('actionCenter.title') };
}

export default function ActionCenterPage() {
  return <ActionCenterScreen />;
}
