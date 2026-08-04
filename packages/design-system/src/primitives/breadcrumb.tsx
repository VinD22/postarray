'use client';

import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn.js';
import { focusRing } from '../utils/style-constants.js';

export interface BreadcrumbItem {
  readonly id: string;
  readonly label: string;
  /** Omit on the final item: the current page is not a link to itself. */
  readonly href?: string | undefined;
}

export interface BreadcrumbProps {
  /** Accessible name for the navigation region, from the message catalog. */
  label: string;
  items: readonly BreadcrumbItem[];
  /**
   * Renders a link. The design system does not know about the router, so the
   * app supplies this, usually wrapping the framework's Link component.
   */
  renderLink?: (item: BreadcrumbItem, children: ReactNode) => ReactNode;
  className?: string;
}

/**
 * A breadcrumb trail for nested objects: workspace, brand, campaign, post.
 *
 * The last item is `aria-current="page"` and is not a link. The separator is a
 * chevron that mirrors in RTL and is hidden from assistive technology, since
 * the list structure already conveys the hierarchy.
 */
export function Breadcrumb({
  label,
  items,
  renderLink,
  className,
}: BreadcrumbProps): ReactNode {
  return (
    <nav aria-label={label} className={cn('min-w-0', className)}>
      <ol className="flex flex-wrap items-center gap-1 text-body-sm text-text-secondary">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const content = <span className="truncate">{item.label}</span>;
          return (
            <li key={item.id} className="flex min-w-0 items-center gap-1">
              {isLast || !item.href ? (
                <span aria-current={isLast ? 'page' : undefined} className="truncate text-text-primary">
                  {item.label}
                </span>
              ) : renderLink ? (
                renderLink(item, content)
              ) : (
                <a
                  href={item.href}
                  className={cn('truncate rounded-sm hover:text-text-primary', focusRing)}
                >
                  {item.label}
                </a>
              )}
              {isLast ? null : (
                <ChevronRight
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-text-tertiary rtl:rotate-180"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
