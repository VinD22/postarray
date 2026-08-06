'use client';

import type { ReactElement } from 'react';
import { EmptyState } from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { StaggerList } from '@/components/motion';

import type { ConfounderCode, Observation } from '../types';
import { useValueFormat } from '../use-value-format';

/**
 * What the numbers show, phrased as descriptions rather than as advice.
 *
 * The wording rules are the point of this component:
 *
 * - Every sentence names its sample size and the period it covers.
 * - An association is labelled as an association. "Comments increased after the
 *   first comment delay changed" is followed by "this is an association, not
 *   proof of cause", in the same block, at the same size.
 * - A comparison across formats says so, because image posts and video posts
 *   are not two samples of the same thing.
 * - The only forward looking sentence is a test to run, and it names the one
 *   variable to change. Nothing here predicts a number.
 *
 * There is no score, no grade and no ranking against other workspaces.
 *
 * The list itself mounts with a one-time stagger (`<StaggerList>`) as it
 * scrolls into view — motion only, never a reason the sample size or the
 * period would be visible any later than the sentence beside it.
 */

const OBSERVATION_KEY: Readonly<Record<Observation['kind'], string>> = {
  above_baseline: 'analytics.feedback.aboveBaseline',
  below_baseline: 'analytics.feedback.belowBaseline',
  association: 'analytics.feedback.association',
  coverage_gap: 'analytics.freshness.coverage',
};

const CONFOUNDER_KEY: Readonly<Record<ConfounderCode, string>> = {
  time_of_day: 'analytics.evidence.confounder.time',
  mixed_formats: 'analytics.feedback.notComparableFormats',
  follower_change: 'analytics.evidence.confounder.followers',
  paid_distribution: 'analytics.evidence.confounder.paid',
  provider_definition_change: 'analytics.evidence.confounder.provider',
};

export interface NextTest {
  readonly accountName: string;
  readonly variable: string;
  readonly postCount: number;
}

export interface ObservationsProps {
  readonly observations: readonly Observation[];
  readonly nextTest?: NextTest | undefined;
  readonly onTagExperiment?: () => void;
}

export function Observations({
  observations,
  nextTest,
  onTagExperiment,
}: ObservationsProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();

  return (
    <section aria-labelledby="observations-heading" className="flex flex-col gap-4">
      <div className="flex max-w-[70ch] flex-col gap-1">
        <h2 id="observations-heading" className="text-title-sm text-text-primary">
          {t('analytics.observations.title')}
        </h2>
        <p className="text-body-md text-text-secondary">{t('analytics.observations.intro')}</p>
      </div>

      {observations.length === 0 ? (
        <EmptyState
          compact
          title={t('analytics.observations.title')}
          description={t('analytics.observations.empty')}
        />
      ) : (
        <StaggerList>
          <ol className="flex flex-col gap-4">
            {observations.map((observation) => (
              <li key={observation.id} data-stagger-item className="flex flex-col gap-1.5">
                <p className="text-body-lg text-text-primary max-w-[70ch]">
                  {t(OBSERVATION_KEY[observation.kind], observation.values)}
                </p>

                <p className="text-body-sm text-text-tertiary tabular-nums">
                  {t('analytics.table.sampleSize', { count: observation.sampleSize })}
                  <span className="ps-2">
                    {t('analytics.observations.citedPeriod', {
                      start: format.date(observation.periodStart),
                      end: format.date(observation.periodEnd),
                    })}
                  </span>
                </p>

                {observation.kind === 'association' ? (
                  <p className="text-body-md text-text-secondary max-w-[70ch]">
                    {t('analytics.feedback.doNotInfer')}
                  </p>
                ) : null}

                {observation.confounders.length > 0 ? (
                  <ul className="text-body-md text-text-secondary marker:text-text-tertiary flex max-w-[70ch] list-disc flex-col gap-1 ps-5">
                    {observation.confounders.map((confounder) => (
                      <li key={confounder}>{t(CONFOUNDER_KEY[confounder], observation.values)}</li>
                    ))}
                  </ul>
                ) : null}

                {observation.sampleSize > 0 && observation.sampleSize < 10 ? (
                  <p className="text-body-md text-warning-fg max-w-[70ch]">
                    {t('analytics.feedback.smallSample')}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </StaggerList>
      )}

      <div className="border-border-subtle flex flex-col gap-2 border-t pt-4">
        <h3 className="text-body-md text-text-primary font-medium">
          {t('analytics.observations.nextTestTitle')}
        </h3>
        {nextTest ? (
          <p className="text-body-md text-text-secondary max-w-[70ch]">
            {t('analytics.observations.nextTestBody', {
              count: nextTest.postCount,
              account: nextTest.accountName,
              variable: nextTest.variable,
            })}
          </p>
        ) : (
          <p className="text-body-md text-text-secondary max-w-[70ch]">
            {t('analytics.experiment.tagBeforePublishing')}
          </p>
        )}
        <p className="text-body-sm text-text-tertiary max-w-[70ch]">
          {t('analytics.feedback.noScore')}
        </p>
        {onTagExperiment ? (
          <Button size="sm" variant="secondary" className="self-start" onClick={onTagExperiment}>
            {t('analytics.observations.tagFirst')}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
