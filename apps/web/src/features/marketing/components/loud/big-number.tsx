'use client';

import { useMemo, type ReactNode } from 'react';
import { CountUp } from '@/components/motion';
import { cn } from '@relay/design-system/utils';

/**
 * A display-scale numeral with a label underneath, counting up from 0 as it
 * scrolls into view (reduced motion renders the final value immediately —
 * see `CountUp`'s own doc comment).
 *
 * `value` is the caller's responsibility, and the caller states a real,
 * current fact: a connector count, a surface count, a plan price. Nothing in
 * this component invents or rounds a number on its own.
 *
 * `locale`/`formatOptions` — not a `format` function — cross the wire here on
 * purpose: `BigNumber`'s usual caller is a Server Component (see the landing
 * page), and a function prop cannot be passed from a Server Component into a
 * Client Component. `Intl.NumberFormat` is built client-side, once, from the
 * plain, serializable locale string and options object every RSC boundary
 * can carry for free. A caller that is already a Client Component and wants
 * a bespoke formatter (a plural rule, a rounded "days left" phrase, etc. —
 * see `trial-banner.tsx`) should reach for `CountUp` directly instead of
 * this component.
 *
 * The label is full-opacity, not dimmed: `BigNumber` renders on every `Band`
 * tone, and `accent-on`'s 5.73:1 pairing (the tightest of the five) has no
 * headroom to spare for a translucent label the way the ink/cta/blush tones
 * would. Hierarchy comes from the size and weight gap to the numeral, not
 * from a weaker color.
 */
export interface BigNumberProps {
  readonly value: number;
  /** BCP 47 locale tag, e.g. the active request locale. */
  readonly locale: string;
  /** Passed straight through to `Intl.NumberFormat`; omit for a plain integer. */
  readonly formatOptions?: Intl.NumberFormatOptions;
  readonly label: ReactNode;
  readonly className?: string;
}

export function BigNumber({
  value,
  locale,
  formatOptions,
  label,
  className,
}: BigNumberProps): ReactNode {
  const formatOptionsKey = formatOptions ? JSON.stringify(formatOptions) : '';
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, formatOptions),
    // `formatOptionsKey` is the intentional, stable dependency for the `formatOptions` object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, formatOptionsKey],
  );

  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      <CountUp
        value={value}
        format={(n) => formatter.format(n)}
        className="font-display text-display-xl leading-none"
      />
      <span className="text-label tracking-wide uppercase">{label}</span>
    </div>
  );
}
