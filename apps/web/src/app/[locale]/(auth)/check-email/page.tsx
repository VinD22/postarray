import type { Metadata } from 'next';
import { Suspense } from 'react';

import { CheckEmail } from '@/components/auth/check-email';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('auth.magicLink.checkEmail') };
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={null}>
      <CheckEmail />
    </Suspense>
  );
}
