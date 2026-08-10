'use client';

/**
 * Route level loading and error shells.
 *
 * The loading shell reserves the header and the row table so the page does not
 * jump when the report lands. The error shell never renders the thrown message:
 * an unexpected render failure is not a sentence anybody can act on, and no
 * import that already ran is affected by it.
 */

import type { ReactNode } from 'react';
import { ErrorState, LoadingState, PageHeader, Skeleton, SkeletonList } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

export function ImportRouteFallback(): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t('import.title')} description={t('import.subtitle')} />
      <div className="px-4 py-4 md:px-6">
        <LoadingState label={t('import.upload.submitting')}>
          <Skeleton variant="block" width="18rem" className="h-8" />
          <SkeletonList rows={5} />
        </LoadingState>
      </div>
    </div>
  );
}

export function ImportRouteError({
  reference,
  onRetry,
}: {
  readonly reference: string | null;
  readonly onRetry: () => void;
}): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t('import.title')} />
      <div className="px-4 py-6 md:px-6">
        <ErrorState
          title={t('import.title')}
          description={t('import.subtitle')}
          onRetry={onRetry}
          retryLabel={t('actions.retry')}
          {...(reference
            ? { reference: { label: t('receipt.correlationId'), value: reference } }
            : {})}
        />
      </div>
    </div>
  );
}
