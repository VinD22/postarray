import { randomBytes, createHash } from 'node:crypto';

import { SecretValue } from '@relay/connectors';
import {
  VERIFIED_DEVELOPMENT_TEST_CONNECTORS,
  VERIFIED_PRODUCTION_CONNECTORS,
} from '@relay/config';
import {
  ACTIVE_CHANNEL_LIMIT,
  CapabilityNotImplementedError,
  ConnectionActionRequiredError,
  ERROR_CODES,
  PROVIDER_IDS,
  RelayError,
  type CapabilitySnapshot,
  type Paginated,
  type ProviderId,
} from '@relay/contracts';

import type { ActorContext, ConnectionService, PageQuery, ServiceDeps } from '../types';
import type {
  ConnectionHealth,
  ConnectionView,
  MentionEntityView,
  ProviderDestinationView,
} from '../views';
import type { OAuthAccountSelectionView } from '../ports/oauth-pending';

import { recordAudit } from '../internal/audit';
import { loadCapabilities } from '../internal/capabilities';
import { invalid, notFound } from '../internal/errors';
import {
  buildOAuthConnectionClaims,
  sanitizeDiscoveredAccounts,
  toExternalAccountForClaim,
} from '../internal/oauth-claim-build';
import { encryptPendingOAuthGrant, serializeCredentialResult } from '../internal/oauth-grant';
import { fromStoredAccountType, toProviderId } from '../internal/mappers';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';
import { asDestinationKind } from '../internal/storage-enums';
import { selectOAuthAccounts } from './oauth-gateway';

/**
 * Connected accounts.
 *
 * A connection row exists once per external account per workspace, forever.
 * Disconnecting flips its status; reconnecting updates the same row, so
 * receipts, analytics history and audit trails survive a token rotation.
 */

const CONNECTION_SELECT = {
  id: true,
  workspaceId: true,
  brandId: true,
  provider: true,
  accountType: true,
  displayName: true,
  handle: true,
  avatarUrl: true,
  profileUrl: true,
  status: true,
  statusReason: true,
  grantedScopes: true,
  capabilityVersion: true,
  capabilitiesRefreshedAt: true,
  connectedAt: true,
  createdByUserId: true,
  lastSuccessfulActionAt: true,
  credential: { select: { accessTokenExpiresAt: true } },
  receipts: {
    orderBy: { publishedAt: 'desc' },
    take: 1,
    select: { publishedAt: true, lastAnalyticsSyncAt: true },
  },
} as const;

interface ConnectionRow {
  id: string;
  workspaceId: string;
  brandId: string | null;
  provider: string;
  accountType: string;
  displayName: string;
  handle: string | null;
  avatarUrl: string | null;
  profileUrl: string | null;
  status: string;
  statusReason: string | null;
  grantedScopes: string[];
  capabilityVersion: string | null;
  capabilitiesRefreshedAt: Date | null;
  connectedAt: Date;
  createdByUserId: string | null;
  lastSuccessfulActionAt: Date | null;
  credential: { accessTokenExpiresAt: Date | null } | null;
  receipts: { publishedAt: Date; lastAnalyticsSyncAt: Date | null }[];
}

const HEALTH_VALUES: readonly ConnectionHealth[] = [
  'active',
  'action_required',
  'expired',
  'revoked',
  'paused',
  'disconnected',
];

function healthOf(status: string): ConnectionHealth {
  return HEALTH_VALUES.find((value) => value === status) ?? 'action_required';
}

function toView(row: ConnectionRow): ConnectionView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    brandId: row.brandId,
    provider: toProviderId(row.provider),
    accountType: fromStoredAccountType(row.accountType),
    displayName: row.displayName,
    handle: row.handle,
    avatarUrl: row.avatarUrl,
    profileUrl: row.profileUrl,
    health: healthOf(row.status),
    // The column holds a stable key, never provider prose.
    statusMessageKey: row.statusReason,
    grantedScopes: [...row.grantedScopes],
    capabilityVersion: row.capabilityVersion,
    capabilitiesRefreshedAt: row.capabilitiesRefreshedAt?.toISOString() ?? null,
    connectedAt: row.connectedAt.toISOString(),
    connectedByUserId: row.createdByUserId,
    accessTokenExpiresAt: row.credential?.accessTokenExpiresAt?.toISOString() ?? null,
    lastPublishedAt: row.receipts[0]?.publishedAt.toISOString() ?? null,
    lastAnalyticsSyncAt: row.receipts[0]?.lastAnalyticsSyncAt?.toISOString() ?? null,
    lastSuccessfulActionAt: row.lastSuccessfulActionAt?.toISOString() ?? null,
  };
}

async function requireConnection(db: Db, connectionId: string): Promise<ConnectionRow> {
  const row = await db.socialConnection.findFirst({
    where: { id: connectionId },
    select: CONNECTION_SELECT,
  });
  if (row === null) {
    throw notFound('connection', connectionId);
  }
  return row;
}

