import { ERROR_CODES, RelayError } from '@relay/contracts';
import type { ConnectorExecutionGateway } from '@relay/runtime';

import type { WorkerActivities } from './activities/types';

export type ProviderActivities = Pick<
  WorkerActivities,
  | 'publishTarget'
  | 'pollPublishStatus'
  | 'prepareTargetMedia'
  | 'refreshCredential'
  | 'revokeProviderConnection'
  | 'fetchPostMetrics'
  | 'fetchAccountMetrics'
  | 'revalidateTarget'
  | 'ensureNotAlreadyPublished'
>;

/**
 * Worker-facing extension implemented by the process connector gateway.
 *
 * Keeping this structural is intentional: runtime owns credentials and provider
 * payload construction, while the worker only owns the Temporal-safe activity
 * contract. A gateway without the Phase A2 worker surface remains fail closed.
 */
type WorkerConnectorExecution = ConnectorExecutionGateway & Partial<ProviderActivities>;

function missing(activity: keyof ProviderActivities): RelayError {
  return new RelayError(ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED, {
    messageKey: 'errors.capability_not_implemented',
    details: { activity, reason: 'connector_activity_not_configured' },
  });
}

function requireActivity<K extends keyof ProviderActivities>(
  gateway: WorkerConnectorExecution,
  name: K,
): ProviderActivities[K] {
  const activity = gateway[name];
  if (typeof activity !== 'function') throw missing(name);
  return activity.bind(gateway) as ProviderActivities[K];
}

export function createConnectorActivitiesFromBridge(
  bridge: ProviderActivities,
): ProviderActivities {
  return bridge;
}

export function createConnectorActivities(
  connectorExecution: ConnectorExecutionGateway,
): ProviderActivities {
  const gateway: WorkerConnectorExecution = connectorExecution;
  return {
    publishTarget: (input) => requireActivity(gateway, 'publishTarget')(input),
    pollPublishStatus: (input) => requireActivity(gateway, 'pollPublishStatus')(input),
    prepareTargetMedia: (input) => requireActivity(gateway, 'prepareTargetMedia')(input),
    refreshCredential: (input) => requireActivity(gateway, 'refreshCredential')(input),
    revokeProviderConnection: (input) =>
      requireActivity(gateway, 'revokeProviderConnection')(input),
    fetchPostMetrics: (input) => requireActivity(gateway, 'fetchPostMetrics')(input),
    fetchAccountMetrics: (input) => requireActivity(gateway, 'fetchAccountMetrics')(input),
    revalidateTarget: (input) => requireActivity(gateway, 'revalidateTarget')(input),
    ensureNotAlreadyPublished: (input) =>
      requireActivity(gateway, 'ensureNotAlreadyPublished')(input),
  };
}
