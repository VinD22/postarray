/**
 * The shared TanStack Query configuration.
 *
 * Retry policy is deliberate: a request is retried only when the typed error
 * says it is retryable. A 403, a 409 or a validation failure is never retried,
 * because repeating it cannot change the answer and it makes the log noisier
 * for the person reading it during an incident.
 */

import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';

import { ApiError } from './error.js';

const MAX_RETRIES = 2;

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) {
    return false;
  }
  if (!ApiError.is(error)) {
    return false;
  }
  if (error.isRateLimited) {
    // Respect the reset time instead of hammering. The screen shows the
    // remaining window; a background retry would race it.
    return false;
  }
  return error.retryable;
}

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: shouldRetry,
      retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 8_000),
      refetchOnWindowFocus: true,
      // A stale queue is worse than a slightly late one on a control plane.
      refetchOnReconnect: true,
    },
    mutations: {
      // A mutation is a user intent. Retrying it automatically is how a
      // duplicate external post happens, so it never retries by itself.
      retry: false,
    },
  },
};

export function createQueryClient(): QueryClient {
  return new QueryClient(queryClientConfig);
}
