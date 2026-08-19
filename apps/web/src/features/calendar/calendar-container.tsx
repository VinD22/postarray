'use client';

/**
 * Route entry for the calendar.
 *
 * The route file stays a server component; everything that needs the session,
 * the query cache or the URL lives here. The projects come from the session
 * rather than from the entries, so the project filter shows names a person
 * recognises instead of identifiers.
 */

import type { ReactNode } from 'react';
import { useSession } from '@/lib/auth/session-context';
import { CalendarScreen } from './calendar-screen';

export function CalendarContainer(): ReactNode {
  const { projects, project } = useSession();

  return (
    <CalendarScreen
      composeHref="/compose"
      actionCenterHref="/action-center"
      postHrefPattern="/posts/{id}"
      defaultProjectId={project?.id ?? null}
      projects={projects.map((entry) => ({ id: entry.id, name: entry.name }))}
      customerGroups={projects.map((entry) => ({ id: entry.id, name: entry.name }))}
    />
  );
}
