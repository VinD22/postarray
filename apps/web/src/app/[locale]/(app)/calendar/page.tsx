import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { Suspense } from 'react';

import { CalendarContainer } from '@/features/calendar/calendar-container';
import { CalendarRouteFallback } from '@/features/calendar/calendar-fallback';
import { getRequestIntl } from '@/lib/i18n/server';

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
 * hydrates instead of collapsing to a blank frame.
 */
export default function CalendarPage(): ReactElement {
  return (
    <Suspense fallback={<CalendarRouteFallback />}>
      <CalendarContainer />
    </Suspense>
  );
}
