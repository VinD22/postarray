import { createHash, randomBytes } from 'node:crypto';

import { narrowScopes } from '@relay/authz';
import { normalizeScopes, type Paginated, type Scope } from '@relay/contracts';

import type { ActorContext, OAuthAppService, PageQuery, ServiceDeps } from '../types';
import type { CreatedOAuthAppView, OAuthAppView, OAuthGrantView } from '../views';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized } from '../internal/runtime';

/**
 * Third-party developer applications.
 *
 * Redirect URIs match exactly: no wildcards, no prefix matching, at most five,
 * and never a URI whose path or query contains another absolute URL. The client
 * secret is shown once. Revoking a grant is immediate and refuses every new
 * action; work already authorised and in flight is not silently dropped, it is
 * noted on the receipt instead.
 */

const MAX_REDIRECT_URIS = 5;

const APP_SELECT = {
  id: true,
  workspaceId: true,
  name: true,
  clientId: true,
  clientType: true,
  redirectUris: true,
  allowedScopes: true,
  status: true,
  secretRotatedAt: true,
  createdAt: true,
} as const;

interface AppRow {
  id: string;
  workspaceId: string;
  name: string;
  clientId: string;
  clientType: string;
  redirectUris: string[];
  allowedScopes: string[];
  status: string;
  secretRotatedAt: Date | null;
  createdAt: Date;
}

function toAppView(row: AppRow): OAuthAppView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    name: row.name,
    clientId: row.clientId,
    clientType: row.clientType === 'confidential' ? 'confidential' : 'public',
    redirectUris: [...row.redirectUris],
    allowedScopes: normalizeScopes(row.allowedScopes),
    status: row.status as OAuthAppView['status'],
    secretRotatedAt: row.secretRotatedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

const GRANT_SELECT = {
  id: true,
  oauthClientId: true,
  subjectUserId: true,
  scopes: true,
  brandScope: true,
  connectionScope: true,
  consentedAt: true,
  lastUsedAt: true,
  revokedAt: true,
  oauthClient: { select: { name: true } },
} as const;

interface GrantRow {
  id: string;
  oauthClientId: string;
  subjectUserId: string;
  scopes: string[];
  brandScope: string[];
  connectionScope: string[];
  consentedAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
  oauthClient: { name: string };
}

function toGrantView(row: GrantRow): OAuthGrantView {
  return {
    id: row.id,
    oauthClientId: row.oauthClientId,
    clientName: row.oauthClient.name,
    subjectUserId: row.subjectUserId,
    scopes: normalizeScopes(row.scopes),
    brandScope: [...row.brandScope],
    connectionScope: [...row.connectionScope],
    consentedAt: row.consentedAt.toISOString(),
    lastUsedAt: row.lastUsedAt?.toISOString() ?? null,
    revokedAt: row.revokedAt?.toISOString() ?? null,
  };
}

/** Exact match only, https only, no embedded absolute URL, no fragment. */
function assertRedirectUris(uris: readonly string[]): void {
  if (uris.length === 0 || uris.length > MAX_REDIRECT_URIS) {
    throw invalid('errors.oauth_redirect_count', { max: MAX_REDIRECT_URIS });
  }
  for (const uri of uris) {
    let parsed: URL;
    try {
      parsed = new URL(uri);
    } catch {
      throw invalid('errors.oauth_redirect_invalid', { uri });
    }
    const isLoopback = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    if (parsed.protocol !== 'https:' && !isLoopback) {
      throw invalid('errors.oauth_redirect_insecure', { uri });
    }
    if (parsed.hash !== '') {
      throw invalid('errors.oauth_redirect_fragment', { uri });
    }
    // An open-redirector pattern: a URL nested inside the path or the query.
    const rest = `${parsed.pathname}${parsed.search}`;
    if (/https?%3a%2f%2f/i.test(rest) || /https?:\/\//i.test(rest)) {
      throw invalid('errors.oauth_redirect_nested_url', { uri });
    }
  }
}

