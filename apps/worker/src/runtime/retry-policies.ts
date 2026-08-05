import { ERROR_CODES, type ErrorCode } from '@relay/contracts';

/**
 * Retry policies per activity class.
 *
 * These mirror the table in `docs/planning/02-system-architecture.md` section
 * 7.1. The shape is structural rather than imported from `@temporalio/common`
 * so this module stays usable from the deterministic test harness, which never
 * loads the Temporal SDK.
 *
 * The create call is deliberately **not** retried by Temporal. A Temporal level
 * retry would re-enter the provider call without re-running the
 * already-published check, which is exactly how duplicate posts happen. The
 * workflow owns that loop instead, so every attempt starts with a fresh
 * `beginPublishAttempt` and, where the provider has no idempotency token, an
 * `ensureNotAlreadyPublished` probe.
 */

export interface WorkerRetryPolicy {
  /** Milliseconds before the first retry. */
  readonly initialIntervalMs: number;
  readonly backoffCoefficient: number;
  /** Milliseconds. Omitted means no cap beyond the attempt budget. */
  readonly maximumIntervalMs?: number;
  readonly maximumAttempts: number;
  /** Error `type` values that must never be retried. */
  readonly nonRetryableErrorTypes: readonly string[];
}

export interface ActivityExecutionOptions {
  readonly startToCloseTimeoutMs: number;
  readonly scheduleToCloseTimeoutMs?: number;
  readonly heartbeatTimeoutMs?: number;
  readonly retry: WorkerRetryPolicy;
}

const USER_FIXABLE: readonly ErrorCode[] = [
  ERROR_CODES.CONNECTION_ACTION_REQUIRED,
  ERROR_CODES.APPROVAL_REQUIRED,
  ERROR_CODES.AUTH_REQUIRED,
  ERROR_CODES.AUTH_INVALID_CREDENTIALS,
  ERROR_CODES.FORBIDDEN,
  ERROR_CODES.SCOPE_INSUFFICIENT,
];

const CONTENT_FATAL: readonly ErrorCode[] = [
  ERROR_CODES.CONTENT_INVALID,
  ERROR_CODES.VALIDATION_FAILED,
  ERROR_CODES.MEDIA_INVALID,
  ERROR_CODES.MEDIA_TOO_LARGE,
  ERROR_CODES.CAPABILITY_UNSUPPORTED,
  ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
  ERROR_CODES.DUPLICATE_CONTENT,
  ERROR_CODES.POLICY_BLOCKED,
];

const PROVIDER_FATAL: readonly ErrorCode[] = [ERROR_CODES.PROVIDER_PERMANENT];

const BILLING_FATAL: readonly ErrorCode[] = [
  ERROR_CODES.ENTITLEMENT_REQUIRED,
  ERROR_CODES.QUOTA_EXCEEDED,
  ERROR_CODES.TRIAL_EXPIRED,
  ERROR_CODES.PAYMENT_REQUIRED,
];

function codes(...groups: readonly (readonly ErrorCode[])[]): readonly string[] {
  const flat = new Set<string>();
  for (const group of groups) {
    for (const code of group) {
      flat.add(code);
    }
  }
  return [...flat].sort();
}

/** Media preparation: derivatives, checksums and provider side uploads. */
export const PREPARE_MEDIA_ACTIVITY: ActivityExecutionOptions = {
  startToCloseTimeoutMs: 10 * 60_000,
  heartbeatTimeoutMs: 60_000,
  retry: {
    initialIntervalMs: 5_000,
    backoffCoefficient: 2,
    maximumIntervalMs: 2 * 60_000,
    maximumAttempts: 5,
    nonRetryableErrorTypes: codes(CONTENT_FATAL, PROVIDER_FATAL, USER_FIXABLE),
  },
};

/**
 * The create call. One attempt only: the workflow retries, not Temporal, so the
 * duplicate probe runs again before any second network create.
 */
export const PUBLISH_ACTIVITY: ActivityExecutionOptions = {
  startToCloseTimeoutMs: 2 * 60_000,
  retry: {
    initialIntervalMs: 1_000,
    backoffCoefficient: 1,
    maximumAttempts: 1,
    nonRetryableErrorTypes: codes(
      CONTENT_FATAL,
      PROVIDER_FATAL,
      USER_FIXABLE,
      BILLING_FATAL,
      [ERROR_CODES.PROVIDER_TRANSIENT, ERROR_CODES.PROVIDER_UNAVAILABLE, ERROR_CODES.RATE_LIMITED],
    ),
  },
};

/** The already-published probe. Safe to retry: it is a pure read. */
export const PROBE_ACTIVITY: ActivityExecutionOptions = {
  startToCloseTimeoutMs: 60_000,
  retry: {
    initialIntervalMs: 2_000,
    backoffCoefficient: 2,
    maximumIntervalMs: 30_000,
    maximumAttempts: 4,
    nonRetryableErrorTypes: codes(USER_FIXABLE, PROVIDER_FATAL),
  },
};

