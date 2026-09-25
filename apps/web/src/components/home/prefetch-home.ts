import 'server-only';

import type { QueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { keys } from '@/lib/api/keys';
import { collectAllPages, FOLLOW_PAGE_SIZE } from '@/lib/api/paginate';
import type { SessionView } from '@/lib/api/types';
import { resolveActiveProject } from '@/lib/auth/project-selection';
import type { ForwardAuth } from '@/lib/api/transport';

import { homeWindowRange } from './home-window';

/**
 * Warm Home's calendar window on the server, under exactly the key
 * `useHomeCalendar` reads, so the first paint has the week instead of a
 * skeleton. The range is hour-aligned, so the server and the browser agree on
 * the key unless the hour turns between them, in which case the browser simply
 * fetches its own.
 *
 * `prefetchQuery` never throws: a failed read is left out of the dehydrated
 * state and the browser retries it with its own error handling.
 */
export async function prefetchHomeCalendar(
  queryClient: QueryClient,
  session: SessionView,
  activeProjectId: string | null,
  forward: ForwardAuth,
): Promise<void> {
  const project = resolveActiveProject(session.projects, activeProjectId);
  const range = {
    ...homeWindowRange(Date.now()),
    ...(project === null ? {} : { projectId: project.id }),
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
