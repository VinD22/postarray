import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type { ActorContext, ApiKeyView } from '../../application/port.js';
import { Actor, Idempotent, RequireScope, RequireStepUp } from '../../common/decorators.js';
import { apiKeyIdSchema } from '../../common/schemas.js';
import { parseBody, parseParams, parseQuery } from '../../common/zod.js';
import { createApiKeySchema, listApiKeysQuerySchema } from './api-keys.schemas.js';
import { ApiKeysService, type CreatedApiKey } from './api-keys.service.js';

/**
 * Workspace API keys: a bearer credential for the workspace's own automation.
 *
 * Not for third parties. A third party gets an OAuth grant, which a user can
 * see and revoke from their own settings; an API key belongs to the workspace
 * and is invisible to the people whose accounts it can reach.
 *
 * Creation is a step-up action, and the secret is returned exactly once.
 */
@Controller('v1/api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeys: ApiKeysService) {}

  @Get()
  @RequireScope('connections:admin')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<ApiKeyView>> {
    return this.apiKeys.list(actor, parseQuery(listApiKeysQuerySchema, query));
  }

  /** The response body is the only time the secret exists outside the caller. */
  @Post()
  @RequireScope('connections:admin')
  @RequireStepUp()
  @Idempotent()
  @HttpCode(201)
  create(@Actor() actor: ActorContext, @Body() body: unknown): Promise<CreatedApiKey> {
    return this.apiKeys.create(actor, parseBody(createApiKeySchema, body));
  }

  @Delete(':id')
  @RequireScope('connections:admin')
  @RequireStepUp()
  @HttpCode(204)
  async revoke(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.apiKeys.revoke(actor, parseParams(apiKeyIdSchema, id));
  }
}
