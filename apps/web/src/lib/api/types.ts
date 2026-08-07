/**
 * View models the web app consumes.
 *
 * The web app never sees a provider payload. It sees these normalized shapes,
 * which are assembled by the API from `@relay/contracts` domain types. Where a
 * contract type already exists it is re-exported rather than restated, so a
 * change there is a compile error here.
 *
 * TODO(web): when `@relay/application` publishes its query DTOs, replace the
 * hand-written view models below with those exports. The field names here are
 * the ones the REST surface documents today.
 */

import type {
  AccountType,
  Assumption,
  ApprovalState,
  ContentKind,
  ErrorCode,
  Fact,
  MediaKind,
  MetricObservation,
  ValidationIssue,
  ValidationResult,
  ValidationSeverity,
  CapabilitySnapshot,
  CapabilitySupport,
  CreationSurface,
  ErrorClass,
  IsoInstant,
  MetricAvailability,
  Money,
  Paginated,
  ProviderId,
  PublicationReceipt,
  PublishJob,
  PublishState,
  Role,
  SubscriptionStatus,
} from '@relay/contracts';

export type {
  AccountType,
  ApprovalState,
  ContentKind,
  ErrorCode,
  MediaKind,
  MetricObservation,
  ValidationIssue,
  ValidationResult,
  ValidationSeverity,
  CapabilitySnapshot,
  CapabilitySupport,
  CreationSurface,
  ErrorClass,
  IsoInstant,
  MetricAvailability,
  Money,
  Paginated,
  ProviderId,
  PublicationReceipt,
  PublishJob,
  PublishState,
  Role,
  SubscriptionStatus,
};

/* -------------------------------------------------------------------------
   Session and workspace
   ------------------------------------------------------------------------- */

export interface UserView {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  /** Sign-in alias. Null when the account has none. */
  readonly username: string | null;
  readonly avatarUrl: string | null;
  readonly locale: string;
  readonly timeZone: string;
}

export interface WorkspaceView {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly timeZone: string;
  readonly locale: string;
  readonly role: Role;
  readonly readOnly: boolean;
}

export interface BrandView {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly connectionIds: readonly string[];
}

export interface SessionView {
  readonly user: UserView;
  readonly workspace: WorkspaceView;
  readonly workspaces: readonly WorkspaceView[];
  readonly brands: readonly BrandView[];
  /** Scopes the current credential carries. Used for 403 remediation copy. */
  readonly scopes: readonly string[];
  readonly onboardingComplete: boolean;
}

/* -------------------------------------------------------------------------
   Connections
   ------------------------------------------------------------------------- */

export type ConnectionHealth =
  | 'healthy'
  | 'expiring_soon'
  | 'expired'
  | 'revoked'
  | 'paused'
  | 'permission_missing'
  | 'review_pending'
  | 'unknown';

export interface ConnectionView {
  readonly id: string;
  readonly workspaceId: string;
  readonly provider: ProviderId;
  readonly accountType: AccountType;
  /** The handle or page name a person recognises. Never an internal id. */
  readonly displayName: string;
  readonly handle: string | null;
  readonly avatarUrl: string | null;
  readonly health: ConnectionHealth;
  readonly connectedAt: IsoInstant;
  readonly connectedByName: string | null;
  /** Null when the provider does not tell us when access ends. */
  readonly expiresAt: IsoInstant | null;
  readonly lastPublishedAt: IsoInstant | null;
  readonly lastAnalyticsSyncAt: IsoInstant | null;
  readonly capabilitySnapshotVersion: string | null;
}

export interface ConnectionDestination {
  readonly id: string;
  readonly connectionId: string;
  readonly kind: string;
  readonly externalId: string;
  readonly name: string;
}

export interface MentionResult {
  readonly externalId: string;
  readonly handle: string;
  readonly displayName: string;
  readonly avatarUrl: string | null;
}

/* -------------------------------------------------------------------------
   Content, scheduling, publishing
   ------------------------------------------------------------------------- */

export interface ContentTargetView {
  readonly variantId: string;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly accountLabel: string;
  readonly inherits: boolean;
  readonly state: PublishState;
  readonly characterCount: number;
  readonly characterLimit: number | null;
  readonly issueCount: number;
  readonly blockingIssueCount: number;
}

export interface ContentItemView {
  readonly id: string;
  readonly workspaceId: string;
  readonly brandId: string | null;
  readonly title: string;
  readonly state: PublishState;
  readonly approvalState: ApprovalState;
  readonly createdSurface: CreationSurface;
  readonly createdByName: string;
  readonly createdAt: IsoInstant;
  readonly updatedAt: IsoInstant;
  readonly scheduledAt: IsoInstant | null;
  readonly scheduledTimeZone: string | null;
  readonly targets: readonly ContentTargetView[];
}

export interface CalendarEntryView {
  readonly publishJobId: string | null;
  readonly contentItemId: string;
  readonly title: string;
  readonly scheduledAt: IsoInstant;
  readonly timeZone: string;
  readonly state: PublishState;
  readonly approvalState: ApprovalState;
  readonly provider: ProviderId;
  readonly accountLabel: string;
  readonly targetCount: number;
  readonly mediaKind: 'text' | 'image' | 'carousel' | 'video' | 'document';
}

export interface ApprovalRequestView {
  readonly id: string;
  readonly contentItemId: string;
  readonly title: string;
  readonly requestedByName: string;
  readonly requestedAt: IsoInstant;
  readonly dueAt: IsoInstant | null;
  readonly state: ApprovalState;
  readonly accountLabel: string;
}

