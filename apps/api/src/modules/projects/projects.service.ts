import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type { ActorContext, ProjectView, CursorQuery, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { CreateProjectInput, UpdateProjectInput } from './projects.schemas';

/** Transport-level delegation for projects. No rule lives here. */
@Injectable()
export class ProjectsService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<ProjectView>> {
    return this.services.projects.list(ctx, query);
  }

  get(ctx: ActorContext, projectId: string): Promise<ProjectView> {
    return this.services.projects.get(ctx, projectId);
  }

  create(ctx: ActorContext, input: CreateProjectInput): Promise<ProjectView> {
    return this.services.projects.create(ctx, {
      name: input.name,
      ...(input.ianaTimeZone === undefined ? {} : { defaultTimeZone: input.ianaTimeZone }),
    });
  }

  update(ctx: ActorContext, projectId: string, patch: UpdateProjectInput): Promise<ProjectView> {
    return this.services.projects.update(ctx, projectId, {
      ...(patch.name === undefined ? {} : { name: patch.name }),
      ...(patch.ianaTimeZone === undefined ? {} : { defaultTimeZone: patch.ianaTimeZone }),
      ...(patch.voice === undefined ? {} : { voice: patch.voice }),
      ...(patch.audience === undefined ? {} : { audience: patch.audience }),
      ...(patch.approvedClaims === undefined ? {} : { approvedClaims: patch.approvedClaims }),
      ...(patch.blockedTerms === undefined ? {} : { blockedTerms: patch.blockedTerms }),
      ...(patch.domains === undefined ? {} : { domains: patch.domains }),
    });
  }

  delete(ctx: ActorContext, projectId: string): Promise<void> {
    return this.services.projects.delete(ctx, projectId);
  }
}
