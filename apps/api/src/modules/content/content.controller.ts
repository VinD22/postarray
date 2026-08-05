import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import type { ContentVersion, Paginated, ValidationResult } from '@relay/contracts';

import type {
  ActorContext,
  CanonicalPreview,
  ContentItemView,
  PostVariantView,
} from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { contentItemIdSchema, postVariantIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  applySetSchema,
  applySignatureSchema,
  createDraftSchema,
  listContentQuerySchema,
  overrideVariantSchema,
  previewQuerySchema,
  setTargetsSchema,
  updateMasterSchema,
} from './content.schemas';
import { ContentService } from './content.service';

/**
 * Content items: the master draft, its per-target variants, and the frozen
 * version a publish is bound to.
 *
 * Two ideas run through every route here. First, a variant stores only what it
 * overrides, so `resetVariantToMaster` genuinely returns a target to inheriting
 * rather than copying the master's current text into it. Second, publishing is
 * bound to an immutable, checksummed version: `POST /versions` freezes one, and
 * a mismatch at dispatch aborts and asks for re-approval instead of quietly
 * publishing something nobody approved.
 */
@Controller('v1/content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get()
  @RequireScope('drafts:read')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<ContentItemView>> {
    return this.content.list(actor, parseQuery(listContentQuerySchema, query));
  }

  @Post()
  @RequireScope('drafts:write')
  @Idempotent()
  @HttpCode(201)
  create(@Actor() actor: ActorContext, @Body() body: unknown): Promise<ContentItemView> {
    return this.content.createDraft(actor, parseBody(createDraftSchema, body));
  }

  @Get(':id')
  @RequireScope('drafts:read')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<ContentItemView> {
    return this.content.get(actor, parseParams(contentItemIdSchema, id));
  }

  @Patch(':id')
  @RequireScope('drafts:write')
  updateMaster(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<ContentItemView> {
    return this.content.updateMaster(
      actor,
      parseParams(contentItemIdSchema, id),
      parseBody(updateMasterSchema, body),
    );
  }

  @Delete(':id')
  @RequireScope('drafts:write')
  @HttpCode(204)
  async delete(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.content.delete(actor, parseParams(contentItemIdSchema, id));
  }

  /** Replace the target set. Removing a target does not delete a published post. */
  @Put(':id/targets')
  @RequireScope('drafts:write')
  setTargets(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<ContentItemView> {
    const { targets } = parseBody(setTargetsSchema, body);
    return this.content.setTargets(actor, parseParams(contentItemIdSchema, id), targets);
  }

  /** Customize one target. Fields left out keep inheriting from the master. */
  @Patch(':id/variants/:targetId')
  @RequireScope('drafts:write')
  overrideVariant(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Param('targetId') targetId: string,
    @Body() body: unknown,
  ): Promise<PostVariantView> {
    const { patch } = parseBody(overrideVariantSchema, body);
    return this.content.overrideVariant(actor, {
      contentItemId: parseParams(contentItemIdSchema, id),
      targetId: parseParams(postVariantIdSchema, targetId),
      patch,
    });
  }

  /** Drop every override so the target follows the master again. */
  @Delete(':id/variants/:targetId/overrides')
  @RequireScope('drafts:write')
  resetVariant(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Param('targetId') targetId: string,
  ): Promise<PostVariantView> {
    return this.content.resetVariantToMaster(actor, {
      contentItemId: parseParams(contentItemIdSchema, id),
      targetId: parseParams(postVariantIdSchema, targetId),
    });
  }

  /** Exactly what this target will look like on that platform. */
  @Get(':id/preview')
  @RequireScope('drafts:read')
  preview(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Query() query: unknown,
  ): Promise<CanonicalPreview> {
    const { targetId } = parseQuery(previewQuerySchema, query);
    return this.content.preview(actor, {
      contentItemId: parseParams(contentItemIdSchema, id),
      targetId,
    });
  }

  /**
   * Deterministic validation plus a cost estimate. Read-only and cheap, so an
   * agent at approval level 0 may call it freely.
   */
  @Post(':id/validate')
  @RequireScope('drafts:read')
  @HttpCode(200)
  validate(@Actor() actor: ActorContext, @Param('id') id: string): Promise<ValidationResult> {
    return this.content.validate(actor, parseParams(contentItemIdSchema, id));
  }

  /** Freeze an immutable, checksummed version. Publishing binds to this. */
  @Post(':id/versions')
  @RequireScope('drafts:write')
  @Idempotent()
  @HttpCode(201)
  freeze(@Actor() actor: ActorContext, @Param('id') id: string): Promise<ContentVersion> {
    return this.content.freezeVersion(actor, parseParams(contentItemIdSchema, id));
  }

  /** Apply a Set: a saved group of accounts and their per-target defaults. */
  @Post(':id/apply-set')
  @RequireScope('drafts:write')
  @HttpCode(200)
  applySet(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<ContentItemView> {
    const { setId } = parseBody(applySetSchema, body);
    return this.content.applySet(actor, parseParams(contentItemIdSchema, id), setId);
  }

  /** Apply a signature to the master, or to one target only. */
  @Post(':id/apply-signature')
  @RequireScope('drafts:write')
  @HttpCode(200)
  applySignature(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<ContentItemView> {
    const input = parseBody(applySignatureSchema, body);
    return this.content.applySignature(actor, {
      contentItemId: parseParams(contentItemIdSchema, id),
      signatureId: input.signatureId,
      ...(input.targetId === undefined ? {} : { targetId: input.targetId }),
    });
  }
}
