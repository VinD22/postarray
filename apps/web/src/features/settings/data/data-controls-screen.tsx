'use client';

import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/components/link';
import { Button } from '@relay/design-system/primitives';
import { Notice, PageHeader } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { dataGateway, workspaceGateway } from '../lib/gateway';
import { AsyncBoundary } from '../lib/async-boundary';
import { useFormatters } from '../lib/formatters';
import { settingsKey, useWorkspaceId } from '../lib/keys';
import { useSettingsMutation } from '../lib/use-settings-mutation';
import { SettingRow, SettingsPanel, SettingsStack } from '../components/section';
import { WorkspaceDeletionDialog } from './workspace-deletion-dialog';

/**
 * Removing one connection, one project or one draft happens where that thing
 * lives, so the row links there instead of building a second delete path that
 * could drift from the first. Closing the workspace is the only action that
 * belongs on this screen, and it is a request with a confirmation window.
 */
const DELETION_OPTIONS: readonly {
  readonly scope: 'connection' | 'project' | 'content';
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
    scope: 'project',
    titleKey: 'settings.ui.data.deleteProject',
    helpKey: 'settings.ui.data.deleteProjectHelp',
    href: '/settings/projects',
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
  const EXPORT_KEY = settingsKey(workspaceId, 'data', 'exports');
  const DELETION_KEY = settingsKey(workspaceId, 'data', 'deletion');
  const exportJob = useQuery({ queryKey: EXPORT_KEY, queryFn: () => dataGateway.exportJob() });
  const deletionJob = useQuery({
    queryKey: DELETION_KEY,
    queryFn: () => dataGateway.deletionJob(),
    refetchInterval: 30_000,
  });
  const workspaceIdentity = useQuery({
    queryKey: settingsKey(workspaceId, 'identity'),
    queryFn: () => workspaceGateway.identity(),
  });
  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);
  const startExport = useSettingsMutation({
    section,
    mutationFn: () => dataGateway.startExport({ formats: ['json'] }),
    invalidate: [EXPORT_KEY],
    successMessage: t('settings.ui.data.exportStart'),
  });
  const downloadExport = useSettingsMutation({
    section,
    mutationFn: (exportId: string) => dataGateway.download(exportId),
    onSuccess: (result) => {
      window.location.assign(result.downloadUrl);
    },
  });
  const requestDeletion = useSettingsMutation({
    section,
    mutationFn: dataGateway.requestWorkspaceDeletion,
    invalidate: [DELETION_KEY],
    successMessage: t('settings.ui.data.deleteRequestScheduled'),
    onSuccess: () => setDeletionDialogOpen(false),
  });
  const cancelDeletion = useSettingsMutation({
    section,
    mutationFn: dataGateway.cancelWorkspaceDeletion,
    invalidate: [DELETION_KEY],
    successMessage: t('settings.ui.data.deleteRequestCanceled'),
  });
  const job = exportJob.data;
  const deletion = deletionJob.data;
  const deletionId = deletion?.id ?? null;
  const readyExportId = job?.state === 'ready' ? job.id : null;

  return (
    <>
      <PageHeader title={section} description={t('settings.ui.data.description')} />

      <SettingsStack>
        <SettingsPanel
          title={t('settings.ui.data.exportTitle')}
          description={t('settings.ui.data.exportBody')}
        >
          <AsyncBoundary
            section={t('settings.ui.data.exportTitle')}
            isPending={exportJob.isPending}
            error={exportJob.error}
            onRetry={() => void exportJob.refetch()}
            skeletonRows={1}
            skeletonColumns={1}
          >
            {job?.state === 'idle' ? (
              <Notice
                tone="info"
                title={t('settings.ui.data.exportJson')}
                description={t('settings.ui.data.exportJsonOnly')}
                actions={
                  <Button
                    variant="primary"
                    loading={startExport.isSaving}
                    onClick={() => void startExport.run(undefined)}
                  >
                    {t('settings.ui.data.exportStart')}
                  </Button>
                }
              />
            ) : null}
            {job?.state === 'running' ? (
              <Notice
                tone="info"
                liveness="status"
                title={t('settings.ui.data.exportRunning')}
                description={t('settings.ui.data.exportJsonOnly')}
              />
            ) : null}
            {job?.state === 'ready' ? (
              <Notice
                tone="success"
                title={t('settings.ui.data.exportReady', {
                  date:
                    job.preparedAt === null
                      ? t('common.unknown')
                      : formatters.dateTime(job.preparedAt),
                })}
                description={
                  job.expiresAt === null
                    ? undefined
                    : t('settings.ui.data.exportExpires', {
                        date: formatters.dateTime(job.expiresAt),
                      })
                }
                actions={
                  readyExportId === null ? undefined : (
                    <Button
                      variant="secondary"
                      loading={downloadExport.isSaving}
                      onClick={() => void downloadExport.run(readyExportId)}
                    >
                      {t('settings.ui.data.exportDownload')}
                    </Button>
                  )
                }
              />
            ) : null}
            {job?.state === 'failed' ? (
              <Notice
                tone="destructive"
                liveness="alert"
                title={t('settings.ui.data.exportFailed')}
                actions={
                  <Button
                    variant="secondary"
                    loading={startExport.isSaving}
                    onClick={() => void startExport.run(undefined)}
                  >
                    {t('settings.ui.state.errorRetry')}
                  </Button>
                }
              />
            ) : null}
          </AsyncBoundary>
        </SettingsPanel>

        <SettingsPanel
          title={t('settings.ui.data.scheduledJobsTitle')}
          description={t('settings.data.deletionExplain')}
        >
          <Notice
            tone="info"
            title={t('settings.ui.data.bulkCancelUnavailableTitle')}
            description={t('settings.ui.data.bulkCancelUnavailableBody')}
            actions={
              <Button variant="secondary" asChild>
                <Link href="/calendar">{t('nav.calendar')}</Link>
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
                <Button
                  variant="secondary"
                  disabled={
                    workspaceIdentity.data?.name === undefined ||
                    deletionJob.isError ||
                    deletion?.state === 'scheduled' ||
                    deletion?.state === 'executing' ||
                    deletion?.state === 'completed'
                  }
                  onClick={() => setDeletionDialogOpen(true)}
                >
                  {t('settings.ui.data.deleteAccount')}
                </Button>
              }
            />
            {deletion?.state === 'scheduled' ? (
              <Notice
                tone="warning"
                liveness="status"
                title={t('settings.ui.data.deleteRequestScheduled')}
                description={t('settings.ui.data.deleteRequestScheduledBody', {
                  date:
                    deletion.executeAfter === null
                      ? t('common.unknown')
                      : formatters.dateTime(deletion.executeAfter),
                })}
                actions={
                  deletionId === null ? undefined : (
                    <Button
                      variant="secondary"
                      loading={cancelDeletion.isSaving}
                      onClick={() => void cancelDeletion.run(deletionId)}
                    >
                      {t('settings.ui.data.deleteRequestCancel')}
                    </Button>
                  )
                }
              />
            ) : null}
            {deletionJob.isError ? (
              <Notice
                tone="destructive"
                liveness="alert"
                title={t('settings.ui.state.errorTitle', {
                  section: t('settings.ui.data.deleteAccount'),
                })}
                description={t('settings.ui.state.errorRetry')}
                actions={
                  <Button variant="secondary" onClick={() => void deletionJob.refetch()}>
                    {t('settings.ui.state.errorRetry')}
                  </Button>
                }
              />
            ) : null}
            {deletion?.state === 'executing' ? (
              <Notice
                tone="warning"
                liveness="status"
                title={t('settings.ui.data.deleteRequestExecuting')}
                description={t('settings.ui.data.deleteRequestExecutingBody')}
              />
            ) : null}
            {deletion?.state === 'canceled' ? (
              <Notice
                tone="neutral"
                title={t('settings.ui.data.deleteRequestCanceled')}
                description={t('settings.ui.data.deleteRequestCanceledBody')}
              />
            ) : null}
            {deletion?.state === 'completed' ? (
              <Notice
                tone="success"
                title={t('settings.ui.data.deleteRequestCompleted')}
                description={t('settings.ui.data.deleteRequestCompletedBody')}
              />
            ) : null}
            {deletion?.state === 'failed' ? (
              <Notice
                tone="destructive"
                liveness="alert"
                title={t('settings.ui.data.deleteRequestFailed')}
                description={t('settings.ui.data.deleteRequestFailedBody')}
              />
            ) : null}
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
      <WorkspaceDeletionDialog
        open={deletionDialogOpen}
        onOpenChange={setDeletionDialogOpen}
        workspaceName={workspaceIdentity.data?.name ?? ''}
        saving={requestDeletion.isSaving}
        onSubmit={(input) => void requestDeletion.run(input)}
      />
    </>
  );
}
