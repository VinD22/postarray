import { Controller, Get, Query } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type { ActorContext, AuditEventView } from '../../application/port.js';
import { Actor, RequireScope } from '../../common/decorators.js';
import { parseQuery } from '../../common/zod.js';
import { listAuditQuerySchema } from './audit.schemas.js';
import { AuditService } from './audit.service.js';

/**
 * The audit log.
 *
 * Append only, and the same identity model regardless of surface: an action
 * taken by the web app, an OAuth app, the MCP server, the CLI or an API key
 * produces the same shape of record, with the actor, the client, the surface,
 * the approval decision and the content hash all present.
 *
 * Read is a sensitive scope. The log names people and what they did, and a
 * credential that can read it can reconstruct a workspace's whole history.
 */
@Controller('v1/audit-events')
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  @RequireScope('connections:admin')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<AuditEventView>> {
    return this.audit.list(actor, parseQuery(listAuditQuerySchema, query));
  }
}
