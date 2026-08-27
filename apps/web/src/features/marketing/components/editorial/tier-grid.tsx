'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { Link } from '@/components/link';
import { Button } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { StaggerList } from '@/components/motion';

import { EditorialBigNumber } from './big-number';
import { EditorialPriceToggle, type BillingInterval } from './price-toggle';
import { Eyebrow } from './eyebrow';

/**
 * The plan presentation. One interval control, one price, one checklist.
 *
 * ## What it replaced, and why
 *
 * This page used to state its prices twice: a three-column tier grid, and then
 * a second card underneath restating the same two figures in a different shape.
 * Two price presentations of one plan is the confusion, so there is now exactly
 * one, and this is it.
 *
 * ## The yearly view is the point
 *
 * The competitor stacks four numbers on one fact there: a fractional headline
 * with superscript cents, the annual charge, the money saved, and the months
 * free. This shows at most two numbers and one badge. The headline is the
 * charge for the selected interval, quoted in that interval's own unit, so a
 * yearly plan is a yearly amount and nothing is ever divided by twelve into a
 * price with cents in it. Under it sits one supporting line. The incentive is
 * stated once, as a badge on the yearly option of the control.
 *
 * ## Why it is not a feature comparison table
 *
 * Every feature is on every tier. A tier buys active project capacity and
 * nothing else, so a column of ticks and crosses would have to invent the
 * crosses. The checklist is therefore identical on every column except its
 * first line, which is the allowance, and a column above the first also carries
 * a `delta` sentence naming the difference.
 *
 * ## Why the prices are minor units and not strings
 *
 * A price written out as a string is a price that can disagree with the price
 * that is charged. Every figure is an integer minor-unit amount formatted
 * through one locale-bound `Intl.NumberFormat`, so what a reader sees is
 * arithmetic on the same number the tier module holds.
 *
 * ## One accent
 *
 * The only chromatic surface here is the vermilion primary button, which is
 * what `--accent-action-*` exists for and the one thing it is allowed to fill.
 * The anchored column is marked by a heavier ink border and by a label that
 * says so, never by a second accent colour competing with the action.
 *
 * Every string arrives already translated. This file holds no prose.
 */
export interface TierFeature {
  readonly id: string;
  /** Already translated and pluralized. */
  readonly text: string;
  /** Rendered at full weight: the line a reader is scanning this column for. */
  readonly strong: boolean;
  /**
   * The line that is actually different from the column beside it.
   *
   * Every tier carries every feature, so exactly one line per column earns
   * this: the project allowance. The compact teaser drops the checklist but
   * keeps this, because a reader looking at $25, $50 and $100 with three
   * adjectives under them cannot tell what the extra money buys.
   */
  readonly distinguishing?: boolean;
}

/** One interval's face of a column: what it charges and the one line under it. */
export interface TierIntervalFace {
  /** Integer minor units, from the tier module. Never a formatted string. */
  readonly priceMinor: number;
  /** The unit this amount is quoted in, e.g. "per year". */
  readonly label: string;
  /** Exactly one supporting sentence. Two would be a restatement. */
  readonly support: string;
}

export interface TierGridColumn {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  /** ISO 4217. */
  readonly currency: string;
  readonly month: TierIntervalFace;
  readonly year: TierIntervalFace;
  readonly features: readonly TierFeature[];
  /** "Everything in Standard, plus ..." Absent on the first column. */
  readonly delta?: string;
  /** The anchor: heavier border, "start here" label. At most one. */
  readonly anchored?: boolean;
  /** The single primary action. Only the anchored column should carry one. */
  readonly cta?: { readonly href: string; readonly label: string };
}

