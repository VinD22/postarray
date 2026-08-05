import type { ServiceDeps, Services } from '../types.js';

import { createAnalyticsService } from './analytics.js';
import { createApiKeyService } from './api-keys.js';
import { createApprovalService } from './approvals.js';
import { createAuditService } from './audit.js';
import { createAutomationRuleService } from './automation-rules.js';
import { createBrandService } from './brands.js';
import { createConnectionService } from './connections.js';
import { createContentService } from './content.js';
import { createCredentialVaultService } from './credentials.js';
import { createGrowthService } from './growth.js';
import { createHealthService } from './health.js';
import { createMediaService } from './media.js';
import { createMembershipService } from './members.js';
import { createOAuthAppService } from './oauth-apps.js';
import { createPublishingService } from './publishing.js';
import { createReceiptService } from './receipts.js';
import { createRssService } from './rss.js';
import { createSchedulingService } from './scheduling.js';
import { createShortLinkService } from './short-links.js';
import { createValidationService } from './validation.js';
import { createWebhookService } from './webhooks.js';
import { createWorkspaceService } from './workspaces.js';

/**
 * The composition root.
 *
 * One call, one object, five consumers. The API, the worker, the MCP server,
 * the CLI and the web app (through the API) all receive exactly this and
 * nothing more, which is what makes "no surface may bypass approval, tenancy,
 * idempotency or policy" checkable rather than aspirational.
 */
export function createServices(deps: ServiceDeps): Services {
  // Validation is shared: scheduling and publishing must run the identical
  // preflight, so they receive the same instance rather than building one each.
  const validation = createValidationService(deps);
  const content = createContentService(deps);

  return {
    workspaces: createWorkspaceService(deps),
    members: createMembershipService(deps),
    brands: createBrandService(deps),
    connections: createConnectionService(deps),
    content,
    validation,
    approvals: createApprovalService(deps),
    scheduling: createSchedulingService(deps, validation),
    publishing: createPublishingService(deps, validation),
    receipts: createReceiptService(deps),
    media: createMediaService(deps),
    analytics: createAnalyticsService(deps),
    shortLinks: createShortLinkService(deps),
    automationRules: createAutomationRuleService(deps),
    rss: createRssService(deps),
    growth: createGrowthService(deps, content),
    webhooks: createWebhookService(deps),
    credentials: createCredentialVaultService(deps),
    apiKeys: createApiKeyService(deps),
    oauthApps: createOAuthAppService(deps),
    audit: createAuditService(deps),
    health: createHealthService(deps),
  };
}
