'use client';

import type { ReactNode } from 'react';
import { Link } from '@/components/link';
import { Button } from '@relay/design-system/primitives';
import { Notice, PageHeader } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

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

  return (
    <>
      <PageHeader title={section} description={t('settings.ui.data.description')} />

      <SettingsStack>
        <SettingsPanel
          title={t('settings.ui.data.exportTitle')}
          description={t('settings.ui.data.exportBody')}
        >
          <Notice
            tone="info"
            title={t('settings.ui.state.notBuiltTitle')}
            description={t('settings.ui.data.exportUnavailable')}
          />
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
