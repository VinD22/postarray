import type { WorkerActivities } from '../../activities/types';
import { toIsoInstant } from '../../runtime/deterministic';
import type { ChildWorkflowDescriptor, WorkflowRuntime } from '../../runtime/types';
import type { MediaScanWorkflowInput, MediaScanWorkflowOutput } from '../inputs';

/**
 * Decide whether one uploaded asset may be published.
 *
 * One activity, no branches. Assets are created `pending` and validation
 * refuses anything that is not `clean`, so before this workflow existed no
 * uploaded image or video could ever be published: a person attached a photo,
 * scheduled the post, and it went out as text with no explanation.
 *
 * Idempotent by state rather than by a lock. The activity reads the asset,
 * returns immediately if it already holds a verdict, and only scans a row that
 * is still `pending`. A duplicated start therefore joins this run through the
 * deterministic workflow id, and a retry after a crash re-reads the row rather
 * than re-deciding it.
 *
 * A scanner that cannot reach a verdict writes `failed`, never `clean`. An
 * outage must not become an approval.
 */
export async function runMediaScan(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: MediaScanWorkflowInput,
): Promise<MediaScanWorkflowOutput> {
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

  const scanned = await activities.scanMediaAsset({
    ctx: input.ctx,
    mediaAssetId: input.mediaAssetId,
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
    mediaAssetId: input.mediaAssetId,
    scanState: scanned.scanState,
    noteKey: scanned.noteKey,
  };
}

export const mediaScanDescriptor: ChildWorkflowDescriptor<
  MediaScanWorkflowInput,
  MediaScanWorkflowOutput
> = {
  name: 'mediaScanWorkflow',
  run: runMediaScan,
};
