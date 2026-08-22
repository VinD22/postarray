/**
 * From a routed tool to a real answer.
 *
 * The turn endpoint chooses a tool and nothing else. Every argument below comes
 * from what the person typed or from the post they picked on this screen, never
 * from the model, so a tool that was routed wrongly can at worst read something
 * the person may already read.
 *
 * Three of the tools need a post to work on, and one of them belongs in the
 * composer where a person can see each account's version. Those return a
 * request for what is missing rather than an invented argument.
 */

import type { AssistantToolName } from '@relay/contracts';

import { api, newIdempotencyKey } from '@/lib/api';

export interface ToolContext {
  readonly projectId: string;
  readonly contentItemId: string | null;
  readonly connectionId: string | null;
  /** Exactly what the person typed. Used as a draft body, never rewritten. */
  readonly message: string;
  /** Now, as an ISO instant. Passed in so the caller owns the clock. */
  readonly now: Date;
}

export type AssistantResult =
  | { readonly kind: 'plan'; readonly data: Awaited<ReturnType<typeof api.assistant.plan>> }
  | { readonly kind: 'week'; readonly data: Awaited<ReturnType<typeof api.assistant.reportWeek>> }
  | {
      readonly kind: 'failures';
      readonly data: Awaited<ReturnType<typeof api.assistant.reportFailures>>;
    }
  | {
      readonly kind: 'captions';
      readonly data: Awaited<ReturnType<typeof api.assistant.suggestCaption>>;
    }
  | {
      readonly kind: 'fit';
      readonly data: Awaited<ReturnType<typeof api.assistant.checkPlatformFit>>;
    }
  | {
      readonly kind: 'action';
      readonly data: Awaited<ReturnType<typeof api.assistant.schedulePost>>;
    }
  | { readonly kind: 'needs-post' }
  | { readonly kind: 'composer-only' };

function isoDate(now: Date): string {
  return now.toISOString().slice(0, 10);
}

export async function runTool(
  tool: AssistantToolName,
  context: ToolContext,
): Promise<AssistantResult> {
  const { projectId, contentItemId, connectionId } = context;

  switch (tool) {
    case 'plan_week':
      return {
        kind: 'plan',
        data: await api.assistant.plan({ projectId, weekStartDate: isoDate(context.now) }),
      };

    case 'report_week': {
      const from = context.now.toISOString();
      const to = new Date(context.now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      return { kind: 'week', data: await api.assistant.reportWeek({ projectId, from, to }) };
    }

    case 'report_failures':
      return { kind: 'failures', data: await api.assistant.reportFailures({ projectId }) };

    case 'suggest_caption':
      if (contentItemId === null) {
        return { kind: 'needs-post' };
      }
      return {
        kind: 'captions',
        data: await api.assistant.suggestCaption({ projectId, contentItemId }),
      };

    case 'check_platform_fit':
      if (contentItemId === null || connectionId === null) {
        return { kind: 'needs-post' };
      }
      return {
        kind: 'fit',
        data: await api.assistant.checkPlatformFit({ projectId, contentItemId, connectionId }),
      };

    case 'draft_post':
      return {
        kind: 'action',
        data: await api.assistant.draftPost({
          body: { projectId, title: null, body: context.message },
          idempotencyKey: newIdempotencyKey('assistant-draft'),
        }),
      };

    case 'schedule_post':
      if (contentItemId === null) {
        return { kind: 'needs-post' };
      }
      return {
        kind: 'action',
        data: await api.assistant.schedulePost({
          body: { projectId, contentItemId },
          idempotencyKey: newIdempotencyKey('assistant-schedule'),
        }),
      };

    case 'request_approval':
      if (contentItemId === null) {
        return { kind: 'needs-post' };
      }
      return {
        kind: 'action',
        data: await api.assistant.requestApproval({
          body: { projectId, contentItemId },
          idempotencyKey: newIdempotencyKey('assistant-approval'),
        }),
      };

    case 'adapt_draft_text':
      // Rewriting one account's version is a composer job: it is the only
      // place a person can see what that account will actually show.
      return { kind: 'composer-only' };
  }
}

/** The second call, carrying the approval a person just gave. */
export async function applyAction(
  tool: AssistantToolName,
  context: ToolContext,
  confirmationId: string,
): Promise<AssistantResult> {
  const { projectId, contentItemId } = context;
  if (contentItemId === null) {
    return { kind: 'needs-post' };
  }
  const idempotencyKey = newIdempotencyKey('assistant-apply');

  if (tool === 'schedule_post') {
    return {
      kind: 'action',
      data: await api.assistant.schedulePost({
        body: { projectId, contentItemId },
        idempotencyKey,
        confirmationId,
      }),
    };
  }
  if (tool === 'request_approval') {
    return {
      kind: 'action',
      data: await api.assistant.requestApproval({
        body: { projectId, contentItemId },
        idempotencyKey,
        confirmationId,
      }),
    };
  }
  return { kind: 'needs-post' };
}