const OAUTH_TRANSACTION_TTL_SECONDS = 600;
const OAUTH_VERIFIER_KEY_PREFIX = 'relay:social-oauth-verifier:';
export const DESTINATION_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
export const MENTION_CACHE_TTL_MS = 5 * 60 * 1000;

export function cacheIsStale(
  refreshedAt: Date | null | undefined,
  now: Date,
  ttlMs: number,
  staleAfter?: Date | null,
): boolean {
  if (refreshedAt === null || refreshedAt === undefined) return true;
  const deadline = staleAfter ?? new Date(refreshedAt.getTime() + ttlMs);
  return deadline.getTime() <= now.getTime();
}

/** Provider revoke runs only for connectors on the verified dev or production allow-list. */
export function providerEligibleForVerifiedRevoke(
  provider: ProviderId,
  isProduction: boolean,
): boolean {
  const verified = isProduction
    ? VERIFIED_PRODUCTION_CONNECTORS
    : VERIFIED_DEVELOPMENT_TEST_CONNECTORS;
  return provider !== 'fake' && verified.includes(provider);
}

/** The only callback URI social providers may be given by the application. */
export function socialOAuthCallbackUrl(apiUrl: string, provider: ProviderId): string {
  const origin = apiUrl.replace(/\/+$/u, '');
  return `${origin}/v1/connections/callback/${encodeURIComponent(provider)}`;
}

export function oauthVerifierKey(transactionId: string): string {
  return `${OAUTH_VERIFIER_KEY_PREFIX}${transactionId}`;
}

/**
 * OAuth completion is a composed capability, not a provider-configured flag.
 * All three pieces are required before a callback may exchange a code or
 * claim a connection row.
 */
export function oauthCompletionReady(
  deps: Pick<ServiceDeps, 'connectors' | 'credentialVault' | 'credentialStore'>,
): boolean {
  return (
    deps.connectors.completeOAuth !== undefined &&
    deps.credentialVault !== undefined &&
    deps.credentialStore?.claimOAuthConnections !== undefined
  );
}

export function oauthCallbackReady(
  deps: Pick<ServiceDeps, 'connectors' | 'credentialVault' | 'kv'>,
): boolean {
  return (
    deps.connectors.completeOAuth !== undefined &&
    deps.credentialVault !== undefined &&
    deps.kv !== undefined
  );
}

export function oauthClaimReady(
  deps: Pick<ServiceDeps, 'connectors' | 'credentialVault' | 'credentialStore' | 'oauthPending'>,
): boolean {
  return oauthCompletionReady(deps) && deps.oauthPending !== undefined;
}

/**
 * Account attachment is always an explicit user decision. The property stays
 * optional at the transport boundary during the two-phase rollout so an older
 * callback fails safely instead of exchanging its one-use provider code.
 */
export function requireExplicitOAuthAccountSelection(
  selectedExternalAccountIds: readonly string[] | undefined,
): readonly string[] {
  if (selectedExternalAccountIds === undefined || selectedExternalAccountIds.length === 0) {
    throw invalid('error.request_invalid.message', {
      reason: 'OAUTH_ACCOUNT_SELECTION_REQUIRED',
    });
  }
  if (selectedExternalAccountIds.length > ACTIVE_CHANNEL_LIMIT) {
    throw invalid('error.request_invalid.message', {
      reason: 'OAUTH_ACCOUNT_SELECTION_TOO_LARGE',
      limit: ACTIVE_CHANNEL_LIMIT,
    });
  }
  const unique = new Set(selectedExternalAccountIds);
  if (unique.size !== selectedExternalAccountIds.length) {
    throw invalid('error.request_invalid.message', {
      reason: 'OAUTH_ACCOUNT_SELECTION_DUPLICATE',
    });
  }
  if (
    selectedExternalAccountIds.some(
      (value) => value.length > 512 || value.trim().length === 0 || value !== value.trim(),
    )
  ) {
    throw invalid('error.request_invalid.message', {
      reason: 'OAUTH_ACCOUNT_SELECTION_INVALID',
    });
  }
  return [...selectedExternalAccountIds];
}

/** Every connected row except an explicit disconnect occupies a plan slot. */
export const CHANNEL_SLOT_STATUSES = [
  'active',
  'action_required',
  'expired',
  'revoked',
  'paused',
] as const;

export function assertChannelSlotAvailable(
  used: number,
  limit: number = ACTIVE_CHANNEL_LIMIT,
): void {
  if (used < limit) {
    return;
  }
  throw new RelayError(ERROR_CODES.QUOTA_EXCEEDED, {
    messageKey: 'errors.channel_limit_reached',
    details: { used, limit },
  });
}

