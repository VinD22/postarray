import { RelayError, type ErrorCode } from '@relay/contracts';
import {
  createLogger,
  productMetrics,
  runWithContext,
  withSpan,
  type Logger,
} from '@relay/observability';
import { ApplicationFailure } from '@temporalio/common';

import type { ActivityContext, ActivityName, WorkerActivities } from './types.js';
import { nowMs } from '../runtime/clock.js';

/**
 * The activity layer.
 *
 * Activities are the only place in this app that performs IO. This module does
 * not perform any itself: it wraps a gateway supplied by `@relay/application`
 * so every activity gets the same four things, exactly once, in the same order:
 *
 * 1. the ambient request context, so a log line always carries the workspace,
 *    the correlation id and the surface;
 * 2. a span named after the activity;
 * 3. failure normalization, so a `RelayError` becomes an `ApplicationFailure`
 *    whose `type` is the stable error code and whose `nonRetryable` flag comes
 *    from the taxonomy rather than from a guess at the call site;
 * 4. redaction, inherited from the logger, so a token can never reach a
 *    transport buffer.
 *
 * The gateway has the same shape as `WorkerActivities`. That is deliberate: the
 * worker declares what it needs, the application layer implements it, and
 * neither has to know the other's internals.
 */

export type WorkerGateway = WorkerActivities;

export interface ActivityDependencies {
  readonly gateway: WorkerGateway;
  readonly logger?: Logger;
  readonly service?: string;
}

interface WithContext {
  readonly ctx: ActivityContext;
}

function toApplicationFailure(name: ActivityName, error: unknown): ApplicationFailure {
  const relay = RelayError.fromUnknown(error);
  return ApplicationFailure.create({
    type: relay.code,
    message: relay.messageKey,
    nonRetryable: !relay.retryable,
    details: [{ activity: name, code: relay.code, details: relay.details }],
  });
}

/**
 * Wrap one activity. The generic is constrained to inputs carrying a context,
 * which is every activity in the surface, so the wrapper can establish tenancy
 * without the implementation having to remember to.
 */
function wrap<TInput extends WithContext, TOutput>(
  name: ActivityName,
  deps: ActivityDependencies,
  implementation: (input: TInput) => Promise<TOutput>,
): (input: TInput) => Promise<TOutput> {
  const logger = deps.logger ?? createLogger({ service: deps.service ?? 'worker' });
  return async (input: TInput): Promise<TOutput> => {
    const started = nowMs();
    return runWithContext(
      {
        correlationId: input.ctx.correlationId,
        workspaceId: input.ctx.workspaceId,
        actor: { type: input.ctx.actorType, id: input.ctx.actorId },
        surface: input.ctx.surface,
        attributes: { activity: name },
      },
      async () =>
        withSpan(`activity.${name}`, { activity: name }, async () => {
          try {
            const result = await implementation(input);
            logger.debug({ activity: name, durationMs: nowMs() - started }, 'activity.ok');
            return result;
          } catch (error: unknown) {
            const failure = toApplicationFailure(name, error);
            const code: ErrorCode = RelayError.fromUnknown(error).code;
            logger.warn(
              {
                activity: name,
                durationMs: nowMs() - started,
                code,
                nonRetryable: failure.nonRetryable,
              },
              'activity.failed',
            );
            if (name === 'refreshCredential') {
              productMetrics.tokenRefreshFailuresTotal.add(1, { error_class: code });
            }
            throw failure;
          }
        }),
    );
  };
}

/**
 * Build the activity surface the Temporal worker registers.
 *
 * Every name here matches a method on `WorkerActivities` and a proxy in
 * `workflows/temporal-runtime.ts`. Adding an activity means touching exactly
 * those three places and nothing else.
 *
 * The gateway method is bound rather than wrapped in an arrow, so the receiver
 * survives and TypeScript infers the input and output types from the contract
 * instead of widening them.
 */
