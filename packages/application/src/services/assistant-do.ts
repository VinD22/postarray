import {
  adaptDraftTextInputSchema,
  draftPostInputSchema,
  requestApprovalInputSchema,
  schedulePostInputSchema,
  type AssistantActionOutput,
} from '@relay/contracts';

import type { ActorContext, ServiceDeps } from '../types';
import { runGatedMutation } from './assistant-actions';
import type { AssistantDelegates } from './assistant-types';

/**
 * The four things the assistant can do on someone's behalf.
 *
 * Each one is a thin arrangement of an existing application service behind the
 * confirmation gate in `./assistant-actions.ts`. None of them contains
 * publishing logic, approval logic or queue logic: that all lives in the
 * services they call, which is where the five surfaces already share it.
 */

export interface AssistantActions {
  draftPost(
    ctx: ActorContext,
    input: unknown,
    confirmationId?: string,
  ): Promise<AssistantActionOutput>;
  adaptDraftText(
    ctx: ActorContext,
    input: unknown,
    confirmationId?: string,
  ): Promise<AssistantActionOutput>;
  schedulePost(
    ctx: ActorContext,
    input: unknown,
    confirmationId?: string,
  ): Promise<AssistantActionOutput>;
  requestApproval(
    ctx: ActorContext,
    input: unknown,
    confirmationId?: string,
  ): Promise<AssistantActionOutput>;
}

export function createAssistantActions(
  deps: ServiceDeps,
  delegates: AssistantDelegates,
): AssistantActions {
  return {
    async draftPost(ctx, rawInput, confirmationId) {
      const input = draftPostInputSchema.parse(rawInput);
      return runGatedMutation(
        deps,
        ctx,
        delegates,
        {
          tool: 'draft_post',
          projectId: input.projectId,
          // A draft that does not exist has no version and no accounts, so the
          // durable confirmation cannot fingerprint it. This stays a proposal.
          contentItemId: null,
          proposal: { projectId: input.projectId, title: input.title, body: input.body },
          confirmationId,
        },
        async () => {
          const item = await delegates.content.createDraft(ctx, {
            projectId: input.projectId,
            title: input.title,
            body: input.body,
          });
          return item.id;
        },
      );
    },

    async adaptDraftText(ctx, rawInput, confirmationId) {
      const input = adaptDraftTextInputSchema.parse(rawInput);
      return runGatedMutation(
        deps,
        ctx,
        delegates,
        {
          tool: 'adapt_draft_text',
          projectId: input.projectId,
          contentItemId: input.contentItemId,
          proposal: {
            contentItemId: input.contentItemId,
            targetId: input.targetId,
            body: input.body,
          },
          confirmationId,
        },
        async () => {
          const variant = await delegates.content.overrideVariant(ctx, {
            contentItemId: input.contentItemId,
            targetId: input.targetId,
            patch: { body: input.body },
          });
          return variant.id;
        },
      );
    },

    async schedulePost(ctx, rawInput, confirmationId) {
      const input = schedulePostInputSchema.parse(rawInput);
      // The slot is read, never reserved, while the action is only a proposal.
      // Reserving an instant before a person agreed would take a time away from
      // the queue for something that may never be confirmed.
      const slot = await delegates.queueRules.previewSlot(ctx, {
        projectId: input.projectId,
        ...(input.after === undefined ? {} : { after: input.after }),
      });
      return runGatedMutation(
        deps,
        ctx,
        delegates,
        {
          tool: 'schedule_post',
          projectId: input.projectId,
          contentItemId: input.contentItemId,
          proposal: {
            contentItemId: input.contentItemId,
            instant: slot.instant,
            ianaTimeZone: slot.ianaTimeZone,
            localDateTime: slot.localDateTime,
            reasonKeys: slot.reasons.map((reason) => reason.key),
          },
          confirmationId,
        },
        async () => {
          const job = await delegates.scheduling.schedule(ctx, {
            contentItemId: input.contentItemId,
            scheduleSpec: {
              instant: slot.instant,
              ianaTimeZone: slot.ianaTimeZone,
              repeat: null,
            },
          });
          return job.id;
        },
      );
    },

    async requestApproval(ctx, rawInput, confirmationId) {
      const input = requestApprovalInputSchema.parse(rawInput);
      return runGatedMutation(
        deps,
        ctx,
        delegates,
        {
          tool: 'request_approval',
          projectId: input.projectId,
          contentItemId: input.contentItemId,
          proposal: { contentItemId: input.contentItemId, note: input.note ?? null },
          confirmationId,
        },
        async () => {
          const approval = await delegates.approvals.request(ctx, {
            contentItemId: input.contentItemId,
            ...(input.note === undefined ? {} : { note: input.note }),
          });
          return approval.id;
        },
      );
    },
  };
}
