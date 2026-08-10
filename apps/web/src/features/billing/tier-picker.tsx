'use client';

import type { ReactNode } from 'react';
import { RadioGroup, RadioGroupItem } from '@relay/design-system/primitives';
import { useI18n, useTranslations } from '@relay/i18n/react';

import { pendingTiers, priceUnits, publishableTiers } from './tiers';
import type { WebPlanTier } from './tiers';

export interface TierPickerProps {
  readonly value: string;
  readonly onChange: (tierKey: string) => void;
  readonly interval: 'monthly' | 'annual';
}

/**
 * The capacity choice in the checkout flow.
 *
 * Only tiers whose price and allowance the founder has decided appear here, so
 * a placeholder can never be bought. While there is a single decided tier the
 * picker states it as a fact rather than pretending to be a choice: a radio
 * group with one option is a lie about the decision the customer is making.
 */
export function TierPicker({ value, onChange, interval }: TierPickerProps): ReactNode {
  const t = useTranslations();
  const { locale } = useI18n();
  const tiers = publishableTiers();
  const undecided = pendingTiers();

  function priceText(tier: WebPlanTier): string {
    const minor = interval === 'annual' ? tier.annualPriceMinor : tier.monthlyPriceMinor;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: tier.currency,
      maximumFractionDigits: 0,
    }).format(priceUnits(minor));
  }

  const single = tiers.length === 1 ? tiers[0] : undefined;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-body-md text-text-secondary max-w-[68ch]">
        {t('billing.tier.subheading')}
      </p>

      {single !== undefined ? (
        <p className="text-body-md text-text-primary">
          {t('billing.tier.projectAllowance', { count: single.projectAllowance })}
        </p>
      ) : (
        <RadioGroup
          value={value}
          onValueChange={onChange}
          aria-label={t('billing.tier.select')}
          className="flex flex-col"
        >
          {tiers.map((tier) => (
            <label
              key={tier.key}
              className="text-body-md text-text-primary flex min-h-11 items-start gap-2 py-1"
            >
              <RadioGroupItem className="mt-1" value={tier.key} />
              <span className="flex flex-col">
                <span>{t(tier.nameKey)}</span>
                <span className="text-body-sm text-text-secondary">
                  {t('billing.tier.projectAllowance', { count: tier.projectAllowance })}
                </span>
                <span className="text-body-sm text-text-secondary">{priceText(tier)}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
      )}

      {undecided.length > 0 ? (
        <p className="text-body-sm text-text-tertiary max-w-[68ch]">
          {t('billing.tier.moreComingBody')}
        </p>
      ) : null}
    </div>
  );
}
