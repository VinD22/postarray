/**
 * The one documented boundary between these screens and `@/lib/api`.
 *
 * `@/lib/api` mirrors the backend service contract. Two things happen here and
 * nowhere else:
 *
 *  1. Its view models are adapted into the richer ones in `view-models.ts`
 *     that these screens read. Components never cast.
 *  2. A product surface with no application service fails locally with the
 *     stable not-implemented error. It never probes an imagined HTTP route or
 *     turns a 404 into an empty state.
 */

import { ApiError, api, newIdempotencyKey, type OAuthAppView as ApiOAuthAppView } from '@/lib/api';
import type { BusinessProfileView } from '@/lib/api/types';
import { ERROR_CODES } from '@relay/contracts';
import type {
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
  ApprovalLevel,
  BillingStateView,
  BrandView,
  ConnectionSummaryView,
  ExportJobView,
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

function notImplemented(feature: string): never {
  throw new ApiError({
    code: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
    status: 501,
    messageCode: 'not_implemented',
    retryable: false,
    details: { feature },
    correlationId: null,
    retryAfterSeconds: null,
  });
}

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
  readonly weekStart: 0 | 1 | 6;
  readonly hourCycle: 'h12' | 'h23';
}

export const workspaceGateway = {
  async identity(): Promise<WorkspaceIdentityView> {
    const session = await api.session.get();
    return {
      id: session.workspace.id,
      name: session.workspace.name,
      timeZone: session.workspace.timeZone,
      developerName: session.workspace.name,
      mcpEndpoint: '',
      apiBaseUrl: '',
      readOnly: session.workspace.readOnly,
      currentUserId: session.user.id,
    };
  },

  async localization(): Promise<WorkspaceLocalizationView> {
    const session = await api.session.get();
    const workspace = await api.workspaces.get(session.workspace.id);
    return {
      interfaceLocale: workspace.defaultLocale,
      contentLocales: workspace.contentLocales,
      markets: workspace.markets,
      timeZone: workspace.defaultTimeZone,
      weekStart: workspace.weekStart,
      hourCycle: workspace.hourCycle,
    };
  },

  async updateLocalization(
    patch: Partial<WorkspaceLocalizationView>,
  ): Promise<WorkspaceLocalizationView> {
    const session = await api.session.get();
    const workspace = await api.workspaces.update(session.workspace.id, {
      ...(patch.interfaceLocale === undefined
        ? {}
        : { defaultLocale: patch.interfaceLocale }),
      ...(patch.timeZone === undefined ? {} : { ianaTimeZone: patch.timeZone }),
      ...(patch.contentLocales === undefined ? {} : { contentLocales: patch.contentLocales }),
      ...(patch.markets === undefined ? {} : { markets: patch.markets }),
      ...(patch.weekStart === undefined ? {} : { weekStart: patch.weekStart }),
      ...(patch.hourCycle === undefined ? {} : { hourCycle: patch.hourCycle }),
    });
    return {
      interfaceLocale: workspace.defaultLocale,
      contentLocales: workspace.contentLocales,
      markets: workspace.markets,
      timeZone: workspace.defaultTimeZone,
      weekStart: workspace.weekStart,
      hourCycle: workspace.hourCycle,
    };
  },
};

/* -------------------------------------------------------------- members */

