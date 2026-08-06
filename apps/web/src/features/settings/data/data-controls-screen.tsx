'use client';

import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/components/link';
import { Button, Checkbox } from '@relay/design-system/primitives';
import { ConfirmDialog, Notice, PageHeader } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { AsyncBoundary } from '../lib/async-boundary';
import { dataGateway, workspaceGateway } from '../lib/gateway';
import { useFormatters } from '../lib/formatters';
import { settingsKey, useWorkspaceId } from '../lib/keys';
import { useSettingsMutation } from '../lib/use-settings-mutation';
import { SettingRow, SettingsPanel, SettingsStack } from '../components/section';

type ExportFormat = 'json' | 'csv' | 'media';

/**
 * Removing one connection, one brand or one draft happens where that thing
 * lives, so the row links there instead of building a second delete path that
 * could drift from the first. Closing the workspace is the only action that
 * belongs on this screen, and it is a request with a confirmation window.
 */
const DELETION_OPTIONS: readonly {
  readonly scope: 'connection' | 'brand' | 'content';
  readonly titleKey: string;
  readonly helpKey: string;
  readonly href: string;
}[] = [
  {
    scope: 'connection',
    titleKey: 'settings.ui.data.deleteConnection',
    helpKey: 'settings.ui.data.deleteConnectionHelp',
    href: '/connections',
  },
  {
    scope: 'brand',
    titleKey: 'settings.ui.data.deleteBrand',
    helpKey: 'settings.ui.data.deleteBrandHelp',
    href: '/settings/brands',
  },
  {
    scope: 'content',
    titleKey: 'settings.ui.data.deleteContent',
    helpKey: 'settings.ui.data.deleteContentHelp',
    href: '/library',
  },
];

