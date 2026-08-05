'use client';

import type { ReactNode } from 'react';
import { Button } from '@relay/design-system/primitives';
import {
  ErrorState,
  LoadingState,
  OfflineBanner,
  PermissionDenied,
  RateLimitNotice,
  SkeletonTable,
} from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { describeApiError } from './api-error.js';
import { useFormatters } from './formatters.js';

export interface AsyncBoundaryProps {
  /** The name of the section, already translated. Used in every state. */
  section: string;
  isPending: boolean;
  error: unknown;
  /** Retry the read. A read is always safe to retry. */
  onRetry: () => void;
  /** Rows to reserve while loading, so the layout does not jump. */
  skeletonRows?: number;
  skeletonColumns?: number;
  children: ReactNode;
}

/**
 * Every settings screen wraps its data in this.
 *
 * Loading reserves the real layout instead of spinning. An error is classified
 * before it is rendered, so a missing scope becomes a permission screen naming
 * the scope, a rate limit becomes a notice with the reset time, and a dropped
 * connection becomes an offline status rather than a red failure the user did
 * not cause.
 */
export function AsyncBoundary({
  section,
  isPending,
  error,
  onRetry,
  skeletonRows = 5,
  skeletonColumns = 4,
  children,
}: AsyncBoundaryProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();

  if (isPending) {
    return (
      <LoadingState label={t('settings.ui.state.loading', { section })}>
        <SkeletonTable rows={skeletonRows} columns={skeletonColumns} />
      </LoadingState>
    );
  }

  if (error !== null && error !== undefined) {
    const described = describeApiError(error);

    if (described.kind === 'offline') {
      return (
        <OfflineBanner
          title={t('settings.ui.state.offlineTitle')}
          description={t('settings.ui.state.offlineBody')}
          actions={
            <Button size="sm" variant="secondary" onClick={onRetry}>
              {t('settings.ui.state.errorRetry')}
            </Button>
          }
        />
      );
    }

    if (described.kind === 'permission') {
      return (
        <PermissionDenied
          title={t('settings.ui.state.permissionTitle', { section })}
          description={t('settings.ui.state.permissionBody')}
          requirements={described.requirements}
          requirementsLabel={t('settings.ui.state.permissionRequirements')}
          contact={t('settings.ui.state.permissionContact')}
        />
      );
    }

    if (described.kind === 'rate-limit') {
      const usage =
        described.usedRequests !== null && described.limitRequests !== null
          ? {
              used: described.usedRequests,
              limit: described.limitRequests,
              label: t('settings.ui.state.rateLimitUsage'),
              text: t('settings.ui.state.rateLimitUsageText', {
                used: formatters.number(described.usedRequests),
                limit: formatters.number(described.limitRequests),
              }),
            }
          : undefined;

      return (
        <RateLimitNotice
          title={t('settings.ui.state.rateLimitTitle')}
          cause={t('settings.ui.state.rateLimitCause')}
          resetLabel={t('settings.ui.state.rateLimitReset')}
          resetAt={
            described.resetAt === null
              ? t('common.unknown')
              : formatters.dateTime(described.resetAt)
          }
          usage={usage}
          alternative={t('settings.ui.state.rateLimitAlternative')}
        />
      );
    }

    return (
      <ErrorState
        title={t('settings.ui.state.errorTitle', { section })}
        description={
          described.messageKey === null
            ? t('error.unknown.message')
            : t(described.messageKey, described.values)
        }
        subject={{ label: t('common.details'), value: section }}
        onRetry={described.retrySafe ? onRetry : undefined}
        retryLabel={described.retrySafe ? t('settings.ui.state.errorRetry') : undefined}
        reference={
          described.correlationId === null
            ? undefined
            : { label: t('settings.ui.state.referenceLabel'), value: described.correlationId }
        }
      />
    );
  }

  return <>{children}</>;
}