export interface TierGridProps {
  readonly locale: string;
  readonly tiers: readonly TierGridColumn[];
  readonly intervalGroupLabel: string;
  readonly monthlyLabel: string;
  readonly annualLabel: string;
  /** The incentive, on the yearly option. Omit and the control carries none. */
  readonly annualBadge?: string;
  readonly startHereLabel: string;
  /** Heading above the checklist. Required by `full`, unused by `compact`. */
  readonly featuresLabel?: string;
  /**
   * The one line the compact teaser states about what is shared, under the
   * capacity that is not. Already translated; omit it and the teaser says
   * nothing about parity. Unused by `full`, whose checklist shows the shared
   * lines in full.
   */
  readonly parityNote?: string;
  /**
   * What pressing the action actually does, under the action. It belongs to
   * the button and not to the page, because a trial term stated three sections
   * away from the button is a term nobody read.
   */
  readonly actionNote?: string;
  /**
   * `full` is the pricing page. `compact` is the home teaser: the same prices
   * and the same control, without the checklist, because the teaser's job is
   * to show what a plan costs and send the reader to the page that explains it.
   */
  readonly variant?: 'full' | 'compact';
  readonly className?: string;
}

/**
 * Written out rather than interpolated: Tailwind v4 scans source for complete
 * class names, so a template-literal column count would compile to no CSS at
 * all. Three is the ceiling because a fourth priced column stops being a
 * choice and starts being a menu.
 */
function columnClass(count: number): string {
  if (count <= 1) {
    return '';
  }
  return count === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';
}

export function TierGrid({
  locale,
  tiers,
  intervalGroupLabel,
  monthlyLabel,
  annualLabel,
  annualBadge,
  startHereLabel,
  featuresLabel,
  parityNote,
  actionNote,
  variant = 'full',
  className,
}: TierGridProps): ReactNode {
  const [interval, setInterval] = useState<BillingInterval>('month');
  const compact = variant === 'compact';

  // One formatter for the whole grid. Zero cents are trimmed because every
  // price on the ladder is a whole dollar amount; if a fractional price ever
  // ships, this is the single place that has to learn about it.
  const format = useMemo<Intl.NumberFormatOptions>(
    () => ({
      style: 'currency',
      currency: tiers[0]?.currency ?? 'USD',
      maximumFractionDigits: 0,
    }),
    [tiers],
  );

  // A single purchasable plan is a statement, not a choice: it gets one wide
  // card that reads price on one side and checklist on the other, rather than a
  // lonely third of a three-column grid.
  const solo = tiers.length === 1 && !compact;

  return (
    <div className={cn('space-y-10', className)}>
      <EditorialPriceToggle
        groupLabel={intervalGroupLabel}
        monthlyLabel={monthlyLabel}
        annualLabel={annualLabel}
        annualBadge={annualBadge}
        value={interval}
        onChange={setInterval}
        className={annualBadge === undefined ? 'max-w-xs' : 'max-w-md'}
      />

      {/* Staggered in, one column at a time. `StaggerList` renders the
          finished, static layout under reduced motion and with no JS. */}
      <StaggerList
        stagger={0.08}
        className={cn('grid gap-5', solo ? '' : columnClass(tiers.length))}
      >
        {tiers.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            face={interval === 'year' ? tier.year : tier.month}
            locale={locale}
            format={format}
            compact={compact}
            solo={solo}
            startHereLabel={startHereLabel}
            featuresLabel={featuresLabel}
            parityNote={parityNote}
            actionNote={actionNote}
            showAnchor={tiers.length > 1}
          />
        ))}
      </StaggerList>
    </div>
  );
}

