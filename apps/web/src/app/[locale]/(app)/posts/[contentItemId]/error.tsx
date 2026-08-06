'use client';

import type { ReactElement } from 'react';

import { ReceiptRouteError } from '@/features/receipts/receipt-fallback';

export default function PostError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}): ReactElement {
  return <ReceiptRouteError reference={error.digest ?? null} onRetry={reset} />;
}
