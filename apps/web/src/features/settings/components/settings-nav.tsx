'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';

import { SETTINGS_SECTIONS } from './settings-sections';

/**
 * Settings navigation.
 *
 * At 1024px and above it is a vertical list beside the content. Below that it
 * is a single horizontal strip that scrolls inside itself, so the page never
 * scrolls sideways and the current section stays reachable without a menu.
 * Both are the same list, marked up as a nav with `aria-current`.
 */
export function SettingsNav(): ReactNode {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav
      aria-label={t('settings.ui.nav.label')}
      className={cn(
        'relay-scrollbar border-border-subtle bg-surface-canvas border-b',
        'lg:border-border-subtle lg:sticky lg:top-0 lg:h-fit lg:border-e lg:border-b-0',
        'lg:w-60 lg:shrink-0 lg:self-start lg:py-4',
      )}
    >
      <ul
        className={cn(
          'flex gap-1 overflow-x-auto px-2 py-2',
          'lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-2 lg:py-0',
        )}
      >
        {SETTINGS_SECTIONS.map((section) => {
          const active = pathname === section.href || pathname.startsWith(`${section.href}/`);
          return (
            <li key={section.id} className="shrink-0 lg:shrink">
              <Link
                href={section.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'text-body-md flex min-h-11 items-center rounded-md px-3 py-2',
                  'whitespace-nowrap lg:whitespace-normal',
                  'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                  'focus-visible:outline-2 focus-visible:outline-offset-2',
                  'focus-visible:outline-border-focus',
                  'transition-colors duration-[--duration-fast] ease-[--ease-standard]',
                  'motion-reduce:transition-none',
                  active &&
                    'bg-accent-subtle text-text-accent hover:bg-accent-subtle-hover font-medium',
                )}
              >
                {t(section.titleKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
