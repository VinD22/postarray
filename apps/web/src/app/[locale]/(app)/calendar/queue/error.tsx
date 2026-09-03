'use client';

import type { ReactElement } from 'react';

import { QueueRouteError } from '@/features/queue/queue-fallback';

/**
 * The route level error boundary.
 *
 * It never shows the thrown message: an unexpected render failure is not a
 * sentence a person can act on, and the rules on the server are unaffected by
 * it. The digest is offered as a support reference instead.
 */
export default function QueueRulesError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}): ReactElement {
  return <QueueRouteError reference={error.digest ?? null} onRetry={reset} />;
}
