/**
 * The composer's own view models.
 *
 * The domain shapes (master draft, variant overrides, capability snapshot,
 * validation issue) come from `@relay/contracts` and are used unchanged. What
 * this file adds is the screen's vocabulary: a target account with its live
 * counters, the rail state, saved Sets and the link plan.
 */

import type {
  CapabilitySnapshot,
  DisclosureFlags,
  LinkSpec,
  MasterDraft,
  MentionRef,
  ProviderId,
  ValidationIssue,
  VariantOverrides,
  OverridableVariantField,
} from '@relay/contracts';

/** A connected account this draft can publish to, with what it may do. */
export interface TargetAccount {
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly displayName: string;
  readonly handle: string | null;
  readonly avatarUrl: string | null;
  readonly projectId: string | null;
  readonly paused: boolean;
  /** The versioned snapshot every counter and limit in this screen reads. */
  readonly capabilities: CapabilitySnapshot;
}

/** A saved group of accounts plus reusable defaults. */
export interface TargetSet {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly connectionIds: readonly string[];
  /** Text the Set seeds into the master draft. Empty means it seeds nothing. */
  readonly seedBody: string;
  readonly signatureId: string | null;
}

export interface SignatureOption {
  readonly id: string;
  readonly name: string;
  readonly text: string;
  readonly projectId: string | null;
  /** Empty means every platform. */
  readonly providers: readonly ProviderId[];
  readonly locale: string;
  readonly autoApply: boolean;
}

/**
 * The rail state for one target. Seven values, each a different sentence.
 * `not_built` and `unsupported` are never merged.
 */
export type TargetRailState =
  'inherits' | 'override' | 'issue' | 'blocked' | 'needs_approval' | 'not_built' | 'unsupported';

/** Everything the rail row and the review list need for one target. */
export interface TargetSummary {
  readonly connectionId: string;
  readonly account: TargetAccount;
  readonly state: TargetRailState;
  readonly characterCount: number;
  readonly characterLimit: number;
  readonly mediaCount: number;
  readonly mediaLimit: number;
  readonly overriddenFields: readonly OverridableVariantField[];
  readonly issues: readonly ValidationIssue[];
  readonly blockingIssueCount: number;
  readonly warningIssueCount: number;
  /** Minor units in `costCurrency`. Null when the provider is not metered. */
  readonly estimatedCostMinor: number | null;
  readonly costCurrency: string | null;
  /** The exact URL that publishes for this target, when the draft has one. */
  readonly publishedUrl: string | null;
}

/**
 * A native destination inside one account: a community, a page, a channel.
 *
 * Two identifiers, and they are not interchangeable. `destinationId` is the
 * Post Array row the API stores on the variant, and it is the only one the
 * server accepts. `externalId` is the provider's own id, which is what the
 * search returns and what the field shows. Either can be missing: a reopened
 * draft knows the stored row but not the provider id, and a destination the
 * search found but nothing has stored yet has no row id to send.
 */
export interface ComposerDestination {
  readonly destinationId: string | null;
  readonly externalId: string | null;
  readonly displayLabel: string;
}

/** Per-target settings that are not part of `VariantOverrides`. */
export interface VariantSettings {
  readonly destination: ComposerDestination | null;
  readonly mentions: readonly MentionRef[];
  readonly privacyValue: string | null;
  readonly disclosure: DisclosureFlags | null;
}

export const EMPTY_VARIANT_SETTINGS: VariantSettings = {
  destination: null,
  mentions: [],
  privacyValue: null,
  disclosure: null,
};

/** How the composer treats every URL it finds. */
export type LinkMode = 'original' | 'tracked';

export interface LinkPlan {
  readonly mode: LinkMode;
  /** Null means the Post Array default short domain. */
  readonly brandedDomain: string | null;
  readonly utm: NonNullable<LinkSpec['utm']>;
}

export interface BrandedDomain {
  readonly domain: string;
  readonly verified: boolean;
}

/** What one save round did, target by target. */
export interface ComposerSaveOutcome {
  /** The real content item id, created on the way if it did not exist. */
  readonly contentItemId: string;
  /** The server's `updatedAt` after this write. The draft mirror keys on it. */
  readonly savedAt: string;
  /** Targets whose variant reached the server. These go clean. */
  readonly savedConnectionIds: readonly string[];
  /** Targets whose variant write was rejected. These stay dirty and retry. */
  readonly failedConnectionIds: readonly string[];
}

export type AutosaveState = 'idle' | 'saving' | 'saved' | 'offline' | 'conflict' | 'failed';

/**
 * The id a master carries before its server row exists.
 *
 * `/compose` no longer creates a draft on every visit, so the composer can be
 * open and editable with nothing persisted yet. This sentinel is never sent to
 * the API: everything that needs a real id awaits `ensureDraftId()` on the
 * gateway, which creates the row exactly once.
 */
export const UNSAVED_DRAFT_ID = '';

/** True while this draft has no server row yet. */
export function isUnsavedDraft(master: Pick<MasterDraft, 'id'>): boolean {
  return master.id === UNSAVED_DRAFT_ID;
}

export interface ConflictInfo {
  readonly editorName: string;
  readonly theirBody: string;
  readonly changedAt: string;
}

/**
 * The whole editable draft. One reducer owns it, which is what makes the
 * override isolation guarantee structural rather than a convention.
 */
export interface ComposerState {
  readonly master: MasterDraft;
  readonly selectedConnectionIds: readonly string[];
  readonly overrides: Readonly<Record<string, VariantOverrides>>;
  readonly settings: Readonly<Record<string, VariantSettings>>;
  /** `null` means the master draft is open in the centre pane. */
  readonly activeConnectionId: string | null;
  readonly linkPlan: LinkPlan;
  readonly appliedSetId: string | null;
  /** True once this content version has been approved. Editing clears it. */
  readonly approvalPinned: boolean;
  /**
   * Targets whose variant differs from what the server last accepted.
   *
   * Autosave writes only these, so editing one caption in a six-target draft
   * costs one variant request rather than six. A write that fails puts its
   * target back in the list, which is what makes the retry happen on the next
   * edit instead of never.
   */
  readonly dirtyConnectionIds: readonly string[];
  readonly revision: number;
}

/** What the composer needs from the server before it can render. */
export interface ComposerBootstrap {
  readonly master: MasterDraft;
  readonly accounts: readonly TargetAccount[];
  readonly sets: readonly TargetSet[];
  readonly signatures: readonly SignatureOption[];
  readonly brandedDomains: readonly BrandedDomain[];
  readonly selectedConnectionIds: readonly string[];
  readonly overrides: Readonly<Record<string, VariantOverrides>>;
  readonly settings: Readonly<Record<string, VariantSettings>>;
  readonly approvalPinned: boolean;
  readonly approverName: string | null;
  readonly approvalPolicy: string | null;
  readonly workspaceTimeZone: string;
}
