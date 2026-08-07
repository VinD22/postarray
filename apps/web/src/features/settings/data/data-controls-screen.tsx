'use client';

import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/components/link';
import { Button } from '@relay/design-system/primitives';
import { Notice, PageHeader } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { dataGateway } from '../lib/gateway';
import { AsyncBoundary } from '../lib/async-boundary';
import { useFormatters } from '../lib/formatters';
import { settingsKey, useWorkspaceId } from '../lib/keys';
import { useSettingsMutation } from '../lib/use-settings-mutation';
import { SettingRow, SettingsPanel, SettingsStack } from '../components/section';

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
  const EXPORT_KEY = settingsKey(workspaceId, 'data', 'exports');
  const exportJob = useQuery({ queryKey: EXPORT_KEY, queryFn: () => dataGateway.exportJob() });
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
  const job = exportJob.data;
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
                <span className="text-body-sm text-text-tertiary">
                  {t('settings.ui.state.notBuiltShort')}
                </span>
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
    </>
  );
}
