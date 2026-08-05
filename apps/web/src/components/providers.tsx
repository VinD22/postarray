'use client';

import type { ReactNode } from 'react';

import type { PartialCatalog } from '@relay/i18n';
import { AnnouncerProvider, ThemeProvider } from '@relay/design-system/hooks';
import { Toaster, TooltipProvider } from '@relay/design-system/primitives';

import { ApiProvider } from '@/lib/api/provider';
import { IntlProvider } from '@/lib/i18n/provider';

/**
 * Every app-wide provider, in one place and in a deliberate order.
 *
 * Order matters: i18n is outermost because the announcer region, the toast
 * region and every accessible name below it are translated strings.
 */
export function Providers({
  locale,
  timeZone,
  catalog,
  toastRegionLabel,
  toastCloseLabel,
  children,
}: {
  readonly locale: string;
  readonly timeZone: string;
  readonly catalog: PartialCatalog;
  readonly toastRegionLabel: string;
  readonly toastCloseLabel: string;
  readonly children: ReactNode;
}) {
  return (
    <IntlProvider locale={locale} timeZone={timeZone} catalog={catalog}>
      <ThemeProvider>
        <ApiProvider>
          <AnnouncerProvider>
            <TooltipProvider>
              <Toaster regionLabel={toastRegionLabel} closeLabel={toastCloseLabel}>
                {children}
              </Toaster>
            </TooltipProvider>
          </AnnouncerProvider>
        </ApiProvider>
      </ThemeProvider>
    </IntlProvider>
  );
}
