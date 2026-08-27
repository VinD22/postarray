import { ERROR_CODES, RelayError } from '@relay/contracts';
import type { ConnectorExecutionGateway } from '@relay/runtime';
import { ACTIVITY_NAMES, type ActivityName, type WorkerActivities } from './activities/types';
import type { ProviderActivities } from './connector-execution-activities';
import { createConnectorActivities } from './connector-activities';

type PublishingActivities = Pick<
  WorkerActivities,
  | 'preflightCampaign'
  | 'prepareTargetMedia'
  | 'beginPublishAttempt'
  | 'ensureNotAlreadyPublished'
  | 'finalizeAttempt'
  | 'setTargetState'
  | 'setJobState'
  | 'writeReceipt'
  | 'emitEvent'
  | 'notify'
  | 'scheduleAnalyticsFetches'
>;

type WebhookActivities = Pick<
  WorkerActivities,
  | 'loadWebhookDelivery'
  | 'deliverWebhook'
  | 'recordWebhookAttempt'
  | 'disableWebhookEndpoint'
  | 'deadLetterWebhookDelivery'
>;

type BulkImportActivities = Pick<WorkerActivities, 'readBulkImportVerdict' | 'applyBulkImportRows'>;

type MediaDerivativeActivities = Pick<WorkerActivities, 'produceMediaDerivative'>;

/**
 * Everything that runs without a connector: repeats, feeds, rules and the
 * per-post feedback row. None of these calls a provider, so they are grouped
 * apart from the connector bridge and are available even where no connector is
 * verified yet.
 */
type AutomationActivities = Pick<
  WorkerActivities,
  | 'planRepeatOccurrence'
  | 'createOccurrenceJob'
  | 'fetchFeed'
  | 'filterNewFeedItems'
  | 'processFeedItems'
  | 'recordFeedPoll'
  | 'loadRuleDefinition'
  | 'evaluateRuleConditions'
  | 'reserveRuleExecution'
  | 'executeRuleAction'
  | 'recordRuleRun'
  | 'generatePostFeedback'
>;

type UnavailableActivity = (input: unknown) => Promise<never>;

/**
 * Build an explicit, complete activity surface for a prelaunch deployment.
 *
 * Post Array does not enable a connector until its definition of done is satisfied.
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
    readonly publishing?: Partial<PublishingActivities>;
    readonly connectorBridge?: ProviderActivities | null;
    readonly connectorExecution?: ConnectorExecutionGateway | null;
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
    readonly webhooks?: Partial<WebhookActivities>;
    readonly bulkImports?: Partial<BulkImportActivities>;
    readonly mediaDerivatives?: Partial<MediaDerivativeActivities>;
    readonly automation?: Partial<AutomationActivities>;
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
    ...(options.publishing ?? {}),
    ...(options.connectorExecution === null || options.connectorExecution === undefined
      ? {}
      : createConnectorActivities(options.connectorExecution)),
    ...(options.buildDataExport === undefined ? {} : { buildDataExport: options.buildDataExport }),
    ...(options.dataDeletion ?? {}),
    ...(options.webhooks ?? {}),
    ...(options.bulkImports ?? {}),
    ...(options.mediaDerivatives ?? {}),
    ...(options.automation ?? {}),
    ...(options.connectorBridge ?? {}),
  } as unknown as WorkerActivities;
}
