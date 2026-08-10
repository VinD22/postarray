import { Body, Controller, Get, HttpCode, Param, Post, Query, Res } from '@nestjs/common';
import type {
  BulkImportJobView,
  BulkImportReport,
  BulkImportRowView,
  Paginated,
} from '@relay/contracts';
import type { Response } from 'express';

import type { ActorContext } from '../../application/port';
import { Actor, Idempotent, RequireScope } from '../../common/decorators';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  importJobIdSchema,
  listImportRowsQuerySchema,
  listImportsQuerySchema,
  uploadImportSchema,
} from './import.schemas';
import { ImportService } from './import.service';

/**
 * Bulk CSV import.
 *
 * An upload parses and reports. It creates nothing, which is why it carries
 * `drafts:write` and not a publishing scope. Applying is a separate request,
 * and there are two of them on purpose: `apply` makes drafts and needs nothing
 * more than the scope that already lets a caller write a draft, while
 * `schedule` is the deliberate choice and carries `posts:schedule`. A token
 * that cannot schedule cannot reach the scheduling behaviour by passing a
 * different field.
 *
 * Nothing on this controller publishes.
 */
@Controller('v1/imports')
export class ImportController {
  constructor(private readonly imports: ImportService) {}

  @Post()
  @RequireScope('drafts:write')
  @Idempotent()
  @HttpCode(201)
  upload(@Actor() actor: ActorContext, @Body() body: unknown): Promise<BulkImportReport> {
    return this.imports.upload(actor, parseBody(uploadImportSchema, body));
  }

  @Get()
  @RequireScope('drafts:read')
  list(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<Paginated<BulkImportJobView>> {
    return this.imports.list(actor, parseQuery(listImportsQuerySchema, query));
  }

  @Get(':id')
  @RequireScope('drafts:read')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<BulkImportReport> {
    return this.imports.get(actor, parseParams(importJobIdSchema, id));
  }

  @Get(':id/rows')
  @RequireScope('drafts:read')
  rows(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Query() query: unknown,
  ): Promise<Paginated<BulkImportRowView>> {
    return this.imports.listRows(
      actor,
      parseParams(importJobIdSchema, id),
      parseQuery(listImportRowsQuerySchema, query),
    );
  }

  /** Turns the valid rows into drafts. Schedules nothing. */
  @Post(':id/apply')
  @RequireScope('drafts:write')
  @Idempotent()
  @HttpCode(200)
  apply(@Actor() actor: ActorContext, @Param('id') id: string): Promise<BulkImportReport> {
    return this.imports.applyAsDrafts(actor, parseParams(importJobIdSchema, id));
  }

  /** The deliberate second choice: drafts, and a schedule for each of them. */
  @Post(':id/schedule')
  @RequireScope('posts:schedule')
  @Idempotent()
  @HttpCode(200)
  schedule(@Actor() actor: ActorContext, @Param('id') id: string): Promise<BulkImportReport> {
    return this.imports.applyAsScheduled(actor, parseParams(importJobIdSchema, id));
  }

  /**
   * The failed rows as a CSV. It carries ICU keys rather than rendered
   * sentences, so it is readable by support in any locale and cannot leak a
   * provider response into a file a person forwards.
   */
  @Get(':id/errors.csv')
  @RequireScope('drafts:read')
  async errors(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    const report = await this.imports.errorReport(actor, parseParams(importJobIdSchema, id));
    response.setHeader('content-type', 'text/csv; charset=utf-8');
    response.setHeader('content-disposition', `attachment; filename="${report.filename}"`);
    response.setHeader('cache-control', 'private, no-store');
    response.status(200).send(report.csv);
  }
}
