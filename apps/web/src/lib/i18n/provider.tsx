'use client';

import type { ReactNode } from 'react';

import type { PartialCatalog } from '@relay/i18n';
import { I18nProvider } from '@relay/i18n/react';

/**
 * The client side of the i18n wiring.
 *
 * The catalog is resolved on the server and handed down once, so a client
 * component calls `useTranslations('home')` with no waterfall and no second
 * ICU runtime in the bundle.
 */
export function IntlProvider({
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
    <I18nProvider locale={locale} timeZone={timeZone} catalog={catalog}>
      {children}
    </I18nProvider>
  );
}
