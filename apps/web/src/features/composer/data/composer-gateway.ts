/**
 * Every API call the composer and the library make, in one file.
 *
 * The screens take plain callbacks, so they can be driven by a test or by the
 * seeded fixtures without a network. This module is the only place that knows
 * the shape of `@/lib/api`, which keeps the coupling to one import.
 */

import { api, newIdempotencyKey } from '@/lib/api';
import type { ForwardAuth } from '@/lib/api/transport';
import {
  type CapabilitySnapshot,
  type MasterDraft,
  type OverridableVariantField,
  type PostingSetView,
} from '@relay/contracts';

import type { ComposerBootstrap, ComposerState, TargetAccount, TargetSet } from '../types';
import type { ResolvedEntity } from '../components/entity-search-field';

/**
 * One Posting Set, as the rail needs it.
 *
 * `seedBody` is empty because a Set is a channel selection plus a signature: it
 * has no draft text of its own on the server, and `PostingSetView` has no field
 * for one. The reducer treats an empty `seedBody` as "seeds nothing", which is
 * exactly the truth here — a Set applies channels, and inventing seed text
 * would put words in the draft that nobody wrote.
 */
function targetSetFromApi(view: PostingSetView): TargetSet {
  return {
    id: view.id,
    name: view.name,
    description: view.description ?? '',
    connectionIds: view.connectionIds,
    seedBody: '',
    signatureId: view.signatureId,
  };
}

/** Load the draft, the connectable accounts, their capabilities and the Sets. */
export async function loadComposer(input: {
  readonly contentItemId: string | null;
  readonly projectId: string;
  readonly workspaceTimeZone: string;
  /**
   * The session cookie and fingerprint headers to forward. This runs as part
   * of the Server Component render for `/compose`, not in the browser, so
   * without these every call here is unauthenticated — see `require-session.ts`
   * for why the fingerprint headers matter as much as the cookie itself.
   */
  readonly forward?: ForwardAuth;
}): Promise<ComposerBootstrap> {
  // Both reads are for the same project and neither depends on the other, so
  // they go out together rather than stacking two round trips in front of the
  // one screen where people are waiting to start writing.
  const [connections, sets] = await Promise.all([
    api.connections.list({ projectId: input.projectId }, input.forward),
    api.postingSets.list({ projectId: input.projectId }, input.forward),
  ]);

  const accounts: TargetAccount[] = await Promise.all(
    connections.data.map(async (connection) => {
      const capabilities = (await api.connections.getCapabilities(
        connection.id,
        input.forward,
      )) as CapabilitySnapshot;
      return {
        connectionId: connection.id,
        provider: connection.provider,
        displayName: connection.displayName,
        handle: connection.handle,
        avatarUrl: connection.avatarUrl,
        projectId: input.projectId,
        paused: connection.health === 'paused',
        capabilities,
      } satisfies TargetAccount;
    }),
  );

  const master =
    input.contentItemId === null
      ? ((await api.content.createDraft(
          { projectId: input.projectId },
          newIdempotencyKey('draft'),
          input.forward,
        )) as unknown as MasterDraft)
      : ((await api.content.get(input.contentItemId, input.forward)) as unknown as MasterDraft);

  return {
    master,
    accounts,
    /*
     * Sets used to be hardcoded to `[]` here, which meant "apply a Set" was
     * unreachable from the one screen anybody would ever want it on: the
     * feature had an API, tables, and a settings screen where Sets are created,
     * and the composer simply never asked for them.
     *
     * Two states, and only two, because the list is real now:
     *  - empty: the project genuinely has no Sets, and the rail says
     *    `composerWeb.set.none`.
     *  - failed: the error is not swallowed. Claiming "No Sets saved yet"
     *    when the request failed would be a statement about somebody's
     *    workspace that we cannot support, so the rejection travels up to the
     *    designed error state on `/compose`, which names a correlation id.
     * Archived Sets never arrive: the endpoint excludes them unless
     * `includeArchived` is passed, and it is not passed.
     */
    sets: sets.data.map(targetSetFromApi),
    /*
     * Signatures and branded domains stay empty because there is nothing to
     * read, not because the composer forgot to ask.
     *
     * Signatures: the `signatures` table exists, `PostingSet.signatureId`
     * points at it, and `POST /content/{id}/apply-signature` can apply one, but
     * no surface lists them. There is no `GET /signatures` in `apps/api`, no
     * signatures service in `@relay/application` and no `api.signatures` client
     * to call. Fabricating a list from the Sets that reference one would show a
     * signature's id where its text belongs, so `SignaturePanel` correctly
     * offers nothing until the endpoint exists.
     *
     * Branded domains: `ProjectView.domains` is a bare `string[]` with no
     * verification state, and `LinkControls` only ever offers a *verified*
     * domain. Mapping those strings in would either hide them all (identical to
     * this, with extra code) or assert a verification this product cannot
     * perform yet — settings already says domain verification is unavailable.
     *
     * TODO(owner): both need a read endpoint before the composer can show
     * them. Neither is a composer-side fix.
     */
    signatures: [],
    brandedDomains: [],
    selectedConnectionIds: [],
    overrides: {},
    settings: {},
    approvalPinned: false,
    approverName: null,
    approvalPolicy: null,
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
