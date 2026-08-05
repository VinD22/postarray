/**
 * The composer reducer.
 *
 * One rule shapes this whole file: an edit addressed to one target may only
 * ever write to `overrides[thatConnectionId]` or `settings[thatConnectionId]`.
 * Nothing else in the state is reachable from a target edit, which is why the
 * isolation guarantee is structural and not a convention someone can forget.
 * `override-isolation.test.ts` asserts it for every field.
 */

import {
  newIdFor,
  pruneRedundantOverrides,
  resetFieldToMaster,
  resolveVariant,
  type LinkSpec,
  type MasterDraft,
  type OverridableVariantField,
  type RepeatSpec,
  type ScheduleSpec,
  type SignatureRef,
  type ThreadItem,
  type VariantOverrides,
} from '@relay/contracts';

import { appendUtm } from './capability-rules';
import {
  EMPTY_VARIANT_SETTINGS,
  type ComposerState,
  type LinkPlan,
  type TargetSet,
  type VariantSettings,
} from '../types';

export type ComposerAction =
  | { type: 'target/add'; connectionId: string }
  | { type: 'target/remove'; connectionId: string }
  | { type: 'target/open'; connectionId: string | null }
  | { type: 'set/apply'; set: TargetSet }
  | { type: 'master/patch'; patch: Partial<MasterDraft> }
  | {
      type: 'variant/override';
      connectionId: string;
      field: OverridableVariantField;
      value: VariantOverrides[OverridableVariantField];
    }
  | { type: 'variant/resetField'; connectionId: string; field: OverridableVariantField }
  | { type: 'variant/resetAll'; connectionId: string }
  | { type: 'variant/settings'; connectionId: string; patch: Partial<VariantSettings> }
  | { type: 'sequence/add'; connectionId: string | null; item: ThreadItem }
  | {
      type: 'sequence/patch';
      connectionId: string | null;
      itemId: string;
      patch: Partial<ThreadItem>;
    }
  | { type: 'sequence/remove'; connectionId: string | null; itemId: string }
  | { type: 'sequence/move'; connectionId: string | null; itemId: string; delta: -1 | 1 }
  | { type: 'schedule/set'; schedule: ScheduleSpec | null }
  | { type: 'schedule/repeat'; repeat: RepeatSpec | null }
  | { type: 'links/plan'; plan: Partial<LinkPlan> }
  | { type: 'links/sync'; urls: readonly string[] }
  | { type: 'signature/set'; signature: SignatureRef | null }
  | { type: 'approval/unpin' }
  | { type: 'state/replace'; state: ComposerState };

/** A fresh, empty thread item ready to be edited. */
export function newThreadItem(order: number, kind: ThreadItem['kind']): ThreadItem {
  return {
    id: newIdFor('comment'),
    kind,
    order,
    body: '',
    mediaIds: [],
    links: [],
    delaySeconds: 120,
    connectionId: null,
  };
}

function bumpRevision(state: ComposerState): ComposerState {
  return { ...state, revision: state.revision + 1, approvalPinned: false };
}

/** Read the sequence that a scope (master or one target) currently shows. */
export function sequenceFor(
  state: ComposerState,
  connectionId: string | null,
): readonly ThreadItem[] {
  if (connectionId === null) {
    return state.master.threadItems;
  }
  const overrides = state.overrides[connectionId] ?? {};
  return overrides.threadItems ?? state.master.threadItems;
}

function writeSequence(
  state: ComposerState,
  connectionId: string | null,
  items: readonly ThreadItem[],
): ComposerState {
  const ordered = items.map((item, index) => ({ ...item, order: index }));
  if (connectionId === null) {
    return bumpRevision({ ...state, master: { ...state.master, threadItems: ordered } });
  }
  return bumpRevision({
    ...state,
    overrides: {
      ...state.overrides,
      [connectionId]: {
        ...(state.overrides[connectionId] ?? {}),
        threadItems: ordered,
      },
    },
  });
}

function settingsFor(state: ComposerState, connectionId: string): VariantSettings {
  return state.settings[connectionId] ?? EMPTY_VARIANT_SETTINGS;
}

/** Rebuild the link list from the URLs currently in the text plus the plan. */
function buildLinks(
  urls: readonly string[],
  plan: LinkPlan,
  existing: readonly LinkSpec[],
): LinkSpec[] {
  return urls.map((url) => {
    const previous = existing.find((link) => link.originalUrl === url);
    const tracked = plan.mode === 'tracked';
    const host = plan.brandedDomain ?? 'relay.to';
    const slug = previous?.shortLinkId ?? newIdFor('shortLink');
    return {
      originalUrl: url,
      tracked,
      shortLinkId: tracked ? slug : null,
      publishedUrl: tracked
        ? `https://${host}/${slug.slice(-7)}`
        : appendUtm(url, Object.keys(plan.utm).length > 0 ? plan.utm : null),
      utm: Object.keys(plan.utm).length > 0 ? plan.utm : null,
      frozenAt: null,
    } satisfies LinkSpec;
  });
}

