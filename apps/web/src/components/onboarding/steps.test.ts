import { describe, expect, it } from 'vitest';

import {
  isStepReachable,
  nextIncompleteStep,
  ONBOARDING_STEPS,
  type OnboardingProgress,
} from './steps';

const nothingDone: OnboardingProgress = {
  checkoutConfirmed: false,
  workspaceNamed: false,
  useCaseChosen: false,
  connectionCount: 0,
  firstPostScheduled: false,
};

describe('onboarding progression', () => {
  it('starts at the billing choice', () => {
    expect(nextIncompleteStep(nothingDone)).toBe('plan');
  });

  it('walks the sequence one step at a time', () => {
    const sequence: [Partial<OnboardingProgress>, string][] = [
      [{ checkoutConfirmed: true }, 'workspace'],
      [{ checkoutConfirmed: true, workspaceNamed: true }, 'use-case'],
      [{ checkoutConfirmed: true, workspaceNamed: true, useCaseChosen: true }, 'connect'],
      [
        {
          checkoutConfirmed: true,
          workspaceNamed: true,
          useCaseChosen: true,
          connectionCount: 1,
        },
        'compose',
      ],
      [
        {
          checkoutConfirmed: true,
          workspaceNamed: true,
          useCaseChosen: true,
          connectionCount: 1,
          firstPostScheduled: true,
        },
        'done',
      ],
    ];

    for (const [progress, expected] of sequence) {
      expect(nextIncompleteStep({ ...nothingDone, ...progress })).toBe(expected);
    }
  });

  it('lets a user go back to a finished step but not skip ahead', () => {
    const progress: OnboardingProgress = { ...nothingDone, checkoutConfirmed: true };
    expect(isStepReachable('plan', progress)).toBe(true);
    expect(isStepReachable('workspace', progress)).toBe(true);
    expect(isStepReachable('connect', progress)).toBe(false);
  });

  it('keeps the billing choice as the second overall step', () => {
    expect(ONBOARDING_STEPS[0]?.id).toBe('plan');
    expect(ONBOARDING_STEPS).toHaveLength(6);
  });
});
