import { z } from 'zod';
import { ID_PREFIXES, idSchema, RelayError } from '@relay/contracts';

import { RESOURCE_URIS, defineTool, idempotencyInputShape, resourceLink } from './registry';
import type { ToolResult } from './registry';
import type { ConfirmationSummary } from '../confirmations';
import type { ActorContextLike, ContentItemSummary, RelayServicePort } from '../ports';

/**
 * Consequential tools.
 *
 * These are the only three tools that can cause something to appear on, or
 * disappear from, a real platform. Everything about them is deliberate:
 *
 * - each requires an `idempotency_key`, rejected rather than defaulted;
 * - `publish_post` requires a confirmation a person gave inside Post Array, not one
 *   the agent host claims to have collected;
 * - the plan a person confirms is fingerprinted, so changing the content after
 *   the confirmation invalidates it;
 * - the application layer re-checks all of it. Nothing here is the only line of
 *   defence.
 *
 * There is no `publish_everywhere`. A tool whose blast radius is invisible from
 * its name and arguments does not get written.
 */

/**
 * The exact plan a person is asked to approve.
 *
 * Built from the draft's own variants, not from a list of the workspace's
 * connections, so it names precisely the accounts that would receive a post and
 * nothing else.
 */
function buildConfirmationSummary(
  item: ContentItemSummary,
  labels: ReadonlyMap<string, string>,
): ConfirmationSummary {
  if (item.currentChecksum === null) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'CONTENT_VERSION_NOT_FROZEN', contentItemId: item.id },
    });
  }
  const accounts = item.variants.map((variant) => ({
    connectionId: variant.connectionId,
    label: labels.get(variant.connectionId) ?? variant.connectionId,
  }));
  return {
    contentItemId: item.id,
    versionChecksum: item.currentChecksum,
    accountCount: accounts.length,
    externalPublicationCount: accounts.length,
    providers: [...new Set(item.variants.map((variant) => variant.provider))],
    accounts,
  };
}

/** Display labels for the accounts named in the plan. Ids are not readable. */
async function labelsFor(
  context: { services: { connections: { list: RelayServicePort['connections']['list'] } } },
  actor: ActorContextLike,
): Promise<ReadonlyMap<string, string>> {
  const page = await context.services.connections.list(actor, { limit: 50 });
  return new Map(
    page.data.map(
      (connection) => [connection.id, connection.handle ?? connection.displayName] as const,
    ),
  );
}

export const schedulePostTool = defineTool({
  name: 'schedule_post',
  risk: 'consequential',
  summary: 'Schedule an existing draft to publish at an exact instant in an exact time zone.',
  sideEffects:
    'creates a durable publish job that will post to every target account at the given time',
  scopes: ['posts:schedule'],
  approvalLevel: 'level_2_scheduled',
  requiresIdempotencyKey: true,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    content_item_id: z.string().min(1),
    /** An absolute instant. Never a local wall-clock time on its own. */
    instant: z.string().min(1),
    /** The zone the person actually chose, kept alongside the instant. */
    iana_time_zone: z.string().min(1),
    ...idempotencyInputShape,
  }),
  async run(context, input): Promise<ToolResult> {
    const job = await context.services.scheduling.schedule(context.actor, {
      contentItemId: input.content_item_id,
      scheduleSpec: {
        instant: input.instant,
        ianaTimeZone: input.iana_time_zone,
        repeat: null,
      },
    });

    return {
      data: {
        job_id: job.id,
        content_item_id: job.contentItemId,
        connection_id: job.connectionId,
        provider: job.provider,
        state: job.state,
        scheduled_instant: job.scheduledInstant,
        iana_time_zone: job.ianaTimeZone,
        approval_required: job.approvalRequired,
        approval_state: job.approvalState,
      },
      resourceLinks: [resourceLink(RESOURCE_URIS.job(job.id), 'publish job', 'The scheduled job.')],
    };
  },
});

