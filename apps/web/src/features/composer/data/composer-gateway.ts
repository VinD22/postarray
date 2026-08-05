/**
 * Every API call the composer and the library make, in one file.
 *
 * The screens take plain callbacks, so they can be driven by a test or by the
 * seeded fixtures without a network. This module is the only place that knows
 * the shape of `@/lib/api`, which keeps the coupling to one import.
 */

import { api } from '@/lib/api';
import type { CapabilitySnapshot, MasterDraft } from '@relay/contracts';

import type { ComposerBootstrap, ComposerState, TargetAccount } from '../types.js';
import type { ResolvedEntity } from '../components/entity-search-field.js';

/** Load the draft, the connectable accounts and their capability snapshots. */
export async function loadComposer(input: {
  readonly contentItemId: string | null;
  readonly brandId: string | null;
  readonly workspaceTimeZone: string;
}): Promise<ComposerBootstrap> {
  const connections = await api.connections.list(
    input.brandId === null ? {} : { brandId: input.brandId },
  );

  const accounts: TargetAccount[] = await Promise.all(
    connections.data.map(async (connection) => {
      const capabilities = (await api.connections.getCapabilities(
        connection.id,
      )) as CapabilitySnapshot;
      return {
        connectionId: connection.id,
        provider: connection.provider,
        displayName: connection.displayName,
        handle: connection.handle,
        avatarUrl: connection.avatarUrl,
        brandId: input.brandId,
        paused: connection.health === 'paused',
        capabilities,
      } satisfies TargetAccount;
    }),
  );

  const master =
    input.contentItemId === null
      ? ((await api.content.createDraft({ brandId: input.brandId })) as unknown as MasterDraft)
      : ((await api.content.get(input.contentItemId)) as unknown as MasterDraft);

  return {
    master,
    accounts,
    sets: [],
    signatures: [],
    brandedDomains: [],
    selectedConnectionIds: [],
    overrides: {},
    settings: {},
    approvalPinned: false,
    approverName: null,
    approvalPolicy: null,
    assistConfigured: false,
    workspaceTimeZone: input.workspaceTimeZone,
  };
}

/** Persist the master and the per target overrides. Never optimistic. */
export async function saveComposer(state: ComposerState): Promise<void> {
  await api.content.updateMaster(state.master.id, state.master);
  await api.content.setTargets(state.master.id, {
    connectionIds: [...state.selectedConnectionIds],
  });
  for (const [connectionId, overrides] of Object.entries(state.overrides)) {
    if (Object.keys(overrides).length === 0) {
      await api.content.resetVariantToMaster(state.master.id, connectionId);
    } else {
      await api.content.overrideVariant(state.master.id, connectionId, overrides);
    }
  }
}

/** Provider-backed destination search. A result without an id never returns. */
export async function searchDestinations(
  connectionId: string,
  query: string,
): Promise<readonly ResolvedEntity[]> {
  const results = await api.connections.listDestinations(connectionId, { query });
  return results
    .filter((entry) => entry.externalId.length > 0)
    .map((entry) => ({
      externalId: entry.externalId,
      label: entry.name,
      secondary: entry.kind,
    }));
}

/** Provider-backed mention search, with the same rule about external ids. */
export async function searchMentions(
  connectionId: string,
  query: string,
): Promise<readonly ResolvedEntity[]> {
  const results = await api.connections.searchMentions(connectionId, { query });
  return results
    .filter((entry) => entry.externalId.length > 0)
    .map((entry) => ({
      externalId: entry.externalId,
      label: entry.displayName,
      secondary: entry.handle,
    }));
}
