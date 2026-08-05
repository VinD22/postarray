/** Automation rules, RSS sources, webhooks, API keys and developer apps. */

import type {
  RuleActionKind,
  RuleConditionKind,
  RuleTriggerKind,
  WebhookDeliveryLog,
  WebhookEndpoint,
  WebhookEventName,
} from '@relay/contracts';

import { call } from '../call.js';
import { page } from '../fixtures.js';
import type { Paginated } from '../types.js';

export interface RuleView {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly state: 'draft' | 'running' | 'paused' | 'killed';
  readonly trigger: { readonly kind: RuleTriggerKind; readonly config: Readonly<Record<string, unknown>> };
  readonly conditions: readonly {
    readonly kind: RuleConditionKind;
    readonly config: Readonly<Record<string, unknown>>;
  }[];
  readonly actions: readonly {
    readonly kind: RuleActionKind;
    readonly config: Readonly<Record<string, unknown>>;
  }[];
  readonly affectedConnectionIds: readonly string[];
  readonly maxExternalActionsPerRun: number;
  readonly maxRunsPerWeek: number;
  readonly consecutiveFailures: number;
  readonly version: number;
  readonly updatedAt: string;
}

export interface RuleRunView {
  readonly id: string;
  readonly ruleId: string;
  readonly startedAt: string;
  readonly outcome: 'created' | 'skipped' | 'failed';
  readonly summaryKey: string;
  readonly createdDraftCount: number;
  readonly isTestRun: boolean;
}

/**
 * The write shape of a rule.
 *
 * It is deliberately not the read model minus a few keys: `state`, `version`,
 * `consecutiveFailures` and the two guardrail ceilings are decided by the
 * server, and the editor sends the rule document it round trips through its
 * JSON view, delay, end condition and cross account settings included.
 */
export interface RuleInput {
  readonly name: string;
  readonly trigger: RuleView['trigger'];
  readonly conditions: RuleView['conditions'];
  readonly actions: RuleView['actions'];
  readonly affectedConnectionIds: readonly string[];
  /** How long after the trigger fires the actions run. */
  readonly delaySeconds?: number;
  /** When the rule stops on its own. `manual` means it never does. */
  readonly end?:
    | { readonly kind: 'manual' }
    | { readonly kind: 'date'; readonly at: string }
    | { readonly kind: 'count'; readonly runs: number };
  /** A rule that acts across two accounts carries the user's authorisation. */
  readonly crossAccount?: {
    readonly enabled: boolean;
    readonly sourceConnectionId: string | null;
    readonly followUpConnectionId: string | null;
    readonly preauthorized: boolean;
  };
  /**
   * Guardrail ceilings. Omitted by the editor, in which case the server applies
   * the workspace plan's defaults rather than a number the browser invented.
   */
  readonly maxExternalActionsPerRun?: number;
  readonly maxRunsPerWeek?: number;
}

/** What a preflight reports before a rule is allowed to run. */
export interface RulePreflightView {
  readonly affectedAccountLabels: readonly string[];
  readonly maxExternalActions: number;
  readonly requiresApproval: boolean;
  readonly estimatedCostMinor: number;
  readonly currency: string;
}

export const automationRulesApi = {
  list: (query: { cursor?: string; limit?: number } = {}): Promise<Paginated<RuleView>> =>
    call('/rules', { query }, () => page<RuleView>([])),
  get: (ruleId: string): Promise<RuleView | null> => call(`/rules/${ruleId}`, {}, () => null),
  create: (input: RuleInput, idempotencyKey: string): Promise<RuleView | null> =>
    call('/rules', { method: 'POST', body: input, idempotencyKey }, () => null),
  update: (ruleId: string, input: Partial<RuleInput>): Promise<RuleView | null> =>
    call(`/rules/${ruleId}`, { method: 'PATCH', body: input }, () => null),
  enable: (ruleId: string, idempotencyKey: string): Promise<RuleView | null> =>
    call(`/rules/${ruleId}/enable`, { method: 'POST', idempotencyKey }, () => null),
  disable: (ruleId: string, idempotencyKey: string): Promise<RuleView | null> =>
    call(`/rules/${ruleId}/disable`, { method: 'POST', idempotencyKey }, () => null),
  delete: (ruleId: string): Promise<void> =>
    call(`/rules/${ruleId}`, { method: 'DELETE' }, () => undefined),
  /** What the rule would do, with no external effect at all. */
  preview: (input: RuleInput): Promise<RulePreflightView | null> =>
    call('/rules/preview', { method: 'POST', body: input, sideEffectFree: true }, () => null),
  /** The same preflight for a rule that is already saved. */
  previewSaved: (ruleId: string): Promise<RulePreflightView | null> =>
    call(`/rules/${ruleId}/preview`, {}, () => null),
  /**
   * A real run against real input that stops before any external action. The
   * sample event stands in for the event that would have triggered the rule.
   */
  testRun: (
    ruleId: string,
    input: { sampleEvent?: string },
    idempotencyKey: string,
  ): Promise<RuleRunView | null> =>
    call(`/rules/${ruleId}/test-runs`, { method: 'POST', body: input, idempotencyKey }, () => null),
  listRuns: (
    ruleId: string,
    query: { cursor?: string; limit?: number } = {},
  ): Promise<Paginated<RuleRunView>> => call(`/rules/${ruleId}/runs`, { query }, () => page<RuleRunView>([])),
};