/** Status polling for providers that accept first and publish later. */
export const POLL_STATUS_ACTIVITY: ActivityExecutionOptions = {
  startToCloseTimeoutMs: 60_000,
  retry: {
    initialIntervalMs: 10_000,
    backoffCoefficient: 1.6,
    maximumIntervalMs: 5 * 60_000,
    maximumAttempts: 6,
    nonRetryableErrorTypes: codes(PROVIDER_FATAL, CONTENT_FATAL),
  },
};

/** Analytics reads. Never allowed to fail a publish. */
export const FETCH_METRICS_ACTIVITY: ActivityExecutionOptions = {
  startToCloseTimeoutMs: 2 * 60_000,
  retry: {
    initialIntervalMs: 30_000,
    backoffCoefficient: 2,
    maximumIntervalMs: 10 * 60_000,
    maximumAttempts: 5,
    nonRetryableErrorTypes: codes(USER_FIXABLE),
  },
};

/**
 * Our own database writes. These must eventually succeed, so the attempt budget
 * is effectively unlimited and nothing is classified non retryable.
 */
export const PERSISTENCE_ACTIVITY: ActivityExecutionOptions = {
  startToCloseTimeoutMs: 60_000,
  retry: {
    initialIntervalMs: 1_000,
    backoffCoefficient: 2,
    maximumIntervalMs: 60_000,
    maximumAttempts: 0,
    nonRetryableErrorTypes: [],
  },
};

/** Outbound HTTP to a customer endpoint. The workflow owns the long backoff. */
export const WEBHOOK_ACTIVITY: ActivityExecutionOptions = {
  startToCloseTimeoutMs: 30_000,
  retry: {
    initialIntervalMs: 1_000,
    backoffCoefficient: 1,
    maximumAttempts: 1,
    nonRetryableErrorTypes: [],
  },
};

/** SSRF-guarded outbound fetches: RSS polling and media import. */
export const FETCH_EXTERNAL_ACTIVITY: ActivityExecutionOptions = {
  startToCloseTimeoutMs: 60_000,
  retry: {
    initialIntervalMs: 5_000,
    backoffCoefficient: 2,
    maximumIntervalMs: 2 * 60_000,
    maximumAttempts: 3,
    nonRetryableErrorTypes: codes([ERROR_CODES.SSRF_BLOCKED], CONTENT_FATAL),
  },
};

/** Credential refresh and revocation against the provider. */
export const CREDENTIAL_ACTIVITY: ActivityExecutionOptions = {
  startToCloseTimeoutMs: 60_000,
  retry: {
    initialIntervalMs: 5_000,
    backoffCoefficient: 2,
    maximumIntervalMs: 5 * 60_000,
    maximumAttempts: 4,
    nonRetryableErrorTypes: codes(USER_FIXABLE, PROVIDER_FATAL),
  },
};

export const ACTIVITY_OPTIONS = {
  prepareMedia: PREPARE_MEDIA_ACTIVITY,
  publish: PUBLISH_ACTIVITY,
  probe: PROBE_ACTIVITY,
  pollStatus: POLL_STATUS_ACTIVITY,
  fetchMetrics: FETCH_METRICS_ACTIVITY,
  persistence: PERSISTENCE_ACTIVITY,
  webhook: WEBHOOK_ACTIVITY,
  fetchExternal: FETCH_EXTERNAL_ACTIVITY,
  credential: CREDENTIAL_ACTIVITY,
} as const satisfies Record<string, ActivityExecutionOptions>;

export type ActivityClass = keyof typeof ACTIVITY_OPTIONS;

/** True when an error code must stop an activity class from retrying. */
export function isNonRetryable(activityClass: ActivityClass, code: string): boolean {
  return ACTIVITY_OPTIONS[activityClass].retry.nonRetryableErrorTypes.includes(code);
}

/**
 * Translate to the shape the Temporal SDK expects. Durations are milliseconds,
 * which the SDK accepts directly, and `maximumAttempts: 0` means unlimited.
 */
export function toTemporalActivityOptions(options: ActivityExecutionOptions): {
  startToCloseTimeout: number;
  scheduleToCloseTimeout?: number;
  heartbeatTimeout?: number;
  retry: {
    initialInterval: number;
    backoffCoefficient: number;
    maximumInterval?: number;
    maximumAttempts: number;
    nonRetryableErrorTypes: string[];
  };
} {
  return {
    startToCloseTimeout: options.startToCloseTimeoutMs,
    ...(options.scheduleToCloseTimeoutMs === undefined
      ? {}
      : { scheduleToCloseTimeout: options.scheduleToCloseTimeoutMs }),
    ...(options.heartbeatTimeoutMs === undefined
      ? {}
      : { heartbeatTimeout: options.heartbeatTimeoutMs }),
    retry: {
      initialInterval: options.retry.initialIntervalMs,
      backoffCoefficient: options.retry.backoffCoefficient,
      ...(options.retry.maximumIntervalMs === undefined
        ? {}
        : { maximumInterval: options.retry.maximumIntervalMs }),
      maximumAttempts: options.retry.maximumAttempts,
      nonRetryableErrorTypes: [...options.retry.nonRetryableErrorTypes],
    },
  };
}
