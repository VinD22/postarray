import type { ReactNode } from 'react';

import { DataProviders } from '@/components/providers';
import { IntlProvider } from '@/lib/i18n/provider';
import { getRequestIntl } from '@/lib/i18n/server';

/**
 * The OAuth consent screen reads and writes through the API from the browser,
 * so it mounts the query client and the full catalog the root layout leaves out.
 */
export default async function ConsentLayout({ children }: { readonly children: ReactNode }) {
  const intl = await getRequestIntl();
  return (
    <IntlProvider locale={intl.locale} timeZone={intl.timeZone} catalog={intl.catalog}>
      <DataProviders
        toastRegionLabel={intl.t.format('a11y.region.notifications')}
        toastCloseLabel={intl.t.format('action.close')}
      >
        {children}
      </DataProviders>
    </IntlProvider>
  );
}
