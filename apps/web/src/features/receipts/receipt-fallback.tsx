'use client';

/**
 * Route level shells for the post page.
 *
 * The receipt is a document, so its loading shell reserves a document shape:
 * a title, a status line, then a timeline. The error shell states plainly that
 * a receipt is immutable and that nothing was republished, because the first
 * fear on a failed receipt page is "did that just post again".
 */

import type { ReactNode } from 'react';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Skeleton,
  SkeletonList,
  SkeletonText,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

export function ReceiptRouteFallback(): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t('receipt.title')} description={t('receipt.subtitle')} />
      <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
        <LoadingState label={t('web.receipt.loading')}>
          <div className="flex flex-col gap-6">
            <Skeleton variant="block" width="10rem" className="h-7" />
            <SkeletonText lines={2} />
            <SkeletonList rows={6} avatar={false} />
          </div>
        </LoadingState>
      </div>
    </div>
  );
}

export function ReceiptRouteError({
  reference,
  onRetry,
}: {
  readonly reference: string | null;
  readonly onRetry: () => void;
}): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t('receipt.title')} />
      <div className="px-4 py-6 md:px-6">
        <ErrorState
          title={t('web.receipt.error.title')}
          description={t('web.receipt.error.body')}
          onRetry={onRetry}
          retryLabel={t('action.retry')}
          {...(reference
            ? { reference: { label: t('receipt.correlationId'), value: reference } }
            : {})}
          secondaryAction={
            <Button variant="ghost" size="sm" asChild>
              <a href="/calendar">{t('calendar.title')}</a>
            </Button>
          }
        />
      </div>
    </div>
  );
}

export function ReceiptNotFound(): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t('receipt.title')} />
      <div className="px-4 py-6 md:px-6">
        <EmptyState
          title={t('web.receipt.notFound.title')}
          description={t('web.receipt.notFound.body')}
          action={
            <Button variant="secondary" asChild>
              <a href="/calendar">{t('calendar.title')}</a>
            </Button>
          }
        />
      </div>
    </div>
  );
}
