import type {
  AccountType,
  ApprovalLevel,
  ApprovalState,
  ContentKind,
  CreationSurface,
  DisclosureFlags,
  LinkSpec,
  MediaKind,
  MentionRef,
  MetricAvailability,
  MetricScope,
  MetricUnit,
  NormalizedMetricName,
  ProviderId,
  PublishState,
  Role,
  RuleActionKind,
  RuleTriggerKind,
  ScheduleSpec,
  Scope,
  SignatureRef,
  ThreadItem,
  ValidationIssue,
  VariantOverrides,
  WebhookEventName,
} from '@relay/contracts';

/**
 * View models.
 *
 * These are the only shapes that leave the application layer. They never carry
 * a provider payload, an access token, an encryption key or a raw Prisma row,
 * and they never expose a column the UI has no business seeing. Identifiers are
 * the durable primary keys; the prefixed public identifier is a presentation
 * concern applied at the API edge.
 */

export interface WorkspaceView {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly status: string;
  readonly defaultLocale: string;
  readonly defaultTimeZone: string;
  readonly contentLocales: readonly string[];
  readonly markets: readonly string[];
  readonly weekStart: 0 | 1 | 6;
  readonly hourCycle: 'h12' | 'h23';
  readonly killSwitchEngaged: boolean;
  readonly createdAt: string;
}

export interface SessionWorkspaceView {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly timeZone: string;
  readonly locale: string;
  readonly role: Role;
  readonly readOnly: boolean;
}

export interface SessionBrandView {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly connectionIds: readonly string[];
}

/** The complete, sanitized browser bootstrap view for one authenticated user. */
export interface SessionView {
  readonly user: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly username: string | null;
    readonly avatarUrl: string | null;
    readonly locale: string;
    readonly timeZone: string;
  };
  readonly workspace: SessionWorkspaceView;
  readonly workspaces: readonly SessionWorkspaceView[];
  readonly brands: readonly SessionBrandView[];
  readonly scopes: readonly Scope[];
  readonly onboardingComplete: boolean;
}

export interface MembershipView {
  readonly id: string;
  readonly userId: string;
  readonly workspaceId: string;
  readonly email: string;
  readonly displayName: string;
  readonly role: Role;
  readonly state: 'invited' | 'active' | 'suspended' | 'removed';
  readonly brandScope: readonly string[];
  readonly invitedAt: string | null;
  readonly acceptedAt: string | null;
}

export interface InvitationView {
  readonly id: string;
  readonly workspaceId: string;
  readonly email: string;
  readonly role: Role;
  readonly state: 'pending' | 'accepted' | 'revoked' | 'expired';
  readonly expiresAt: string;
  readonly createdAt: string;
}

export interface BrandView {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly slug: string;
  readonly voice: string | null;
  readonly audience: string | null;
  readonly approvedClaims: readonly string[];
  readonly blockedTerms: readonly string[];
  readonly domains: readonly string[];
  readonly defaultTimeZone: string | null;
  readonly defaultShortLinkOn: boolean;
  readonly archived: boolean;
  readonly connectionIds: readonly string[];
}

export const CONNECTION_HEALTH = [
  'active',
  'action_required',
  'expired',
  'revoked',
  'paused',
  'disconnected',
] as const;
export type ConnectionHealth = (typeof CONNECTION_HEALTH)[number];

export interface ConnectionView {
  readonly id: string;
  readonly workspaceId: string;
  readonly brandId: string | null;
  readonly provider: ProviderId;
  readonly accountType: AccountType;
  readonly displayName: string;
  readonly handle: string | null;
  readonly avatarUrl: string | null;
  readonly profileUrl: string | null;
  readonly health: ConnectionHealth;
  /** i18n key explaining what the user must do. Never provider prose. */
  readonly statusMessageKey: string | null;
  readonly grantedScopes: readonly string[];
  readonly capabilityVersion: string | null;
  readonly capabilitiesRefreshedAt: string | null;
  readonly connectedAt: string;
  readonly connectedByUserId: string | null;
  readonly accessTokenExpiresAt: string | null;
  readonly lastPublishedAt: string | null;
  readonly lastAnalyticsSyncAt: string | null;
  readonly lastSuccessfulActionAt: string | null;
}

