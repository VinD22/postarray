import type { Metadata } from 'next';
import { Suspense } from 'react';

import { SignInForm } from '@/components/auth/sign-in-form';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('auth.signIn.title') };
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
