'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Button, Field, Input, Textarea } from '@relay/design-system/primitives';
import { CapabilityBadge, ConfirmDialog, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { SettingsPanel } from '../components/section';
import { TargetMemoryCard } from './target-memory-card';
import { useFormatters } from '../lib/formatters';
import { fromLines, toLines } from '../lib/lines';
import type { ProjectView } from '../lib/view-models';

export interface ProjectEditorProps {
  project: ProjectView;
  saving: boolean;
  archiving: boolean;
  disabled: boolean;
  onSave: (patch: Partial<ProjectView>) => void;
  onArchive: () => void;
  archiveDisabled: boolean;
  archiveDisabledReason: string | null;
}

interface DraftState {
  name: string;
  voice: string;
  audience: string;
  approvedClaims: string;
  blockedTerms: string;
  domains: string;
}

function draftFrom(project: ProjectView): DraftState {
  return {
    name: project.name,
    voice: project.voice,
    audience: project.audience,
    approvedClaims: toLines(project.approvedClaims),
    blockedTerms: toLines(project.blockedTerms),
    domains: toLines(project.domains.map((domain) => domain.domain)),
  };
}

/**
 * The rules content is checked against for one project.
 *
 * Everything here is a document field rather than a toggle wall: voice and
 * audience are prose, claims and blocked terms are lists people paste in, and
 * the glossary and the locale rules are tables because they have columns.
 */
export function ProjectEditor({
  project,
  saving,
  archiving,
  disabled,
  onSave,
  onArchive,
  archiveDisabled,
  archiveDisabledReason,
}: ProjectEditorProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();
  const [draft, setDraft] = useState<DraftState>(() => draftFrom(project));
  const [archiveOpen, setArchiveOpen] = useState(false);

  useEffect(() => {
    setDraft(draftFrom(project));
  }, [project]);

  const dirty =
    draft.name !== project.name ||
    draft.voice !== project.voice ||
    draft.audience !== project.audience ||
    draft.approvedClaims !== toLines(project.approvedClaims) ||
    draft.blockedTerms !== toLines(project.blockedTerms) ||
    draft.domains !== toLines(project.domains.map((domain) => domain.domain));

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
        const existing = project.domains.find((entry) => entry.domain === domain);
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
        title={t('settings.ui.projects.detailsTitle')}
        description={t('settings.ui.projects.description')}
        footnote={
          project.updatedByName === null
            ? t('settings.ui.attributionNever')
            : t('settings.ui.attribution', {
                name: project.updatedByName,
                relativeTime: formatters.relative(project.updatedAt),
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

          <Field label={t('settings.projects.voice')} description={t('settings.ui.projects.voiceHelp')}>
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
            label={t('settings.projects.audience')}
            description={t('settings.ui.projects.audienceHelp')}
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
            label={t('settings.projects.approvedClaims')}
            description={t('settings.ui.projects.approvedClaimsHelp')}
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
            label={t('settings.projects.blockedTerms')}
            description={t('settings.ui.projects.blockedTermsHelp')}
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
        title={t('settings.projects.domains')}
        description={t('settings.ui.projects.domainsHelp')}
      >
        <Field label={t('settings.projects.domains')}>
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
          {project.domains.map((domain) => (
            <li key={domain.domain} className="text-body-sm flex items-center gap-2">
              <span className="text-text-primary font-mono">{domain.domain}</span>
              <CapabilityBadge
                state="not_implemented"
                label={t('settings.ui.projects.domainVerificationUnavailable')}
              />
            </li>
          ))}
        </ul>
      </SettingsPanel>

      <SettingsPanel
        title={t('settings.projects.disclosureDefaults')}
        description={t('settings.ui.projects.disclosureHelp')}
      >
        <Notice
          tone="info"
          title={t('settings.ui.state.notBuiltTitle')}
          description={t('settings.ui.projects.disclosureUnavailable')}
        />
      </SettingsPanel>

      <SettingsPanel
        title={t('settings.projects.glossary.title')}
        description={t('settings.ui.projects.glossaryHelp')}
      >
        <Notice
          tone="info"
          title={t('settings.ui.state.notBuiltTitle')}
          description={t('settings.ui.projects.glossaryUnavailable')}
        />
      </SettingsPanel>

      <SettingsPanel
        title={t('settings.projects.localeRules.title')}
        description={t('settings.ui.projects.localeRulesHelp')}
      >
        <Notice
          tone="info"
          title={t('settings.ui.state.notBuiltTitle')}
          description={t('settings.ui.projects.localeRulesUnavailable')}
        />
      </SettingsPanel>

      {/* The composer's remembered channel selection. Its own panel, and its
          own save, because it is a privacy setting rather than a document
          field: turning it off deletes what is stored, which is not something
          to bury inside a form that saves everything at once. */}
      <SettingsPanel
        title={t('targetMemory.setting.title')}
        description={t('targetMemory.setting.body')}
      >
        <TargetMemoryCard projectId={project.id} enabled={project.rememberTargetsEnabled} />
      </SettingsPanel>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" variant="primary" loading={saving} disabled={disabled || !dirty}>
          {t('settings.ui.projects.saveProject')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={!dirty || saving}
          onClick={() => setDraft(draftFrom(project))}
        >
          {t('action.undo')}
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="ms-auto"
          loading={archiving}
          disabled={archiveDisabled || saving}
          onClick={() => setArchiveOpen(true)}
        >
          {t('settings.ui.projects.archiveAction')}
        </Button>
      </div>
      {archiveDisabledReason === null ? null : (
        <p className="text-body-sm text-text-tertiary">{archiveDisabledReason}</p>
      )}

      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        tone="destructive"
        title={t('settings.ui.projects.archiveTitle', { project: project.name })}
        description={t('settings.ui.projects.archiveBody')}
        consequences={[
          { id: 'channels', text: t('settings.ui.projects.archiveChannels') },
          { id: 'history', text: t('settings.ui.projects.archiveHistory') },
        ]}
        confirmLabel={t('settings.ui.projects.archiveAction')}
        cancelLabel={t('action.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={() => {
          onArchive();
          setArchiveOpen(false);
        }}
      />
    </form>
  );
}
