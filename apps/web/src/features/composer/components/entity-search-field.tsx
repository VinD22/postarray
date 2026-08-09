'use client';

/**
 * Provider-backed entity search, used for both mentions and destinations.
 *
 * The product rule this component exists to hold: a result is only selectable
 * when it carries a provider external ID. Typed text is never promoted to a
 * native tag, and the resolved state is printed under the field so nobody has
 * to guess whether a tag is real.
 */

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Combobox, type ComboboxItem } from '@relay/design-system/primitives';
import { CapabilityBadge } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { CapabilitySupport, ProviderId } from '@relay/contracts';

import { PROVIDER_LABEL } from './provider-identity';

export interface ResolvedEntity {
  readonly externalId: string;
  readonly label: string;
  readonly secondary: string | null;
}

export interface EntitySearchFieldProps {
  readonly label: string;
  readonly provider: ProviderId;
  readonly support: CapabilitySupport;
  readonly value: ResolvedEntity | null;
  readonly onChange: (value: ResolvedEntity | null) => void;
  readonly search: (query: string) => Promise<readonly ResolvedEntity[]>;
  readonly required?: boolean;
  readonly invalid?: boolean;
}

export function EntitySearchField({
  label,
  provider,
  support,
  value,
  onChange,
  search,
  required = false,
  invalid = false,
}: EntitySearchFieldProps): ReactNode {
  const t = useTranslations();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<readonly ResolvedEntity[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    if (support !== 'supported' || query.trim().length < 2) {
      setItems([]);
      setStatus('idle');
      return;
    }
    let cancelled = false;
    setStatus('loading');
    const handle = setTimeout(() => {
      search(query)
        .then((results) => {
          if (cancelled) {
            return;
          }
          // A result without an external ID cannot become a native tag, so it
          // never reaches the list in the first place.
          setItems(results.filter((result) => result.externalId.length > 0));
          setStatus('idle');
        })
        .catch(() => {
          if (!cancelled) {
            setStatus('error');
          }
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [provider, query, search, support]);

  const comboboxItems = useMemo<ComboboxItem[]>(
    () =>
      items.map((item) => ({
        id: item.externalId,
        label: item.label,
        ...(item.secondary === null ? {} : { description: item.secondary }),
      })),
    [items],
  );

  if (support === 'unsupported') {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="text-label text-text-secondary">{label}</p>
        <CapabilityBadge state="unsupported" label={t.full('composerWeb.rail.state.unsupported')} />
        <p className="text-body-sm text-text-secondary">
          {t.full('composerWeb.entity.lookupUnsupported', { provider: PROVIDER_LABEL[provider] })}
        </p>
      </div>
    );
  }

  if (support === 'not_implemented') {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="text-label text-text-secondary">{label}</p>
        <CapabilityBadge
          state="not_implemented"
          label={t.full('composerWeb.rail.state.notBuilt')}
        />
        <p className="text-body-sm text-text-secondary">
          {t.full('composerWeb.entity.lookupNotBuilt', { provider: PROVIDER_LABEL[provider] })}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Combobox
        items={comboboxItems}
        status={status}
        value={
          value === null
            ? null
            : {
                id: value.externalId,
                label: value.label,
                ...(value.secondary === null ? {} : { description: value.secondary }),
              }
        }
        onValueChange={(item) => {
          if (item === null) {
            onChange(null);
            return;
          }
          const match = items.find((entry) => entry.externalId === item.id);
          onChange(match ?? null);
        }}
        inputValue={query}
        onInputValueChange={setQuery}
        required={required}
        invalid={invalid}
        messages={{
          label,
          placeholder: t.full('composer.destination.placeholder'),
          loading: t.full('composer.mentions.searching', { provider: PROVIDER_LABEL[provider] }),
          empty: t.full('composer.mentions.noResults', { provider: PROVIDER_LABEL[provider] }),
          error: t.full('composerWeb.entity.searchFailed'),
          toggle: t.full('action.search'),
          resultCount: (count: number) => t.full('composerWeb.entity.resultCount', { count }),
        }}
      />

      {value === null ? (
        <p className="text-body-sm text-text-tertiary">{t.full('composerWeb.entity.searchHint')}</p>
      ) : (
        <p className="text-body-sm text-text-secondary">
          <span className="text-success-fg">
            {t.full('composerWeb.entity.resolvedHeading', { provider: PROVIDER_LABEL[provider] })}
          </span>{' '}
          <span className="text-mono font-mono">
            {t.full('composerWeb.entity.resolvedId', { externalId: value.externalId })}
          </span>
        </p>
      )}
    </div>
  );
}
