'use client';

import { useRef, useState, type ReactNode } from 'react';
import { Link } from '@/components/link';
import { Button } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { DURATION_FAST, EASE_STANDARD } from '@/lib/motion/constants';
import { Flip, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

import { EditorialBigNumber } from './big-number';
import { EditorialCard } from './card';

export type BillingInterval = 'month' | 'year';

/**
 * The monthly/annual segmented control.
 *
 * ## Mechanics and accessibility (unchanged)
 *
 * Built on two native `<input type="radio">` elements inside a `<fieldset>`,
 * not a hand-rolled `role="radiogroup"` — a same-`name` radio group already
 * gives arrow-key navigation and correct grouping semantics for free, with
 * none of the roving-tabindex bookkeeping a custom version would need. The
 * inputs are visually hidden with `sr-only` (not `hidden`/`display:none`), so
 * they stay focusable, and a `peer-focus-visible` ring on the visible label is
 * what a keyboard user actually sees. Each label is at least 44px tall.
 *
 * The sliding thumb is a third grid item placed into whichever column is
 * active via `gridColumnStart` — CSS Grid numbers columns in inline order, so
 * the resting position already respects `dir="rtl"` with no second rule. The
 * transition between columns is GSAP Flip: `Flip.getState` is captured
 * synchronously in the handler that changes `value`, before React re-renders
 * the thumb into its new cell, and `Flip.from` plays the measured delta
 * afterward. Flip diffs real `getBoundingClientRect` geometry, so this is
 * correct under RTL without assuming a direction. Reduced motion
 * (`useMotionOk`) never captures a Flip state, so the thumb lands directly in
 * its new cell with no animation.
 *
 * ## What changed
 *
 * Only the surface. The 2px ink outline becomes a hairline, and the thumb
 * stops being a `--color-cta` fill: it is now a raised paper chip with its own
 * hairline and soft shadow, sitting in a sunken track, which is the same
 * physical idea the rest of the editorial system uses.
 */
export interface EditorialPriceToggleProps {
  /** Accessible name for the `<fieldset>` grouping the two options. */
  readonly groupLabel: string;
  readonly monthlyLabel: string;
  readonly annualLabel: string;
  readonly value: BillingInterval;
  readonly onChange: (interval: BillingInterval) => void;
  readonly className?: string;
}

export function EditorialPriceToggle({
  groupLabel,
  monthlyLabel,
  annualLabel,
  value,
  onChange,
  className,
}: EditorialPriceToggleProps): ReactNode {
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
        'border-border-default bg-surface-sunken relative grid grid-cols-2 rounded-full border p-1',
        className,
      )}
    >
      <legend className="sr-only">{groupLabel}</legend>
      <span
        ref={thumbRef}
        aria-hidden="true"
        style={{ gridColumnStart: value === 'month' ? 1 : 2 }}
        className="bg-surface-raised border-border-default pointer-events-none row-start-1 rounded-full border shadow-raised"
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
          checked ? 'text-text-primary font-medium' : 'text-text-secondary',
        )}
      >
        {label}
      </span>
    </label>
  );
}

/**
 * The full interactive plan block: toggle, price, commit action and the
 * current access disclosures beside it. The one client leaf the pricing page
 * needs — everything it receives is already-translated text and plain numbers,
 * so the async Server Component page never becomes a client boundary itself.
 *
 * Only one price is ever visually shown at a time (whichever `interval` is
 * selected), and `<CountUp>` (via `EditorialBigNumber`) re-counts to the new
 * figure every time the toggle changes. A plain, always-present `sr-only`
 * `<dl>` states both intervals' prices as static text regardless of which the
 * toggle shows, so both prices stay in the server HTML and are crawlable with
 * JS off.
 *
 * `annualFraming` used to render as a rotated `Sticker`. It is a real fact, so
 * it survives the restyle as a plain line of body text rather than a badge.
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

      <div className="space-y-2">
        <EditorialBigNumber
          value={isAnnual ? annualPriceDollars : monthlyPriceDollars}
          locale={locale}
          formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
          label={isAnnual ? annualDetail : monthlyDetail}
        />
        {isAnnual ? (
          <p className="text-body-md text-text-secondary max-w-[46ch] leading-[1.6]">
            {annualFraming}
          </p>
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
