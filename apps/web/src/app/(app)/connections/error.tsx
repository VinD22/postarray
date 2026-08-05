'use client';

import type { ReactElement } from 'react';

import { ConnectionsRouteError } from '@/features/connections/connections-fallback';

export default function ConnectionsError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}): ReactElement {
  return <ConnectionsRouteError reference={error.digest ?? null} onRetry={reset} />;
}
