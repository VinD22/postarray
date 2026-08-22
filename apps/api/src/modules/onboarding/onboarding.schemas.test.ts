import { describe, expect, it } from 'vitest';

import { ID_PREFIXES, newId } from '@relay/contracts';

import { completeOnboardingStepSchema, setOnboardingUseCaseSchema } from './onboarding.schemas';

describe('onboarding use case input', () => {
  it('accepts the four supported answers, with or without a project', () => {
    expect(setOnboardingUseCaseSchema.parse({ useCase: 'creator' })).toEqual({
      useCase: 'creator',
    });
    const projectId = newId(ID_PREFIXES.project);
    expect(setOnboardingUseCaseSchema.parse({ useCase: 'agency', projectId })).toEqual({
      useCase: 'agency',
      projectId,
    });
  });

  it('rejects an unknown answer, an unknown field and a foreign id', () => {
    expect(() => setOnboardingUseCaseSchema.parse({ useCase: 'enterprise' })).toThrow();
    expect(() =>
      setOnboardingUseCaseSchema.parse({ useCase: 'team', tier: 'relay_studio' }),
    ).toThrow();
    expect(() =>
      setOnboardingUseCaseSchema.parse({
        useCase: 'team',
        projectId: newId(ID_PREFIXES.workspace),
      }),
    ).toThrow();
  });
});

describe('onboarding step input', () => {
  it('accepts the step ids the first run sequence actually uses', () => {
    for (const step of ['plan', 'workspace', 'use-case', 'connect', 'compose', 'done']) {
      expect(completeOnboardingStepSchema.parse({ step })).toEqual({ step });
    }
  });

  it('refuses anything that could be a sentence rather than a step id', () => {
    expect(() => completeOnboardingStepSchema.parse({ step: 'Connect Account' })).toThrow();
    expect(() => completeOnboardingStepSchema.parse({ step: '' })).toThrow();
    expect(() => completeOnboardingStepSchema.parse({ step: '1step' })).toThrow();
    expect(() => completeOnboardingStepSchema.parse({ step: 'a'.repeat(33) })).toThrow();
    expect(() => completeOnboardingStepSchema.parse({ step: 'done', extra: true })).toThrow();
  });
});
