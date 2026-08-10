import { Body, Controller, Delete, Get, HttpCode, Param, Put } from '@nestjs/common';
import type { RememberedTargetsView } from '@relay/contracts';

import type { ActorContext } from '../../application/port';
import { Actor, RequireScope } from '../../common/decorators';
import { brandIdSchema } from '../../common/schemas';
import { parseBody, parseParams } from '../../common/zod';
import { rememberTargetsSchema, setTargetMemorySchema } from './target-memory.schemas';
import { TargetMemoryService } from './target-memory.service';

/**
 * The composer's "remember these accounts for next time".
 *
 * Per person, per project, opt in, off by default, channel identifiers only.
 * `GET` returns what is still offerable: a channel that was revoked, paused,
 * expired or moved out of the project since the last post comes back under
 * `droppedConnectionIds` instead, so the composer can say what it did not
 * restore rather than preselecting an account nobody can publish to.
 *
 * The project toggle needs `brand.write`, which no OAuth scope delegates. That
 * is deliberate: turning on a per-member memory for everyone in a project is a
 * human decision, not something a token does on somebody's behalf.
 */
@Controller('v1/projects/:brandId/remembered-targets')
export class TargetMemoryController {
  constructor(private readonly memory: TargetMemoryService) {}

  @Get()
  @RequireScope('drafts:read')
  read(
    @Actor() actor: ActorContext,
    @Param('brandId') brandId: string,
  ): Promise<RememberedTargetsView> {
    return this.memory.read(actor, parseParams(brandIdSchema, brandId));
  }

  /**
   * Replace this person's remembered selection.
   *
   * A no-op when the project has not opted in: nothing is written, and the
   * response says `enabled: false` rather than implying a preference was saved.
   */
  @Put()
  @RequireScope('drafts:write')
  @HttpCode(200)
  remember(
    @Actor() actor: ActorContext,
    @Param('brandId') brandId: string,
    @Body() body: unknown,
  ): Promise<RememberedTargetsView> {
    const { connectionIds } = parseBody(rememberTargetsSchema, body);
    return this.memory.remember(actor, parseParams(brandIdSchema, brandId), connectionIds);
  }

  /** Forget this person's selection. Always available, opt in or not. */
  @Delete()
  @RequireScope('drafts:write')
  @HttpCode(204)
  async forget(@Actor() actor: ActorContext, @Param('brandId') brandId: string): Promise<void> {
    await this.memory.forget(actor, parseParams(brandIdSchema, brandId));
  }

  /** The project opt in. Turning it off deletes every memory in the project. */
  @Put('setting')
  @RequireScope('accounts:write')
  @HttpCode(200)
  setEnabled(
    @Actor() actor: ActorContext,
    @Param('brandId') brandId: string,
    @Body() body: unknown,
  ): Promise<{ brandId: string; enabled: boolean }> {
    const { enabled } = parseBody(setTargetMemorySchema, body);
    return this.memory.setEnabled(actor, parseParams(brandIdSchema, brandId), enabled);
  }
}
