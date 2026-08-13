import type { Metadata } from 'next';

import { GrowthScreen } from '@/features/growth';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('growth.title') };
}

export default function GrowthPage() {
  return <GrowthScreen />;
}
