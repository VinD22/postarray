import {
  capabilitySnapshotSchema,
  ERROR_CODES,
  metricObservationSchema,
  RelayError,
  unavailableObservation,
  type CapabilitySnapshot,
} from '@relay/contracts';
import { mappingsFor, normalizeMetrics, supportedMetrics } from '@relay/analytics-domain';
import type { UnavailableReason } from '@relay/analytics-domain';
import {
  credentialResultSchema,
  ensureNotAlreadyPublished,
  metricsRequestSchema,
  publishRequestSchema,
  publishResultSchema,
  publishStatusSchema,
  statusRequestSchema,
  systemClock,
} from '@relay/connectors';
import type {
  Clock,
  MetricObservation,
  OAuthClientConfig,
  ProviderDraft,
  PublishRequest,
  PublishResult,
  PublishStatus,
  RefreshRequest,
  RevokeRequest,
} from '@relay/connectors';
import type { MetricScope, NormalizedMetricName } from '@relay/contracts';

import type { VerifiedConnectorRegistry } from './verified-connectors';
import {
  assertWorkspaceBinding,
  type ConnectionDetails,
  type WorkspaceCredentialResolver,
} from './workspace-credentials';

export {
  createWorkspaceCredentialResolver,
  type ConnectionDetails,
  type LeasedConnection,
  type WorkspaceCredentialResolver,
} from './workspace-credentials';

export interface PublishExecutionInput {
  readonly workspaceId: string;
  readonly connection: ConnectionDetails;
  readonly request: Omit<PublishRequest, 'draft'> & {
    readonly draft: Omit<ProviderDraft, 'connection'>;
  };
  readonly attemptNumber: number;
  readonly providerJobId?: string | null;
  readonly externalPostId?: string | null;
  readonly dispatchWindowFrom: string;
  readonly dispatchWindowTo: string;
  readonly capabilities: CapabilitySnapshot;
}

/**
 * Read the provider's own view of an in-flight or finished create.
 *
 * Two callers need this and neither of them creates anything: a provider that
 * accepts a container and publishes it later (TikTok, YouTube), and the
 * crash-recovery read-back that asks "did the create we lost the answer to
 * actually land". It therefore resolves the connector for `get_status` and
 * never for `publish`: a connector without a verified status read must fail
 * rather than fall back to a second create.
 */
export interface PollStatusExecutionInput {
  readonly workspaceId: string;
  readonly connection: ConnectionDetails;
  /** The container or job handle the create returned, when it returned one. */
  readonly providerJobId: string | null;
  readonly externalPostId: string | null;
  readonly idempotencyKey: string;
  readonly contentFingerprint: string;
  readonly dispatchWindowFrom: string;
  readonly dispatchWindowTo: string;
}

export interface FetchMetricsExecutionInput {
  readonly workspaceId: string;
  readonly connection: ConnectionDetails;
  readonly scope: MetricScope;
  /** Required for a post scoped read, null for an account scoped one. */
  readonly externalPostId: string | null;
  readonly rangeFrom: string | null;
  readonly rangeTo: string | null;
  /** Defaults to every metric the registry maps for this provider and scope. */
  readonly metrics?: readonly NormalizedMetricName[];
}

export interface FetchMetricsExecutionResult {
  /** One row per mapped metric. A metric we could not read is `unavailable_*`. */
  readonly observations: readonly MetricObservation[];
  readonly observedCount: number;
  readonly unavailableCount: number;
}

export type PublishExecutionResult =
  | {
      readonly status: 'adopted';
      readonly externalPostId: string;
      readonly permalink: string | null;
      readonly publishedAt: string;
    }
  | { readonly status: 'executed'; readonly result: PublishResult };

export interface ConnectorExecutionGatewayOptions {
  readonly registry: VerifiedConnectorRegistry;
  readonly credentials: WorkspaceCredentialResolver;
  readonly clock?: Clock;
}