export function createOAuthAppService(deps: ServiceDeps): OAuthAppService {
  return {
    async list(ctx: ActorContext, query: PageQuery = {}): Promise<Paginated<OAuthAppView>> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.oAuthClient.findMany({
          where: { status: { not: 'deleted' } },
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: APP_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toAppView);
      });
    },

    async get(ctx: ActorContext, appId: string): Promise<OAuthAppView> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db) => {
        const row = await db.oAuthClient.findFirst({
          where: { id: appId, status: { not: 'deleted' } },
          select: APP_SELECT,
        });
        if (row === null) {
          throw notFound('oauth_client', appId);
        }
        return toAppView(row);
      });
    },

    async create(
      ctx: ActorContext,
      input: {
        name: string;
        clientType: 'public' | 'confidential';
        redirectUris: readonly string[];
        allowedScopes: readonly Scope[];
      },
    ): Promise<CreatedOAuthAppView> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db, actor) => {
        assertRedirectUris(input.redirectUris);
        const role = actor.policyActor.role;
        if (role === null || actor.userId === null) {
          throw invalid('errors.oauth_app_requires_member', {});
        }

        // A third party can never be offered connection administration.
        const narrowed = narrowScopes({
          requested: input.allowedScopes,
          grantorRole: role,
          thirdParty: true,
        });

        const clientId = `rly_pk_${randomBytes(12).toString('base64url')}`;
        const clientSecret =
          input.clientType === 'confidential'
            ? `rly_cs_${randomBytes(32).toString('base64url')}`
            : null;

        const created = await db.oAuthClient.create({
          data: {
            workspaceId: actor.workspace.id,
            name: input.name,
            clientId,
            clientType: input.clientType,
            ...(clientSecret === null
              ? {}
              : { secretHash: createHash('sha256').update(clientSecret).digest('hex') }),
            redirectUris: [...input.redirectUris],
            allowedScopes: [...narrowed.granted],
            status: 'sandbox',
            createdByUserId: actor.userId,
          },
          select: APP_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'oauth_grant.issued',
          targetType: 'oauth_client',
          targetId: created.id,
          after: { clientId, allowedScopes: [...narrowed.granted] },
          metadata: { refusedScopes: [...narrowed.refused] },
        });

        return { app: toAppView(created), clientSecret };
      });
    },

    async update(
      ctx: ActorContext,
      appId: string,
      patch: {
        name?: string;
        redirectUris?: readonly string[];
        allowedScopes?: readonly Scope[];
        status?: 'active' | 'sandbox' | 'disabled';
      },
    ): Promise<OAuthAppView> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db, actor) => {
        const before = await db.oAuthClient.findFirst({
          where: { id: appId },
          select: APP_SELECT,
        });
        if (before === null) {
          throw notFound('oauth_client', appId);
        }
        if (patch.redirectUris !== undefined) {
          assertRedirectUris(patch.redirectUris);
        }
        const role = actor.policyActor.role;
        const scopes =
          patch.allowedScopes === undefined || role === null
            ? undefined
            : narrowScopes({
                requested: patch.allowedScopes,
                grantorRole: role,
                thirdParty: true,
              }).granted;

        const after = await db.oAuthClient.update({
          where: { id: appId },
          data: {
            ...(patch.name === undefined ? {} : { name: patch.name }),
            ...(patch.redirectUris === undefined ? {} : { redirectUris: [...patch.redirectUris] }),
            ...(scopes === undefined ? {} : { allowedScopes: [...scopes] }),
            ...(patch.status === undefined ? {} : { status: patch.status }),
          },
          select: APP_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'oauth_grant.issued',
          targetType: 'oauth_client',
          targetId: appId,
          before: toAppView(before),
          after: toAppView(after),
        });

        // Changing the redirect allowlist is a security-relevant act. Every
        // user with a live grant is told when the origin moves.
        if (patch.redirectUris !== undefined) {
          const grants = await db.oAuthGrant.findMany({
            where: { oauthClientId: appId, revokedAt: null },
            select: { subjectUserId: true },
          });
          if (grants.length > 0) {
            const users = await db.user.findMany({
              where: { id: { in: grants.map((grant) => grant.subjectUserId) } },
              select: { email: true },
            });
            await deps.mailer.send({
              to: users.map((user) => user.email),
              subjectKey: 'email.oauth_redirect_changed.subject',
              bodyKey: 'email.oauth_redirect_changed.body',
              params: { appName: after.name },
              locale: ctx.locale,
              workspaceId: ctx.workspaceId,
            });
          }
        }

        return toAppView(after);
      });
    },

    /** A 24 hour overlap is a deployment concern the developer console owns. */
    async rotateSecret(ctx: ActorContext, appId: string): Promise<CreatedOAuthAppView> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db, actor) => {
        const before = await db.oAuthClient.findFirst({
          where: { id: appId },
          select: APP_SELECT,
        });
        if (before === null) {
          throw notFound('oauth_client', appId);
        }
        if (before.clientType !== 'confidential') {
          throw invalid('errors.oauth_public_client_has_no_secret', { appId });
        }
        const clientSecret = `rly_cs_${randomBytes(32).toString('base64url')}`;
        const after = await db.oAuthClient.update({
          where: { id: appId },
          data: {
            secretHash: createHash('sha256').update(clientSecret).digest('hex'),
            secretRotatedAt: deps.clock.now(),
          },
          select: APP_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'oauth_grant.issued',
          targetType: 'oauth_client',
          targetId: appId,
          after: { secretRotated: true },
        });
        return { app: toAppView(after), clientSecret };
      });
    },

    /** Two step: a soft delete so an accidental delete is recoverable. */
    async delete(ctx: ActorContext, appId: string): Promise<void> {
      await authorized(deps, ctx, 'developer.manage', undefined, async (db, actor) => {
        await db.oAuthClient.update({ where: { id: appId }, data: { status: 'deleted' } });
        await db.oAuthGrant.updateMany({
          where: { oauthClientId: appId, revokedAt: null },
          data: { revokedAt: deps.clock.now() },
        });
        await recordAudit(db, actor, {
          action: 'oauth_grant.revoked',
          targetType: 'oauth_client',
          targetId: appId,
          after: { status: 'deleted', grantsRevoked: true },
        });
      });
    },

    async listGrants(ctx: ActorContext, query: PageQuery = {}): Promise<Paginated<OAuthGrantView>> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.oAuthGrant.findMany({
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: GRANT_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toGrantView);
      });
    },

    async revokeGrant(ctx: ActorContext, grantId: string): Promise<OAuthGrantView> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db, actor) => {
        const before = await db.oAuthGrant.findFirst({
          where: { id: grantId },
          select: GRANT_SELECT,
        });
        if (before === null) {
          throw notFound('oauth_grant', grantId);
        }
        const after = await db.oAuthGrant.update({
          where: { id: grantId },
          data: { revokedAt: deps.clock.now() },
          select: GRANT_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'oauth_grant.revoked',
          targetType: 'oauth_grant',
          targetId: grantId,
          before: { revoked: false },
          after: { revoked: true },
          metadata: { clientId: before.oauthClientId },
        });
        return toGrantView(after);
      });
    },
  };
}