export interface ProviderDestinationView {
  readonly id: string;
  readonly connectionId: string;
  readonly kind: string;
  readonly externalId: string;
  readonly displayName: string;
  readonly permalink: string | null;
  readonly canPublish: boolean;
  readonly refreshedAt: string;
}

export interface MentionEntityView {
  readonly id: string;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly kind: string;
  readonly externalId: string;
  readonly handle: string | null;
  readonly displayLabel: string;
  readonly avatarUrl: string | null;
  readonly resolvedAt: string;
}

export interface PostVariantView {
  readonly id: string;
  readonly contentItemId: string;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly accountType: AccountType;
  readonly accountDisplayName: string;
  readonly accountHandle: string | null;
  readonly locale: string;
  readonly body: string;
  readonly contentKind: ContentKind;
  readonly mediaIds: readonly string[];
  readonly links: readonly LinkSpec[];
  readonly signature: SignatureRef | null;
  readonly threadItems: readonly ThreadItem[];
  readonly schedule: ScheduleSpec | null;
  readonly overrides: VariantOverrides;
  /** Fields that still follow the master, and fields the target has claimed. */
  readonly inheritedFields: readonly string[];
  readonly overriddenFields: readonly string[];
  readonly destination: { readonly id: string; readonly displayLabel: string } | null;
  readonly mentions: readonly MentionRef[];
  readonly privacyValue: string | null;
  readonly disclosure: DisclosureFlags | null;
  readonly capabilityVersion: string | null;
  readonly state: PublishState;
  readonly validationIssues: readonly ValidationIssue[];
  readonly estimatedCostMinor: number | null;
  readonly estimatedCostCurrency: string | null;
}

