import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '@relay/contracts';

import type {
  ActorContext,
  CursorQuery,
  IdentityContext,
  InvitationView,
  MembershipView,
  Services,
  WorkspaceView,
} from '../../application/port.js';
import { SERVICES } from '../../application/tokens.js';
import type {
  CreateWorkspaceInput,
  InviteMemberInput,
  UpdateWorkspaceInput,
} from './workspaces.schemas.js';

/**
 * Transport-level delegation for workspaces, members and invitations.
 *
 * There is no rule in this class. Membership limits, role transitions, owner
 * protection and invitation expiry all live in `@relay/application`, where the
 * MCP server and the CLI reach the same code. If a condition ever appears here,
 * it belongs there instead.
 */
@Injectable()
export class WorkspacesService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<WorkspaceView>> {
    return this.services.workspaces.list(ctx, query);
  }

  get(ctx: ActorContext, workspaceId: string): Promise<WorkspaceView> {
    return this.services.workspaces.get(ctx, workspaceId);
  }

  create(ctx: IdentityContext, input: CreateWorkspaceInput): Promise<WorkspaceView> {
    return this.services.workspaces.create(ctx, input);
  }

  update(
    ctx: ActorContext,
    workspaceId: string,
    patch: UpdateWorkspaceInput,
  ): Promise<WorkspaceView> {
    return this.services.workspaces.update(ctx, workspaceId, patch);
  }

  listForUser(userId: string): Promise<readonly WorkspaceView[]> {
    return this.services.workspaces.listForUser(userId);
  }

  listMembers(ctx: ActorContext, query: CursorQuery): Promise<Paginated<MembershipView>> {
    return this.services.members.list(ctx, query);
  }

  updateRole(ctx: ActorContext, membershipId: string, role: string): Promise<MembershipView> {
    return this.services.members.updateRole(ctx, membershipId, role);
  }

  removeMember(ctx: ActorContext, membershipId: string): Promise<void> {
    return this.services.members.remove(ctx, membershipId);
  }

  invite(ctx: ActorContext, input: InviteMemberInput): Promise<InvitationView> {
    return this.services.members.invite(ctx, input);
  }

  listInvitations(ctx: ActorContext, query: CursorQuery): Promise<Paginated<InvitationView>> {
    return this.services.members.listInvitations(ctx, query);
  }

  revokeInvitation(ctx: ActorContext, invitationId: string): Promise<void> {
    return this.services.members.revokeInvitation(ctx, invitationId);
  }

  acceptInvitation(ctx: IdentityContext, token: string): Promise<MembershipView> {
    return this.services.members.acceptInvitation(ctx, token);
  }
}
