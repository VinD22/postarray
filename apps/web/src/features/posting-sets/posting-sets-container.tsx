'use client';

/**
 * Route entry for Posting Sets.
 *
 * A Set is a saved list of accounts inside one project, so with no active
 * project there is nothing to list and nothing a new Set could belong to. The
 * connection list is read here rather than inside the screen so the screen
 * stays a function of the accounts it is handed.
 */

import type { ReactNode } from 'react';

import { EmptyState, PageHeader } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

import { useConnections } from '@/lib/api/hooks';
import { useSession } from '@/lib/auth/session-context';

import { PostingSetsRouteError, PostingSetsRouteFallback } from './posting-sets-fallback';
import { PostingSetsScreen } from './posting-sets-screen';

export function PostingSetsContainer(): ReactNode {
  const t = useTranslations();
  const { project } = useSession();
  const projectId = project?.id ?? null;
  const connections = useConnections(projectId === null ? {} : { projectId });

  if (projectId === null) {
    return (
      <div className="flex min-h-full flex-col">
        <PageHeader title={t('set.title')} description={t('set.lede')} />
        <div className="px-4 py-6 md:px-6">
          <EmptyState
            title={t('web.set.noProject.title')}
            description={t('web.set.noProject.body')}
          />
        </div>
      </div>
    );
  }

  if (connections.isPending) {
    return <PostingSetsRouteFallback />;
  }

  if (connections.isError) {
    return (
      <PostingSetsRouteError
        reference={connections.error.correlationId ?? null}
        onRetry={() => void connections.refetch()}
      />
    );
  }

  // TODO(owner): pass real signature options once a signatures read exists in
  // `@/lib/api`. The Set form already renders them; nothing serves them yet.
  return <PostingSetsScreen projectId={projectId} connections={connections.data.data} />;
}
