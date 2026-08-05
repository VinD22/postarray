'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { PageHeader } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { SettingsStack } from './section';
import { SETTINGS_SECTIONS } from './settings-sections';

/**
 * The settings index.
 *
 * A list of sections with one sentence each, rather than a grid of tiles: the
 * sentence is what tells someone whether the thing they are looking for is in
 * here, and a tile has nowhere to put it.
 */
export function SettingsIndex(): ReactNode {
  const t = useTranslations();

  return (
    <>
      <PageHeader title={t('settings.title')} description={t('settings.ui.subtitle')} />

      <SettingsStack>
        <p className="text-body-md text-text-secondary max-w-[68ch]">
          {t('settings.ui.index.help')}
        </p>

        <ul className="border-border-default flex flex-col border-y">
          {SETTINGS_SECTIONS.map((section) => (
            <li key={section.id} className="border-border-subtle border-b last:border-b-0">
              <Link
                href={section.href}
                className="hover:bg-surface-hover focus-visible:outline-border-focus flex min-h-14 items-center justify-between gap-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-body-md text-text-primary font-medium">
                    {t(section.titleKey)}
                  </span>
                  <span className="text-body-sm text-text-secondary max-w-[68ch]">
                    {t(section.summaryKey)}
                  </span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="text-text-tertiary size-4 shrink-0 rtl:rotate-180"
                />
              </Link>
            </li>
          ))}
        </ul>
      </SettingsStack>
    </>
  );
}
