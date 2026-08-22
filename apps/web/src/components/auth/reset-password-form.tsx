'use client';

import { Link } from '@/components/link';
import { useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { useAnnouncer } from '@relay/design-system/hooks';
import { Notice } from '@relay/design-system/patterns';
import { Button, Field, Input } from '@relay/design-system/primitives';

import { ApiError, api } from '@/lib/api';
import { useLocalizedRouter, useTranslations } from '@/lib/i18n';

/**
 * Choose a new password, from the link in the reset email.
 *
 * The API's `sendPasswordReset` points the provider at `/{locale}/reset-password`
 * (`neon-identity.provider.ts`), so this is where a real person lands after
 * asking for a reset. Until now the route did not exist and the link produced a
 * 404, which is the worst possible ending for a flow somebody only reaches when
 * they are already locked out.
 *
 * Four states, all designed rather than inherited:
 *
 *  - **No token.** The page was opened directly. It says so and offers the
 *    request form, rather than showing two password boxes that cannot work.
 *  - **Mismatch.** Checked in the form, before anything is sent. Whether two
 *    boxes match is not a question for the server, and sending the same secret
 *    twice only widens what a log could capture.
 *  - **Invalid or expired token, or rate limited.** Both are answered plainly,
 *    because the person is holding a link from their own inbox. Neither answer
 *    names an account, so this is not an enumeration surface.
 *  - **Success.** One sentence and a route to sign in. No session is
 *    established here: the new password is used at sign-in, once, deliberately.
 */
export function ResetPasswordForm() {
  const t = useTranslations();
  const router = useLocalizedRouter();
  const searchParams = useSearchParams();
  const { announce } = useAnnouncer();

  // Better Auth sends the token as `token`; a few provider builds use `code`.
  // Reading both costs nothing and turns a working link into a working page.
  const token = searchParams.get('token') ?? searchParams.get('code') ?? '';

  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mismatch, setMismatch] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const fail = (message: string) => {
    setError(message);
    announce(message, 'assertive');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password !== confirmation) {
      setMismatch(true);
      announce(t('auth.newPassword.mismatch'), 'assertive');
      return;
    }
    setMismatch(false);
    setPending(true);
    try {
      await api.auth.completePasswordReset({ token, newPassword: password });
      setDone(true);
      announce(t('auth.resetPassword.done'), 'polite');
    } catch (caught) {
      if (ApiError.is(caught) && caught.isOffline) {
        fail(t('auth.failure.network'));
      } else if (ApiError.is(caught) && caught.isRateLimited) {
        fail(t('auth.rateLimited', { minutes: Math.ceil((caught.retryAfterSeconds ?? 60) / 60) }));
      } else {
        fail(t('auth.newPassword.linkInvalid'));
      }
    } finally {
      setPending(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-title-lg text-text-primary">{t('auth.resetPassword.title')}</h1>
        <Notice tone="success" liveness="status" title={t('auth.resetPassword.done')} />
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => {
            router.push('/sign-in');
          }}
        >
          {t('auth.newPassword.signInNow')}
        </Button>
      </div>
    );
  }

  if (token === '') {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-title-lg text-text-primary">{t('auth.resetPassword.title')}</h1>
        <Notice tone="warning" liveness="status" title={t('auth.newPassword.linkMissing')} />
        <p className="text-body-md text-text-secondary">
          <Link href="/forgot-password" className="text-text-accent font-medium hover:underline">
            {t('auth.newPassword.linkInvalidAction')}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-title-lg text-text-primary">{t('auth.resetPassword.title')}</h1>
        <p className="text-body-md text-text-secondary">{t('auth.newPassword.help')}</p>
      </div>

      {error === null ? null : (
        <Notice
          tone="destructive"
          liveness="alert"
          title={error}
          description={t('auth.newPassword.linkInvalidAction')}
        />
      )}

      <Field
        label={t('auth.newPassword.label')}
        description={t('auth.password.requirements')}
        required
      >
        {(control) => (
          <Input
            {...control}
            type="password"
            name="new-password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setMismatch(false);
            }}
          />
        )}
      </Field>

      <Field
        label={t('auth.newPassword.confirmLabel')}
        error={mismatch ? t('auth.newPassword.mismatch') : undefined}
        required
      >
        {(control) => (
          <Input
            {...control}
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => {
              setConfirmation(event.target.value);
              setMismatch(false);
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
        disabled={password.length === 0 || confirmation.length === 0}
      >
        {t('auth.newPassword.submit')}
      </Button>

      <p className="text-body-md text-text-secondary">
        <Link href="/sign-in" className="text-text-accent font-medium hover:underline">
          {t('auth.switchToSignIn')}
        </Link>
      </p>
    </form>
  );
}
