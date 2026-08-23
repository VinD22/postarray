/**
 * `api` is the single object every screen imports.
 *
 * It mirrors the backend service contract one to one. Nothing in the web app
 * calls `fetch` directly, so idempotency, correlation, error typing and demo
 * mode are guaranteed for every call by construction.
 */

import { actionCenterApi } from './resources/action-center';
import { agentConfirmationsApi } from './resources/agent-confirmations';
import { assistantApi } from './resources/assistant';
import { authApi, onboardingApi } from './resources/auth';
import { connectionsApi } from './resources/connections';
import {
  approvalsApi,
  contentApi,
  publishingApi,
  receiptsApi,
  schedulingApi,
  validationApi,
} from './resources/content';
import {
  auditApi,
  billingApi,
  projectsApi,
  healthApi,
  membersApi,
  sessionApi,
  workspacesApi,
} from './resources/core';
import { analyticsApi, growthApi, shortLinksApi } from './resources/insights';
import { mediaApi } from './resources/media';
import { postingSetsApi, targetMemoryApi } from './resources/posting-sets';
import { serviceAccountsApi } from './resources/service-accounts';
import { dataDeletionApi, dataExportsApi } from './resources/data';
import { oauthApi } from './resources/oauth';
import {
  apiKeysApi,
  automationRulesApi,
  oauthAppsApi,
  rssApi,
  webhooksApi,
} from './resources/platform';

export const api = {
  auth: authApi,
  session: sessionApi,
  onboarding: onboardingApi,
  connections: connectionsApi,
  content: contentApi,
  validation: validationApi,
  approvals: approvalsApi,
  scheduling: schedulingApi,
  postingSets: postingSetsApi,
  targetMemory: targetMemoryApi,
  publishing: publishingApi,
  receipts: receiptsApi,
  media: mediaApi,
  dataExports: dataExportsApi,
  dataDeletion: dataDeletionApi,
  analytics: analyticsApi,
  shortLinks: shortLinksApi,
  automationRules: automationRulesApi,
  rss: rssApi,
  growth: growthApi,
  webhooks: webhooksApi,
  apiKeys: apiKeysApi,
  serviceAccounts: serviceAccountsApi,
  oauthApps: oauthAppsApi,
  billing: billingApi,
  members: membersApi,
  projects: projectsApi,
  workspaces: workspacesApi,
  audit: auditApi,
  health: healthApi,
  actionCenter: actionCenterApi,
  agentConfirmations: agentConfirmationsApi,
  assistant: assistantApi,
  oauth: oauthApi,
} as const;

export type Api = typeof api;
