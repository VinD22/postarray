import { Body, Controller, Get, HttpCode, Patch } from '@nestjs/common';

import type { ActorContext, OnboardingStateView } from '../../application/port';
import { Actor, RequireScope } from '../../common/decorators';
import { parseBody } from '../../common/zod';
import { completeOnboardingStepSchema, setOnboardingUseCaseSchema } from './onboarding.schemas';
import { OnboardingService } from './onboarding.service';

/**
 * The first sixty seconds.
 *
 * Three endpoints, all of them about one person's progress in one workspace.
 * Reading is a read of the workspace the caller already holds, so it sits on
 * `accounts:read`; recording a step is a write about that same membership and
 * sits on `accounts:write`. Neither creates or changes anything a person could
 * be billed for, which is why neither is idempotency-keyed: re-recording a
 * finished step is defined to be a no-op rather than a duplicate.
 */
@Controller('v1/onboarding')
export class OnboardingController {
  constructor(private readonly onboarding: OnboardingService) {}

  /** Where this person is in the first run, and what is genuinely done. */
  @Get()
  @RequireScope('accounts:read')
  getState(@Actor() actor: ActorContext): Promise<OnboardingStateView> {
    return this.onboarding.getState(actor);
  }

  /** What the person says they are here to do. Personalises copy only. */
  @Patch('use-case')
  @RequireScope('accounts:write')
  @HttpCode(200)
  setUseCase(@Actor() actor: ActorContext, @Body() body: unknown): Promise<OnboardingStateView> {
    return this.onboarding.setUseCase(actor, parseBody(setOnboardingUseCaseSchema, body));
  }

  /** Marks one step finished so a refresh resumes where the person left off. */
  @Patch('steps')
  @RequireScope('accounts:write')
  @HttpCode(200)
  completeStep(@Actor() actor: ActorContext, @Body() body: unknown): Promise<OnboardingStateView> {
    return this.onboarding.completeStep(actor, parseBody(completeOnboardingStepSchema, body));
  }
}
