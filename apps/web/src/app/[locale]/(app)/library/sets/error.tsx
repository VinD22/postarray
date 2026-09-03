'use client';

import type { ReactElement } from 'react';

import { PostingSetsRouteError } from '@/features/posting-sets/posting-sets-fallback';

/**
 * The route level error boundary.
 *
 * It never shows the thrown message: an unexpected render failure is not a
 * sentence a person can act on, and every Set on the server is unaffected by
 * it. The digest is offered as a support reference instead.
 */
export default function PostingSetsError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}): ReactElement {
  return <PostingSetsRouteError reference={error.digest ?? null} onRetry={reset} />;
}
