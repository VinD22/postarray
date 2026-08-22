import { Body, Controller, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';

import type {
  ActorContext,
  ServiceAccountDryRunView,
  ServiceAccountView,
} from '../../application/port';
import { Actor, Idempotent, RequireScope, RequireStepUp } from '../../common/decorators';
import { serviceAccountIdSchema } from '../../common/schemas';
import { parseBody, parseParams } from '../../common/zod';
import {
  createServiceAccountSchema,
  serviceAccountDryRunSchema,
  setServiceAccountEnabledSchema,
} from './service-accounts.schemas';
import { ServiceAccountsService, type IssuedServiceAccount } from './service-accounts.service';

/**
 * Service accounts: the identities agents act as.
 *
 * The list is a list of identities, never of credentials. Only `POST /` and
 * `POST /:id/credential` return a secret, each returns it once, and there is no
 * route that can return it again — recovering a lost credential means rotating,
 * which invalidates the lost one. Both are step-up actions, because minting an
 * identity that can publish is not something a stolen session should be able to
 * do quietly.
 *
 * Stopping an account is the kill switch: it is reversible, it takes effect on
 * the next call, and a stopped account's attempts appear in the activity table
 * as refusals rather than vanishing.
 */
@Controller('v1/service-accounts')
export class ServiceAccountsController {
  constructor(private readonly serviceAccounts: ServiceAccountsService) {}

  @Get()
  @RequireScope('connections:admin')
  list(@Actor() actor: ActorContext): Promise<{ readonly data: readonly ServiceAccountView[] }> {
    return this.serviceAccounts.list(actor).then((data) => ({ data }));
  }

  /** The response body is the only time the secret exists outside the caller. */
  @Post()
  @RequireScope('connections:admin')
  @RequireStepUp()
  @Idempotent()
  @HttpCode(201)
  create(@Actor() actor: ActorContext, @Body() body: unknown): Promise<IssuedServiceAccount> {
    return this.serviceAccounts.create(actor, parseBody(createServiceAccountSchema, body));
  }

  /** Mints a new secret and invalidates the previous one in the same request. */
  @Post(':id/credential')
  @RequireScope('connections:admin')
  @RequireStepUp()
  @HttpCode(201)
  rotate(@Actor() actor: ActorContext, @Param('id') id: string): Promise<IssuedServiceAccount> {
    return this.serviceAccounts.rotate(actor, parseParams(serviceAccountIdSchema, id));
  }

  @Patch(':id')
  @RequireScope('connections:admin')
  setEnabled(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<ServiceAccountView> {
    const input = parseBody(setServiceAccountEnabledSchema, body);
    return this.serviceAccounts.setEnabled(
      actor,
      parseParams(serviceAccountIdSchema, id),
      input.enabled,
    );
  }

  /**
   * Rehearse a call. Runs the same scope and approval-level gates the real call
   * runs and performs no work, so it needs no idempotency key and no step-up:
   * there is nothing here for a replay to duplicate.
   */
  @Post(':id/dry-run')
  @RequireScope('connections:admin')
  @HttpCode(200)
  dryRun(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<ServiceAccountDryRunView> {
    return this.serviceAccounts.dryRun(
      actor,
      parseParams(serviceAccountIdSchema, id),
      parseBody(serviceAccountDryRunSchema, body),
    );
  }
}
