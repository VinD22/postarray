'use client';

/**
 * Route level shells for Posting Sets.
 *
 * The loading shell is shaped like the screen: a header and then the list of
 * Sets as a table skeleton. The error shell says the one thing a person needs
 * to hear, which is that failing to read the list changed nothing: every Set
 * still exists and every post already made from one is untouched.
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

export function PostingSetsRouteFallback(): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t('set.title')} description={t('set.lede')} />
      <div className="px-4 py-4 md:px-6">
        <LoadingState label={t('web.set.loading')}>
          <SkeletonTable rows={5} columns={4} />
        </LoadingState>
      </div>
    </div>
  );
}

export function PostingSetsRouteError({
  reference,
  onRetry,
}: {
  readonly reference: string | null;
  readonly onRetry: () => void;
}): ReactNode {
  const t = useTranslations();

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t('set.title')} />
      <div className="px-4 py-6 md:px-6">
        <ErrorState
          title={t('web.set.error.title')}
          description={t('web.set.error.body')}
          onRetry={onRetry}
          retryLabel={t('action.retry')}
          {...(reference
            ? { reference: { label: t('receipt.correlationId'), value: reference } }
            : {})}
          secondaryAction={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/library">{t('nav.library')}</Link>
            </Button>
          }
        />
      </div>
    </div>
  );
}
