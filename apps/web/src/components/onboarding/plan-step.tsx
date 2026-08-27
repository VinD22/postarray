'use client';

import { useState } from 'react';

import { Notice } from '@relay/design-system/patterns';
import { Button, Label, RadioGroup, RadioGroupItem } from '@relay/design-system/primitives';
import { cn, panelSurface } from '@relay/design-system/utils';

import { ApiError, api, newIdempotencyKey } from '@/lib/api';
import { BASE_TIER_KEY, findTier } from '@/features/billing/tiers';
import { useFormatters, useTranslations } from '@/lib/i18n';

type Interval = 'monthly' | 'annual';


/**
 * The two figures, read from the one place that holds them.
 *
 * This step used to carry its own `2900` and `30000`, which disagreed with the
 * marketing pricing (2500 and 25000) that the same person had just read. Two
 * copies of a price is one price and one bug, and the bug is the one on the
 * screen where somebody is about to hand over a card. `tiers.ts` is the web
 * app's mirror of `packages/billing/src/tiers.ts`, and it is what the pricing
 * page and the home teaser already read, so a reprice moves all three together
 * or not at all.
 */
const BASE_TIER = findTier(BASE_TIER_KEY);

function amountFor(interval: Interval): {
  readonly amountMinor: number;
  readonly currency: string;
} {
  if (BASE_TIER === null) {
    throw new Error('The base tier is missing from WEB_PLAN_TIERS.');
  }
  return {
    amountMinor: interval === 'monthly' ? BASE_TIER.monthlyPriceMinor : BASE_TIER.annualPriceMinor,
    currency: BASE_TIER.currency,
  };
}

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
 * card: what comes off today, what it renews at, that cancelling is a standing
 * right rather than a deadline, and who takes the money.
 *
 * This block used to describe a seven day trial: nothing due today, a first
 * charge a week out, a payment method held in advance and a reminder before
 * conversion. The products carry no trial period, so every one of those facts
 * was false, and they were false on the screen where a person decides to pay.
 *
 * The block itself is the product's one panel recipe (`panelSurface`), not a
 * marketing card: this is a step inside the app. It does not borrow the
 * pricing page's segmented interval toggle either, because two named radio
 * options are already keyboard- and screen-reader-simple, and a one-time
 * setup step is not where a second, more elaborate control earns its keep.
 */
export function PlanStep() {
  const t = useTranslations();
  const format = useFormatters();

  const [interval, setInterval] = useState<Interval>('monthly');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = amountFor(interval);
  const formattedAmount = format.money(amount);

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

      <div className={cn(panelSurface, 'flex flex-col gap-6 p-6 sm:p-8')}>
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-title-md text-text-primary font-bold">
            {t('billing.plan.name')}
          </h2>
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
            <Fact
              term={t('billing.charge.dueToday', { amount: formattedAmount })}
              detail={t('billing.tier.everyFeature')}
            />
            <Fact
              term={t('billing.charge.renewal', {
                amount: formattedAmount,
                interval:
                  interval === 'monthly'
                    ? t('billing.plan.interval.monthly')
                    : t('billing.plan.interval.annual'),
              })}
              detail={t('billing.charge.cancelAnyTime')}
            />
            <Fact term={t('billing.checkout.hostedBy')} detail={t('billing.checkout.taxNote')} />
          </dl>
        </section>

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
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
