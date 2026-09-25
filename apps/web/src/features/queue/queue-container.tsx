'use client';

/**
 * Route entry for the queue rule editor.
 *
 * The route file stays a server component; the session lives here. A queue
 * rule belongs to exactly one project, so with no active project the screen
 * has nothing to read or write and says so rather than rendering an editor
 * whose save button can only fail.
 */

import type { ReactNode } from 'react';

import { EmptyState, PageHeader } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

import { useSession } from '@/lib/auth/session-context';

import { QueueRuleEditorScreen } from './rule-editor-screen';

export function QueueContainer(): ReactNode {
  const t = useTranslations();
  const { project } = useSession();

  if (project === null) {
    return (
      <div className="flex min-h-full flex-col">
        <PageHeader title={t('queue.title')} description={t('queue.subtitle')} />
        <div className="px-4 py-6 md:px-6">
          <EmptyState
            title={t('web.queue.noProject.title')}
            description={t('web.queue.noProject.body')}
          />
        </div>
      </div>
    );
  }

  return <QueueRuleEditorScreen />;
}
