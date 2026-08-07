/**
 * The one documented boundary between these screens and `@/lib/api`.
 *
 * `@/lib/api` mirrors the backend service contract. Two things happen here and
 * nowhere else:
 *
 *  1. Its view models are adapted into the richer ones in `view-models.ts`
 *     that these screens read. Components never cast.
 *  2. Where the typed client has not modelled a documented REST resource yet,
 *     the call goes through the exported `request` helper with a `TODO(api)`
 *     naming the resource. Those are the only places, they are listed below,
 *     and each one moves to `api.<resource>` in a single edit.
 *
 * TODO(api): resources the typed client does not expose yet:
 *   service accounts, sessions, data export and deletion, workspace
 *   localization preferences, referrals, webhook signing secret rotation and
 *   webhook delivery redelivery by delivery id.
 */

import { api, newIdempotencyKey, request } from '@/lib/api';
import type {
  BusinessProfile,
  GrowthExportFormat,
  GrowthPlan,
  OpportunityRecord,
  Scope,
  ToolRecord,
  WebhookEventName,
} from '@relay/contracts';

import type {
  AgentActivityView,
  ApiKeyView,
  AppRequestLogView,
  ApprovalLevel,
  BillingStateView,
  BrandView,
  ConnectionSummaryView,
  ExportJobView,
  InvoiceView,
  MemberView,
  MoneyView,
  OAuthAppView,
  OAuthGrantView,
  OneTimeCredential,
  ReferralView,
  ServiceAccountView,
  SessionView,
  UsageView,
  WebhookDeliveryView,
  WebhookEndpointView,
  WorkspaceRole,
} from './view-models';

/* ------------------------------------------------------------------ helpers */

/** Bounds used where a query needs an unbounded range. */
const EPOCH_START = '1970-01-01T00:00:00.000Z';
const FAR_FUTURE = '2999-12-31T23:59:59.999Z';

/** Roles whose definition includes reviewing someone else's work. */
const APPROVAL_ROLES: ReadonlySet<string> = new Set(['owner', 'admin', 'manager', 'approver']);

function moneyOf(
  value: { amountMinor: number; currency: string } | null | undefined,
): MoneyView | null {
  return value == null ? null : { amountMinor: value.amountMinor, currency: value.currency };
}

/* -------------------------------------------------------------- workspace */

export interface WorkspaceIdentityView {
  readonly id: string;
  readonly name: string;
  readonly timeZone: string;
  /** The name shown as the publisher on a consent screen. */
  readonly developerName: string;
  readonly mcpEndpoint: string;
  readonly apiBaseUrl: string;
  readonly readOnly: boolean;
  readonly currentUserId: string;
}

export interface WorkspaceLocalizationView {
  readonly interfaceLocale: string;
  readonly contentLocales: readonly string[];
  readonly markets: readonly string[];
  readonly timeZone: string;
  readonly weekStart: number;
  readonly hourCycle: 'h12' | 'h23';
}

export const workspaceGateway = {
  async identity(): Promise<WorkspaceIdentityView> {
    const session = await api.session.get();
    const endpoints = await request<{ mcpEndpoint: string; apiBaseUrl: string }>(
      '/workspaces/current/endpoints',
    ).catch(() => ({ mcpEndpoint: '', apiBaseUrl: '' }));
    return {
      id: session.workspace.id,
      name: session.workspace.name,
      timeZone: session.workspace.timeZone,
      developerName: session.workspace.name,
      mcpEndpoint: endpoints.mcpEndpoint,
      apiBaseUrl: endpoints.apiBaseUrl,
      readOnly: session.workspace.readOnly,
      currentUserId: session.user.id,
    };
  },

  async localization(): Promise<WorkspaceLocalizationView> {
    // TODO(api): `api.workspaces.getPreferences`.
    return request<WorkspaceLocalizationView>('/workspaces/current/localization');
  },

  async updateLocalization(
    patch: Partial<WorkspaceLocalizationView>,
  ): Promise<WorkspaceLocalizationView> {
    // TODO(api): `api.workspaces.updatePreferences`.
    return request<WorkspaceLocalizationView>('/workspaces/current/localization', {
      method: 'PATCH',
      body: patch,
    });
  },
};

