import { redirect } from 'next/navigation';

import { nextIncompleteStep, ONBOARDING_STEPS } from '@/components/onboarding/steps';
import { api } from '@/lib/api';

/**
 * The onboarding entry point.
 *
 * It resolves the first unfinished step and sends the user there, so closing
 * the tab mid-setup and coming back resumes rather than restarts.
 */
export default async function OnboardingIndex() {
  const state = await api.onboarding.getState();
  const next = nextIncompleteStep({
    checkoutConfirmed: state.checkoutConfirmed,
    workspaceNamed: state.workspaceNamed,
    useCaseChosen: state.useCase !== null,
    connectionCount: state.connectionCount,
    firstPostScheduled: state.firstPostScheduled,
  });

  const step = ONBOARDING_STEPS.find((entry) => entry.id === next) ?? ONBOARDING_STEPS[0];
  redirect(step.href);
}
