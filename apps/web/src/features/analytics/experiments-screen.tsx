'use client';

import { useMemo, useState, type ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAnnouncer } from '@relay/design-system/hooks';
import { EmptyState, LoadingState, Notice, SkeletonList } from '@relay/design-system/patterns';
import { Badge, Button, Separator } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { api } from '@/lib/api';

import { ExperimentFormDialog, type ExperimentDraft } from './components/experiment-form-dialog';
import { QueryErrorState } from './components/query-error-state';
import { metricLabelKey } from './metrics';
import { useCreateExperiment, useExperiments } from './queries';
import type { AccountRef, ExperimentView } from './types';
import { useValueFormat } from './use-value-format';

/**
 * Experiments a user planned before publishing.
 *
 * A completed experiment shows the difference between its variants and then,
 * in the same block and at the same size, says that a difference is an
 * association rather than a cause and states how many posts it rests on. There
 * is no winner badge and no confidence score: a confidence figure computed from
 * five posts would be a decoration wearing a statistician's coat.
 *
 * Posts whose success metric was unavailable are excluded and counted. They are
 * never folded in as zero, which would move every average toward the variant
 * with the worse provider coverage.
 */

interface ConnectionLike {
  readonly id: string;
  readonly provider: AccountRef['provider'];
  readonly displayName?: string;
  readonly accountName?: string;
}

export function ExperimentsScreen(): ReactElement {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const [dialogOpen, setDialogOpen] = useState(false);

  const experiments = useExperiments('workspace');
  const create = useCreateExperiment('workspace');

  const connections = useQuery({
    queryKey: ['connections', 'list', 'experiments'],
    queryFn: async () => api.connections.list({ limit: 100 }),
  });

  const accounts = useMemo<readonly AccountRef[]>(() => {
    const data = (connections.data?.data ?? []) as readonly ConnectionLike[];
    return data.map((connection) => ({
      connectionId: connection.id,
      provider: connection.provider,
      handle: '',
      displayName: connection.displayName ?? connection.accountName ?? connection.id,
    }));
  }, [connections.data]);

  const handleSubmit = (draft: ExperimentDraft): void => {
    create.mutate(
      { ...draft, idempotencyKey: crypto.randomUUID() },
      {
        onSuccess: () => {
          setDialogOpen(false);
          announce(t('analytics.experiment.status.planned'), 'polite');
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex max-w-[70ch] flex-col gap-1">
          <h2 className="text-title-md text-text-primary">{t('analytics.experiment.title')}</h2>
          <p className="text-body-md text-text-secondary">
            {t('analytics.experiment.tagBeforePublishing')}
          </p>
        </div>
        <Button variant="primary" onClick={() => setDialogOpen(true)}>
          {t('analytics.experiment.new')}
        </Button>
      </div>

      {create.isError ? (
        <QueryErrorState
          error={create.error}
          title={t('analytics.state.errorTitle')}
          description={t('analytics.state.errorBody')}
          permission={{
            title: t('analytics.state.permissionTitle'),
            description: t('analytics.state.permissionBody'),
          }}
          rateLimit={{
            title: t('analytics.state.rateLimitTitle', {
              provider: t('analytics.filter.allAccounts'),
            }),
            cause: t('analytics.state.rateLimitCause'),
            alternative: t('analytics.state.rateLimitAlternative'),
          }}
        />
      ) : null}

      {experiments.isPending ? (
        <LoadingState label={t('analytics.state.loading')}>
          <SkeletonList rows={3} avatar={false} />
        </LoadingState>
      ) : experiments.isError ? (
        <QueryErrorState
          error={experiments.error}
          title={t('analytics.state.errorTitle')}
          description={t('analytics.state.errorBody')}
          permission={{
            title: t('analytics.state.permissionTitle'),
            description: t('analytics.state.permissionBody'),
          }}
          rateLimit={{
            title: t('analytics.state.rateLimitTitle', {
              provider: t('analytics.filter.allAccounts'),
            }),
            cause: t('analytics.state.rateLimitCause'),
            alternative: t('analytics.state.rateLimitAlternative'),
          }}
          onRetry={() => {
            void experiments.refetch();
          }}
        />
      ) : experiments.data.length === 0 ? (
        <EmptyState
          title={t('analytics.experiment.title')}
          description={t('analytics.experiment.empty')}
          example={t('analytics.experiment.emptyExample')}
          action={
            <Button variant="primary" onClick={() => setDialogOpen(true)}>
              {t('analytics.experiment.new')}
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-6">
          {experiments.data.map((experiment) => (
            <li key={experiment.id}>
              <ExperimentSummary experiment={experiment} />
            </li>
          ))}
        </ul>
      )}

      <ExperimentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        accounts={accounts}
        submitting={create.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function ExperimentSummary({ experiment }: { readonly experiment: ExperimentView }): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();
  const metricName = t(metricLabelKey(experiment.successMetric));

  const statusText =
    experiment.status === 'planned'
      ? t('analytics.experiment.status.planned')
      : experiment.status === 'collecting'
        ? t('analytics.experiment.status.collectingNow')
        : experiment.status === 'inconclusive'
          ? t('analytics.experiment.status.inconclusive')
          : t('analytics.experiment.status.complete');

  return (
    <article className="border-border-default flex flex-col gap-3 border-t pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-title-sm text-text-primary">{experiment.name}</h3>
        <Badge tone={experiment.status === 'complete' ? 'success' : 'neutral'}>{statusText}</Badge>
      </div>

      {experiment.hypothesis ? (
        <p className="text-body-md text-text-secondary max-w-[70ch]">{experiment.hypothesis}</p>
      ) : null}

      <p className="text-body-sm text-text-tertiary">
        {t('analytics.experiment.successMetric')}
        <span className="text-text-secondary ps-1.5">{metricName}</span>
        <span className="ps-3">
          {t('analytics.experiment.windowRange', {
            start: format.date(experiment.windowStart),
            end: format.date(experiment.windowEnd),
          })}
        </span>
      </p>

      {/*
        No variant list. The create endpoint accepts variants, the read model
        does not return them, and this screen used to map over the field
        anyway behind an unchecked cast, which throws on the first real
        experiment. Saying that the readings are not reported is honest; an
        empty list would read as "no variants were defined", which is false.
      */}
      <Notice
        tone="neutral"
        title={t('analytics.experiment.variants')}
        description={t('analytics.experiment.variantsNotReported')}
      />

      {experiment.conclusion === null && experiment.caveats === null ? null : (
        <Notice
          tone="neutral"
          title={t('analytics.experiment.result.title')}
          description={
            <span className="flex flex-col gap-1">
              {experiment.conclusion === null ? null : <span>{experiment.conclusion}</span>}
              <span>{t('analytics.experiment.result.associationOnly')}</span>
              {experiment.caveats === null ? null : (
                <span>
                  {t('analytics.experiment.caveats')}
                  <span className="ps-1.5">{experiment.caveats}</span>
                </span>
              )}
            </span>
          }
        />
      )}

      <Separator />
    </article>
  );
}
