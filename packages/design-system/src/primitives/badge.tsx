'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

/**
 * A small, low-emphasis label: a locale code, a surface of origin, a count.
 *
 * Badges are rectangular with a 2px radius, not pills. Publish state has its
 * own component (StatusPill) so the two are never confused, and a screen full
 * of identical rounded pills never happens.
 *
 * The label is set in small caps with a little letter spacing. That treatment
 * is editorial and deliberate: it is what separates a badge from body text at
 * this size without needing a heavier weight or a louder fill.
 *
 * `pop` and `blush` are gone. They were the loud decorative tones, a yellow
 * and a pink slab behind a 2px ink outline, kept alive for one pass as quiet
 * aliases so their call sites would keep compiling. Every one of those call
 * sites now names the tone it actually means (`accent` for a count worth
 * noticing, `warning` for one that is a problem), so the aliases no longer
 * carry anything.
 */
export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-label uppercase tracking-wide whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'border border-border-default bg-surface-sunken text-text-secondary',
        accent: 'border border-accent-subtle bg-accent-subtle text-text-accent',
        success: 'border border-success-border bg-success-bg text-success-fg',
        warning: 'border border-warning-border bg-warning-bg text-warning-fg',
        destructive: 'border border-destructive-border bg-destructive-bg text-destructive-fg',
        info: 'border border-info-border bg-info-bg text-info-fg',
        outline: 'border border-border-default bg-transparent text-text-secondary',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps
  extends ComponentPropsWithoutRef<'span'>, VariantProps<typeof badgeVariants> {
  icon?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone, icon, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cn(badgeVariants({ tone }), className)} {...props}>
      {icon ? (
        <span aria-hidden="true" className="[&_svg]:size-3">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
});
