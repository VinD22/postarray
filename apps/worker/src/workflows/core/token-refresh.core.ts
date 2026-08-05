import { ERROR_CODES } from '@relay/contracts';

import type { WorkerActivities } from '../../activities/types.js';
import { MESSAGE_KEYS } from '../../messages.js';
import { jitterMs, parseInstant, toIsoInstant } from '../../runtime/deterministic.js';
import type { ChildWorkflowDescriptor, WorkflowRuntime } from '../../runtime/types.js';
import type {
  TokenRefreshWorkflowInput,
  TokenRefreshWorkflowOutput,
} from '../inputs.js';

/**
 * Proactive credential refresh.
 *
 * The timer fires at 70% of the credential's life, well before the provider
 * would reject a publish. A refresh that fails raises a connection incident so
 * the user is told to reconnect while there is still time, rather than finding
 * out when a scheduled post fails at 09:00.
 *
 * No token value crosses the workflow boundary. The activity reads and rotates
 * the credential inside the vault and reports back only an expiry instant.
 */

/** Fraction of the credential's life after which we refresh. */
export const REFRESH_AT_FRACTION = 0.7;

/** Floor and ceiling on the wait, so a very short or very long life is sane. */
export const MIN_REFRESH_WAIT_MS = 60_000;
export const MAX_REFRESH_WAIT_MS = 25 * 24 * 60 * 60_000;

/** Refreshes per run before the history is rolled over. */
export const REFRESHES_PER_RUN = 20;

export function refreshWaitMs(
  nowMs: number,
  expiresAt: string | null,
  lifetimeSeconds: number | null,
): number {
  if (expiresAt === null) {
    return MAX_REFRESH_WAIT_MS;
  }
  const expiryMs = parseInstant(expiresAt);
  const lifeMs =
    lifetimeSeconds === null ? Math.max(0, expiryMs - nowMs) : lifetimeSeconds * 1_000;
  const target = expiryMs - lifeMs * (1 - REFRESH_AT_FRACTION);
  return Math.min(MAX_REFRESH_WAIT_MS, Math.max(MIN_REFRESH_WAIT_MS, target - nowMs));
}

export async function runTokenRefresh(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: TokenRefreshWorkflowInput,
): Promise<TokenRefreshWorkflowOutput> {
  const { ctx } = input;
  let refreshCount = input.refreshCount;

  const finish = (reasonKey: string, incidentRaised: boolean): TokenRefreshWorkflowOutput => ({
    connectionId: input.connectionId,
    refreshCount,
    stoppedReasonKey: reasonKey,
    incidentRaised,
  });

  for (let iteration = 0; iteration < REFRESHES_PER_RUN; iteration += 1) {
    if (runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown) {
      return finish(MESSAGE_KEYS.connection.reconnectRequired, false);
    }

    const described = await activities.describeCredential({ ctx, connectionId: input.connectionId });
    if (described.revoked) {
      await activities.raiseConnectionIncident({
        ctx,
        connectionId: input.connectionId,
        messageKey: MESSAGE_KEYS.connection.revoked,
        errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
      });
      await activities.emitEvent({
        ctx,
        event: 'connection.action_required',
        resourceId: input.connectionId,
        payload: { connectionId: input.connectionId, reason: 'revoked' },
        dedupeKey: `conn:${input.connectionId}:revoked`,
      });
      return finish(MESSAGE_KEYS.connection.revoked, true);
    }
    if (!described.refreshable) {
      return finish(MESSAGE_KEYS.connection.refreshNotSupported, false);
    }

    const baseWaitMs = refreshWaitMs(
      runtime.now(),
      described.expiresAt,
      described.lifetimeSeconds,
    );
    const waitMs = jitterMs(`${input.connectionId}:refresh:${String(refreshCount)}`, baseWaitMs, {
      ratio: 0.05,
    });
    await runtime.awaitCondition(
      () => runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown,
      waitMs,
    );
    if (runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown) {
      return finish(MESSAGE_KEYS.connection.reconnectRequired, false);
    }

    let refreshed;
    try {
      refreshed = await activities.refreshCredential({ ctx, connectionId: input.connectionId });
    } catch {
      await activities.raiseConnectionIncident({
        ctx,
        connectionId: input.connectionId,
        messageKey: MESSAGE_KEYS.connection.refreshFailed,
        errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
      });
      await activities.emitEvent({
        ctx,
        event: 'connection.action_required',
        resourceId: input.connectionId,
        payload: { connectionId: input.connectionId, reason: 'refresh_failed' },
        dedupeKey: `conn:${input.connectionId}:refresh_failed:${String(refreshCount)}`,
      });
      return finish(MESSAGE_KEYS.connection.refreshFailed, true);
    }

    if (!refreshed.rotated) {
      await activities.raiseConnectionIncident({
        ctx,
        connectionId: input.connectionId,
        messageKey: MESSAGE_KEYS.connection.refreshFailed,
        errorCode: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
      });
      return finish(MESSAGE_KEYS.connection.refreshFailed, true);
    }

    refreshCount += 1;
    runtime.publishStatus({
      workflowId: runtime.workflowId,
      state: 'running',
      phase: `refreshed:${String(refreshCount)}`,
      paused: false,
      cancelRequested: false,
      scheduledInstant: refreshed.expiresAt,
      attempts: refreshCount,
      updatedAt: toIsoInstant(runtime.now()),
      targets: [],
    });
  }

  return runtime.continueAsNew({
    ...input,
    refreshCount,
  } satisfies TokenRefreshWorkflowInput);
}

export const tokenRefreshDescriptor: ChildWorkflowDescriptor<
  TokenRefreshWorkflowInput,
  TokenRefreshWorkflowOutput
> = {
  name: 'tokenRefreshWorkflow',
  run: runTokenRefresh,
};
