import { RelayError, type AssistantActionOutput, type AssistantToolName } from '@relay/contracts';

import type { ActorContext, ServiceDeps } from '../types';
import { requireProjectOwnership } from '../internal/project-ownership';
import { authorized } from '../internal/runtime';
import type { AssistantDelegates } from './assistant-types';

/**
 * The confirmation gate.
 *
 * Every mutating assistant action goes through exactly one path, and it is the
 * durable one that was built for MCP: `agent_confirmations`. There is no second
 * mechanism here, no "the model already asked", no boolean on a request body.
 *
 * The shape is two calls. The first names the subject, creates the durable
 * confirmation row and writes nothing at all. A person then approves it in
 * Relay, on the `/confirm/:id` screen. The second call carries the confirmation
 * id, `consume` re-fingerprints the content and refuses if anything changed,
 * and only after that does the existing application service get called.
 *
 * When the durable mechanism cannot accept this caller or this subject, the
 * answer is `proposal_only` with a reason key: nothing is written, and the
 * assistant says so rather than quietly doing the work ungated.
 */

export type MutatingToolName = Extract<
  AssistantToolName,
  'draft_post' | 'adapt_draft_text' | 'schedule_post' | 'request_approval'
>;

export interface MutatingToolRequest {
  readonly tool: MutatingToolName;
  readonly projectId: string;
  /** Null for `draft_post`: the item it would create does not exist yet. */
  readonly contentItemId: string | null;
  /** Exactly what will be written once a human confirms. */
  readonly proposal: Readonly<Record<string, unknown>>;
  readonly confirmationId: string | undefined;
}

/** i18n keys for the two reasons an action can end with nothing happening. */
export const ASSISTANT_BLOCKED_KEYS = {
  noConfirmableSubject: 'assistant.blocked.no_confirmable_subject',
  confirmationUnavailable: 'assistant.blocked.confirmation_unavailable',
} as const;

function blocked(
  tool: MutatingToolName,
  proposal: Readonly<Record<string, unknown>>,
  blockedReasonKey: string,
): AssistantActionOutput {
  return {
    tool,
    state: 'proposal_only',
    confirmationId: null,
    confirmUrl: null,
    proposal: { ...proposal },
    resultId: null,
    blockedReasonKey,
  };
}

/**
 * Prove the caller may name this project before anything else happens.
 *
 * Row level security already scopes the statements. This is the second
 * question: is this a project id this caller may name at all. It runs first so
 * a cross-workspace id never reaches a confirmation, a prompt or a write.
 */
export async function assertProjectOwned(
  deps: ServiceDeps,
  ctx: ActorContext,
  projectId: string,
): Promise<void> {
  await authorized(deps, ctx, 'content.read', undefined, async (db, actor) => {
    await requireProjectOwnership(db, actor, projectId);
  });
}

export type ExecuteMutation = () => Promise<string | null>;

export async function runGatedMutation(
  deps: ServiceDeps,
  ctx: ActorContext,
  delegates: AssistantDelegates,
  request: MutatingToolRequest,
  execute: ExecuteMutation,
): Promise<AssistantActionOutput> {
  await assertProjectOwned(deps, ctx, request.projectId);

  if (request.contentItemId === null) {
    // The confirmation row is keyed by the content item whose exact version and
    // blast radius a person approved. An item that does not exist yet cannot be
    // fingerprinted, so this stays a proposal until the composer creates it.
    return blocked(request.tool, request.proposal, ASSISTANT_BLOCKED_KEYS.noConfirmableSubject);
  }
  const contentItemId = request.contentItemId;

  if (request.confirmationId === undefined) {
    try {
      const confirmation = await delegates.agentConfirmations.request(ctx, { contentItemId });
      return {
        tool: request.tool,
        state: 'awaiting_confirmation',
        confirmationId: confirmation.id,
        confirmUrl: `/confirm/${confirmation.id}`,
        proposal: { ...request.proposal },
        resultId: null,
        blockedReasonKey: null,
      };
    } catch (error) {
      // The durable mechanism only issues confirmations to a delegated grant.
      // A caller it will not issue one to gets a proposal and no write, which
      // is the safe half of the gate rather than a way around it.
      if (RelayError.is(error) && error.code === 'FORBIDDEN') {
        deps.logger.info(
          { workspaceId: ctx.workspaceId, correlationId: ctx.correlationId, tool: request.tool },
          'assistant.action.proposal_only',
        );
        return blocked(
          request.tool,
          request.proposal,
          ASSISTANT_BLOCKED_KEYS.confirmationUnavailable,
        );
      }
      throw error;
    }
  }

  // `consume` re-fingerprints the content and throws unless a person approved
  // this exact version and this exact set of accounts. The write below is
  // unreachable without it.
  await delegates.agentConfirmations.consume(ctx, {
    confirmationId: request.confirmationId,
    contentItemId,
  });

  const resultId = await execute();
  deps.logger.info(
    {
      workspaceId: ctx.workspaceId,
      correlationId: ctx.correlationId,
      tool: request.tool,
      confirmationId: request.confirmationId,
    },
    'assistant.action.applied',
  );
  return {
    tool: request.tool,
    state: 'applied',
    confirmationId: request.confirmationId,
    confirmUrl: null,
    proposal: { ...request.proposal },
    resultId,
    blockedReasonKey: null,
  };
}