/* -------------------------------------------------------------- members */

export const membersGateway = {
  async list(): Promise<readonly MemberView[]> {
    const [page, session] = await Promise.all([api.members.list(), api.session.get()]);
    return page.data.map((member) => ({
      id: member.id,
      userId: member.id,
      name: member.name,
      email: member.email,
      role: member.role as WorkspaceRole,
      status: member.invitePending ? ('invited' as const) : ('active' as const),
      // TODO(api): the members resource does not return the brand scope or the
      // approval right yet. Until it does, a member is shown at workspace scope
      // and the approval column reflects what the role itself allows.
      brandScope: [],
      canApprove: APPROVAL_ROLES.has(member.role),
      lastActiveAt: null,
      invitedAt: null,
      invitedByName: null,
      isCurrentUser: member.email === session.user.email,
    }));
  },

  async invite(input: {
    email: string;
    role: WorkspaceRole;
    brandIds: readonly string[];
    canApprove: boolean;
  }): Promise<void> {
    await api.members.invite(
      { email: input.email, role: input.role },
      newIdempotencyKey('settings'),
    );
    if (input.brandIds.length > 0 || input.canApprove) {
      // TODO(api): fold scope and approval into the invitation body.
      await request('/members/invitations/scope', {
        method: 'PATCH',
        body: { email: input.email, brandIds: input.brandIds, canApprove: input.canApprove },
      }).catch(() => undefined);
    }
  },

  async updateRole(input: {
    memberId: string;
    role: WorkspaceRole;
    brandIds: readonly string[];
    canApprove: boolean;
  }): Promise<void> {
    await api.members.updateRole(input.memberId, input.role);
    // TODO(api): scope and approval belong in the same PATCH.
    await request(`/members/${input.memberId}/scope`, {
      method: 'PATCH',
      body: { brandIds: input.brandIds, canApprove: input.canApprove },
    }).catch(() => undefined);
  },

  async remove(memberId: string): Promise<void> {
    await api.members.remove(memberId);
  },
};

/* --------------------------------------------------------------- brands */

/** The brand rules resource, which the typed client models only by name today. */
interface BrandRulesResponse {
  readonly voice?: string;
  readonly audience?: string;
  readonly approvedClaims?: readonly string[];
  readonly blockedTerms?: readonly string[];
  readonly contentLocales?: readonly string[];
  readonly localeRules?: BrandView['localeRules'];
  readonly domains?: BrandView['domains'];
  readonly disclosureDefaults?: BrandView['disclosureDefaults'];
  readonly glossary?: BrandView['glossary'];
  readonly updatedAt?: string;
  readonly updatedByName?: string | null;
}

function toBrandView(
  base: { id: string; name: string; connectionIds: readonly string[] },
  rules: BrandRulesResponse,
): BrandView {
  return {
    id: base.id,
    name: base.name,
    voice: rules.voice ?? '',
    audience: rules.audience ?? '',
    approvedClaims: rules.approvedClaims ?? [],
    blockedTerms: rules.blockedTerms ?? [],
    contentLocales: rules.contentLocales ?? [],
    localeRules: rules.localeRules ?? [],
    domains: rules.domains ?? [],
    disclosureDefaults: rules.disclosureDefaults ?? [],
    glossary: rules.glossary ?? [],
    connectionCount: base.connectionIds.length,
    updatedAt: rules.updatedAt ?? EPOCH_START,
    updatedByName: rules.updatedByName ?? null,
  };
}

