import { z } from 'zod';
import { contentKindSchema } from '@relay/contracts';

import { RESOURCE_URIS, defineTool, idempotencyInputShape, resourceLink } from './registry';
import type { ToolResult } from './registry';

/**
 * Reversible tools.
 *
 * They create or change something inside Post Array and publish nothing. A draft
 * sits in the workspace until a person or a level 2 grant schedules it, and a
 * generated plan is a document, not an action.
 *
 * `create_campaign_from_plan` is declared reversible because its output is
 * drafts and proposed slots, but it still requires an idempotency key: it can
 * be called in a loop by a retrying agent, and duplicate drafts across a
 * workspace are a real mess even when nothing was published.
 */

export const draftPostTool = defineTool({
  name: 'draft_post',
  risk: 'reversible',
  summary: 'Create an unpublished draft with one master body and one entry per target account.',
  sideEffects: 'creates a draft inside Post Array. Nothing is scheduled and nothing reaches a platform',
  scopes: ['drafts:write'],
  approvalLevel: 'level_1_draft',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    /** Required. A draft always belongs to a project, never to a workspace at large. */
    project_id: z.string().min(1),
    body: z.string().min(1).max(20_000),
    title: z.string().min(1).max(300).optional(),
    locale: z.string().min(2).max(12).optional(),
    content_kind: contentKindSchema.optional(),
    campaign_id: z.string().min(1).optional(),
    media_ids: z.array(z.string().min(1)).max(20).optional(),
    /**
     * Post Array connection ids only. A raw provider handle is never accepted: an
     * account is resolved server side against what this grant already permits,
     * never looked up with ambient authority.
     */
    targets: z
      .array(z.object({ connection_id: z.string().min(1) }).strict())
      .min(1)
      .max(50),
  }),
  async run(context, input): Promise<ToolResult> {
    const item = await context.services.content.createDraft(context.actor, {
      projectId: input.project_id,
      body: input.body,
      ...(input.title === undefined ? {} : { title: input.title }),
      ...(input.locale === undefined ? {} : { locale: input.locale }),
      ...(input.content_kind === undefined ? {} : { contentKind: input.content_kind }),
      ...(input.campaign_id === undefined ? {} : { campaignId: input.campaign_id }),
      ...(input.media_ids === undefined ? {} : { mediaIds: input.media_ids }),
      targets: input.targets.map((target) => ({ connectionId: target.connection_id })),
    });

    return {
      data: {
        content_item_id: item.id,
        state: item.state,
        approval_state: item.approvalState,
        locale: item.locale,
        content_kind: item.contentKind,
        target_count: item.variants.length,
        next_step: 'validate_post',
      },
      resourceLinks: [
        resourceLink(
          RESOURCE_URIS.contentItem(item.id),
          'content item',
          'The draft that was created.',
        ),
      ],
    };
  },
});

export const requestApprovalTool = defineTool({
  name: 'request_approval',
  risk: 'reversible',
  summary: 'Route a draft into the workspace approval policy and notify the approvers.',
  sideEffects:
    'creates an approval request inside Post Array and notifies people. Nothing reaches a platform',
  scopes: ['drafts:write'],
  approvalLevel: 'level_1_draft',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    content_item_id: z.string().min(1),
    approver_ids: z.array(z.string().min(1)).max(20).optional(),
    note: z.string().max(2000).optional(),
  }),
  async run(context, input): Promise<ToolResult> {
    const approval = await context.services.approvals.request(context.actor, {
      contentItemId: input.content_item_id,
      ...(input.approver_ids === undefined ? {} : { approverIds: input.approver_ids }),
      ...(input.note === undefined ? {} : { note: input.note }),
    });

    return {
      data: {
        approval_id: approval.id,
        content_item_id: approval.contentItemId,
        state: approval.state,
        requested_at: approval.createdAt,
        approver_count: approval.assignedUserIds.length,
      },
      resourceLinks: [
        resourceLink(
          RESOURCE_URIS.contentItem(approval.contentItemId),
          'content item',
          'The draft awaiting a decision.',
        ),
      ],
    };
  },
});

