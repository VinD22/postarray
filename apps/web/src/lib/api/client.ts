/**
 * `api` is the single object every screen imports.
 *
 * It mirrors the backend service contract one to one. Nothing in the web app
 * calls `fetch` directly, so idempotency, correlation, error typing and demo
 * mode are guaranteed for every call by construction.
 */

import { actionCenterApi } from './resources/action-center';
import { agentConfirmationsApi } from './resources/agent-confirmations';
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
  brandsApi,
  healthApi,
  membersApi,
  sessionApi,
  workspacesApi,
} from './resources/core';
import { analyticsApi, growthApi, shortLinksApi } from './resources/insights';
import { mediaApi } from './resources/media';
import { postingSetsApi, targetMemoryApi } from './resources/posting-sets';
import { dataDeletionApi, dataExportsApi } from './resources/data';
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
  oauthApps: oauthAppsApi,
  billing: billingApi,
  members: membersApi,
  brands: brandsApi,
  workspaces: workspacesApi,
  audit: auditApi,
  health: healthApi,
  actionCenter: actionCenterApi,
  agentConfirmations: agentConfirmationsApi,
} as const;

export type Api = typeof api;
