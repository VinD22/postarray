/**
 * The composer's own view models.
 *
 * The domain shapes (master draft, variant overrides, capability snapshot,
 * validation issue) come from `@relay/contracts` and are used unchanged. What
 * this file adds is the screen's vocabulary: a target account with its live
 * counters, the rail state, the Sets, the assist actions and the link plan.
 */

import type {
  CapabilitySnapshot,
  DestinationRef,
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
  readonly brandId: string | null;
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
  readonly brandId: string | null;
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
  | 'inherits'
  | 'override'
  | 'issue'
  | 'blocked'
  | 'needs_approval'
  | 'not_built'
  | 'unsupported';

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

/** Per-target settings that are not part of `VariantOverrides`. */
export interface VariantSettings {
  readonly destination: DestinationRef | null;
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
  /** Null means the Relay default short domain. */
  readonly brandedDomain: string | null;
  readonly utm: NonNullable<LinkSpec['utm']>;
}

export interface BrandedDomain {
  readonly domain: string;
  readonly verified: boolean;
}

export type AutosaveState = 'idle' | 'saving' | 'saved' | 'offline' | 'conflict' | 'failed';

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
  readonly revision: number;
}

/** The verbs the assistant offers. There is no image or video action here. */
export type AssistAction =
  | 'make_concise'
  | 'adapt_for_platform'
  | 'transcreate'
  | 'check_claims'
  | 'write_alt_text';

export interface AssistProposal {
  readonly action: AssistAction;
  /** `null` means the proposal applies to the master draft. */
  readonly connectionId: string | null;
  readonly before: string;
  readonly after: string;
  readonly evidence: readonly AssistEvidence[];
}

export interface AssistEvidence {
  readonly id: string;
  readonly claim: string;
  readonly sourceUrl: string | null;
  readonly verified: boolean;
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
  /** False when no AI gateway is configured. The assist menu says so plainly. */
  readonly assistConfigured: boolean;
  readonly workspaceTimeZone: string;
}
