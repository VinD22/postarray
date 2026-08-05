import type { Metadata } from 'next';

import { UseCaseStep } from '@/components/onboarding/use-case-step';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('onboarding.role.title') };
}

export default function Page() {
  return <UseCaseStep />;
}
