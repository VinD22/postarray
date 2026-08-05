import { SetMetadata, createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Scope } from '@relay/contracts';

import type { ActorContext, IdentityContext } from '../application/port.js';
import {
  relayState,
  requireActorContext,
  requireIdentityContext,
  requirePrincipal,
} from './request.types.js';
import type { Principal, RelayRequestState } from './request.types.js';

/**
 * Declarative route metadata.
 *
 * Every authorization fact a route needs is on the route, next to the handler,
 * so a reviewer can read the whole policy of an endpoint without opening a
 * guard. Guards read this metadata; they never infer intent from a path.
 */

export const PUBLIC_ROUTE_KEY = 'relay:public';
export const REQUIRED_SCOPES_KEY = 'relay:scopes';
export const REQUIRED_ENTITLEMENT_KEY = 'relay:entitlement';
export const WORKSPACE_OPTIONAL_KEY = 'relay:workspace-optional';
export const IDEMPOTENT_KEY = 'relay:idempotent';
export const RATE_LIMIT_KEY = 'relay:rate-limit';
export const STEP_UP_KEY = 'relay:step-up';
export const RAW_BODY_KEY = 'relay:raw-body';

/** No credential required. Used only for discovery, health and signed callbacks. */
export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(PUBLIC_ROUTE_KEY, true);

/**
 * The scopes this route requires. Containment is exact: there is no hierarchy,
 * no wildcard and no read-implied-by-write shortcut (`@relay/contracts`).
 */
export const RequireScope = (...scopes: readonly Scope[]): MethodDecorator & ClassDecorator =>
  SetMetadata(REQUIRED_SCOPES_KEY, scopes);

/** A plan entitlement the workspace must hold before the handler runs. */
export const RequireEntitlement = (entitlement: string): MethodDecorator & ClassDecorator =>
  SetMetadata(REQUIRED_ENTITLEMENT_KEY, entitlement);

/**
 * The route is authenticated but not workspace-scoped, for example listing the
 * workspaces a user belongs to. `WorkspaceGuard` skips pinning.
 */
export const WorkspaceOptional = (): MethodDecorator & ClassDecorator =>
  SetMetadata(WORKSPACE_OPTIONAL_KEY, true);

/**
 * The route mutates external state and therefore requires an `Idempotency-Key`
 * header. `IdempotencyInterceptor` stores and replays the response.
 */
export const Idempotent = (): MethodDecorator => SetMetadata(IDEMPOTENT_KEY, true);

/** A fresh second factor (or password re-entry) within the step-up window. */
export const RequireStepUp = (): MethodDecorator => SetMetadata(STEP_UP_KEY, true);

/** Retain the raw request bytes so a signature can be verified before parsing. */
export const RawBody = (): MethodDecorator => SetMetadata(RAW_BODY_KEY, true);

export interface RateLimitRule {
  /** Requests permitted inside the window, per credential and route. */
  readonly limit: number;
  readonly windowSeconds: number;
  /**
   * Relative cost of one call. A route that fans out to a metered provider
   * spends more of the budget than a cheap read.
   */
  readonly cost?: number;
  /** Also count against the shared per-workspace connector budget. */
  readonly connectorBudget?: boolean;
}

export const RateLimit = (rule: RateLimitRule): MethodDecorator & ClassDecorator =>
  SetMetadata(RATE_LIMIT_KEY, rule);

/* -------------------------------------------------------------------------- */
/* Parameter decorators                                                        */
/* -------------------------------------------------------------------------- */

/** The fully built `ActorContext` for this request. */
export const Actor = createParamDecorator((_data: unknown, context: ExecutionContext): ActorContext =>
  requireActorContext(context.switchToHttp().getRequest()),
);

/** The tenant-free identity context, for routes that precede a workspace. */
export const Identity = createParamDecorator(
  (_data: unknown, context: ExecutionContext): IdentityContext =>
    requireIdentityContext(context.switchToHttp().getRequest()),
);

/** The authenticated principal, before workspace pinning. */
export const CurrentPrincipal = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Principal =>
    requirePrincipal(context.switchToHttp().getRequest()),
);

/** The per-request state bag: correlation id, surface, raw body. */
export const RequestState = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RelayRequestState =>
    relayState(context.switchToHttp().getRequest()),
);
