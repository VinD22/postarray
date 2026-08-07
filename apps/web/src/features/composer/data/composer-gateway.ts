/**
 * Every API call the composer and the library make, in one file.
 *
 * The screens take plain callbacks, so they can be driven by a test or by the
 * seeded fixtures without a network. This module is the only place that knows
 * the shape of `@/lib/api`, which keeps the coupling to one import.
 */

import { api, newIdempotencyKey } from '@/lib/api';
import {
  type CapabilitySnapshot,
  type MasterDraft,
  type OverridableVariantField,
} from '@relay/contracts';

import type { ComposerBootstrap, ComposerState, TargetAccount } from '../types';
import type { ResolvedEntity } from '../components/entity-search-field';

/** Load the draft, the connectable accounts and their capability snapshots. */
export async function loadComposer(input: {
  readonly contentItemId: string | null;
  readonly brandId: string;
  readonly workspaceTimeZone: string;
}): Promise<ComposerBootstrap> {
  const connections = await api.connections.list({ brandId: input.brandId });

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
      ? ((await api.content.createDraft(
          { brandId: input.brandId },
          newIdempotencyKey('draft'),
        )) as unknown as MasterDraft)
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
  const master = state.master;
  await api.content.updateMaster(master.id, {
    title: master.title,
    body: master.body,
    contentKind: master.contentKind,
    locale: master.locale,
    mediaIds: master.mediaIds,
    links: master.links,
    signature: master.signature,
    threadItems: master.threadItems,
    schedule: master.schedule,
    disclosure: master.disclosure,
    campaignId: master.campaignId,
  });
  const targeted = await api.content.setTargets(state.master.id, {
    targets: state.selectedConnectionIds.map((connectionId) => ({ connectionId })),
  });
  const targetByConnection = new Map(
    targeted.targets.map((target) => [target.connectionId, target.variantId]),
  );
  for (const [connectionId, overrides] of Object.entries(state.overrides)) {
    const fields = Object.keys(overrides) as readonly OverridableVariantField[];
    const variantId = targetByConnection.get(connectionId);
    if (variantId === undefined) {
      continue;
    }
    if (fields.length === 0) {
      // No overrides left on this target: every overridable field goes back to
      // inheriting the master rather than keeping a stale copy of it.
      await api.content.resetVariantToMaster(state.master.id, variantId);
    } else {
      await api.content.overrideVariant(state.master.id, variantId, { patch: overrides });
    }
  }
}

/** Provider-backed destination search. A result without an id never returns. */
export async function searchDestinations(
  connectionId: string,
  query: string,
): Promise<readonly ResolvedEntity[]> {
  const results = await api.connections.listDestinations(connectionId, { q: query });
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
  const results = await api.connections.searchMentions(connectionId, { q: query });
  return results
    .filter((entry) => entry.externalId.length > 0)
    .map((entry) => ({
      externalId: entry.externalId,
      label: entry.displayName,
      secondary: entry.handle,
    }));
}
