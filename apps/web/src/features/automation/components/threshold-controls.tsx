'use client';

import type { ReactElement } from 'react';
import { Notice } from '@relay/design-system/patterns';
import {
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { formatDuration } from '@relay/i18n';
import { useI18n, useTranslations } from '@relay/i18n/react';

import type { MeasurementSettings } from '../types';
import { DEFAULT_MEASUREMENT } from '../validation';

/**
 * The bounds an engagement threshold rule must carry.
 *
 * A rule that reacts to a number is the one kind of rule that can run an
 * unbounded number of times, on data the provider may not have finished
 * counting. So four bounds are mandatory rather than advanced: how long the
 * metric is watched, when watching stops entirely, how long the rule waits
 * between executions for the same post, and how many times it may act on one
 * post at all.
 *
 * Two defaults are stated in words rather than left implicit, because they are
 * the ones that protect the user: run once per source post, and do not execute
 * at all if the metric is unavailable or older than the staleness limit.
 */

const DURATION_OPTIONS: readonly number[] = [
  900, 3_600, 10_800, 21_600, 43_200, 86_400, 172_800, 604_800,
];

export interface ThresholdControlsProps {
  readonly measurement: MeasurementSettings | undefined;
  readonly onChange: (measurement: MeasurementSettings) => void;
  /** Provider name and metric, when one of the accounts reports on a delay. */
  readonly providerDelayNote?: { readonly provider: string; readonly metric: string };
}

export function ThresholdControls({
  measurement,
  onChange,
  providerDelayNote,
}: ThresholdControlsProps): ReactElement {
  const t = useTranslations();
  const { locale } = useI18n();
  const value = measurement ?? DEFAULT_MEASUREMENT;

  const durationLabel = (seconds: number): string =>
    formatDuration(locale, seconds * 1000, { maxUnits: 2 });

  const durationField = (
    label: string,
    description: string | undefined,
    field: keyof MeasurementSettings,
  ): ReactElement => (
    <Field label={label} description={description} required>
      {(control) => (
        <Select
          value={String(value[field])}
          onValueChange={(next) => onChange({ ...value, [field]: Number(next) })}
        >
          <SelectTrigger
            id={control.id}
            size="sm"
            aria-describedby={control['aria-describedby']}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DURATION_OPTIONS.map((seconds) => (
              <SelectItem key={seconds} value={String(seconds)}>
                {durationLabel(seconds)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </Field>
  );

  return (
    <section className="flex flex-col gap-4 border-t border-border-subtle pt-4">
      <div className="flex max-w-[70ch] flex-col gap-1">
        <h3 className="text-title-sm text-text-primary">
          {t('automation.threshold.title')}
        </h3>
        <p className="text-body-md text-text-secondary">
          {t('automation.threshold.intro')}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {durationField(
          t('automation.threshold.window'),
          t('automation.threshold.windowHelp'),
          'windowSeconds',
        )}
        {durationField(t('automation.threshold.expiry'), undefined, 'expirySeconds')}
        {durationField(
          t('automation.threshold.cooldown'),
          t('automation.threshold.cooldownHelp'),
          'cooldownSeconds',
        )}
        {durationField(
          t('automation.threshold.staleLimit'),
          undefined,
          'staleAfterSeconds',
        )}

        <Field label={t('automation.threshold.maxPerPost')} required>
          {(control) => (
            <Input
              {...control}
              type="number"
              min={1}
              max={20}
              inputMode="numeric"
              value={value.maxExecutionsPerPost}
              onChange={(event) =>
                onChange({
                  ...value,
                  maxExecutionsPerPost: Number(event.target.value),
                })
              }
            />
          )}
        </Field>
      </div>

      <Notice
        tone="neutral"
        title={t('automation.threshold.defaultsTitle')}
        description={
          <ul className="flex list-disc flex-col gap-1 ps-5 marker:text-text-tertiary">
            <li>
              {t('automation.threshold.maxExecutions', {
                count: value.maxExecutionsPerPost,
              })}
            </li>
            <li>
              {t('automation.threshold.staleMetric')}{' '}
              {t('automation.threshold.defaultStale', {
                duration: durationLabel(value.staleAfterSeconds),
              })}
            </li>
          </ul>
        }
      />

      {providerDelayNote ? (
        <Notice
          tone="warning"
          title={t('automation.threshold.providerNote', providerDelayNote)}
        />
      ) : null}
    </section>
  );
}
