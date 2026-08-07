'use client';

import { Link } from '@/components/link';
import { useState, type FormEvent } from 'react';

import { useAnnouncer } from '@relay/design-system/hooks';
import { Notice } from '@relay/design-system/patterns';
import { Button, Field, Input } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { ApiError, api, newIdempotencyKey } from '@/lib/api';
import { useLocalizedRouter, useTranslations } from '@/lib/i18n';
import {
  LEGAL_VERSION,
  PRIVACY_VERSION_HASH,
  TERMS_VERSION_HASH,
} from '@/lib/legal-versions';

const MIN_PASSWORD_LENGTH = 12;

/**
 * Create an account.
 *
 * The trial facts appear before the button, not after it. The form never says
 * whether an address is already registered: if it is, the API emails a sign in
 * link instead, and the copy under the field says so up front so the behaviour
 * is not a surprise.
 */
export function SignUpForm() {
  const t = useTranslations();
  const router = useLocalizedRouter();
  const { announce } = useAnnouncer();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const tooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;

  const fail = (message: string) => {
    setError(message);
    announce(message, 'assertive');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (tooShort) {
      return;
    }
    setError(null);
    setPending(true);
    try {
      await api.auth.signUpWithPassword(
        {
          email,
          password,
          displayName: name,
          locale: t.locale,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          termsVersionHash: TERMS_VERSION_HASH,
          privacyVersionHash: PRIVACY_VERSION_HASH,
          acceptedTerms: true,
        },
        newIdempotencyKey('signup'),
      );
      router.push(`/check-email?email=${encodeURIComponent(email)}`);
    } catch (caught) {
      if (ApiError.is(caught) && caught.isOffline) {
        fail(t('auth.failure.network'));
      } else if (ApiError.is(caught) && caught.isRateLimited) {
        fail(t('auth.rateLimited', { minutes: Math.ceil((caught.retryAfterSeconds ?? 60) / 60) }));
      } else {
        fail(t('auth.genericFailure'));
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-8', error !== null && 'relay-auth-invalid-pulse')}>
      <div className="flex flex-col gap-1">
        <h1 className="text-title-lg text-text-primary">{t('auth.signUp.title')}</h1>
        <p className="text-body-md text-text-secondary">{t('auth.signUp.subtitle')}</p>
      </div>

      {error === null ? null : (
        <Notice
          tone="destructive"
          liveness="alert"
          title={error}
          description={t('auth.failure.noAccountLeak')}
        />
      )}

      <Notice
        tone="info"
        title={t('auth.emailOnly.title')}
        description={t('auth.emailOnly.description')}
      />

      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label={t('common.name')} required>
          {(control) => (
            <Input
              {...control}
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          )}
        </Field>

        <Field label={t('auth.email.label')} description={t('auth.signUp.emailInUseNote')} required>
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

        <Field
          label={t('auth.password.label')}
          description={t('auth.password.requirements')}
          error={tooShort ? t('auth.password.strength.weak') : undefined}
          required
        >
          {(control) => (
            <Input
              {...control}
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              invalid={tooShort}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              addonEnd={
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword((current) => !current);
                  }}
                  /* Visual size is unchanged (`-my-3.5` cancels `py-3.5`); the
                     padding only grows the tap target to the DoD's 44px
                     minimum height (was 19px — WP-12 Lighthouse finding). */
                  className="text-body-sm text-text-secondary hover:text-text-primary -my-3.5 flex items-center py-3.5"
                >
                  {showPassword ? t('auth.password.hide') : t('auth.password.show')}
                </button>
              }
            />
          )}
        </Field>

        <p className="text-body-sm text-text-secondary">{t('auth.signUp.trialNote')}</p>

        <Button
          type="submit"
          variant="cta"
          size="lg"
          fullWidth
          loading={pending}
          loadingLabel={t('auth.submit.working')}
        >
          {t('auth.submit.signUp')}
        </Button>

        <p className="text-body-sm text-text-tertiary">
          {t('auth.terms.accept', { version: LEGAL_VERSION })}
        </p>
      </form>

      <p className="text-body-md text-text-secondary">
        {t('auth.haveAccount')}{' '}
        <Link href="/sign-in" className="text-text-accent font-medium hover:underline">
          {t('auth.switchToSignIn')}
        </Link>
      </p>
    </div>
  );
}
