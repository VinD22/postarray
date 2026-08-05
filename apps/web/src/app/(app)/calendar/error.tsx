'use client';

import type { ReactElement } from 'react';

import { CalendarRouteError } from '@/features/calendar/calendar-fallback';

/**
 * The route level error boundary.
 *
 * It never shows the thrown message: an unexpected render failure is not a
 * sentence a person can act on, and the schedule itself is unaffected. The
 * digest is offered as a support reference instead.
 */
export default function CalendarError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}): ReactElement {
  return <CalendarRouteError reference={error.digest ?? null} onRetry={reset} />;
}