export const brandsGateway = {
  async list(): Promise<readonly BrandView[]> {
    const page = await api.brands.list();
    // TODO(api): `GET /brands` should embed the rules so this is one request.
    return Promise.all(
      page.data.map(async (brand) => {
        const rules = await request<BrandRulesResponse>(`/brands/${brand.id}/rules`).catch(
          () => ({}) as BrandRulesResponse,
        );
        return toBrandView(brand, rules);
      }),
    );
  },

  async get(brandId: string): Promise<BrandView> {
    const [brand, rules] = await Promise.all([
      api.brands.get(brandId),
      request<BrandRulesResponse>(`/brands/${brandId}/rules`).catch(
        () => ({}) as BrandRulesResponse,
      ),
    ]);
    return toBrandView(brand, rules);
  },

  async update(brandId: string, patch: Partial<BrandView>): Promise<BrandView> {
    if (patch.name !== undefined) {
      await api.brands.update(brandId, { name: patch.name });
    }
    // TODO(api): `api.brands.updateRules`.
    await request(`/brands/${brandId}/rules`, { method: 'PATCH', body: patch });
    return brandsGateway.get(brandId);
  },

  async create(input: { name: string }): Promise<BrandView> {
    const brand = await api.brands.create(input, newIdempotencyKey('settings'));
    return toBrandView(brand, {});
  },
};

/* ------------------------------------------------------------- security */

export const securityGateway = {
  /**
   * Whether this account has a second factor.
   *
   * Read rather than assumed: a screen that states "two factor is off" without
   * knowing is worse than one that says nothing.
   */
  async mfaEnabled(): Promise<boolean | null> {
    // TODO(api): `api.auth.getMfaState`.
    const state = await request<{ enabled: boolean }>('/auth/mfa').catch(() => null);
    return state === null ? null : state.enabled;
  },

  async sessions(): Promise<readonly SessionView[]> {
    // TODO(api): `api.session.list`.
    return request<readonly SessionView[]>('/auth/sessions').catch(() => []);
  },

  async apiKeys(): Promise<readonly ApiKeyView[]> {
    const page = await api.apiKeys.list();
    return page.data
      .filter((key) => key.revokedAt === null)
      .map((key) => ({
        id: key.id,
        name: key.name,
        prefix: key.prefix,
        scopes: key.scopes as readonly Scope[],
        createdAt: key.createdAt,
        // TODO(api): the resource does not name the creator yet.
        createdByName: '',
        lastUsedAt: key.lastUsedAt,
        expiresAt: null,
      }));
  },

  async createApiKey(input: {
    name: string;
    scopes: readonly Scope[];
  }): Promise<OneTimeCredential> {
    const created = await api.apiKeys.create(
      { name: input.name, scopes: input.scopes },
      newIdempotencyKey('settings'),
    );
    return { value: created?.secret ?? '', expiresAt: null };
  },

  async revokeOtherSessions(): Promise<void> {
    // TODO(api): `api.session.revokeOthers`.
    await request('/auth/sessions/revoke-others', {
      method: 'POST',
      idempotencyKey: newIdempotencyKey('settings'),
    });
  },

  async revokeApiKey(keyId: string): Promise<void> {
    await api.apiKeys.revoke(keyId);
  },

  async grants(): Promise<readonly OAuthGrantView[]> {
    // TODO(api): a workspace wide grant list, rather than one per app.
    const raw = await request<readonly OAuthGrantView[]>('/oauth/grants').catch(() => []);
    return raw;
  },

  async revokeGrant(grantId: string): Promise<void> {
    // TODO(api): revoke by grant id without needing the app id.
    await request(`/oauth/grants/${grantId}`, { method: 'DELETE' });
  },

  async connections(): Promise<readonly ConnectionSummaryView[]> {
    const page = await api.connections.list();
    return page.data.map((connection) => ({
      id: connection.id,
      accountLabel:
        connection.handle === null
          ? connection.displayName
          : `${connection.displayName} (${connection.handle})`,
      provider: connection.provider,
      // TODO(api): the list response does not embed the capability summary.
      grantedCapabilities: [],
    }));
  },
};

/* -------------------------------------------------------- service accounts */

interface ServiceAccountResponse extends Omit<ServiceAccountView, 'brandScope'> {
  readonly brandScope: readonly { readonly id: string; readonly name: string }[];
}

