'use client';

import { useMemo, type ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LoadingState, SkeletonTable } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { api } from '@/lib/api';
import { useLocalizedRouter } from '@/lib/i18n';
import { useSession } from '@/lib/auth/session-context';

import { AnalyticsOverviewScreen } from './analytics-overview-screen';
import type { AnalyticsFilters } from './components/analytics-toolbar';
import { QueryErrorState } from './components/query-error-state';
import type { AccountRef, AnalyticsRange } from './types';

/**
 * Loads the two lists the analytics filters need, then hands over.
 *
 * Kept apart from the screen so the screen can be rendered in a test with plain
 * props and no network. The screen is where the design decisions live; this is
 * only plumbing.
 */

function defaultRange(): AnalyticsRange {
  const end = new Date();
  const start = new Date(end.getTime() - 30 * 86_400_000);
  return { preset: '30d', start: start.toISOString(), end: end.toISOString() };
}

interface ConnectionLike {
  readonly id: string;
  readonly provider: AccountRef['provider'];
  readonly handle?: string;
  readonly displayName?: string;
  readonly accountName?: string;
}

export function AnalyticsOverviewContainer(): ReactElement {
  const t = useTranslations();
  const router = useLocalizedRouter();
  const { workspace, project } = useSession();

  const projects = useQuery({
    queryKey: ['ws', workspace.id, 'projects', 'list'],
    queryFn: async () => api.projects.list({ limit: 100 }),
  });

  const connections = useQuery({
    queryKey: ['ws', workspace.id, 'connections', 'analytics', project?.id ?? 'none'],
    queryFn: async () =>
      api.connections.list({ limit: 100, ...(project === null ? {} : { projectId: project.id }) }),
  });

  const accounts = useMemo<readonly AccountRef[]>(() => {
    const data = (connections.data?.data ?? []) as readonly ConnectionLike[];
    return data.map((connection) => ({
      connectionId: connection.id,
      provider: connection.provider,
      handle: connection.handle ?? '',
      displayName: connection.displayName ?? connection.accountName ?? connection.id,
    }));
  }, [connections.data]);

  const initialFilters = useMemo<AnalyticsFilters>(
    () => ({
      projectId: project?.id ?? null,
      connectionIds: [],
      range: defaultRange(),
      rankMetric: 'impressions',
      format: null,
      comparePrevious: false,
    }),
    [project?.id],
  );

  if (connections.isPending || projects.isPending) {
    return (
      <div className="px-4 py-6 md:px-6">
        <LoadingState label={t('analytics.state.loading')}>
          <SkeletonTable rows={6} columns={5} />
        </LoadingState>
      </div>
    );
  }

  if (connections.isError) {
    return (
      <div className="px-4 py-6 md:px-6">
        <QueryErrorState
          error={connections.error}
          title={t('analytics.state.errorTitle')}
          description={t('analytics.state.errorBody')}
          permission={{
            title: t('analytics.state.permissionTitle'),
            description: t('analytics.state.permissionBody'),
          }}
          rateLimit={{
            title: t('analytics.state.rateLimitTitle', {
              provider: t('analytics.filter.allAccounts'),
            }),
            cause: t('analytics.state.rateLimitCause'),
            alternative: t('analytics.state.rateLimitAlternative'),
          }}
          onRetry={() => {
            void connections.refetch();
          }}
        />
      </div>
    );
  }

  return (
    <AnalyticsOverviewScreen
      projects={(projects.data?.data ?? []) as readonly { id: string; name: string }[]}
      accounts={accounts}
      initialFilters={initialFilters}
      statusHref="/status"
      onOpenPost={(contentItemId) => router.push(`/analytics/posts/${contentItemId}`)}
      onReconnect={(connectionId) => router.push(`/connections/${connectionId}`)}
      onOpenConnection={(connectionId) => router.push(`/connections/${connectionId}`)}
      onTagExperiment={() => router.push('/analytics/experiments')}
    />
  );
}
