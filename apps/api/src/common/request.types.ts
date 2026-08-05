import type { ApprovalLevel, CreationSurface, Scope } from '@relay/contracts';
import type { Request, Response } from 'express';

import type { ActorContext, IdentityContext } from '../application/port.js';

/** How the caller proved who they are. Drives CSRF and cookie handling. */
export type CredentialKind = 'session' | 'bearer' | 'api_key';

/**
 * The authenticated caller, resolved once by `AuthGuard`.
 *
 * A principal is not yet an `ActorContext`: it knows the identity and the
 * credential's ceiling, but not which workspace this request targets. The
 * workspace is a separate, explicit, server-validated parameter (see
 * `WorkspaceGuard`), because a workspace remembered in a cookie plus a removed
 * membership is a cross-tenant read.
 */
export interface Principal {
  readonly actorType: 'user' | 'service_account' | 'oauth_app' | 'system';
  readonly actorId: string;
  readonly credentialKind: CredentialKind;
  /** The human behind the credential, when there is one. */
  readonly userId: string | undefined;
  /** The developer OAuth client, for audit and per-client rate limiting. */
  readonly clientId: string | undefined;
  readonly grantId: string | undefined;
  /** The credential's issued scopes, before intersection with the membership. */
  readonly scopes: readonly Scope[];
  /**
   * Effective scopes per workspace. A role differs per workspace, so a session
   * that belongs to two workspaces holds two different sets. `WorkspaceGuard`
   * narrows `scopes` to the entry for the pinned workspace. Absent for
   * credentials that are bound to exactly one workspace.
   */
  readonly scopesByWorkspace: Readonly<Record<string, readonly Scope[]>> | undefined;
  /** Workspaces this credential may address. Never widened downstream. */
  readonly workspaceIds: readonly string[];
  readonly approvalLevel: ApprovalLevel;
  /** ISO instant of the most recent second-factor or password re-entry. */
  readonly mfaSatisfiedAt: string | undefined;
  readonly emailVerified: boolean;
  readonly locale: string;
  /** Stable identifier for rate limiting: the credential, not the human. */
  readonly credentialId: string;
}

/** Everything the pipeline attaches to a request, in one place. */
export interface RelayRequestState {
  correlationId: string;
  surface: CreationSurface;
  principal?: Principal;
  workspaceId?: string;
  actorContext?: ActorContext;
  identityContext?: IdentityContext;
  idempotencyKey?: string;
  /** Raw request bytes, retained only for signature verification routes. */
  rawBody?: Buffer;
  /** Set by `IdempotencyInterceptor` when it replays a stored response. */
  idempotentReplay?: boolean;
  startedAt: number;
}

export interface RelayRequest extends Request {
  relay: RelayRequestState;
}

export type RelayResponse = Response;

/** Narrow an Express request that has been through `RequestContextMiddleware`. */
export function relayState(request: Request): RelayRequestState {
  const candidate = (request as Partial<RelayRequest>).relay;
  if (candidate === undefined) {
    throw new Error('Request state is missing. RequestContextMiddleware did not run.');
  }
  return candidate;
}

/** The principal, or a hard failure. Guards ensure it is present. */
export function requirePrincipal(request: Request): Principal {
  const principal = relayState(request).principal;
  if (principal === undefined) {
    throw new Error('Principal is missing. AuthGuard did not run before this handler.');
  }
  return principal;
}

/** The tenant-free identity context. Present on every authenticated request. */
export function requireIdentityContext(request: Request): IdentityContext {
  const context = relayState(request).identityContext;
  if (context === undefined) {
    throw new Error('IdentityContext is missing. WorkspaceGuard did not run before this handler.');
  }
  return context;
}

/** The actor context, or a hard failure. `WorkspaceGuard` ensures it exists. */
export function requireActorContext(request: Request): ActorContext {
  const context = relayState(request).actorContext;
  if (context === undefined) {
    throw new Error('ActorContext is missing. WorkspaceGuard did not run before this handler.');
  }
  return context;
}
