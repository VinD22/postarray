import { z } from 'zod';
import { providerIdSchema, summarizeCapabilities } from '@relay/contracts';

import { RESOURCE_URIS, defineTool, pageInputShape, resourceLink } from './registry.js';
import type { ToolDefinition, ToolResult } from './registry.js';
import type { MetricObservationSummary } from '../ports.js';

/**
 * Read tools.
 *
 * None of them changes anything, none takes an idempotency key, and every one
 * of them returns a bounded page with links rather than the whole resource. A
 * tool that could return ten thousand calendar entries returns ten and a
 * cursor, because filling an agent's context with a calendar is not a feature.
 */

/** A metric that could not be read is its reason, never `0`. */
function metricRow(observation: MetricObservationSummary): Record<string, unknown> {
  return {
    metric: observation.normalizedName,
    value: observation.availability === 'available' ? observation.value : null,
    availability: observation.availability,
    unit: observation.unit,
    provider_field: observation.providerField,
    // The provider's own wording travels with the number, so it is never shown
    // without its meaning.
    provider_definition: observation.providerDefinition,
    derivation_restricted: observation.derivationRestricted,
    observed_at: observation.observedAt,
    freshness_seconds: observation.freshnessSeconds,
  };
}

export const listAccountsTool = defineTool({
  name: 'list_accounts',
  risk: 'read',
  summary: 'List the social accounts connected to this workspace, with their health.',
  sideEffects: 'none',
  scopes: ['accounts:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    provider: providerIdSchema.optional(),
    brand_id: z.string().min(1).optional(),
    ...pageInputShape,
  }),
  async run(context, input): Promise<ToolResult> {
    const page = await context.services.connections.list(context.actor, {
      ...(input.provider === undefined ? {} : { provider: input.provider }),
      ...(input.brand_id === undefined ? {} : { brandId: input.brand_id }),
      ...(input.cursor === undefined ? {} : { cursor: input.cursor }),
      limit: input.limit,
    });

    return {
      data: {
        accounts: page.data.map((connection) => ({
          connection_id: connection.id,
          provider: connection.provider,
          account_type: connection.accountType,
          handle: connection.handle ?? connection.displayName,
          health: connection.health,
          // An i18n key, never provider prose. The client renders it.
          status_message_key: connection.statusMessageKey,
        })),
        next_cursor: page.pageInfo.nextCursor,
        has_more: page.pageInfo.hasMore,
      },
      resourceLinks: page.data.map((connection) =>
        resourceLink(
          RESOURCE_URIS.capabilities(connection.id),
          `${connection.provider} capabilities`,
          'What this account may do right now.',
        ),
      ),
    };
  },
});

export const getCapabilitiesTool = defineTool({
  name: 'get_capabilities',
  risk: 'read',
  summary:
    'Read the current platform and account rules for one connection: limits, formats, destinations, disclosure and cost.',
  sideEffects: 'none',
  scopes: ['accounts:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({ connection_id: z.string().min(1) }),
  async run(context, input): Promise<ToolResult> {
    const snapshot = await context.services.connections.getCapabilities(
      context.actor,
      input.connection_id,
    );
    const summary = summarizeCapabilities(snapshot);

    return {
      data: {
        connection_id: summary.connectionId,
        provider: summary.provider,
        account_type: summary.accountType,
        capability_version: summary.capabilityVersion,
        observed_at: summary.observedAt,
        max_text_length: summary.maxTextLength,
        max_images: summary.maxImages,
        max_videos: summary.maxVideos,
        max_video_duration_seconds: summary.maxVideoDurationSeconds,
        alt_text: summary.altText,
        // `unsupported` means the platform does not offer it. `not_implemented`
        // means Relay has not built it. They are never merged.
        supported_content_kinds: summary.supportedContentKinds,
        unsupported_content_kinds: summary.unsupportedContentKinds,
        not_implemented_content_kinds: summary.notImplementedContentKinds,
        review_required_content_kinds: summary.reviewRequiredContentKinds,
        mentions: summary.mentions,
        first_comment: summary.firstComment,
        threads: summary.threads,
        provider_native_scheduling: summary.providerNativeScheduling,
        privacy_must_be_explicit: summary.privacyMustBeExplicit,
        analytics: summary.analytics,
        deletion: summary.deletion,
        currency: summary.currency,
        cost_per_create_minor: summary.perCreateMinor,
        cost_per_url_create_minor: summary.perUrlCreateMinor,
      },
      resourceLinks: [
        resourceLink(
          RESOURCE_URIS.connection(summary.connectionId),
          'connection',
          'The connection this snapshot belongs to.',
        ),
      ],
    };
  },
});

export const getCalendarTool = defineTool({
  name: 'get_calendar',
  risk: 'read',
  summary: 'List scheduled work in a time window, one page at a time.',
  sideEffects: 'none',
  scopes: ['drafts:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    from: z.string().min(1),
    to: z.string().min(1),
    brand_id: z.string().min(1).optional(),
    ...pageInputShape,
  }),
  async run(context, input): Promise<ToolResult> {
    const page = await context.services.scheduling.getCalendar(context.actor, {
      from: input.from,
      to: input.to,
      ...(input.brand_id === undefined ? {} : { filters: { brandId: input.brand_id } }),
      ...(input.cursor === undefined ? {} : { cursor: input.cursor }),
      limit: input.limit,
    });

    return {
      data: {
        entries: page.data.map((entry) => ({
          job_id: entry.jobId,
          content_item_id: entry.contentItemId,
          connection_id: entry.connectionId,
          provider: entry.provider,
          state: entry.state,
          instant: entry.instant,
          iana_time_zone: entry.ianaTimeZone,
          approval_required: entry.approvalRequired,
          title: entry.title,
        })),
        next_cursor: page.pageInfo.nextCursor,
        has_more: page.pageInfo.hasMore,
      },
      resourceLinks: [
        resourceLink(
          RESOURCE_URIS.calendar(input.from, input.to),
          'calendar window',
          'The full window, paged.',
        ),
      ],
    };
  },
});

