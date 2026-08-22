import { Inject, Injectable } from '@nestjs/common';
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

import type { ActorContext, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';

/** Transport-level delegation for the assistant. No logic lives here. */
@Injectable()
export class AssistantService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  turn(ctx: ActorContext, request: AssistantTurnRequest): Promise<AssistantTurnResponse> {
    return this.services.assistant.turn(ctx, request);
  }

  plan(ctx: ActorContext, input: unknown): Promise<PlanWeekOutput> {
    return this.services.assistant.plan(ctx, input);
  }

  suggestCaption(ctx: ActorContext, input: unknown): Promise<SuggestCaptionOutput> {
    return this.services.assistant.suggestCaption(ctx, input);
  }

  checkPlatformFit(ctx: ActorContext, input: unknown): Promise<CheckPlatformFitOutput> {
    return this.services.assistant.checkPlatformFit(ctx, input);
  }

  reportWeek(ctx: ActorContext, input: unknown): Promise<ReportWeekOutput> {
    return this.services.assistant.reportWeek(ctx, input);
  }

  reportFailures(ctx: ActorContext, input: unknown): Promise<ReportFailuresOutput> {
    return this.services.assistant.reportFailures(ctx, input);
  }

  draftPost(
    ctx: ActorContext,
    input: unknown,
    confirmationId?: string,
  ): Promise<AssistantActionOutput> {
    return this.services.assistant.draftPost(ctx, input, confirmationId);
  }

  adaptDraftText(
    ctx: ActorContext,
    input: unknown,
    confirmationId?: string,
  ): Promise<AssistantActionOutput> {
    return this.services.assistant.adaptDraftText(ctx, input, confirmationId);
  }

  schedulePost(
    ctx: ActorContext,
    input: unknown,
    confirmationId?: string,
  ): Promise<AssistantActionOutput> {
    return this.services.assistant.schedulePost(ctx, input, confirmationId);
  }

  requestApproval(
    ctx: ActorContext,
    input: unknown,
    confirmationId?: string,
  ): Promise<AssistantActionOutput> {
    return this.services.assistant.requestApproval(ctx, input, confirmationId);
  }
}
