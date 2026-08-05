import { createHash } from 'node:crypto';

import { type CapabilitySnapshot, type CapabilitySupport, canonicalJson } from '@relay/contracts';

import type {
  ConnectionRef,
  ProviderDraft,
  PublishStatus,
  SocialConnector,
  StatusRequest,
} from './contract.js';
import { ProviderCallError, classifyProviderError } from './errors.js';
import { type Clock, type ConnectorLogger, instantOf, noopLogger, systemClock } from './ports.js';

/**
 * The "did this already publish?" guard.
 *
 * Where a provider offers an idempotency mechanism we use it. Where it does not,
 * we query the provider for the external ID before repeating a create. That
 * sentence is the difference between a reliable product and one that double
 * posts, and duplicate posting is both a policy violation and, on a metered
 * provider, a billing event.
 *
 * This runs before every publish retry: after a timeout, after a worker crash,
 * after a duplicated webhook and after a Temporal replay.
 */

export const ALREADY_PUBLISHED_DECISIONS = ['proceed', 'adopt', 'block'] as const;
export type AlreadyPublishedDecision = (typeof ALREADY_PUBLISHED_DECISIONS)[number];

export const ADOPTION_SOURCES = [
  'provider_status',
  'external_id_lookup',
  'provider_idempotency',
] as const;
export type AdoptionSource = (typeof ADOPTION_SOURCES)[number];

export interface AlreadyPublishedResult {
  readonly decision: AlreadyPublishedDecision;
  /** Set when `decision` is `adopt`. */
  readonly externalPostId: string | null;
  readonly permalink: string | null;
  readonly publishedAt: string | null;
  readonly source: AdoptionSource | null;
  /** Set when `decision` is `block`: we could not prove the state either way. */
  readonly blockReasonKey: string | null;
  readonly checkedAt: string;
  readonly status: PublishStatus | null;
}

/**
 * The fingerprint used to find a post we may already have created.
 *
 * It covers the exact payload that would be sent, so a retry of the same draft
 * matches and a genuinely different draft does not.
 */
export function computeContentFingerprint(input: {
  readonly connectionId: string;
  readonly body: string;
  readonly mediaChecksums: readonly string[];
  readonly destinationExternalId: string | null;
  readonly threadBodies: readonly string[];
  readonly privacyValue: string | null;
}): string {
  return createHash('sha256')
    .update(
      canonicalJson({
        connectionId: input.connectionId,
        body: input.body,
        mediaChecksums: [...input.mediaChecksums].sort(),
        destinationExternalId: input.destinationExternalId,
        threadBodies: [...input.threadBodies],
        privacyValue: input.privacyValue,
      }),
      'utf8',
    )
    .digest('hex');
}

/** Fingerprint straight from a provider draft. */
export function fingerprintDraft(draft: ProviderDraft): string {
  return computeContentFingerprint({
    connectionId: draft.connection.connectionId,
    body: draft.body,
    mediaChecksums: draft.media.map((asset) => asset.checksum),
    destinationExternalId: draft.destination?.externalId ?? null,
    threadBodies: draft.threadItems.map((item) => item.body),
    privacyValue: draft.privacyValue,
  });
}

export interface EnsureNotAlreadyPublishedInput {
  readonly connector: SocialConnector;
  readonly connection: ConnectionRef;
  /** The connection's live snapshot, for the audit trail on this decision. */
  readonly capabilities: CapabilitySnapshot;
  /**
   * What the connector declares about the provider's own idempotency. When it
   * is `supported`, no lookup is needed. Anything else means we must ask.
   */
  readonly providerIdempotencySupport?: CapabilitySupport;
  readonly idempotencyKey: string;
  readonly contentFingerprint: string;
  /** From the first attempt, when the provider handed one back before failing. */
  readonly providerJobId?: string | null;
  readonly externalPostId?: string | null;
  /** The window a create could have landed in. */
  readonly dispatchWindowFrom: string;
  readonly dispatchWindowTo: string;
  /** First attempt: nothing has been sent yet, so there is nothing to adopt. */
  readonly attemptNumber: number;
  readonly clock?: Clock;
  readonly logger?: ConnectorLogger;
}