export const publishPostTool = defineTool({
  name: 'publish_post',
  risk: 'consequential',
  summary: 'Publish an existing draft to its target accounts immediately.',
  sideEffects:
    'posts to every target account now. It cannot be recalled from Post Array once a platform has accepted it',
  scopes: ['posts:publish'],
  approvalLevel: 'level_3_confirm',
  requiresIdempotencyKey: true,
  requiresHumanConfirmation: true,
  inputSchema: z.object({
    content_item_id: z.string().min(1),
    /**
     * Omit on the first call. The tool returns a confirmation link and does
     * nothing. Pass the id back after a person has approved it in Post Array.
     */
    confirmation_id: idSchema(ID_PREFIXES.agentConfirmation).optional(),
    ...idempotencyInputShape,
  }),
  async run(context, input): Promise<ToolResult> {
    const item = await context.services.content.get(context.actor, input.content_item_id);
    const summary = buildConfirmationSummary(item, await labelsFor(context, context.actor));

    if (input.confirmation_id === undefined) {
      const ticket = await context.confirmations.request({
        actor: context.actor,
        workspaceId: context.actor.workspaceId,
        grantId: context.grant.grantId,
        contentItemId: input.content_item_id,
        summary,
      });
      // Nothing has been published. The agent must come back with the id after
      // a person approves it in Post Array, in a session this server did not create.
      return {
        data: {
          status: 'confirmation_required',
          confirmation_id: ticket.confirmationId,
          confirm_url: ticket.confirmUrl,
          expires_at: ticket.expiresAt,
          will_publish_to: summary.accounts.map((account) => account.label),
          external_publication_count: summary.externalPublicationCount,
        },
        resourceLinks: [
          resourceLink(
            RESOURCE_URIS.contentItem(input.content_item_id),
            'content item',
            'What a person is being asked to approve.',
          ),
        ],
        pendingConfirmation: {
          confirmationId: ticket.confirmationId,
          confirmUrl: ticket.confirmUrl,
        },
      };
    }

    const confirmation = await context.confirmations.consume({
      actor: context.actor,
      confirmationId: input.confirmation_id,
      workspaceId: context.actor.workspaceId,
      grantId: context.grant.grantId,
      contentItemId: input.content_item_id,
      summary,
    });

    const job = await context.services.publishing.publishNow(context.actor, {
      contentItemId: input.content_item_id,
      confirmation: {
        acknowledgedTargetCount: summary.externalPublicationCount,
        acknowledgedVersionChecksum: summary.versionChecksum,
        acknowledgedEscalations: ['immediate_publish'],
      },
    });
    const receipts = await context.services.receipts.listForJob(context.actor, job.id);

    return {
      data: {
        status: 'published',
        job_id: job.id,
        state: job.state,
        provider: job.provider,
        connection_id: job.connectionId,
        confirmed_by: confirmation.confirmedBy,
        confirmed_at: confirmation.confirmedAt,
        receipts: receipts.map((receipt) => ({
          receipt_id: receipt.id,
          external_post_id: receipt.externalPostId,
          permalink: receipt.permalink,
        })),
      },
      receiptIds: receipts.map((receipt) => receipt.id),
      resourceLinks: [
        resourceLink(RESOURCE_URIS.job(job.id), 'publish job', 'The job that ran.'),
        ...receipts.map((receipt) =>
          resourceLink(
            RESOURCE_URIS.receipt(receipt.id),
            'publication receipt',
            'Immutable evidence of this publication.',
          ),
        ),
      ],
    };
  },
});

export const cancelPostTool = defineTool({
  name: 'cancel_post',
  risk: 'consequential',
  summary: 'Cancel a scheduled publish job so it will not run.',
  sideEffects:
    'stops a job that would have posted. A job that has already reached a platform cannot be recalled and is not cancelled by this tool',
  scopes: ['posts:cancel'],
  approvalLevel: 'level_2_scheduled',
  requiresIdempotencyKey: true,
  requiresHumanConfirmation: false,
  inputSchema: z.object({
    job_id: z.string().min(1),
    reason: z.string().min(1).max(500),
    ...idempotencyInputShape,
  }),
  async run(context, input): Promise<ToolResult> {
    const existing = await context.services.publishing.getJob(context.actor, input.job_id);
    if (existing.state === 'published' || existing.state === 'partially_published') {
      // Saying "cancelled" about something already live would be a lie, and an
      // agent would act on it.
      throw new RelayError('CONFLICT', {
        messageKey: 'error.conflict.message',
        details: { reason: 'ALREADY_PUBLISHED', jobId: input.job_id, state: existing.state },
      });
    }

    const job = await context.services.scheduling.cancel(context.actor, {
      jobId: input.job_id,
      reason: input.reason,
    });

    return {
      data: {
        job_id: job.id,
        state: job.state,
        provider: job.provider,
        connection_id: job.connectionId,
        was_scheduled_for: job.scheduledInstant,
      },
      resourceLinks: [resourceLink(RESOURCE_URIS.job(job.id), 'publish job', 'The cancelled job.')],
    };
  },
});

export const CONSEQUENTIAL_TOOLS = [schedulePostTool, publishPostTool, cancelPostTool];
