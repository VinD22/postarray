import { Inject, Injectable } from '@nestjs/common';

import type { ActorContext, OnboardingStateView, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { CompleteOnboardingStepInput, SetOnboardingUseCaseInput } from './onboarding.schemas';

/** Transport-level delegation for onboarding. No rule lives here. */
@Injectable()
export class OnboardingService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  getState(ctx: ActorContext): Promise<OnboardingStateView> {
    return this.services.onboarding.getState(ctx);
  }

  setUseCase(ctx: ActorContext, input: SetOnboardingUseCaseInput): Promise<OnboardingStateView> {
    return this.services.onboarding.setUseCase(ctx, {
      useCase: input.useCase,
      ...(input.projectId === undefined ? {} : { projectId: input.projectId }),
    });
  }

  completeStep(
    ctx: ActorContext,
    input: CompleteOnboardingStepInput,
  ): Promise<OnboardingStateView> {
    return this.services.onboarding.completeStep(ctx, { step: input.step });
  }
}
