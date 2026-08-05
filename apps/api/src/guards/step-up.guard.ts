import { Inject, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RelayError, ERROR_CODES } from '@relay/contracts';
import type { Request } from 'express';

import type { Clock } from '../application/port.js';
import { CLOCK } from '../application/tokens.js';
import { PUBLIC_ROUTE_KEY, STEP_UP_KEY } from '../common/decorators.js';
import { epochMillis } from '../common/instant.js';
import { relayState } from '../common/request.types.js';

/**
 * Step-up (re-authentication) enforcement.
 *
 * The routes marked `@RequireStepUp()` are the ones from section 5.3 of
 * `docs/planning/04-auth-oauth-and-security.md`: minting a credential,
 * connecting or disconnecting a social account, changing billing, changing the
 * email, password or alias, changing MFA, exporting data, and activating an
 * automation rule with real blast radius. Each needs a fresh factor within the
 * last ten minutes regardless of how old the session is.
 *
 * ## Why a bearer credential is refused rather than waved through
 *
 * A step-up is a proof that *a human is present right now*. An API key and a
 * third-party OAuth token have no human attached to the request, so there is
 * nothing that could be re-verified, and treating "no factor is possible" as
 * "no factor is required" would make the machine path the easy way around every
 * control on this list. A machine credential is therefore refused on these
 * routes: minting credentials and connecting accounts are things a person does.
 */
export const STEP_UP_WINDOW_SECONDS = 10 * 60;

@Injectable()
export class StepUpGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'http') {
      return true;
    }
    const targets = [context.getHandler(), context.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, targets) === true) {
      return true;
    }
    if (this.reflector.getAllAndOverride<boolean>(STEP_UP_KEY, targets) !== true) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const principal = relayState(request).principal;
    if (principal === undefined) {
      throw new RelayError(ERROR_CODES.AUTH_REQUIRED);
    }
    if (principal.credentialKind !== 'session') {
      throw new RelayError(ERROR_CODES.FORBIDDEN, {
        details: { reason: 'step_up_requires_interactive_session' },
      });
    }

    const satisfiedAt = principal.mfaSatisfiedAt;
    const satisfiedMillis = satisfiedAt === undefined ? null : epochMillis(satisfiedAt);
    if (
      satisfiedMillis === null ||
      this.clock.now().getTime() - satisfiedMillis > STEP_UP_WINDOW_SECONDS * 1000
    ) {
      // A distinct code, so a client can prompt for the factor rather than
      // rendering "your role does not allow this" at somebody who does have it.
      throw new RelayError(ERROR_CODES.AUTH_MFA_REQUIRED, {
        details: { windowSeconds: STEP_UP_WINDOW_SECONDS },
      });
    }
    return true;
  }
}
