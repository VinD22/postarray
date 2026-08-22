'use client';

import { useMemo, useState, type ReactElement } from 'react';
import { Field, Input } from '@relay/design-system/primitives';
import { formatPercent } from '@relay/i18n/format';
import { useI18n, useTranslations } from '@relay/i18n/react';

import {
  ENGAGEMENT_RATE_BASES,
  engagementRates,
  type EngagementRateInput,
} from './engagement-rate';

/**
 * The engagement rate calculator.
 *
 * No network, no storage, and no benchmark: `engagement-rate.ts` divides the
 * three numbers the reader types by three denominators and nothing else. There
 * is deliberately no "good rate" comparison anywhere in this file, because we
 * have no such figure and would not invent one.
 */

const EMPTY = { interactions: '', reach: '', followers: '', impressions: '' };

function toNumber(raw: string): number {
  const value = Number(raw);
  return raw.trim() === '' || !Number.isFinite(value) ? 0 : value;
}

export function EngagementRatePanel(): ReactElement {
  const t = useTranslations();
  const { locale } = useI18n();
  const [values, setValues] = useState(EMPTY);

  const input: EngagementRateInput = useMemo(
    () => ({
      interactions: toNumber(values.interactions),
      reach: toNumber(values.reach),
      followers: toNumber(values.followers),
      impressions: toNumber(values.impressions),
    }),
    [values],
  );

  const results = useMemo(() => engagementRates(input), [input]);

  function setField(field: keyof typeof EMPTY, raw: string): void {
    setValues((current) => ({ ...current, [field]: raw }));
  }

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <Field
          label={t.full('web.tools.engagementRate.field.interactions.label')}
          description={t.full('web.tools.engagementRate.field.interactions.help')}
        >
          {(control) => (
            <Input
              id={control.id}
              aria-describedby={control['aria-describedby']}
              type="number"
              inputMode="numeric"
              min={0}
              value={values.interactions}
              onChange={(event) => setField('interactions', event.target.value)}
            />
          )}
        </Field>

        {(['reach', 'followers', 'impressions'] as const).map((field) => (
          <Field
            key={field}
            label={t(`web.tools.engagementRate.field.${field}.label`)}
            description={t(`web.tools.engagementRate.field.${field}.help`)}
          >
            {(control) => (
              <Input
                id={control.id}
                aria-describedby={control['aria-describedby']}
                type="number"
                inputMode="numeric"
                min={0}
                value={values[field]}
                onChange={(event) => setField(field, event.target.value)}
              />
            )}
          </Field>
        ))}
      </div>

      <section aria-labelledby="engagement-rate-result-heading" className="flex flex-col gap-4">
        <h2 id="engagement-rate-result-heading" className="text-title-sm text-text-primary">
          {t.full('web.tools.engagementRate.result.title')}
        </h2>

        <dl className="divide-border-subtle divide-y-2">
          {ENGAGEMENT_RATE_BASES.map((basis) => {
            const result = results.find((entry) => entry.basis === basis);
            const rate = result?.rate ?? null;
            return (
              <div key={basis} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-body-sm text-text-secondary">
                  {t(`web.tools.engagementRate.basis.${basis}`)}
                </dt>
                <dd className="text-title-sm text-text-primary font-mono tabular-nums">
                  {rate === null
                    ? t.full('web.tools.engagementRate.result.empty')
                    : formatPercent(locale, rate, { fractionDigits: 2 })}
                </dd>
              </div>
            );
          })}
        </dl>

        <p className="text-body-sm text-text-tertiary">
          {t.full('web.tools.engagementRate.result.note')}
        </p>
      </section>
    </div>
  );
}
