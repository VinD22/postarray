/**
 * Every API call the composer and the library make, in one file.
 *
 * The screens take plain callbacks, so they can be driven by a test or by the
 * seeded fixtures without a network. This module is the only place that knows
 * the shape of `@/lib/api`, which keeps the coupling to one import.
 */

import type { ContentItemView as ApplicationContentItemView } from '@relay/application';
import { api, newIdempotencyKey } from '@/lib/api';
import type { ContentTargetInput } from '@/lib/api/resources/content';
import type { ForwardAuth } from '@/lib/api/transport';
import { collectAllPages, FOLLOW_PAGE_SIZE } from '@/lib/api/paginate';
import {
  capabilitySnapshotSchema,
  type CapabilitySnapshot,
  type MasterDraft,
  type PostingSetView,
  type VariantOverrides,
} from '@relay/contracts';
import { ApiError } from '@/lib/api/error';

import {
  EMPTY_VARIANT_SETTINGS,
  UNSAVED_DRAFT_ID,
  type ComposerBootstrap,
  type ComposerSaveOutcome,
  type ComposerState,
  type TargetAccount,
  type TargetSet,
  type UnavailableAccount,
  type VariantSettings,
} from '../types';
import { ComposerSaveConflict } from '../state/save-conflict';
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
    requiresApproval: view.approvalPolicy !== 'none',
  };
}

/** The master a lazily created draft starts from, before any server row. */
function localMaster(input: {
  readonly workspaceId: string;
  readonly projectId: string;
  readonly schedule: MasterDraft['schedule'];
}): MasterDraft {
  return {
    id: UNSAVED_DRAFT_ID,
    workspaceId: input.workspaceId,
    projectId: input.projectId,
    campaignId: null,
    title: null,
    body: '',
    contentKind: 'text',
    locale: 'en',
    mediaIds: [],
    links: [],
    signature: null,
    threadItems: [],
    schedule: input.schedule,
    disclosure: { aiAssisted: false, commercialContent: false, brandedContent: false },
    createdVia: 'web',
  };
}

/**
 * The master, straight from the application's own view of the draft.
 *
 * This used to be a cast of the narrowed list view, which carries neither the
 * links, the thread items, the schedule nor the disclosure flags. Reopening a
 * draft therefore emptied all four, and the next autosave wrote the emptiness
 * back.
 */
function masterFromComposite(item: ApplicationContentItemView): MasterDraft {
  return {
    id: item.id,
    workspaceId: item.workspaceId,
    projectId: item.projectId,
    campaignId: item.campaignId,
    title: item.title,
    body: item.body,
    contentKind: item.contentKind,
    locale: item.locale,
    mediaIds: [...item.mediaIds],
    links: [...item.links],
    signature: item.signature,
    threadItems: [...item.threadItems],
    schedule: item.schedule,
    disclosure: item.disclosure,
    createdVia: item.createdVia,
  };
}

interface VariantState {
  readonly selectedConnectionIds: readonly string[];
  readonly overrides: Readonly<Record<string, VariantOverrides>>;
  readonly settings: Readonly<Record<string, VariantSettings>>;
}

function emptyVariantState(): VariantState {
  return { selectedConnectionIds: [], overrides: {}, settings: {} };
}

/** Every saved target, with what it overrides and how it is configured. */
function variantStateFrom(item: ApplicationContentItemView): VariantState {
  const overrides: Record<string, VariantOverrides> = {};
  const settings: Record<string, VariantSettings> = {};

  for (const variant of item.variants) {
    if (Object.keys(variant.overrides).length > 0) {
      overrides[variant.connectionId] = variant.overrides;
    }
    settings[variant.connectionId] = {
      destination:
        variant.destination === null
          ? null
          : {
              destinationId: variant.destination.id,
              // The stored view knows the row and its label. The provider's own
              // id is not part of it, and inventing one would put a value in a
              // field that no lookup returned.
              externalId: null,
              displayLabel: variant.destination.displayLabel,
            },
      mentions: [...variant.mentions],
      privacyValue: variant.privacyValue,
      disclosure: variant.disclosure,
    };
  }

  return {
    selectedConnectionIds: item.variants.map((variant) => variant.connectionId),
    overrides,
    settings,
  };
}

