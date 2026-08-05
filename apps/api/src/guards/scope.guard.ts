import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ScopeInsufficientError, missingScopes, type Scope } from '@relay/contracts';
import type { Request } from 'express';

import { PUBLIC_ROUTE_KEY, REQUIRED_SCOPES_KEY } from '../common/decorators';
import { relayState } from '../common/request.types';

/**
 * Declarative scope enforcement, driven entirely by `@RequireScope`.
 *
 * Containment is exact. `scopeSatisfies` in `@relay/contracts` has no
 * hierarchy, no wildcard and no read-implied-by-write shortcut, and this guard
 * adds none: `drafts:write` does not grant `posts:publish`, and
 * `posts:schedule` does not grant `posts:publish` either. A consent screen can
 * therefore describe exactly what it is granting, and this guard is the place
 * that promise is kept.
 *
 * A route with no `@RequireScope` still needs authentication and a workspace;
 * it simply asserts no additional capability. That is a deliberate default for
 * routes such as "which workspaces am I in", where the credential's existence
 * is the whole authorization question.
 */
@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'http') {
      return true;
    }
    const targets = [context.getHandler(), context.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, targets) === true) {
      return true;
    }
    const required = this.reflector.getAllAndOverride<readonly Scope[]>(
      REQUIRED_SCOPES_KEY,
      targets,
    );
    if (required === undefined || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const granted = relayState(request).principal?.scopes ?? [];
    const missing = missingScopes(granted, required);
    if (missing.length > 0) {
      // The missing scope names are safe to return: they are a fixed public
      // registry, and naming them is what lets a developer fix their request
      // instead of guessing.
      throw new ScopeInsufficientError({ details: { missing } });
    }
    return true;
  }
}
