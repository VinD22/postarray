'use client';

import { useState } from 'react';

import { Notice } from '@relay/design-system/patterns';
import { Button, Label, RadioGroup, RadioGroupItem } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { ApiError, api, newIdempotencyKey } from '@/lib/api';
import { useFormatters, useTranslations } from '@/lib/i18n';

type Interval = 'monthly' | 'annual';

const TRIAL_DAYS = 7;
const DAY_MS = 86_400_000;

const AMOUNTS: Readonly<
  Record<Interval, { readonly amountMinor: number; readonly currency: string }>
> = {
  monthly: { amountMinor: 2900, currency: 'USD' },
  annual: { amountMinor: 30_000, currency: 'USD' },
};

/**
 * Step 2: the billing choice.
 *
 * One plan and two intervals. There is no comparison grid and no feature table,
 * because there is nothing to compare: every subscriber gets every feature.
 *
 * The annual option is framed as a monthly figure and a saving in currency.
 * It never reads "20 percent off", and there is no crossed out price, no
 * "most popular" flag and no countdown.
 *
 * Beside the primary action, every fact a person needs before handing over a
 * card: nothing due today, seven full trial days, the exact first charge date
 * and amount, the renewal interval, the payment method requirement, when the
 * reminder arrives, and how to cancel without being charged.
 */
export function PlanStep() {
  const t = useTranslations();
  const format = useFormatters();

  const [interval, setInterval] = useState<Interval>('monthly');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstChargeAt = new Date(Date.now() + TRIAL_DAYS * DAY_MS);
  const amount = AMOUNTS[interval];
  const formattedAmount = format.money(amount);
  const formattedDate = format.date(firstChargeAt, 'long');

  const continueToCheckout = async () => {
    setPending(true);
    setError(null);
    try {
      const { checkoutUrl } = await api.billing.createCheckout(
        { interval, returnUrl: `${window.location.origin}/onboarding/workspace` },
        newIdempotencyKey('checkout'),
      );
      window.location.assign(checkoutUrl);
    } catch (caught) {
      setPending(false);
      setError(
        ApiError.is(caught)
          ? t(caught.messageKey, caught.messageValues)
          : t('error.internal.message'),
      );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-title-lg text-text-primary">{t('onboarding.plan.title')}</h1>
        <p className="prose-measure text-body-md text-text-secondary">
          {t('onboarding.plan.help')}
        </p>
      </div>

      {error === null ? null : <Notice tone="destructive" liveness="alert" title={error} />}

      <section className="flex flex-col gap-3">
        <h2 className="text-title-sm text-text-primary">{t('billing.plan.name')}</h2>
        <p className="text-body-md text-text-secondary">{t('billing.plan.single')}</p>

        <fieldset className="border-border-subtle flex flex-col gap-0 border-t pt-3">
          <legend className="text-label text-text-tertiary pb-2 tracking-wide uppercase">
            {t('billing.plan.selectInterval')}
          </legend>

          <RadioGroup
            value={interval}
            onValueChange={(next) => {
              setInterval(next as Interval);
            }}
            className="gap-0"
          >
            <IntervalOption
              value="monthly"
              selected={interval === 'monthly'}
              title={t('billing.plan.monthlyPrice')}
              detail={t('billing.plan.interval.monthly')}
            />
            <IntervalOption
              value="annual"
              selected={interval === 'annual'}
              title={t('billing.plan.annualPrice')}
              detail={t('billing.plan.annualFraming')}
            />
          </RadioGroup>
        </fieldset>
      </section>

      <section aria-labelledby="plan-facts" className="flex flex-col gap-3">
        <h2 id="plan-facts" className="text-title-sm text-text-primary">
          {t('onboarding.plan.factsTitle')}
        </h2>

        <dl className="border-border-subtle flex flex-col border-t">
          <Fact term={t('billing.trial.dueToday')} detail={t('billing.trial.length')} />
          <Fact
            term={t('billing.trial.firstCharge', { amount: formattedAmount, date: formattedDate })}
            detail={t('billing.trial.renewal', {
              amount: formattedAmount,
              interval:
                interval === 'monthly'
                  ? t('billing.plan.interval.monthly')
                  : t('billing.plan.interval.annual'),
            })}
          />
          <Fact
            term={t('billing.trial.paymentMethodRequired')}
            detail={t('billing.trial.reminder')}
          />
          <Fact term={t('billing.trial.cancelBefore')} detail={t('billing.checkout.hostedBy')} />
        </dl>
      </section>

      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          loading={pending}
          loadingLabel={t('billing.checkout.returning')}
          onClick={() => {
            void continueToCheckout();
          }}
        >
          {t('billing.checkout.open')}
        </Button>

        <p className="prose-measure text-body-sm text-text-tertiary">
          {t('onboarding.plan.checkoutHint')}
        </p>
        <p className="prose-measure text-body-sm text-text-tertiary">
          {t('billing.checkout.taxNote')}
        </p>
      </div>
    </div>
  );
}

function IntervalOption({
  value,
  selected,
  title,
  detail,
}: {
  readonly value: string;
  readonly selected: boolean;
  readonly title: string;
  readonly detail: string;
}) {
  const id = `interval-${value}`;
  return (
    <div
      className={cn(
        'border-border-subtle flex items-start gap-3 border-b py-3',
        selected && 'bg-accent-subtle',
      )}
    >
      <RadioGroupItem value={value} id={id} className="mt-1" />
      <Label htmlFor={id} className="flex min-w-0 flex-col gap-0.5">
        <span className="text-body-lg text-text-primary font-medium">{title}</span>
        <span className="text-body-md text-text-secondary font-normal">{detail}</span>
      </Label>
    </div>
  );
}

function Fact({ term, detail }: { readonly term: string; readonly detail: string }) {
  return (
    <div className="border-border-subtle flex flex-col gap-0.5 border-b py-2.5">
      <dt className="text-body-md text-text-primary font-medium">{term}</dt>
      <dd className="prose-measure text-body-sm text-text-secondary">{detail}</dd>
    </div>
  );
}