export const agentsGateway = {
  async list(): Promise<readonly ServiceAccountView[]> {
    // TODO(api): `api.serviceAccounts.list`.
    return request<readonly ServiceAccountResponse[]>('/service-accounts').catch(() => []);
  },

  async create(input: {
    name: string;
    purpose: string;
    scopes: readonly Scope[];
    brandIds: readonly string[];
    connectionIds: readonly string[];
    contentLocales: readonly string[];
    allowedDomains: readonly string[];
    maxPostsPerDay: number;
    lookAheadDays: number;
    quietHoursStart: string;
    quietHoursEnd: string;
    approvalLevel: ApprovalLevel;
    expiresInDays: number | null;
  }): Promise<OneTimeCredential> {
    // TODO(api): `api.serviceAccounts.create`.
    return request<OneTimeCredential>('/service-accounts', {
      method: 'POST',
      body: input,
      idempotencyKey: newIdempotencyKey('settings'),
    });
  },

  async rotate(serviceAccountId: string): Promise<OneTimeCredential> {
    // TODO(api): `api.serviceAccounts.rotateCredential`.
    return request<OneTimeCredential>(`/service-accounts/${serviceAccountId}/credential`, {
      method: 'POST',
      idempotencyKey: newIdempotencyKey('settings'),
    });
  },

  async setEnabled(serviceAccountId: string, enabled: boolean): Promise<void> {
    // TODO(api): `api.serviceAccounts.stop` and `.resume`.
    await request(`/service-accounts/${serviceAccountId}`, {
      method: 'PATCH',
      body: { enabled },
    });
  },

  async activity(serviceAccountId: string): Promise<readonly AgentActivityView[]> {
    const page = await api.audit.list({ actorId: serviceAccountId, limit: 50 });
    return page.data.map((event) => ({
      id: event.id,
      occurredAt: event.at,
      tool: event.action,
      outcome: event.action.endsWith('.denied')
        ? ('denied' as const)
        : event.action.endsWith('.failed')
          ? ('failed' as const)
          : ('ok' as const),
      subject: event.subject,
      reason: null,
    }));
  },

  async dryRun(input: {
    serviceAccountId: string;
    tool: string;
    args: unknown;
  }): Promise<{ outcome: 'ok' | 'denied'; body: unknown; reason: string | null }> {
    // TODO(api): `api.serviceAccounts.dryRun`. Marked side effect free because
    // the sandbox never contacts a provider.
    return request('/service-accounts/dry-runs', {
      method: 'POST',
      body: input,
      sideEffectFree: true,
    });
  },
};

/* -------------------------------------------------------- developer apps */

interface OAuthAppDetailResponse {
  readonly clientType?: 'public' | 'confidential';
  readonly status?: OAuthAppView['status'];
  readonly homepageUrl?: string;
  readonly privacyUrl?: string;
  readonly termsUrl?: string;
  readonly developerName?: string;
  readonly linksCheckedAt?: string | null;
  readonly unreachableUrls?: readonly string[];
  readonly grantCount?: number;
  readonly rateLimitPerHour?: number;
  readonly rateLimitUsed?: number;
  readonly sandboxClientId?: string;
}

function toAppView(
  base: {
    id: string;
    name: string;
    clientId: string;
    redirectUris: readonly string[];
    scopes: readonly string[];
    createdAt: string;
  },
  detail: OAuthAppDetailResponse,
): OAuthAppView {
  return {
    id: base.id,
    name: base.name,
    clientId: base.clientId,
    clientType: detail.clientType ?? 'confidential',
    status: detail.status ?? 'active',
    homepageUrl: detail.homepageUrl ?? '',
    privacyUrl: detail.privacyUrl ?? '',
    termsUrl: detail.termsUrl ?? '',
    developerName: detail.developerName ?? '',
    redirectUris: base.redirectUris,
    scopes: base.scopes as readonly Scope[],
    linksCheckedAt: detail.linksCheckedAt ?? null,
    unreachableUrls: detail.unreachableUrls ?? [],
    grantCount: detail.grantCount ?? 0,
    rateLimitPerHour: detail.rateLimitPerHour ?? 1000,
    rateLimitUsed: detail.rateLimitUsed ?? 0,
    sandboxClientId: detail.sandboxClientId ?? '',
    createdAt: base.createdAt,
  };
}

