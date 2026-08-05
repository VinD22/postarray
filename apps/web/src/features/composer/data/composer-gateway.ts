/**
 * Every API call the composer and the library make, in one file.
 *
 * The screens take plain callbacks, so they can be driven by a test or by the
 * seeded fixtures without a network. This module is the only place that knows
 * the shape of `@/lib/api`, which keeps the coupling to one import.
 */

import { api, newIdempotencyKey } from '@/lib/api';
import {
  OVERRIDABLE_VARIANT_FIELDS,
  type CapabilitySnapshot,
  type MasterDraft,
  type OverridableVariantField,
} from '@relay/contracts';

import type { ComposerBootstrap, ComposerState, TargetAccount } from '../types';
import type { ResolvedEntity } from '../components/entity-search-field';

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
      ? ((await api.content.createDraft(
          input.brandId === null ? {} : { brandId: input.brandId },
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
  await api.content.updateMaster(state.master.id, state.master);
  await api.content.setTargets(state.master.id, {
    connectionIds: [...state.selectedConnectionIds],
  });
  for (const [connectionId, overrides] of Object.entries(state.overrides)) {
    const fields = Object.keys(overrides) as readonly OverridableVariantField[];
    if (fields.length === 0) {
      // No overrides left on this target: every overridable field goes back to
      // inheriting the master rather than keeping a stale copy of it.
      await api.content.resetVariantToMaster(state.master.id, connectionId, {
        fields: OVERRIDABLE_VARIANT_FIELDS,
      });
    } else {
      // One request per overridden field: the API records the override field by
      // field, so a rejected field cannot silently discard the others.
      for (const field of fields) {
        await api.content.overrideVariant(state.master.id, connectionId, {
          field,
          value: overrides[field],
        });
      }
    }
  }
}

/** Provider-backed destination search. A result without an id never returns. */
export async function searchDestinations(
  connectionId: string,
  query: string,
): Promise<readonly ResolvedEntity[]> {
  const results = await api.connections.listDestinations(connectionId, { q: query });
  return results.data
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
