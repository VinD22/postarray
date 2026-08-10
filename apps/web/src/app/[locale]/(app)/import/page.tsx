import type { Metadata } from 'next';
import type { ReactElement } from 'react';

import { ImportScreen } from '@/features/import/import-screen';
import { getRequestIntl } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return {
    title: intl.t.format('import.title'),
    description: intl.t.format('import.subtitle'),
  };
}

/**
 * Bulk CSV import.
 *
 * The screen holds its own wizard state and reads nothing from the URL, so it
 * needs no Suspense boundary of its own. Uploading a file is a decision a
 * person makes on this page rather than a link they can be sent.
 */
export default function ImportPage(): ReactElement {
  return <ImportScreen />;
}
