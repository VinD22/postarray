import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type {
  ActorContext,
  CreatedOAuthAppView,
  OAuthAppView,
  OAuthGrantView,
} from '../../application/port.js';
import { Actor, Idempotent, RequireScope, RequireStepUp } from '../../common/decorators.js';
import { cursorQuerySchema } from '../../common/pagination.js';
import { oauthClientIdSchema, oauthGrantIdSchema } from '../../common/schemas.js';
import { parseBody, parseParams, parseQuery } from '../../common/zod.js';
import { createOAuthAppSchema, updateOAuthAppSchema } from './developer-apps.schemas.js';
import { DeveloperAppsService } from './developer-apps.service.js';

/**
 * The developer console: register an app, rotate its secret, inspect the grants
 * users have given it, and revoke them.
 *
 * A confidential client's secret is shown exactly once at creation and once at
 * each rotation. Rotation keeps both secrets valid for 24 hours so a developer
 * can deploy without an outage, which is the difference between a rotation
 * feature people use and one they avoid.
 *
 * Deleting an app is a two-step, seven day soft delete: an accidental delete is
 * recoverable, and a malicious one is visible while it is still reversible.
 */
@Controller('v1/developer/apps')
export class DeveloperAppsController {
  constructor(private readonly apps: DeveloperAppsService) {}

  @Get()
  @RequireScope('connections:admin')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<OAuthAppView>> {
    return this.apps.list(actor, parseQuery(cursorQuerySchema, query));
  }

  @Get(':id')
  @RequireScope('connections:admin')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<OAuthAppView> {
    return this.apps.get(actor, parseParams(oauthClientIdSchema, id));
  }

  @Post()
  @RequireScope('connections:admin')
  @RequireStepUp()
  @Idempotent()
  @HttpCode(201)
  create(@Actor() actor: ActorContext, @Body() body: unknown): Promise<CreatedOAuthAppView> {
    return this.apps.create(actor, parseBody(createOAuthAppSchema, body));
  }

  /**
   * Changing the redirect allowlist is a step-up action and is audited. If the
   * origin changes, every user with an active grant is notified, because the
   * place their data can be sent has changed since they consented.
   */
  @Patch(':id')
  @RequireScope('connections:admin')
  @RequireStepUp()
  update(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<OAuthAppView> {
    return this.apps.update(
      actor,
      parseParams(oauthClientIdSchema, id),
      parseBody(updateOAuthAppSchema, body),
    );
  }

  @Post(':id/secret')
  @RequireScope('connections:admin')
  @RequireStepUp()
  @Idempotent()
  @HttpCode(201)
  rotateSecret(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
  ): Promise<CreatedOAuthAppView> {
    return this.apps.rotateSecret(actor, parseParams(oauthClientIdSchema, id));
  }

  @Delete(':id')
  @RequireScope('connections:admin')
  @RequireStepUp()
  @HttpCode(204)
  async delete(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.apps.delete(actor, parseParams(oauthClientIdSchema, id));
  }
}

/**
 * Grants a user has given to third-party apps, and the revoke button.
 *
 * Revocation is immediate: the tokens are deleted and the next call fails.
 * Work already authorized and in flight is allowed to finish, and the receipt
 * records that the grant was revoked afterwards. We do not cancel scheduled
 * posts a user approved, because silently dropping approved content is its own
 * kind of broken promise. We do refuse every new action.
 */
@Controller('v1/developer/grants')
export class DeveloperGrantsController {
  constructor(private readonly apps: DeveloperAppsService) {}

  @Get()
  @RequireScope('connections:admin')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<OAuthGrantView>> {
    return this.apps.listGrants(actor, parseQuery(cursorQuerySchema, query));
  }

  @Delete(':id')
  @RequireScope('connections:admin')
  @HttpCode(204)
  async revoke(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.apps.revokeGrant(actor, parseParams(oauthGrantIdSchema, id));
  }
}
