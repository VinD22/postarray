import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { HomeScreen } from '@/components/home/home-screen';
import { prefetchHomeCalendar } from '@/components/home/prefetch-home';
import { createQueryClient } from '@/lib/api/query-client';
import { ACTIVE_PROJECT_COOKIE } from '@/lib/auth/project-selection';
import { getForwardAuth, requireSession } from '@/lib/auth/require-session';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('home.title') };
}

/**
 * The session is already resolved by the layout (and cached for the request),
 * so the only extra work here is the calendar week, which lands in the first
 * paint instead of arriving after hydration.
 */
export default async function HomePage() {
  const [session, forward, cookieStore] = await Promise.all([
    requireSession('/home'),
    getForwardAuth(),
    cookies(),
  ]);
  const queryClient = createQueryClient();
  await prefetchHomeCalendar(
    queryClient,
    session,
    cookieStore.get(ACTIVE_PROJECT_COOKIE)?.value ?? null,
    forward,
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeScreen />
    </HydrationBoundary>
  );
}
