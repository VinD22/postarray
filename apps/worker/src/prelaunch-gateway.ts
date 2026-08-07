import { ERROR_CODES, RelayError } from '@relay/contracts';

import { ACTIVITY_NAMES, type ActivityName, type WorkerActivities } from './activities/types';

type UnavailableActivity = (input: unknown) => Promise<never>;

/**
 * Build an explicit, complete activity surface for a prelaunch deployment.
 *
 * Relay does not enable a connector until its definition of done is satisfied.
 * While no connector is verified, accepting a workflow and fabricating a
 * successful side effect would be worse than rejecting it. Each activity
 * therefore fails through the shared error taxonomy and Temporal records an
 * actionable, non-retryable failure.
 *
 * The object is generated from the canonical activity registry. The worker
 * startup boundary validates it again before registering the activities, which
 * keeps this safe even though the optional gateway module is loaded dynamically.
 */
export function createWorkerGateway(
  options: {
    readonly buildDataExport?: WorkerActivities['buildDataExport'];
    readonly dataDeletion?: Pick<
      WorkerActivities,
      | 'loadDeletionScope'
      | 'cancelScheduledJob'
      | 'revokeProviderConnection'
      | 'deleteStoredObjects'
      | 'tombstoneAnalytics'
      | 'finalizeDeletion'
      | 'markDeletionFailed'
    >;
  } = {},
): WorkerActivities {
  const unavailable = Object.fromEntries(
    ACTIVITY_NAMES.map((activity): readonly [ActivityName, UnavailableActivity] => [
      activity,
      async (_input: unknown): Promise<never> => {
        throw new RelayError(ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED, {
          messageKey: 'errors.capability_not_implemented',
          details: {
            activity,
            reason: 'no_verified_connector_enabled',
          },
        });
      },
    ]),
  );

  // This assertion is the documented dynamic-boundary shim. The canonical
  // registry above supplies every method, and main.ts validates all names again.
  return {
    ...unavailable,
    ...(options.buildDataExport === undefined ? {} : { buildDataExport: options.buildDataExport }),
    ...(options.dataDeletion ?? {}),
  } as unknown as WorkerActivities;
}
