'use client';

import type { ReactNode } from 'react';
import { ErrorState } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

export default function LibraryError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}): ReactNode {
  const t = useTranslations();
  return (
    <div className="px-4 pt-6 lg:px-6">
      <ErrorState
        title={t.full('mediaLib.error.title')}
        description={t.full('mediaLib.error.body')}
        onRetry={reset}
        retryLabel={t.full('action.retry')}
        {...(error.digest
          ? { reference: { label: t.full('common.details'), value: error.digest } }
          : {})}
      />
    </div>
  );
}