export const previewPostTool = defineTool({
  name: 'preview_post',
  risk: 'read',
  summary: 'Render the exact variant that would publish to one account.',
  sideEffects: 'none',
  scopes: ['drafts:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    content_item_id: z.string().min(1),
    connection_id: z.string().min(1),
  }),
  async run(context, input): Promise<ToolResult> {
    const preview = await context.services.content.preview(context.actor, {
      contentItemId: input.content_item_id,
      targetId: input.connection_id,
    });
    return {
      data: {
        content_item_id: preview.contentItemId,
        connection_id: preview.targetId,
        provider: preview.provider,
        account: preview.handle ?? preview.displayName,
        body: preview.body,
        content_kind: preview.contentKind,
        character_count: preview.characterCount,
        character_limit: preview.characterLimit,
        truncated: preview.truncated,
        media_count: preview.media.length,
        thread_item_count: preview.threadItems.length,
      },
      resourceLinks: [
        resourceLink(
          RESOURCE_URIS.contentItem(preview.contentItemId),
          'content item',
          'The draft this preview came from.',
        ),
      ],
    };
  },
});

export const validatePostTool = defineTool({
  name: 'validate_post',
  risk: 'read',
  summary:
    'Run the deterministic preflight for every target: platform limits, policy flags and the estimated provider cost.',
  sideEffects: 'none',
  scopes: ['drafts:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({ content_item_id: z.string().min(1) }),
  async run(context, input): Promise<ToolResult> {
    const result = await context.services.validation.validate(context.actor, {
      contentItemId: input.content_item_id,
    });
    return {
      data: {
        ok: result.ok,
        estimated_cost_minor: result.estimatedCostMinor ?? null,
        currency: result.currency ?? null,
        issues: result.issues.map((issue) => ({
          code: issue.code,
          severity: issue.severity,
          connection_id: issue.targetId ?? null,
          field: issue.field ?? null,
          message_key: issue.messageKey,
          params: issue.params,
        })),
      },
      resourceLinks: [
        resourceLink(
          RESOURCE_URIS.contentItem(input.content_item_id),
          'content item',
          'The draft that was validated.',
        ),
      ],
    };
  },
});

export const getPostStatusTool = defineTool({
  name: 'get_post_status',
  risk: 'read',
  summary: 'Read the state of one publish job, its attempt count and its receipts.',
  sideEffects: 'none',
  scopes: ['drafts:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({ job_id: z.string().min(1) }),
  async run(context, input): Promise<ToolResult> {
    const job = await context.services.publishing.getJob(context.actor, input.job_id);
    const receipts = await context.services.receipts.listForJob(context.actor, input.job_id);

    return {
      data: {
        job_id: job.id,
        state: job.state,
        provider: job.provider,
        connection_id: job.connectionId,
        content_item_id: job.contentItemId,
        scheduled_instant: job.scheduledInstant,
        iana_time_zone: job.ianaTimeZone,
        approval_required: job.approvalRequired,
        approval_state: job.approvalState,
        attempt_count: job.attemptCount,
        last_error_code: job.lastErrorCode,
        receipts: receipts.map((receipt) => ({
          receipt_id: receipt.id,
          external_post_id: receipt.externalPostId,
          permalink: receipt.permalink,
          published_at: receipt.publishedAt,
        })),
      },
      receiptIds: receipts.map((receipt) => receipt.id),
      resourceLinks: [
        resourceLink(RESOURCE_URIS.job(job.id), 'publish job', 'Full job history.'),
        ...receipts.map((receipt) =>
          resourceLink(
            RESOURCE_URIS.receipt(receipt.id),
            'publication receipt',
            'Immutable evidence of one publication.',
          ),
        ),
      ],
    };
  },
});

export const getAnalyticsTool = defineTool({
  name: 'get_analytics',
  risk: 'read',
  summary:
    'Read metrics for one publication or one account, each with its provider field, denominator and freshness.',
  sideEffects: 'none',
  scopes: ['analytics:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z
    .object({
      receipt_id: z.string().min(1).optional(),
      connection_id: z.string().min(1).optional(),
      from: z.string().min(1).optional(),
      to: z.string().min(1).optional(),
    })
    .refine((input) => (input.receipt_id === undefined) !== (input.connection_id === undefined), {
      error: 'PROVIDE_EITHER_RECEIPT_ID_OR_CONNECTION_ID',
    }),
  async run(context, input): Promise<ToolResult> {
    if (input.receipt_id !== undefined) {
      const observations = await context.services.analytics.getPostMetrics(context.actor, {
        receiptId: input.receipt_id,
      });
      return {
        data: { scope: 'post', receipt_id: input.receipt_id, metrics: observations.map(metricRow) },
        resourceLinks: [
          resourceLink(
            RESOURCE_URIS.receipt(input.receipt_id),
            'publication receipt',
            'The publication these metrics describe.',
          ),
        ],
      };
    }

    const connectionId = input.connection_id ?? '';
    const observations = await context.services.analytics.getAccountMetrics(context.actor, {
      connectionId,
      range: {
        from: input.from ?? new globalThis.Date(context.clock.now() - 7 * 86_400_000).toISOString(),
        to: input.to ?? new globalThis.Date(context.clock.now()).toISOString(),
      },
    });
    return {
      data: { scope: 'account', connection_id: connectionId, metrics: observations.map(metricRow) },
      resourceLinks: [
        resourceLink(
          RESOURCE_URIS.connection(connectionId),
          'connection',
          'The account these metrics describe.',
        ),
      ],
    };
  },
});

export const getGrowthPlanTool = defineTool({
  name: 'get_growth_plan',
  risk: 'read',
  summary: 'Read a versioned growth plan as a structured summary.',
  sideEffects: 'none',
  scopes: ['growth:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({ plan_id: z.string().min(1) }),
  async run(context, input): Promise<ToolResult> {
    const plan = await context.services.growth.getPlan(context.actor, input.plan_id);
    return {
      data: {
        plan_id: plan.id,
        revision: plan.revision,
        state: plan.state,
        generated_at: plan.generatedAt,
        objective: plan.goals_and_metrics.objective,
        conversion_event: plan.goals_and_metrics.conversionEvent,
        // Facts are user-confirmed. Assumptions are not, and the two are never
        // presented as the same kind of statement.
        fact_count: plan.business_snapshot.facts.length,
        assumption_count: plan.business_snapshot.assumptions.length,
        missing_information: plan.business_snapshot.missingInformation,
        pillars: plan.content_system.pillars.map((pillar) => pillar.name),
        channels: plan.audiences_and_channels.channels.map((channel) => ({
          provider: channel.provider,
          priority: channel.priority,
        })),
        opportunity_count: plan.opportunities.length,
        tool_recommendation_count: plan.tool_recommendations.length,
        calendar_weeks: plan.calendar_proposal.length,
        unsupported_claims: plan.risks_and_unknowns.unsupportedClaims,
      },
      resourceLinks: [
        resourceLink(
          RESOURCE_URIS.plan(plan.id),
          'growth plan',
          'The full plan, including the Markdown, JSON and YAML exports.',
        ),
      ],
    };
  },
});

export const listGrowthOpportunitiesTool = defineTool({
  name: 'list_growth_opportunities',
  risk: 'read',
  summary:
    'List curated promotion opportunities with their official URL, submission rules and last verified date.',
  sideEffects: 'none',
  scopes: ['growth:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    category: z.string().min(1).optional(),
    region: z.string().min(1).optional(),
    verified_after: z.string().min(1).optional(),
    limit: pageInputShape.limit,
  }),
  async run(context, input): Promise<ToolResult> {
    const records = await context.services.growth.listOpportunities(context.actor, {
      ...(input.category === undefined ? {} : { category: input.category }),
      ...(input.region === undefined ? {} : { region: input.region }),
      ...(input.verified_after === undefined ? {} : { verifiedAfter: input.verified_after }),
    });
    const page = records.slice(0, input.limit);

    return {
      data: {
        opportunities: page.map((record) => ({
          opportunity_id: record.id,
          name: record.name,
          category: record.category,
          // A catalog URL, never one a model produced.
          official_url: record.officialUrl,
          submission_method: record.submissionMethod,
          rules: record.rules,
          effort: record.effort,
          cost_minor: record.costMinor,
          currency: record.currency,
          affiliate: record.affiliate.isAffiliate,
          last_verified_at: record.lastVerifiedAt,
        })),
        returned: page.length,
        total_matching: records.length,
      },
      resourceLinks: page.map((record) =>
        resourceLink(RESOURCE_URIS.opportunity(record.id), record.name, 'Curated catalog record.'),
      ),
    };
  },
});

export const READ_TOOLS: readonly ToolDefinition[] = [
  listAccountsTool,
  getCapabilitiesTool,
  getCalendarTool,
  previewPostTool,
  validatePostTool,
  getPostStatusTool,
  getAnalyticsTool,
  getGrowthPlanTool,
  listGrowthOpportunitiesTool,
];