export function DataControlsScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.data');
  const formatters = useFormatters();
  const workspaceId = useWorkspaceId();
  const EXPORT_KEY = settingsKey(workspaceId, 'data', 'export');
  const JOBS_KEY = settingsKey(workspaceId, 'data', 'scheduled-jobs');

  const exportJob = useQuery({ queryKey: EXPORT_KEY, queryFn: () => dataGateway.exportJob() });
  const scheduledJobs = useQuery({
    queryKey: JOBS_KEY,
    queryFn: () => dataGateway.scheduledJobCount(),
  });
  const workspace = useQuery({
    queryKey: settingsKey(workspaceId, 'workspace'),
    queryFn: () => workspaceGateway.identity(),
  });
  const workspaceName = workspace.data?.name ?? '';

  const [formats, setFormats] = useState<readonly ExportFormat[]>(['json']);
  const [closing, setClosing] = useState(false);

  const startExport = useSettingsMutation({
    section,
    mutationFn: dataGateway.startExport,
    invalidate: [EXPORT_KEY],
    successMessage: t('settings.data.exportPreparing'),
  });

  const cancelJobs = useSettingsMutation({
    section,
    mutationFn: dataGateway.cancelScheduledJobs,
    invalidate: [JOBS_KEY],
    successMessage: t('settings.ui.data.cancelJobsDone'),
  });

  const requestClosure = useSettingsMutation({
    section,
    mutationFn: dataGateway.requestWorkspaceDeletion,
    invalidate: [JOBS_KEY],
    onSuccess: () => setClosing(false),
    successMessage: t('settings.data.deletionRequest'),
  });

  const job = exportJob.data;
  const jobCount = scheduledJobs.data ?? 0;

  function toggleFormat(format: ExportFormat, checked: boolean): void {
    setFormats((current) =>
      checked ? [...current, format] : current.filter((entry) => entry !== format),
    );
  }

  return (
    <>
      <PageHeader title={section} description={t('settings.ui.data.description')} />

      <SettingsStack>
        <SettingsPanel
          title={t('settings.ui.data.exportTitle')}
          description={t('settings.ui.data.exportBody')}
        >
          <fieldset className="flex flex-col gap-1 border-0 p-0">
            <legend className="sr-only">{t('settings.ui.data.exportTitle')}</legend>
            <label className="text-body-md text-text-primary flex min-h-11 items-start gap-2 py-1">
              <Checkbox
                className="mt-0.5"
                checked={formats.includes('json')}
                onCheckedChange={(checked) => toggleFormat('json', checked === true)}
              />
              <span className="flex flex-col">
                {t('settings.ui.data.exportJson')}
                <span className="text-body-sm text-text-secondary">
                  {t('settings.ui.data.exportJsonHelp')}
                </span>
              </span>
            </label>
            <label className="text-body-md text-text-primary flex min-h-11 items-start gap-2 py-1">
              <Checkbox
                className="mt-0.5"
                checked={formats.includes('csv')}
                onCheckedChange={(checked) => toggleFormat('csv', checked === true)}
              />
              <span className="flex flex-col">
                {t('settings.ui.data.exportCsv')}
                <span className="text-body-sm text-text-secondary">
                  {t('settings.ui.data.exportCsvHelp')}
                </span>
              </span>
            </label>
            <label className="text-body-md text-text-primary flex min-h-11 items-start gap-2 py-1">
              <Checkbox
                className="mt-0.5"
                checked={formats.includes('media')}
                onCheckedChange={(checked) => toggleFormat('media', checked === true)}
              />
              <span className="flex flex-col">
                {t('settings.ui.data.exportMedia')}
                <span className="text-body-sm text-text-secondary">
                  {t('settings.ui.data.exportMediaHelp')}
                </span>
              </span>
            </label>
          </fieldset>

          <AsyncBoundary
            section={t('settings.ui.data.exportTitle')}
            isPending={exportJob.isPending}
            error={exportJob.error}
            onRetry={() => void exportJob.refetch()}
            skeletonRows={1}
            skeletonColumns={2}
          >
            <div className="flex flex-col gap-3">
              {job?.state === 'running' ? (
                <Notice
                  tone="info"
                  liveness="status"
                  title={t('settings.ui.data.exportRunning')}
                  description={t('settings.data.exportPreparing')}
                />
              ) : null}

              {job?.state === 'ready' && job.preparedAt !== null ? (
                <Notice
                  tone="success"
                  liveness="status"
                  title={t('settings.ui.data.exportReady', {
                    date: formatters.dateTime(job.preparedAt),
                  })}
                  description={
                    job.expiresAt === null
                      ? undefined
                      : t('settings.ui.data.exportExpires', {
                          date: formatters.dateTime(job.expiresAt),
                        })
                  }
                  actions={
                    job.downloadUrl === null ? null : (
                      <Button variant="primary" size="sm" asChild>
                        <a href={job.downloadUrl} download>
                          {t('settings.ui.data.exportDownload')}
                        </a>
                      </Button>
                    )
                  }
                />
              ) : null}

              <div>
                <Button
                  variant="primary"
                  loading={startExport.isSaving}
                  disabled={formats.length === 0}
                  onClick={() => void startExport.run({ formats })}
                >
                  {t('settings.ui.data.exportStart')}
                </Button>
              </div>
            </div>
          </AsyncBoundary>
        </SettingsPanel>

        <SettingsPanel
          title={t('settings.ui.data.scheduledJobsTitle')}
          description={t('settings.data.deletionExplain')}
        >
          <SettingRow
            label={t('settings.ui.data.scheduledJobsCount', { count: jobCount })}
            description={t('settings.ui.data.deleteConsequence.jobs')}
            control={
              <Button
                variant="secondary"
                disabled={jobCount === 0}
                loading={cancelJobs.isSaving}
                onClick={() => void cancelJobs.run(undefined)}
              >
                {t('settings.ui.data.cancelJobsFirst')}
              </Button>
            }
          />
        </SettingsPanel>

        <SettingsPanel
          title={t('settings.ui.data.deleteTitle')}
          description={t('settings.ui.data.deleteBody')}
          footnote={t('settings.ui.data.exportFirst')}
          tone="danger"
        >
          <div className="flex flex-col">
            {DELETION_OPTIONS.map((option) => (
              <SettingRow
                key={option.scope}
                label={t(option.titleKey)}
                description={t(option.helpKey)}
                control={
                  <Button variant="secondary" asChild>
                    <Link href={option.href}>{t(option.titleKey)}</Link>
                  </Button>
                }
              />
            ))}
            <SettingRow
              label={t('settings.ui.data.deleteAccount')}
              description={t('settings.ui.data.deleteAccountHelp')}
              control={
                <Button variant="destructive" onClick={() => setClosing(true)}>
                  {t('settings.data.deletionRequest')}
                </Button>
              }
            />
          </div>
        </SettingsPanel>

        <SettingsPanel
          title={t('settings.data.retention')}
          description={t('settings.workspace.deleteWarning')}
        >
          <p className="text-body-md text-text-secondary max-w-[68ch]">
            {t('settings.ui.data.deleteConsequence.published')}
          </p>
        </SettingsPanel>
      </SettingsStack>

      <ConfirmDialog
        open={closing}
        onOpenChange={setClosing}
        tone="destructive"
        title={t('settings.ui.data.deleteAccount')}
        description={t('settings.data.deletionExplain')}
        consequences={[
          { id: 'jobs', text: t('settings.ui.data.deleteConsequence.jobs') },
          { id: 'connections', text: t('settings.ui.data.deleteConsequence.connections') },
          { id: 'media', text: t('settings.ui.data.deleteConsequence.media') },
          { id: 'receipts', text: t('settings.ui.data.deleteConsequence.receipts') },
          { id: 'published', text: t('settings.ui.data.deleteConsequence.published') },
        ]}
        confirmationPhrase={workspaceName}
        confirmationLabel={t('settings.ui.data.deleteConfirmPhraseLabel')}
        confirmLabel={t('settings.data.deletionRequest')}
        cancelLabel={t('action.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={() => requestClosure.run(undefined)}
      />
    </>
  );
}
