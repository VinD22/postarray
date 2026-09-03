import { isLocalDatabaseUrl, type RelayConfig } from '@relay/config';
import { ERROR_CODES, RelayError } from '@relay/contracts';

/**
 * May this process degrade to a scheduler that does not durably execute?
 *
 * Two schedulers in this repository accept work without a Temporal server:
 * `InMemoryScheduler`, which records intent in a `Map` and never executes
 * anything, and the worker's `InlineScheduler`, which runs workflow bodies in
 * process with no durable history and no cross-process deduplication. Both are
 * correct on a laptop and wrong everywhere else.
 *
 * The guard used to be `NODE_ENV === 'production'`. That is not enough. A
 * staging box, a preview deploy or a container started without the variable
 * all run with a non-production `NODE_ENV`, and on any of them the fallback
 * turns the Schedule button into a lie: the request validates, the entitlement
 * check passes, the job row is written, the UI says scheduled, and the post is
 * never published. Nothing errors, so nothing alerts.
 *
 * So the answer is yes only when the process is explicitly a test, or is
 * explicitly local AND pointed at a local database. A profile that says
 * `local` while talking to Neon is a deployed process that forgot to say so,
 * and it is refused.
 */
export function schedulerFallbackAllowed(config: RelayConfig): boolean {
  const profile = config.core.runtimeProfile;
  if (profile === 'test') {
    return true;
  }
  if (profile === 'local') {
    return isLocalDatabaseUrl(config.database.url);
  }
  return false;
}

export function schedulerFallbackRefused(config: RelayConfig): RelayError {
  return new RelayError(ERROR_CODES.INTERNAL, {
    details: {
      reason: 'scheduler_fallback_refused',
      profile: config.core.runtimeProfile,
      databaseIsLocal: isLocalDatabaseUrl(config.database.url),
      remedy: 'set TEMPORAL_ADDRESS, or set POSTARRAY_RUNTIME_PROFILE=local against a local database',
    },
  });
}
