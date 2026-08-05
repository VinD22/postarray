import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type { ActorContext, BrandView } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { brandIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import { createBrandSchema, listBrandsQuerySchema, updateBrandSchema } from './brands.schemas';
import { BrandsService } from './brands.service';

/** Brands: the posting identity a connection and a schedule belong to. */
@Controller('v1/brands')
export class BrandsController {
  constructor(private readonly brands: BrandsService) {}

  @Get()
  @RequireScope('accounts:read')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<BrandView>> {
    return this.brands.list(actor, parseQuery(listBrandsQuerySchema, query));
  }

  @Get(':id')
  @RequireScope('accounts:read')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<BrandView> {
    return this.brands.get(actor, parseParams(brandIdSchema, id));
  }

  @Post()
  @RequireScope('accounts:write')
  @Idempotent()
  @HttpCode(201)
  create(@Actor() actor: ActorContext, @Body() body: unknown): Promise<BrandView> {
    return this.brands.create(actor, parseBody(createBrandSchema, body));
  }

  @Patch(':id')
  @RequireScope('accounts:write')
  update(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<BrandView> {
    return this.brands.update(
      actor,
      parseParams(brandIdSchema, id),
      parseBody(updateBrandSchema, body),
    );
  }

  @Delete(':id')
  @RequireScope('accounts:write')
  @HttpCode(204)
  async delete(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.brands.delete(actor, parseParams(brandIdSchema, id));
  }
}