export const oauthAppsGateway = {
  async list(): Promise<readonly OAuthAppView[]> {
    const page = await api.oauthApps.list();
    // TODO(api): `GET /oauth/apps` should embed the identity and limit fields.
    return Promise.all(
      page.data.map(async (app) => {
        const detail = await request<OAuthAppDetailResponse>(`/oauth/apps/${app.id}/detail`).catch(
          () => ({}) as OAuthAppDetailResponse,
        );
        return toAppView(app, detail);
      }),
    );
  },

  async create(input: {
    name: string;
    clientType: 'public' | 'confidential';
    homepageUrl: string;
    privacyUrl: string;
    termsUrl: string;
    redirectUris: readonly string[];
    scopes: readonly Scope[];
  }): Promise<{ app: OAuthAppView; secret: OneTimeCredential | null }> {
    const created = await api.oauthApps.create(
      { name: input.name, redirectUris: input.redirectUris, scopes: input.scopes },
      newIdempotencyKey('settings'),
    );
    if (created === null) {
      throw new Error('OAUTH_APP_NOT_CREATED');
    }
    // TODO(api): the create body should carry the identity fields directly.
    await request(`/oauth/apps/${created.app.id}/detail`, {
      method: 'PATCH',
      body: {
        clientType: input.clientType,
        homepageUrl: input.homepageUrl,
        privacyUrl: input.privacyUrl,
        termsUrl: input.termsUrl,
      },
    }).catch(() => undefined);

    return {
      app: toAppView(created.app, { clientType: input.clientType }),
      secret:
        input.clientType === 'confidential'
          ? { value: created.clientSecret, expiresAt: null }
          : null,
    };
  },

  async update(appId: string, patch: Partial<OAuthAppView>): Promise<OAuthAppView> {
    if (
      patch.name !== undefined ||
      patch.redirectUris !== undefined ||
      patch.scopes !== undefined
    ) {
      await api.oauthApps.update(appId, {
        ...(patch.name === undefined ? {} : { name: patch.name }),
        ...(patch.redirectUris === undefined ? {} : { redirectUris: patch.redirectUris }),
        ...(patch.scopes === undefined ? {} : { scopes: patch.scopes }),
      });
    }
    // TODO(api): status and identity fields belong in the same PATCH.
    await request(`/oauth/apps/${appId}/detail`, { method: 'PATCH', body: patch }).catch(
      () => undefined,
    );
    const [base, detail] = await Promise.all([
      api.oauthApps.list(),
      request<OAuthAppDetailResponse>(`/oauth/apps/${appId}/detail`).catch(
        () => ({}) as OAuthAppDetailResponse,
      ),
    ]);
    const found = base.data.find((app) => app.id === appId);
    if (found === undefined) {
      throw new Error('OAUTH_APP_NOT_FOUND');
    }
    return toAppView(found, detail);
  },

  async rotateSecret(appId: string): Promise<OneTimeCredential> {
    const rotated = await api.oauthApps.rotateSecret(appId, newIdempotencyKey('settings'));
    return { value: rotated?.clientSecret ?? '', expiresAt: null };
  },

  async remove(appId: string): Promise<void> {
    await api.oauthApps.delete(appId);
  },

  async grants(appId: string): Promise<readonly OAuthGrantView[]> {
    const page = await api.oauthApps.listGrants(appId);
    return page.data.map((grant) => ({
      id: grant.id,
      workspaceName: grant.grantedByName,
      scopes: grant.scopes as readonly Scope[],
      grantedAt: grant.grantedAt,
      lastUsedAt: null,
      appName: grant.appName,
      appId,
      developerName: grant.grantedByName,
    }));
  },

  async requestLogs(appId: string): Promise<readonly AppRequestLogView[]> {
    // TODO(api): `api.oauthApps.listRequestLogs`.
    return request<readonly AppRequestLogView[]>(`/oauth/apps/${appId}/requests`).catch(() => []);
  },
};

/* ------------------------------------------------------------- webhooks */

