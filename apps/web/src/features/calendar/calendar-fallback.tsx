'use client';

/**
 * Route level loading and error shells.
 *
 * The loading shell reserves the header and the grid so the page does not jump
 * when the data lands, and it announces itself once rather than per skeleton
 * row. The error shell never renders the thrown message: an unexpected render
 * failure is not a sentence anybody can act on, and the schedule on the server
 * is unaffected by it.
 */

import type { ReactNode } from 'react';
import {
  Button,
  ErrorState,
  LoadingState,
  PageHeader,
  Skeleton,
  SkeletonList,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

export function CalendarRouteFallback(): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title={t('calendar.title')}
        description={t('web.calendar.description')}
        toolbar={
          <div aria-hidden="true" className="flex flex-wrap gap-2">
            <Skeleton variant="block" width="16rem" className="h-8" />
            <Skeleton variant="block" width="12rem" className="h-8" />
            <Skeleton variant="block" width="18rem" className="h-8" />
          </div>
        }
      />
      <div className="px-4 py-4 md:px-6">
        <LoadingState label={t('loading.calendar')}>
          <SkeletonList rows={6} />
        </LoadingState>
      </div>
    </div>
  );
}

export function CalendarRouteError({
  reference,
  onRetry,
}: {
  readonly reference: string | null;
  readonly onRetry: () => void;
}): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t('calendar.title')} />
      <div className="px-4 py-6 md:px-6">
        <ErrorState
          title={t('web.calendar.error.title')}
          description={t('web.calendar.error.body')}
          onRetry={onRetry}
          retryLabel={t('web.calendar.error.retry')}
          {...(reference
            ? { reference: { label: t('receipt.correlationId'), value: reference } }
            : {})}
          secondaryAction={
            <Button variant="ghost" size="sm" asChild>
              <a href="/">{t('nav.home')}</a>
            </Button>
          }
        />
      </div>
    </div>
  );
}
