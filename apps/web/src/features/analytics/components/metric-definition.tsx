'use client';

import type { ReactElement } from 'react';
import { Info } from 'lucide-react';
import { DefinitionList } from '@relay/design-system/patterns';
import {
  Code,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import {
  aggregationLabelKey,
  denominatorLabelKey,
  providerLabelKey,
  unitLabelKey,
} from '../labels';
import { metricLabelKey } from '../metrics';
import type { MetricDefinitionView } from '../types';
import { useValueFormat } from '../use-value-format';

/**
 * The provider definition of a metric.
 *
 * Two rules shape this component.
 *
 * The first is that a tooltip is never the only place a critical fact lives.
 * The same body renders in three places from one source: inline on the metric
 * detail screen, inside the popover here, and in the definitions panel on the
 * overview. Nothing about what a number means is reachable only by hovering.
 *
 * The second is that this is a popover, not a tooltip. It contains a link to
 * the provider's own documentation, and a tooltip a keyboard user cannot enter
 * cannot hold a link. The trigger is a real button with an accessible name.
 */

export interface MetricDefinitionBodyProps {
  readonly definition: MetricDefinitionView;
}

export function MetricDefinitionBody({ definition }: MetricDefinitionBodyProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();

  return (
    <div className="flex flex-col gap-3">
      <DefinitionList
        layout="columns"
        items={[
          {
            id: 'definition',
            term: t('analytics.definition.term.definition'),
            definition: definition.definition,
            hint: t('analytics.definition.normalized'),
          },
          {
            id: 'provider',
            term: t('analytics.definition.term.providerField'),
            definition: (
              <span className="flex flex-wrap items-center gap-1.5">
                {t(providerLabelKey(definition.provider))}
                <Code>{definition.providerField}</Code>
              </span>
            ),
          },
          {
            id: 'unit',
            term: t('analytics.definition.term.unit'),
            definition: t(unitLabelKey(definition.unit)),
          },
          {
            id: 'denominator',
            term: t('analytics.definition.term.denominator'),
            definition: t(denominatorLabelKey(definition.denominator)),
          },
          {
            id: 'aggregation',
            term: t('analytics.definition.term.aggregation'),
            definition: t(aggregationLabelKey(definition.aggregation)),
          },
          {
            id: 'history',
            term: t('analytics.definition.term.history'),
            definition:
              definition.historyWindowDays === null
                ? t('analytics.definition.historyWindowNone', {
                    provider: t(providerLabelKey(definition.provider)),
                  })
                : t('analytics.definition.historyWindow', {
                    provider: t(providerLabelKey(definition.provider)),
                    days: definition.historyWindowDays,
                  }),
          },
        ]}
      />

      <p className="text-body-sm text-text-tertiary">
        {t('analytics.definition.verifiedOn', {
          date: format.date(definition.lastVerifiedAt),
        })}
      </p>

      {definition.definitionSourceUrl ? (
        <a
          className="text-body-sm text-text-accent underline underline-offset-2"
          href={definition.definitionSourceUrl}
          rel="noreferrer noopener"
          target="_blank"
        >
          {t('analytics.definition.sourceLink')}
          <span className="sr-only"> {t('a11y.label.externalLink')}</span>
        </a>
      ) : null}
    </div>
  );
}

export interface MetricDefinitionButtonProps {
  readonly definition: MetricDefinitionView;
}

export function MetricDefinitionButton({ definition }: MetricDefinitionButtonProps): ReactElement {
  const t = useTranslations();
  const metricName = t(metricLabelKey(definition.normalizedName));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton
          size="sm"
          variant="ghost"
          label={t('analytics.definition.open', { metric: metricName })}
          icon={<Info aria-hidden="true" />}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[min(26rem,calc(100vw-2rem))]">
        <h3 className="text-title-sm text-text-primary mb-2">
          {t('analytics.definition.title', { metric: metricName })}
        </h3>
        <MetricDefinitionBody definition={definition} />
      </PopoverContent>
    </Popover>
  );
}

/**
 * The definitions panel repeated at the foot of the overview.
 *
 * This is the "reachable inline" half of the tooltip rule. Every metric shown
 * anywhere on the screen appears here in full, in reading order, with no
 * interaction required.
 */
export interface MetricDefinitionsPanelProps {
  readonly definitions: readonly MetricDefinitionView[];
}

export function MetricDefinitionsPanel({
  definitions,
}: MetricDefinitionsPanelProps): ReactElement | null {
  const t = useTranslations();
  if (definitions.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="metric-definitions-heading"
      className="border-border-default flex flex-col gap-4 border-t pt-6"
    >
      <div className="flex max-w-[70ch] flex-col gap-1">
        <h2 id="metric-definitions-heading" className="text-title-sm text-text-primary">
          {t('analytics.definition.panelTitle')}
        </h2>
        <p className="text-body-md text-text-secondary">{t('analytics.definition.panelIntro')}</p>
      </div>

      <ul className="flex flex-col gap-5">
        {definitions.map((definition) => (
          <li
            key={`${definition.provider}:${definition.normalizedName}`}
            className="flex flex-col gap-2"
          >
            <h3 className="text-body-md text-text-primary font-medium">
              {t('analytics.definition.title', {
                metric: t(metricLabelKey(definition.normalizedName)),
              })}
            </h3>
            <MetricDefinitionBody definition={definition} />
          </li>
        ))}
      </ul>
    </section>
  );
}
