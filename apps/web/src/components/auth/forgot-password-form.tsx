'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import { Notice } from '@relay/design-system/patterns';
import { Button, Field, Input } from '@relay/design-system/primitives';

import { api, newIdempotencyKey } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';

/**
 * Password reset request.
 *
 * The confirmation is identical whether or not the address exists, and it is
 * shown even when the request fails at the transport layer, because the one
 * thing this screen must never do is behave differently for a registered
 * address than for an unregistered one.
 */
export function ForgotPasswordForm() {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      await api.auth.requestPasswordReset({ email }, newIdempotencyKey('reset'));
    } catch {
      // Deliberately swallowed. Reporting a failure here would leak whether the
      // address exists, and the API has already recorded the attempt.
    } finally {
      setPending(false);
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-title-lg text-text-primary">{t('auth.resetPassword.title')}</h1>
        <Notice tone="info" liveness="status" title={t('auth.resetPassword.sent')} />
        <p className="text-body-md text-text-secondary">
          <Link href="/sign-in" className="font-medium text-text-accent hover:underline">
            {t('action.signIn')}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-title-lg text-text-primary">{t('auth.resetPassword.title')}</h1>
        <p className="text-body-md text-text-secondary">{t('auth.forgotPassword')}</p>
      </div>

      <Field label={t('auth.email.label')} required>
        {(control) => (
          <Input
            {...control}
            type="email"
            name="email"
            autoComplete="email"
            placeholder={t('auth.email.placeholder')}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        )}
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={pending}
        loadingLabel={t('auth.submit.working')}
      >
        {t('action.continue')}
      </Button>

      <p className="text-body-md text-text-secondary">
        <Link href="/sign-in" className="font-medium text-text-accent hover:underline">
          {t('auth.switchToSignIn')}
        </Link>
      </p>
    </form>
  );
}