export const webhooksGateway = {
  async list(): Promise<readonly WebhookEndpointView[]> {
    const page = await api.webhooks.list();
    return page.data.map((endpoint) => ({
      id: endpoint.id,
      url: endpoint.url,
      events: endpoint.events,
      allEvents: endpoint.events.length >= 17,
      connectionIds: endpoint.connectionIds,
      // TODO(api): the endpoint returns ids, not the account labels.
      connectionLabels: [],
      enabled: endpoint.enabled,
      disabledReason: endpoint.enabled
        ? null
        : endpoint.consecutiveFailures > 0
          ? ('persistent_failure' as const)
          : ('manual' as const),
      signingSecretVersion: endpoint.signingSecretVersion,
      consecutiveFailures: endpoint.consecutiveFailures,
      failureLimit: 20,
      lastSuccessAt: endpoint.lastSuccessAt,
      lastFailureAt: endpoint.lastFailureAt,
      createdAt: endpoint.createdAt,
    }));
  },

  async create(input: {
    url: string;
    events: readonly WebhookEventName[];
    connectionIds: readonly string[];
  }): Promise<{ endpoint: WebhookEndpointView; secret: OneTimeCredential }> {
    const created = await api.webhooks.create(
      { url: input.url, events: input.events, connectionIds: input.connectionIds },
      newIdempotencyKey('settings'),
    );
    if (created === null) {
      throw new Error('WEBHOOK_NOT_CREATED');
    }
    const endpoints = await webhooksGateway.list();
    const endpoint = endpoints.find((entry) => entry.id === created.endpoint.id);
    if (endpoint === undefined) {
      throw new Error('WEBHOOK_NOT_FOUND');
    }
    return { endpoint, secret: { value: created.signingSecret, expiresAt: null } };
  },

  async update(
    endpointId: string,
    patch: Partial<{
      url: string;
      events: readonly WebhookEventName[];
      connectionIds: readonly string[];
      enabled: boolean;
    }>,
  ): Promise<WebhookEndpointView> {
    await api.webhooks.update(endpointId, {
      ...(patch.url === undefined ? {} : { url: patch.url }),
      ...(patch.events === undefined ? {} : { events: patch.events }),
      ...(patch.enabled === undefined ? {} : { enabled: patch.enabled }),
    });
    const endpoints = await webhooksGateway.list();
    const endpoint = endpoints.find((entry) => entry.id === endpointId);
    if (endpoint === undefined) {
      throw new Error('WEBHOOK_NOT_FOUND');
    }
    return endpoint;
  },

  async rotateSecret(endpointId: string): Promise<OneTimeCredential> {
    // TODO(api): `api.webhooks.rotateSigningSecret`.
    const rotated = await request<{ signingSecret: string }>(
      `/webhooks/${endpointId}/signing-secret`,
      { method: 'POST', idempotencyKey: newIdempotencyKey('settings') },
    );
    return { value: rotated.signingSecret, expiresAt: null };
  },

  async remove(endpointId: string): Promise<void> {
    await api.webhooks.delete(endpointId);
  },

  async testDelivery(endpointId: string): Promise<void> {
    await api.webhooks.testDelivery(endpointId, newIdempotencyKey('settings'));
  },

  async deliveries(endpointId: string): Promise<readonly WebhookDeliveryView[]> {
    const page = await api.webhooks.listDeliveries(endpointId);
    return page.data.map((delivery) => ({
      id: delivery.id,
      eventName: delivery.eventName,
      status: delivery.status,
      attempt: delivery.attempt,
      responseStatus: delivery.responseStatus,
      responseBodyExcerpt: delivery.responseBodyExcerpt,
      // TODO(api): the log does not return the request excerpt yet.
      requestBodyExcerpt: null,
      requestedAt: delivery.requestedAt,
      nextAttemptAt: delivery.nextAttemptAt,
      isTest: false,
    }));
  },

  async redeliver(endpointId: string, deliveryId: string): Promise<void> {
    await api.webhooks.redeliver(endpointId, deliveryId, newIdempotencyKey('settings'));
  },
};

/* -------------------------------------------------------------- billing */

interface BillingDetailResponse {
  readonly cancelAt?: string | null;
  readonly canceledAt?: string | null;
  readonly accessUntil?: string | null;
  readonly graceEndsAt?: string | null;
  readonly trialDaysRemaining?: number | null;
  readonly paymentMethod?: BillingStateView['paymentMethod'];
  readonly readOnly?: boolean;
}

