'use client';

import { useRef, useState, type ReactNode } from 'react';
import { Link } from '@/components/link';
import { MagneticButton } from '@/components/motion';
import { cn } from '@relay/design-system/utils';

import { DURATION_FAST, EASE_STANDARD } from '@/lib/motion/constants';
import { Flip, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

import { BigNumber } from './big-number';
import { PosterCard } from './poster-card';
import { Sticker } from './sticker';

export type BillingInterval = 'month' | 'year';

/**
 * The monthly/annual segmented control (WP-2).
 *
 * Built on two native `<input type="radio">` elements inside a `<fieldset>`,
 * not a hand-rolled `role="radiogroup"` — a same-`name` radio group already
 * gives arrow-key navigation and correct grouping semantics for free, which
 * is exactly what the WP-2 acceptance criteria mean by "keyboard-operable
 * radiogroup semantics", with none of the roving-tabindex bookkeeping a
 * custom version would need. The inputs are visually hidden with `sr-only`
 * (not `hidden`/`display:none`), so they stay focusable and a
 * `peer-focus-visible` ring on the visible label is what a keyboard user
 * actually sees.
 *
 * The sliding ink thumb is a third grid item placed into whichever column is
 * active via `gridColumnStart` — CSS Grid numbers columns in inline order,
 * so this resting position already respects `dir="rtl"` with no second rule.
 * The *transition* between columns is GSAP Flip: `Flip.getState` is captured
 * synchronously in the click/keyboard handler that changes `value`, before
 * React re-renders the thumb into its new cell, and `Flip.from` plays the
 * measured delta afterward. Flip diffs real `getBoundingClientRect`
 * geometry, so this is correct under RTL without assuming a direction.
 * Reduced motion (`useMotionOk`) simply never captures a Flip state, so the
 * thumb lands directly in its new grid cell with no animation — the
 * "instant" fallback the DoD requires, with no separate branch to maintain.
 */
export interface PriceToggleProps {
  /** Accessible name for the `<fieldset>` grouping the two options. */
  readonly groupLabel: string;
  readonly monthlyLabel: string;
  readonly annualLabel: string;
  readonly value: BillingInterval;
  readonly onChange: (interval: BillingInterval) => void;
  readonly className?: string;
}

export function PriceToggle({
  groupLabel,
  monthlyLabel,
  annualLabel,
  value,
  onChange,
  className,
}: PriceToggleProps): ReactNode {
  const scope = useRef<HTMLFieldSetElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const motionOk = useMotionOk();

  const select = (next: BillingInterval): void => {
    if (next === value) return;
    if (motionOk && thumbRef.current) {
      flipState.current = Flip.getState(thumbRef.current);
    }
    onChange(next);
  };

  useGSAP(
    () => {
      if (!flipState.current) return;
      Flip.from(flipState.current, { duration: DURATION_FAST, ease: EASE_STANDARD });
      flipState.current = null;
    },
    { scope, dependencies: [value] },
  );

  return (
    <fieldset
      ref={scope}
      className={cn(
        'border-border-bold bg-surface-sunken relative grid grid-cols-2 rounded-full border-2 p-1',
        className,
      )}
    >
      <legend className="sr-only">{groupLabel}</legend>
      <span
        ref={thumbRef}
        aria-hidden="true"
        style={{ gridColumnStart: value === 'month' ? 1 : 2 }}
        className="bg-cta pointer-events-none row-start-1 rounded-full"
      />
      <ToggleOption
        column={1}
        label={monthlyLabel}
        checked={value === 'month'}
        onSelect={() => select('month')}
      />
      <ToggleOption
        column={2}
        label={annualLabel}
        checked={value === 'year'}
        onSelect={() => select('year')}
      />
    </fieldset>
  );
}

function ToggleOption({
  column,
  label,
  checked,
  onSelect,
}: {
  readonly column: 1 | 2;
  readonly label: string;
  readonly checked: boolean;
  readonly onSelect: () => void;
}): ReactNode {
  return (
    <label
      style={{ gridColumnStart: column }}
      className="relative row-start-1 flex min-h-11 cursor-pointer items-center justify-center rounded-full px-4 text-center"
    >
      <input
        type="radio"
        name="pricing-interval"
        checked={checked}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span
        className={cn(
          'text-body-md rounded-full px-1 py-1 whitespace-nowrap',
          'peer-focus-visible:outline-border-focus peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2',
          checked ? 'text-cta-on' : 'text-text-secondary',
        )}
      >
        {label}
      </span>
    </label>
  );
}

/**
 * The full interactive plan block: toggle, giant poster price card, commit
 * action and the current access disclosures next to it. The one client leaf the
 * pricing page needs — everything it receives is already-translated text
 * and plain numbers, so the async Server Component page itself never
 * becomes a client boundary.
 *
 * Only one price is ever visually shown at a time (whichever `interval` is
 * selected), and `<CountUp>` (via `BigNumber`) re-counts to the new figure
 * every time the toggle changes, because `interval` flows into `BigNumber`'s
 * `value` prop, which is part of its animation's own dependency array. A
 * plain, always-present `sr-only` `<dl>` states both intervals' prices as
 * static text regardless of which one the toggle currently shows — the same
 * "hidden animated scene, visible plain mirror" split `VariantScene` uses —
 * so both prices stay in the server HTML and are crawlable with JS off.
 */
export interface PricePlanBlockProps {
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

export function PricePlanBlock({
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
}: PricePlanBlockProps): ReactNode {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');
  const isAnnual = billingInterval === 'year';

  return (
    <PosterCard tone="paper" className={cn('space-y-6', className)}>
      <PriceToggle
        groupLabel={groupLabel}
        monthlyLabel={monthlyLabel}
        annualLabel={annualLabel}
        value={billingInterval}
        onChange={setBillingInterval}
      />

      <div>
        <BigNumber
          value={isAnnual ? annualPriceDollars : monthlyPriceDollars}
          locale={locale}
          formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
          label={isAnnual ? annualDetail : monthlyDetail}
        />
        {isAnnual ? (
          <Sticker tone="pop" rotate={-3} className="mt-3">
            {annualFraming}
          </Sticker>
        ) : null}
      </div>

      {/* Both intervals, always in the server HTML, for screen readers,
          search engines and no-JS clients — the toggle above is a visual
          convenience layered on top, not the only place the numbers live. */}
      <dl className="sr-only">
        <dt>{monthlyLabel}</dt>
        <dd>{monthlyDetail}</dd>
        <dt>{annualLabel}</dt>
        <dd>{annualDetail}</dd>
        <dd>{annualFraming}</dd>
      </dl>

      <div className="border-border-subtle space-y-4 border-t pt-6">
        <MagneticButton asChild variant="primary" className="text-body-lg h-11 px-5">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </MagneticButton>
        <p className="text-body-md text-text-primary max-w-[46ch] leading-[1.6]">
          {primaryNote}
        </p>
        <p className="text-body-md text-text-tertiary max-w-[46ch] leading-[1.6]">
          {secondaryNote}
        </p>
        <p className="text-body-sm text-text-tertiary font-mono tabular-nums">{footerNote}</p>
      </div>
    </PosterCard>
  );
}