function executionError(
  code: (typeof ERROR_CODES)[keyof typeof ERROR_CODES],
  reason: string,
  details: Record<string, unknown> = {},
): RelayError {
  return new RelayError(code, {
    messageKey:
      code === ERROR_CODES.CAPABILITY_UNSUPPORTED
        ? 'error.capability_unsupported.message'
        : code === ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED
          ? 'errors.capability_not_implemented'
          : 'error.internal.message',
    details: { reason, ...details },
  });
}

function parseSnapshot(
  snapshot: CapabilitySnapshot,
  connection: ConnectionDetails,
): CapabilitySnapshot {
  const parsed = capabilitySnapshotSchema.parse(snapshot);
  if (
    parsed.provider !== connection.provider ||
    parsed.connectionId !== connection.connectionId ||
    parsed.accountType !== connection.accountType
  ) {
    throw executionError(ERROR_CODES.INTERNAL, 'capability_binding_mismatch');
  }
  return parsed;
}

/** The connector feature that gates each metric scope. */
const SCOPE_FEATURE = Object.freeze({
  post: 'post_analytics',
  account: 'account_analytics',
} as const);

/**
 * The hash carried by a reading that came from no provider payload at all.
 * A row still exists, because "we could not read this" is the fact we store.
 */
const NO_PAYLOAD_HASH = '0'.repeat(64);

/**
 * Build one `unavailable_*` row per mapped metric.
 *
 * Called when the provider was never asked, or answered with a failure. Every
 * mapped metric still produces a row so the UI can say why a number is missing
 * instead of rendering a zero it was never told.
 */
function unavailableForScope(
  provider: ConnectionDetails['provider'],
  scope: MetricScope,
  observedAt: string,
  reason: UnavailableReason,
): MetricObservation[] {
  return mappingsFor(provider, scope).map((entry) =>
    unavailableObservation({
      normalizedName: entry.definition.normalizedName,
      provider,
      providerField: entry.definition.providerField,
      scope,
      availability: reason,
      observedAt,
      rawProviderPayloadHash: NO_PAYLOAD_HASH,
      unit: entry.definition.unit,
      denominator: entry.definition.denominator,
    }),
  );
}

/**
 * How a failed provider call is recorded.
 *
 * A permission or action-required failure is a durable fact about this
 * connection, so it becomes `unavailable_permission`. A permanently rejected
 * read becomes `unavailable_stale`. Anything else returns null and is rethrown:
 * a transient failure is Temporal's business, and writing it down as a fact
 * would freeze a temporary blip into the record.
 */
function unavailabilityFor(error: unknown): UnavailableReason | null {
  if (!(error instanceof RelayError)) {
    return null;
  }
  if (
    error.code === ERROR_CODES.CONNECTION_ACTION_REQUIRED ||
    error.code === ERROR_CODES.FORBIDDEN ||
    error.code === ERROR_CODES.SCOPE_INSUFFICIENT
  ) {
    return 'unavailable_permission';
  }
  if (error.code === ERROR_CODES.CAPABILITY_UNSUPPORTED) {
    return 'unavailable_provider';
  }
  if (error.code === ERROR_CODES.PROVIDER_PERMANENT) {
    return 'unavailable_stale';
  }
  return null;
}

function summarize(observations: readonly MetricObservation[]): FetchMetricsExecutionResult {
  const observedCount = observations.filter(
    (observation) => observation.availability === 'available',
  ).length;
  return {
    observations,
    observedCount,
    unavailableCount: observations.length - observedCount,
  };
}

/**
 * The only runtime seam that may hand a credential-backed ConnectionRef to a
 * connector. It is deliberately smaller than WorkerActivities: activities
 * still own persistence, receipts and state transitions, while this object
 * owns provider capability gates, handle lifetime and duplicate probing.
 */
