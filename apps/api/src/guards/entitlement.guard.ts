import { Inject, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EntitlementRequiredError } from '@relay/contracts';
import type { Request } from 'express';

import type { Services } from '../application/port';
import { SERVICES } from '../application/tokens';
import { PUBLIC_ROUTE_KEY, REQUIRED_ENTITLEMENT_KEY } from '../common/decorators';
import { relayState } from '../common/request.types';

/**
 * Plan entitlement enforcement.
 *
 * The guard asks the billing service and does not compute anything itself.
 * Entitlements are derived only from verified Polar webhook state plus periodic
 * reconciliation; a checkout success redirect grants nothing
 * (`docs/research/02-development-handoff.md`, section 14). Keeping the
 * derivation in `@relay/billing` is what makes that provable in one place
 * instead of on twenty routes.
 *
 * A missing entitlement is a 402, not a 403: the caller is allowed to do this,
 * the workspace simply is not paying for it, and those are different
 * conversations with different remedies.
 */
@Injectable()
export class EntitlementGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(SERVICES) private readonly services: Services,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') {
      return true;
    }
    const targets = [context.getHandler(), context.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, targets) === true) {
      return true;
    }
    const entitlement = this.reflector.getAllAndOverride<string>(REQUIRED_ENTITLEMENT_KEY, targets);
    if (entitlement === undefined) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const actorContext = relayState(request).actorContext;
    if (actorContext === undefined) {
      return true;
    }

    const permitted = await this.services.billing.hasEntitlement(actorContext, entitlement);
    if (!permitted) {
      throw new EntitlementRequiredError({ details: { entitlement } });
    }
    return true;
  }
}
