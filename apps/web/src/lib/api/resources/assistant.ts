/**
 * The assistant.
 *
 * One endpoint per catalog tool, plus the conversational routing endpoint. The
 * four mutating calls take an optional confirmation id: without one the API
 * writes nothing and returns a confirmation to approve, and with one it
 * re-checks the approved version before it acts. Both calls are idempotency
 * keyed, so a retried confirmation cannot act twice.
 *
 * Nothing here streams. The API answers a turn with one whole response body.
 */

import type {
  AssistantActionOutput,
  AssistantTurnRequest,
  AssistantTurnResponse,
  CheckPlatformFitOutput,
  PlanWeekOutput,
  ReportFailuresOutput,
  ReportWeekOutput,
  SuggestCaptionOutput,
} from '@relay/contracts';

import { call } from '../call';

function unavailableInDemo(): never {
  throw new Error('ASSISTANT_UNAVAILABLE_IN_DEMO_MODE');
}

export interface AssistantActionRequest {
  readonly body: Readonly<Record<string, unknown>>;
  readonly idempotencyKey: string;
  readonly confirmationId?: string;
}

function action(path: string, request: AssistantActionRequest): Promise<AssistantActionOutput> {
  return call(
    path,
    {
      method: 'POST',
      body:
        request.confirmationId === undefined
          ? request.body
          : { ...request.body, confirmationId: request.confirmationId },
      idempotencyKey: request.idempotencyKey,
    },
    unavailableInDemo,
  );
}

export const assistantApi = {
  turn: (input: AssistantTurnRequest): Promise<AssistantTurnResponse> =>
    call('/assistant/turns', { method: 'POST', body: input }, unavailableInDemo),

  plan: (input: {
    projectId: string;
    weekStartDate: string;
    postCount?: number;
  }): Promise<PlanWeekOutput> =>
    call('/assistant/plans', { method: 'POST', body: input }, unavailableInDemo),

  suggestCaption: (input: {
    projectId: string;
    contentItemId: string;
    tone?: string;
  }): Promise<SuggestCaptionOutput> =>
    call('/assistant/caption-suggestions', { method: 'POST', body: input }, unavailableInDemo),

  checkPlatformFit: (input: {
    projectId: string;
    contentItemId: string;
    connectionId: string;
  }): Promise<CheckPlatformFitOutput> =>
    call('/assistant/platform-fit-checks', { method: 'POST', body: input }, unavailableInDemo),

  reportWeek: (input: { projectId: string; from: string; to: string }): Promise<ReportWeekOutput> =>
    call('/assistant/week-reports', { method: 'POST', body: input }, unavailableInDemo),

  reportFailures: (input: { projectId: string }): Promise<ReportFailuresOutput> =>
    call('/assistant/failure-reports', { method: 'POST', body: input }, unavailableInDemo),

  draftPost: (request: AssistantActionRequest): Promise<AssistantActionOutput> =>
    action('/assistant/draft-actions', request),

  adaptDraftText: (request: AssistantActionRequest): Promise<AssistantActionOutput> =>
    action('/assistant/adaptation-actions', request),

  schedulePost: (request: AssistantActionRequest): Promise<AssistantActionOutput> =>
    action('/assistant/schedule-actions', request),

  requestApproval: (request: AssistantActionRequest): Promise<AssistantActionOutput> =>
    action('/assistant/approval-actions', request),
};
