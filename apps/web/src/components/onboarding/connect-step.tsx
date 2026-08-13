'use client';

import { useEffect, useMemo, useState } from 'react';

import { Notice } from '@relay/design-system/patterns';
import { Button, Label, RadioGroup, RadioGroupItem } from '@relay/design-system/primitives';
import { cn, panelSurface } from '@relay/design-system/utils';

import { Check } from 'lucide-react';

import { ApiError, api, newIdempotencyKey, type ProviderId } from '@/lib/api';
import { useAvailableProviders, useConnections } from '@/lib/api/hooks';
import { useLocalizedRouter, useTranslations } from '@/lib/i18n';
import { useSession } from '@/lib/auth/session-context';
import { LiveBadge } from '@/components/motion';
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
 * Each provider is a `panelSurface` card rather than a plain radio row:
 * `RadioGroup` renders with `display: contents` so its own layout disappears
 * and the cards become direct items of the surrounding CSS grid, while the
 * underlying `role="radiogroup"` / `role="radio"` semantics (and `Label`'s
 * `htmlFor` association) are unchanged from the plain-row version.
 *
 * Selection is carried by the radio control itself; the accent border is a
 * second, redundant signal, never the only one.
 */
export function ConnectStep() {
  const t = useTranslations();
  const router = useLocalizedRouter();
  const { project } = useSession();
  const availableProviders = useAvailableProviders();
  /*
   * Accounts that have already come back from a provider consent screen.
   *
   * This step is the one place in the product a person leaves and returns to,
   * and on the way back this list goes from empty to holding their account.
   * `LiveBadge` animates only on the false-to-true transition, so the dot
   * settles exactly once, on the render where the account arrives, and never
   * again on a refetch. Nothing about the arrival is guessed: the row is
   * drawn from the connections read, not from a query parameter.
   */
  const connections = useConnections();
  const connected = connections.data?.data ?? [];

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
    if (project === null) {
      setError(t('error.validation_failed.message'));
      return;
    }
    setPending(true);
    setError(null);
    try {
      const { authorizationUrl } = await api.connections.beginOAuth(
        { provider: selected, brandId: project.id, returnUrl: '/onboarding/compose' },
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

      {connected.length === 0 ? null : (
        <section aria-labelledby="onboarding-connected" className="flex flex-col gap-2">
          <h2 id="onboarding-connected" className="text-title-sm text-text-primary">
            {t('onboarding.live.connectedHeading')}
          </h2>
          <ul className="border-border-subtle flex flex-col border-t">
            {connected.map((connection) => (
              <li
                key={connection.id}
                className="border-border-subtle flex flex-wrap items-center gap-x-3 gap-y-1 border-b py-2.5"
              >
                <ProviderMark provider={connection.provider} />
                <span className="text-body-md text-text-primary min-w-0 flex-1 truncate">
                  {connection.displayName}
                </span>
                <LiveBadge
                  live
                  label={t('onboarding.live.connected')}
                  icon={<Check aria-hidden="true" className="size-3.5" />}
                />
              </li>
            ))}
          </ul>
          <p className="text-body-sm text-text-tertiary">{t('onboarding.live.connectedNote')}</p>
        </section>
      )}

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
                <div
                  key={entry.id}
                  className={cn(
                    panelSurface,
                    'flex min-h-11 items-center gap-3 p-4',
                    isSelected && 'border-accent',
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
                </div>
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
