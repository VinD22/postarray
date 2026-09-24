import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { CalendarContainer } from '@/features/calendar/calendar-container';
import { CalendarRouteFallback } from '@/features/calendar/calendar-fallback';
import { prefetchCalendarWindow } from '@/features/calendar/prefetch-calendar';
import { createQueryClient } from '@/lib/api/query-client';
import { getForwardAuth, requireSession } from '@/lib/auth/require-session';
import { getRequestIntl } from '@/lib/i18n/server';

type SearchParams = Record<string, string | string[] | undefined>;

function toReadable(params: SearchParams): URLSearchParams {
  const readable = new URLSearchParams();
  for (const [name, value] of Object.entries(params)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first !== undefined) readable.set(name, first);
  }
  return readable;
}

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return {
    title: intl.t.format('calendar.title'),
    description: intl.t.format('web.calendar.description'),
  };
}

/**
 * Calendar and queue.
 *
 * The container reads the view, the anchor date and the filters from the URL,
 * which is why it sits behind a Suspense boundary: `useSearchParams` makes the
 * subtree client-rendered, and the fallback keeps the page's shape while it
 * hydrates instead of collapsing to a blank frame. The visible window is read
 * on the server first, so the grid paints populated.
 */
export default async function CalendarPage({
  searchParams,
}: {
  readonly searchParams: Promise<SearchParams>;
}): Promise<ReactElement> {
  const [session, forward, params] = await Promise.all([
    requireSession('/calendar'),
    getForwardAuth(),
    searchParams,
  ]);
  // The same zone and locale the app layout hands the client provider, so the
  // server computes the window the browser will ask for.
  const intl = await getRequestIntl(session.workspace.timeZone);
  const queryClient = createQueryClient();
  await prefetchCalendarWindow(
    queryClient,
    session,
    toReadable(params),
    { locale: intl.locale, timeZone: intl.timeZone },
    forward,
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<CalendarRouteFallback />}>
        <CalendarContainer />
      </Suspense>
    </HydrationBoundary>
  );
}
