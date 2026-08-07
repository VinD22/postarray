'use client';

/**
 * Route entry for the calendar.
 *
 * The route file stays a server component; everything that needs the session,
 * the query cache or the URL lives here. The brands come from the session
 * rather than from the entries, so the brand filter shows names a person
 * recognises instead of identifiers.
 */

import type { ReactNode } from 'react';
import { useSession } from '@/lib/auth/session-context';
import { CalendarScreen } from './calendar-screen';

export function CalendarContainer(): ReactNode {
  const { brands } = useSession();

  return (
    <CalendarScreen
      composeHref="/compose"
      actionCenterHref="/action-center"
      postHrefPattern="/posts/{id}"
      brands={brands.map((brand) => ({ id: brand.id, name: brand.name }))}
      customerGroups={brands.map((brand) => ({ id: brand.id, name: brand.name }))}
    />
  );
}
