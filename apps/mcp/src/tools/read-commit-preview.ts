import { z } from 'zod';

import { RESOURCE_URIS, defineTool, resourceLink } from './registry';
import type { ToolDefinition, ToolResult } from './registry';

/**
 * `preview_commit`: what scheduling or publishing a draft would take, without
 * doing it.
 *
 * The same preflight the web confirm step, the REST endpoint and the CLI use.
 * It names the target count, the version checksum, anything that blocks the
 * commit and every escalation a person must acknowledge. An agent reads this
 * before `schedule_post` or `publish_post` so it can tell the person exactly
 * what will need their confirmation.
 */
export const previewCommitTool = defineTool({
  name: 'preview_commit',
  risk: 'read',
  summary:
    'Preview a schedule or an immediate publish: how many accounts, what blocks it and which warnings a person must acknowledge.',
  sideEffects: 'none',
  scopes: ['drafts:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    content_item_id: z.string().min(1),
    kind: z.enum(['publish_now', 'schedule']),
    /** Required for `schedule`: the absolute instant. */
    instant: z.string().min(1).optional(),
    iana_time_zone: z.string().min(1).optional(),
    /** Limit the preview to these connections. Omit for every target. */
    connection_ids: z.array(z.string().min(1)).min(1).max(100).optional(),
  }),
  async run(context, input): Promise<ToolResult> {
    const preview = await context.services.publishing.previewCommit(context.actor, {
      contentItemId: input.content_item_id,
      kind: input.kind,
      ...(input.instant === undefined ? {} : { scheduledAt: input.instant }),
      ...(input.iana_time_zone === undefined ? {} : { ianaTimeZone: input.iana_time_zone }),
      ...(input.connection_ids === undefined ? {} : { connectionIds: input.connection_ids }),
    });
    const note = (entry: (typeof preview.blockers)[number]) => ({
      code: entry.code,
      message_key: entry.messageKey,
      params: entry.params,
      connection_id: entry.connectionId ?? null,
    });
    return {
      data: {
        can_commit: preview.canCommit,
        requires_confirmation: preview.requiresConfirmation,
        target_count: preview.targetCount,
        external_publication_count: preview.externalPublicationCount,
        version_checksum: preview.versionChecksum,
        blockers: preview.blockers.map(note),
        escalations: preview.escalations.map(note),
        validation_issues: preview.validation.issues.map((issue) => ({
          code: issue.code,
          severity: issue.severity,
          connection_id: issue.targetId ?? null,
          message_key: issue.messageKey,
        })),
      },
      resourceLinks: [
        resourceLink(
          RESOURCE_URIS.contentItem(input.content_item_id),
          'content item',
          'The draft that was previewed.',
        ),
      ],
    };
  },
});

export const COMMIT_PREVIEW_TOOLS: readonly ToolDefinition[] = [previewCommitTool];
