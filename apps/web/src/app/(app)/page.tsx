import type { Metadata } from 'next';

import { HomeScreen } from '@/components/home/home-screen';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('home.title') };
}

export default function HomePage() {
  return <HomeScreen />;
}
