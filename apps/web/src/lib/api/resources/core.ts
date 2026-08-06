/** Session, workspaces, brands, members, billing, audit and health. */

import { call } from '../call';
import {
  demoAudit,
  demoBilling,
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
  WorkspaceView,
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
    call('/brands', { query }, () => page(demoSession.brands)),
  get: (brandId: string): Promise<BrandView> =>
    call(
      `/brands/${brandId}`,
      {},
      () =>
        demoSession.brands.find((brand) => brand.id === brandId) ??
        requireFirst(demoSession.brands, 'brand'),
    ),
  create: (input: { name: string }, idempotencyKey: string): Promise<BrandView> =>
    call('/brands', { method: 'POST', body: input, idempotencyKey }, () => ({
      id: 'brand_demo_new',
      workspaceId: demoSession.workspace.id,
      name: input.name,
      connectionIds: [],
    })),
  update: (brandId: string, input: { name?: string }): Promise<BrandView> =>
    call(`/brands/${brandId}`, { method: 'PATCH', body: input }, () => ({
      ...(demoSession.brands.find((brand) => brand.id === brandId) ??
        requireFirst(demoSession.brands, 'brand')),
      ...input,
    })),
};

export const workspacesApi = {
  list: (): Promise<readonly WorkspaceView[]> =>
    call('/workspaces', {}, () => demoSession.workspaces),
  create: (
    input: { name: string; timeZone: string; locale: string },
    idempotencyKey: string,
  ): Promise<WorkspaceView> =>
    call('/workspaces', { method: 'POST', body: input, idempotencyKey }, () => ({
      id: 'ws_demo_new',
      name: input.name,
      slug: input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      timeZone: input.timeZone,
      locale: input.locale,
      role: 'owner' as Role,
      readOnly: false,
    })),
};

export const membersApi = {
  list: (query: ListQuery = {}): Promise<Paginated<MemberView>> =>
    call('/members', { query }, () => page(demoMembers)),
  invite: (input: { email: string; role: Role }, idempotencyKey: string): Promise<MemberView> =>
    call('/members/invitations', { method: 'POST', body: input, idempotencyKey }, () => ({
      id: 'user_demo_invited',
      name: input.email,
      email: input.email,
      role: input.role,
      invitePending: true,
    })),
  updateRole: (memberId: string, role: Role): Promise<MemberView> =>
    call(`/members/${memberId}`, { method: 'PATCH', body: { role } }, () => ({
      ...requireFirst(demoMembers, 'member'),
      role,
    })),
  remove: (memberId: string): Promise<void> =>
    call(`/members/${memberId}`, { method: 'DELETE' }, () => undefined),
};

export const billingApi = {
  getState: (): Promise<BillingStateView> => call('/billing/state', {}, () => demoBilling),
  createCheckout: (
    input: { interval: 'monthly' | 'annual'; returnUrl: string },
    idempotencyKey: string,
  ): Promise<{ checkoutUrl: string }> =>
    call('/billing/checkout', { method: 'POST', body: input, idempotencyKey }, () => ({
      checkoutUrl: input.returnUrl,
    })),
  getPortalLink: (): Promise<{ portalUrl: string | null }> =>
    call('/billing/portal', {}, () => ({ portalUrl: null })),
  getUsage: (): Promise<UsageView> => call('/billing/usage', {}, () => demoUsage),
};

export const auditApi = {
  list: (
    query: ListQuery & { actorId?: string; action?: string } = {},
  ): Promise<Paginated<AuditEventView>> => call('/audit', { query }, () => page(demoAudit)),
};

export const healthApi = {
  get: (): Promise<HealthView> => call('/health', {}, () => demoHealth),
};
