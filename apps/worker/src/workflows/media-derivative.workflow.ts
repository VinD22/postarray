import { createTemporalRuntime, workerActivities } from './temporal-runtime';
import { runMediaDerivative } from './core/media-derivative.core';
import type { MediaDerivativeWorkflowInput, MediaDerivativeWorkflowOutput } from './inputs';

export async function mediaDerivativeWorkflow(
  input: MediaDerivativeWorkflowInput,
): Promise<MediaDerivativeWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runMediaDerivative(runtime, workerActivities, input);
}