/** Load the draft, the connectable accounts, their capabilities and the Sets. */
export async function loadComposer(input: {
  readonly contentItemId: string | null;
  readonly projectId: string;
  /** Needed for the local master of a draft whose row does not exist yet. */
  readonly workspaceId: string;
  readonly workspaceTimeZone: string;
  /** From `/compose?at=&tz=`, already validated. Seeds the schedule. */
  readonly schedule?: MasterDraft['schedule'];
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
    // Every account the post can go to, not the first page of them.
    collectAllPages((cursor) =>
      api.connections.list(
        {
          projectId: input.projectId,
          limit: FOLLOW_PAGE_SIZE,
          ...(cursor === undefined ? {} : { cursor }),
        },
        input.forward,
      ),
    ),
    api.postingSets.list({ projectId: input.projectId }, input.forward),
  ]);

  /*
   * One channel whose capabilities fail to load, or come back in a shape we
   * cannot read, degrades that channel only. It used to reject the whole
   * `Promise.all`, so one flaky provider took the composer down for every
   * other account in the project.
   */
  const snapshots = await Promise.allSettled(
    connections.data.map((connection) =>
      api.connections.getCapabilities(connection.id, input.forward),
    ),
  );
  const accounts: TargetAccount[] = [];
  const unavailableAccounts: UnavailableAccount[] = [];
  connections.data.forEach((connection, index) => {
    const settled = snapshots[index];
    const parsed =
      settled?.status === 'fulfilled' ? capabilitySnapshotSchema.safeParse(settled.value) : null;
    if (parsed === null || !parsed.success) {
      unavailableAccounts.push({
        connectionId: connection.id,
        provider: connection.provider,
        displayName: connection.displayName,
      });
      return;
    }
    accounts.push({
      connectionId: connection.id,
      provider: connection.provider,
      displayName: connection.displayName,
      handle: connection.handle,
      avatarUrl: connection.avatarUrl,
      projectId: input.projectId,
      paused: connection.health === 'paused',
      capabilities: parsed.data as CapabilitySnapshot,
    });
  });

  /*
   * A visit is not a draft.
   *
   * Creating the row here meant that opening the composer and closing it again
   * left a permanent empty draft behind, so a person who looked at the screen
   * three times had three of them to clean up. The row is now created on the
   * first edit that has something to save, by `ensureDraftId()` below, and
   * until then the master is local and carries `UNSAVED_DRAFT_ID`.
   */
  const composite =
    input.contentItemId === null
      ? null
      : await api.content.getComposite(input.contentItemId, input.forward);

  const master =
    composite === null
      ? localMaster({
          workspaceId: input.workspaceId,
          projectId: input.projectId,
          schedule: input.schedule ?? null,
        })
      : masterFromComposite(composite);

  const variants = composite === null ? emptyVariantState() : variantStateFrom(composite);

  return {
    master,
    updatedAt: composite?.updatedAt ?? null,
    versionId: composite?.currentVersionId ?? null,
    accounts,
    unavailableAccounts,
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
    selectedConnectionIds: variants.selectedConnectionIds,
    /*
     * Read back, not thrown away. These two were hardcoded empty, so every
     * per-platform rewrite and every native setting a person had saved
     * disappeared the moment they reopened the draft: the server still had
     * them, and the screen showed the master text instead.
     */
    overrides: variants.overrides,
    settings: variants.settings,
    approvalPinned: false,
    approverName: null,
    approvalPolicy: null,
    workspaceTimeZone: input.workspaceTimeZone,
  };
}

export interface ComposerGateway {
  /**
   * The content item id, creating the server row the first time it is asked
   * for. Every caller that needs an id awaits this same promise, so a burst of
   * concurrent edits creates exactly one draft.
   */
  readonly ensureDraftId: () => Promise<string>;
  readonly save: (state: ComposerState) => Promise<ComposerSaveOutcome>;
}

export interface ComposerGatewayInput {
  /** Null for a draft that has not been created yet. */
  readonly contentItemId: string | null;
  /** The `currentVersionId` the composer opened on; null for a new draft. */
  readonly versionId?: string | null;
  readonly projectId: string;
  /** Called once, when the lazy draft is created, with its new id. */
  readonly onDraftCreated?: (contentItemId: string) => void;
}

/**
 * The composer's writes, as one object with one memoised draft creation.
 *
 * Saving is at most two requests, whatever the target count:
 *
 *   1. create the draft, but only the first time and only if it is missing;
 *   2. `PUT /content/{id}/composite`: master, targets and every override as
 *      one version, in one transaction on the server.
 *
 * It used to be three waves (master, targets, then one request per variant),
 * which wrote up to 2 + N versions per autosave, could interleave with another
 * tab, and could leave some targets saved and others not. The composite write
 * carries the version it was built on, so a save that lost a race is refused
 * with 409 and surfaces as a conflict instead of silently overwriting.
 */
