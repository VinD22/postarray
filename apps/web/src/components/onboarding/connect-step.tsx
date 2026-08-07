'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Notice } from '@relay/design-system/patterns';
import { Button, Label, RadioGroup, RadioGroupItem } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { ApiError, api, newIdempotencyKey, type ProviderId } from '@/lib/api';
import { useAvailableProviders } from '@/lib/api/hooks';
import { useTranslations } from '@/lib/i18n';
import { useSession } from '@/lib/auth/session-context';
import { PosterCard } from '@/features/marketing/components/loud/poster-card';
import { ProviderMark } from '@/features/connections/provider';
import { requireFirst } from '@/lib/utils/require-first';

/**
 * What each platform will be asked for.
 *
 * These are permission purposes in plain language, not raw scope strings: the
 * exact scope names are shown on the connection's capability panel after it is
 * connected. The point of this list is that nobody arrives at a provider
 * consent screen without knowing what it will ask for.
 */
const PROVIDERS: readonly {
  readonly id: ProviderId;
  readonly name: string;
  readonly permissionKeys: readonly string[];
}[] = [
  {
    id: 'x',
    name: 'X',
    permissionKeys: [
      'capability.feature.text',
      'capability.feature.thread',
      'capability.feature.image',
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    permissionKeys: [
      'capability.feature.text',
      'capability.feature.image',
      'capability.feature.document',
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    permissionKeys: [
      'capability.feature.image',
      'capability.feature.carousel',
      'capability.feature.video',
      'capability.feature.firstComment',
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    permissionKeys: [
      'capability.feature.text',
      'capability.feature.image',
      'capability.feature.destinations',
    ],
  },
];

/**
 * Step 5: connect one account.
 *
 * One is enough to reach a first post. The permission list is on the page,
 * before the handoff, and the button says where it is about to send you.
 *
 * Each provider is a hover-lift `PosterCard` (WP-4) rather than a plain radio
 * row: `RadioGroup` renders with `display: contents` so its own layout
 * disappears and the cards become direct items of the surrounding CSS grid,
 * while the underlying `role="radiogroup"` / `role="radio"` semantics (and
 * `Label`'s `htmlFor` association) are unchanged from the plain-row version.
 */
export function ConnectStep() {
  const t = useTranslations();
  const router = useRouter();
  const { brands } = useSession();
  const availableProviders = useAvailableProviders();

  const [selected, setSelected] = useState<ProviderId>('x');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const providerOptions = useMemo(() => {
    const available = new Set(availableProviders.data ?? []);
    return PROVIDERS.filter((entry) => available.has(entry.id));
  }, [availableProviders.data]);
  const provider =
    providerOptions.find((entry) => entry.id === selected) ??
    providerOptions[0] ??
    requireFirst(PROVIDERS, 'provider');

  useEffect(() => {
    if (
      providerOptions[0] !== undefined &&
      !providerOptions.some((entry) => entry.id === selected)
    ) {
      setSelected(providerOptions[0].id);
    }
  }, [providerOptions, selected]);

  const connect = async () => {
    const brand = brands[0];
    if (brand === undefined) {
      setError(t('error.validation_failed.message'));
      return;
    }
    setPending(true);
    setError(null);
    try {
      const { authorizationUrl } = await api.connections.beginOAuth(
        { provider: selected, brandId: brand.id, returnUrl: '/onboarding/compose' },
        newIdempotencyKey('oauth'),
      );
      window.location.assign(authorizationUrl);
    } catch (caught) {
      setPending(false);
      setError(
        ApiError.is(caught)
          ? t(caught.messageKey, caught.messageValues)
          : t('error.internal.message'),
      );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-title-lg text-text-primary">{t('onboarding.connect.title')}</h1>
        <p className="prose-measure text-body-md text-text-secondary">
          {t('onboarding.connect.help')}
        </p>
      </div>

      {error === null ? null : <Notice tone="destructive" liveness="alert" title={error} />}

      <fieldset className="flex flex-col gap-3">
        <legend className="text-label text-text-tertiary pb-1 tracking-wide uppercase">
          {t('onboarding.connect.chooseProvider')}
        </legend>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <RadioGroup
            value={selected}
            onValueChange={(next) => {
              setSelected(next as ProviderId);
            }}
            className="contents"
          >
            {providerOptions.map((entry) => {
              const id = `provider-${entry.id}`;
              const isSelected = selected === entry.id;
              return (
                <PosterCard
                  key={entry.id}
                  tone="paper"
                  className={cn(
                    'flex min-h-11 items-center gap-3 p-4',
                    isSelected && 'border-accent shadow-hard-lg',
                  )}
                >
                  <RadioGroupItem value={entry.id} id={id} />
                  <ProviderMark provider={entry.id} />
                  <Label
                    htmlFor={id}
                    className="text-body-md text-text-primary flex-1 cursor-pointer font-medium"
                  >
                    {entry.name}
                  </Label>
                </PosterCard>
              );
            })}
          </RadioGroup>
        </div>
        {!availableProviders.isPending && providerOptions.length === 0 ? (
          <Notice
            tone="warning"
            title={t('error.not_implemented.message')}
            description={t('error.not_implemented.action')}
          />
        ) : null}
      </fieldset>

      {providerOptions.length > 0 ? (
        <section aria-live="polite" className="flex flex-col gap-2">
          <h2 className="text-title-sm text-text-primary">
            {t('onboarding.connect.permissionsTitle', { provider: provider.name })}
          </h2>
          <p className="prose-measure text-body-md text-text-secondary">
            {t('connection.permissions.explainBeforeOAuth', { provider: provider.name })}
          </p>
          <ul className="border-border-subtle flex flex-col border-t">
            {provider.permissionKeys.map((key) => (
              <li
                key={key}
                className="border-border-subtle text-body-md text-text-primary border-b py-2"
              >
                {t(key)}
              </li>
            ))}
          </ul>
          <p className="prose-measure text-body-sm text-text-tertiary">
            {t('onboarding.connect.permissionsFooter')}
          </p>
        </section>
      ) : null}

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="lg"
            loading={pending}
            loadingLabel={t('loading.connecting', { provider: provider.name })}
            disabled={providerOptions.length === 0 || availableProviders.isPending}
            onClick={() => {
              void connect();
            }}
          >
            {t('action.connect')}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              router.push('/onboarding/compose');
            }}
          >
            {t('onboarding.skipForNow')}
          </Button>
        </div>

        <p className="text-body-sm text-text-tertiary">
          {t('onboarding.connect.opensProvider', { provider: provider.name })}
        </p>
        <p className="prose-measure text-body-sm text-text-tertiary">
          {t('onboarding.connect.skipNote')}
        </p>
      </div>
    </div>
  );
}
