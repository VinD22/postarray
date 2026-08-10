/** Session, workspaces, brands, members, billing, audit and health. */

import { call } from '../call';
import type {
  AuditEventView as ApplicationAuditEventView,
  EntitlementStateView,
  InvitationView,
  MembershipView,
  PortalLinkView,
  UsageSummaryView,
  WorkspaceView as ApplicationWorkspaceView,
} from '@relay/application';
import type { Paginated as ContractPaginated } from '@relay/contracts';
import {
  demoAudit,
  demoBilling,
  demoBrands,
  demoHealth,
  demoMembers,
  demoSession,
  demoUsage,
  page,
} from '../fixtures';
import type {
  AuditEventView,
  BillingStateView,
  BrandView,
  HealthView,
  MemberView,
  Paginated,
  Role,
  SessionView,
  UsageView,
} from '../types';
import { requireFirst } from '@/lib/utils/require-first';

export type ListQuery = {
  readonly cursor?: string;
  readonly limit?: number;
};

export const sessionApi = {
  get: (forwardCookie?: string): Promise<SessionView> =>
    call('/auth/session', forwardCookie === undefined ? {} : { forwardCookie }, () => demoSession),
  signOut: (idempotencyKey: string): Promise<void> =>
    call(
      '/auth/signout',
      { method: 'POST', body: { scope: 'current' }, idempotencyKey },
      () => undefined,
    ),
};

