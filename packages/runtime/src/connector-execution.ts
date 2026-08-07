import {
  capabilitySnapshotSchema,
  ERROR_CODES,
  RelayError,
  type CapabilitySnapshot,
} from '@relay/contracts';
import {
  credentialResultSchema,
  ensureNotAlreadyPublished,
  publishRequestSchema,
  publishResultSchema,
  systemClock,
} from '@relay/connectors';
import type {
  Clock,
  OAuthClientConfig,
  ProviderDraft,
  PublishRequest,
  PublishResult,
  RefreshRequest,
  RevokeRequest,
} from '@relay/connectors';

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

function parseSnapshot(snapshot: CapabilitySnapshot, connection: ConnectionDetails): CapabilitySnapshot {
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

      return {
        status: 'executed',
        result: publishResultSchema.parse(await connector.publish(request)),
      };
    } finally {
      leased.release();
    }
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
              Math.round((new Date(result.expiresAt).getTime() - this.#clock.now().getTime()) / 1000),
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
