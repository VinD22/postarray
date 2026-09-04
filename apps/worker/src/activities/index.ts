import { ERROR_CODES, RelayError, idempotencyKeySchema, type ErrorCode } from '@relay/contracts';
import {
  createLogger,
  productMetrics,
  runWithContext,
  withSpan,
  type Logger,
} from '@relay/observability';
import { ApplicationFailure } from '@temporalio/common';

import {
  activityContextSchema,
  type ActivityContext,
  type ActivityName,
  type WorkerActivities,
} from './types';
import { nowMs } from '../runtime/clock';

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

const IDEMPOTENT_ACTIVITY_NAMES = new Set<ActivityName>([
  'beginPublishAttempt',
  'createOccurrenceJob',
]);

function invalidActivityBoundary(reason: string): RelayError {
  return new RelayError(ERROR_CODES.VALIDATION_FAILED, {
    messageKey: 'error.request_invalid.message',
    details: { reason },
  });
}

/** Parse the context before logging or establishing workspace ambient state. */
export function parseActivityContext(value: unknown): ActivityContext {
  const parsed = activityContextSchema.safeParse(value);
  if (!parsed.success) {
    throw invalidActivityBoundary('activity_context_invalid');
  }
  return parsed.data;
}

function activityContextOf(value: unknown): ActivityContext {
  if (typeof value !== 'object' || value === null) {
    throw invalidActivityBoundary('activity_input_invalid');
  }
  return parseActivityContext(Reflect.get(value, 'ctx'));
}

/**
 * Every activity that can create a durable or external operation must carry a
 * valid idempotency key before it reaches a gateway. This is a second line of
 * defence for Temporal inputs. The application service remains authoritative
 * for the request fingerprint and workspace-scoped persistence.
 */
function validateActivityBoundary(name: ActivityName, input: unknown): ActivityContext {
  const context = activityContextOf(input);
  if (!IDEMPOTENT_ACTIVITY_NAMES.has(name)) {
    return context;
  }
  if (typeof input !== 'object' || input === null) {
    throw invalidActivityBoundary('activity_input_invalid');
  }
  const key = Reflect.get(input, 'idempotencyKey');
  if (!idempotencyKeySchema.safeParse(key).success) {
    throw invalidActivityBoundary('activity_idempotency_key_invalid');
  }
  return context;
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
    let context: ActivityContext;
    try {
      context = validateActivityBoundary(name, input);
    } catch (error: unknown) {
      throw toApplicationFailure(name, error);
    }
    const normalizedInput = { ...input, ctx: context } as TInput;
    return runWithContext(
      {
        correlationId: context.correlationId,
        workspaceId: context.workspaceId,
        actor: { type: context.actorType, id: context.actorId },
        surface: context.surface,
        attributes: { activity: name },
      },
      async () =>
        withSpan(`activity.${name}`, { activity: name }, async () => {
          try {
            const result = await implementation(normalizedInput);
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
    generatePostFeedback: wrap(
      'generatePostFeedback',
      deps,
      gateway.generatePostFeedback.bind(gateway),
    ),
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
    markDeletionFailed: wrap('markDeletionFailed', deps, gateway.markDeletionFailed.bind(gateway)),
    buildDataExport: wrap('buildDataExport', deps, gateway.buildDataExport.bind(gateway)),
    readBulkImportVerdict: wrap(
      'readBulkImportVerdict',
      deps,
      gateway.readBulkImportVerdict.bind(gateway),
    ),
    applyBulkImportRows: wrap(
      'applyBulkImportRows',
      deps,
      gateway.applyBulkImportRows.bind(gateway),
    ),
    produceMediaDerivative: wrap(
      'produceMediaDerivative',
      deps,
      gateway.produceMediaDerivative.bind(gateway),
    ),
    scanMediaAsset: wrap('scanMediaAsset', deps, gateway.scanMediaAsset.bind(gateway)),
  };
}

export * from './types';
