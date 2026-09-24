'use client';

import { useState, type ReactNode } from 'react';
import { DefinitionList } from '@relay/design-system/patterns';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import {
  useOpenExperiments,
  usePostExperiment,
  useTagExperiment,
} from '@/features/analytics/insights-queries';
import { useValueFormat } from '@/features/analytics/use-value-format';

/**
 * The experiment a post belongs to, or a way to join one before it publishes.
 *
 * A leading variant is only marked when the server says the result is
 * conclusive. A variant median the platform did not report reads
 * "Unavailable", never zero.
 */
export function ExperimentSection({
  contentItemId,
  published,
}: {
  readonly contentItemId: string;
  /** True once any destination has a publication record. */
  readonly published: boolean;
}): ReactNode {
  const t = useTranslations();
  const format = useValueFormat();
  const experiment = usePostExperiment(contentItemId);
  const open = useOpenExperiments(!published && experiment.data === null);

  if (experiment.data) {
    const current = experiment.data;
    return (
      <section aria-labelledby="post-experiment" className="flex flex-col gap-3">
        <h3 id="post-experiment" className="text-body-lg text-text-primary font-medium">
          {t('insight.howItDid.experiment.title')}
        </h3>
        <p className="text-body-md text-text-secondary">
          {t('insight.howItDid.experiment.tagged', { name: current.name })}
        </p>
        <DefinitionList
          layout="columns"
          items={current.variants.map((variant) => ({
            id: variant.variantId,
            term: variant.label,
            definition:
              variant.medianValue === null
                ? t('insight.howItDid.reading.unavailable')
                : format.count(variant.medianValue),
            hint: [
              t('insight.howItDid.experiment.variantSample', { count: variant.sampleSize }),
              variant.variantId === current.variantId
                ? t('insight.howItDid.experiment.yourVariant')
                : null,
              current.conclusive && variant.variantId === current.leadingVariantId
                ? t('insight.howItDid.experiment.leading')
                : null,
            ]
              .filter((entry): entry is string => entry !== null)
              .map((entry) => (
                <span key={entry} className="block">
                  {entry}
                </span>
              )),
          }))}
        />
        <p className="text-body-sm text-text-tertiary max-w-[70ch]">
          {current.conclusive
            ? t('insight.howItDid.experiment.conclusive')
            : t('insight.howItDid.experiment.notConclusive')}
        </p>
      </section>
    );
  }

  if (published || experiment.isPending || !open.data || open.data.length === 0) {
    return null;
  }

  return <TagPicker contentItemId={contentItemId} experiments={open.data} />;
}

function TagPicker({
  contentItemId,
  experiments,
}: {
  readonly contentItemId: string;
  readonly experiments: NonNullable<ReturnType<typeof useOpenExperiments>['data']>;
}): ReactNode {
  const t = useTranslations();
  const tag = useTagExperiment(contentItemId);
  const [choice, setChoice] = useState('');
  const [experimentId, variantId] = choice.split('|');

  return (
    <section aria-labelledby="post-experiment-join" className="flex flex-col gap-2">
      <h3 id="post-experiment-join" className="text-body-lg text-text-primary font-medium">
        {t('insight.howItDid.experiment.tryVariant')}
      </h3>
      <p className="text-body-sm text-text-secondary max-w-[70ch]">
        {t('insight.howItDid.experiment.tryVariantHelp')}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={choice} onValueChange={setChoice}>
          <SelectTrigger aria-label={t('insight.howItDid.experiment.choose')} className="min-w-48">
            <SelectValue placeholder={t('insight.howItDid.experiment.choose')} />
          </SelectTrigger>
          <SelectContent>
            {experiments.flatMap((experiment) =>
              experiment.variants.map((variant) => (
                <SelectItem
                  key={`${experiment.experimentId}|${variant.id}`}
                  value={`${experiment.experimentId}|${variant.id}`}
                >
                  {experiment.name} / {variant.label}
                </SelectItem>
              )),
            )}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          variant="secondary"
          disabled={experimentId === undefined || variantId === undefined || tag.isPending}
          onClick={() => {
            if (experimentId !== undefined && variantId !== undefined) {
              tag.mutate({ experimentId, variantId });
            }
          }}
        >
          {t('insight.howItDid.experiment.add')}
        </Button>
      </div>
      {tag.isError ? (
        <p role="alert" className="text-body-sm text-destructive-fg">
          {t('insight.howItDid.experiment.failed')}
        </p>
      ) : null}
    </section>
  );
}
