import type { Services } from '@relay/application';

import type { RelayServicePort } from './ports.js';

/**
 * The single adapter between `@relay/application` and this server's port.
 *
 * It is a pass-through. There is no logic here, and there must never be any:
 * the moment this file starts making a decision, the MCP surface stops being
 * the same surface as the API and the CLI.
 *
 * If a view model in `@relay/application` gains a field, nothing here changes,
 * because the port's types are subsets. If one loses a field this server reads,
 * the compiler points at this file, which is the whole point of keeping the
 * seam explicit rather than importing `Services` into every tool.
 */
export function toRelayServicePort(services: Services): RelayServicePort {
  return {
    connections: {
      list: (ctx, input) => services.connections.list(ctx, input),
      getCapabilities: (ctx, connectionId) =>
        services.connections.getCapabilities(ctx, connectionId),
    },
    content: {
      createDraft: (ctx, input) => services.content.createDraft(ctx, input),
      get: (ctx, contentItemId) => services.content.get(ctx, contentItemId),
      preview: (ctx, input) => services.content.preview(ctx, input),
    },
    validation: {
      validate: (ctx, input) => services.validation.validate(ctx, input),
    },
    approvals: {
      request: (ctx, input) => services.approvals.request(ctx, input),
    },
    scheduling: {
      schedule: (ctx, input) => services.scheduling.schedule(ctx, input),
      cancel: (ctx, input) => services.scheduling.cancel(ctx, input),
      getCalendar: (ctx, input) => services.scheduling.getCalendar(ctx, input),
    },
    publishing: {
      publishNow: (ctx, input) => services.publishing.publishNow(ctx, input),
      getJob: (ctx, jobId) => services.publishing.getJob(ctx, jobId),
    },
    receipts: {
      listForJob: (ctx, jobId) => services.receipts.listForJob(ctx, jobId),
    },
    analytics: {
      getPostMetrics: (ctx, input) => services.analytics.getPostMetrics(ctx, input),
      getAccountMetrics: (ctx, input) => services.analytics.getAccountMetrics(ctx, input),
    },
    growth: {
      getPlan: (ctx, planId) => services.growth.getPlan(ctx, planId),
      generatePlan: (ctx, input) => services.growth.generatePlan(ctx, input),
      createDraftFromItem: (ctx, input) => services.growth.createDraftFromItem(ctx, input),
      listOpportunities: (ctx, input) => services.growth.listOpportunities(ctx, input),
    },
  };
}
