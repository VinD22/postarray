import { z } from 'zod';

import { defineTool } from './registry';
import type { ToolDefinition, ToolResult } from './registry';

/**
 * Composer suggestions for agents.
 *
 * The same use case as the editor's Suggest menu, Review button and posting
 * time hint, through `services.aiSuggestions`. Every tool here is a read: it
 * proposes text or reports findings and writes nothing. An agent that wants to
 * keep a suggestion puts the text into a draft with `draft_post`, which goes
 * through the ordinary approval and validation path.
 */

const NOT_WIRED = {
  status: 'unavailable',
  reason_key: 'web.suggest.unavailable.disabled',
} as const;

export const suggestCopyTool = defineTool({
  name: 'suggest_copy',
  risk: 'read',
  summary:
    'Propose text for a draft: a draft from a brief, opening lines, calls to action, a shorter version, a new tone, a per-channel version or a translation. Writes nothing.',
  sideEffects: 'none',
  scopes: ['drafts:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    kind: z.enum([
      'draft_from_brief',
      'hooks',
      'ctas',
      'shorten',
      'tone',
      'platform_variant',
      'transcreate',
    ]),
    body: z.string().max(6000).optional(),
    brief: z.string().max(4000).optional(),
    content_item_id: z.string().min(1).optional(),
    connection_id: z.string().min(1).optional(),
    tone: z.enum(['plain', 'warm', 'direct', 'technical', 'playful', 'formal']).optional(),
    target_language: z.string().min(2).max(35).optional(),
    target_characters: z.number().int().min(10).max(6000).optional(),
  }),
  async run(context, input): Promise<ToolResult> {
    const service = context.services.aiSuggestions;
    if (service === undefined) {
      return { data: NOT_WIRED, resourceLinks: [] };
    }
    const data = await service.suggest(context.actor, {
      kind: input.kind,
      ...(input.body === undefined ? {} : { body: input.body }),
      ...(input.brief === undefined ? {} : { brief: input.brief }),
      ...(input.content_item_id === undefined ? {} : { contentItemId: input.content_item_id }),
      ...(input.connection_id === undefined ? {} : { connectionId: input.connection_id }),
      ...(input.tone === undefined ? {} : { tone: input.tone }),
      ...(input.target_language === undefined ? {} : { targetLanguage: input.target_language }),
      ...(input.target_characters === undefined
        ? {}
        : { targetCharacters: input.target_characters }),
    });
    return { data, resourceLinks: [] };
  },
});

export const reviewDraftTool = defineTool({
  name: 'review_draft',
  risk: 'read',
  summary:
    'Check draft text for unsupported claims, accessibility problems and near duplicates of recent posts. Findings are suggestions and approve or block nothing.',
  sideEffects: 'none',
  scopes: ['drafts:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    body: z.string().min(1).max(6000),
    content_item_id: z.string().min(1).optional(),
    project_id: z.string().min(1).optional(),
  }),
  async run(context, input): Promise<ToolResult> {
    const service = context.services.aiSuggestions;
    if (service === undefined) {
      return { data: NOT_WIRED, resourceLinks: [] };
    }
    const data = await service.review(context.actor, {
      body: input.body,
      ...(input.content_item_id === undefined ? {} : { contentItemId: input.content_item_id }),
      ...(input.project_id === undefined ? {} : { projectId: input.project_id }),
    });
    return { data, resourceLinks: [] };
  },
});

export const suggestPostingTimeTool = defineTool({
  name: 'suggest_posting_time',
  risk: 'read',
  summary:
    "When posts on one account did best, from that account's own readings only. Unavailable below a minimum number of posts.",
  sideEffects: 'none',
  scopes: ['analytics:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({ connection_id: z.string().min(1) }),
  async run(context, input): Promise<ToolResult> {
    const service = context.services.aiSuggestions;
    if (service === undefined) {
      return { data: NOT_WIRED, resourceLinks: [] };
    }
    const data = await service.bestTime(context.actor, { connectionId: input.connection_id });
    return { data, resourceLinks: [] };
  },
});

export const SUGGESTION_READ_TOOLS: readonly ToolDefinition[] = [
  suggestCopyTool,
  reviewDraftTool,
  suggestPostingTimeTool,
];
