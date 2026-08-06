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
        'border-border-default bg-surface-canvas flex flex-col gap-3 border-b',
        'px-4 py-4 md:px-6',
        sticky && 'sticky top-0 z-(--z-index-sticky)',
        className,
      )}
    >
      {breadcrumb ? <Breadcrumb {...breadcrumb} /> : null}

      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-title-lg text-text-primary font-display font-bold text-balance">
            {title}
          </h1>
          {description ? (
            <p className="text-body-md text-text-secondary max-w-[70ch]">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>

      {toolbar ? <div className="min-w-0">{toolbar}</div> : null}
    </header>
  );
}
