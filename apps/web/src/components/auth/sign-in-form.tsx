'use client';

import { Link } from '@/components/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { useAnnouncer } from '@relay/design-system/hooks';
import { Notice } from '@relay/design-system/patterns';
import {
  Button,
  Field,
  Input,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { ApiError, api, newIdempotencyKey } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';

import { SocialButtons } from './social-buttons';

type Method = 'password' | 'magic-link' | 'username';

/**
 * Sign in.
 *
 * Three paths, all first class: a password with an email address, a one time
 * link, and the username alias. The alias is explained rather than implied,
 * because a username that is not a second account is a thing people get wrong.
 *
 * Every failure message is identical in shape whether or not the account
 * exists. The form never says "no account with that email", because that turns
 * the sign in page into an account enumeration endpoint.
 */
export function SignInForm() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { announce } = useAnnouncer();

  const [method, setMethod] = useState<Method>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const next = searchParams.get('next') ?? '/';

  const fail = (message: string) => {
    setError(message);
    announce(message, 'assertive');
  };

  const submitPassword = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      await api.auth.signInWithPassword({ identifier, password }, newIdempotencyKey('signin'));
      router.push(next);
    } catch (caught) {
      if (ApiError.is(caught) && caught.isOffline) {
        fail(t('auth.failure.network'));
      } else if (ApiError.is(caught) && caught.isRateLimited) {
        fail(t('auth.rateLimited', { minutes: Math.ceil((caught.retryAfterSeconds ?? 60) / 60) }));
      } else {
        fail(
          method === 'username'
            ? t('auth.failure.usernameCredentials')
            : t('auth.failure.credentials'),
        );
      }
    } finally {
      setPending(false);
    }
  };

  const submitMagicLink = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      await api.auth.sendMagicLink(
        { email: identifier, returnUrl: `${window.location.origin}${next}` },
        newIdempotencyKey('magiclink'),
      );
      router.push(`/check-email?email=${encodeURIComponent(identifier)}`);
    } catch (caught) {
      fail(
        ApiError.is(caught) && caught.isOffline
          ? t('auth.failure.network')
          : t('auth.genericFailure'),
      );
    } finally {
      setPending(false);
    }
  };

  const identifierIsUsername = method === 'username';

  return (
    <div className={cn('flex flex-col gap-8', error !== null && 'relay-auth-invalid-pulse')}>
      <div className="flex flex-col gap-1">
        <h1 className="text-title-lg text-text-primary">{t('auth.signIn.title')}</h1>
        <p className="text-body-md text-text-secondary">{t('auth.signIn.subtitle')}</p>
      </div>

      {error === null ? null : (
        <Notice
          tone="destructive"
          liveness="alert"
          title={error}
          description={t('auth.failure.noAccountLeak')}
        />
      )}

      <SocialButtons intent="sign-in" onError={fail} />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-body-sm text-text-tertiary">{t('auth.orUseEmail')}</span>
        <Separator className="flex-1" />
      </div>

      <Tabs
        value={method}
        onValueChange={(value) => {
          setMethod(value as Method);
          setError(null);
        }}
      >
        <TabsList aria-label={t('auth.method.chooseLabel')}>
          <TabsTrigger value="password">{t('auth.method.password')}</TabsTrigger>
          <TabsTrigger value="magic-link">{t('auth.method.magicLink')}</TabsTrigger>
          <TabsTrigger value="username">{t('auth.method.username')}</TabsTrigger>
        </TabsList>

        <TabsContent value="password">
          <form onSubmit={submitPassword} className="flex flex-col gap-4 pt-4">
            <Field label={t('auth.email.label')} required>
              {(control) => (
                <Input
                  {...control}
                  type="email"
                  name="email"
                  autoComplete="username"
                  placeholder={t('auth.email.placeholder')}
                  value={identifier}
                  onChange={(event) => {
                    setIdentifier(event.target.value);
                  }}
                />
              )}
            </Field>

            <Field
              label={t('auth.password.label')}
              required
              labelAction={
                <Link
                  href="/forgot-password"
                  /* Visual size is unchanged (`-my-3.5` cancels `py-3.5`);
                     the padding only grows the tap target to the DoD's 44px
                     minimum height (was 15.5px — WP-12 Lighthouse finding). */
                  className="text-body-sm text-text-accent hover:underline -my-3.5 inline-block py-3.5"
                >
                  {t('auth.forgotPassword')}
                </Link>
              }
            >
              {(control) => (
                <Input
                  {...control}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder={t('auth.password.placeholder')}
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
                      /* Visual size is unchanged (`-my-3.5` cancels `py-3.5`);
                         the padding only grows the tap target to the DoD's
                         44px minimum height (was 19px — WP-12 Lighthouse
                         finding). */
                      className="text-body-sm text-text-secondary hover:text-text-primary -my-3.5 flex items-center py-3.5"
                    >
                      {showPassword ? t('auth.password.hide') : t('auth.password.show')}
                    </button>
                  }
                />
              )}
            </Field>

            <Button
              type="submit"
              variant="cta"
              size="lg"
              fullWidth
              loading={pending}
              loadingLabel={t('auth.submit.working')}
            >
              {t('auth.submit.signIn')}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="magic-link">
          <form onSubmit={submitMagicLink} className="flex flex-col gap-4 pt-4">
            <Field
              label={t('auth.email.label')}
              description={t('auth.magicLink.checkEmail')}
              required
            >
              {(control) => (
                <Input
                  {...control}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t('auth.email.placeholder')}
                  value={identifier}
                  onChange={(event) => {
                    setIdentifier(event.target.value);
                  }}
                />
              )}
            </Field>

            <Button
              type="submit"
              variant="cta"
              size="lg"
              fullWidth
              loading={pending}
              loadingLabel={t('auth.submit.working')}
            >
              {t('auth.magicLink.send')}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="username">
          <form onSubmit={submitPassword} className="flex flex-col gap-4 pt-4">
            <Field
              label={t('auth.username.label')}
              description={t('auth.username.aliasNote')}
              required
            >
              {(control) => (
                <Input
                  {...control}
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder={t('auth.username.placeholder')}
                  value={identifierIsUsername ? identifier : ''}
                  onChange={(event) => {
                    setIdentifier(event.target.value);
                  }}
                />
              )}
            </Field>

            <Field label={t('auth.password.label')} required>
              {(control) => (
                <Input
                  {...control}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              )}
            </Field>

            <Button
              type="submit"
              variant="cta"
              size="lg"
              fullWidth
              loading={pending}
              loadingLabel={t('auth.submit.working')}
            >
              {t('auth.submit.signIn')}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="text-body-md text-text-secondary">
        {t('auth.noAccount')}{' '}
        <Link href="/sign-up" className="text-text-accent font-medium hover:underline">
          {t('auth.switchToSignUp')}
        </Link>
      </p>
    </div>
  );
}