export function createComposerGateway(input: ComposerGatewayInput): ComposerGateway {
  let draftId: string | null = input.contentItemId;
  // The version every save is built on. A draft created here starts on the
  // version its creation wrote, so the first save cannot be called stale.
  let versionId: string | null = input.versionId ?? null;
  let creating: Promise<string> | null = null;
  // The Set whose approval policy the server already holds for this draft.
  let appliedSetId: string | null = null;

  const ensureDraftId = (): Promise<string> => {
    if (draftId !== null) {
      return Promise.resolve(draftId);
    }
    creating ??= api.content
      .createDraft({ projectId: input.projectId }, newIdempotencyKey('draft'))
      .then((created) => {
        draftId = created.id;
        versionId = created.currentVersionId ?? null;
        input.onDraftCreated?.(created.id);
        return created.id;
      })
      .catch((error: unknown) => {
        // A failed creation must not poison every later save: the next edit
        // asks again rather than resolving to a draft that does not exist.
        creating = null;
        throw error;
      });
    return creating;
  };

  const save = async (state: ComposerState): Promise<ComposerSaveOutcome> => {
    const contentItemId = await ensureDraftId();
    const master = state.master;

    // Every override the draft holds for a selected target, sent whole: the
    // server replaces that target's overrides, so an empty object is a
    // deliberate "inherit everything" rather than "leave it alone".
    const variantOverrides: Record<string, VariantOverrides> = {};
    for (const connectionId of state.selectedConnectionIds) {
      if (
        state.dirtyConnectionIds.includes(connectionId) ||
        state.overrides[connectionId] !== undefined
      ) {
        variantOverrides[connectionId] = state.overrides[connectionId] ?? {};
      }
    }

    try {
      /*
       * A Set carries an approval policy, and only the server may record it on
       * the content item: `assertApproved` reads that column before anything
       * publishes. Applying the Set first means the policy holds even if this
       * tab closes; the composite write below then replaces the targets with
       * exactly what the composer shows.
       */
      if (state.appliedSetId !== null && state.appliedSetId !== appliedSetId) {
        const applied = await api.content.applySet(contentItemId, state.appliedSetId);
        appliedSetId = state.appliedSetId;
        versionId = applied.currentVersionId ?? versionId;
      }
      const saved = await api.content.saveComposite(contentItemId, {
        expectedVersionId: versionId,
        master: {
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
        },
        targets: targetInputs(state),
        variantOverrides,
      });
      versionId = saved.currentVersionId ?? versionId;
      // One transaction: every target saved or none did, so there is no
      // partial outcome to report any more.
      return {
        contentItemId,
        savedAt: saved.updatedAt,
        savedConnectionIds: state.dirtyConnectionIds,
        failedConnectionIds: [],
      };
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        const latest = await api.content.getComposite(contentItemId);
        throw new ComposerSaveConflict({
          theirBody: latest.body,
          changedAt: latest.updatedAt,
          serverVersionId: latest.currentVersionId ?? '',
          accept: () => {
            versionId = latest.currentVersionId;
          },
        });
      }
      throw error;
    }
  };

  return { ensureDraftId, save };
}

/** One target as the API takes it, native settings included. */
function targetInputs(state: ComposerState): readonly ContentTargetInput[] {
  return state.selectedConnectionIds.map((connectionId) => {
    const settings = state.settings[connectionId] ?? EMPTY_VARIANT_SETTINGS;
    return {
      connectionId,
      // Only a destination we have a stored row for can be referenced. One the
      // provider search found but nothing has stored yet stays local until it
      // does, rather than being sent as an id the server cannot resolve.
      destinationId: settings.destination?.destinationId ?? null,
      mentions: settings.mentions,
      privacyValue: settings.privacyValue,
      disclosure: settings.disclosure,
    } satisfies ContentTargetInput;
  });
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
      // The destination the variant stores is a row in our own table, and this
      // is where its id comes from. Synthesizing one from the provider id, as
      // the composer used to, wrote a reference to a row that does not exist.
      recordId: entry.id,
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
      recordId: null,
      externalId: entry.externalId,
      label: entry.displayName,
      secondary: entry.handle,
    }));
}
