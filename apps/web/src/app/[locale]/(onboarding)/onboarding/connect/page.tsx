import type { Metadata } from 'next';

import { ConnectStep } from '@/components/onboarding/connect-step';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('onboarding.connect.title') };
}

export default function Page() {
  return <ConnectStep />;
}
