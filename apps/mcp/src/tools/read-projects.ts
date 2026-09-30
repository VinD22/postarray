import { z } from 'zod';

import { defineTool, pageInputShape } from './registry';
import type { ToolDefinition, ToolResult } from './registry';

/**
 * `list_projects`.
 *
 * `draft_post` requires a `project_id`, because a draft always belongs to a
 * project, and nothing else in the catalog returns one. Without this tool an
 * agent could read the whole calendar and still not be able to write a single
 * draft. Archived projects are left out: a draft cannot be filed under one.
 */
export const listProjectsTool = defineTool({
  name: 'list_projects',
  risk: 'read',
  summary:
    'List the projects in this workspace, with the accounts each one uses. Use a project_id from here in draft_post.',
  sideEffects: 'none',
  scopes: ['drafts:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({ ...pageInputShape }),
  async run(context, input): Promise<ToolResult> {
    const page = await context.services.projects.list(context.actor, {
      ...(input.cursor === undefined ? {} : { cursor: input.cursor }),
      limit: input.limit,
    });
    return {
      data: {
        projects: page.data
          .filter((project) => !project.archived)
          .map((project) => ({
            project_id: project.id,
            name: project.name,
            default_time_zone: project.defaultTimeZone,
            connection_ids: project.connectionIds,
          })),
        next_cursor: page.pageInfo.nextCursor,
        has_more: page.pageInfo.hasMore,
        next_step: 'draft_post',
      },
      resourceLinks: [],
    };
  },
});

export const PROJECT_READ_TOOLS: readonly ToolDefinition[] = [listProjectsTool];
