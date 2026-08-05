import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type { ActorContext, AuditEventView, Services } from '../../application/port.js';
import { SERVICES } from '../../application/tokens.js';
import type { ListAuditQuery } from './audit.schemas.js';

/** Transport-level delegation for the audit log. */
@Injectable()
export class AuditService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  list(ctx: ActorContext, query: ListAuditQuery): Promise<Paginated<AuditEventView>> {
    const { cursor, limit, ...filters } = query;
    return this.services.audit.list(ctx, {
      filters,
      ...(cursor === undefined ? {} : { cursor }),
      limit,
    });
  }
}
