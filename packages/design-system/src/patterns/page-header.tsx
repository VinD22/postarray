'use client';

import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Breadcrumb, type BreadcrumbProps } from '../primitives/breadcrumb';

export interface PageHeaderProps {
  /** The page title. Rendered as the page's only h1. */
  title: ReactNode;
  /** One sentence saying what this screen is for. Optional but usually right. */
  description?: ReactNode;
  /** Primary and secondary actions. At most one primary. */
  actions?: ReactNode;
  /** Display serif by default; `strong` is the oversized sans treatment for key indexes. */
  titleStyle?: 'display' | 'strong';
  breadcrumb?: BreadcrumbProps;
  /** Filters, a view switcher, tabs. Sits under the title block. */
  toolbar?: ReactNode;
  /** Sticks to the top of the scroll container. Use on long list screens. */
  sticky?: boolean;
  className?: string;
  id?: string;
}

/**
 * The header every product screen starts with.
 *
 * The title is the h1 and there is exactly one per page, which is what makes
 * heading navigation work. On a narrow screen the actions wrap under the title
 * rather than squeezing it: a truncated title with a full-width button row is
 * the wrong trade, because the title is how you know where you are.
 */
export function PageHeader({
  title,
  description,
  actions,
  titleStyle = 'display',
  breadcrumb,
  toolbar,
  sticky = false,
  className,
  id,
}: PageHeaderProps): ReactNode {
  return (
    <header
      id={id}
      className={cn(
        'border-border-default bg-surface-canvas flex flex-col gap-5 border-b',
        'px-4 pt-7 pb-6 md:px-6 md:pt-9 md:pb-7',
        sticky && 'sticky top-[4.75rem] z-(--z-index-sticky)',
        className,
      )}
    >
      {breadcrumb ? <Breadcrumb {...breadcrumb} /> : null}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <h1
            className={cn(
              'text-text-primary leading-[0.98] text-balance',
              titleStyle === 'strong'
                ? 'font-sans text-[clamp(2.5rem,2.1rem+1.5vw,3.75rem)] font-[750] tracking-[-0.045em]'
                : 'type-title text-[clamp(2.25rem,1.9rem+1.5vw,3.5rem)] font-bold tracking-[-0.035em]',
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className="text-body-lg text-text-secondary max-w-[62ch] text-pretty">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 md:pb-0.5">{actions}</div>
        ) : null}
      </div>

      {toolbar ? <div className="border-border-subtle min-w-0 border-t pt-4">{toolbar}</div> : null}
    </header>
  );
}
