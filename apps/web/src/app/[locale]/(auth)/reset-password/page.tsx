import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('auth.resetPassword.title') };
}

/**
 * Where the reset email lands. The token arrives as a search parameter, so the
 * form reads it on the client behind a `Suspense` boundary, exactly as the
 * sign-in page does with `next`.
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