export function composerReducer(state: ComposerState, action: ComposerAction): ComposerState {
  switch (action.type) {
    case 'state/replace':
      return action.state;

    case 'target/add': {
      if (state.selectedConnectionIds.includes(action.connectionId)) {
        return state;
      }
      return {
        ...state,
        selectedConnectionIds: [...state.selectedConnectionIds, action.connectionId],
      };
    }

    case 'target/remove': {
      const { [action.connectionId]: removedOverride, ...overrides } = state.overrides;
      const { [action.connectionId]: removedSettings, ...settings } = state.settings;
      void removedOverride;
      void removedSettings;
      return {
        ...state,
        selectedConnectionIds: state.selectedConnectionIds.filter(
          (id) => id !== action.connectionId,
        ),
        overrides,
        settings,
        activeConnectionId:
          state.activeConnectionId === action.connectionId ? null : state.activeConnectionId,
      };
    }

    case 'target/open':
      return { ...state, activeConnectionId: action.connectionId };

    /**
     * Applying a Set produces a normal, independent draft. Nothing links back
     * to the Set afterwards, so editing the Set later cannot rewrite an
     * approved or scheduled post.
     */
    case 'set/apply': {
      const seeded =
        action.set.seedBody.length > 0 && state.master.body.trim().length === 0
          ? action.set.seedBody
          : state.master.body;
      return bumpRevision({
        ...state,
        master: { ...state.master, body: seeded },
        selectedConnectionIds: [
          ...state.selectedConnectionIds,
          ...action.set.connectionIds.filter((id) => !state.selectedConnectionIds.includes(id)),
        ],
        appliedSetId: action.set.id,
      });
    }

    case 'master/patch':
      return bumpRevision({ ...state, master: { ...state.master, ...action.patch } });

    /**
     * The only write path for a target. It touches one connection's overrides
     * and one field of them.
     */
    case 'variant/override': {
      const current = state.overrides[action.connectionId] ?? {};
      const next = { ...current, [action.field]: action.value } as VariantOverrides;
      return bumpRevision({
        ...state,
        overrides: {
          ...state.overrides,
          [action.connectionId]: pruneRedundantOverrides(state.master, next),
        },
      });
    }

    case 'variant/resetField': {
      const current = state.overrides[action.connectionId];
      if (!current) {
        return state;
      }
      return bumpRevision({
        ...state,
        overrides: {
          ...state.overrides,
          [action.connectionId]: resetFieldToMaster(current, action.field),
        },
      });
    }

    case 'variant/resetAll': {
      if (!state.overrides[action.connectionId]) {
        return state;
      }
      return bumpRevision({
        ...state,
        overrides: { ...state.overrides, [action.connectionId]: {} },
      });
    }

    case 'variant/settings':
      return bumpRevision({
        ...state,
        settings: {
          ...state.settings,
          [action.connectionId]: {
            ...settingsFor(state, action.connectionId),
            ...action.patch,
          },
        },
      });

    case 'sequence/add':
      return writeSequence(state, action.connectionId, [
        ...sequenceFor(state, action.connectionId),
        action.item,
      ]);

    case 'sequence/patch':
      return writeSequence(
        state,
        action.connectionId,
        sequenceFor(state, action.connectionId).map((item) =>
          item.id === action.itemId ? { ...item, ...action.patch } : item,
        ),
      );

    case 'sequence/remove':
      return writeSequence(
        state,
        action.connectionId,
        sequenceFor(state, action.connectionId).filter((item) => item.id !== action.itemId),
      );

    case 'sequence/move': {
      const items = [...sequenceFor(state, action.connectionId)];
      const index = items.findIndex((item) => item.id === action.itemId);
      const target = index + action.delta;
      const moved = items[index];
      const displaced = items[target];
      if (index < 0 || moved === undefined || displaced === undefined) {
        return state;
      }
      items[index] = displaced;
      items[target] = moved;
      return writeSequence(state, action.connectionId, items);
    }

    case 'schedule/set':
      return bumpRevision({ ...state, master: { ...state.master, schedule: action.schedule } });

    case 'schedule/repeat': {
      const schedule = state.master.schedule;
      if (!schedule) {
        return state;
      }
      return bumpRevision({
        ...state,
        master: { ...state.master, schedule: { ...schedule, repeat: action.repeat } },
      });
    }

    case 'links/plan': {
      const plan: LinkPlan = { ...state.linkPlan, ...action.plan };
      const urls = state.master.links.map((link) => link.originalUrl);
      return bumpRevision({
        ...state,
        linkPlan: plan,
        master: { ...state.master, links: buildLinks(urls, plan, state.master.links) },
      });
    }

    case 'links/sync': {
      const unchanged =
        action.urls.length === state.master.links.length &&
        action.urls.every((url, index) => state.master.links[index]?.originalUrl === url);
      if (unchanged) {
        return state;
      }
      return {
        ...state,
        master: {
          ...state.master,
          links: buildLinks(action.urls, state.linkPlan, state.master.links),
        },
      };
    }

    case 'signature/set':
      return bumpRevision({ ...state, master: { ...state.master, signature: action.signature } });

    case 'approval/unpin':
      return { ...state, approvalPinned: false };

    default:
      return state;
  }
}

/** Resolve one target's final values plus which fields are its own. */
export function resolveTarget(state: ComposerState, connectionId: string) {
  return resolveVariant(state.master, state.overrides[connectionId] ?? {});
}