export interface FeedView {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly enabled: boolean;
  readonly lastItemAt: string | null;
  readonly lastCheckedAt: string | null;
  readonly health: 'ok' | 'invalid' | 'stalled' | 'unreachable';
}

export const rssApi = {
  validateFeed: (input: { url: string }): Promise<{
    valid: boolean;
    itemCount: number;
    latestItemAt: string | null;
    problemKey: string | null;
  } | null> => call('/rss/validate', { method: 'POST', body: input, sideEffectFree: true }, () => null),
  create: (
    input: { name: string; url: string },
    idempotencyKey: string,
  ): Promise<FeedView | null> => call('/rss', { method: 'POST', body: input, idempotencyKey }, () => null),
  update: (feedId: string, input: Partial<{ name: string; url: string; enabled: boolean }>): Promise<FeedView | null> =>
    call(`/rss/${feedId}`, { method: 'PATCH', body: input }, () => null),
  list: (query: { cursor?: string; limit?: number } = {}): Promise<Paginated<FeedView>> =>
    call('/rss', { query }, () => page<FeedView>([])),
  delete: (feedId: string): Promise<void> =>
    call(`/rss/${feedId}`, { method: 'DELETE' }, () => undefined),
  getHealth: (feedId: string): Promise<FeedView | null> =>
    call(`/rss/${feedId}/health`, {}, () => null),
};

export const webhooksApi = {
  list: (query: { cursor?: string; limit?: number } = {}): Promise<Paginated<WebhookEndpoint>> =>
    call('/webhooks', { query }, () => page<WebhookEndpoint>([])),
  create: (
    input: { url: string; events: readonly WebhookEventName[]; connectionIds?: readonly string[] },
    idempotencyKey: string,
  ): Promise<{ endpoint: WebhookEndpoint; signingSecret: string } | null> =>
    call('/webhooks', { method: 'POST', body: input, idempotencyKey }, () => null),
  update: (
    endpointId: string,
    input: Partial<{ url: string; events: readonly WebhookEventName[]; enabled: boolean }>,
  ): Promise<WebhookEndpoint | null> =>
    call(`/webhooks/${endpointId}`, { method: 'PATCH', body: input }, () => null),
  delete: (endpointId: string): Promise<void> =>
    call(`/webhooks/${endpointId}`, { method: 'DELETE' }, () => undefined),
  testDelivery: (endpointId: string, idempotencyKey: string): Promise<WebhookDeliveryLog | null> =>
    call(`/webhooks/${endpointId}/test`, { method: 'POST', idempotencyKey }, () => null),
  listDeliveries: (
    endpointId: string,
    query: { cursor?: string; limit?: number } = {},
  ): Promise<Paginated<WebhookDeliveryLog>> =>
    call(`/webhooks/${endpointId}/deliveries`, { query }, () => page<WebhookDeliveryLog>([])),
  redeliver: (
    endpointId: string,
    deliveryId: string,
    idempotencyKey: string,
  ): Promise<WebhookDeliveryLog | null> =>
    call(
      `/webhooks/${endpointId}/deliveries/${deliveryId}/redeliver`,
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
  readonly name: string;
  readonly clientId: string;
  readonly redirectUris: readonly string[];
  readonly scopes: readonly string[];
  readonly createdAt: string;
}

export interface OAuthGrantView {
  readonly id: string;
  readonly appName: string;
  readonly grantedByName: string;
  readonly grantedAt: string;
  readonly scopes: readonly string[];
}

export const oauthAppsApi = {
  list: (query: { cursor?: string; limit?: number } = {}): Promise<Paginated<OAuthAppView>> =>
    call('/oauth/apps', { query }, () => page<OAuthAppView>([])),
  create: (
    input: { name: string; redirectUris: readonly string[]; scopes: readonly string[] },
    idempotencyKey: string,
  ): Promise<{ app: OAuthAppView; clientSecret: string } | null> =>
    call('/oauth/apps', { method: 'POST', body: input, idempotencyKey }, () => null),
  update: (
    appId: string,
    input: Partial<{ name: string; redirectUris: readonly string[]; scopes: readonly string[] }>,
  ): Promise<OAuthAppView | null> =>
    call(`/oauth/apps/${appId}`, { method: 'PATCH', body: input }, () => null),
  rotateSecret: (appId: string, idempotencyKey: string): Promise<{ clientSecret: string } | null> =>
    call(`/oauth/apps/${appId}/secret`, { method: 'POST', idempotencyKey }, () => null),
  delete: (appId: string): Promise<void> =>
    call(`/oauth/apps/${appId}`, { method: 'DELETE' }, () => undefined),
  listGrants: (
    appId: string,
    query: { cursor?: string; limit?: number } = {},
  ): Promise<Paginated<OAuthGrantView>> =>
    call(`/oauth/apps/${appId}/grants`, { query }, () => page<OAuthGrantView>([])),
  revokeGrant: (appId: string, grantId: string): Promise<void> =>
    call(`/oauth/apps/${appId}/grants/${grantId}`, { method: 'DELETE' }, () => undefined),
};
