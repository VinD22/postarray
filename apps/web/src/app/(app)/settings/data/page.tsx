import type { ReactNode } from 'react';

import { DataControlsScreen } from '@/features/settings/data/data-controls-screen';

/**
 * Server component. It renders the screen and nothing else: every string on
 * this route comes from the catalog through the client component, so there is
 * no English literal here and no metadata to keep in sync with it.
 */
export default function Page(): ReactNode {
  return <DataControlsScreen />;
}
