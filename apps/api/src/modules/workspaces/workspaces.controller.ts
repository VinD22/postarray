import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type {
  ActorContext,
  IdentityContext,
  InvitationView,
  MembershipView,
  WorkspaceView,
} from '../../application/port.js';
import {
  Actor,
  CurrentPrincipal,
  Identity,
  Idempotent,
  RequireScope,
  RequireStepUp,
  WorkspaceOptional,
} from '../../common/decorators.js';
import { cursorQuerySchema } from '../../common/pagination.js';
import type { Principal } from '../../common/request.types.js';
import { membershipIdSchema, workspaceIdSchema } from '../../common/schemas.js';
import { parseBody, parseParams, parseQuery } from '../../common/zod.js';
import {
  acceptInvitationSchema,
  createWorkspaceSchema,
  inviteMemberSchema,
  updateRoleSchema,
  updateWorkspaceSchema,
} from './workspaces.schemas.js';
import { WorkspacesService } from './workspaces.service.js';

/**
 * Workspaces, members and invitations.
 *
 * `GET /v1/workspaces` is the one workspace-optional route in the product: it
 * answers "which tenants does this identity belong to", which is the question a
 * client must answer before it can pin a workspace on anything else. Every
 * route below it is pinned to exactly one workspace by `WorkspaceGuard`, and
 * `current` in a path means "the pinned workspace", never "guess".
 */
@Controller('v1/workspaces')
export class WorkspacesController {
  constructor(private readonly workspaces: WorkspacesService) {}

  /** The workspaces this identity is currently a member of. */
  @Get()
  @WorkspaceOptional()
  async listMine(
    @CurrentPrincipal() principal: Principal,
  ): Promise<{ data: readonly WorkspaceView[] }> {
    if (principal.userId === undefined) {
      // A machine credential is bound to one workspace at issue time and has
      // no "my workspaces" list to browse.
      return { data: [] };
    }
    return { data: await this.workspaces.listForUser(principal.userId) };
  }

  @Post()
  @WorkspaceOptional()
  @Idempotent()
  @HttpCode(201)
  create(@Identity() identity: IdentityContext, @Body() body: unknown): Promise<WorkspaceView> {
    return this.workspaces.create(identity, parseBody(createWorkspaceSchema, body));
  }

  @Get(':id')
  @RequireScope('accounts:read')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<WorkspaceView> {
    return this.workspaces.get(actor, parseParams(workspaceIdSchema, id));
  }

  @Patch(':id')
  @RequireScope('accounts:write')
  update(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<WorkspaceView> {
    return this.workspaces.update(
      actor,
      parseParams(workspaceIdSchema, id),
      parseBody(updateWorkspaceSchema, body),
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Members                                                                 */
  /* ---------------------------------------------------------------------- */

  @Get('current/members')
  @RequireScope('accounts:read')
  listMembers(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<Paginated<MembershipView>> {
    return this.workspaces.listMembers(actor, parseQuery(cursorQuerySchema, query));
  }

  /**
   * Role changes are a step-up action: a demotion narrows every existing API
   * key and OAuth grant that member created, and a promotion widens them.
   */
  @Patch('current/members/:id')
  @RequireScope('accounts:write')
  @RequireStepUp()
  updateRole(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<MembershipView> {
    const { role } = parseBody(updateRoleSchema, body);
    return this.workspaces.updateRole(actor, parseParams(membershipIdSchema, id), role);
  }

  @Delete('current/members/:id')
  @RequireScope('accounts:write')
  @RequireStepUp()
  @HttpCode(204)
  async removeMember(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.workspaces.removeMember(actor, parseParams(membershipIdSchema, id));
  }

  /* ---------------------------------------------------------------------- */
  /* Invitations                                                             */
  /* ---------------------------------------------------------------------- */

  @Get('current/invitations')
  @RequireScope('accounts:read')
  listInvitations(
    @Actor() actor: ActorContext,
    @Query() query: unknown,
  ): Promise<Paginated<InvitationView>> {
    return this.workspaces.listInvitations(actor, parseQuery(cursorQuerySchema, query));
  }

  @Post('current/invitations')
  @RequireScope('accounts:write')
  @Idempotent()
  @HttpCode(201)
  invite(@Actor() actor: ActorContext, @Body() body: unknown): Promise<InvitationView> {
    return this.workspaces.invite(actor, parseBody(inviteMemberSchema, body));
  }

  @Delete('current/invitations/:id')
  @RequireScope('accounts:write')
  @HttpCode(204)
  async revokeInvitation(@Actor() actor: ActorContext, @Param('id') id: string): Promise<void> {
    await this.workspaces.revokeInvitation(actor, id);
  }

  /**
   * Accept an invitation. The token is bound to one email address, is single
   * use and expires, so holding the link is not on its own sufficient: the
   * application layer still checks that the accepting identity owns the
   * invited address.
   */
  @Post('invitations/accept')
  @WorkspaceOptional()
  @Idempotent()
  accept(@Identity() identity: IdentityContext, @Body() body: unknown): Promise<MembershipView> {
    const { token } = parseBody(acceptInvitationSchema, body);
    return this.workspaces.acceptInvitation(identity, token);
  }
}
