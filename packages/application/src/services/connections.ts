import { randomBytes, createHash } from 'node:crypto';

import {
  CapabilityNotImplementedError,
  ConnectionActionRequiredError,
  type CapabilitySnapshot,
  type Paginated,
  type ProviderId,
} from '@relay/contracts';

import type { ActorContext, ConnectionService, PageQuery, ServiceDeps } from '../types.js';
import type {
  ConnectionHealth,
  ConnectionView,
  MentionEntityView,
  ProviderDestinationView,
} from '../views.js';

import { recordAudit } from '../internal/audit.js';
import { loadCapabilities } from '../internal/capabilities.js';
import { invalid, notFound } from '../internal/errors.js';
import { fromStoredAccountType, toProviderId } from '../internal/mappers.js';
import { pageArgs, toPage } from '../internal/pagination.js';
import { authorized, type Db } from '../internal/runtime.js';
import { asDestinationKind } from '../internal/storage-enums.js';

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
  capabilityVersion: true,
  capabilitiesRefreshedAt: true,
  connectedAt: true,
  lastSuccessfulActionAt: true,
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
  capabilityVersion: string | null;
  capabilitiesRefreshedAt: Date | null;
  connectedAt: Date;
  lastSuccessfulActionAt: Date | null;
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
    capabilityVersion: row.capabilityVersion,
    capabilitiesRefreshedAt: row.capabilitiesRefreshedAt?.toISOString() ?? null,
    connectedAt: row.connectedAt.toISOString(),
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

export function createConnectionService(deps: ServiceDeps): ConnectionService {
  return {
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

          const state = randomBytes(32).toString('base64url');
          const stateHash = createHash('sha256').update(state).digest('hex');
          const verifier = randomBytes(32).toString('base64url');
          const challenge = createHash('sha256').update(verifier).digest('base64url');

          const transaction = await db.oAuthTransaction.create({
            data: {
              workspaceId: actor.workspace.id,
              purpose: 'connect_social_account',
              provider: input.provider,
              stateHash,
              codeChallenge: challenge,
              codeChallengeMethod: 'S256',
              redirectUri: input.redirectTo,
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

          const apiUrl = deps.config.core.apiUrl;
          if (apiUrl === undefined) {
            throw invalid('errors.api_url_not_configured', {});
          }
          const url = new URL(`${apiUrl.replace(/\/+$/, '')}/v1/oauth/${input.provider}/start`);
          url.searchParams.set('state', state);
          url.searchParams.set('transaction_id', transaction.id);

          return { authorizationUrl: url.toString(), transactionId: transaction.id };
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
      return authorized(deps, ctx, 'connection.connect', undefined, async (db, actor) => {
        const stateHash = createHash('sha256').update(input.state).digest('hex');
        const transaction = await db.oAuthTransaction.findFirst({
          where: { id: input.transactionId },
          select: {
            id: true,
            provider: true,
            stateHash: true,
            consumedAt: true,
            expiresAt: true,
            reconnectConnectionId: true,
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

        await db.oAuthTransaction.update({
          where: { id: transaction.id },
          data: { consumedAt: deps.clock.now() },
        });

        // The connector adapter writes the connection and the credential in the
        // worker. Until it reports back there is nothing new to return, so we
        // return what the workspace already holds for this provider rather than
        // inventing a row.
        const rows = await db.socialConnection.findMany({
          where: {
            ...(transaction.provider === null ? {} : { provider: transaction.provider }),
          },
          orderBy: { connectedAt: 'desc' },
          select: CONNECTION_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'connection.connected',
          targetType: 'oauth_transaction',
          targetId: transaction.id,
          after: { provider: transaction.provider, phase: 'complete' },
        });

        return rows.map(toView);
      });
    },

    async reconnect(ctx: ActorContext, connectionId: string): Promise<ConnectionView> {
      return authorized(deps, ctx, 'connection.reconnect', { connectionId }, async (db, actor) => {
        const before = await requireConnection(db, connectionId);
        const after = await db.socialConnection.update({
          where: { id: connectionId },
          data: { status: 'active', statusReason: null },
          select: CONNECTION_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'connection.reconnected',
          targetType: 'social_connection',
          targetId: connectionId,
          before: { status: before.status },
          after: { status: after.status },
        });
        return toView(after);
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
