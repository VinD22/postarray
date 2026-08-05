'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  Field,
  Input,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
  Textarea,
} from '@relay/design-system/primitives';
import { CapabilityBadge, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { SettingRow, SettingsPanel } from '../components/section.js';
import { useFormatters } from '../lib/formatters.js';
import { fromLines, toLines } from '../lib/lines.js';
import type { BrandView } from '../lib/view-models.js';

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

          <Field
            label={t('settings.brands.voice')}
            description={t('settings.ui.brands.voiceHelp')}
          >
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
            <li key={domain.domain} className="flex items-center gap-2 text-body-sm">
              <span className="font-mono text-text-primary">{domain.domain}</span>
              <CapabilityBadge
                state={domain.verifiedAt === null ? 'requires_review' : 'supported'}
                label={
                  domain.verifiedAt === null
                    ? t('settings.ui.brands.domainPending')
                    : t('settings.ui.brands.domainVerified', {
                        date: formatters.date(domain.verifiedAt),
                      })
                }
              />
            </li>
          ))}
        </ul>
      </SettingsPanel>

      <SettingsPanel
        title={t('settings.brands.disclosureDefaults')}
        description={t('settings.ui.brands.disclosureHelp')}
      >
        {brand.disclosureDefaults.length === 0 ? (
          <p className="text-body-md text-text-secondary">{t('common.notSet')}</p>
        ) : (
          <div className="flex flex-col">
            {brand.disclosureDefaults.map((entry) => (
              <SettingRow
                key={entry.provider}
                label={entry.provider}
                control={<span className="text-body-md text-text-primary">{entry.text}</span>}
              />
            ))}
          </div>
        )}
      </SettingsPanel>

      <SettingsPanel
        title={t('settings.brands.glossary.title')}
        description={t('settings.ui.brands.glossaryHelp')}
      >
        {brand.glossary.length === 0 ? (
          <p className="text-body-md text-text-secondary">
            {t('settings.ui.brands.glossaryEmpty')}
          </p>
        ) : (
          <TableContainer>
            <Table>
              <TableCaption className="sr-only">
                {t('settings.ui.brands.glossaryCaption')}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">{t('settings.brands.glossary.term')}</TableHead>
                  <TableHead scope="col">{t('common.language')}</TableHead>
                  <TableHead scope="col">{t('settings.brands.glossary.preferred')}</TableHead>
                  <TableHead scope="col">{t('settings.brands.glossary.prohibited')}</TableHead>
                  <TableHead scope="col">
                    {t('settings.brands.glossary.keepUntranslated')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brand.glossary.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableRowHeader>{entry.term}</TableRowHeader>
                    <TableCell>{entry.locale}</TableCell>
                    <TableCell>{entry.preferred ?? t('common.notSet')}</TableCell>
                    <TableCell>
                      {entry.prohibited.length === 0
                        ? t('common.none')
                        : formatters.list([...entry.prohibited])}
                    </TableCell>
                    <TableCell>
                      <Checkbox checked={entry.keepUntranslated} disabled aria-readonly />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </SettingsPanel>

      <SettingsPanel
        title={t('settings.brands.localeRules.title')}
        description={t('settings.ui.brands.localeRulesHelp')}
      >
        {brand.localeRules.length === 0 ? (
          <p className="text-body-md text-text-secondary">{t('common.notSet')}</p>
        ) : (
          <Accordion type="multiple" className="flex flex-col">
            {brand.localeRules.map((rule) => (
              <AccordionItem key={rule.locale} value={rule.locale}>
                <AccordionTrigger>{rule.locale}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col">
                    <SettingRow
                      label={t('settings.brands.localeRules.formality')}
                      control={rule.formality}
                    />
                    <SettingRow
                      label={t('settings.brands.localeRules.pronouns')}
                      control={rule.pronouns}
                    />
                    <SettingRow
                      label={t('settings.brands.localeRules.idioms')}
                      control={
                        rule.avoidIdioms.length === 0
                          ? t('common.none')
                          : formatters.list([...rule.avoidIdioms])
                      }
                    />
                    <SettingRow
                      label={t('settings.brands.localeRules.emoji')}
                      control={rule.emojiNorms}
                    />
                    <SettingRow
                      label={t('settings.brands.localeRules.legal')}
                      control={rule.legalDisclosure}
                    />
                    <SettingRow
                      label={t('settings.brands.localeRules.cta')}
                      control={rule.callToAction}
                    />
                    <SettingRow
                      label={t('settings.brands.localeRules.reviewedExamples')}
                      control={
                        rule.reviewedExamples.length === 0
                          ? t('common.none')
                          : rule.reviewedExamples.join(' / ')
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
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
