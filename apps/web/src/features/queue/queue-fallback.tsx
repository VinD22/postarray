'use client';

/**
 * Route level shells for the queue rule editor.
 *
 * The loading shell is shaped like the screen it replaces: a header, then the
 * rule list as a table skeleton, because the first thing this route renders is
 * a list of rules and a bare spinner would say nothing about that.
 *
 * The error shell never repeats the thrown message. Failing to read the rules
 * changes nothing about the schedule: posts already scheduled keep their
 * times, and slots already reserved keep theirs. Saying that is the difference
 * between an inconvenience and a panic.
 */

import type { ReactNode } from 'react';
import {
  Button,
  ErrorState,
  LoadingState,
  PageHeader,
  SkeletonTable,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

import { Link } from '@/components/link';

export function QueueRouteFallback(): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t('queue.title')} description={t('queue.subtitle')} />
      <div className="px-4 py-4 md:px-6">
        <LoadingState label={t('web.queue.loading')}>
          <SkeletonTable rows={6} columns={4} />
        </LoadingState>
      </div>
    </div>
  );
}

export function QueueRouteError({
  reference,
  onRetry,
}: {
  readonly reference: string | null;
  readonly onRetry: () => void;
}): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t('queue.title')} />
      <div className="px-4 py-6 md:px-6">
        <ErrorState
          title={t('web.queue.error.title')}
          description={t('web.queue.error.body')}
          onRetry={onRetry}
          retryLabel={t('action.retry')}
          {...(reference
            ? { reference: { label: t('receipt.correlationId'), value: reference } }
            : {})}
          secondaryAction={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/calendar">{t('calendar.title')}</Link>
            </Button>
          }
        />
      </div>
    </div>
  );
}
