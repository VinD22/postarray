/**
 * Which Prisma models are tenant owned.
 *
 * This registry is the list `withWorkspace` consults before it lets a query
 * through, and it is the list a reviewer checks when a model is added. It is
 * written by hand rather than derived from the Prisma DMMF on purpose: a
 * generated list would silently accept a new table that forgot `workspace_id`,
 * which is the exact mistake we want to fail loudly on.
 *
 * The names are Prisma delegate names, so `contentItem`, not `content_items`.
 */

/** Models whose every row belongs to exactly one workspace. */
export const TENANT_MODELS = new Set<string>([
  // Identity and tenancy
  'membership',
  'invitation',
  'rolePermission',
  'serviceAccount',
  'apiKey',
  'auditEvent',
  // `userSession` and `consent` carry a nullable workspace_id because a person
  // exists before they join a tenant. Inside a workspace scope they are still
  // filtered, so a workspace admin cannot read another tenant's rows.
  'userSession',
  'consent',

  // Brands and content
  'brand',
  'businessProfile',
  'brandSource',
  'glossaryTerm',
  'campaign',
  'contentItem',
  'contentVersion',
  'postVariant',
  'postingSet',
  'signature',
  'providerDestination',
  'mentionEntity',
  'approvalRequest',
  'approvalDecision',
  'commentThreadItem',

  // Growth
  'growthPlan',
  'strategyOpportunityMatch',

  // Connections, media and publishing
  'socialConnection',
  'socialCredential',
  'oAuthTransaction',
  'oAuthPendingDiscovery',
  'oAuthClient',
  'oAuthGrant',
  'outboxEvent',
  'outboxDeadLetter',
  'mediaAsset',
  'mediaDerivative',
  'publishJob',
  'publishAttempt',
  'publicationReceipt',
  'providerLimit',
  'connectionIncident',

  // Queue rules and slot reservations
  'queueRule',
  'queueSlotReservation',

  // Remembered channel selection. Workspace scoped like everything else here,
  // and additionally self-row at the database: workspace membership is
  // necessary but never sufficient to read another member's memory.
  'rememberedTarget',

  // Automation
  'automationRule',
  'automationRuleRun',
  'rssFeed',
  'rssFeedItem',
  'webhookEndpoint',
  'webhookDelivery',

  // Analytics and links
  'metricObservation',
  'analyticsSyncRun',
  'experiment',
  'insight',
  'shortLink',
  'shortLinkClick',

  // Billing
  'polarCustomer',
  'subscription',
  'entitlement',
  'usageEvent',
  'affiliatePartner',
  'referralAttribution',
  'commissionLedger',

  // Lifecycle
  'deletionRequest',
  'dataExport',

  // Bulk CSV import
  'bulkImportJob',
  'bulkImportRow',
]);

/**
 * Models that are deliberately global. Reading one through a workspace scope is
 * allowed and adds no filter; writing one is an operator action that does not
 * belong behind a tenant client.
 */
export const GLOBAL_MODELS = new Set<string>([
  'user',
  'userAlias',
  'workspace',
  'growthOpportunity',
  'toolCatalogEntry',
  'metricDefinition',
  'billingWebhookInbox',
  'payoutBatch',
]);

export function isTenantModel(model: string): boolean {
  return TENANT_MODELS.has(model);
}

export function isGlobalModel(model: string): boolean {
  return GLOBAL_MODELS.has(model);
}

/**
 * True for a name that is neither a known tenant model nor a known global one,
 * which almost always means someone added a model and forgot this file.
 */
export function isUnregisteredModel(model: string): boolean {
  return !TENANT_MODELS.has(model) && !GLOBAL_MODELS.has(model);
}
