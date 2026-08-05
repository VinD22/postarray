'use client';

import type { ReactElement, ReactNode } from 'react';
import {
  ErrorState,
  PermissionDenied,
  RateLimitNotice,
} from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { ApiError } from '@/lib/api';

import { useValueFormat } from '../use-value-format';

/**
 * One failure, rendered as the right kind of failure.
 *
 * Three of the required states are the same HTTP round trip with a different
 * code on it, so they are decided here rather than duplicated on every screen:
 * permission denied names the role that is missing, rate limited shows the
 * cause, the reset time and a cheaper alternative, and everything else is an
 * error that names what failed and says what is still safe.
 *
 * Retry is offered only when the failed call was a read or when the API marked
 * the error retryable. Nothing on these screens publishes, so a retry here is
 * always safe, but the rule is enforced by the caller passing `onRetry` rather
 * than by this component assuming it.
 */

export interface QueryErrorStateProps {
  readonly error: unknown;
  /** Already translated title naming the screen or the account that failed. */
  readonly title: string;
  /** Already translated sentence saying what is unaffected. */
  readonly description: string;
  /** Permission copy for this screen. */
  readonly permission: { readonly title: string; readonly description: string };
  /** Rate limit copy for this screen. */
  readonly rateLimit: {
    readonly title: string;
    readonly cause: string;
    readonly alternative: string;
  };
  readonly onRetry?: (() => void) | undefined;
  readonly retrying?: boolean;
  readonly secondaryAction?: ReactNode;
}

export function QueryErrorState({
  error,
  title,
  description,
  permission,
  rateLimit,
  onRetry,
  retrying = false,
  secondaryAction,
}: QueryErrorStateProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();

  if (ApiError.is(error) && error.isAuthorization) {
    return (
      <PermissionDenied
        title={permission.title}
        description={permission.description}
        contact={t(error.actionKey, error.messageValues)}
      />
    );
  }

  if (ApiError.is(error) && error.isRateLimited) {
    const resetAt =
      error.retryAfterSeconds === null
        ? null
        : new Date(Date.now() + error.retryAfterSeconds * 1000).toISOString();
    return (
      <RateLimitNotice
        title={rateLimit.title}
        cause={rateLimit.cause}
        resetLabel={t('analytics.state.rateLimitReset')}
        resetAt={resetAt === null ? t('common.unknown') : format.relative(resetAt)}
        alternative={rateLimit.alternative}
        actions={
          onRetry ? (
            <Button size="sm" variant="secondary" loading={retrying} onClick={onRetry}>
              {t('action.retry')}
            </Button>
          ) : null
        }
      />
    );
  }

  const apiError = ApiError.is(error) ? error : null;

  return (
    <ErrorState
      title={title}
      description={
        apiError
          ? `${t(apiError.messageKey, apiError.messageValues)} ${t(apiError.actionKey, apiError.messageValues)}`
          : description
      }
      subject={{ label: t('common.details'), value: description }}
      reference={
        apiError?.correlationId
          ? { label: t('analytics.state.reference'), value: apiError.correlationId }
          : undefined
      }
      onRetry={onRetry}
      retryLabel={onRetry ? t('action.retry') : undefined}
      retrying={retrying}
      secondaryAction={secondaryAction}
    />
  );
}