function result(
  partial: Partial<AlreadyPublishedResult> & {
    decision: AlreadyPublishedDecision;
    checkedAt: string;
  },
): AlreadyPublishedResult {
  return {
    externalPostId: null,
    permalink: null,
    publishedAt: null,
    source: null,
    blockReasonKey: null,
    status: null,
    ...partial,
  };
}

/**
 * Answer "did this already publish?" before repeating a create.
 *
 * ```ts
 * const guard = await ensureNotAlreadyPublished({ connector, connection, ... });
 * if (guard.decision === 'adopt') {
 *   return receiptFromExistingPost(guard);
 * }
 * if (guard.decision === 'block') {
 *   throw new RelayError('CONNECTION_ACTION_REQUIRED', { ... });
 * }
 * await connector.publish(request);
 * ```
 *
 * `proceed` means we have positive evidence that nothing was created. `adopt`
 * means an external post already exists and we take it as the receipt instead
 * of creating a second one. `block` means we could not tell, which is never
 * resolved by guessing: it raises an Action Center item.
 */
export async function ensureNotAlreadyPublished(
  input: EnsureNotAlreadyPublishedInput,
): Promise<AlreadyPublishedResult> {
  const clock = input.clock ?? systemClock;
  const logger = input.logger ?? noopLogger;
  const checkedAt = instantOf(clock.now().getTime());

  if (
    input.attemptNumber <= 1 &&
    (input.providerJobId ?? null) === null &&
    (input.externalPostId ?? null) === null
  ) {
    return result({ decision: 'proceed', checkedAt });
  }

  // A provider that honours our idempotency key refuses the duplicate itself,
  // so repeating the create cannot produce a second post.
  if (input.providerIdempotencySupport === 'supported') {
    return result({ decision: 'proceed', checkedAt, source: 'provider_idempotency' });
  }

  const statusRequest: StatusRequest = {
    connection: input.connection,
    providerJobId: input.providerJobId ?? null,
    externalPostId: input.externalPostId ?? null,
    idempotencyKey: input.idempotencyKey,
    contentFingerprint: input.contentFingerprint,
    dispatchWindowFrom: input.dispatchWindowFrom,
    dispatchWindowTo: input.dispatchWindowTo,
  };

  let status: PublishStatus;
  try {
    status = await input.connector.getStatus(statusRequest);
  } catch (error) {
    const classified = ProviderCallError.is(error)
      ? error.classified
      : classifyProviderError({
          provider: input.connection.provider,
          operation: 'get_status',
          body: error,
          clock,
        });
    logger.warn(
      {
        provider: input.connection.provider,
        connectionId: input.connection.connectionId,
        errorClass: classified.errorClass,
        attemptNumber: input.attemptNumber,
      },
      'connector.idempotency.status_check_failed',
    );
    // We cannot prove the post does not exist, so we refuse to create again.
    return result({
      decision: 'block',
      checkedAt,
      blockReasonKey: 'error.user_action_required.message',
    });
  }

  if (status.state === 'published' && status.externalPostId !== null) {
    logger.info(
      {
        provider: input.connection.provider,
        connectionId: input.connection.connectionId,
        attemptNumber: input.attemptNumber,
      },
      'connector.idempotency.adopted_existing_post',
    );
    return result({
      decision: 'adopt',
      checkedAt,
      externalPostId: status.externalPostId,
      permalink: status.permalink,
      publishedAt: status.publishedAt,
      source:
        input.externalPostId !== null && input.externalPostId !== undefined
          ? 'external_id_lookup'
          : 'provider_status',
      status,
    });
  }

  if (status.state === 'processing') {
    return result({
      decision: 'block',
      checkedAt,
      blockReasonKey: 'state.provider_processing.description',
      status,
    });
  }

  if (status.state === 'failed') {
    // The provider is certain nothing exists, so a fresh create is safe.
    return result({ decision: 'proceed', checkedAt, status });
  }

  return result({
    decision: 'block',
    checkedAt,
    blockReasonKey: 'error.unknown.message',
    status,
  });
}

/**
 * True when repeating this create is safe without a lookup, because the
 * provider itself deduplicates on our key. `not_implemented` is not `false`
 * dressed up: it means we have not built it, and the lookup still runs.
 */
export function providerHonoursIdempotencyKey(declared: CapabilitySupport): boolean {
  return declared === 'supported';
}
