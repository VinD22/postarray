import type { Metadata } from 'next';

import { ComposeStep } from '@/components/onboarding/compose-step';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('onboarding.content.title') };
}

export default function Page() {
  return <ComposeStep />;
}
