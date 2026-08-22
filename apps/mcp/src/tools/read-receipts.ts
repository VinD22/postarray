import { z } from 'zod';

import { RESOURCE_URIS, defineTool, pageInputShape, resourceLink } from './registry';
import type { ToolDefinition, ToolResult } from './registry';

/**
 * Receipt recovery.
 *
 * The operational question these answer is "an agent lost the job id, or the
 * transport died mid-call: what actually got published?". Without them the only
 * honest answer an agent can give is "I do not know", and an agent that does
 * not know whether it published is an agent that publishes twice.
 *
 * Both are `risk: 'read'`. A receipt is immutable evidence; reading it changes
 * nothing, and neither tool can cause or undo a publication. They live in their
 * own file rather than in `read.ts` only because that file is already at its
 * size limit.
 */

export const listRecentReceiptsTool = defineTool({
  name: 'list_recent_receipts',
  risk: 'read',
  summary:
    'List the most recent publication receipts for this workspace, newest first, as a bounded page.',
  sideEffects: 'none',
  scopes: ['analytics:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({ ...pageInputShape }),
  async run(context, input): Promise<ToolResult> {
    const page = await context.services.receipts.listRecent(context.actor, {
      ...(input.cursor === undefined ? {} : { cursor: input.cursor }),
      limit: input.limit,
    });
    return {
      data: {
        receipts: page.data.map((row) => ({
          receipt_id: row.receiptId,
          content_item_id: row.contentItemId,
          provider: row.provider,
          account_label: row.accountLabel,
          state: row.state,
          published_at: row.publishedAt,
          permalink: row.permalink,
          failed_item_count: row.failedItemCount,
        })),
        next_cursor: page.pageInfo.nextCursor,
        has_more: page.pageInfo.hasMore,
        next_step: 'get_receipt',
      },
      resourceLinks: page.data.map((row) =>
        resourceLink(
          RESOURCE_URIS.receipt(row.receiptId),
          'publication receipt',
          'Immutable evidence of one external publication.',
        ),
      ),
    };
  },
});

export const getReceiptTool = defineTool({
  name: 'get_receipt',
  risk: 'read',
  summary:
    'Read one publication receipt: the external post id, its permalink and the exact content version that was published.',
  sideEffects: 'none',
  scopes: ['analytics:read'],
  approvalLevel: 'level_0_read',
  requiresIdempotencyKey: false,
  requiresHumanConfirmation: false,
  inputSchema: z.object({ receipt_id: z.string().min(1) }),
  async run(context, input): Promise<ToolResult> {
    const receipt = await context.services.receipts.get(context.actor, input.receipt_id);
    return {
      data: {
        receipt_id: receipt.id,
        publish_job_id: receipt.publishJobId,
        connection_id: receipt.connectionId,
        provider: receipt.provider,
        external_post_id: receipt.externalPostId,
        permalink: receipt.permalink,
        content_version_checksum: receipt.contentVersionChecksum,
        scheduled_instant: receipt.scheduledInstant,
        published_at: receipt.publishedAt,
      },
      resourceLinks: [
        resourceLink(
          RESOURCE_URIS.receipt(receipt.id),
          'publication receipt',
          'Immutable evidence of one external publication.',
        ),
        resourceLink(RESOURCE_URIS.job(receipt.publishJobId), 'publish job', 'The job that ran.'),
      ],
    };
  },
});

export const RECEIPT_READ_TOOLS: readonly ToolDefinition[] = [
  listRecentReceiptsTool,
  getReceiptTool,
];
