'use client';

import { useMemo, type ReactNode } from 'react';
import { CountUp } from '@/components/motion';
import { cn } from '@relay/design-system/utils';

import { Eyebrow } from './eyebrow';

/**
 * A display-scale numeral with a small-caps label underneath, counting up from
 * 0 as it scrolls into view (reduced motion renders the final value
 * immediately — see `CountUp`'s own doc comment).
 *
 * Mechanics and accessibility are unchanged from the loud system's
 * `BigNumber`. Only the surface changes: the numeral drops from
 * `--text-display-xl` to `--text-display-lg`, and the label becomes an
 * `Eyebrow` rather than a bare uppercase span, so a statistic sits in the same
 * typographic system as every other label on the page.
 *
 * `value` is the caller's responsibility, and the caller states a real,
 * current fact: a connector count, a surface count, a plan price. Nothing in
 * this component invents or rounds a number on its own, and a caller with no
 * number to state must render "unavailable" rather than passing 0.
 *
 * `locale`/`formatOptions` — not a `format` function — cross the wire here on
 * purpose: the usual caller is a Server Component, and a function prop cannot
 * be passed from a Server Component into a Client Component.
 * `Intl.NumberFormat` is built client-side, once, from the plain serializable
 * locale string and options object every RSC boundary can carry for free.
 */
export interface EditorialBigNumberProps {
  readonly value: number;
  /** BCP 47 locale tag, e.g. the active request locale. */
  readonly locale: string;
  /** Passed straight through to `Intl.NumberFormat`; omit for a plain integer. */
  readonly formatOptions?: Intl.NumberFormatOptions;
  readonly label: ReactNode;
  readonly className?: string;
}

export function EditorialBigNumber({
  value,
  locale,
  formatOptions,
  label,
  className,
}: EditorialBigNumberProps): ReactNode {
  const formatOptionsKey = formatOptions ? JSON.stringify(formatOptions) : '';
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, formatOptions),
    // `formatOptionsKey` is the intentional, stable dependency for the `formatOptions` object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, formatOptionsKey],
  );

  return (
    <div className={cn('flex flex-col items-start gap-2', className)}>
      <CountUp
        value={value}
        format={(n) => formatter.format(n)}
        className="font-display text-display-lg leading-none"
      />
      {/* Full opacity, not dimmed: hierarchy comes from the size and weight
          gap to the numeral, not from a weaker colour, and this label also
          renders on the inverted band where headroom is tighter. */}
      <Eyebrow tone="inherit">{label}</Eyebrow>
    </div>
  );
}
