'use client';

/**
 * Route entry for connections.
 *
 * The scope table lives in `./permissions.ts`. It carries only what Post Array asks
 * each provider for and why. Whether a scope was granted is a fact about one
 * account and comes from that account's `grantedScopes`, resolved per row in
 * `connections-screen.tsx`.
 */

import type { ReactNode } from 'react';
import { ConnectionsScreen } from './connections-screen';
import { REQUESTED_SCOPES } from './permissions';

export function ConnectionsContainer(): ReactNode {
  return (
    <ConnectionsScreen
      connectionHrefPattern="/connections/{id}"
      permissionsByProvider={REQUESTED_SCOPES}
    />
  );
}
