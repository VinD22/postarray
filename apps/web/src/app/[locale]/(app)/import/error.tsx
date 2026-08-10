'use client';

import type { ReactElement } from 'react';

import { ImportRouteError } from '@/features/import/import-fallback';

/**
 * The route level error boundary.
 *
 * It never shows the thrown message. An unexpected render failure is not a
 * sentence a person can act on, and nothing that was already imported is
 * affected by it. The digest is offered as a support reference instead.
 */
export default function ImportError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}): ReactElement {
  return <ImportRouteError reference={error.digest ?? null} onRetry={reset} />;
}
