/**
 * The first run sequence.
 *
 * Six steps, in this order, aimed at a verified scheduled post in under ten
 * minutes. Nothing here asks for brand voice, teammates or automation: those
 * questions come after the first real result.
 *
 * WCAG 2.2 SC 3.3.7 (Redundant Entry): the time zone and the language chosen in
 * `workspace` carry forward into every later step and are never asked twice.
 */
export const ONBOARDING_STEPS = [
  { id: 'plan', href: '/onboarding/plan', labelKey: 'onboarding.stepName.plan' },
  { id: 'workspace', href: '/onboarding/workspace', labelKey: 'onboarding.stepName.workspace' },
  { id: 'use-case', href: '/onboarding/use-case', labelKey: 'onboarding.stepName.role' },
  { id: 'connect', href: '/onboarding/connect', labelKey: 'onboarding.stepName.connect' },
  { id: 'compose', href: '/onboarding/compose', labelKey: 'onboarding.stepName.compose' },
  { id: 'done', href: '/onboarding/done', labelKey: 'onboarding.stepName.receipt' },
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]['id'];

export function stepIndex(id: OnboardingStepId): number {
  return ONBOARDING_STEPS.findIndex((step) => step.id === id);
}

export interface OnboardingProgress {
  readonly checkoutConfirmed: boolean;
  readonly workspaceNamed: boolean;
  readonly useCaseChosen: boolean;
  readonly connectionCount: number;
  readonly firstPostScheduled: boolean;
}

/** The first step that is not finished yet. */
export function nextIncompleteStep(progress: OnboardingProgress): OnboardingStepId {
  if (!progress.checkoutConfirmed) {
    return 'plan';
  }
  if (!progress.workspaceNamed) {
    return 'workspace';
  }
  if (!progress.useCaseChosen) {
    return 'use-case';
  }
  if (progress.connectionCount === 0) {
    return 'connect';
  }
  if (!progress.firstPostScheduled) {
    return 'compose';
  }
  return 'done';
}

/** True when the user may open this step directly. */
export function isStepReachable(target: OnboardingStepId, progress: OnboardingProgress): boolean {
  return stepIndex(target) <= stepIndex(nextIncompleteStep(progress));
}
