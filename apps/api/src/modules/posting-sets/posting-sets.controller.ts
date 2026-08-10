import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { Paginated, PostingSetView } from '@relay/contracts';

import type { ActorContext } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { setIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  createPostingSetSchema,
  listPostingSetsQuerySchema,
  updatePostingSetSchema,
} from './posting-sets.schemas';
import { PostingSetsService } from './posting-sets.service';

/**
 * Posting Sets.
 *
 * Nothing on this controller publishes, schedules or edits a draft, which is
 * why none of it carries `posts:publish`. Editing a Set changes what the next
 * apply produces; a draft or a scheduled campaign that was applied from it
 * earlier is untouched, and is reached through the content endpoints as it
 * always was.
 */
@Controller('v1/posting-sets')
export class PostingSetsController {
  constructor(private readonly sets: PostingSetsService) {}

  @Get()
  @RequireScope('drafts:read')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<PostingSetView>> {
    return this.sets.list(actor, parseQuery(listPostingSetsQuerySchema, query));
  }

  @Get(':id')
  @RequireScope('drafts:read')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<PostingSetView> {
    return this.sets.get(actor, parseParams(setIdSchema, id));
  }

  @Post()
  @RequireScope('drafts:write')
  @Idempotent()
  @HttpCode(201)
  create(@Actor() actor: ActorContext, @Body() body: unknown): Promise<PostingSetView> {
    return this.sets.create(actor, parseBody(createPostingSetSchema, body));
  }

  @Patch(':id')
  @RequireScope('drafts:write')
  @Idempotent()
  update(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<PostingSetView> {
    return this.sets.update(
      actor,
      parseParams(setIdSchema, id),
      parseBody(updatePostingSetSchema, body),
    );
  }

  /**
   * Archiving retires the Set from the picker and frees its name. It is not a
   * destructive delete: campaigns applied from it keep pointing at it, so a
   * receipt can still say where their targets came from.
   */
  @Delete(':id')
  @RequireScope('drafts:write')
  @HttpCode(200)
  archive(@Actor() actor: ActorContext, @Param('id') id: string): Promise<PostingSetView> {
    return this.sets.archive(actor, parseParams(setIdSchema, id));
  }
}
