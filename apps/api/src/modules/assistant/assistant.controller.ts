import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import type {
  AssistantActionOutput,
  AssistantTurnResponse,
  CheckPlatformFitOutput,
  PlanWeekOutput,
  ReportFailuresOutput,
  ReportWeekOutput,
  SuggestCaptionOutput,
} from '@relay/contracts';
import { z } from 'zod';

import type { ActorContext } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { parseBody } from '../../common/zod';
import {
  adaptDraftTextInputSchema,
  assistantTurnRequestSchema,
  checkPlatformFitInputSchema,
  draftPostInputSchema,
  planWeekInputSchema,
  reportFailuresInputSchema,
  reportWeekInputSchema,
  requestApprovalInputSchema,
  schedulePostInputSchema,
  suggestCaptionInputSchema,
} from './assistant.schemas';
import { AssistantService } from './assistant.service';

/**
 * The assistant.
 *
 * One conversational endpoint, plus one endpoint per catalog tool so a client
 * that already knows what it wants does not have to ask a model to route it.
 * The scopes are the same ones the equivalent MCP tool requires, because the
 * whole point of the shared catalog is that the in-app assistant and an
 * external agent are held to the same gate.
 *
 * The four mutating routes never write on a first call. They return a
 * confirmation id and a link to `/confirm/:id`; a second call carrying that id
 * is what reaches the underlying application service. Both calls are
 * idempotency-keyed, so a retried confirmation cannot act twice.
 *
 * Nothing here streams. No route in this API streams, and the problem filter,
 * the idempotency interceptor and the context enrichment interceptor all assume
 * one whole response body. A turn is one request and one response.
 */

const confirmationBodySchema = z
  .object({ confirmationId: z.string().min(1).max(64).optional() })
  .passthrough();

function confirmationOf(body: unknown): string | undefined {
  const parsed = confirmationBodySchema.safeParse(body);
  return parsed.success ? parsed.data.confirmationId : undefined;
}

function withoutConfirmation(body: unknown): unknown {
  if (typeof body !== 'object' || body === null) {
    return body;
  }
  const { confirmationId: _ignored, ...rest } = body as Record<string, unknown>;
  return rest;
}

@Controller('v1/assistant')
export class AssistantController {
  constructor(private readonly assistant: AssistantService) {}

  /** Say something to the assistant. Routing only: it performs no action. */
  @Post('turns')
  @RequireScope('drafts:read')
  @HttpCode(200)
  turn(@Actor() actor: ActorContext, @Body() body: unknown): Promise<AssistantTurnResponse> {
    return this.assistant.turn(actor, parseBody(assistantTurnRequestSchema, body));
  }

  /** A week of posts, as a proposal. Nothing is drafted and nothing is queued. */
  @Post('plans')
  @RequireScope('growth:read', 'drafts:read')
  @HttpCode(200)
  plan(@Actor() actor: ActorContext, @Body() body: unknown): Promise<PlanWeekOutput> {
    return this.assistant.plan(actor, parseBody(planWeekInputSchema, body));
  }

  @Post('caption-suggestions')
  @RequireScope('drafts:read')
  @HttpCode(200)
  suggestCaption(
    @Actor() actor: ActorContext,
    @Body() body: unknown,
  ): Promise<SuggestCaptionOutput> {
    return this.assistant.suggestCaption(actor, parseBody(suggestCaptionInputSchema, body));
  }

  /** Limits come from the live per-connection snapshot, never a static table. */
  @Post('platform-fit-checks')
  @RequireScope('drafts:read', 'accounts:read')
  @HttpCode(200)
  checkPlatformFit(
    @Actor() actor: ActorContext,
    @Body() body: unknown,
  ): Promise<CheckPlatformFitOutput> {
    return this.assistant.checkPlatformFit(actor, parseBody(checkPlatformFitInputSchema, body));
  }

  @Post('week-reports')
  @RequireScope('drafts:read')
  @HttpCode(200)
  reportWeek(@Actor() actor: ActorContext, @Body() body: unknown): Promise<ReportWeekOutput> {
    return this.assistant.reportWeek(actor, parseBody(reportWeekInputSchema, body));
  }

  @Post('failure-reports')
  @RequireScope('drafts:read')
  @HttpCode(200)
  reportFailures(
    @Actor() actor: ActorContext,
    @Body() body: unknown,
  ): Promise<ReportFailuresOutput> {
    return this.assistant.reportFailures(actor, parseBody(reportFailuresInputSchema, body));
  }

  @Post('draft-actions')
  @RequireScope('drafts:write')
  @Idempotent()
  @HttpCode(200)
  draftPost(@Actor() actor: ActorContext, @Body() body: unknown): Promise<AssistantActionOutput> {
    return this.assistant.draftPost(
      actor,
      parseBody(draftPostInputSchema, withoutConfirmation(body)),
      confirmationOf(body),
    );
  }

  @Post('adaptation-actions')
  @RequireScope('drafts:write')
  @Idempotent()
  @HttpCode(200)
  adaptDraftText(
    @Actor() actor: ActorContext,
    @Body() body: unknown,
  ): Promise<AssistantActionOutput> {
    return this.assistant.adaptDraftText(
      actor,
      parseBody(adaptDraftTextInputSchema, withoutConfirmation(body)),
      confirmationOf(body),
    );
  }

  @Post('schedule-actions')
  @RequireScope('posts:schedule')
  @Idempotent()
  @HttpCode(200)
  schedulePost(
    @Actor() actor: ActorContext,
    @Body() body: unknown,
  ): Promise<AssistantActionOutput> {
    return this.assistant.schedulePost(
      actor,
      parseBody(schedulePostInputSchema, withoutConfirmation(body)),
      confirmationOf(body),
    );
  }

  @Post('approval-actions')
  @RequireScope('drafts:write')
  @Idempotent()
  @HttpCode(200)
  requestApproval(
    @Actor() actor: ActorContext,
    @Body() body: unknown,
  ): Promise<AssistantActionOutput> {
    return this.assistant.requestApproval(
      actor,
      parseBody(requestApprovalInputSchema, withoutConfirmation(body)),
      confirmationOf(body),
    );
  }
}