async function requireChannelSlot(db: Db): Promise<void> {
  const used = await db.socialConnection.count({
    where: { status: { in: [...CHANNEL_SLOT_STATUSES] } },
  });
  assertChannelSlotAvailable(used);
}

export function createConnectionService(deps: ServiceDeps): ConnectionService {
  return {
    async listAvailableProviders(ctx: ActorContext): Promise<readonly ProviderId[]> {
      return authorized(deps, ctx, 'connection.read', undefined, async () =>
        PROVIDER_IDS.filter((provider) => provider !== 'fake' && deps.connectors.has(provider)),
      );
    },

    async list(
      ctx: ActorContext,
      query: PageQuery & { brandId?: string; provider?: ProviderId } = {},
    ): Promise<Paginated<ConnectionView>> {
      return authorized(deps, ctx, 'connection.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.socialConnection.findMany({
          where: {
            ...(query.brandId === undefined ? {} : { brandId: query.brandId }),
            ...(query.provider === undefined ? {} : { provider: query.provider }),
          },
          orderBy: { id: 'asc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: CONNECTION_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toView);
      });
    },

    async get(ctx: ActorContext, connectionId: string): Promise<ConnectionView> {
      return authorized(deps, ctx, 'connection.read', { connectionId }, async (db) =>
        toView(await requireConnection(db, connectionId)),
      );
    },

    async getCapabilities(ctx: ActorContext, connectionId: string): Promise<CapabilitySnapshot> {
      return authorized(deps, ctx, 'connection.read', { connectionId }, async (db) => {
        const loaded = await loadCapabilities(db, deps, connectionId);
        if (loaded === null) {
          throw notFound('connection', connectionId);
        }
        if (loaded.snapshot === null) {
          // We do not invent a limit. An unknown capability is reported as
          // unknown, which the UI renders differently from unsupported.
          throw new CapabilityNotImplementedError({
            messageKey: 'errors.capability_not_implemented',
            details: { connectionId, provider: loaded.provider },
          });
        }
        return loaded.snapshot;
      });
    },

    /**
     * Start an authorization. The state is unpredictable and stored only as a
     * hash, the redirect must match the configured allowlist exactly, and the
     * row is consumed once.
     */
    async beginOAuth(
      ctx: ActorContext,
      input: { provider: ProviderId; brandId?: string | null; redirectTo: string },
    ): Promise<{ authorizationUrl: string; transactionId: string }> {
      return authorized(
        deps,
        ctx,
        'connection.connect',
        input.brandId === undefined ? undefined : { brandId: input.brandId },
        async (db, actor) => {
          if (!deps.connectors.has(input.provider)) {
            throw new CapabilityNotImplementedError({
              messageKey: 'errors.capability_not_implemented',
              details: { provider: input.provider },
            });
          }
          const beginProviderOAuth = deps.connectors.beginOAuth;
          if (beginProviderOAuth === undefined) {
            throw new CapabilityNotImplementedError({
              messageKey: 'errors.capability_not_implemented',
              details: { provider: input.provider, capability: 'oauth_start' },
            });
          }
          await requireChannelSlot(db);

          const state = randomBytes(32).toString('base64url');
          const stateHash = createHash('sha256').update(state).digest('hex');
          const verifier = randomBytes(32).toString('base64url');
          const challenge = createHash('sha256').update(verifier).digest('base64url');
          const apiUrl = deps.config.core.apiUrl;
          if (apiUrl === undefined) {
            throw invalid('errors.api_url_not_configured', {});
          }
          const redirectUri = socialOAuthCallbackUrl(apiUrl, input.provider);
          const authorization = await beginProviderOAuth({
            provider: input.provider,
            state,
            codeChallenge: challenge,
            codeChallengeMethod: 'S256',
            redirectUri,
          });
          let authorizationUrl: URL;
          try {
            authorizationUrl = new URL(authorization.authorizationUrl);
          } catch {
            throw new RelayError(ERROR_CODES.INTERNAL, {
              details: {
                reason: 'connector_authorization_url_malformed',
                provider: input.provider,
              },
            });
          }
          if (authorizationUrl.searchParams.get('state') !== state) {
            throw new RelayError(ERROR_CODES.INTERNAL, {
              details: {
                reason: 'connector_authorization_state_mismatch',
                provider: input.provider,
              },
            });
          }

          const transaction = await db.oAuthTransaction.create({
            data: {
              workspaceId: actor.workspace.id,
              brandId: input.brandId ?? null,
              purpose: 'connect_social_account',
              provider: input.provider,
              stateHash,
              codeChallenge: challenge,
              codeChallengeMethod: 'S256',
              redirectUri,
              requestedScopes: [...authorization.requestedScopes],
              ...(actor.userId === null ? {} : { initiatedByUserId: actor.userId }),
              expiresAt: new Date(
                deps.clock.now().getTime() + OAUTH_TRANSACTION_TTL_SECONDS * 1000,
              ),
            },
            select: { id: true },
          });

          await recordAudit(db, actor, {
            action: 'connection.connected',
            targetType: 'oauth_transaction',
            targetId: transaction.id,
            after: { provider: input.provider, phase: 'begin' },
          });

          const stored = await deps.kv.set(oauthVerifierKey(transaction.id), verifier, {
            ttlSeconds: OAUTH_TRANSACTION_TTL_SECONDS,
          });
          if (!stored) {
            throw new RelayError(ERROR_CODES.INTERNAL, {
              details: { reason: 'oauth_verifier_store_failed', transactionId: transaction.id },
            });
          }

          return { authorizationUrl: authorizationUrl.toString(), transactionId: transaction.id };
        },
      );
    },

    /**
     * Exchange the provider callback code once and persist encrypted discovery
     * for explicit account selection. The OAuth transaction stays open until
     * claim.
     */
    async handleOAuthCallback(
      ctx: ActorContext,
      input: { transactionId: string; code: string; state: string },
    ): Promise<void> {
      return authorized(deps, ctx, 'connection.connect', undefined, async (db) => {
        if (!oauthCallbackReady(deps) || deps.oauthPending === undefined) {
          throw new CapabilityNotImplementedError({
            messageKey: 'errors.capability_not_implemented',
            details: { capability: 'oauth_callback_persistence' },
          });
        }
        if (deps.connectors.completeOAuth === undefined || deps.credentialVault === undefined) {
          throw new CapabilityNotImplementedError({
            messageKey: 'errors.capability_not_implemented',
            details: { capability: 'oauth_completion' },
          });
        }

        const stateHash = createHash('sha256').update(input.state).digest('hex');
        const transaction = await db.oAuthTransaction.findFirst({
          where: { id: input.transactionId },
          select: {
            id: true,
            workspaceId: true,
            brandId: true,
            provider: true,
            stateHash: true,
            codeChallenge: true,
            redirectUri: true,
            consumedAt: true,
            expiresAt: true,
          },
        });
        if (transaction === null) {
          throw notFound('oauth_transaction', input.transactionId);
        }
        if (transaction.consumedAt !== null) {
          throw invalid('errors.oauth_transaction_consumed', {
            transactionId: input.transactionId,
          });
        }
        if (transaction.expiresAt.getTime() <= deps.clock.now().getTime()) {
          throw invalid('errors.oauth_transaction_expired', {
            transactionId: input.transactionId,
          });
        }
        if (transaction.stateHash !== stateHash) {
          throw invalid('errors.oauth_state_mismatch', {});
        }
        if (transaction.provider === null) {
          throw invalid('error.request_invalid.message', { reason: 'OAUTH_PROVIDER_MISSING' });
        }
        const provider = toProviderId(transaction.provider);

        const verifier = await deps.kv.getAndDelete(oauthVerifierKey(input.transactionId));
        if (verifier === null) {
          throw invalid('errors.oauth_verifier_missing', { transactionId: input.transactionId });
        }
        if (transaction.codeChallenge === null) {
          throw invalid('error.request_invalid.message', { reason: 'OAUTH_CHALLENGE_MISSING' });
        }

        const discovery = await deps.connectors.completeOAuth({
          provider,
          workspaceId: transaction.workspaceId,
          code: input.code,
          codeVerifier: new SecretValue(verifier),
          expectedCodeChallenge: transaction.codeChallenge,
          redirectUri: transaction.redirectUri,
        });

        const grant = serializeCredentialResult(discovery.credential);
        const encryptedGrant = await encryptPendingOAuthGrant(deps.credentialVault, {
          workspaceId: transaction.workspaceId,
          transactionId: transaction.id,
          provider,
          grant,
        });

        await deps.oauthPending?.create({
          transactionId: transaction.id,
          workspaceId: transaction.workspaceId,
          brandId: transaction.brandId,
          provider,
          stateHash: transaction.stateHash,
          accounts: sanitizeDiscoveredAccounts(discovery.accounts),
          grant: encryptedGrant,
          expiresAt: transaction.expiresAt.toISOString(),
          consumedAt: null,
        });
      });
    },

    async getOAuthAccountSelection(
      ctx: ActorContext,
      transactionId: string,
    ): Promise<OAuthAccountSelectionView> {
      return authorized(deps, ctx, 'connection.connect', undefined, async () => {
        if (deps.oauthPending === undefined) {
          throw new CapabilityNotImplementedError({
            messageKey: 'errors.capability_not_implemented',
            details: { capability: 'oauth_pending_discovery' },
          });
        }
        const pending = await deps.oauthPending.find({
          workspaceId: ctx.workspaceId,
          transactionId,
        });
        if (pending === null || pending.consumedAt !== null) {
          throw notFound('oauth_pending_discovery', transactionId);
        }
        if (new Date(pending.expiresAt).getTime() <= deps.clock.now().getTime()) {
          throw invalid('errors.oauth_transaction_expired', { transactionId });
        }
        return {
          transactionId: pending.transactionId,
          provider: pending.provider,
          expiresAt: pending.expiresAt,
          accounts: pending.accounts,
        };
      });
    },

    /**
     * Claim selected accounts after discovery. Requires a prior callback exchange.
     */
    async completeOAuth(
      ctx: ActorContext,
      input: {
        transactionId: string;
        selectedExternalAccountIds: readonly string[];
      },
    ): Promise<readonly ConnectionView[]> {
      return authorized(deps, ctx, 'connection.connect', undefined, async (db, actor) => {
        const selectedExternalAccountIds = requireExplicitOAuthAccountSelection(
          input.selectedExternalAccountIds,
        );

        if (!oauthClaimReady(deps)) {
          throw new CapabilityNotImplementedError({
            messageKey: 'errors.capability_not_implemented',
            details: {
              capability: 'oauth_completion_persistence',
              reason: 'atomic_oauth_claim_adapter_unavailable',
            },
          });
        }
        if (
          deps.credentialVault === undefined ||
          deps.credentialStore?.claimOAuthConnections === undefined ||
          deps.oauthPending === undefined
        ) {
          throw new CapabilityNotImplementedError({
            messageKey: 'errors.capability_not_implemented',
            details: { capability: 'oauth_completion' },
          });
        }

        const pending = await deps.oauthPending.find({
          workspaceId: ctx.workspaceId,
          transactionId: input.transactionId,
        });
        if (pending === null || pending.consumedAt !== null) {
          throw notFound('oauth_pending_discovery', input.transactionId);
        }
        if (new Date(pending.expiresAt).getTime() <= deps.clock.now().getTime()) {
          throw invalid('errors.oauth_transaction_expired', { transactionId: input.transactionId });
        }

        const accountsForSelection = pending.accounts.map((account) =>
          toExternalAccountForClaim(account),
        );
        const selectedAccounts = selectOAuthAccounts(
          accountsForSelection,
          selectedExternalAccountIds,
        );

        const oauthTransaction = await db.oAuthTransaction.findFirst({
          where: { id: input.transactionId },
          select: { reconnectConnectionId: true },
        });
        const reconnectTarget =
          oauthTransaction?.reconnectConnectionId === null ||
          oauthTransaction?.reconnectConnectionId === undefined
            ? null
            : await db.socialConnection.findFirst({
                where: { id: oauthTransaction.reconnectConnectionId },
                select: { id: true, provider: true, externalAccountId: true },
              });
        if (
          oauthTransaction?.reconnectConnectionId !== null &&
          oauthTransaction?.reconnectConnectionId !== undefined &&
          reconnectTarget === null
        ) {
          throw notFound('connection', oauthTransaction.reconnectConnectionId);
        }
        if (
          reconnectTarget !== null &&
          (selectedExternalAccountIds.length !== 1 ||
            selectedExternalAccountIds[0] !== reconnectTarget.externalAccountId ||
            reconnectTarget.provider !== pending.provider)
        ) {
          throw invalid('error.request_invalid.message', {
            reason: 'OAUTH_RECONNECT_ACCOUNT_MISMATCH',
          });
        }

        const used = await db.socialConnection.count({
          where: { status: { in: [...CHANNEL_SLOT_STATUSES] } },
        });
        if (reconnectTarget === null) assertChannelSlotAvailable(used, ACTIVE_CHANNEL_LIMIT);
        if (reconnectTarget === null && used + selectedAccounts.length > ACTIVE_CHANNEL_LIMIT) {
          throw new RelayError(ERROR_CODES.QUOTA_EXCEEDED, {
            messageKey: 'errors.channel_limit_reached',
            details: { used, limit: ACTIVE_CHANNEL_LIMIT },
          });
        }

        const existingRows = await db.socialConnection.findMany({
          where: {
            workspaceId: ctx.workspaceId,
            provider: pending.provider,
            externalAccountId: { in: [...selectedExternalAccountIds] },
          },
          select: { id: true, externalAccountId: true, status: true },
        });
        const existingConnectionIds = new Map<string, string>();
        if (reconnectTarget !== null) {
          existingConnectionIds.set(reconnectTarget.externalAccountId, reconnectTarget.id);
        }
        for (const row of existingRows) {
          if (row.status !== 'disconnected' && row.id !== reconnectTarget?.id) {
            throw invalid('error.request_invalid.message', {
              reason: 'OAUTH_ACCOUNT_ALREADY_CONNECTED',
              externalAccountId: row.externalAccountId,
            });
          }
          existingConnectionIds.set(row.externalAccountId, row.id);
        }

        let claims = await buildOAuthConnectionClaims({
          vault: deps.credentialVault,
          workspaceId: ctx.workspaceId,
          transactionId: input.transactionId,
          provider: pending.provider,
          grantEnvelope: pending.grant,
          accounts: selectedAccounts,
          existingConnectionIds,
        });

        claims = await Promise.all(
          claims.map(async (claim) => {
            const snapshot = await deps.connectors.capabilitiesFor({
              provider: pending.provider,
              connectionId: claim.connectionId,
              accountType: claim.accountType,
            });
            return {
              ...claim,
              capabilities: snapshot as unknown as Record<string, unknown>,
              capabilityVersion: snapshot.capabilityVersion,
            };
          }),
        );

        const claimResult = await deps.credentialStore.claimOAuthConnections({
          workspaceId: ctx.workspaceId,
          transactionId: input.transactionId,
          expectedProvider: pending.provider,
          expectedStateHash: pending.stateHash,
          claimedAt: deps.clock.now().toISOString(),
          actor: {
            actorType: actor.ctx.actorType,
            actorId: actor.ctx.actorId,
            userId: actor.userId,
            surface: actor.ctx.surface,
            correlationId: actor.ctx.correlationId,
            approvalLevel: actor.ctx.approvalLevel,
            ...(actor.ctx.clientId === undefined ? {} : { clientId: actor.ctx.clientId }),
            ...(actor.ctx.ipAddress === undefined ? {} : { ipAddress: actor.ctx.ipAddress }),
            ...(actor.ctx.userAgent === undefined ? {} : { userAgent: actor.ctx.userAgent }),
          },
          connections: claims,
        });

        const rows = await db.socialConnection.findMany({
          where: { id: { in: [...claimResult.connectionIds] } },
          select: CONNECTION_SELECT,
        });
        return rows.map((row) => toView(row));
      });
    },

    async reconnect(ctx: ActorContext, connectionId: string) {
      return authorized(deps, ctx, 'connection.reconnect', { connectionId }, async (db, actor) => {
        const connection = await requireConnection(db, connectionId);
        const provider = toProviderId(connection.provider);
        const beginProviderOAuth = deps.connectors.beginOAuth;
        if (beginProviderOAuth === undefined) {
          throw new CapabilityNotImplementedError({
            messageKey: 'errors.capability_not_implemented',
            details: { provider, capability: 'oauth_start' },
          });
        }
        const apiUrl = deps.config.core.apiUrl;
        if (apiUrl === undefined) throw invalid('errors.api_url_not_configured', {});
        const state = randomBytes(32).toString('base64url');
        const stateHash = createHash('sha256').update(state).digest('hex');
        const verifier = randomBytes(32).toString('base64url');
        const challenge = createHash('sha256').update(verifier).digest('base64url');
        const redirectUri = socialOAuthCallbackUrl(apiUrl, provider);
        const authorization = await beginProviderOAuth({
          provider,
          state,
          codeChallenge: challenge,
          codeChallengeMethod: 'S256',
          redirectUri,
        });
        let authorizationUrl: URL;
        try {
          authorizationUrl = new URL(authorization.authorizationUrl);
        } catch {
          throw new RelayError(ERROR_CODES.INTERNAL, {
            details: { reason: 'connector_authorization_url_malformed', provider },
          });
        }
        if (authorizationUrl.searchParams.get('state') !== state) {
          throw new RelayError(ERROR_CODES.INTERNAL, {
            details: { reason: 'connector_authorization_state_mismatch', provider },
          });
        }
        const transaction = await db.oAuthTransaction.create({
          data: {
            workspaceId: actor.workspace.id,
            brandId: connection.brandId,
            purpose: 'reconnect_social_account',
            provider,
            stateHash,
            codeChallenge: challenge,
            codeChallengeMethod: 'S256',
            redirectUri,
            requestedScopes: [...authorization.requestedScopes],
            reconnectConnectionId: connectionId,
            ...(actor.userId === null ? {} : { initiatedByUserId: actor.userId }),
            expiresAt: new Date(deps.clock.now().getTime() + OAUTH_TRANSACTION_TTL_SECONDS * 1000),
          },
          select: { id: true },
        });
        const stored = await deps.kv.set(oauthVerifierKey(transaction.id), verifier, {
          ttlSeconds: OAUTH_TRANSACTION_TTL_SECONDS,
        });
        if (!stored) {
          throw new RelayError(ERROR_CODES.INTERNAL, {
            details: { reason: 'oauth_verifier_store_failed', transactionId: transaction.id },
          });
        }
        await recordAudit(db, actor, {
          action: 'connection.reconnected',
          targetType: 'oauth_transaction',
          targetId: transaction.id,
          after: { provider, phase: 'begin', connectionId },
        });
        return { authorizationUrl: authorizationUrl.toString(), transactionId: transaction.id };
      });
    },

    async pause(ctx: ActorContext, connectionId: string): Promise<ConnectionView> {
      return authorized(deps, ctx, 'connection.pause', { connectionId }, async (db, actor) => {
        const before = await requireConnection(db, connectionId);
        const after = await db.socialConnection.update({
          where: { id: connectionId },
          data: { status: 'paused', statusReason: 'connection.paused_by_user' },
          select: CONNECTION_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'connection.disconnected',
          targetType: 'social_connection',
          targetId: connectionId,
          before: { status: before.status },
          after: { status: 'paused' },
        });
        return toView(after);
      });
    },

    async resume(ctx: ActorContext, connectionId: string): Promise<ConnectionView> {
      return authorized(deps, ctx, 'connection.pause', { connectionId }, async (db, actor) => {
        const before = await requireConnection(db, connectionId);
        if (before.status !== 'paused') {
          throw new ConnectionActionRequiredError({
            messageKey: 'errors.connection_not_paused',
            details: { connectionId, status: before.status },
          });
        }
        const after = await db.socialConnection.update({
          where: { id: connectionId },
          data: { status: 'active', statusReason: null },
          select: CONNECTION_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'connection.reconnected',
          targetType: 'social_connection',
          targetId: connectionId,
          before: { status: 'paused' },
          after: { status: 'active' },
        });
        return toView(after);
      });
    },

    async disconnect(ctx: ActorContext, connectionId: string): Promise<ConnectionView> {
      return authorized(deps, ctx, 'connection.disconnect', { connectionId }, async (db, actor) => {
        const before = await requireConnection(db, connectionId);
        const provider = toProviderId(before.provider);
        if (
          providerEligibleForVerifiedRevoke(provider, deps.config.core.isProduction) &&
          deps.connectorExecutionGateway !== undefined
        ) {
          try {
            await deps.connectorExecutionGateway.revoke({
              workspaceId: before.workspaceId,
              connectionId,
            });
          } catch (error: unknown) {
            deps.logger.warn(
              { connectionId, provider, error: String(error) },
              'connection.provider_revoke_failed',
            );
          }
        }
        const after = await db.socialConnection.update({
          where: { id: connectionId },
          data: {
            status: 'disconnected',
            statusReason: 'connection.disconnected_by_user',
            disconnectedAt: deps.clock.now(),
          },
          select: CONNECTION_SELECT,
        });
        // The credential goes now. The connection row stays so receipts and
        // analytics keep their subject.
        await db.socialCredential.deleteMany({ where: { connectionId } });
        await recordAudit(db, actor, {
          action: 'connection.disconnected',
          targetType: 'social_connection',
          targetId: connectionId,
          before: { status: before.status },
          after: { status: 'disconnected' },
        });
        return toView(after);
      });
    },

    async listDestinations(
      ctx: ActorContext,
      connectionId: string,
      input: { kind: string; query?: string },
    ): Promise<readonly ProviderDestinationView[]> {
      return authorized(deps, ctx, 'connection.read', { connectionId }, async (db) => {
        // An empty string means "every kind". Anything else has to name a real
        // destination kind, or the answer would silently be the wrong list.
        const kind = input.kind === '' ? undefined : asDestinationKind(input.kind);
        if (input.kind !== '' && kind === undefined) {
          throw invalid('errors.unknown_destination_kind', { kind: input.kind });
        }
        const cached = await db.providerDestination.findMany({
          where: {
            connectionId,
            ...(kind === undefined ? {} : { kind }),
            ...(input.query === undefined || input.query === ''
              ? {}
              : { displayName: { contains: input.query, mode: 'insensitive' } }),
          },
          orderBy: { displayName: 'asc' },
          take: 100,
          select: {
            id: true,
            connectionId: true,
            kind: true,
            externalId: true,
            displayName: true,
            permalink: true,
            canPublish: true,
            refreshedAt: true,
            staleAfter: true,
          },
        });
        let rows = cached;
        const stale =
          cached.length === 0 ||
          cached.some((row) =>
            cacheIsStale(
              row.refreshedAt,
              deps.clock.now(),
              DESTINATION_CACHE_TTL_MS,
              row.staleAfter,
            ),
          );
        if (stale && deps.connectorExecutionGateway !== undefined) {
          try {
            const connection = await requireConnection(db, connectionId);
            const fresh = await deps.connectorExecutionGateway.listDestinations({
              workspaceId: ctx.workspaceId,
              connectionId,
              ...(kind === undefined ? {} : { kind }),
              ...(input.query === undefined ? {} : { query: input.query }),
              limit: 100,
            });
            await Promise.all(
              fresh.map((item) =>
                db.providerDestination.upsert({
                  where: {
                    connectionId_kind_externalId: {
                      connectionId,
                      kind: item.kind as never,
                      externalId: item.externalId,
                    },
                  },
                  create: {
                    workspaceId: ctx.workspaceId,
                    connectionId,
                    provider: connection.provider as never,
                    kind: item.kind as never,
                    externalId: item.externalId,
                    displayName: item.displayLabel,
                    canPublish: item.canPost,
                    refreshedAt: new Date(item.refreshedAt),
                    staleAfter: new Date(item.expiresAt),
                  },
                  update: {
                    displayName: item.displayLabel,
                    canPublish: item.canPost,
                    refreshedAt: new Date(item.refreshedAt),
                    staleAfter: new Date(item.expiresAt),
                  },
                }),
              ),
            );
            rows = await db.providerDestination.findMany({
              where: {
                connectionId,
                ...(kind === undefined ? {} : { kind }),
                ...(input.query === undefined || input.query === ''
                  ? {}
                  : { displayName: { contains: input.query, mode: 'insensitive' } }),
              },
              orderBy: { displayName: 'asc' },
              take: 100,
              select: {
                id: true,
                connectionId: true,
                kind: true,
                externalId: true,
                displayName: true,
                permalink: true,
                canPublish: true,
                refreshedAt: true,
                staleAfter: true,
              },
            });
          } catch {
            rows = cached;
          }
        }
        return rows.map((row) => ({
          id: row.id,
          connectionId: row.connectionId,
          kind: row.kind,
          externalId: row.externalId,
          displayName: row.displayName,
          permalink: row.permalink,
          canPublish: row.canPublish,
          refreshedAt: row.refreshedAt.toISOString(),
        }));
      });
    },

    async searchMentions(
      ctx: ActorContext,
      connectionId: string,
      input: { query: string },
    ): Promise<readonly MentionEntityView[]> {
      return authorized(deps, ctx, 'connection.read', { connectionId }, async (db) => {
        const cached = await db.mentionEntity.findMany({
          where: {
            connectionId,
            OR: [
              { handle: { contains: input.query, mode: 'insensitive' } },
              { displayLabel: { contains: input.query, mode: 'insensitive' } },
            ],
          },
          orderBy: { displayLabel: 'asc' },
          take: 25,
          select: {
            id: true,
            connectionId: true,
            provider: true,
            kind: true,
            externalId: true,
            handle: true,
            displayLabel: true,
            avatarUrl: true,
            resolvedAt: true,
            expiresAt: true,
          },
        });
        let rows = cached;
        const stale =
          cached.length === 0 ||
          cached.some((row) =>
            cacheIsStale(row.resolvedAt, deps.clock.now(), MENTION_CACHE_TTL_MS, row.expiresAt),
          );
        if (stale && deps.connectorExecutionGateway !== undefined) {
          try {
            const connection = await requireConnection(db, connectionId);
            const fresh = await deps.connectorExecutionGateway.searchMentions({
              workspaceId: ctx.workspaceId,
              connectionId,
              query: input.query,
              limit: 25,
            });
            await Promise.all(
              fresh.map((item) =>
                db.mentionEntity.upsert({
                  where: {
                    connectionId_provider_externalId: {
                      connectionId,
                      provider: connection.provider as never,
                      externalId: item.externalId,
                    },
                  },
                  create: {
                    workspaceId: ctx.workspaceId,
                    connectionId,
                    provider: connection.provider as never,
                    kind: item.kind as never,
                    externalId: item.externalId,
                    handle: item.handle,
                    displayLabel: item.displayLabel,
                    avatarUrl: item.avatarUrl,
                    resolvedAt: new Date(item.resolvedAt),
                    expiresAt: new Date(new Date(item.resolvedAt).getTime() + MENTION_CACHE_TTL_MS),
                  },
                  update: {
                    kind: item.kind as never,
                    handle: item.handle,
                    displayLabel: item.displayLabel,
                    avatarUrl: item.avatarUrl,
                    resolvedAt: new Date(item.resolvedAt),
                    expiresAt: new Date(new Date(item.resolvedAt).getTime() + MENTION_CACHE_TTL_MS),
                  },
                }),
              ),
            );
            rows = await db.mentionEntity.findMany({
              where: {
                connectionId,
                OR: [
                  { handle: { contains: input.query, mode: 'insensitive' } },
                  { displayLabel: { contains: input.query, mode: 'insensitive' } },
                ],
              },
              orderBy: { displayLabel: 'asc' },
              take: 25,
              select: {
                id: true,
                connectionId: true,
                provider: true,
                kind: true,
                externalId: true,
                handle: true,
                displayLabel: true,
                avatarUrl: true,
                resolvedAt: true,
                expiresAt: true,
              },
            });
          } catch {
            rows = cached;
          }
        }
        return rows.map((row) => ({
          id: row.id,
          connectionId: row.connectionId,
          provider: toProviderId(row.provider),
          kind: row.kind,
          externalId: row.externalId,
          handle: row.handle,
          displayLabel: row.displayLabel,
          avatarUrl: row.avatarUrl,
          resolvedAt: row.resolvedAt.toISOString(),
        }));
      });
    },
  };
}
