import type {
  ProviderId,
  RuleActionKind,
  RuleConditionKind,
  RuleTriggerKind,
} from '@relay/contracts';

/**
 * Automation rules as the editor sees them.
 *
 * A rule is one sentence: when a trigger fires, if some conditions hold, then
 * some actions run, after a delay, until an end condition. Everything below is
 * that sentence in data, and `rule-serialization.ts` converts it to and from the
 * exact JSON the REST API, the CLI and the MCP server exchange.
 */

export type RuleState = 'draft' | 'testing' | 'active' | 'paused' | 'stopped';

/** A parameter a trigger, condition or action needs before it can be saved. */
export type ParameterValue = string | number | boolean | readonly string[] | null;

export interface RuleTriggerDraft {
  readonly kind: RuleTriggerKind;
  readonly parameters: Readonly<Record<string, ParameterValue>>;
  /**
   * Present only on `analytics_threshold`. Required there: a rule that reacts
   * to a number without a window, an expiry, a cooldown and a cap is a rule
   * that can act an unbounded number of times on data it cannot verify.
   */
  readonly measurement?: MeasurementSettings | undefined;
}

export interface MeasurementSettings {
  readonly metric: string;
  readonly threshold: number;
  /** Seconds after the source post published during which the metric is watched. */
  readonly windowSeconds: number;
  /** Seconds after which the rule stops watching a source post entirely. */
  readonly expirySeconds: number;
  /** Shortest gap between two executions for the same source post. */
  readonly cooldownSeconds: number;
  readonly maxExecutionsPerPost: number;
  /** A reading older than this is treated as stale and the rule does not run. */
  readonly staleAfterSeconds: number;
}

export interface RuleConditionDraft {
  readonly id: string;
  readonly kind: RuleConditionKind;
  readonly parameters: Readonly<Record<string, ParameterValue>>;
}

export interface RuleActionDraft {
  readonly id: string;
  readonly kind: RuleActionKind;
  readonly parameters: Readonly<Record<string, ParameterValue>>;
}

export type RuleEnd =
  { readonly kind: 'manual' } | { readonly kind: 'count'; readonly runs: number };

export interface CrossAccountSettings {
  readonly enabled: boolean;
  readonly sourceConnectionId: string | null;
  readonly followUpConnectionId: string | null;
  /** The user's explicit statement that both accounts are theirs to act on. */
  readonly preauthorized: boolean;
}

export interface RuleDraft {
  readonly id: string | null;
  readonly name: string;
  readonly state: RuleState;
  readonly trigger: RuleTriggerDraft | null;
  readonly conditions: readonly RuleConditionDraft[];
  readonly actions: readonly RuleActionDraft[];
  readonly delaySeconds: number;
  readonly end: RuleEnd;
  /** Accounts the rule may act on. A rule can never reach outside this list. */
  readonly connectionIds: readonly string[];
  readonly crossAccount: CrossAccountSettings;
}

/** What the rule can do at most, computed by the server before activation. */
export interface RulePreflight {
  readonly accounts: readonly {
    readonly connectionId: string;
    readonly provider: ProviderId;
    readonly displayName: string;
  }[];
  readonly maxExternalActionsPerRun: number;
  readonly cadenceImpactPerDay: number;
  readonly requiresApproval: boolean;
  readonly requiredApprovalLevel: string;
  readonly providerRestrictionKeys: readonly string[];
  readonly estimatedCostMinor: number | null;
  readonly costCurrency: string | null;
  readonly duplicateRiskKey: string | null;
  /** Anything that must be resolved before the rule can be turned on. */
  readonly blockers: readonly string[];
}

export interface RuleRunPreview {
  readonly triggeredAt: string;
  readonly outcome: RuleRunOutcome;
  readonly externalActionCount: number;
  readonly skippedReason: string | null;
  readonly errorCode: string | null;
}

export type RuleRunOutcome = 'pending' | 'running' | 'completed' | 'skipped' | 'failed' | 'test';

export interface RuleRunView {
  readonly id: string;
  readonly startedAt: string;
  readonly outcome: RuleRunOutcome;
  readonly externalActionCount: number;
  readonly skippedReason: string | null;
  readonly errorCode: string | null;
}

export interface RuleVersionView {
  readonly version: number;
  readonly savedAt: string;
  readonly savedByName: string;
  readonly isCurrent: boolean;
  /** The serialized rule at that version, for the comparison view. */
  readonly json: string;
}

export interface RuleSummaryView {
  readonly id: string;
  readonly name: string;
  readonly state: RuleState;
  readonly draft: RuleDraft;
  readonly connectionCount: number;
  readonly lastRunAt: string | null;
}