export interface ReceiptSummaryView {
  readonly receiptId: string;
  readonly contentItemId: string;
  readonly title: string;
  readonly provider: ProviderId;
  readonly accountLabel: string;
  readonly state: PublishState;
  readonly publishedAt: IsoInstant | null;
  readonly permalink: string | null;
  readonly failedItemCount: number;
}

/* -------------------------------------------------------------------------
   Action center
   ------------------------------------------------------------------------- */

/** Exactly the eleven queue types from the product behaviour research. */
export type ActionItemKind =
  | 'connection_expiring'
  | 'connection_action_required'
  | 'validation_failed'
  | 'approval_overdue'
  | 'schedule_conflict'
  | 'provider_incident'
  | 'comment_failed'
  | 'analytics_stale'
  | 'rss_stalled'
  | 'webhook_failing'
  | 'usage_balance';

export type ActionItemUrgency = 'now' | 'soon' | 'watching';

export type ActionItemCategory = 'connections' | 'publishing' | 'automation' | 'billing';

export interface ActionItemView {
  readonly id: string;
  readonly kind: ActionItemKind;
  readonly urgency: ActionItemUrgency;
  readonly category: ActionItemCategory;
  /** The named account, feed or endpoint this is about. Never blank. */
  readonly subject: string;
  readonly provider: ProviderId | null;
  readonly createdAt: IsoInstant;
  readonly dueAt: IsoInstant | null;
  readonly snoozedUntil: IsoInstant | null;
  /** Route the single remediation verb navigates to. */
  readonly href: string;
  /** ICU values the row's sentence needs, already sanitized. */
  readonly values: Readonly<Record<string, string | number>>;
}

/* -------------------------------------------------------------------------
   Analytics, billing, members, audit, health
   ------------------------------------------------------------------------- */

export interface MetricView {
  readonly name: string;
  readonly availability: MetricAvailability;
  readonly value: number | null;
  readonly unit: string;
  readonly providerFieldName: string | null;
  readonly observedAt: IsoInstant | null;
  /** Populated whenever availability is not `available`. */
  readonly unavailableReasonKey: string | null;
}

export interface BillingStateView {
  readonly status: SubscriptionStatus | 'none';
  readonly interval: 'monthly' | 'annual' | null;
  readonly trialEndsAt: IsoInstant | null;
  readonly firstChargeAt: IsoInstant | null;
  readonly firstChargeAmount: Money | null;
  readonly renewalAmount: Money | null;
  readonly portalUrl: string | null;
  readonly activeChannelCount: number;
  readonly channelLimit: number;
}

export interface UsageView {
  readonly periodStart: IsoInstant;
  readonly total: Money;
  readonly lines: readonly {
    readonly provider: ProviderId | null;
    readonly operation: string;
    readonly count: number;
    readonly unitAmount: Money;
    readonly amount: Money;
  }[];
}

export interface MemberView {
  readonly id: string;
  readonly userId: string | null;
  readonly name: string;
  readonly email: string;
  readonly role: Role;
  readonly invitePending: boolean;
  readonly brandScope: readonly string[];
  readonly invitedAt: IsoInstant | null;
}

export interface AuditEventView {
  readonly id: string;
  readonly at: IsoInstant;
  readonly actorName: string;
  readonly surface: CreationSurface;
  readonly action: string;
  readonly subject: string;
}

export interface ConnectorHealthView {
  readonly provider: ProviderId;
  readonly state: 'operational' | 'degraded' | 'unavailable';
  readonly since: IsoInstant | null;
}

export interface HealthView {
  readonly api: 'operational' | 'degraded' | 'unavailable';
  readonly connectors: readonly ConnectorHealthView[];
  readonly checkedAt: IsoInstant;
}

/* -------------------------------------------------------------------------
   Growth advisor entry point (Home only needs the summary)
   ------------------------------------------------------------------------- */

export interface GrowthPlanSummaryView {
  readonly planId: string | null;
  readonly version: number | null;
  readonly approvedAt: IsoInstant | null;
  readonly currentWeek: number | null;
  readonly totalWeeks: number | null;
  readonly undraftedBriefCount: number | null;
  readonly profileComplete: boolean;
}

export interface BusinessProfileView {
  readonly id: string;
  readonly workspaceId: string;
  readonly brandId: string;
  readonly revision: number;
  readonly productName: string;
  readonly siteUrl: string;
  readonly description: string;
  readonly category: string;
  readonly markets: readonly string[];
  readonly contentLocales: readonly string[];
  readonly idealCustomer: string;
  readonly objective: string;
  readonly conversionEvent: string;
  readonly existingChannels: readonly ProviderId[];
  readonly proofAssets: readonly string[];
  readonly competitors: readonly string[];
  readonly weeklyCapacityHours: number | null;
  readonly prohibitedClaims: readonly string[];
  readonly prohibitedTopics: readonly string[];
  readonly facts: readonly Fact[];
  readonly assumptions: readonly Assumption[];
  readonly completenessScore: number;
  readonly confirmedAt: IsoInstant | null;
  readonly createdAt: IsoInstant;
  readonly missingFieldKeys: readonly string[];
}

/* -------------------------------------------------------------------------
   Onboarding
   ------------------------------------------------------------------------- */

export type OnboardingUseCase = 'creator' | 'team' | 'agency' | 'developer';

export interface OnboardingStateView {
  readonly checkoutConfirmed: boolean;
  readonly workspaceNamed: boolean;
  readonly useCase: OnboardingUseCase | null;
  readonly connectionCount: number;
  readonly firstPostScheduled: boolean;
  readonly firstReceiptId: string | null;
}