export interface ContentItemView {
  readonly id: string;
  readonly workspaceId: string;
  readonly brandId: string;
  readonly campaignId: string | null;
  readonly title: string | null;
  readonly state: PublishState;
  readonly approvalPolicy: string;
  readonly approvalState: ApprovalState;
  readonly locale: string;
  readonly contentKind: ContentKind;
  readonly body: string;
  readonly mediaIds: readonly string[];
  readonly links: readonly LinkSpec[];
  readonly signature: SignatureRef | null;
  readonly threadItems: readonly ThreadItem[];
  readonly schedule: ScheduleSpec | null;
  readonly disclosure: DisclosureFlags;
  readonly variants: readonly PostVariantView[];
  readonly currentVersionId: string | null;
  readonly approvedVersionId: string | null;
  readonly currentChecksum: string | null;
  readonly reapprovalRequired: boolean;
  readonly createdVia: CreationSurface;
  readonly createdByUserId: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ContentVersionView {
  readonly id: string;
  readonly contentItemId: string;
  readonly revision: number;
  readonly checksum: string;
  readonly locale: string;
  readonly createdAt: string;
  readonly createdBy: string | null;
}

export interface CanonicalPreview {
  readonly contentItemId: string;
  readonly targetId: string;
  readonly provider: ProviderId;
  readonly accountType: AccountType;
  readonly displayName: string;
  readonly handle: string | null;
  readonly avatarUrl: string | null;
  readonly body: string;
  readonly contentKind: ContentKind;
  readonly media: readonly {
    readonly id: string;
    readonly kind: MediaKind;
    readonly altText: string | null;
    readonly width: number | null;
    readonly height: number | null;
    readonly durationMs: number | null;
  }[];
  readonly links: readonly LinkSpec[];
  readonly threadItems: readonly ThreadItem[];
  readonly destination: { readonly id: string; readonly displayLabel: string } | null;
  readonly privacyValue: string | null;
  readonly disclosure: DisclosureFlags | null;
  readonly characterCount: number;
  readonly characterLimit: number | null;
  readonly truncated: boolean;
  readonly issues: readonly ValidationIssue[];
}

export interface ApprovalRequestView {
  readonly id: string;
  readonly contentItemId: string;
  readonly contentVersionId: string;
  readonly policy: string;
  readonly state: ApprovalState;
  readonly requestedBy: string | null;
  readonly assignedUserIds: readonly string[];
  readonly note: string | null;
  readonly dueAt: string | null;
  readonly resolvedAt: string | null;
  readonly decisions: readonly ApprovalDecisionView[];
  readonly createdAt: string;
}

export interface ApprovalDecisionView {
  readonly id: string;
  readonly decision: 'approve' | 'request_changes' | 'reject';
  readonly decidedByUserId: string;
  readonly comment: string | null;
  readonly reviewedChecksum: string;
  readonly createdAt: string;
}

export interface PublishJobView {
  readonly id: string;
  readonly workspaceId: string;
  readonly contentItemId: string;
  readonly contentVersionId: string;
  readonly postVariantId: string | null;
  readonly connectionId: string;
  readonly provider: ProviderId;
  readonly state: PublishState;
  readonly scheduledInstant: string;
  readonly ianaTimeZone: string;
  readonly idempotencyKey: string;
  readonly workflowId: string | null;
  readonly approvalRequired: boolean;
  readonly approvalState: ApprovalState;
  readonly attemptCount: number;
  readonly lastErrorCode: string | null;
  readonly createdVia: CreationSurface;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly canceledAt: string | null;
}

export interface CalendarEntry {
  readonly jobId: string | null;
  readonly contentItemId: string;
  readonly title: string | null;
  readonly brandId: string;
  readonly campaignId: string | null;
  readonly connectionId: string | null;
  readonly provider: ProviderId | null;
  readonly accountLabel: string | null;
  readonly contentKind: ContentKind;
  readonly state: PublishState;
  readonly instant: string;
  readonly ianaTimeZone: string;
  readonly approvalRequired: boolean;
  readonly approvalState: ApprovalState;
}

export interface ReceiptItemView {
  readonly kind: 'root' | 'comment' | 'thread';
  readonly order: number;
  readonly state: PublishState;
  readonly externalPostId: string | null;
  readonly permalink: string | null;
  readonly publishedAt: string | null;
  readonly errorCode: string | null;
}

export interface PublishAttemptView {
  readonly id: string;
  readonly attemptNumber: number;
  readonly outcome: string;
  readonly errorClass: string | null;
  readonly errorCode: string | null;
  readonly httpStatus: number | null;
  readonly startedAt: string;
  readonly endedAt: string | null;
}

export interface PublicationReceiptView {
  readonly id: string;
  readonly workspaceId: string;
  readonly publishJobId: string;
  readonly provider: ProviderId;
  readonly connectionId: string;
  readonly externalPostId: string;
  readonly permalink: string | null;
  readonly contentVersionId: string;
  readonly contentChecksum: string;
  readonly publishedShortLinks: readonly string[];
  readonly scheduledInstant: string | null;
  readonly ianaTimeZone: string | null;
  readonly dispatchedAt: string | null;
  readonly publishedAt: string;
  readonly creationSurface: CreationSurface;
  readonly approvedByUserId: string | null;
  readonly costActualMinor: number | null;
  readonly costCurrency: string | null;
  readonly items: readonly ReceiptItemView[];
  readonly attempts: readonly PublishAttemptView[];
  readonly lastAnalyticsSyncAt: string | null;
  readonly deletedExternallyAt: string | null;
  readonly createdAt: string;
}

/** Compact receipt projection for the home screen and receipt timeline. */
export interface ReceiptSummaryView {
  readonly receiptId: string;
  readonly contentItemId: string;
  readonly title: string | null;
  readonly provider: ProviderId;
  readonly accountLabel: string;
  readonly state: PublishState;
  readonly publishedAt: string;
  readonly permalink: string | null;
  readonly failedItemCount: number;
}

export interface MediaAssetView {
  readonly id: string;
  readonly workspaceId: string;
  readonly brandId: string | null;
  readonly kind: MediaKind;
  readonly mimeType: string;
  readonly byteSize: number;
  readonly checksumSha256: string;
  readonly width: number | null;
  readonly height: number | null;
  readonly durationMs: number | null;
  /** Original client filename. Null for legacy/imported assets that did not record one. */
  readonly fileName: string | null;
  readonly altText: string | null;
  readonly altTextWaived: boolean;
  readonly altTextWaivedReason: string | null;
  readonly altTextWaivedByName: string | null;
  readonly rights:
    'owned_original' | 'licensed' | 'public_domain' | 'user_generated_with_consent' | 'unverified';
  readonly rightsDeclaration: {
    readonly owner: 'workspace' | 'licensed' | 'ugc';
    readonly licenseReference: string | null;
    readonly peopleAppear: boolean;
    readonly peopleConsented: boolean;
    readonly containsMusic: boolean;
    readonly declaredByName: string | null;
    readonly declaredAt: string;
  } | null;
  readonly scanState: string;
  readonly originKind: string;
  readonly originUrl: string | null;
  readonly retentionExpiresAt: string;
  readonly storageAvailable: boolean;
  readonly createdAt: string;
}

export interface MetricObservationView {
  readonly normalizedName: NormalizedMetricName;
  readonly provider: ProviderId;
  readonly providerField: string;
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

export interface ComparisonRow {
  readonly normalizedName: NormalizedMetricName;
  readonly unit: MetricUnit;
  readonly subject: number | null;
  readonly baseline: number | null;
  readonly deltaPercent: number | null;
  readonly availability: MetricAvailability;
  readonly comparable: boolean;
  readonly caveatKeys: readonly string[];
}

export interface ComparisonReport {
  readonly subjectLabel: string;
  readonly baselineLabel: string;
  readonly sampleSize: number;
  readonly rows: readonly ComparisonRow[];
  readonly caveatKeys: readonly string[];
}

export interface ExperimentView {
  readonly id: string;
  readonly name: string;
  readonly hypothesis: string;
  readonly successMetric: string;
  readonly state: string;
  readonly windowStart: string;
  readonly windowEnd: string;
  readonly caveats: string | null;
  readonly conclusion: string | null;
}

export interface ShortLinkView {
  readonly id: string;
  readonly workspaceId: string;
  readonly slug: string;
  readonly domain: string | null;
  readonly shortUrl: string;
  readonly destinationUrl: string;
  readonly campaignId: string | null;
  readonly state: 'active' | 'disabled' | 'expired' | 'blocked';
  readonly expiresAt: string | null;
  readonly createdAt: string;
}

export interface ShortLinkStats {
  readonly linkId: string;
  readonly totalClicks: number;
  readonly humanClicks: number;
  readonly suspectedBotClicks: number;
  readonly series: readonly { readonly bucketStart: string; readonly clicks: number }[];
  readonly topCountries: readonly { readonly countryCode: string; readonly clicks: number }[];
  readonly topReferrerClasses: readonly {
    readonly referrerClass: string;
    readonly clicks: number;
  }[];
  /** First-party redirect measurement, never a provider link-click number. */
  readonly sourceKey: 'analytics.source.first_party_redirect';
}

export interface AutomationRuleView {
  readonly id: string;
  readonly workspaceId: string;
  readonly brandId: string;
  readonly name: string;
  readonly state: 'draft' | 'active' | 'paused' | 'disabled' | 'archived';
  readonly trigger: { readonly kind: RuleTriggerKind; readonly config: Record<string, unknown> };
  readonly conditions: readonly {
    readonly kind: string;
    readonly config: Record<string, unknown>;
  }[];
  readonly actions: readonly {
    readonly kind: RuleActionKind;
    readonly config: Record<string, unknown>;
  }[];
  readonly delaySeconds: number;
  readonly requiresApproval: boolean;
  readonly preauthorizedConnectionIds: readonly string[];
  readonly version: number;
  readonly executionCount: number;
  readonly maxExecutions: number | null;
  readonly lastRunAt: string | null;
  readonly pausedReasonKey: string | null;
}

export interface RulePreview {
  readonly ruleId: string;
  readonly connections: readonly {
    readonly connectionId: string;
    readonly provider: ProviderId;
    readonly displayName: string;
  }[];
  readonly maxExternalActionsPerRun: number;
  readonly requiresApproval: boolean;
  readonly requiredApprovalLevel: ApprovalLevel;
  readonly providerRestrictionKeys: readonly string[];
  readonly estimatedCostMinor: number | null;
  readonly costCurrency: string | null;
  readonly cadenceImpactPerDay: number;
  readonly duplicateRiskKey: string | null;
  readonly blockedReasonKeys: readonly string[];
}

export interface RuleRunView {
  readonly id: string;
  readonly ruleId: string;
  readonly ruleVersion: number;
  readonly state: 'pending' | 'running' | 'succeeded' | 'failed' | 'skipped' | 'blocked_by_policy';
  readonly isTest: boolean;
  readonly sourceKind: string;
  readonly sourceId: string | null;
  readonly performedActions: readonly { readonly kind: string; readonly outcome: string }[];
  readonly blockedReasonKey: string | null;
  readonly errorCode: string | null;
  readonly startedAt: string;
  readonly endedAt: string | null;
}

export interface FeedPreview {
  readonly url: string;
  readonly title: string | null;
  readonly itemCount: number;
  readonly latestItemAt: string | null;
  readonly reachable: boolean;
  readonly issueKeys: readonly string[];
  readonly sampleItems: readonly {
    readonly guid: string;
    readonly title: string | null;
    readonly link: string | null;
    readonly publishedAt: string | null;
  }[];
}

export interface RssFeedView {
  readonly id: string;
  readonly workspaceId: string;
  readonly brandId: string;
  readonly title: string;
  readonly feedUrl: string;
  readonly health: 'healthy' | 'degraded' | 'invalid' | 'stalled';
  readonly connectionIds: readonly string[];
  readonly publishPolicy: string;
  readonly pollIntervalSeconds: number;
  readonly lastPolledAt: string | null;
  readonly lastNewItemAt: string | null;
  readonly paused: boolean;
}

export interface FeedHealthView {
  readonly feedId: string;
  readonly health: 'healthy' | 'degraded' | 'invalid' | 'stalled';
  readonly lastPolledAt: string | null;
  readonly lastNewItemAt: string | null;
  readonly consecutiveFailures: number;
  readonly issueKeys: readonly string[];
  readonly itemsLast30Days: number;
}

export interface BusinessProfileView {
  readonly id: string;
  readonly workspaceId: string;
  readonly brandId: string;
  readonly revision: number;
  readonly productName: string;
  readonly siteUrl: string;
  readonly category: string;
  readonly markets: readonly string[];
  readonly contentLocales: readonly string[];
  readonly objective: string;
  readonly completenessScore: number;
  readonly confirmedAt: string | null;
  readonly missingFieldKeys: readonly string[];
}

export interface WebhookEndpointView {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly url: string;
  readonly state: 'active' | 'paused' | 'disabled_on_failure' | 'deleted';
  readonly subscribedEvents: readonly WebhookEventName[];
  readonly connectionScope: readonly string[];
  readonly consecutiveFailures: number;
  readonly createdAt: string;
}

export interface WebhookDeliveryView {
  readonly id: string;
  readonly endpointId: string;
  readonly eventId: string;
  readonly eventType: WebhookEventName;
  readonly state: 'pending' | 'delivering' | 'delivered' | 'failed' | 'dead_lettered';
  readonly attemptCount: number;
  readonly responseStatus: number | null;
  readonly responseSnippet: string | null;
  readonly nextAttemptAt: string | null;
  readonly deliveredAt: string | null;
  readonly createdAt: string;
}

export interface ApiKeyView {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly prefix: string;
  readonly scopes: readonly Scope[];
  readonly createdByUserId: string;
  readonly serviceAccountId: string | null;
  readonly expiresAt: string | null;
  readonly lastUsedAt: string | null;
  readonly revokedAt: string | null;
  readonly createdAt: string;
}

/** The only shape that ever carries a plaintext secret, returned exactly once. */
export interface CreatedApiKeyView {
  readonly key: ApiKeyView;
  readonly plaintext: string;
}

export interface OAuthAppView {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly clientId: string;
  readonly clientType: 'public' | 'confidential';
  readonly redirectUris: readonly string[];
  readonly allowedScopes: readonly Scope[];
  readonly status: 'active' | 'sandbox' | 'disabled' | 'deleted';
  readonly secretRotatedAt: string | null;
  readonly createdAt: string;
}

export interface CreatedOAuthAppView {
  readonly app: OAuthAppView;
  readonly clientSecret: string | null;
}

export interface OAuthGrantView {
  readonly id: string;
  readonly oauthClientId: string;
  readonly clientName: string;
  readonly subjectUserId: string;
  readonly scopes: readonly Scope[];
  readonly brandScope: readonly string[];
  readonly connectionScope: readonly string[];
  readonly consentedAt: string;
  readonly lastUsedAt: string | null;
  readonly revokedAt: string | null;
}

export interface AuditEventView {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorType: string;
  readonly actorId: string | null;
  readonly surface: CreationSurface;
  readonly action: string;
  readonly targetType: string;
  readonly targetId: string | null;
  readonly beforeHash: string | null;
  readonly afterHash: string | null;
  readonly correlationId: string | null;
  readonly createdAt: string;
}
