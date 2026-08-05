'use client';

import { useState } from 'react';

import { Button } from '@relay/design-system/primitives';

import { ApiError, api, newIdempotencyKey, type SocialAuthProvider } from '@/lib/api';
import { useTranslations } from '@/lib/i18n';

const PROVIDERS: readonly {
  readonly id: SocialAuthProvider;
  readonly labelKey: string;
  readonly accessKey: string;
}[] = [
  { id: 'google', labelKey: 'auth.continueWithGoogle', accessKey: 'auth.provider.google.access' },
  {
    id: 'facebook',
    labelKey: 'auth.continueWithFacebook',
    accessKey: 'auth.provider.facebook.access',
  },
];

/**
 * Social sign in.
 *
 * What each provider shares is written under its button, before the click, not
 * behind a disclosure and not on the provider's own consent screen. The last
 * line says the thing people actually get wrong: this signs you in, it does not
 * connect an account to publish to.
 */
export function SocialButtons({
  intent,
  onError,
}: {
  readonly intent: 'sign-in' | 'sign-up';
  readonly onError: (message: string) => void;
}) {
  const t = useTranslations();
  const [pending, setPending] = useState<SocialAuthProvider | null>(null);

  const start = async (provider: SocialAuthProvider) => {
    setPending(provider);
    try {
      const { authorizationUrl } = await api.auth.beginSocial(
        { provider, intent, returnUrl: `${window.location.origin}/auth/callback` },
        newIdempotencyKey('social'),
      );
      window.location.assign(authorizationUrl);
    } catch (error) {
      setPending(null);
      onError(
        ApiError.is(error) && error.isOffline
          ? t('auth.failure.network')
          : t('auth.failure.provider', { provider }),
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-label uppercase tracking-wide text-text-tertiary">
        {t('auth.provider.title')}
      </h2>

      {PROVIDERS.map((provider) => (
        <div key={provider.id} className="flex flex-col gap-1.5">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            loading={pending === provider.id}
            loadingLabel={t('auth.submit.working')}
            disabled={pending !== null && pending !== provider.id}
            aria-describedby={`provider-access-${provider.id}`}
            onClick={() => {
              void start(provider.id);
            }}
          >
            {t(provider.labelKey)}
          </Button>
          <p
            id={`provider-access-${provider.id}`}
            className="text-body-sm text-text-tertiary"
          >
            {t(provider.accessKey)}
          </p>
        </div>
      ))}

      <p className="text-body-sm text-text-secondary">{t('auth.provider.note')}</p>
    </div>
  );
}
