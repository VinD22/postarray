import type { ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

import { EditorialBigNumber } from './big-number';

/**
 * Both billing intervals, side by side, with no control to operate.
 *
 * The pricing page uses `EditorialPricePlanBlock`, which is a toggle: one
 * price is visible at a time because that page's job is to help somebody
 * choose. Everywhere else a price appears, the reader is not choosing yet, and
 * a toggle there would hide half the commercial terms behind an interaction
 * nobody has a reason to perform. A visitor who never touches the control
 * would leave the landing page believing $29 a month is the only way to buy.
 *
 * So this component has no state, no client interaction and no hidden half:
 * both figures are in the server HTML, both are read by a screen reader in
 * source order, and both survive with JavaScript disabled. It is deliberately
 * not a segmented control wearing a different skin.
 *
 * `annualFraming` is the sentence that stops `$300` reading as "more
 * expensive": it states the effective monthly amount and the money saved. It
 * is passed in already translated (`billing.plan.annualFraming`) and it states
 * a saving in currency, never a percentage, because the real figure is not a
 * round number and `packages/billing/src/copy-compliance.test.ts` refuses the
 * percentage framing outright.
 *
 * Every string arrives translated; this file holds no prose. The amounts are
 * whole-dollar numbers rather than pre-formatted strings so the numerals are
 * grouped and signed in the reader's own locale.
 */
export interface EditorialPricePairProps {
  /** BCP 47 locale tag for the numeral formatting. */
  readonly locale: string;
  readonly monthlyPriceDollars: number;
  readonly annualPriceDollars: number;
  /** ISO 4217 code. The plan is priced in one currency today. */
  readonly currency?: string;
  readonly monthlyLabel: string;
  readonly annualLabel: string;
  readonly monthlyDetail: string;
  readonly annualDetail: string;
  readonly annualFraming: string;
  readonly className?: string;
}

export function EditorialPricePair({
  locale,
  monthlyPriceDollars,
  annualPriceDollars,
  currency = 'USD',
  monthlyLabel,
  annualLabel,
  monthlyDetail,
  annualDetail,
  annualFraming,
  className,
}: EditorialPricePairProps): ReactNode {
  const formatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  };

  return (
    <div className={cn('space-y-8', className)}>
      <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        <div className="space-y-3">
          <EditorialBigNumber
            value={monthlyPriceDollars}
            locale={locale}
            formatOptions={formatOptions}
            label={monthlyLabel}
          />
          <p className="text-body-md text-text-secondary max-w-[34ch] leading-[1.6]">
            {monthlyDetail}
          </p>
        </div>

        {/* The rule is a logical inline-start border, so it lands on the
            correct side under `dir="rtl"` with no second rule. */}
        <div className="border-border-subtle space-y-3 sm:border-s sm:ps-10">
          <EditorialBigNumber
            value={annualPriceDollars}
            locale={locale}
            formatOptions={formatOptions}
            label={annualLabel}
          />
          <p className="text-body-md text-text-secondary max-w-[34ch] leading-[1.6]">
            {annualDetail}
          </p>
        </div>
      </div>

      <p className="text-body-md text-text-secondary max-w-[52ch] leading-[1.6]">{annualFraming}</p>
    </div>
  );
}
