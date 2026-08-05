import type { ReactElement } from 'react';

import { ConnectionsRouteFallback } from '@/features/connections/connections-fallback';

export default function ConnectionsLoading(): ReactElement {
  return <ConnectionsRouteFallback />;
}
