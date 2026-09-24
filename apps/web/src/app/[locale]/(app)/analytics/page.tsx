import type { ReactElement } from 'react';
import { cookies } from 'next/headers';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { AnalyticsOverviewContainer } from '@/features/analytics/analytics-overview-container';
import { prefetchAnalyticsOverview } from '@/features/analytics/prefetch-analytics';
import { createQueryClient } from '@/lib/api/query-client';
import { ACTIVE_PROJECT_COOKIE } from '@/lib/auth/project-selection';
import { getForwardAuth, requireSession } from '@/lib/auth/require-session';

/**
 * The session is already resolved by the layout (and cached for the request),
 * so the extra work here is the connections list and the default 30 day
 * overview, which land in the first paint instead of after hydration.
 */
export default async function AnalyticsPage(): Promise<ReactElement> {
  const [session, forward, cookieStore] = await Promise.all([
    requireSession('/analytics'),
    getForwardAuth(),
    cookies(),
  ]);
  const queryClient = createQueryClient();
  await prefetchAnalyticsOverview(
    queryClient,
    session,
    cookieStore.get(ACTIVE_PROJECT_COOKIE)?.value ?? null,
    forward,
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnalyticsOverviewContainer />
    </HydrationBoundary>
  );
}
