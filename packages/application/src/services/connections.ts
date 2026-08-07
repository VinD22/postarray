import { randomBytes, createHash } from 'node:crypto';

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

import { recordAudit } from '../internal/audit';
import { loadCapabilities } from '../internal/capabilities';
import { invalid, notFound } from '../internal/errors';
import { fromStoredAccountType, toProviderId } from '../internal/mappers';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';
import { asDestinationKind } from '../internal/storage-enums';

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

/** The only callback URI social providers may be given by the application. */
export function socialOAuthCallbackUrl(apiUrl: string, provider: ProviderId): string {
  const origin = apiUrl.replace(/\/+$/u, '');
  return `${origin}/v1/connections/callback/${encodeURIComponent(provider)}`;
}

export function oauthVerifierKey(transactionId: string): string {
  return `${OAUTH_VERIFIER_KEY_PREFIX}${transactionId}`;
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
     * Complete an authorization. The connector adapter owns the token exchange;
     * this method owns consuming the transaction exactly once and recording the
     * connection. No token ever reaches this layer.
     */
    async completeOAuth(
      ctx: ActorContext,
      input: { transactionId: string; code: string; state: string },
    ): Promise<readonly ConnectionView[]> {
      return authorized(deps, ctx, 'connection.connect', undefined, async (db) => {
        const stateHash = createHash('sha256').update(input.state).digest('hex');
        const transaction = await db.oAuthTransaction.findFirst({
          where: { id: input.transactionId },
          select: {
            id: true,
            provider: true,
            stateHash: true,
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

        // Never consume a transaction or report a connection until a provider
        // adapter has exchanged the code, discovered eligible accounts and
        // persisted an encrypted credential. Returning existing rows here used
        // to create a false “connected” redirect and allowed a callback to look
        // successful even though no provider call occurred.
        throw new CapabilityNotImplementedError({
          messageKey: 'errors.capability_not_implemented',
          details: {
            provider: transaction.provider,
            capability: 'oauth_completion',
            transactionId: transaction.id,
          },
        });
      });
    },

    async reconnect(ctx: ActorContext, connectionId: string): Promise<ConnectionView> {
      return authorized(deps, ctx, 'connection.reconnect', { connectionId }, async (db) => {
        const connection = await requireConnection(db, connectionId);
        throw new CapabilityNotImplementedError({
          messageKey: 'errors.capability_not_implemented',
          details: {
            provider: toProviderId(connection.provider),
            capability: 'oauth_reconnect',
          },
        });
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
        const rows = await db.providerDestination.findMany({
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
          },
        });
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
        const rows = await db.mentionEntity.findMany({
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
          },
        });
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