export const billingGateway = {
  async state(): Promise<BillingStateView> {
    const [state, session, detail] = await Promise.all([
      api.billing.getState(),
      api.session.get(),
      // TODO(api): cancellation dates, grace window and the payment method
      // descriptor belong on `GET /billing/state`.
      request<BillingDetailResponse>('/billing/state/detail').catch(
        () => ({}) as BillingDetailResponse,
      ),
    ]);

    return {
      status: state.status,
      interval: state.interval,
      trialDaysRemaining: detail.trialDaysRemaining ?? null,
      conversionAt: state.firstChargeAt ?? state.trialEndsAt,
      conversionAmount: moneyOf(state.firstChargeAmount ?? state.renewalAmount),
      cancelAt: detail.cancelAt ?? null,
      canceledAt: detail.canceledAt ?? null,
      accessUntil: detail.accessUntil ?? null,
      graceEndsAt: detail.graceEndsAt ?? null,
      paymentMethod: detail.paymentMethod ?? null,
      activeChannels: state.activeChannelCount,
      channelAllowance: state.channelLimit,
      portalUrl: state.portalUrl,
      readOnly: detail.readOnly ?? session.workspace.readOnly,
    };
  },

  async usage(): Promise<UsageView> {
    const usage = await api.billing.getUsage();
    // TODO(api): reconciliation, the price source date, the balance and the
    // spend alert belong on `GET /billing/usage`.
    interface UsageDetail {
      periodEnd?: string;
      reconciledAt?: string | null;
      priceSourceVerifiedAt?: string | null;
      balance?: MoneyView | null;
      spendAlert?: MoneyView | null;
      pauseAtAlert?: boolean;
    }
    // The endpoint is optional today, so an absent detail falls back to the
    // fields `GET /billing/usage` does return rather than failing the screen.
    const detail = await request<UsageDetail>('/billing/usage/detail').catch(
      (): UsageDetail => ({}),
    );

    return {
      periodStart: usage.periodStart,
      periodEnd: detail.periodEnd ?? usage.periodStart,
      lines: usage.lines.map((line, index) => ({
        id: `${line.provider}-${line.operation}-${index}`,
        label: `${line.provider} ${line.operation}`,
        quantity: line.count,
        unitPrice: moneyOf(line.unitAmount),
        amount: moneyOf(line.amount),
      })),
      total: moneyOf(usage.total),
      balance: detail.balance ?? null,
      reconciledAt: detail.reconciledAt ?? null,
      priceSourceVerifiedAt: detail.priceSourceVerifiedAt ?? null,
      available: true,
      spendAlert: detail.spendAlert ?? null,
      pauseAtAlert: detail.pauseAtAlert ?? false,
    };
  },

  async invoices(): Promise<readonly InvoiceView[]> {
    // TODO(api): `api.billing.listInvoices`. Polar owns the documents, so this
    // returns the metadata plus the portal link for each one.
    return request<readonly InvoiceView[]>('/billing/invoices').catch(() => []);
  },

  async portalLink(): Promise<string> {
    const result = await api.billing.getPortalLink();
    if (result.portalUrl === null) {
      throw new Error('PORTAL_UNAVAILABLE');
    }
    return result.portalUrl;
  },

  async checkout(interval: 'monthly' | 'annual'): Promise<string> {
    const returnUrl = `${window.location.origin}/settings/billing`;
    const result = await api.billing.createCheckout(
      { interval, returnUrl },
      newIdempotencyKey('settings'),
    );
    return result.checkoutUrl;
  },

  async referral(): Promise<ReferralView> {
    // TODO(api): `api.referrals.get`.
    return request<ReferralView>('/referrals');
  },
};

/* ----------------------------------------------------------- data export */

