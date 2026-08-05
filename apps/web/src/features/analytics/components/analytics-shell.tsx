'use client';

import type { ReactElement, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageHeader } from '@relay/design-system/patterns';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';

/**
 * The header and section navigation shared by every analytics screen.
 *
 * The three sections are separate destinations rather than tabs inside one
 * page, because tracked links are a different measurement with a different
 * source and must never look like another column of the same table. The nav is
 * a real list of links, so a section can be bookmarked, opened in a new tab and
 * announced by a screen reader as a navigation landmark.
 */

interface Section {
  readonly href: string;
  readonly labelKey: string;
  /** Matches this href exactly rather than by prefix. */
  readonly exact: boolean;
}

const SECTIONS: readonly Section[] = [
  { href: '/analytics', labelKey: 'analytics.tab.overview', exact: true },
  { href: '/analytics/experiments', labelKey: 'analytics.tab.experiments', exact: false },
  { href: '/analytics/links', labelKey: 'analytics.tab.links', exact: false },
];

export interface AnalyticsShellProps {
  readonly children: ReactNode;
}

export function AnalyticsShell({ children }: AnalyticsShellProps): ReactElement {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <>
      <PageHeader
        title={t('analytics.title')}
        description={t('analytics.subtitle')}
        toolbar={
          <nav aria-label={t('analytics.tab.label')}>
            <ul className="-mb-4 flex flex-wrap gap-x-1">
              {SECTIONS.map((section) => {
                const active = section.exact
                  ? pathname === section.href
                  : pathname.startsWith(section.href);
                return (
                  <li key={section.href}>
                    <Link
                      href={section.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'inline-flex min-h-11 items-center border-b-2 px-3 text-body-md',
                        'transition-colors duration-(--duration-fast)',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
                        active
                          ? 'border-accent text-text-primary'
                          : 'border-transparent text-text-secondary hover:text-text-primary',
                      )}
                    >
                      {t(section.labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        }
      />
      <div>{children}</div>
    </>
  );
}