export function createActivities(deps: ActivityDependencies): WorkerActivities {
  const gateway = deps.gateway;
  return {
    preflightCampaign: wrap('preflightCampaign', deps, gateway.preflightCampaign.bind(gateway)),
    revalidateTarget: wrap('revalidateTarget', deps, gateway.revalidateTarget.bind(gateway)),
    prepareTargetMedia: wrap('prepareTargetMedia', deps, gateway.prepareTargetMedia.bind(gateway)),
    beginPublishAttempt: wrap(
      'beginPublishAttempt',
      deps,
      gateway.beginPublishAttempt.bind(gateway),
    ),
    ensureNotAlreadyPublished: wrap(
      'ensureNotAlreadyPublished',
      deps,
      gateway.ensureNotAlreadyPublished.bind(gateway),
    ),
    publishTarget: wrap('publishTarget', deps, gateway.publishTarget.bind(gateway)),
    pollPublishStatus: wrap('pollPublishStatus', deps, gateway.pollPublishStatus.bind(gateway)),
    finalizeAttempt: wrap('finalizeAttempt', deps, gateway.finalizeAttempt.bind(gateway)),
    publishSequenceItem: wrap(
      'publishSequenceItem',
      deps,
      gateway.publishSequenceItem.bind(gateway),
    ),
    setTargetState: wrap('setTargetState', deps, gateway.setTargetState.bind(gateway)),
    setJobState: wrap('setJobState', deps, gateway.setJobState.bind(gateway)),
    writeReceipt: wrap('writeReceipt', deps, gateway.writeReceipt.bind(gateway)),
    emitEvent: wrap('emitEvent', deps, gateway.emitEvent.bind(gateway)),
    notify: wrap('notify', deps, gateway.notify.bind(gateway)),
    scheduleAnalyticsFetches: wrap(
      'scheduleAnalyticsFetches',
      deps,
      gateway.scheduleAnalyticsFetches.bind(gateway),
    ),
    planRepeatOccurrence: wrap(
      'planRepeatOccurrence',
      deps,
      gateway.planRepeatOccurrence.bind(gateway),
    ),
    createOccurrenceJob: wrap(
      'createOccurrenceJob',
      deps,
      gateway.createOccurrenceJob.bind(gateway),
    ),
    fetchPostMetrics: wrap('fetchPostMetrics', deps, gateway.fetchPostMetrics.bind(gateway)),
    fetchAccountMetrics: wrap(
      'fetchAccountMetrics',
      deps,
      gateway.fetchAccountMetrics.bind(gateway),
    ),
    recordAnalyticsRun: wrap('recordAnalyticsRun', deps, gateway.recordAnalyticsRun.bind(gateway)),
    describeCredential: wrap('describeCredential', deps, gateway.describeCredential.bind(gateway)),
    refreshCredential: wrap('refreshCredential', deps, gateway.refreshCredential.bind(gateway)),
    raiseConnectionIncident: wrap(
      'raiseConnectionIncident',
      deps,
      gateway.raiseConnectionIncident.bind(gateway),
    ),
    fetchFeed: wrap('fetchFeed', deps, gateway.fetchFeed.bind(gateway)),
    filterNewFeedItems: wrap('filterNewFeedItems', deps, gateway.filterNewFeedItems.bind(gateway)),
    processFeedItems: wrap('processFeedItems', deps, gateway.processFeedItems.bind(gateway)),
    recordFeedPoll: wrap('recordFeedPoll', deps, gateway.recordFeedPoll.bind(gateway)),
    loadRuleDefinition: wrap('loadRuleDefinition', deps, gateway.loadRuleDefinition.bind(gateway)),
    evaluateRuleConditions: wrap(
      'evaluateRuleConditions',
      deps,
      gateway.evaluateRuleConditions.bind(gateway),
    ),
    reserveRuleExecution: wrap(
      'reserveRuleExecution',
      deps,
      gateway.reserveRuleExecution.bind(gateway),
    ),
    executeRuleAction: wrap('executeRuleAction', deps, gateway.executeRuleAction.bind(gateway)),
    recordRuleRun: wrap('recordRuleRun', deps, gateway.recordRuleRun.bind(gateway)),
    loadWebhookDelivery: wrap(
      'loadWebhookDelivery',
      deps,
      gateway.loadWebhookDelivery.bind(gateway),
    ),
    deliverWebhook: wrap('deliverWebhook', deps, gateway.deliverWebhook.bind(gateway)),
    recordWebhookAttempt: wrap(
      'recordWebhookAttempt',
      deps,
      gateway.recordWebhookAttempt.bind(gateway),
    ),
    disableWebhookEndpoint: wrap(
      'disableWebhookEndpoint',
      deps,
      gateway.disableWebhookEndpoint.bind(gateway),
    ),
    deadLetterWebhookDelivery: wrap(
      'deadLetterWebhookDelivery',
      deps,
      gateway.deadLetterWebhookDelivery.bind(gateway),
    ),
    loadDeletionScope: wrap('loadDeletionScope', deps, gateway.loadDeletionScope.bind(gateway)),
    cancelScheduledJob: wrap('cancelScheduledJob', deps, gateway.cancelScheduledJob.bind(gateway)),
    revokeProviderConnection: wrap(
      'revokeProviderConnection',
      deps,
      gateway.revokeProviderConnection.bind(gateway),
    ),
    deleteStoredObjects: wrap(
      'deleteStoredObjects',
      deps,
      gateway.deleteStoredObjects.bind(gateway),
    ),
    tombstoneAnalytics: wrap('tombstoneAnalytics', deps, gateway.tombstoneAnalytics.bind(gateway)),
    finalizeDeletion: wrap('finalizeDeletion', deps, gateway.finalizeDeletion.bind(gateway)),
  };
}

export * from './types.js';
