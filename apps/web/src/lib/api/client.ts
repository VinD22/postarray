/**
 * `api` is the single object every screen imports.
 *
 * It mirrors the backend service contract one to one. Nothing in the web app
 * calls `fetch` directly, so idempotency, correlation, error typing and demo
 * mode are guaranteed for every call by construction.
 */

import { actionCenterApi } from './resources/action-center.js';
import { authApi, onboardingApi } from './resources/auth.js';
import { connectionsApi } from './resources/connections.js';
import {
  approvalsApi,
  contentApi,
  publishingApi,
  receiptsApi,
  schedulingApi,
  validationApi,
} from './resources/content.js';
import {
  auditApi,
  billingApi,
  brandsApi,
  healthApi,
  membersApi,
  sessionApi,
  workspacesApi,
} from './resources/core.js';
import { analyticsApi, growthApi, shortLinksApi } from './resources/insights.js';
import { mediaApi } from './resources/media.js';
import {
  apiKeysApi,
  automationRulesApi,
  oauthAppsApi,
  rssApi,
  webhooksApi,
} from './resources/platform.js';

export const api = {
  auth: authApi,
  session: sessionApi,
  onboarding: onboardingApi,
  connections: connectionsApi,
  content: contentApi,
  validation: validationApi,
  approvals: approvalsApi,
  scheduling: schedulingApi,
  publishing: publishingApi,
  receipts: receiptsApi,
  media: mediaApi,
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
} as const;

export type Api = typeof api;