export const generateGrowthPlanTool = defineTool({
  name: 'generate_growth_plan',
  risk: 'reversible',
  summary:
    'Start generating a draft growth plan from a confirmed business profile and the curated catalogs.',
  sideEffects:
    'creates a draft plan document inside Post Array. It never submits a listing, contacts a community or publishes anything',
  scopes: ['growth:write'],
  approvalLevel: 'level_1_draft',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({ business_profile_id: z.string().min(1) }),
  async run(context, input): Promise<ToolResult> {
    const operation = await context.services.growth.generatePlan(context.actor, {
      profileId: input.business_profile_id,
    });
    return {
      data: {
        operation_id: operation.operationId,
        status: operation.status,
        resource_type: operation.resourceType,
        resource_id: operation.resourceId,
        next_step: 'get_growth_plan',
      },
      resourceLinks:
        operation.resourceId === null
          ? []
          : [
              resourceLink(
                RESOURCE_URIS.plan(operation.resourceId),
                'growth plan',
                'The plan being generated.',
              ),
            ],
    };
  },
});

export const createCampaignFromPlanTool = defineTool({
  name: 'create_campaign_from_plan',
  risk: 'reversible',
  summary: 'Turn selected growth plan items into drafts in this workspace.',
  sideEffects:
    'creates drafts inside Post Array. It schedules nothing and publishes nothing. Every draft still goes through the normal validation and approval path',
  scopes: ['growth:write', 'drafts:write'],
  approvalLevel: 'level_1_draft',
  // A retrying agent calling this in a loop produces duplicate drafts across a
  // whole workspace, so the key is required even though nothing is published.
  requiresIdempotencyKey: true,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    plan_id: z.string().min(1),
    item_ids: z.array(z.string().min(1)).min(1).max(20),
    ...idempotencyInputShape,
  }),
  async run(context, input): Promise<ToolResult> {
    const created: { readonly item_id: string; readonly content_item_id: string }[] = [];
    for (const itemId of input.item_ids) {
      const item = await context.services.growth.createDraftFromItem(context.actor, {
        planId: input.plan_id,
        itemId,
      });
      created.push({ item_id: itemId, content_item_id: item.id });
    }

    return {
      data: {
        plan_id: input.plan_id,
        created_count: created.length,
        drafts: created,
        next_step: 'validate_post',
      },
      resourceLinks: created.map((entry) =>
        resourceLink(
          RESOURCE_URIS.contentItem(entry.content_item_id),
          'content item',
          'A draft created from the plan.',
        ),
      ),
    };
  },
});

export const importMediaTool = defineTool({
  name: 'import_media',
  risk: 'reversible',
  summary: 'Import a media file into the workspace library from a URL the person supplied.',
  sideEffects:
    'fetches the URL and stores the file inside Post Array. Nothing is attached to a draft, nothing is scheduled and nothing reaches a platform',
  scopes: ['media:write'],
  approvalLevel: 'level_1_draft',
  // Import is a network fetch that costs bandwidth and storage, and a retrying
  // agent would otherwise store the same file several times over.
  requiresIdempotencyKey: true,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    /**
     * A URL the person gave. The application service is what validates the
     * scheme, the host and the size; this tool never fetches anything itself.
     */
    url: z.string().min(1).max(2048),
    project_id: z.string().min(1).optional(),
    ...idempotencyInputShape,
  }),
  async run(context, input): Promise<ToolResult> {
    const operation = await context.services.media.importFromUrl(context.actor, {
      url: input.url,
      ...(input.project_id === undefined ? {} : { projectId: input.project_id }),
    });

    return {
      data: {
        operation_id: operation.operationId,
        status: operation.status,
        resource_type: operation.resourceType,
        media_id: operation.resourceId,
        next_step: 'get_media',
      },
      resourceLinks:
        operation.resourceId === null
          ? [
              resourceLink(
                RESOURCE_URIS.operation(operation.operationId),
                'import operation',
                'The import that is still running.',
              ),
            ]
          : [
              resourceLink(
                RESOURCE_URIS.media(operation.resourceId),
                'media asset',
                'The imported asset.',
              ),
            ],
    };
  },
});

export const REVERSIBLE_TOOLS = [
  draftPostTool,
  requestApprovalTool,
  generateGrowthPlanTool,
  createCampaignFromPlanTool,
  importMediaTool,
];
