import type { Metadata } from 'next';
import { Suspense } from 'react';

import { DoneStep } from '@/components/onboarding/done-step';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('onboarding.done.title') };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DoneStep />
    </Suspense>
  );
}
