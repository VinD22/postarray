'use client';

/**
 * Signatures.
 *
 * A signature is scoped by brand, platform and content language, so only the
 * ones that actually match this draft are offered. The exact ending text is
 * shown before it can be approved, because a footer that appears for the first
 * time on the live post is a footer nobody reviewed.
 */

import { useMemo, type ReactNode } from 'react';
import {
  Field,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { DefinitionList } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context';
import { PROVIDER_LABEL } from './provider-identity';

const NO_SIGNATURE = 'none';

export function SignaturePanel(): ReactNode {
  const t = useTranslations();
  const { bootstrap, state, dispatch } = useComposer();

  const providers = useMemo(
    () =>
      new Set(
        bootstrap.accounts
          .filter((account) => state.selectedConnectionIds.includes(account.connectionId))
          .map((account) => account.provider),
      ),
    [bootstrap.accounts, state.selectedConnectionIds],
  );

  const eligible = useMemo(
    () =>
      bootstrap.signatures.filter(
        (signature) =>
          (signature.brandId === null || signature.brandId === state.master.brandId) &&
          signature.locale === state.master.locale &&
          (signature.providers.length === 0 ||
            signature.providers.some((provider) => providers.has(provider))),
      ),
    [bootstrap.signatures, providers, state.master.brandId, state.master.locale],
  );

  const current = state.master.signature;
  const currentOption = eligible.find((signature) => signature.id === current?.signatureId) ?? null;

  return (
    <section aria-labelledby="composer-signature-heading" className="flex flex-col gap-3">
      <h3 id="composer-signature-heading" className="text-title-sm text-text-primary">
        {t.full('composer.signature.title')}
      </h3>

      <Field label={t.full('composerWeb.signature.pickerLabel')}>
        {(control) => (
          <Select
            value={current?.signatureId ?? NO_SIGNATURE}
            onValueChange={(value) => {
              if (value === NO_SIGNATURE) {
                dispatch({ type: 'signature/set', signature: null });
                return;
              }
              const signature = eligible.find((entry) => entry.id === value);
              if (!signature) {
                return;
              }
              dispatch({
                type: 'signature/set',
                signature: {
                  signatureId: signature.id,
                  appliedText: signature.text,
                  locale: signature.locale,
                  autoApplied: false,
                },
              });
            }}
          >
            <SelectTrigger id={control.id}>
              <SelectValue placeholder={t.full('composer.signature.none')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_SIGNATURE}>{t.full('composer.signature.none')}</SelectItem>
              {eligible.map((signature) => (
                <SelectItem key={signature.id} value={signature.id}>
                  {signature.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

      {eligible.length === 0 ? (
        <p className="text-body-sm text-text-tertiary">
          {t.full('composerWeb.signature.notMatching')}
        </p>
      ) : null}

      {currentOption ? (
        <div className="flex flex-col gap-1">
          {/*
            Scope is three separate facts. Rendering them as three rows avoids
            interpolating a translated word ("All") into another translated
            sentence, which no translator can reorder around.
          */}
          <DefinitionList
            layout="columns"
            items={[
              {
                id: 'brand',
                term: t.full('composer.campaign.label'),
                definition: currentOption.brandId ?? t.full('common.all'),
              },
              {
                id: 'platform',
                term: t.full('composerWeb.signature.pickerLabel'),
                definition:
                  currentOption.providers.length === 0
                    ? t.full('common.all')
                    : currentOption.providers
                        .map((provider) => PROVIDER_LABEL[provider])
                        .join(', '),
              },
              {
                id: 'language',
                term: t.full('common.language'),
                definition: currentOption.locale,
              },
            ]}
          />
          <p className="text-label text-text-tertiary">
            {t.full('composerWeb.signature.previewHeading')}
          </p>
          <p className="bg-surface-sunken text-body-sm text-text-primary rounded-md px-2.5 py-2 whitespace-pre-wrap">
            {currentOption.text}
          </p>
        </div>
      ) : null}

      {current?.autoApplied ? (
        <p className="text-body-sm text-text-secondary">
          {t.full('composer.signature.autoApplied', { name: currentOption?.name ?? '' })}
        </p>
      ) : null}
    </section>
  );
}
