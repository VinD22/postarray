/**
 * View models for settings, the developer portal, billing and growth.
 *
 * These describe exactly what these screens read. They are intentionally
 * narrower than the wire contracts in `@relay/contracts`: a screen consumes a
 * normalized view model, never a provider payload shape.
 *
 * TODO(web-settings): once `@/lib/api` exports its response types, replace
 * these declarations with imports and delete the cast in `gateway.ts`.
 */

import { ROLES } from '@relay/contracts';
import type {
  Role,
  Scope,
  SubscriptionStatus as ContractSubscriptionStatus,
  WebhookEventName,
} from '@relay/contracts';

/**
 * The seven workspace roles, aliased from the contract so the settings screen
 * and the authorization package can never disagree about the list.
 */
export type WorkspaceRole = Role;

export const WORKSPACE_ROLES: readonly WorkspaceRole[] = [
  'owner',
  'admin',
  'manager',
  'editor',
  'approver',
  'analyst',
  'viewer',
];

/** Fails to compile if a role is added to the contract and not to the screen. */
const _ROLE_COVERAGE: readonly WorkspaceRole[] = ROLES;

export interface BrandRef {
  readonly id: string;
  readonly name: string;
}

export interface MemberView {
  readonly id: string;
  readonly userId: string | null;
  readonly name: string;
  readonly email: string;
  readonly role: WorkspaceRole;
  readonly status: 'active' | 'invited';
  /** Empty means every brand in the workspace. */
  readonly brandScope: readonly BrandRef[];
  readonly canApprove: boolean;
  readonly lastActiveAt: string | null;
  readonly invitedAt: string | null;
  readonly invitedByName: string | null;
  readonly isCurrentUser: boolean;
}

export interface GlossaryTermView {
  readonly id: string;
  readonly term: string;
  readonly locale: string;
  readonly preferred: string | null;
  readonly prohibited: readonly string[];
  readonly keepUntranslated: boolean;
  readonly context: string | null;
}

export interface LocaleRuleView {
  readonly locale: string;
  readonly formality: string;
  readonly pronouns: string;
  readonly avoidIdioms: readonly string[];
  readonly emojiNorms: string;
  readonly legalDisclosure: string;
  readonly callToAction: string;
  readonly reviewedExamples: readonly string[];
}

export interface BrandDomainView {
  readonly domain: string;
  readonly verifiedAt: string | null;
}

export interface BrandView {
  readonly id: string;
  readonly name: string;
  readonly voice: string;
  readonly audience: string;
  readonly approvedClaims: readonly string[];
  readonly blockedTerms: readonly string[];
  readonly contentLocales: readonly string[];
  readonly localeRules: readonly LocaleRuleView[];
  readonly domains: readonly BrandDomainView[];
  readonly disclosureDefaults: readonly { readonly provider: string; readonly text: string }[];
  readonly glossary: readonly GlossaryTermView[];
  readonly connectionCount: number;
  readonly updatedAt: string;
  readonly updatedByName: string | null;
}

export interface SessionView {
  readonly id: string;
  readonly device: string;
  readonly location: string | null;
  readonly lastSeenAt: string;
  readonly isCurrent: boolean;
}

export interface ApiKeyView {
  readonly id: string;
  readonly name: string;
  readonly prefix: string;
  readonly scopes: readonly Scope[];
  readonly createdAt: string;
  readonly createdByName: string;
  readonly lastUsedAt: string | null;
  readonly expiresAt: string | null;
}

export type ApprovalLevel = 0 | 1 | 2 | 3;

export interface ServiceAccountView {
  readonly id: string;
  readonly name: string;
  readonly purpose: string;
  readonly state: 'active' | 'stopped' | 'expired';
  readonly scopes: readonly Scope[];
  readonly brandScope: readonly BrandRef[];
  readonly connectionIds: readonly string[];
  readonly connectionLabels: readonly string[];
  readonly contentLocales: readonly string[];
  readonly allowedDomains: readonly string[];
  readonly maxPostsPerDay: number;
  readonly lookAheadDays: number;
  readonly quietHoursStart: string;
  readonly quietHoursEnd: string;
  readonly timeZone: string;
  readonly approvalLevel: ApprovalLevel;
  readonly createdAt: string;
  readonly createdByName: string;
  readonly lastUsedAt: string | null;
  readonly credentialExpiresAt: string | null;
}

export interface AgentActivityView {
  readonly id: string;
  readonly occurredAt: string;
  readonly tool: string;
  readonly outcome: 'ok' | 'denied' | 'failed';
  readonly subject: string | null;
  readonly reason: string | null;
}

export interface OneTimeCredential {
  readonly value: string;
  readonly expiresAt: string | null;
}

export interface OAuthAppView {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly clientId: string;
  readonly clientType: 'public' | 'confidential';
  readonly status: 'draft' | 'active' | 'disabled';
  readonly homepageUrl: string;
  readonly privacyUrl: string;
  readonly termsUrl: string;
  readonly supportEmail: string;
  readonly logoUrl: string | null;
  readonly redirectUris: readonly string[];
  readonly scopes: readonly Scope[];
  readonly secretRotatedAt: string | null;
  readonly createdAt: string;
}

