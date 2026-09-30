import { randomBytes } from 'node:crypto';

import { normalizeScopes, type Scope } from '@relay/contracts';
import { withRlsContext } from '@relay/database';

import type { ActorContext, ServiceDeps } from '../types';

import { recordAudit } from '../internal/audit';
import { invalid } from '../internal/errors';
import { authorized } from '../internal/runtime';
import { writeEdgeClient } from './oauth-edge-client';

/**
 * The two durable writes the authorization server needs from the application
 * layer: a self-registered public client, and the consent a person gave.
 *
 * The grant row is what `resolveActor` reads on every MCP and bearer call
 * (`internal/runtime.ts`), so a token minted without one is a token every tool
 * call refuses. Recording it here, inside the consenting person's workspace
 * scope, is what turns "Allow" on the consent screen into something the rest of
 * the product can check and revoke.
 */

export const MAX_DYNAMIC_REDIRECT_URIS = 5;

export interface DynamicClientInput {
  /** Self-asserted. Shown with a warning, never as a verified publisher. */
  readonly name: string;
  readonly redirectUris: readonly string[];
  readonly allowedScopes: readonly Scope[];
}

export interface DynamicClientView {
  readonly appId: string;
  readonly clientId: string;
  readonly name: string;
  readonly redirectUris: readonly string[];
  readonly allowedScopes: readonly Scope[];
  readonly createdAt: string;
}

export interface RecordGrantInput {
  /** The client row id (`app_...`), not the public client id. */
  readonly appId: string;
  readonly clientId: string;
  readonly scopes: readonly Scope[];
  readonly projectIds: readonly string[];
  readonly connectionIds: readonly string[];
}

function isLoopbackHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname === '::1'
  );
}

/**
 * A redirect URI a self-registered client may use: https, or http on a
 * loopback host for a native client. No fragment, no user info, no URL nested
 * in the path or query (an open-redirector shape).
 */
export function isAcceptableDynamicRedirectUri(uri: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(uri);
  } catch {
    return false;
  }
  if (parsed.hash !== '' || uri.includes('#') || parsed.username !== '' || parsed.password !== '') {
    return false;
  }
  const secure =
    parsed.protocol === 'https:' ||
    (parsed.protocol === 'http:' && isLoopbackHost(parsed.hostname));
  if (!secure) {
    return false;
  }
  const rest = `${parsed.pathname}${parsed.search}`;
  return !(/https?%3a%2f%2f/i.test(rest) || /https?:\/\//i.test(rest));
}

export async function registerDynamicClient(
  deps: ServiceDeps,
  input: DynamicClientInput,
): Promise<DynamicClientView> {
  if (
    input.redirectUris.length === 0 ||
    input.redirectUris.length > MAX_DYNAMIC_REDIRECT_URIS ||
    !input.redirectUris.every(isAcceptableDynamicRedirectUri)
  ) {
    throw invalid('errors.oauth_redirect_invalid', { field: 'redirect_uris' });
  }
  const name = input.name.trim();
  if (name.length === 0 || name.length > 120) {
    throw invalid('errors.oauth_client_name_invalid', { field: 'client_name' });
  }
  const allowedScopes = normalizeScopes(input.allowedScopes);
  const clientId = `rly_dc_${randomBytes(18).toString('base64url')}`;

  // No workspace owns a self-registered client, so this is the one write to
  // `oauth_clients` that runs outside a workspace scope. The row check in
  // 0083 refuses a secret or an owner on a dynamic row.
  const row = await withRlsContext(deps.prisma, { role: 'service_role' }, (tx) =>
    tx.oAuthClient.create({
      data: {
        workspaceId: null,
        createdByUserId: null,
        name,
        clientId,
        clientType: 'public',
        secretHash: null,
        redirectUris: [...input.redirectUris],
        allowedScopes: [...allowedScopes],
        status: 'active',
        registration: 'dynamic',
      },
      select: {
        id: true,
        workspaceId: true,
        name: true,
        clientId: true,
        clientType: true,
        secretHash: true,
        redirectUris: true,
        allowedScopes: true,
        homepageUrl: true,
        privacyPolicyUrl: true,
        termsUrl: true,
        logoUrl: true,
        supportEmail: true,
        status: true,
        registration: true,
        createdAt: true,
      },
    }),
  );
  await writeEdgeClient(deps, row);

  return {
    appId: row.id,
    clientId: row.clientId,
    name: row.name,
    redirectUris: [...row.redirectUris],
    allowedScopes,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function recordGrant(
  deps: ServiceDeps,
  ctx: ActorContext,
  input: RecordGrantInput,
): Promise<{ readonly grantId: string }> {
  // Any member may approve an app into their own workspace; what the app may
  // then do is re-derived from that member's live role on every call.
  return authorized(deps, ctx, 'workspace.read', undefined, async (db, actor) => {
    if (ctx.actorType !== 'user' || actor.userId === null) {
      throw invalid('errors.oauth_app_requires_member', {});
    }
    const scopes = [...normalizeScopes(input.scopes)];
    const now = deps.clock.now();
    const grant = await db.oAuthGrant.upsert({
      where: {
        oauthClientId_subjectUserId_workspaceId: {
          oauthClientId: input.appId,
          subjectUserId: actor.userId,
          workspaceId: ctx.workspaceId,
        },
      },
      create: {
        workspaceId: ctx.workspaceId,
        oauthClientId: input.appId,
        subjectUserId: actor.userId,
        scopes,
        projectScope: [...input.projectIds],
        connectionScope: [...input.connectionIds],
        consentedAt: now,
      },
      update: {
        scopes,
        projectScope: [...input.projectIds],
        connectionScope: [...input.connectionIds],
        consentedAt: now,
        revokedAt: null,
        revokedByUserId: null,
        expiresAt: null,
      },
      select: { id: true },
    });
    await recordAudit(db, actor, {
      action: 'oauth_grant.issued',
      targetType: 'oauth_grant',
      targetId: grant.id,
      after: { clientId: input.clientId, scopes },
      metadata: {
        projectScope: [...input.projectIds],
        connectionScope: [...input.connectionIds],
      },
    });
    return { grantId: grant.id };
  });
}
