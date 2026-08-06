'use client';

import type { ReactElement, ReactNode } from 'react';
import { Link } from '@/components/link';
import { usePathname } from 'next/navigation';
import { PageHeader } from '@relay/design-system/patterns';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';

/**
 * The header and section navigation for automation.
 *
 * Rules and feeds are two destinations rather than one filtered list, because
 * they are configured differently and fail differently: a rule stops after
 * consecutive failures, a feed stalls when a publisher stops posting.
 */

const SECTIONS = [
  { href: '/automation', labelKey: 'automation.tab.rules', exact: true },
  { href: '/automation/rss', labelKey: 'automation.tab.feeds', exact: false },
] as const;

export function AutomationShell({ children }: { readonly children: ReactNode }): ReactElement {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <>
      <PageHeader
        title={t('automation.title')}
        description={t('automation.subtitle')}
        toolbar={
          <nav aria-label={t('automation.tab.label')}>
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
                        'text-body-md inline-flex min-h-11 items-center border-b-2 px-3',
                        'transition-colors duration-(--duration-fast)',
                        'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
                        active
                          ? 'border-accent text-text-primary'
                          : 'text-text-secondary hover:text-text-primary border-transparent',
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