export const brandsApi = {
  list: (query: ListQuery = {}): Promise<Paginated<BrandView>> =>
    call('/brands', { query }, () => page(demoBrands)),
  get: (brandId: string): Promise<BrandView> =>
    call(
      `/brands/${brandId}`,
      {},
      () => demoBrands.find((brand) => brand.id === brandId) ?? requireFirst(demoBrands, 'brand'),
    ),
  create: (input: { name: string }, idempotencyKey: string): Promise<BrandView> =>
    call('/brands', { method: 'POST', body: input, idempotencyKey }, () => ({
      id: 'brand_demo_new',
      workspaceId: demoSession.workspace.id,
      name: input.name,
      slug: input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      voice: null,
      audience: null,
      approvedClaims: [],
      blockedTerms: [],
      domains: [],
      defaultTimeZone: demoSession.workspace.timeZone,
      defaultShortLinkOn: false,
    rememberTargetsEnabled: false,
      archived: false,
      connectionIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  update: (
    brandId: string,
    input: Partial<
      Pick<BrandView, 'name' | 'voice' | 'audience' | 'approvedClaims' | 'blockedTerms' | 'domains'>
    >,
  ): Promise<BrandView> =>
    call(`/brands/${brandId}`, { method: 'PATCH', body: input }, () => ({
      ...(demoBrands.find((brand) => brand.id === brandId) ?? requireFirst(demoBrands, 'brand')),
      ...input,
      updatedAt: new Date().toISOString(),
    })),
  archive: (brandId: string): Promise<void> =>
    call(`/brands/${brandId}`, { method: 'DELETE' }, () => undefined),
};

export const workspacesApi = {
  list: (): Promise<readonly ApplicationWorkspaceView[]> =>
    call<
      { readonly data: readonly ApplicationWorkspaceView[] },
      readonly ApplicationWorkspaceView[]
    >(
      '/workspaces',
      {},
      () => [],
      ({ data }) => data,
    ),
  create: (
    input: { name: string; timeZone: string; locale: string },
    idempotencyKey: string,
  ): Promise<ApplicationWorkspaceView> =>
    call<ApplicationWorkspaceView>(
      '/workspaces',
      {
        method: 'POST',
        body: {
          name: input.name,
          ianaTimeZone: input.timeZone,
          defaultLocale: input.locale,
        },
        idempotencyKey,
      },
      () => ({
        id: 'ws_demo_new',
        name: input.name,
        slug: input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: 'trialing',
        defaultLocale: input.locale,
        defaultTimeZone: input.timeZone,
        contentLocales: [input.locale],
        markets: [],
        weekStart: 1,
        hourCycle: 'h23',
        killSwitchEngaged: false,
        createdAt: new Date().toISOString(),
      }),
    ),
  get: (workspaceId: string): Promise<ApplicationWorkspaceView> =>
    call(`/workspaces/${workspaceId}`, {}, () => ({
      id: demoSession.workspace.id,
      name: demoSession.workspace.name,
      slug: demoSession.workspace.slug,
      status: 'trialing',
      defaultLocale: demoSession.workspace.locale,
      defaultTimeZone: demoSession.workspace.timeZone,
      contentLocales: [demoSession.workspace.locale],
      markets: [],
      weekStart: 1,
      hourCycle: 'h23',
      killSwitchEngaged: false,
      createdAt: new Date().toISOString(),
    })),
  update: (
    workspaceId: string,
    patch: {
      readonly defaultLocale?: string;
      readonly ianaTimeZone?: string;
      readonly contentLocales?: readonly string[];
      readonly markets?: readonly string[];
      readonly weekStart?: 0 | 1 | 6;
      readonly hourCycle?: 'h12' | 'h23';
    },
  ): Promise<ApplicationWorkspaceView> =>
    call(`/workspaces/${workspaceId}`, { method: 'PATCH', body: patch }, () => ({
      id: demoSession.workspace.id,
      name: demoSession.workspace.name,
      slug: demoSession.workspace.slug,
      status: 'trialing',
      defaultLocale: patch.defaultLocale ?? demoSession.workspace.locale,
      defaultTimeZone: patch.ianaTimeZone ?? demoSession.workspace.timeZone,
      contentLocales: patch.contentLocales ?? [demoSession.workspace.locale],
      markets: patch.markets ?? [],
      weekStart: patch.weekStart ?? 1,
      hourCycle: patch.hourCycle ?? 'h23',
      killSwitchEngaged: false,
      createdAt: new Date().toISOString(),
    })),
};

export const membersApi = {
  list: (query: ListQuery = {}): Promise<Paginated<MemberView>> =>
    call<ContractPaginated<MembershipView>, Paginated<MemberView>>(
      '/workspaces/current/members',
      { query },
      () => page(demoMembers.filter((member) => !member.invitePending)),
      (result) => ({ ...result, data: result.data.map(toMemberView) }),
    ),
  listInvitations: (query: ListQuery = {}): Promise<Paginated<MemberView>> =>
    call<ContractPaginated<InvitationView>, Paginated<MemberView>>(
      '/workspaces/current/invitations',
      { query },
      () => page(demoMembers.filter((member) => member.invitePending)),
      (result) => ({ ...result, data: result.data.map(toInvitationMemberView) }),
    ),
  invite: (input: { email: string; role: Role }, idempotencyKey: string): Promise<MemberView> =>
    call<InvitationView, MemberView>(
      '/workspaces/current/invitations',
      { method: 'POST', body: input, idempotencyKey },
      () => ({
        id: 'inv_demo_invited',
        userId: null,
        name: input.email,
        email: input.email,
        role: input.role,
        invitePending: true,
        brandScope: [],
        invitedAt: new Date().toISOString(),
      }),
      toInvitationMemberView,
    ),
  updateRole: (memberId: string, role: Role): Promise<MemberView> =>
    call<MembershipView, MemberView>(
      `/workspaces/current/members/${memberId}`,
      { method: 'PATCH', body: { role } },
      () => ({ ...requireFirst(demoMembers, 'member'), role }),
      toMemberView,
    ),
  remove: (memberId: string): Promise<void> =>
    call(`/workspaces/current/members/${memberId}`, { method: 'DELETE' }, () => undefined),
  revokeInvitation: (invitationId: string): Promise<void> =>
    call(`/workspaces/current/invitations/${invitationId}`, { method: 'DELETE' }, () => undefined),
};

export const billingApi = {
  getState: (): Promise<BillingStateView> =>
    call<EntitlementStateView, BillingStateView>(
      '/billing/entitlements',
      {},
      () => demoBilling,
      (state) => state,
    ),
  createCheckout: (
    input: { interval: 'monthly' | 'annual'; returnUrl: string },
    idempotencyKey: string,
  ): Promise<{ checkoutUrl: string }> =>
    call(
      '/billing/checkout',
      {
        method: 'POST',
        body: { interval: input.interval, successUrl: input.returnUrl },
        idempotencyKey,
      },
      () => ({ checkoutUrl: input.returnUrl }),
    ),
  getPortalLink: (
    returnUrl: string,
    idempotencyKey: string,
  ): Promise<{ portalUrl: string | null }> =>
    call<PortalLinkView, { portalUrl: string | null }>(
      '/billing/portal',
      { method: 'POST', body: { returnUrl }, idempotencyKey },
      () => ({ portalUrl: null }),
      (result) => result,
    ),
  getUsage: (): Promise<UsageView> =>
    call<UsageSummaryView, UsageView>(
      '/billing/usage',
      {},
      () => demoUsage,
      (usage) => usage,
    ),
};

export const auditApi = {
  list: (
    query: ListQuery & { actorId?: string; action?: string } = {},
  ): Promise<Paginated<AuditEventView>> =>
    call<ContractPaginated<ApplicationAuditEventView>, Paginated<AuditEventView>>(
      '/audit-events',
      { query },
      () => page(demoAudit),
      (result) => ({ ...result, data: result.data.map(toAuditEventView) }),
    ),
};

export const healthApi = {
  get: (): Promise<HealthView> => call('/health', {}, () => demoHealth),
  capabilities: (): Promise<{ readonly billing: string }> =>
    call('/capabilities', {}, () => ({ billing: 'disabled:demo-mode' })),
};

function toMemberView(member: MembershipView): MemberView {
  return {
    id: member.id,
    userId: member.userId,
    name: member.displayName,
    email: member.email,
    role: member.role,
    invitePending: member.state === 'invited',
    brandScope: member.brandScope,
    invitedAt: member.invitedAt,
  };
}

function toInvitationMemberView(invitation: InvitationView): MemberView {
  return {
    id: invitation.id,
    userId: null,
    name: invitation.email,
    email: invitation.email,
    role: invitation.role,
    invitePending: true,
    brandScope: [],
    invitedAt: invitation.createdAt,
  };
}

function toAuditEventView(event: ApplicationAuditEventView): AuditEventView {
  return {
    id: event.id,
    at: event.createdAt,
    actorName: event.actorType,
    surface: event.surface,
    action: event.action,
    subject: event.targetType,
  };
}
