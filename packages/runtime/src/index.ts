/**
 * `@relay/runtime` is the outer composition boundary shared by every process.
 *
 * Application services never construct infrastructure and transports never
 * invent domain behaviour. A deployable process asks this package for the
 * canonical service graph, supplies any process-owned adapters, and closes the
 * returned runtime during graceful shutdown.
 */

export {
  createApplicationRuntime,
  type ApplicationRuntime,
  type ApplicationRuntimeOptions,
  type RuntimeAdapterOverrides,
} from './runtime';
export { NeonObjectStorage, base64ChecksumToHex, type NeonStorageOptions } from './neon-storage';
export { ResendMailer, type ResendMailerOptions } from './resend-mailer';
export { TemporalScheduler, type TemporalSchedulerOptions } from './temporal-scheduler';
export {
  OutboxDispatcher,
  type OutboxDispatcherOptions,
  type OutboxRunResult,
} from './outbox-dispatcher';
export {
  dispatchWorkflowOutbox,
  type OutboxDispatchInput,
  type OutboxDispatchResult,
} from './outbox-dispatch';
export {
  OUTBOX_MAX_ATTEMPTS,
  claimOutboxEvents,
  markOutboxDispatched,
  outboxRetryDelayMs,
  recordOutboxFailure,
  type ClaimedOutboxEvent,
  type ClaimOutboxOptions,
} from './outbox-repository';