export interface OAuthGrantView {
  readonly id: string;
  readonly subjectUserId: string;
  readonly scopes: readonly Scope[];
  readonly brandScope: readonly string[];
  readonly connectionScope: readonly string[];
  readonly consentedAt: string;
  readonly lastUsedAt: string | null;
  readonly appName: string;
  readonly appId: string;
  readonly revokedAt: string | null;
}

export interface AppRequestLogView {
  readonly id: string;
  readonly occurredAt: string;
  readonly route: string;
  readonly status: number;
  readonly workspaceName: string;
}

export interface WebhookEndpointView {
  readonly id: string;
  readonly url: string;
  readonly events: readonly WebhookEventName[];
  readonly allEvents: boolean;
  readonly connectionIds: readonly string[];
  readonly connectionLabels: readonly string[];
  readonly enabled: boolean;
  readonly disabledReason: 'persistent_failure' | 'manual' | null;
  readonly signingSecretVersion: number;
  readonly consecutiveFailures: number;
  readonly failureLimit: number;
  readonly lastSuccessAt: string | null;
  readonly lastFailureAt: string | null;
  readonly createdAt: string;
}

export interface WebhookDeliveryView {
  readonly id: string;
  readonly eventName: WebhookEventName;
  readonly status: 'pending' | 'succeeded' | 'failed' | 'exhausted' | 'disabled';
  readonly attempt: number;
  readonly responseStatus: number | null;
  readonly responseBodyExcerpt: string | null;
  readonly requestBodyExcerpt: string | null;
  readonly requestedAt: string;
  readonly nextAttemptAt: string | null;
  readonly isTest: boolean;
}

/**
 * The contract statuses plus `none`, which the web app uses for a workspace
 * that has never started a subscription and therefore has no Polar record.
 */
export type SubscriptionStatus = ContractSubscriptionStatus | 'none';

export interface MoneyView {
  readonly amountMinor: number;
  readonly currency: string;
}

export interface BillingStateView {
  readonly status: SubscriptionStatus;
  readonly interval: 'monthly' | 'annual' | null;
  readonly trialDaysRemaining: number | null;
  /** The exact instant the trial converts, or the next renewal instant. */
  readonly conversionAt: string | null;
  readonly conversionAmount: MoneyView | null;
  readonly cancelAt: string | null;
  readonly canceledAt: string | null;
  readonly accessUntil: string | null;
  readonly graceEndsAt: string | null;
  readonly paymentMethod: {
    readonly brand: string;
    readonly last4: string;
    readonly expiry: string;
  } | null;
  readonly activeChannels: number;
  readonly channelAllowance: number;
  readonly portalUrl: string | null;
  readonly readOnly: boolean;
  readonly checkoutAvailable: boolean;
}

export interface UsageLineView {
  readonly id: string;
  readonly label: string;
  readonly quantity: number;
  readonly unitPrice: MoneyView | null;
  readonly amount: MoneyView | null;
}

export interface UsageView {
  readonly periodStart: string;
  readonly periodEnd: string | null;
  readonly lines: readonly UsageLineView[];
  readonly total: MoneyView | null;
  readonly balance: MoneyView | null;
  readonly reconciledAt: string | null;
  readonly priceSourceVerifiedAt: string | null;
  readonly available: boolean;
  readonly spendAlert: MoneyView | null;
  readonly pauseAtAlert: boolean;
}

export interface InvoiceView {
  readonly id: string;
  readonly issuedAt: string;
  readonly description: string;
  readonly amount: MoneyView;
  readonly state: 'paid' | 'open' | 'uncollectible' | 'refunded';
  readonly url: string | null;
}

export interface ReferralSignupView {
  readonly id: string;
  readonly label: string;
  readonly startedAt: string;
  readonly state: 'pending' | 'approved' | 'reversed';
  readonly amount: MoneyView | null;
}

export interface ReferralView {
  readonly link: string;
  readonly signups: readonly ReferralSignupView[];
  readonly approvedTotal: MoneyView | null;
  readonly payoutSchedule: string;
  readonly termsUrl: string;
}

export interface ExportJobView {
  readonly id: string | null;
  readonly state: 'idle' | 'running' | 'ready' | 'failed';
  readonly preparedAt: string | null;
  readonly expiresAt: string | null;
  readonly downloadUrl: string | null;
}

export interface WorkspaceDeletionView {
  readonly id: string | null;
  readonly state: 'idle' | 'scheduled' | 'executing' | 'completed' | 'canceled' | 'failed';
  readonly executeAfter: string | null;
  readonly canceledAt: string | null;
}

export interface ConnectionSummaryView {
  readonly id: string;
  readonly accountLabel: string;
  readonly provider: string;
  readonly grantedCapabilities: readonly string[];
}
