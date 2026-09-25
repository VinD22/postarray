import type { Metadata } from 'next';
import { getRequestIntl } from '@/lib/i18n/server';
import type { ReactNode } from 'react';

import { SettingsIndex } from '@/features/settings/components/settings-index';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('settings.title') };
}

export default function Page(): ReactNode {
  return <SettingsIndex />;
}
