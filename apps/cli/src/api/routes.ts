/**
 * Every REST path the CLI knows.
 *
 * Collected in one file so a route change is one diff, and so it is obvious at
 * a glance that the CLI reaches only the public `/v1` surface. It has no
 * privileged endpoint and no back door.
 */

export const ROUTES = {
  me: () => '/v1/auth/me',

  connections: () => '/v1/connections',
  connectionCapabilities: (connectionId: string) =>
    `/v1/connections/${encodeURIComponent(connectionId)}/capabilities`,

  content: () => '/v1/content',
  contentItem: (contentItemId: string) => `/v1/content/${encodeURIComponent(contentItemId)}`,
  /** `targetId` is the post variant id, not the connection id. */
  contentVariant: (contentItemId: string, variantId: string) =>
    `/v1/content/${encodeURIComponent(contentItemId)}/variants/${encodeURIComponent(variantId)}`,
  /** Read only despite being a POST: deterministic preflight plus a cost estimate. */
  validate: (contentItemId: string) =>
    `/v1/content/${encodeURIComponent(contentItemId)}/validate`,
  preview: (contentItemId: string) => `/v1/content/${encodeURIComponent(contentItemId)}/preview`,

  schedules: () => '/v1/schedules',
  cancelSchedule: (jobId: string) => `/v1/schedules/${encodeURIComponent(jobId)}/cancel`,
  publications: () => '/v1/publications',
  job: (jobId: string) => `/v1/jobs/${encodeURIComponent(jobId)}`,

  calendar: () => '/v1/calendar',
  receipt: (receiptId: string) => `/v1/receipts/${encodeURIComponent(receiptId)}`,

  postMetrics: (receiptId: string) => `/v1/analytics/posts/${encodeURIComponent(receiptId)}`,
  accountMetrics: () => '/v1/analytics/accounts',

  growthPlan: (planId: string) => `/v1/growth/plans/${encodeURIComponent(planId)}`,
  growthPlanExport: (planId: string) => `/v1/growth/plans/${encodeURIComponent(planId)}/export`,

  automationRules: () => '/v1/automation-rules',
  automationRuleTestRun: (ruleId: string) =>
    `/v1/automation-rules/${encodeURIComponent(ruleId)}/test-runs`,

  shortLinks: () => '/v1/short-links',
  shortLinkStats: (linkId: string) => `/v1/short-links/${encodeURIComponent(linkId)}/stats`,
} as const;

/** Discovery documents, served by the OAuth issuer in `apps/api`. */
export const DISCOVERY_PATHS = {
  authorizationServer: '/.well-known/oauth-authorization-server',
  protectedResource: '/.well-known/oauth-protected-resource',
} as const;
