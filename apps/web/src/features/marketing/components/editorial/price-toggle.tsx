'use client';

import { type ReactNode } from 'react';
import { Link } from '@/components/link';
import { Button, SegmentedControl } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';
import { useState } from 'react';

import { EditorialBigNumber } from './big-number';
import { EditorialCard } from './card';

export type BillingInterval = 'month' | 'year';

/**
 * The monthly/annual segmented control.
 *
 * It is the design system's `SegmentedControl` in its pill shape, which is
 * the fourth and last of the hand-rolled copies of this control to go. The
 * previous version was a `<fieldset>` of two native radios with a GSAP Flip
 * thumb, and it was the best of the four: native radios gave it arrow keys and
 * grouping for free. What it could not give it was the same behaviour as the
 * other three, which is the whole reason a primitive exists.
 *
 * Nothing about the accessibility contract changes. Radix ToggleGroup in
 * single mode renders a real `role="radiogroup"` of `role="radio"` buttons,
 * selection follows focus the way it did with native radios, and each option
 * is at least 44px tall. The annual incentive still lives inside the annual
 * option's own label, so a screen reader hears "Yearly, 2 months free" as one
 * choice rather than meeting a loose chip beside it.
 *
 * The GSAP Flip tween is gone. The thumb slides on a CSS transition over a
 * measured offset, which the global `prefers-reduced-motion` override
 * neutralises without this file knowing anything about it.
 */
export interface EditorialPriceToggleProps {
  /** Accessible name for the group of options. */
  readonly groupLabel: string;
  readonly monthlyLabel: string;
  readonly annualLabel: string;
  /**
   * The incentive, rendered inside the annual option's own label. Omit and the
   * option carries none.
   */
  readonly annualBadge?: string;
  readonly value: BillingInterval;
  readonly onChange: (interval: BillingInterval) => void;
  readonly className?: string;
}

export function EditorialPriceToggle({
  groupLabel,
  monthlyLabel,
  annualLabel,
  annualBadge,
  value,
  onChange,
  className,
}: EditorialPriceToggleProps): ReactNode {
  return (
    <SegmentedControl
      aria-label={groupLabel}
      shape="pill"
      fill
      scrollable={false}
      value={value}
      onValueChange={(next) => {
        if (next === 'month' || next === 'year') onChange(next);
      }}
      className={cn('w-full', className)}
      items={[
        { value: 'month', label: monthlyLabel },
        {
          value: 'year',
          label: (
            <>
              {annualLabel}
              {/* Marigold on its own documented wash (5.05:1 in light, 10.25:1
                  in dark). Not vermilion: that fills the primary button and
                  nothing else, and a second vermilion surface on the same
                  screen would stop the first one reading as "press this". */}
              {annualBadge === undefined ? null : (
                <span className="text-label bg-accent-warm-subtle text-accent-warm rounded-full px-2 py-1 whitespace-nowrap">
                  {annualBadge}
                </span>
              )}
            </>
          ),
        },
      ]}
    />
  );
}

/**
 * The full interactive plan block: toggle, price, commit action and the
 * current access disclosures beside it. The one client leaf the pricing page
 * needs — everything it receives is already-translated text and plain numbers,
 * so the async Server Component page never becomes a client boundary itself.
 *
 * The display numeral follows the toggle: `<CountUp>` (via
 * `EditorialBigNumber`) re-counts to the selected interval's figure every time
 * it changes. The two prices themselves do not follow the toggle. Both are
 * stated, visibly, in a `<dl>` underneath, along with the annual framing
 * sentence, because a reader who never operates the control must still learn
 * that the annual price exists and what it is. That `<dl>` used to be
 * `sr-only`, which put the second price in the markup for a crawler while
 * hiding it from the person deciding whether to buy.
 *
 * `annualFraming` used to render as a rotated `Sticker`, then as a line that
 * appeared only while the annual interval was selected. It is a real fact
 * about both intervals, so it is now always present.
 *
 * This block prices exactly one thing: the plan the caller passes in. It knows
 * nothing about tiers, and in particular it has no way to render a tier whose
 * price is still a founder decision — see `pricing/page.tsx`.
 */
export interface EditorialPricePlanBlockProps {
  readonly locale: string;
  readonly groupLabel: string;
  readonly monthlyLabel: string;
  readonly annualLabel: string;
  readonly monthlyDetail: string;
  readonly annualDetail: string;
  readonly monthlyPriceDollars: number;
  readonly annualPriceDollars: number;
  readonly annualFraming: string;
  readonly ctaHref: string;
  readonly ctaLabel: string;
  readonly primaryNote: string;
  readonly secondaryNote: string;
  readonly footerNote: string;
  readonly className?: string;
}

export function EditorialPricePlanBlock({
  locale,
  groupLabel,
  monthlyLabel,
  annualLabel,
  monthlyDetail,
  annualDetail,
  monthlyPriceDollars,
  annualPriceDollars,
  annualFraming,
  ctaHref,
  ctaLabel,
  primaryNote,
  secondaryNote,
  footerNote,
  className,
}: EditorialPricePlanBlockProps): ReactNode {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');
  const isAnnual = billingInterval === 'year';

  return (
    <EditorialCard interactive={false} className={cn('space-y-8', className)}>
      <EditorialPriceToggle
        groupLabel={groupLabel}
        monthlyLabel={monthlyLabel}
        annualLabel={annualLabel}
        value={billingInterval}
        onChange={setBillingInterval}
      />

      <EditorialBigNumber
        value={isAnnual ? annualPriceDollars : monthlyPriceDollars}
        locale={locale}
        formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
        label={isAnnual ? annualLabel : monthlyLabel}
      />

      {/* Both intervals, visible, whichever one the toggle is showing. The
          toggle is a convenience layered on top; it is not the only place
          either number lives, and it never hides one of them. */}
      <div className="space-y-3">
        <dl className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <dt className="text-body-md text-text-tertiary">{monthlyLabel}</dt>
            <dd className="text-body-md text-text-secondary">{monthlyDetail}</dd>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-3">
            <dt className="text-body-md text-text-tertiary">{annualLabel}</dt>
            <dd className="text-body-md text-text-secondary">{annualDetail}</dd>
          </div>
        </dl>
        <p className="text-body-md text-text-secondary max-w-[46ch] leading-[1.6]">
          {annualFraming}
        </p>
      </div>

      <div className="border-border-subtle space-y-4 border-t pt-8">
        <Button asChild variant="primary" className="text-body-lg h-11 px-5">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
        <p className="text-body-md text-text-primary max-w-[46ch] leading-[1.6]">{primaryNote}</p>
        <p className="text-body-md text-text-tertiary max-w-[46ch] leading-[1.6]">
          {secondaryNote}
        </p>
        <p className="text-body-sm text-text-tertiary font-mono tabular-nums">{footerNote}</p>
      </div>
    </EditorialCard>
  );
}