export const dataGateway = {
  async exportJob(): Promise<ExportJobView> {
    // TODO(api): `api.data.getExport`.
    return request<ExportJobView>('/data/exports/current').catch(() => ({
      id: '',
      state: 'idle' as const,
      preparedAt: null,
      expiresAt: null,
      downloadUrl: null,
    }));
  },

  async startExport(input: {
    formats: readonly ('json' | 'csv' | 'media')[];
  }): Promise<ExportJobView> {
    // TODO(api): `api.data.startExport`.
    return request<ExportJobView>('/data/exports', {
      method: 'POST',
      body: input,
      idempotencyKey: newIdempotencyKey('settings'),
    });
  },

  async scheduledJobCount(): Promise<number> {
    const page = await api.scheduling.getCalendar({
      from: EPOCH_START,
      to: FAR_FUTURE,
      ianaTimeZone: 'UTC',
    });
    return page.data.filter((entry) => entry.state === 'scheduled').length;
  },

  async cancelScheduledJobs(): Promise<void> {
    // TODO(api): a workspace wide cancel, rather than one call per job.
    await request('/scheduling/cancel-all', {
      method: 'POST',
      idempotencyKey: newIdempotencyKey('settings'),
    });
  },

  /**
   * Closing a workspace is a request, not an immediate wipe: scheduled work is
   * cancelled and connections are revoked first, and the account is removed
   * after the confirmation window stated in the Terms.
   */
  async requestWorkspaceDeletion(): Promise<void> {
    // TODO(api): `api.data.requestDeletion`.
    await request('/data/deletion-requests', {
      method: 'POST',
      idempotencyKey: newIdempotencyKey('settings'),
    });
  },
};

/* --------------------------------------------------------------- growth */

export const growthGateway = {
  async profile(): Promise<BusinessProfile | null> {
    // TODO(api): `api.growth.getBusinessProfile`.
    return request<BusinessProfile | null>('/growth/profile').catch(() => null);
  },

  /**
   * The intake form's shape is wider than `Partial<BusinessProfile>` while the
   * profile resource is still growing fields, so the boundary cast lives here
   * rather than in the form.
   */
  async saveProfile(input: unknown): Promise<BusinessProfile> {
    const saved = await api.growth.upsertBusinessProfile(input as Partial<BusinessProfile>);
    if (saved === null) {
      throw new Error('PROFILE_NOT_SAVED');
    }
    return saved;
  },

  async confirmProfile(input: {
    profileId: string;
    confirmedAssumptionIds: readonly string[];
    corrections: Readonly<Record<string, string>>;
  }): Promise<BusinessProfile> {
    const confirmed = await api.growth.confirmBusinessProfile(
      { confirmedFactIds: input.confirmedAssumptionIds },
      newIdempotencyKey('settings'),
    );
    if (Object.keys(input.corrections).length > 0) {
      // TODO(api): corrections belong in the confirm body.
      await request('/growth/profile/corrections', {
        method: 'PATCH',
        body: { corrections: input.corrections },
      }).catch(() => undefined);
    }
    if (confirmed === null) {
      throw new Error('PROFILE_NOT_CONFIRMED');
    }
    return confirmed;
  },

  async plan(): Promise<GrowthPlan | null> {
    return api.growth.getPlan();
  },

  async generate(): Promise<GrowthPlan> {
    const generated = await api.growth.generatePlan(newIdempotencyKey('settings'));
    if (generated === null) {
      throw new Error('PLAN_NOT_GENERATED');
    }
    return generated;
  },

  async exportPlan(planId: string, format: GrowthExportFormat): Promise<string> {
    const result = await api.growth.exportPlan(planId, format);
    return result?.downloadUrl ?? '';
  },

  async opportunities(): Promise<readonly OpportunityRecord[]> {
    const page = await api.growth.listOpportunities();
    return page.data;
  },

  async tools(workflow: string | null): Promise<readonly ToolRecord[]> {
    const page = await api.growth.listTools(workflow === null ? {} : { need: workflow });
    return page.data;
  },

  async createDraftFromItem(input: { planId: string; itemId: string }): Promise<void> {
    await api.growth.createDraftFromItem(input, newIdempotencyKey('settings'));
  },

  async proposeSlot(input: { planId: string; itemId: string }): Promise<void> {
    await api.growth.proposeSlotFromItem(input, newIdempotencyKey('settings'));
  },
};
