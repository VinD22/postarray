'use client';

/**
 * The route error boundary.
 *
 * The first thing it says is that nothing was lost, because that is the first
 * thing a person writing a post wants to know.
 */

import type { ReactNode } from 'react';
import { ErrorState } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

export default function ComposeError({
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
        title={t.full('composerWeb.page.errorTitle')}
        description={t.full('composerWeb.page.errorBody')}
        onRetry={reset}
        retryLabel={t.full('action.retry')}
        {...(error.digest
          ? { reference: { label: t.full('common.details'), value: error.digest } }
          : {})}
      />
    </div>
  );
}