function TierCard({
  tier,
  face,
  locale,
  format,
  compact,
  solo,
  startHereLabel,
  featuresLabel,
  parityNote,
  actionNote,
  showAnchor,
}: {
  readonly tier: TierGridColumn;
  readonly face: TierIntervalFace;
  readonly locale: string;
  readonly format: Intl.NumberFormatOptions;
  readonly compact: boolean;
  readonly solo: boolean;
  readonly startHereLabel: string;
  readonly featuresLabel?: string;
  readonly parityNote?: string;
  readonly actionNote?: string;
  /** An anchor only means something against something else. */
  readonly showAnchor: boolean;
}): ReactNode {
  const anchored = tier.anchored === true && showAnchor;

  return (
    <div data-stagger-item className="h-full">
      <article
        data-tier={tier.id}
        data-anchored={anchored ? 'true' : 'false'}
        className={cn(
          'bg-surface-raised h-full rounded-sm border p-6 md:p-8',
          // Elevation is declared once: a border, no shadow under it. The
          // anchor is a heavier ink border AND the "start here" label above
          // it, so it never reads by colour alone.
          anchored ? 'border-border-strong border-2' : 'border-border-default',
          solo ? 'md:grid md:grid-cols-[minmax(0,20rem)_1fr] md:gap-x-12' : 'flex flex-col',
        )}
      >
        <div className={cn('flex flex-col gap-5', solo ? '' : 'h-full')}>
          {anchored ? <Eyebrow>{startHereLabel}</Eyebrow> : null}

          <div className="space-y-1">
            <h3 className="text-title-md text-text-primary">{tier.name}</h3>
            <p className="text-body-md text-text-secondary max-w-[34ch] leading-[1.6]">
              {tier.tagline}
            </p>
          </div>

          {/* The headline is the charge for the selected interval, quoted in
              that interval's own unit. Both the numeral and its label swap
              together, so "$250" is never sitting under "per month". */}
          <EditorialBigNumber
            value={face.priceMinor / 100}
            locale={locale}
            formatOptions={format}
            label={face.label}
          />

          <p className="text-body-md text-text-secondary max-w-[36ch] leading-[1.6]">
            {face.support}
          </p>

          {/*
            What the extra money buys, in the teaser that has no checklist.

            Without this the compact card was a name, an adjective and a
            figure: "Growth — more active projects in one workspace — $50",
            which asks a reader to infer the one number the ladder is actually
            sold on. The lines come from the column's own features, so they are
            the same integers the pricing page prints, and the parity note
            underneath is what stops the capacity reading as a feature gate.
          */}
          {compact ? (
            <div className="border-border-subtle space-y-2 border-t pt-4">
              {tier.features
                .filter((feature) => feature.distinguishing === true)
                .map((feature) => (
                  <p
                    key={feature.id}
                    className="text-title-sm text-text-primary max-w-[36ch] leading-[1.4]"
                  >
                    {feature.text}
                  </p>
                ))}
              {parityNote === undefined ? null : (
                <p className="text-body-sm text-text-tertiary max-w-[36ch] leading-[1.55]">
                  {parityNote}
                </p>
              )}
            </div>
          ) : null}

          {compact || tier.delta === undefined ? null : (
            <p className="text-body-md text-text-primary max-w-[36ch] leading-[1.6]">
              {tier.delta}
            </p>
          )}

          {tier.cta ? (
            <div className={cn('space-y-4 pt-2', solo ? '' : 'mt-auto')}>
              <Button asChild variant="primary" className="text-body-md h-11 w-full px-5">
                <Link href={tier.cta.href}>{tier.cta.label}</Link>
              </Button>
              {actionNote === undefined || compact ? null : (
                <p className="text-body-sm text-text-tertiary max-w-[36ch] leading-[1.55]">
                  {actionNote}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {compact ? null : (
          <div
            className={cn(
              'border-border-subtle',
              // A hairline between price and checklist: above on a stacked
              // card, beside on the wide solo card. Logical properties only,
              // so it lands on the correct side under `dir="rtl"`.
              solo
                ? 'mt-8 border-t pt-8 md:mt-0 md:border-s md:border-t-0 md:ps-12 md:pt-0'
                : 'mt-6 border-t pt-6',
            )}
          >
            {/* A caption, not a heading: the tier name above it is already
                the `h3` for this card, and an `h4` here would announce a
                nesting level the page does not actually have. */}
            {featuresLabel === undefined ? null : (
              <Eyebrow as="p" className="mb-5">
                {featuresLabel}
              </Eyebrow>
            )}
            <ul className="space-y-3">
              {tier.features.map((feature) => (
                <li key={feature.id} className="flex items-start gap-3">
                  <Check aria-hidden="true" className="text-text-tertiary mt-0.5 size-4 shrink-0" />
                  <span
                    className={cn(
                      'text-body-md max-w-[46ch] leading-[1.55]',
                      feature.strong ? 'text-text-primary font-medium' : 'text-text-secondary',
                    )}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
}
