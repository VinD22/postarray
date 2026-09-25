import 'server-only';

import type { QueryClient } from '@tanstack/react-query';
import { getLocale } from '@relay/i18n';

import { api } from '@/lib/api';
import { keys } from '@/lib/api/keys';
import { collectAllPages, FOLLOW_PAGE_SIZE } from '@/lib/api/paginate';
import type { ForwardAuth } from '@/lib/api/transport';
import type { SessionView } from '@/lib/api/types';

import { computeRange } from './date-range';
import { parseAnchor, parseFilters, parseView, type ReadableParams } from './filters';

export interface CalendarPrefetchContext {
  readonly locale: string;
  /** The zone the client formats in: the one the app layout hands its provider. */
  readonly timeZone: string;
}

/**
 * Warm the visible calendar window on the server, under exactly the key
 * `useCalendarEntries` reads: the same view, anchor and project filter parsed
 * from the same URL, the same zone and the same week start. When the week turns
 * between the render and hydration the browser simply fetches its own window.
 *
 * `prefetchQuery` never throws: a failed read is left out of the dehydrated
 * state and the browser retries it with its own error handling.
 */
export async function prefetchCalendarWindow(
  queryClient: QueryClient,
  session: SessionView,
  params: ReadableParams,
  context: CalendarPrefetchContext,
  forward: ForwardAuth,
): Promise<void> {
  const descriptor = getLocale(context.locale) ?? getLocale(context.locale.split('-')[0] ?? 'en');
  const weekStartsOn = descriptor?.weekStartsOn ?? 0;
  const view = parseView(params, 'week');
  const visible = computeRange(view, parseAnchor(params, new Date()), context.timeZone, weekStartsOn);
  const projectId = parseFilters(params).projectId;
  const range = {
    from: visible.start.toISOString(),
    to: visible.end.toISOString(),
    ...(projectId ? { projectId } : {}),
  };
  await queryClient.prefetchQuery({
    queryKey: keys.calendar(session.workspace.id, range),
    queryFn: () =>
      collectAllPages((cursor) =>
        api.scheduling.getCalendar(
          {
            ...range,
            ianaTimeZone: session.workspace.timeZone,
            limit: FOLLOW_PAGE_SIZE,
            ...(cursor === undefined ? {} : { cursor }),
          },
          forward,
        ),
      ),
  });
}
