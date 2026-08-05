'use client';

/**
 * Route level shells for connections.
 *
 * The error copy is deliberate: a failure to read the connection list does not
 * stop anything from publishing, because scheduled posts run against stored
 * access on the server. Saying so is the difference between an inconvenience
 * and a panic.
 */

import type { ReactNode } from 'react';
import {
  Button,
  ErrorState,
  LoadingState,
  PageHeader,
  SkeletonList,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

export function ConnectionsRouteFallback(): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t('connection.title')} description={t('connection.subtitle')} />
      <div className="px-4 py-4 md:px-6">
        <LoadingState label={t('web.connection.loading')}>
          <SkeletonList rows={4} />
        </LoadingState>
      </div>
    </div>
  );
}

export function ConnectionsRouteError({
  reference,
  onRetry,
}: {
  readonly reference: string | null;
  readonly onRetry: () => void;
}): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t('connection.title')} />
      <div className="px-4 py-6 md:px-6">
        <ErrorState
          title={t('web.connection.error.title')}
          description={t('web.connection.error.body')}
          onRetry={onRetry}
          retryLabel={t('action.retry')}
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
