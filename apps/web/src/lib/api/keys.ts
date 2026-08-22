/**
 * Cache keys.
 *
 * Every key starts with the workspace id, because a workspace switch must never
 * show another tenant's cached rows for even one frame. Invalidating
 * `keys.workspace(id)` clears everything that workspace owns.
 */

import type { ActionItemCategory, ProviderId, PublishState } from './types';

export const keys = {
  session: () => ['session'] as const,

  workspace: (workspaceId: string) => ['ws', workspaceId] as const,

  connections: (workspaceId: string, filter: { projectId?: string; provider?: ProviderId } = {}) =>
    ['ws', workspaceId, 'connections', filter] as const,
  connection: (workspaceId: string, connectionId: string) =>
    ['ws', workspaceId, 'connection', connectionId] as const,
  connectionCapabilities: (workspaceId: string, connectionId: string) =>
    ['ws', workspaceId, 'connection', connectionId, 'capabilities'] as const,
  connectionDestinations: (workspaceId: string, connectionId: string, kind?: string) =>
    ['ws', workspaceId, 'connection', connectionId, 'destinations', kind ?? 'all'] as const,

  content: (workspaceId: string, filter: { projectId?: string; state?: PublishState } = {}) =>
    ['ws', workspaceId, 'content', filter] as const,
  contentItem: (workspaceId: string, contentItemId: string) =>
    ['ws', workspaceId, 'content', contentItemId] as const,
  validation: (workspaceId: string, contentItemId: string) =>
    ['ws', workspaceId, 'content', contentItemId, 'validation'] as const,

  calendar: (workspaceId: string, range: { from: string; to: string; projectId?: string }) =>
    ['ws', workspaceId, 'calendar', range] as const,

  postingSets: (
    workspaceId: string,
    filter: { projectId?: string; includeArchived?: boolean } = {},
  ) => ['ws', workspaceId, 'posting-sets', filter] as const,
  postingSet: (workspaceId: string, setId: string) =>
    ['ws', workspaceId, 'posting-set', setId] as const,
  // Per person as well as per workspace at the database; the key only has to be
  // per project, because a session is one person by construction.
  rememberedTargets: (workspaceId: string, projectId: string) =>
    ['ws', workspaceId, 'remembered-targets', projectId] as const,

  approvalsPending: (workspaceId: string) => ['ws', workspaceId, 'approvals', 'pending'] as const,
  approval: (workspaceId: string, approvalId: string) =>
    ['ws', workspaceId, 'approval', approvalId] as const,

  receipts: (workspaceId: string) => ['ws', workspaceId, 'receipts'] as const,
  receipt: (workspaceId: string, receiptId: string) =>
    ['ws', workspaceId, 'receipt', receiptId] as const,
  publishJob: (workspaceId: string, jobId: string) => ['ws', workspaceId, 'job', jobId] as const,

  actionCenter: (
    workspaceId: string,
    filter: { category?: ActionItemCategory; includeSnoozed?: boolean } = {},
  ) => ['ws', workspaceId, 'action-center', filter] as const,

  media: (workspaceId: string, filter: { kind?: string } = {}) =>
    ['ws', workspaceId, 'media', filter] as const,

  analyticsPost: (workspaceId: string, contentItemId: string) =>
    ['ws', workspaceId, 'analytics', 'post', contentItemId] as const,
  analyticsAccount: (
    workspaceId: string,
    connectionId: string,
    window: { from: string; to: string },
  ) => ['ws', workspaceId, 'analytics', 'account', connectionId, window] as const,
  experiments: (workspaceId: string) => ['ws', workspaceId, 'experiments'] as const,

  rules: (workspaceId: string) => ['ws', workspaceId, 'rules'] as const,
  rule: (workspaceId: string, ruleId: string) => ['ws', workspaceId, 'rule', ruleId] as const,
  ruleRuns: (workspaceId: string, ruleId: string) =>
    ['ws', workspaceId, 'rule', ruleId, 'runs'] as const,

  feeds: (workspaceId: string) => ['ws', workspaceId, 'feeds'] as const,
  shortLinks: (workspaceId: string) => ['ws', workspaceId, 'links'] as const,

  growthPlanSummary: (workspaceId: string) => ['ws', workspaceId, 'growth', 'summary'] as const,
  growthPlan: (workspaceId: string, planId?: string) =>
    ['ws', workspaceId, 'growth', 'plan', planId ?? 'current'] as const,

  webhooks: (workspaceId: string) => ['ws', workspaceId, 'webhooks'] as const,
  webhookDeliveries: (workspaceId: string, endpointId: string) =>
    ['ws', workspaceId, 'webhooks', endpointId, 'deliveries'] as const,
  apiKeys: (workspaceId: string) => ['ws', workspaceId, 'api-keys'] as const,
  oauthApps: (workspaceId: string) => ['ws', workspaceId, 'oauth-apps'] as const,

  billing: (workspaceId: string) => ['ws', workspaceId, 'billing'] as const,
  usage: (workspaceId: string) => ['ws', workspaceId, 'usage'] as const,
  members: (workspaceId: string) => ['ws', workspaceId, 'members'] as const,
  projects: (workspaceId: string) => ['ws', workspaceId, 'projects'] as const,
  audit: (workspaceId: string) => ['ws', workspaceId, 'audit'] as const,

  onboarding: () => ['onboarding'] as const,
  health: () => ['health'] as const,
} as const;
