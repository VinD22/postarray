'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  Button,
  Field,
  Input,
  Textarea,
} from '@relay/design-system/primitives';
import { CapabilityBadge, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { SettingsPanel } from '../components/section';
import { useFormatters } from '../lib/formatters';
import { fromLines, toLines } from '../lib/lines';
import type { BrandView } from '../lib/view-models';

export interface BrandEditorProps {
  brand: BrandView;
  saving: boolean;
  disabled: boolean;
  onSave: (patch: Partial<BrandView>) => void;
}

interface DraftState {
  name: string;
  voice: string;
  audience: string;
  approvedClaims: string;
  blockedTerms: string;
  domains: string;
}

function draftFrom(brand: BrandView): DraftState {
  return {
    name: brand.name,
    voice: brand.voice,
    audience: brand.audience,
    approvedClaims: toLines(brand.approvedClaims),
    blockedTerms: toLines(brand.blockedTerms),
    domains: toLines(brand.domains.map((domain) => domain.domain)),
  };
}

/**
 * The rules content is checked against for one brand.
 *
 * Everything here is a document field rather than a toggle wall: voice and
 * audience are prose, claims and blocked terms are lists people paste in, and
 * the glossary and the locale rules are tables because they have columns.
 */
export function BrandEditor({ brand, saving, disabled, onSave }: BrandEditorProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();
  const [draft, setDraft] = useState<DraftState>(() => draftFrom(brand));

  useEffect(() => {
    setDraft(draftFrom(brand));
  }, [brand]);

  const dirty =
    draft.name !== brand.name ||
    draft.voice !== brand.voice ||
    draft.audience !== brand.audience ||
    draft.approvedClaims !== toLines(brand.approvedClaims) ||
    draft.blockedTerms !== toLines(brand.blockedTerms) ||
    draft.domains !== toLines(brand.domains.map((domain) => domain.domain));

  function update<K extends keyof DraftState>(key: K, value: DraftState[K]): void {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSave({
      name: draft.name.trim(),
      voice: draft.voice,
      audience: draft.audience,
      approvedClaims: fromLines(draft.approvedClaims),
      blockedTerms: fromLines(draft.blockedTerms),
      domains: fromLines(draft.domains).map((domain) => {
        const existing = brand.domains.find((entry) => entry.domain === domain);
        return { domain, verifiedAt: existing?.verifiedAt ?? null };
      }),
    });
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {dirty ? (
        <Notice
          tone="warning"
          liveness="status"
          title={t('settings.ui.state.unsavedTitle')}
          description={t('settings.ui.state.unsavedBody')}
        />
      ) : null}

      <SettingsPanel
        title={t('settings.ui.section.brands')}
        description={t('settings.ui.brands.description')}
        footnote={
          brand.updatedByName === null
            ? t('settings.ui.attributionNever')
            : t('settings.ui.attribution', {
                name: brand.updatedByName,
                relativeTime: formatters.relative(brand.updatedAt),
              })
        }
      >
        <div className="flex flex-col gap-4">
          <Field label={t('common.name')} required>
            {(control) => (
              <Input
                {...control}
                value={draft.name}
                disabled={disabled}
                onChange={(event) => update('name', event.target.value)}
              />
            )}
          </Field>

          <Field label={t('settings.brands.voice')} description={t('settings.ui.brands.voiceHelp')}>
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={3}
                value={draft.voice}
                disabled={disabled}
                onChange={(event) => update('voice', event.target.value)}
              />
            )}
          </Field>

          <Field
            label={t('settings.brands.audience')}
            description={t('settings.ui.brands.audienceHelp')}
          >
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={3}
                value={draft.audience}
                disabled={disabled}
                onChange={(event) => update('audience', event.target.value)}
              />
            )}
          </Field>

          <Field
            label={t('settings.brands.approvedClaims')}
            description={t('settings.ui.brands.approvedClaimsHelp')}
          >
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={4}
                value={draft.approvedClaims}
                disabled={disabled}
                onChange={(event) => update('approvedClaims', event.target.value)}
              />
            )}
          </Field>

          <Field
            label={t('settings.brands.blockedTerms')}
            description={t('settings.ui.brands.blockedTermsHelp')}
          >
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={4}
                value={draft.blockedTerms}
                disabled={disabled}
                onChange={(event) => update('blockedTerms', event.target.value)}
              />
            )}
          </Field>
        </div>
      </SettingsPanel>

      <SettingsPanel
        title={t('settings.brands.domains')}
        description={t('settings.ui.brands.domainsHelp')}
      >
        <Field label={t('settings.brands.domains')}>
          {(control) => (
            <Textarea
              {...control}
              autoGrow
              minRows={3}
              value={draft.domains}
              disabled={disabled}
              onChange={(event) => update('domains', event.target.value)}
            />
          )}
        </Field>
        <ul className="flex flex-col gap-1">
          {brand.domains.map((domain) => (
            <li key={domain.domain} className="text-body-sm flex items-center gap-2">
              <span className="text-text-primary font-mono">{domain.domain}</span>
              <CapabilityBadge
                state="not_implemented"
                label={t('settings.ui.brands.domainVerificationUnavailable')}
              />
            </li>
          ))}
        </ul>
      </SettingsPanel>

      <SettingsPanel
        title={t('settings.brands.disclosureDefaults')}
        description={t('settings.ui.brands.disclosureHelp')}
      >
        <Notice
          tone="info"
          title={t('settings.ui.state.notBuiltTitle')}
          description={t('settings.ui.brands.disclosureUnavailable')}
        />
      </SettingsPanel>

      <SettingsPanel
        title={t('settings.brands.glossary.title')}
        description={t('settings.ui.brands.glossaryHelp')}
      >
        <Notice
          tone="info"
          title={t('settings.ui.state.notBuiltTitle')}
          description={t('settings.ui.brands.glossaryUnavailable')}
        />
      </SettingsPanel>

      <SettingsPanel
        title={t('settings.brands.localeRules.title')}
        description={t('settings.ui.brands.localeRulesHelp')}
      >
        <Notice
          tone="info"
          title={t('settings.ui.state.notBuiltTitle')}
          description={t('settings.ui.brands.localeRulesUnavailable')}
        />
      </SettingsPanel>

      <div className="flex items-center gap-2">
        <Button type="submit" variant="primary" loading={saving} disabled={disabled || !dirty}>
          {t('settings.ui.brands.saveBrand')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={!dirty || saving}
          onClick={() => setDraft(draftFrom(brand))}
        >
          {t('action.undo')}
        </Button>
      </div>
    </form>
  );
}
