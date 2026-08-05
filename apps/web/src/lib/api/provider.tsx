'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { createQueryClient } from './query-client';

/**
 * One query client per browser session, created inside state so a React Strict
 * Mode double render does not build two caches.
 */
export function ApiProvider({ children }: { readonly children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
