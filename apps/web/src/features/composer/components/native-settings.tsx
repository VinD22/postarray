'use client';

/**
 * The provider's own settings for the open target.
 *
 * Every control here appears only because that connection's capability
 * snapshot reports it. An X community picker never renders for LinkedIn, and a
 * YouTube privacy choice never carries a preselected value when the provider
 * forbids one.
 */

import { type ReactNode, useCallback, useMemo } from 'react';
import {
  Field,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { DestinationKind, DestinationRef, MentionRef } from '@relay/contracts';

import { useComposer } from '../composer-context.js';
import { EntitySearchField, type ResolvedEntity } from './entity-search-field.js';
import { CheckRow } from './form-rows.js';
import { PROVIDER_LABEL } from './provider-identity.js';
import type { TargetSummary } from '../types.js';

const DESTINATION_LABEL_KEY: Readonly<Record<DestinationKind, string>> = {
  none: 'composerWeb.native.heading',
  community: 'composerWeb.native.community',
  board: 'composerWeb.native.board',
  group: 'composerWeb.native.group',
  page: 'composerWeb.native.group',
  organization: 'composerWeb.native.organization',
  channel: 'composerWeb.native.channel',
  publication: 'composerWeb.native.publication',
};

export interface NativeSettingsProps {
  readonly summary: TargetSummary;
  /** Provider-backed lookup. Results without an external id are dropped. */
  readonly searchDestinations: (
    connectionId: string,
    query: string,
  ) => Promise<readonly ResolvedEntity[]>;
  readonly searchMentions: (
    connectionId: string,
    query: string,
  ) => Promise<readonly ResolvedEntity[]>;
}

export function NativeSettings({
  summary,
  searchDestinations,
  searchMentions,
}: NativeSettingsProps): ReactNode {
  const t = useTranslations();
  const { state, dispatch } = useComposer();
  const snapshot = summary.account.capabilities;
  const providerName = PROVIDER_LABEL[summary.account.provider];
  const settings = state.settings[summary.connectionId];
  const destinationCapability = snapshot.destinations.find((entry) => entry.kind !== 'none');
  // A fresh [] each render would change the identity of every dependent hook.
  const mentions = useMemo(() => settings?.mentions ?? [], [settings?.mentions]);

  const onDestination = useCallback(
    (entity: ResolvedEntity | null) => {
      const destination: DestinationRef | null =
        entity === null
          ? null
          : {
              destinationId: `dest_${entity.externalId}`,
              externalId: entity.externalId,
              displayLabel: entity.label,
            };
      dispatch({
        type: 'variant/settings',
        connectionId: summary.connectionId,
        patch: { destination },
      });
    },
    [dispatch, summary.connectionId],
  );

  const onMention = useCallback(
    (entity: ResolvedEntity | null) => {
      if (entity === null) {
        return;
      }
      const mention: MentionRef = {
        mentionId: `mention_${entity.externalId}`,
        externalId: entity.externalId,
        displayLabel: entity.label,
        offset: 0,
        length: entity.label.length,
      };
      dispatch({
        type: 'variant/settings',
        connectionId: summary.connectionId,
        patch: { mentions: [...mentions, mention] },
      });
    },
    [dispatch, mentions, summary.connectionId],
  );

  const nothingApplies =
    destinationCapability === undefined &&
    snapshot.privacy.support !== 'supported' &&
    snapshot.mentions.support !== 'supported' &&
    snapshot.disclosure.aiLabel !== 'supported' &&
    snapshot.disclosure.commercialContent !== 'supported' &&
    snapshot.disclosure.brandedContent !== 'supported';

  return (
    <section aria-labelledby="native-settings-heading" className="flex flex-col gap-4">
      <h3 id="native-settings-heading" className="text-title-sm text-text-primary">
        {t.full('composerWeb.native.heading', { provider: providerName })}
      </h3>

      {nothingApplies ? (
        <p className="text-body-sm text-text-tertiary">
          {t.full('composerWeb.native.none', { provider: providerName })}
        </p>
      ) : null}

      {destinationCapability ? (
        <EntitySearchField
          label={t(DESTINATION_LABEL_KEY[destinationCapability.kind])}
          provider={summary.account.provider}
          support={destinationCapability.support}
          value={
            settings?.destination
              ? {
                  externalId: settings.destination.externalId,
                  label: settings.destination.displayLabel,
                  secondary: null,
                }
              : null
          }
          onChange={onDestination}
          search={(query) => searchDestinations(summary.connectionId, query)}
          required
          invalid={summary.issues.some((issue) => issue.code === 'DESTINATION_REQUIRED')}
        />
      ) : null}

      {snapshot.privacy.support === 'supported' ? (
        <Field
          label={t.full('composerWeb.native.privacy')}
          required={snapshot.privacy.mustBeExplicit}
          description={
            snapshot.privacy.mustBeExplicit
              ? t.full('composerWeb.native.privacyExplicit', { provider: providerName })
              : undefined
          }
        >
          {(control) => (
            <Select
              value={settings?.privacyValue ?? ''}
              onValueChange={(value) =>
                dispatch({
                  type: 'variant/settings',
                  connectionId: summary.connectionId,
                  patch: { privacyValue: value },
                })
              }
            >
              <SelectTrigger
                id={control.id}
                aria-describedby={control['aria-describedby']}
                invalid={summary.issues.some((issue) => issue.code === 'PRIVACY_SETTING_REQUIRED')}
              >
                <SelectValue placeholder={t.full('composerWeb.native.privacyChoose')} />
              </SelectTrigger>
              <SelectContent>
                {snapshot.privacy.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      ) : null}

      <div className="flex flex-col gap-2">
        <EntitySearchField
          label={t.full('composerWeb.entity.addMention')}
          provider={summary.account.provider}
          support={snapshot.mentions.support}
          value={null}
          onChange={onMention}
          search={(query) => searchMentions(summary.connectionId, query)}
        />
        {snapshot.mentions.support === 'supported' ? (
          <p className="text-body-sm text-text-tertiary">
            {t.full('composerWeb.entity.mentionCount', {
              count: mentions.length,
              resolved: mentions.filter((mention) => mention.externalId.length > 0).length,
            })}
          </p>
        ) : null}
        {mentions.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {mentions.map((mention) => (
              <li
                key={mention.mentionId}
                className="border-border-subtle flex items-center justify-between gap-2 border-b py-1.5 last:border-b-0"
              >
                <span className="text-body-md text-text-primary min-w-0 truncate">
                  {mention.displayLabel}
                </span>
                <span className="text-mono text-text-tertiary shrink-0 font-mono">
                  {mention.externalId}
                </span>
                <button
                  type="button"
                  className="text-body-sm text-text-secondary hover:bg-surface-hover focus-visible:outline-border-focus shrink-0 rounded-md px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2"
                  onClick={() =>
                    dispatch({
                      type: 'variant/settings',
                      connectionId: summary.connectionId,
                      patch: {
                        mentions: mentions.filter((entry) => entry.mentionId !== mention.mentionId),
                      },
                    })
                  }
                >
                  {t.full('composerWeb.entity.removeMention', { label: mention.displayLabel })}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {snapshot.mentions.support === 'supported' && mentions.length === 0 ? (
          <Notice
            tone="info"
            title={t.full('composer.mentions.unresolved', { provider: providerName })}
          />
        ) : null}
      </div>

      <fieldset className="flex flex-col gap-1">
        <legend className="text-label text-text-secondary">
          {t.full('composerWeb.native.disclosureHeading')}
        </legend>
        <DisclosureRow
          summary={summary}
          field="commercialContent"
          support={snapshot.disclosure.commercialContent}
          label={t.full('composerWeb.native.disclosureCommercial')}
        />
        <DisclosureRow
          summary={summary}
          field="brandedContent"
          support={snapshot.disclosure.brandedContent}
          label={t.full('composerWeb.native.disclosureBranded')}
        />
        <DisclosureRow
          summary={summary}
          field="aiAssisted"
          support={snapshot.disclosure.aiLabel}
          label={t.full('composerWeb.native.disclosureAi')}
        />
      </fieldset>
    </section>
  );
}

function DisclosureRow({
  summary,
  field,
  support,
  label,
}: {
  readonly summary: TargetSummary;
  readonly field: 'aiAssisted' | 'commercialContent' | 'brandedContent';
  readonly support: string;
  readonly label: string;
}): ReactNode {
  const t = useTranslations();
  const { state, dispatch } = useComposer();
  const settings = state.settings[summary.connectionId];
  const current = settings?.disclosure ?? state.master.disclosure;

  if (support !== 'supported') {
    return (
      <p className="text-body-sm text-text-tertiary py-1">
        {t.full('composerWeb.native.disclosureUnsupported', {
          provider: PROVIDER_LABEL[summary.account.provider],
        })}
      </p>
    );
  }

  return (
    <CheckRow
      checked={current[field]}
      label={label}
      onCheckedChange={(checked) =>
        dispatch({
          type: 'variant/settings',
          connectionId: summary.connectionId,
          patch: { disclosure: { ...current, [field]: checked } },
        })
      }
    />
  );
}
