'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

/**
 * A small, low-emphasis label: a locale code, a surface of origin, a count.
 *
 * Badges are rectangular with a 4px radius, not pills. Publish state has its
 * own component (StatusPill) so the two are never confused, and a screen full
 * of identical rounded pills never happens.
 */
export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-label whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'border-border-default bg-surface-sunken text-text-secondary',
        accent: 'border-accent-subtle bg-accent-subtle text-text-accent',
        success: 'border-success-border bg-success-bg text-success-fg',
        warning: 'border-warning-border bg-warning-bg text-warning-fg',
        destructive: 'border-destructive-border bg-destructive-bg text-destructive-fg',
        info: 'border-info-border bg-info-bg text-info-fg',
        outline: 'border-border-default bg-transparent text-text-secondary',
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
