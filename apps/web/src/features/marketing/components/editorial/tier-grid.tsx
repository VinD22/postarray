'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Link } from '@/components/link';
import { Button } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { StaggerList } from '@/components/motion';

import { EditorialBigNumber } from './big-number';
import { EditorialPriceToggle, type BillingInterval } from './price-toggle';
import { Eyebrow } from './eyebrow';

/**
 * The three-tier presentation.
 *
 * ## Why it is not a feature comparison table
 *
 * Every feature is on every tier. A tier buys active project capacity and
 * nothing else — `features/billing/tiers.ts` has one shared inclusion list and
 * no per-tier one, and `tiers.test.ts` plus the billing package both refuse a
 * per-tier list outright. A column of ticks and crosses would therefore have
 * to invent the crosses, so the only honest shape for a third column is a
 * DELTA: "everything in Standard, plus N more active projects". `delta` is a
 * required prop for that reason; there is nowhere to put a feature list.
 *
 * ## Why the prices are minor units and not strings
 *
 * A price written out as a string is a price that can disagree with the price
 * that is charged. Every figure here is an integer minor-unit amount formatted
 * through one locale-bound `Intl.NumberFormat`, so a tier's displayed amount
 * is arithmetic on the same number the tier module holds.
 *
 * The annual saving is stated in whole dollars by the caller
 * (`billing.tier.*.annualFraming`), never as a percentage:
 * `packages/billing/src/copy-compliance.test.ts` rejects a percentage framing
 * and an "off" framing outright, and the real discounts here are not round
 * numbers anyway.
 *
 * ## One primary action
 *
 * Exactly one tier may carry `cta`, and it is the anchored one. Checkout is
 * closed for the others, so they state that (`unavailableNote`) rather than
 * offering a button that would either lie or do nothing. That is a shape
 * rather than a convention: a second `cta` would render, but the anchor
 * treatment (`anchored`) is what marks the start, and the pricing page passes
 * `cta` on one column only.
 *
 * Every string arrives already translated. This file holds no prose.
 */
export interface TierGridColumn {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  /** Integer minor units, from the tier module. Never a formatted string. */
  readonly monthlyPriceMinor: number;
  readonly annualPriceMinor: number;
  /** ISO 4217. */
  readonly currency: string;
  /** e.g. "3 active projects". Already translated and pluralized. */
  readonly allowance: string;
  /** "Everything in Standard, plus ..." — see the doc comment. */
  readonly delta: string;
  /** Effective monthly plus the saving, in whole dollars. */
  readonly annualFraming: string;
  /** The anchor: accent border, "start here" eyebrow. At most one. */
  readonly anchored?: boolean;
  /** The single primary action. Only the anchored column should carry one. */
  readonly cta?: { readonly href: string; readonly label: string };
  /** Shown instead of an action on a column that cannot be bought yet. */
  readonly unavailableNote?: string;
}

export interface TierGridProps {
  readonly locale: string;
  readonly tiers: readonly TierGridColumn[];
  readonly intervalGroupLabel: string;
  readonly monthlyLabel: string;
  readonly annualLabel: string;
  readonly startHereLabel: string;
  /**
   * `full` is the pricing page. `compact` is the home teaser: the same three
   * columns and the same arithmetic, without the delta prose or the framing
   * sentence, because the teaser's job is to show the shape of the ladder and
   * send the reader to the page that explains it.
   */
  readonly variant?: 'full' | 'compact';
  readonly className?: string;
}

export function TierGrid({
  locale,
  tiers,
  intervalGroupLabel,
  monthlyLabel,
  annualLabel,
  startHereLabel,
  variant = 'full',
  className,
}: TierGridProps): ReactNode {
  const [interval, setInterval] = useState<BillingInterval>('month');
  const isAnnual = interval === 'year';
  const compact = variant === 'compact';

  // One formatter for the whole grid. Zero cents are trimmed because every
  // tier price is a whole dollar amount; if a fractional price ever ships,
  // this is the single place that has to learn about it.
  const format = useMemo<Intl.NumberFormatOptions>(
    () => ({
      style: 'currency',
      currency: tiers[0]?.currency ?? 'USD',
      maximumFractionDigits: 0,
    }),
    [tiers],
  );

  return (
    <div className={cn('space-y-10', className)}>
      <EditorialPriceToggle
        groupLabel={intervalGroupLabel}
        monthlyLabel={monthlyLabel}
        annualLabel={annualLabel}
        value={interval}
        onChange={setInterval}
        className="max-w-xs"
      />

      {/* Staggered in, one column at a time. `StaggerList` renders the
          finished, static layout under reduced motion and with no JS. */}
      <StaggerList stagger={0.08} className="grid gap-5 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.id} data-stagger-item className="h-full">
            <article
              data-tier={tier.id}
              data-anchored={tier.anchored === true ? 'true' : 'false'}
              className={cn(
                'bg-surface-raised flex h-full flex-col gap-5 rounded-sm border p-6',
                // The anchor is marked by a heavier accent border AND by the
                // "start here" eyebrow above it. Never colour alone.
                tier.anchored === true ? 'border-accent-cool border-2' : 'border-border-default',
              )}
            >
              {tier.anchored === true ? (
                <Eyebrow className="text-accent-cool">{startHereLabel}</Eyebrow>
              ) : null}

              <div className="space-y-1">
                <h3 className="text-title-md text-text-primary">{tier.name}</h3>
                <p className="text-body-md text-text-secondary max-w-[34ch] leading-[1.6]">
                  {tier.tagline}
                </p>
              </div>

              <EditorialBigNumber
                value={(isAnnual ? tier.annualPriceMinor : tier.monthlyPriceMinor) / 100}
                locale={locale}
                formatOptions={format}
                label={isAnnual ? annualLabel : monthlyLabel}
              />

              <p className="text-body-lg text-text-primary">{tier.allowance}</p>

              {compact ? null : (
                <>
                  <p className="text-body-md text-text-secondary max-w-[38ch] leading-[1.6]">
                    {tier.delta}
                  </p>
                  <p className="text-body-sm text-text-tertiary max-w-[38ch] leading-[1.6]">
                    {tier.annualFraming}
                  </p>
                </>
              )}

              <div className="mt-auto pt-2">
                {tier.cta ? (
                  <Button asChild variant="primary" className="text-body-md h-11 w-full px-5">
                    <Link href={tier.cta.href}>{tier.cta.label}</Link>
                  </Button>
                ) : tier.unavailableNote ? (
                  <p className="text-body-sm text-text-tertiary max-w-[38ch] leading-[1.6]">
                    {tier.unavailableNote}
                  </p>
                ) : null}
              </div>
            </article>
          </div>
        ))}
      </StaggerList>
    </div>
  );
}
