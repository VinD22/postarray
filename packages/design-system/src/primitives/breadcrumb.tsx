'use client';

import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { focusRing } from '../utils/style-constants';

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
export function Breadcrumb({ label, items, renderLink, className }: BreadcrumbProps): ReactNode {
  return (
    <nav aria-label={label} className={cn('min-w-0', className)}>
      <ol className="text-body-sm text-text-secondary flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const content = <span className="truncate">{item.label}</span>;
          return (
            <li key={item.id} className="flex min-w-0 items-center gap-1">
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="text-text-primary truncate"
                >
                  {item.label}
                </span>
              ) : renderLink ? (
                renderLink(item, content)
              ) : (
                <a
                  href={item.href}
                  className={cn('hover:text-text-primary truncate rounded-sm', focusRing)}
                >
                  {item.label}
                </a>
              )}
              {isLast ? null : (
                <ChevronRight
                  aria-hidden="true"
                  className="text-text-tertiary size-3.5 shrink-0 rtl:rotate-180"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
