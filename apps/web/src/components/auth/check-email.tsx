'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Notice } from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';

import { api, newIdempotencyKey } from '@/lib/api';
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
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [status, setStatus] = useState<'idle' | 'sending' | 'failed'>('idle');

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
        { email, returnUrl: `${window.location.origin}/` },
        newIdempotencyKey('magiclink'),
      );
      setSecondsLeft(RESEND_SECONDS);
      setStatus('idle');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-title-lg text-text-primary">{t('auth.magicLink.checkEmail')}</h1>
        <p className="text-body-md text-text-secondary">
          {t('auth.magicLink.sent', { minutes: MAGIC_LINK_MINUTES })}
        </p>
      </div>

      {email === '' ? null : (
        <p className="text-body-md text-text-primary">
          {t('auth.checkEmail.body', { email })}
        </p>
      )}

      {status === 'failed' ? (
        <Notice tone="destructive" liveness="alert" title={t('auth.genericFailure')} />
      ) : null}

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
          {t('auth.magicLink.resend')}
        </Button>
        {secondsLeft > 0 ? (
          <p aria-live="polite" className="text-body-sm text-text-tertiary">
            {t('auth.magicLink.resendIn', { seconds: secondsLeft })}
          </p>
        ) : null}
      </div>

      <p className="text-body-md text-text-secondary">
        <Link href="/sign-in" className="font-medium text-text-accent hover:underline">
          {t('auth.checkEmail.wrongAddress')}
        </Link>
      </p>
    </div>
  );
}
