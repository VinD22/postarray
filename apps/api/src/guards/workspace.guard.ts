import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  API_HEADERS,
  ID_PREFIXES,
  RelayError,
  ERROR_CODES,
  isId,
  type Scope,
} from '@relay/contracts';
import type { Request } from 'express';

import { PUBLIC_ROUTE_KEY, WORKSPACE_OPTIONAL_KEY } from '../common/decorators';
import { ActorContextFactory } from '../common/actor-context.factory';
import { relayState } from '../common/request.types';

/** The header a client uses to pin the workspace for this request. */
export const WORKSPACE_HEADER = API_HEADERS.workspaceId;

/**
 * Resolves and pins exactly one workspace, then builds the `ActorContext`.
 *
 * A session cookie carries an identity, not a workspace and not a permission
 * set. Workspace selection is a separate, explicit, server-validated parameter
 * on every request, because a workspace remembered in a cookie plus a
 * membership that was revoked yesterday is a cross-tenant read
 * (`04-auth-oauth-and-security.md`, section 4.2).
 *
 * Selection order, first match wins:
 *
 * 1. The `X-Relay-Workspace-Id` header.
 * 2. A `workspaceId` route parameter.
 * 3. The credential's single workspace, when it has exactly one. A bearer token
 *    and an API key are always bound to one workspace, so programmatic callers
 *    never have to send the header.
 *
 * An unknown workspace and a workspace the caller is not a member of produce
 * the **same 404**. A 403 would confirm that the workspace exists, which is
 * exactly the fact a prober is trying to establish.
 */
@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly actorContexts: ActorContextFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'http') {
      return true;
    }
    const targets = [context.getHandler(), context.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, targets) === true) {
      return true;
    }
    const workspaceOptional =
      this.reflector.getAllAndOverride<boolean>(WORKSPACE_OPTIONAL_KEY, targets) === true;

    const request = context.switchToHttp().getRequest<Request>();
    const state = relayState(request);
    const principal = state.principal;
    if (principal === undefined) {
      // AuthGuard already rejected anything unauthenticated. Reaching here on a
      // non-public route means the guard order is wrong, which is a defect.
      throw new RelayError(ERROR_CODES.INTERNAL, { details: { reason: 'guard_order' } });
    }

    state.idempotencyKey = this.readIdempotencyKey(request);
    const acceptLanguage =
      typeof request.headers['accept-language'] === 'string'
        ? request.headers['accept-language']
        : undefined;

    // Always available, even before a tenant exists: creating a workspace and
    // accepting an invitation are legitimately tenant-free operations.
    state.identityContext = this.actorContexts.buildIdentity({
      principal,
      correlationId: state.correlationId,
      surface: state.surface,
      idempotencyKey: state.idempotencyKey,
      acceptLanguage,
    });

    const requested = this.readRequestedWorkspace(request, principal.workspaceIds);
    if (requested === null || !principal.workspaceIds.includes(requested)) {
      if (workspaceOptional) {
        return true;
      }
      throw new RelayError(ERROR_CODES.NOT_FOUND, { details: { resource: 'workspace' } });
    }

    state.workspaceId = requested;

    const narrowedPrincipal = {
      ...principal,
      scopes: this.scopesFor(principal.scopesByWorkspace, principal.scopes, requested),
    };
    state.principal = narrowedPrincipal;

    state.actorContext = this.actorContexts.build({
      principal: narrowedPrincipal,
      workspaceId: requested,
      correlationId: state.correlationId,
      surface: state.surface,
      idempotencyKey: state.idempotencyKey,
      acceptLanguage,
    });

    return true;
  }

  /**
   * Narrowing, never widening. When the credential records a per-workspace
   * scope set, the pinned workspace's entry wins; a workspace with no entry
   * gets nothing at all rather than inheriting another workspace's rights.
   */
  private scopesFor(
    byWorkspace: Readonly<Record<string, readonly Scope[]>> | undefined,
    fallback: readonly Scope[],
    workspaceId: string,
  ): readonly Scope[] {
    if (byWorkspace === undefined) {
      return fallback;
    }
    return byWorkspace[workspaceId] ?? [];
  }

  private readRequestedWorkspace(
    request: Request,
    credentialWorkspaces: readonly string[],
  ): string | null {
    const header = request.headers[WORKSPACE_HEADER];
    const fromHeader = typeof header === 'string' ? header.trim() : undefined;
    if (fromHeader !== undefined && fromHeader.length > 0) {
      return isId(ID_PREFIXES.workspace, fromHeader) ? fromHeader : null;
    }

    const parameter = (request.params as Record<string, string | undefined>)['workspaceId'];
    if (parameter !== undefined && parameter.length > 0) {
      return isId(ID_PREFIXES.workspace, parameter) ? parameter : null;
    }

    if (credentialWorkspaces.length === 1) {
      return credentialWorkspaces[0] ?? null;
    }
    return null;
  }

  private readIdempotencyKey(request: Request): string | undefined {
    const header = request.headers[API_HEADERS.idempotencyKey];
    if (typeof header !== 'string') {
      return undefined;
    }
    const trimmed = header.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }
}
