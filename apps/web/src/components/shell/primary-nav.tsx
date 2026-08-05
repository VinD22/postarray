'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { useMediaQuery } from '@relay/design-system/hooks';
import { Tooltip } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { useTranslations } from '@/lib/i18n';

import { isNavItemActive, NAV_ITEMS } from './nav-items';

/**
 * The navigation rail.
 *
 * At 768px it is icons only, so each item carries a tooltip and a visually
 * hidden name. At 1024px and above the labels are visible and the tooltip is
 * removed, because a tooltip repeating a visible label is noise.
 *
 * Selection is a tonal surface plus a 2px inline-start marker plus
 * `aria-current`. Never colour alone, and never a filled pill: this rail is
 * read fifty times a day.
 */
export function PrimaryNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const labelsVisible = useMediaQuery('(min-width: 64rem)');

  return (
    <nav
      aria-label={t('nav.primaryLandmark')}
      className={cn(
        'hidden md:flex md:flex-col md:gap-0.5',
        'border-e border-border-subtle bg-surface-sunken',
        'px-2 py-3 lg:px-3',
      )}
    >
      {NAV_ITEMS.map((item) => {
        const active = isNavItemActive(item, pathname);
        const label = t(item.labelKey);
        const Icon = item.icon;

        const link: ReactNode = (
          <Link
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative flex min-h-11 items-center gap-3 rounded-md px-2.5 py-2 lg:min-h-9',
              'text-body-md transition-colors duration-(--duration-fast)',
              active
                ? 'bg-surface-raised font-medium text-text-primary'
                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-y-0 start-0 my-1.5 w-0.5 rounded-full',
                active ? 'bg-accent' : 'bg-transparent',
              )}
            />
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            {labelsVisible ? (
              <span className="truncate">{label}</span>
            ) : (
              <span className="sr-only">{label}</span>
            )}
          </Link>
        );

        return labelsVisible ? (
          <div key={item.id}>{link}</div>
        ) : (
          <Tooltip key={item.id} content={label} side="right">
            {link}
          </Tooltip>
        );
      })}
    </nav>
  );
}
