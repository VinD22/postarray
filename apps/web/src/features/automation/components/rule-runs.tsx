'use client';

import type { ReactElement } from 'react';
import { EmptyState, LoadingState, SkeletonList } from '@relay/design-system/patterns';
import { Badge, Code } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { QueryErrorState } from '@/features/analytics/components/query-error-state';
import { useValueFormat } from '@/features/analytics/use-value-format';

import type { RuleRunOutcome, RuleRunView } from '../types';

/**
 * What this rule has actually done.
 *
 * A skipped run is a first class row, not a hidden one. "Skipped, duplicate"
 * and "skipped, cadence budget" are the two most useful rows on this list,
 * because they are how a user discovers that a rule they believe is running has
 * quietly been doing nothing for a fortnight.
 *
 * The outcome is a word and a badge tone. It is never a coloured dot alone.
 */

const OUTCOME_KEY: Readonly<Record<RuleRunOutcome, string>> = {
  completed: 'automation.runs.outcome.completed',
  skipped: 'automation.runs.outcome.skipped',
  failed: 'automation.runs.outcome.failed',
  test: 'automation.runs.outcome.testMode',
};

const OUTCOME_TONE: Readonly<
  Record<RuleRunOutcome, 'success' | 'neutral' | 'destructive' | 'info'>
> = {
  completed: 'success',
  skipped: 'neutral',
  failed: 'destructive',
  test: 'info',
};

export interface RuleRunsProps {
  readonly runs: readonly RuleRunView[] | undefined;
  readonly loading: boolean;
  readonly error: unknown;
  readonly onRetry?: () => void;
}

export function RuleRuns({ runs, loading, error, onRetry }: RuleRunsProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();

  if (loading) {
    return (
      <LoadingState label={t('automation.state.loadingRule')}>
        <SkeletonList rows={4} avatar={false} />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <QueryErrorState
        error={error}
        title={t('automation.state.errorTitle')}
        description={t('automation.state.errorBody')}
        permission={{
          title: t('automation.state.permissionTitle'),
          description: t('automation.state.permissionBody'),
        }}
        rateLimit={{
          title: t('automation.state.rateLimitTitle'),
          cause: t('automation.state.rateLimitCause'),
          alternative: t('automation.state.rateLimitAlternative'),
        }}
        onRetry={onRetry}
      />
    );
  }

  if (!runs || runs.length === 0) {
    return (
      <EmptyState
        compact
        title={t('automation.rules.runs.title')}
        description={t('automation.rules.runs.empty')}
      />
    );
  }

  return (
    <section aria-labelledby="runs-heading" className="flex flex-col gap-3">
      <h2 id="runs-heading" className="text-title-sm text-text-primary">
        {t('automation.rules.runs.title')}
      </h2>

      <ul className="flex flex-col border-t border-border-subtle">
        {runs.map((run) => (
          <li
            key={run.id}
            className="flex flex-col gap-1 border-b border-border-subtle py-3"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <time dateTime={run.startedAt} className="text-body-md text-text-primary tabular-nums">
                {format.dateTime(run.startedAt)}
              </time>
              <Badge tone={OUTCOME_TONE[run.outcome]}>{t(OUTCOME_KEY[run.outcome])}</Badge>
              <span className="text-body-sm text-text-secondary">
                {t('automation.runs.actionCount', { count: run.externalActionCount })}
              </span>
            </div>

            <p className="text-body-md text-text-secondary">{run.triggerSummary}</p>

            {run.skippedReason ? (
              <p className="text-body-md text-text-secondary">
                {t('automation.runs.skippedReason', { reason: run.skippedReason })}
              </p>
            ) : null}

            {run.errorCode ? (
              <p className="flex flex-wrap items-center gap-1.5 text-body-sm text-destructive-fg">
                {t('automation.runs.outcome.failed')}
                <Code>{run.errorCode}</Code>
              </p>
            ) : null}

            {run.createdItems.length > 0 ? (
              <p className="text-body-sm text-text-tertiary">
                {t('automation.runs.createdItems')}
                <span className="ps-1.5">
                  {run.createdItems.map((item) => item.label).join(', ')}
                </span>
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
