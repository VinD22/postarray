/** Automation rules, RSS sources, webhooks, API keys and developer apps. */

import type {
  ApprovalLevel,
  ProviderId,
  RuleActionKind,
  RuleConditionKind,
  RuleTriggerKind,
  WebhookDeliveryLog,
  WebhookEndpoint,
  WebhookEventName,
} from '@relay/contracts';

import { call } from '../call';
import { page } from '../fixtures';
import type { Paginated } from '../types';

export interface RuleView {
  readonly id: string;
  readonly workspaceId: string;
  readonly projectId: string;
  readonly name: string;
  readonly state: 'draft' | 'active' | 'paused' | 'disabled' | 'archived';
  readonly trigger: {
    readonly kind: RuleTriggerKind;
    readonly config: Readonly<Record<string, unknown>>;
  };
  readonly conditions: readonly {
    readonly kind: RuleConditionKind;
    readonly config: Readonly<Record<string, unknown>>;
  }[];
  readonly actions: readonly {
    readonly kind: RuleActionKind;
    readonly config: Readonly<Record<string, unknown>>;
  }[];
  readonly delaySeconds: number;
  readonly endCondition:
    { readonly kind: 'manual' } | { readonly kind: 'count'; readonly runs: number };
  readonly requiresApproval: boolean;
  readonly preauthorizedConnectionIds: readonly string[];
  readonly version: number;
  readonly executionCount: number;
  readonly maxExecutionsPerSource: number | null;
  readonly maxExecutions: number | null;
  readonly lastRunAt: string | null;
  readonly pausedReasonKey: string | null;
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

/**
 * The write shape of a rule.
 *
 * It is deliberately not the read model minus a few keys: `state`, `version`,
 * `consecutiveFailures` and the two guardrail ceilings are decided by the
 * server. The editor sends the persisted rule document, including delay,
 * lifetime end and per-source threshold guards.
 */
export interface RuleInput {
  readonly projectId: string;
  readonly name: string;
  readonly trigger: RuleView['trigger'];
  readonly conditions: RuleView['conditions'];
  readonly actions: RuleView['actions'];
  readonly preauthorizedConnectionIds?: readonly string[];
  readonly delaySeconds?: number;
  readonly endCondition?: RuleView['endCondition'];
  readonly requiresApproval?: boolean;
  readonly maxExecutionsPerSource?: number | null;
  readonly cooldownSeconds?: number | null;
  readonly measurementWindowSeconds?: number | null;
}

/** What a preflight reports before a rule is allowed to run. */
export interface RulePreflightView {
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

export const automationRulesApi = {
  list: (query: { cursor?: string; limit?: number } = {}): Promise<Paginated<RuleView>> =>
    call('/automation-rules', { query }, () => page<RuleView>([])),
  get: (ruleId: string): Promise<RuleView | null> =>
    call(`/automation-rules/${ruleId}`, {}, () => null),
  create: (input: RuleInput, idempotencyKey: string): Promise<RuleView | null> =>
    call('/automation-rules', { method: 'POST', body: input, idempotencyKey }, () => null),
  update: (ruleId: string, input: Partial<RuleInput>): Promise<RuleView | null> =>
    call(`/automation-rules/${ruleId}`, { method: 'PATCH', body: input }, () => null),
  enable: (ruleId: string, idempotencyKey: string): Promise<RuleView | null> =>
    call(`/automation-rules/${ruleId}/enable`, { method: 'POST', idempotencyKey }, () => null),
  disable: (ruleId: string, idempotencyKey: string): Promise<RuleView | null> =>
    call(`/automation-rules/${ruleId}/disable`, { method: 'POST', idempotencyKey }, () => null),
  delete: (ruleId: string): Promise<void> =>
    call(`/automation-rules/${ruleId}`, { method: 'DELETE' }, () => undefined),
  /** The same preflight for a rule that is already saved. */
  previewSaved: (ruleId: string): Promise<RulePreflightView | null> =>
    call(`/automation-rules/${ruleId}/preview`, {}, () => null),
  /**
   * A real run against real input that stops before any external action. The
   * sample event stands in for the event that would have triggered the rule.
   */
  testRun: (
    ruleId: string,
    input: { sampleEvent: Readonly<Record<string, unknown>> },
    idempotencyKey: string,
  ): Promise<RuleRunView | null> =>
    call(
      `/automation-rules/${ruleId}/test-runs`,
      { method: 'POST', body: input, idempotencyKey },
      () => null,
    ),
  listRuns: (
    ruleId: string,
    query: { cursor?: string; limit?: number } = {},
  ): Promise<Paginated<RuleRunView>> =>
    call(`/automation-rules/${ruleId}/runs`, { query }, () => page<RuleRunView>([])),
};

export interface FeedView {
  readonly id: string;
  readonly workspaceId: string;
  readonly projectId: string;
  readonly title: string;
  readonly feedUrl: string;
  readonly health: 'healthy' | 'degraded' | 'invalid' | 'stalled';
  readonly connectionIds: readonly string[];
  readonly publishPolicy: 'draft' | 'approval';
  readonly pollIntervalSeconds: number;
  readonly lastPolledAt: string | null;
  readonly lastNewItemAt: string | null;
  readonly paused: boolean;
}

/**
 * A feed as the wizard defines it. A feed never publishes on its own: `policy`
 * says what happens to the draft it produces, and every route through it still
 * goes past validation and approval.
 */
export interface FeedInput {
  readonly projectId: string;
  readonly title: string;
  readonly feedUrl: string;
  readonly connectionIds?: readonly string[];
  readonly publishPolicy?: FeedView['publishPolicy'];
  readonly pollIntervalSeconds?: number;
}

export interface FeedPreviewView {
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

export interface FeedHealthView {
  readonly feedId: string;
  readonly health: 'healthy' | 'degraded' | 'invalid' | 'stalled';
  readonly lastPolledAt: string | null;
  readonly lastNewItemAt: string | null;
  readonly consecutiveFailures: number;
  readonly issueKeys: readonly string[];
  readonly itemsLast30Days: number;
}

export const rssApi = {
  validateFeed: (input: { url: string }): Promise<FeedPreviewView | null> =>
    call('/rss/feeds/validate', { method: 'POST', body: input, sideEffectFree: true }, () => null),
  create: (input: FeedInput, idempotencyKey: string): Promise<FeedView | null> =>
    call('/rss/feeds', { method: 'POST', body: input, idempotencyKey }, () => null),
  update: (
    feedId: string,
    input: Partial<
      Pick<FeedInput, 'title' | 'connectionIds' | 'publishPolicy' | 'pollIntervalSeconds'>
    > & {
      readonly paused?: boolean;
    },
  ): Promise<FeedView | null> =>
    call(`/rss/feeds/${feedId}`, { method: 'PATCH', body: input }, () => null),
  list: (query: { cursor?: string; limit?: number } = {}): Promise<Paginated<FeedView>> =>
    call('/rss/feeds', { query }, () => page<FeedView>([])),
  delete: (feedId: string): Promise<void> =>
    call(`/rss/feeds/${feedId}`, { method: 'DELETE' }, () => undefined),
  getHealth: (feedId: string): Promise<FeedHealthView | null> =>
    call(`/rss/feeds/${feedId}/health`, {}, () => null),
};

export const webhooksApi = {
  list: (query: { cursor?: string; limit?: number } = {}): Promise<Paginated<WebhookEndpoint>> =>
    call('/webhooks/endpoints', { query }, () => page<WebhookEndpoint>([])),
  create: (
    input: { url: string; events: readonly WebhookEventName[]; connectionIds?: readonly string[] },
    idempotencyKey: string,
  ): Promise<{ endpoint: WebhookEndpoint; signingSecret: string } | null> =>
    call('/webhooks/endpoints', { method: 'POST', body: input, idempotencyKey }, () => null),
  update: (
    endpointId: string,
    input: Partial<{ url: string; events: readonly WebhookEventName[]; enabled: boolean }>,
  ): Promise<WebhookEndpoint | null> =>
    call(`/webhooks/endpoints/${endpointId}`, { method: 'PATCH', body: input }, () => null),
  delete: (endpointId: string): Promise<void> =>
    call(`/webhooks/endpoints/${endpointId}`, { method: 'DELETE' }, () => undefined),
  rotateSecret: (
    endpointId: string,
    idempotencyKey: string,
  ): Promise<{ endpoint: WebhookEndpoint; signingSecret: string } | null> =>
    call(
      `/webhooks/endpoints/${endpointId}/rotate-secret`,
      { method: 'POST', idempotencyKey },
      () => null,
    ),
  testDelivery: (endpointId: string, idempotencyKey: string): Promise<WebhookDeliveryLog | null> =>
    call(`/webhooks/endpoints/${endpointId}/test`, { method: 'POST', idempotencyKey }, () => null),
  listDeliveries: (
    endpointId: string,
    query: { cursor?: string; limit?: number } = {},
  ): Promise<Paginated<WebhookDeliveryLog>> =>
    call(`/webhooks/endpoints/${endpointId}/deliveries`, { query }, () =>
      page<WebhookDeliveryLog>([]),
    ),
  redeliver: (
    endpointId: string,
    deliveryId: string,
    idempotencyKey: string,
  ): Promise<WebhookDeliveryLog | null> =>
    call(
      `/webhooks/deliveries/${deliveryId}/redeliver`,
      { method: 'POST', idempotencyKey },
      () => null,
    ),
};

export interface ApiKeyView {
  readonly id: string;
  readonly name: string;
  readonly prefix: string;
  readonly scopes: readonly string[];
  readonly createdAt: string;
  readonly lastUsedAt: string | null;
  readonly revokedAt: string | null;
  readonly expiresAt: string | null;
}

export const apiKeysApi = {
  list: (query: { cursor?: string; limit?: number } = {}): Promise<Paginated<ApiKeyView>> =>
    call('/api-keys', { query }, () => page<ApiKeyView>([])),
  /** The secret is returned once and never again. */
  create: (
    input: { name: string; scopes: readonly string[] },
    idempotencyKey: string,
  ): Promise<{ key: ApiKeyView; secret: string } | null> =>
    call('/api-keys', { method: 'POST', body: input, idempotencyKey }, () => null),
  revoke: (keyId: string): Promise<void> =>
    call(`/api-keys/${keyId}`, { method: 'DELETE' }, () => undefined),
};

export interface OAuthAppView {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly clientId: string;
  readonly clientType: 'public' | 'confidential';
  readonly redirectUris: readonly string[];
  readonly allowedScopes: readonly string[];
  readonly homepageUrl: string;
  readonly privacyPolicyUrl: string;
  readonly termsUrl: string;
  readonly logoUrl: string | null;
  readonly supportEmail: string;
  readonly status: 'active' | 'sandbox' | 'disabled' | 'deleted';
  readonly secretRotatedAt: string | null;
  readonly createdAt: string;
}

export interface OAuthGrantView {
  readonly id: string;
  readonly oauthClientId: string;
  readonly clientName: string;
  readonly subjectUserId: string;
  readonly scopes: readonly string[];
  readonly projectScope: readonly string[];
  readonly connectionScope: readonly string[];
  readonly consentedAt: string;
  readonly lastUsedAt: string | null;
  readonly revokedAt: string | null;
}

export const oauthAppsApi = {
  list: (query: { cursor?: string; limit?: number } = {}): Promise<Paginated<OAuthAppView>> =>
    call('/developer/apps', { query }, () => page<OAuthAppView>([])),
  get: (appId: string): Promise<OAuthAppView | null> =>
    call(`/developer/apps/${appId}`, {}, () => null),
  create: (
    input: {
      name: string;
      clientType: 'public' | 'confidential';
      homepageUrl: string;
      privacyPolicyUrl: string;
      termsUrl: string;
      supportEmail: string;
      logoUrl?: string | null;
      redirectUris: readonly string[];
      allowedScopes: readonly string[];
    },
    idempotencyKey: string,
  ): Promise<{ app: OAuthAppView; clientSecret: string | null } | null> =>
    call('/developer/apps', { method: 'POST', body: input, idempotencyKey }, () => null),
  update: (
    appId: string,
    input: Partial<{
      name: string;
      homepageUrl: string;
      privacyPolicyUrl: string;
      termsUrl: string;
      supportEmail: string;
      logoUrl: string | null;
      redirectUris: readonly string[];
      allowedScopes: readonly string[];
      status: 'active' | 'sandbox' | 'disabled';
    }>,
  ): Promise<OAuthAppView | null> =>
    call(`/developer/apps/${appId}`, { method: 'PATCH', body: input }, () => null),
  rotateSecret: (
    appId: string,
    idempotencyKey: string,
  ): Promise<{ app: OAuthAppView; clientSecret: string | null } | null> =>
    call(`/developer/apps/${appId}/secret`, { method: 'POST', idempotencyKey }, () => null),
  delete: (appId: string): Promise<void> =>
    call(`/developer/apps/${appId}`, { method: 'DELETE' }, () => undefined),
  listGrants: (
    query: { cursor?: string; limit?: number } = {},
  ): Promise<Paginated<OAuthGrantView>> =>
    call('/developer/grants', { query }, () => page<OAuthGrantView>([])),
  revokeGrant: (grantId: string): Promise<void> =>
    call(`/developer/grants/${grantId}`, { method: 'DELETE' }, () => undefined),
};
