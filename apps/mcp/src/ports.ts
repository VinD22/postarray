import type {
  AccountType,
  ApprovalState,
  CapabilitySnapshot,
  ContentKind,
  GrowthPlan,
  MetricAvailability,
  MetricScope,
  MetricUnit,
  NormalizedMetricName,
  OpportunityRecord,
  PageInfo,
  ProviderId,
  PublishState,
  Scope,
  ValidationResult,
} from '@relay/contracts';

/**
 * The slice of the application layer this server uses.
 *
 * `packages/application` owns the real `Services` interface. This file declares
 * the exact subset the MCP tools call, with return types that are subsets of
 * the application's view models. `wiring.ts` adapts one to the other in a
 * single pass-through, so:
 *
 *  - the tools are testable with small fakes rather than a whole service graph,
 *  - a view model that gains a field cannot break this server, and one that
 *    loses a field we depend on fails to compile in one obvious place.
 *
 * Nothing here re-implements a rule. Every method delegates, and the approval
 * policy, tenancy and idempotency are enforced on the other side of it.
 */

export interface ActorContextLike {
  readonly actorType: 'user' | 'service_account' | 'oauth_app' | 'system';
  readonly actorId: string;
  readonly workspaceId: string;
  readonly scopes: readonly Scope[];
  readonly surface: 'web' | 'api' | 'mcp' | 'cli' | 'rss' | 'automation_rule' | 'agent';
  readonly correlationId: string;
  readonly approvalLevel:
    | 'level_0_read'
    | 'level_1_draft'
    | 'level_2_scheduled'
    | 'level_3_confirm';
  readonly idempotencyKey?: string;
  readonly locale: string;
}

export interface PageLike<T> {
  readonly data: readonly T[];
  readonly pageInfo: PageInfo;
}

export interface ConnectionSummary {
  readonly id: string;
  readonly brandId: string | null;
  readonly provider: ProviderId;
  readonly accountType: AccountType;
  readonly displayName: string;
  readonly handle: string | null;
  readonly health: string;
  /** An i18n key explaining what the user must do. Never provider prose. */
  readonly statusMessageKey: string | null;
  readonly capabilityVersion: string | null;
}

export interface VariantSummary {
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly accountType: AccountType;
}

export interface ContentItemSummary {
  readonly id: string;
  readonly brandId: string;
  readonly state: PublishState;
  readonly approvalState: ApprovalState;
  readonly title: string | null;
  readonly locale: string;
  readonly contentKind: ContentKind;
  readonly reapprovalRequired: boolean;
  readonly variants: readonly VariantSummary[];
  readonly updatedAt: string;
}

export interface PublishJobSummary {
  readonly id: string;
  readonly contentItemId: string;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly state: PublishState;
  readonly scheduledInstant: string;
  readonly ianaTimeZone: string;
  readonly approvalRequired: boolean;
  readonly approvalState: ApprovalState;
  readonly attemptCount: number;
  readonly lastErrorCode: string | null;
}

export interface CalendarEntrySummary {
  readonly jobId: string | null;
  readonly contentItemId: string;
  readonly connectionId: string | null;
  readonly provider: ProviderId | null;
  readonly state: PublishState;
  readonly instant: string;
  readonly ianaTimeZone: string;
  readonly title: string | null;
  readonly approvalRequired: boolean;
}

export interface PreviewSummary {
  readonly contentItemId: string;
  readonly targetId: string;
  readonly provider: ProviderId;
  readonly displayName: string;
  readonly handle: string | null;
  readonly body: string;
  readonly contentKind: ContentKind;
  readonly characterCount: number;
  readonly characterLimit: number | null;
  readonly truncated: boolean;
  readonly media: readonly { readonly id: string }[];
  readonly threadItems: readonly { readonly order: number }[];
}

export interface ApprovalRequestSummary {
  readonly id: string;
  readonly contentItemId: string;
  readonly state: ApprovalState;
  readonly assignedUserIds: readonly string[];
  readonly createdAt: string;
}

export interface ReceiptSummary {
  readonly id: string;
  readonly externalPostId: string;
  readonly permalink: string | null;
  readonly publishedAt: string;
}

export interface MetricObservationSummary {
  readonly normalizedName: NormalizedMetricName;
  readonly provider: ProviderId;
  readonly providerField: string;
  /** The provider's own wording. A number without its meaning is not a metric. */
  readonly providerDefinition: string;
  readonly scope: MetricScope;
  readonly value: number | null;
  readonly unit: MetricUnit;
  readonly availability: MetricAvailability;
  readonly observedAt: string;
  readonly freshnessSeconds: number;
  /** True when the provider forbids deriving or combining this number. */
  readonly derivationRestricted: boolean;
}

export interface OperationRefLike {
  readonly operationId: string;
  readonly status: string;
  readonly resourceType: string | null;
  readonly resourceId: string | null;
}

export interface TargetSpecLike {
  readonly connectionId: string;
}

export interface CreateDraftInputLike {
  /** Required. A draft always belongs to a brand, never to a workspace at large. */
  readonly brandId: string;
  readonly body: string;
  readonly title?: string | null;
  readonly locale?: string;
  readonly contentKind?: ContentKind;
  readonly campaignId?: string | null;
  readonly mediaIds?: readonly string[];
  readonly targets?: readonly TargetSpecLike[];
}

