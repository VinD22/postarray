import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type { ActorContext, ProjectView } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { projectIdSchema } from '../../common/schemas';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  createProjectSchema,
  listProjectsQuerySchema,
  updateProjectSchema,
} from './projects.schemas';
import { ProjectsService } from './projects.service';

/** Projects: the posting identity a connection and a schedule belong to. */
@Controller('v1/projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  @RequireScope('accounts:read')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<ProjectView>> {
    return this.projects.list(actor, parseQuery(listProjectsQuerySchema, query));
  }

  @Get(':id')
  @RequireScope('accounts:read')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<ProjectView> {
    return this.projects.get(actor, parseParams(projectIdSchema, id));
  }

  @Post()
  @RequireScope('accounts:write')
  @Idempotent()
  @HttpCode(201)
  create(@Actor() actor: ActorContext, @Body() body: unknown): Promise<ProjectView> {
    return this.projects.create(actor, parseBody(createProjectSchema, body));
  }

  @Patch(':id')
  @RequireScope('accounts:write')
  update(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<ProjectView> {
    return this.projects.update(
      actor,
      parseParams(projectIdSchema, id),
      parseBody(updateProjectSchema, body),
    );
  }

  @Delete(':id')
  @RequireScope('accounts:write')
  @HttpCode(204)
  async delete(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.projects.delete(actor, parseParams(projectIdSchema, id));
  }
}
