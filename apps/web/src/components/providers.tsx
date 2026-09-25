'use client';

import type { ReactNode } from 'react';

import type { PartialCatalog } from '@relay/i18n';
import { AnnouncerProvider, ThemeProvider } from '@relay/design-system/hooks';
import { Toaster, TooltipProvider } from '@relay/design-system/primitives';

import { ApiProvider } from '@/lib/api/provider';
import { IntlProvider } from '@/lib/i18n/provider';

/**
 * The providers every page needs, in one place and in a deliberate order.
 *
 * Order matters: i18n is outermost because the announcer region and every
 * accessible name below it are translated strings.
 *
 * React Query and the toast region are not here. The public site formats on
 * the server and never fetches from the browser, so it should not pay for a
 * query client. Trees that do fetch mount `DataProviders` in their own layout.
 */
export function Providers({
  locale,
  timeZone,
  catalog,
  children,
}: {
  readonly locale: string;
  readonly timeZone: string;
  readonly catalog: PartialCatalog;
  readonly children: ReactNode;
}) {
  return (
    <IntlProvider locale={locale} timeZone={timeZone} catalog={catalog}>
      <ThemeProvider>
        <AnnouncerProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AnnouncerProvider>
      </ThemeProvider>
    </IntlProvider>
  );
}

/**
 * The query client and the toast region, for the signed-in, onboarding, auth
 * and consent trees.
 */
export function DataProviders({
  toastRegionLabel,
  toastCloseLabel,
  children,
}: {
  readonly toastRegionLabel: string;
  readonly toastCloseLabel: string;
  readonly children: ReactNode;
}) {
  return (
    <ApiProvider>
      <Toaster regionLabel={toastRegionLabel} closeLabel={toastCloseLabel}>
        {children}
      </Toaster>
    </ApiProvider>
  );
}