export const membersGateway = {
  async list(): Promise<readonly MemberView[]> {
    const [members, invitations, session, brands] = await Promise.all([
      api.members.list(),
      api.members.listInvitations(),
      api.session.get(),
      api.brands.list({ limit: 100 }),
    ]);
    const brandNames = new Map(brands.data.map((brand) => [brand.id, brand.name]));
    return [...members.data, ...invitations.data].map((member) => ({
      id: member.id,
      userId: member.userId,
      name: member.name,
      email: member.email,
      role: member.role as WorkspaceRole,
      status: member.invitePending ? ('invited' as const) : ('active' as const),
      brandScope: member.brandScope.flatMap((id) => {
        const name = brandNames.get(id);
        return name === undefined ? [] : [{ id, name }];
      }),
      canApprove: APPROVAL_ROLES.has(member.role),
      lastActiveAt: null,
      invitedAt: member.invitedAt,
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
  },

  async updateRole(input: {
    memberId: string;
    role: WorkspaceRole;
    brandIds: readonly string[];
    canApprove: boolean;
  }): Promise<void> {
    await api.members.updateRole(input.memberId, input.role);
  },

  async remove(member: { memberId: string; invited: boolean }): Promise<void> {
    if (member.invited) {
      await api.members.revokeInvitation(member.memberId);
      return;
    }
    await api.members.remove(member.memberId);
  },
};

/* --------------------------------------------------------------- brands */

function toBrandView(
  base: {
    id: string;
    name: string;
    voice: string | null;
    audience: string | null;
    approvedClaims: readonly string[];
    blockedTerms: readonly string[];
    domains: readonly string[];
    connectionIds: readonly string[];
    updatedAt: string;
  },
): BrandView {
  return {
    id: base.id,
    name: base.name,
    voice: base.voice ?? '',
    audience: base.audience ?? '',
    approvedClaims: base.approvedClaims,
    blockedTerms: base.blockedTerms,
    contentLocales: [],
    localeRules: [],
    domains: base.domains.map((domain) => ({ domain, verifiedAt: null })),
    disclosureDefaults: [],
    glossary: [],
    connectionCount: base.connectionIds.length,
    updatedAt: base.updatedAt,
    updatedByName: null,
  };
}

export const brandsGateway = {
  async list(): Promise<readonly BrandView[]> {
    const page = await api.brands.list();
    return page.data.map(toBrandView);
  },

  async get(brandId: string): Promise<BrandView> {
    return toBrandView(await api.brands.get(brandId));
  },

  async update(brandId: string, patch: Partial<BrandView>): Promise<BrandView> {
    const updated = await api.brands.update(brandId, {
      ...(patch.name === undefined ? {} : { name: patch.name }),
      ...(patch.voice === undefined ? {} : { voice: patch.voice }),
      ...(patch.audience === undefined ? {} : { audience: patch.audience }),
      ...(patch.approvedClaims === undefined ? {} : { approvedClaims: patch.approvedClaims }),
      ...(patch.blockedTerms === undefined ? {} : { blockedTerms: patch.blockedTerms }),
      ...(patch.domains === undefined
        ? {}
        : { domains: patch.domains.map((entry) => entry.domain) }),
    });
    return toBrandView(updated);
  },

  async create(input: { name: string }): Promise<BrandView> {
    const brand = await api.brands.create(input, newIdempotencyKey('settings'));
    return toBrandView(brand);
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
    return notImplemented('mfa_state');
  },

  async sessions(): Promise<readonly SessionView[]> {
    return notImplemented('session_management');
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
        expiresAt: key.expiresAt,
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
    if (created === null || created.secret.length === 0) {
      throw new Error('API_KEY_NOT_CREATED');
    }
    return { value: created.secret, expiresAt: created.key.expiresAt };
  },

  async revokeOtherSessions(): Promise<void> {
    return notImplemented('session_management');
  },

  async revokeApiKey(keyId: string): Promise<void> {
    await api.apiKeys.revoke(keyId);
  },

  async grants(): Promise<readonly OAuthGrantView[]> {
    const result = await api.oauthApps.listGrants();
    return result.data.map((grant) => ({
      id: grant.id,
      subjectUserId: grant.subjectUserId,
      scopes: grant.scopes as readonly Scope[],
      brandScope: grant.brandScope,
      connectionScope: grant.connectionScope,
      consentedAt: grant.consentedAt,
      lastUsedAt: grant.lastUsedAt,
      appName: grant.clientName,
      appId: grant.oauthClientId,
      revokedAt: grant.revokedAt,
    }));
  },

  async revokeGrant(grantId: string): Promise<void> {
    await api.oauthApps.revokeGrant(grantId);
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

export const agentsGateway = {
  async list(): Promise<readonly ServiceAccountView[]> {
    return notImplemented('service_accounts');
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
    void input;
    return notImplemented('service_accounts');
  },

  async rotate(serviceAccountId: string): Promise<OneTimeCredential> {
    void serviceAccountId;
    return notImplemented('service_accounts');
  },

  async setEnabled(serviceAccountId: string, enabled: boolean): Promise<void> {
    void serviceAccountId;
    void enabled;
    return notImplemented('service_accounts');
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
    void input;
    return notImplemented('service_accounts');
  },
};

/* -------------------------------------------------------- developer apps */

function toAppView(base: ApiOAuthAppView): OAuthAppView {
  return {
    id: base.id,
    workspaceId: base.workspaceId,
    name: base.name,
    clientId: base.clientId,
    clientType: base.clientType,
    status: base.status === 'sandbox' ? 'draft' : base.status === 'deleted' ? 'disabled' : base.status,
    homepageUrl: base.homepageUrl,
    privacyUrl: base.privacyPolicyUrl,
    termsUrl: base.termsUrl,
    supportEmail: base.supportEmail,
    logoUrl: base.logoUrl,
    redirectUris: base.redirectUris,
    scopes: base.allowedScopes as readonly Scope[],
    secretRotatedAt: base.secretRotatedAt,
    createdAt: base.createdAt,
  };
}

export const oauthAppsGateway = {
  async list(): Promise<readonly OAuthAppView[]> {
    const result = await api.oauthApps.list();
    return result.data.map(toAppView);
  },

  async create(input: {
    name: string;
    clientType: 'public' | 'confidential';
    homepageUrl: string;
    privacyUrl: string;
    termsUrl: string;
    supportEmail: string;
    redirectUris: readonly string[];
    scopes: readonly Scope[];
  }): Promise<{ app: OAuthAppView; secret: OneTimeCredential | null }> {
    const created = await api.oauthApps.create(
      {
        name: input.name,
        clientType: input.clientType,
        homepageUrl: input.homepageUrl,
        privacyPolicyUrl: input.privacyUrl,
        termsUrl: input.termsUrl,
        supportEmail: input.supportEmail,
        logoUrl: null,
        redirectUris: input.redirectUris,
        allowedScopes: input.scopes,
      },
      newIdempotencyKey('settings'),
    );
    if (created === null) {
      throw new Error('OAUTH_APP_NOT_CREATED');
    }
    return {
      app: toAppView(created.app),
      secret:
        input.clientType === 'confidential' && created.clientSecret !== null
          ? { value: created.clientSecret, expiresAt: null }
          : null,
    };
  },

  async update(appId: string, patch: Partial<OAuthAppView>): Promise<OAuthAppView> {
    if (
      patch.name !== undefined ||
      patch.redirectUris !== undefined ||
      patch.scopes !== undefined ||
      patch.status !== undefined ||
      patch.homepageUrl !== undefined ||
      patch.privacyUrl !== undefined ||
      patch.termsUrl !== undefined ||
      patch.supportEmail !== undefined ||
      patch.logoUrl !== undefined
    ) {
      const updated = await api.oauthApps.update(appId, {
        ...(patch.name === undefined ? {} : { name: patch.name }),
        ...(patch.redirectUris === undefined ? {} : { redirectUris: patch.redirectUris }),
        ...(patch.scopes === undefined ? {} : { allowedScopes: patch.scopes }),
        ...(patch.status === undefined
          ? {}
          : { status: patch.status === 'draft' ? ('sandbox' as const) : patch.status }),
        ...(patch.homepageUrl === undefined ? {} : { homepageUrl: patch.homepageUrl }),
        ...(patch.privacyUrl === undefined
          ? {}
          : { privacyPolicyUrl: patch.privacyUrl }),
        ...(patch.termsUrl === undefined ? {} : { termsUrl: patch.termsUrl }),
        ...(patch.supportEmail === undefined ? {} : { supportEmail: patch.supportEmail }),
        ...(patch.logoUrl === undefined ? {} : { logoUrl: patch.logoUrl }),
      });
      if (updated === null) {
        throw new Error('OAUTH_APP_NOT_UPDATED');
      }
      return toAppView(updated);
    }
    const found = await api.oauthApps.get(appId);
    if (found === null) {
      throw new Error('OAUTH_APP_NOT_FOUND');
    }
    return toAppView(found);
  },

  async rotateSecret(appId: string): Promise<OneTimeCredential> {
    const rotated = await api.oauthApps.rotateSecret(appId, newIdempotencyKey('settings'));
    if (rotated?.clientSecret === null || rotated?.clientSecret === undefined) {
      throw new Error('OAUTH_SECRET_NOT_ROTATED');
    }
    return { value: rotated.clientSecret, expiresAt: null };
  },

  async remove(appId: string): Promise<void> {
    await api.oauthApps.delete(appId);
  },

  async grants(appId: string): Promise<readonly OAuthGrantView[]> {
    const page = await api.oauthApps.listGrants();
    return page.data.filter((grant) => grant.oauthClientId === appId).map((grant) => ({
      id: grant.id,
      subjectUserId: grant.subjectUserId,
      scopes: grant.scopes as readonly Scope[],
      brandScope: grant.brandScope,
      connectionScope: grant.connectionScope,
      consentedAt: grant.consentedAt,
      lastUsedAt: grant.lastUsedAt,
      appName: grant.clientName,
      appId,
      revokedAt: grant.revokedAt,
    }));
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
    void endpointId;
    return notImplemented('webhook_secret_rotation');
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

export const billingGateway = {
  async state(): Promise<BillingStateView> {
    const [state, session, capabilities] = await Promise.all([
      api.billing.getState(),
      api.session.get(),
      api.health.capabilities(),
    ]);

    return {
      status: state.status,
      interval: state.interval,
      trialDaysRemaining: null,
      conversionAt: state.firstChargeAt ?? state.trialEndsAt,
      conversionAmount: moneyOf(state.firstChargeAmount ?? state.renewalAmount),
      cancelAt: null,
      canceledAt: null,
      accessUntil: null,
      graceEndsAt: null,
      paymentMethod: null,
      activeChannels: state.activeChannelCount,
      channelAllowance: state.channelLimit,
      portalUrl: state.portalUrl,
      readOnly: session.workspace.readOnly,
      checkoutAvailable: capabilities.billing === 'live',
    };
  },

  async usage(): Promise<UsageView> {
    const usage = await api.billing.getUsage();
    return {
      periodStart: usage.periodStart,
      periodEnd: null,
      lines: usage.lines.map((line, index) => ({
        id: `${line.provider ?? 'workspace'}-${line.operation}-${index}`,
        label: line.provider === null ? line.operation : `${line.provider} ${line.operation}`,
        quantity: line.count,
        unitPrice: moneyOf(line.unitAmount),
        amount: moneyOf(line.amount),
      })),
      total: moneyOf(usage.total),
      balance: null,
      reconciledAt: null,
      priceSourceVerifiedAt: null,
      available: true,
      spendAlert: null,
      pauseAtAlert: false,
    };
  },

  async portalLink(): Promise<string> {
    const returnUrl = `${window.location.origin}/settings/billing`;
    const result = await api.billing.getPortalLink(
      returnUrl,
      newIdempotencyKey('settings'),
    );
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
    return notImplemented('referrals');
  },
};

/* ----------------------------------------------------------- data export */

export const dataGateway = {
  async exportJob(): Promise<ExportJobView> {
    return notImplemented('workspace_exports');
  },

  async startExport(input: {
    formats: readonly ('json' | 'csv' | 'media')[];
  }): Promise<ExportJobView> {
    void input;
    return notImplemented('workspace_exports');
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
    return notImplemented('bulk_schedule_cancellation');
  },

  /**
   * Closing a workspace is a request, not an immediate wipe: scheduled work is
   * cancelled and connections are revoked first, and the account is removed
   * after the confirmation window stated in the Terms.
   */
  async requestWorkspaceDeletion(): Promise<void> {
    return notImplemented('workspace_closure');
  },
};

/* --------------------------------------------------------------- growth */

export const growthGateway = {
  async profile(): Promise<BusinessProfileView | null> {
    return api.growth.getBusinessProfile();
  },

  async saveProfile(input: Readonly<Record<string, unknown>>): Promise<BusinessProfileView> {
    return api.growth.upsertBusinessProfile(input, newIdempotencyKey('settings'));
  },

  async confirmProfile(input: {
    profileId: string;
    confirmedAssumptionIds: readonly string[];
    corrections: Readonly<Record<string, string>>;
  }): Promise<BusinessProfileView> {
    return api.growth.confirmBusinessProfile(
      input.profileId,
      {
        confirmedAssumptionIds: input.confirmedAssumptionIds,
        corrections: input.corrections,
      },
      newIdempotencyKey('settings'),
    );
  },

  async plan(): Promise<GrowthPlan | null> {
    return api.growth.getPlan();
  },

  async generate(): Promise<void> {
    const profile = await api.growth.getBusinessProfile();
    if (profile === null) return;
    await api.growth.generatePlan(profile.id, newIdempotencyKey('settings'));
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
