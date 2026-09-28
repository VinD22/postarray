import 'server-only';

import type { QueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { ForwardAuth } from '@/lib/api/transport';
import type { SessionView } from '@/lib/api/types';
import { resolveActiveProject } from '@/lib/auth/project-selection';

import { analyticsConnectionsKey, defaultOverviewRange } from './overview-defaults';
import { analyticsKeys, fetchAnalyticsOverview, type OverviewInput } from './queries';

/**
 * Warm the overview's two opening reads on the server, under exactly the keys
 * the container and the screen ask for, so the first paint is the table rather
 * than a skeleton. `prefetchQuery` never throws: a failed read is left out of
 * the dehydrated state and the browser retries it with its own error states.
 */
export async function prefetchAnalyticsOverview(
  queryClient: QueryClient,
  session: SessionView,
  activeProjectId: string | null,
  forward: ForwardAuth,
): Promise<void> {
  const projectId = resolveActiveProject(session.projects, activeProjectId)?.id ?? null;
  const input: OverviewInput = {
    projectId,
    connectionIds: [],
    range: defaultOverviewRange(),
    rankMetric: 'impressions',
    format: null,
  };
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: analyticsConnectionsKey(session.workspace.id, projectId),
      queryFn: () =>
        api.connections.list({ limit: 100, ...(projectId === null ? {} : { projectId }) }, forward),
    }),
    queryClient.prefetchQuery({
      queryKey: analyticsKeys.overview(input),
      queryFn: () => fetchAnalyticsOverview(input, forward),
    }),
  ]);
}
