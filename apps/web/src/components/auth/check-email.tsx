'use client';

import { Link } from '@/components/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { MailCheck } from 'lucide-react';

import { Notice } from '@relay/design-system/patterns';
import { Button, Field, Input } from '@relay/design-system/primitives';

import { ApiError, api, newIdempotencyKey } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';

const MAGIC_LINK_MINUTES = 15;
const RESEND_SECONDS = 60;

/**
 * "Check your email".
 *
 * The sentence is conditional on purpose: it never confirms that an address is
 * registered. The resend is rate limited in the UI as well as the API, with the
 * remaining seconds visible rather than a button that silently does nothing.
 */
export function CheckEmail() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const next = searchParams.get('next') ?? '/';

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [status, setStatus] = useState<'idle' | 'sending' | 'failed'>('idle');
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [secondsLeft]);

  const resend = async () => {
    setStatus('sending');
    try {
      await api.auth.sendMagicLink(
        { identifier: email, locale: t.locale },
        newIdempotencyKey('magiclink'),
      );
      setSecondsLeft(RESEND_SECONDS);
      setStatus('idle');
    } catch {
      setStatus('failed');
    }
  };

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    setVerificationError(null);
    setVerifying(true);
    try {
      await api.auth.verifyOneTimeCode(
        { identifier: email, code },
        newIdempotencyKey('verify-otp'),
      );
      router.push(next);
    } catch (error) {
      setVerificationError(
        ApiError.is(error) && error.isRateLimited
          ? t('auth.rateLimited', {
              minutes: Math.ceil((error.retryAfterSeconds ?? 60) / 60),
            })
          : t('auth.otp.invalid'),
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <span
        aria-hidden="true"
        className="relay-icon-draw border-border-bold bg-accent-subtle text-text-accent shadow-hard-sm inline-flex size-12 items-center justify-center rounded-full border-2"
      >
        <MailCheck className="size-6" strokeWidth={2} />
      </span>

      <div className="flex flex-col gap-1">
        <h1 className="text-title-lg text-text-primary">{t('auth.otp.title')}</h1>
        <p className="text-body-md text-text-secondary">
          {t('auth.otp.sent', { minutes: MAGIC_LINK_MINUTES })}
        </p>
      </div>

      {email === '' ? null : (
        <p className="text-body-md text-text-primary">{t('auth.otp.address', { email })}</p>
      )}

      {status === 'failed' ? (
        <Notice tone="destructive" liveness="alert" title={t('auth.genericFailure')} />
      ) : null}

      {verificationError === null ? null : (
        <Notice tone="destructive" liveness="alert" title={verificationError} />
      )}

      <form className="flex flex-col gap-4" onSubmit={verify}>
        <Field label={t('auth.otp.label')} required>
          {(control) => (
            <Input
              {...control}
              type="text"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, '').slice(0, 6));
              }}
            />
          )}
        </Field>
        <Button
          type="submit"
          variant="cta"
          size="lg"
          fullWidth
          disabled={email === '' || code.length !== 6}
          loading={verifying}
          loadingLabel={t('auth.submit.working')}
        >
          {t('auth.otp.verify')}
        </Button>
      </form>

      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          disabled={secondsLeft > 0 || email === ''}
          loading={status === 'sending'}
          loadingLabel={t('auth.submit.working')}
          onClick={() => {
            void resend();
          }}
        >
          {t('auth.otp.resend')}
        </Button>
        {secondsLeft > 0 ? (
          <p aria-live="polite" className="text-body-sm text-text-tertiary">
            {t('auth.otp.resendIn', { seconds: secondsLeft })}
          </p>
        ) : null}
      </div>

      <p className="text-body-md text-text-secondary">
        <Link href="/sign-in" className="text-text-accent font-medium hover:underline">
          {t('auth.otp.wrongAddress')}
        </Link>
      </p>
    </div>
  );
}
