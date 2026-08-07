import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ComposeStep } from '@/components/onboarding/compose-step';
import { OAuthCallbackNotice } from '@/features/connections/oauth-callback-notice';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('onboarding.content.title') };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <div className="flex flex-col gap-6">
        <OAuthCallbackNotice />
        <ComposeStep />
      </div>
    </Suspense>
  );
}
