'use client';

import type { ReactNode } from 'react';
import { Button } from '@relay/design-system/primitives';
import { Notice, PageHeader } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { Link } from '@/components/link';

import { SettingsStack } from './section';

export interface UnavailableSettingsScreenProps {
  readonly titleKey: string;
  readonly summaryKey: string;
  readonly detailKey: string;
}

/** Honest terminal state for a visible capability that is not implemented. */
export function UnavailableSettingsScreen({
  titleKey,
  summaryKey,
  detailKey,
}: UnavailableSettingsScreenProps): ReactNode {
  const t = useTranslations();

  return (
    <>
      <PageHeader title={t(titleKey)} description={t(summaryKey)} />
      <SettingsStack>
        <Notice
          tone="info"
          title={t('settings.ui.state.notBuiltTitle')}
          description={t(detailKey)}
          actions={
            <Button variant="secondary" asChild>
              <Link href="/settings">{t('action.back')}</Link>
            </Button>
          }
        />
      </SettingsStack>
    </>
  );
}