export class ConnectorExecutionGateway {
  readonly #registry: VerifiedConnectorRegistry;
  readonly #credentials: WorkspaceCredentialResolver;
  readonly #clock: Clock;

  constructor(options: ConnectorExecutionGatewayOptions) {
    this.#registry = options.registry;
    this.#credentials = options.credentials;
    this.#clock = options.clock ?? systemClock;
  }

  async capabilitiesFor(input: {
    readonly workspaceId: string;
    readonly connection: ConnectionDetails;
  }): Promise<CapabilitySnapshot> {
    const connection = assertWorkspaceBinding(input.workspaceId, input.connection);
    const connector = this.#registry.verifiedConnector(connection.provider, 'get_capabilities');
    const leased = await this.#credentials.lease({
      workspaceId: input.workspaceId,
      connection,
      purpose: 'capability_check',
    });
    try {
      return parseSnapshot(await connector.getCapabilities(leased.connection), connection);
    } finally {
      leased.release();
    }
  }

  async publish(input: PublishExecutionInput): Promise<PublishExecutionResult> {
    const connection = assertWorkspaceBinding(input.workspaceId, input.connection);
    const connector = this.#registry.verifiedConnector(connection.provider, 'publish');
    const providerIdempotencySupport = this.#registry.verifiedFeatureSupport(
      connection.provider,
      'provider_idempotency',
    );
    if (
      providerIdempotencySupport !== 'supported' &&
      (input.attemptNumber > 1 ||
        input.providerJobId !== undefined ||
        input.externalPostId !== undefined)
    ) {
      this.#registry.verifiedConnector(connection.provider, 'get_status');
    }

    const capabilities = parseSnapshot(input.capabilities, connection);
    const leased = await this.#credentials.lease({
      workspaceId: input.workspaceId,
      connection,
      purpose: 'publish',
    });
    try {
      const request = publishRequestSchema.parse({
        ...input.request,
        draft: { ...input.request.draft, connection: leased.connection },
      });
      const guard = await ensureNotAlreadyPublished({
        connector,
        connection: leased.connection,
        capabilities,
        providerIdempotencySupport,
        idempotencyKey: request.idempotencyKey,
        contentFingerprint: request.contentFingerprint,
        providerJobId: input.providerJobId,
        externalPostId: input.externalPostId,
        dispatchWindowFrom: input.dispatchWindowFrom,
        dispatchWindowTo: input.dispatchWindowTo,
        attemptNumber: input.attemptNumber,
        clock: this.#clock,
      });

      if (guard.decision === 'block') {
        throw executionError(ERROR_CODES.CONNECTION_ACTION_REQUIRED, 'publication_state_unknown', {
          provider: connection.provider,
          connectionId: connection.connectionId,
        });
      }
      if (guard.decision === 'adopt') {
        if (guard.externalPostId === null || guard.publishedAt === null) {
          throw executionError(ERROR_CODES.INTERNAL, 'adopted_publication_incomplete');
        }
        return {
          status: 'adopted',
          externalPostId: guard.externalPostId,
          permalink: guard.permalink,
          publishedAt: guard.publishedAt,
        };
      }

      /*
       * Hand the media to the provider before the post that references it.
       *
       * `preparedMedia` used to be an empty array on every publish, because
       * nothing ever called the connector's own `prepareMedia`. Connectors read
       * both fields and they mean different things: `draft.media` is what the
       * asset *is* (kind, mime type, size, alt text) and `preparedMedia` is
       * where the provider put it. Pinterest looks for the first prepared item
       * carrying a `publicUrl` and refuses the pin without one, so an image
       * post reached the provider describing an image it had never uploaded.
       *
       * Preparation is idempotent on (asset, connection, variant) per the
       * contract, so a retried dispatch re-prepares safely and connectors that
       * cache report `reusedFromPreviousAttempt`.
       */
      const preparedMedia =
        request.draft.media.length === 0
          ? []
          : await connector.prepareMedia({
              connection: leased.connection,
              postVariantId: request.draft.postVariantId,
              contentKind: request.draft.contentKind,
              media: request.draft.media,
              idempotencyKey: request.idempotencyKey,
              capabilities,
            });

      return {
        status: 'executed',
        result: publishResultSchema.parse(
          await connector.publish({ ...request, preparedMedia }),
        ),
      };
    } finally {
      leased.release();
    }
  }

  /**
   * Ask the provider what happened. Never creates, never adopts on its own.
   *
   * The verdict is handed back exactly as the connector reported it, parsed
   * through the contract schema, so the `published` state is only reachable
   * with an external id attached. The workflow owns what to do with it: this
   * method has no opinion and no side effect.
   */
  async pollStatus(input: PollStatusExecutionInput): Promise<PublishStatus> {
    const connection = assertWorkspaceBinding(input.workspaceId, input.connection);
    const connector = this.#registry.verifiedConnector(connection.provider, 'get_status');
    const leased = await this.#credentials.lease({
      workspaceId: input.workspaceId,
      connection,
      purpose: 'poll_status',
    });
    try {
      const request = statusRequestSchema.parse({
        connection: leased.connection,
        providerJobId: input.providerJobId,
        externalPostId: input.externalPostId,
        idempotencyKey: input.idempotencyKey,
        contentFingerprint: input.contentFingerprint,
        dispatchWindowFrom: input.dispatchWindowFrom,
        dispatchWindowTo: input.dispatchWindowTo,
      });
      return publishStatusSchema.parse(await connector.getStatus(request));
    } finally {
      leased.release();
    }
  }

  /**
   * Read one connection's metrics and normalize them.
   *
   * The honesty rule lives here. Every metric the registry maps for this
   * provider and scope comes back as a row: present values carry the provider's
   * own field name, unit and denominator, and everything else is
   * `unavailable_*` with a reason. Nothing is defaulted to zero, nothing is
   * interpolated from a neighbouring metric, and a reading the registry does
   * not map yet is passed through exactly as the connector reported it rather
   * than dropped.
   */
  async fetchMetrics(input: FetchMetricsExecutionInput): Promise<FetchMetricsExecutionResult> {
    const connection = assertWorkspaceBinding(input.workspaceId, input.connection);
    const connector = this.#registry.verifiedConnector(connection.provider, 'fetch_metrics');
    const observedAt = this.#clock.now().toISOString();
    const scopeSupport = this.#registry.verifiedFeatureSupport(
      connection.provider,
      SCOPE_FEATURE[input.scope],
    );
    if (scopeSupport !== 'supported') {
      // "The provider does not offer this" and "we have not built it yet" are
      // different states, and the UI shows them differently.
      return summarize(
        unavailableForScope(
          connection.provider,
          input.scope,
          observedAt,
          scopeSupport === 'unsupported' ? 'unavailable_provider' : 'unavailable_pending',
        ),
      );
    }

    const leased = await this.#credentials.lease({
      workspaceId: input.workspaceId,
      connection,
      purpose: 'fetch_metrics',
    });
    let reported: MetricObservation[];
    try {
      const request = metricsRequestSchema.parse({
        connection: leased.connection,
        scope: input.scope,
        externalPostId: input.externalPostId,
        rangeFrom: input.rangeFrom,
        rangeTo: input.rangeTo,
        metrics: [...(input.metrics ?? supportedMetrics(connection.provider, input.scope))],
      });
      reported = (await connector.fetchMetrics(request)).map((observation) =>
        metricObservationSchema.parse(observation),
      );
    } catch (error: unknown) {
      const reason = unavailabilityFor(error);
      if (reason === null) {
        throw error;
      }
      return summarize(unavailableForScope(connection.provider, input.scope, observedAt, reason));
    } finally {
      leased.release();
    }

    const values: Record<string, unknown> = {};
    let payloadHash = NO_PAYLOAD_HASH;
    for (const observation of reported) {
      payloadHash = observation.rawProviderPayloadHash;
      if (observation.availability === 'available') {
        values[observation.providerField] = observation.value;
      }
    }
    const normalized = normalizeMetrics({
      provider: connection.provider,
      scope: input.scope,
      raw: values,
      observedAt,
      rawProviderPayloadHash: payloadHash,
      grantedPermissions: connection.grantedScopes,
      ...(input.metrics === undefined ? {} : { metrics: input.metrics }),
    }).map((metric) => metric.observation);

    // The registry decides what a metric means; the connector decides what the
    // provider actually said. Where the registry has no reading and the
    // connector does, the connector's number wins: dropping a real number
    // because our field mapping is behind would be its own kind of lie.
    const available = new Map(
      reported
        .filter((observation) => observation.availability === 'available')
        .map((observation) => [observation.normalizedName, observation] as const),
    );
    const merged = normalized.map(
      (observation) =>
        (observation.availability === 'available'
          ? observation
          : available.get(observation.normalizedName)) ?? observation,
    );
    const mapped = new Set(merged.map((observation) => observation.normalizedName));
    const passThrough = reported.filter((observation) => !mapped.has(observation.normalizedName));
    return summarize([...merged, ...passThrough]);
  }

  async revoke(input: {
    readonly workspaceId: string;
    readonly connection: ConnectionDetails;
    readonly client: OAuthClientConfig;
  }): Promise<void> {
    const connection = assertWorkspaceBinding(input.workspaceId, input.connection);
    const connector = this.#registry.verifiedConnector(connection.provider, 'revoke');
    const leased = await this.#credentials.lease({
      workspaceId: input.workspaceId,
      connection,
      purpose: 'revoke',
    });
    try {
      const request: RevokeRequest = {
        connectionId: connection.connectionId,
        workspaceId: connection.workspaceId,
        provider: connection.provider,
        accessToken: leased.connection.accessToken,
        refreshToken: leased.refreshToken,
        client: input.client,
      };
      await connector.revoke?.(request);
    } finally {
      leased.release();
    }
  }

  async refresh(input: {
    readonly workspaceId: string;
    readonly connection: ConnectionDetails;
    readonly client: OAuthClientConfig;
  }): Promise<{
    readonly rotated: boolean;
    readonly expiresAt: string | null;
    readonly lifetimeSeconds: number | null;
  }> {
    const connection = assertWorkspaceBinding(input.workspaceId, input.connection);
    const connector = this.#registry.verifiedConnector(connection.provider, 'refresh_credential');
    const leased = await this.#credentials.lease({
      workspaceId: input.workspaceId,
      connection,
      purpose: 'refresh',
    });
    if (leased.refreshToken === null) {
      leased.release();
      throw executionError(ERROR_CODES.CONNECTION_ACTION_REQUIRED, 'refresh_token_unavailable');
    }
    try {
      const request: RefreshRequest = {
        connectionId: connection.connectionId,
        workspaceId: connection.workspaceId,
        provider: connection.provider,
        refreshToken: leased.refreshToken,
        grantedScopes: connection.grantedScopes,
        client: input.client,
      };
      const result = credentialResultSchema.parse(await connector.refreshCredential(request));
      const refreshedAt = this.#clock.now().toISOString();
      await this.#credentials.persistRefresh({
        connection,
        previous: leased.record,
        result,
        refreshedAt,
      });
      const lifetimeSeconds =
        result.expiresAt === null
          ? null
          : Math.max(
              0,
              Math.round(
                (new Date(result.expiresAt).getTime() - this.#clock.now().getTime()) / 1000,
              ),
            );
      return {
        rotated: result.refreshTokenRotated,
        expiresAt: result.expiresAt,
        lifetimeSeconds,
      };
    } finally {
      leased.release();
    }
  }
}