export interface ScheduleSpecLike {
  readonly instant: string;
  readonly ianaTimeZone: string;
  readonly repeat: null;
}

export interface RelayServicePort {
  readonly connections: {
    list(
      ctx: ActorContextLike,
      input?: {
        readonly cursor?: string;
        readonly limit?: number;
        readonly brandId?: string;
        readonly provider?: ProviderId;
      },
    ): Promise<PageLike<ConnectionSummary>>;
    getCapabilities(ctx: ActorContextLike, connectionId: string): Promise<CapabilitySnapshot>;
  };

  readonly content: {
    createDraft(ctx: ActorContextLike, input: CreateDraftInputLike): Promise<ContentItemSummary>;
    get(ctx: ActorContextLike, contentItemId: string): Promise<ContentItemSummary>;
    preview(
      ctx: ActorContextLike,
      input: { readonly contentItemId: string; readonly targetId: string },
    ): Promise<PreviewSummary>;
  };

  readonly validation: {
    validate(
      ctx: ActorContextLike,
      input: { readonly contentItemId: string },
    ): Promise<ValidationResult>;
  };

  readonly approvals: {
    request(
      ctx: ActorContextLike,
      input: {
        readonly contentItemId: string;
        readonly approverIds?: readonly string[];
        readonly note?: string;
      },
    ): Promise<ApprovalRequestSummary>;
  };

  readonly scheduling: {
    schedule(
      ctx: ActorContextLike,
      input: { readonly contentItemId: string; readonly scheduleSpec: ScheduleSpecLike },
    ): Promise<PublishJobSummary>;
    cancel(
      ctx: ActorContextLike,
      input: { readonly jobId: string; readonly reason: string },
    ): Promise<PublishJobSummary>;
    getCalendar(
      ctx: ActorContextLike,
      input: {
        readonly from: string;
        readonly to: string;
        readonly cursor?: string;
        readonly limit?: number;
        readonly filters?: { readonly brandId?: string };
      },
    ): Promise<PageLike<CalendarEntrySummary>>;
  };

  readonly publishing: {
    /**
     * `confirmation` is a boolean on the application boundary. This server only
     * ever passes `true` after consuming a server-minted, single-use, human
     * approved confirmation. See `confirmations.ts`.
     */
    publishNow(
      ctx: ActorContextLike,
      input: { readonly contentItemId: string; readonly confirmation: boolean },
    ): Promise<PublishJobSummary>;
    getJob(ctx: ActorContextLike, jobId: string): Promise<PublishJobSummary>;
  };

  readonly receipts: {
    listForJob(ctx: ActorContextLike, jobId: string): Promise<readonly ReceiptSummary[]>;
  };

  readonly analytics: {
    getPostMetrics(
      ctx: ActorContextLike,
      input: { readonly receiptId: string },
    ): Promise<readonly MetricObservationSummary[]>;
    getAccountMetrics(
      ctx: ActorContextLike,
      input: {
        readonly connectionId: string;
        readonly range: { readonly from: string; readonly to: string };
      },
    ): Promise<readonly MetricObservationSummary[]>;
  };

  readonly growth: {
    getPlan(ctx: ActorContextLike, planId: string): Promise<GrowthPlan>;
    generatePlan(
      ctx: ActorContextLike,
      input: { readonly profileId: string },
    ): Promise<OperationRefLike>;
    createDraftFromItem(
      ctx: ActorContextLike,
      input: { readonly planId: string; readonly itemId: string },
    ): Promise<ContentItemSummary>;
    listOpportunities(
      ctx: ActorContextLike,
      input?: {
        readonly category?: string;
        readonly region?: string;
        readonly verifiedAfter?: string;
      },
    ): Promise<readonly OpportunityRecord[]>;
  };
}

/**
 * Where tool-call audit rows go.
 *
 * Kept separate from `RelayServicePort` because it is not a use case: it is the
 * record that a use case was attempted. The composition root wires it to the
 * workspace audit writer; tests and the sandbox collect in memory.
 */
export interface AuditSink {
  record(input: AuditRecordInput): Promise<void>;
}

/**
 * The evidence that a person agreed to an immediate publication.
 *
 * Server-minted, single use, expiring, and bound to the exact content and
 * targets. It is not a boolean the agent host set: "the user clicked approve in
 * their agent" is not a fact this server can observe, so it is not one it acts
 * on. The boolean the application sees is only ever set after this has been
 * consumed.
 */
export interface PublishConfirmation {
  readonly confirmationId: string;
  readonly confirmedBy: string;
  readonly confirmedAt: string;
  readonly surface: 'mcp';
}

export interface AuditRecordInput {
  readonly workspaceId: string;
  readonly actorType: string;
  readonly actorId: string;
  readonly action: string;
  readonly correlationId: string;
  readonly outcome: 'allowed' | 'denied' | 'failed';
  readonly targetType: string | null;
  readonly targetId: string | null;
  readonly metadata: Readonly<Record<string, unknown>>;
}
