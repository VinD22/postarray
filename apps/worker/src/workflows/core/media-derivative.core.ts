import type { WorkerActivities } from '../../activities/types';
import { toIsoInstant } from '../../runtime/deterministic';
import type { ChildWorkflowDescriptor, WorkflowRuntime } from '../../runtime/types';
import type {
  MediaDerivativeWorkflowInput,
  MediaDerivativeWorkflowOutput,
} from '../inputs';

/**
 * Produce one non-generative media derivative.
 *
 * One activity, no branches, no sleep. That is not a placeholder: there is
 * exactly one side effect in this feature, which is "the object exists and a
 * row says so", and it is already idempotent by the unique constraint on
 * `(media_asset_id, preset_key)`. Splitting it in two would create a window in
 * which a row could exist without bytes, which is the one state this feature is
 * built to make impossible.
 *
 * Every retry converges. The workflow id is derived from the asset and the
 * preset key, so a duplicated start joins this run; the activity finds the row
 * the previous attempt wrote and returns it without reprocessing; and the
 * object is addressed by the checksum of its own bytes, so even a re-encode
 * lands on the same key.
 *
 * Nothing here reads a clock other than the runtime's, iterates an unordered
 * collection or races two promises, which is what makes the replay test a
 * statement about this file rather than a formality.
 */
export async function runMediaDerivative(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: MediaDerivativeWorkflowInput,
): Promise<MediaDerivativeWorkflowOutput> {
  runtime.publishStatus({
    workflowId: runtime.workflowId,
    state: 'running',
    phase: 'preparing_media',
    paused: false,
    cancelRequested: false,
    scheduledInstant: null,
    attempts: 0,
    updatedAt: toIsoInstant(runtime.now()),
    targets: [],
  });

  const produced = await activities.produceMediaDerivative({
    ctx: input.ctx,
    mediaAssetId: input.mediaAssetId,
    presetKey: input.presetKey,
    operations: input.operations,
  });

  runtime.publishStatus({
    workflowId: runtime.workflowId,
    state: 'completed',
    phase: 'ready',
    paused: false,
    cancelRequested: false,
    scheduledInstant: null,
    attempts: 1,
    updatedAt: toIsoInstant(runtime.now()),
    targets: [],
  });

  return {
    mediaAssetId: produced.mediaAssetId,
    presetKey: produced.presetKey,
    derivativeId: produced.derivativeId,
    mimeType: produced.mimeType,
    byteSize: produced.byteSize,
    width: produced.width,
    height: produced.height,
  };
}

export const mediaDerivativeDescriptor: ChildWorkflowDescriptor<
  MediaDerivativeWorkflowInput,
  MediaDerivativeWorkflowOutput
> = {
  name: 'mediaDerivativeWorkflow',
  run: runMediaDerivative,
};
