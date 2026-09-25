'use client';

import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Switch } from '@relay/design-system/primitives';
import { Notice, PageHeader } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { AsyncBoundary } from '../lib/async-boundary';
import { settingsKey, useWorkspaceId } from '../lib/keys';
import { useSettingsMutation } from '../lib/use-settings-mutation';
import { SettingRow, SettingsPanel, SettingsStack } from '../components/section';
import { Link } from '@/components/link';
import { aiSettingsGateway } from './ai-settings-gateway';

/**
 * Settings, AI assistance.
 *
 * One switch: whether a model may look at images this workspace uploads. It
 * starts off. Only an owner or admin can change it, and the server decides
 * that (`canChange`), so a member sees the state and who to ask rather than a
 * control that would fail.
 */
export function AiSettingsScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.ai');
  const workspaceId = useWorkspaceId();
  const AI_KEY = settingsKey(workspaceId, 'ai');

  const settings = useQuery({ queryKey: AI_KEY, queryFn: () => aiSettingsGateway.get() });
  const save = useSettingsMutation({
    section,
    mutationFn: aiSettingsGateway.update,
    invalidate: [AI_KEY],
  });
  const current = settings.data;

  return (
    <>
      <PageHeader title={section} description={t('settings.ui.ai.description')} />
      <SettingsStack>
        <AsyncBoundary
          section={section}
          isPending={settings.isPending}
          error={settings.error}
          onRetry={() => void settings.refetch()}
          skeletonRows={2}
          skeletonColumns={2}
        >
          {current === undefined ? null : (
            <SettingsPanel
              title={t('settings.ui.ai.imageAnalysis.title')}
              description={t('settings.ui.ai.imageAnalysis.help')}
            >
              <div className="flex flex-col">
                <SettingRow
                  label={t('settings.ui.ai.imageAnalysis.label')}
                  description={
                    current.imageAnalysisEnabled
                      ? t('settings.ui.ai.imageAnalysis.on')
                      : t('settings.ui.ai.imageAnalysis.off')
                  }
                  control={
                    <Switch
                      checked={current.imageAnalysisEnabled}
                      disabled={!current.canChange || save.isSaving}
                      aria-label={t('settings.ui.ai.imageAnalysis.label')}
                      onCheckedChange={(next) =>
                        void save.run({ imageAnalysisEnabled: next === true })
                      }
                    />
                  }
                />
              </div>
              {current.canChange ? null : (
                <Notice tone="neutral" title={t('settings.ui.ai.imageAnalysis.readOnly')} />
              )}
              <p className="text-body-sm text-text-secondary max-w-[70ch]">
                {t('settings.ui.ai.imageAnalysis.whatIsSent')}{' '}
                <Link
                  className="text-text-primary decoration-border-strong hover:text-text-accent focus-visible:outline-border-focus underline decoration-1 underline-offset-[0.22em] focus-visible:outline-2 focus-visible:outline-offset-2"
                  href="/legal/ai-use"
                >
                  {t('settings.ui.ai.imageAnalysis.policyLink')}
                </Link>
              </p>
            </SettingsPanel>
          )}
        </AsyncBoundary>
      </SettingsStack>
    </>
  );
}
