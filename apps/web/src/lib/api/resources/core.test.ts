import { beforeEach, describe, expect, it, vi } from 'vitest';

const callMock = vi.hoisted(() => vi.fn());

vi.mock('../call', () => ({ call: callMock }));

import { auditApi, billingApi, healthApi, membersApi, workspacesApi } from './core';

describe('browser core resource contracts', () => {
  beforeEach(() => {
    callMock.mockReset();
    callMock.mockResolvedValue({
      data: [],
      pageInfo: { nextCursor: null, hasMore: false, limit: 25 },
    });
  });

  it('uses workspace-scoped member and invitation routes', async () => {
    await membersApi.list({ limit: 10 });
    await membersApi.listInvitations({ limit: 10 });
    await membersApi.invite({ email: 'person@example.test', role: 'editor' }, 'idem-invite');
    await membersApi.updateRole('member_01', 'approver');
    await membersApi.remove('member_01');
    await membersApi.revokeInvitation('inv_01');

    expect(callMock.mock.calls.map((entry) => entry[0])).toEqual([
      '/workspaces/current/members',
      '/workspaces/current/invitations',
      '/workspaces/current/invitations',
      '/workspaces/current/members/member_01',
      '/workspaces/current/members/member_01',
      '/workspaces/current/invitations/inv_01',
    ]);
    expect(callMock).toHaveBeenNthCalledWith(
      3,
      '/workspaces/current/invitations',
      expect.objectContaining({ method: 'POST', idempotencyKey: 'idem-invite' }),
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('adapts workspace creation to the application input contract', async () => {
    await workspacesApi.create(
      { name: 'Example', timeZone: 'Asia/Kolkata', locale: 'en' },
      'idem-workspace',
    );

    expect(callMock).toHaveBeenCalledWith(
      '/workspaces',
      {
        method: 'POST',
        body: {
          name: 'Example',
          ianaTimeZone: 'Asia/Kolkata',
          defaultLocale: 'en',
        },
        idempotencyKey: 'idem-workspace',
      },
      expect.any(Function),
    );
  });

  it('uses the canonical workspace route for localization preferences', async () => {
    await workspacesApi.get('ws_01');
    await workspacesApi.update('ws_01', {
      defaultLocale: 'fr',
      contentLocales: ['en', 'fr'],
      markets: ['France'],
      ianaTimeZone: 'Europe/Paris',
      weekStart: 1,
      hourCycle: 'h23',
    });

    expect(callMock).toHaveBeenNthCalledWith(1, '/workspaces/ws_01', {}, expect.any(Function));
    expect(callMock).toHaveBeenNthCalledWith(
      2,
      '/workspaces/ws_01',
      expect.objectContaining({
        method: 'PATCH',
        body: expect.objectContaining({
          defaultLocale: 'fr',
          contentLocales: ['en', 'fr'],
        }),
      }),
      expect.any(Function),
    );
  });

  it('uses canonical billing and audit routes', async () => {
    await billingApi.getState();
    await billingApi.getUsage();
    await billingApi.createCheckout(
      { interval: 'annual', returnUrl: 'https://app.example.test/settings/billing' },
      'idem-checkout',
    );
    await billingApi.getPortalLink('https://app.example.test/settings/billing', 'idem-portal');
    await auditApi.list({ actorId: 'service_account_01' });

    expect(callMock.mock.calls.map((entry) => entry[0])).toEqual([
      '/billing/entitlements',
      '/billing/usage',
      '/billing/checkout',
      '/billing/portal',
      '/audit-events',
    ]);
    expect(callMock).toHaveBeenNthCalledWith(
      3,
      '/billing/checkout',
      expect.objectContaining({
        method: 'POST',
        body: {
          interval: 'annual',
          successUrl: 'https://app.example.test/settings/billing',
        },
        idempotencyKey: 'idem-checkout',
      }),
      expect.any(Function),
    );
    expect(callMock).toHaveBeenNthCalledWith(
      4,
      '/billing/portal',
      expect.objectContaining({
        method: 'POST',
        body: { returnUrl: 'https://app.example.test/settings/billing' },
        idempotencyKey: 'idem-portal',
      }),
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('reads the public deployment capability gate before showing checkout', async () => {
    await healthApi.capabilities();

    expect(callMock).toHaveBeenCalledWith('/capabilities', {}, expect.any(Function));
  });
});
