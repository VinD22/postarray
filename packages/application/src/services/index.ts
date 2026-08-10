import type { ServiceDeps, Services } from '../types';

import { createAnalyticsService } from './analytics';
import { createActionCenterService } from './action-center';
import { createAgentConfirmationService } from './agent-confirmations';
import { createApiKeyService } from './api-keys';
import { createApprovalService } from './approvals';
import { createAuditService } from './audit';
import { createAutomationRuleService } from './automation-rules';
import { createBillingService } from './billing';
import { createBrandService } from './brands';
import { createBulkImportService } from './bulk-import';
import { createWorkerBulkImportService } from './worker-bulk-import';
import { createConnectionService } from './connections';
import { createContentService } from './content';
import { createCredentialVaultService } from './credentials';
import { createDataDeletionService } from './data-deletion';
import { createDataExportService } from './data-exports';
import { createDataLifecycleService } from './data-lifecycle';
import { createGrowthService } from './growth';
import { createHealthService } from './health';
import { createIdentityService } from './identity';
import { createMediaService } from './media';
import { createMembershipService } from './members';
import { createOAuthAppService } from './oauth-apps';
import { createPublishingService } from './publishing';
import { createQueueRuleService } from './queue-rules';
import { createReceiptService } from './receipts';
import { createRssService } from './rss';
import { createSchedulingService } from './scheduling';
import { createShortLinkService } from './short-links';
import { createValidationService } from './validation';
import { createWebhookService } from './webhooks';
import { createWorkspaceService } from './workspaces';
import { createWorkerPublishingService } from './worker-publishing';
import { createWorkerWebhookService } from './worker-webhooks';

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
  // Bulk import applies rows by calling these exact services, so it is handed
  // the same instances rather than building its own. A second content service
  // here would be a second set of rules about what a draft is.
  const scheduling = createSchedulingService(deps, validation);
  const media = createMediaService(deps);
  const bulkImports = createBulkImportService(deps, content, scheduling, media);

  return {
    workspaces: createWorkspaceService(deps),
    members: createMembershipService(deps),
    brands: createBrandService(deps),
    connections: createConnectionService(deps),
    content,
    validation,
    approvals: createApprovalService(deps),
    scheduling,
    queueRules: createQueueRuleService(deps),
    publishing: createPublishingService(deps, validation),
    agentConfirmations: createAgentConfirmationService(deps),
    receipts: createReceiptService(deps),
    actionCenter: createActionCenterService(deps),
    media,
    analytics: createAnalyticsService(deps),
    shortLinks: createShortLinkService(deps),
    automationRules: createAutomationRuleService(deps),
    rss: createRssService(deps),
    growth: createGrowthService(deps, content),
    webhooks: createWebhookService(deps),
    credentials: createCredentialVaultService(deps),
    apiKeys: createApiKeyService(deps),
    oauthApps: createOAuthAppService(deps),
    billing: createBillingService(deps),
    identity: createIdentityService(deps),
    audit: createAuditService(deps),
    dataExports: createDataExportService(deps),
    dataLifecycle: createDataLifecycleService(deps),
    dataDeletion: createDataDeletionService(deps),
    bulkImports,
    workerPublishing: createWorkerPublishingService(deps),
    workerWebhooks: createWorkerWebhookService(deps),
    workerBulkImports: createWorkerBulkImportService(deps, bulkImports),
    health: createHealthService(deps),
  };
}
