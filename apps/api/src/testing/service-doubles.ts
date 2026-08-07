import { NotFoundError, emptyPage } from '@relay/contracts';

import type { Services } from '../application/port';

/**
 * A complete `Services` implementation whose every method refuses.
 *
 * Tests override only the calls they exercise, so the object under test is the
 * API and not a pile of stubs. Anything not overridden throws a `NOT_FOUND`,
 * which is also the correct default for a transport test: if a route reaches a
 * service the test did not arrange, the test should fail rather than silently
 * pass on `undefined`.
 *
 * Written out by hand rather than produced by a proxy so that adding a method
 * to the shared contract breaks this file at compile time. A proxy would keep
 * compiling and quietly return `undefined` for the new call.
 */

function refuse(resource: string): () => Promise<never> {
  return () => Promise.reject(new NotFoundError({ details: { resource } }));
}

export function createRefusingServices(): Services {
  // `never` as the element type so the empty page satisfies every list return.
  const page = () => Promise.resolve(emptyPage<never>());
  return {
    workspaces: {
      list: page,
      get: refuse('workspace'),
      create: refuse('workspace'),
      update: refuse('workspace'),
      listForUser: () => Promise.resolve([]),
      engageKillSwitch: refuse('workspace'),
      releaseKillSwitch: refuse('workspace'),
    },
    members: {
      list: page,
      get: refuse('membership'),
      changeRole: refuse('membership'),
      updateRole: refuse('membership'),
      remove: refuse('membership'),
      invite: refuse('invitation'),
      listInvitations: page,
      revokeInvitation: refuse('invitation'),
      acceptInvitation: refuse('invitation'),
    },
    brands: {
      list: page,
      get: refuse('brand'),
      create: refuse('brand'),
      update: refuse('brand'),
      archive: refuse('brand'),
      delete: refuse('brand'),
    },
    connections: {
      listAvailableProviders: () => Promise.resolve([]),
      list: page,
      get: refuse('connection'),
      getCapabilities: refuse('connection'),
      beginOAuth: refuse('connection'),
      completeOAuth: refuse('connection'),
      reconnect: refuse('connection'),
      pause: refuse('connection'),
      resume: refuse('connection'),
      disconnect: refuse('connection'),
      listDestinations: refuse('connection'),
      searchMentions: refuse('connection'),
    },
    content: {
      createDraft: refuse('content'),
      get: refuse('content'),
      list: page,
      updateMaster: refuse('content'),
      overrideVariant: refuse('variant'),
      resetVariantToMaster: refuse('variant'),
      setTargets: refuse('content'),
      applySet: refuse('set'),
      applySignature: refuse('signature'),
      freezeVersion: refuse('content_version'),
      preview: refuse('content'),
      delete: refuse('content'),
    },
    validation: { validate: refuse('content') },
    approvals: {
      get: refuse('approval'),
      request: refuse('approval'),
      decide: refuse('approval'),
      listPending: page,
    },
    scheduling: {
      schedule: refuse('content'),
      reschedule: refuse('job'),
      cancel: refuse('job'),
      getCalendar: page,
      nextAvailableSlot: refuse('brand'),
    },
    publishing: {
      publishNow: refuse('content'),
      getJob: refuse('job'),
      retryTarget: refuse('job'),
    },
    receipts: { get: refuse('receipt'), listForJob: refuse('job'), listRecent: page },
    agentConfirmations: {
      request: refuse('agent_confirmation'),
      get: refuse('agent_confirmation'),
      approve: refuse('agent_confirmation'),
      consume: refuse('agent_confirmation'),
    },
    actionCenter: {
      list: page,
      snooze: refuse('action_item'),
      unsnooze: refuse('action_item'),
    },
    media: {
      createUploadUrl: refuse('media'),
      finalizeUpload: refuse('media'),
      importFromUrl: refuse('media'),
      list: page,
      get: refuse('media'),
      delete: refuse('media'),
      edit: refuse('media'),
      setAltText: refuse('media'),
      declareRights: refuse('media'),
      purgeExpired: refuse('media'),
    },
    analytics: {
      getPostMetrics: refuse('receipt'),
      getAccountMetrics: refuse('connection'),
      compare: refuse('comparison'),
      listExperiments: page,
      createExperiment: refuse('experiment'),
    },
    shortLinks: {
      create: refuse('short_link'),
      list: page,
      get: refuse('short_link'),
      resolve: () => Promise.resolve(null),
      recordClick: () => Promise.resolve(),
      getStats: refuse('short_link'),
      updateDestination: refuse('short_link'),
      setEnabled: refuse('short_link'),
    },
    automationRules: {
      list: page,
      get: refuse('rule'),
      create: refuse('rule'),
      update: refuse('rule'),
      enable: refuse('rule'),
      disable: refuse('rule'),
      delete: refuse('rule'),
      preview: refuse('rule'),
      testRun: refuse('rule'),
      listRuns: page,
      triggerFromInbound: refuse('rule'),
    },
    rss: {
      validateFeed: refuse('feed'),
      create: refuse('feed'),
      update: refuse('feed'),
      list: page,
      delete: refuse('feed'),
      getHealth: refuse('feed'),
    },
    growth: {
      getBusinessProfile: () => Promise.resolve(null),
      upsertBusinessProfile: refuse('profile'),
      confirmBusinessProfile: refuse('profile'),
      generatePlan: refuse('profile'),
      getCurrentPlan: () => Promise.resolve(null),
      getPlanSummary: () =>
        Promise.resolve({
          planId: null,
          version: null,
          approvedAt: null,
          currentWeek: null,
          totalWeeks: null,
          undraftedBriefCount: null,
          profileComplete: false,
        }),
      getPlan: refuse('plan'),
      exportPlan: refuse('plan'),
      createDraftFromItem: refuse('plan'),
      proposeSlotFromItem: refuse('plan'),
      listOpportunities: () => Promise.resolve([]),
      listTools: () => Promise.resolve([]),
    },
    webhooks: {
      list: page,
      create: refuse('endpoint'),
      update: refuse('endpoint'),
      delete: refuse('endpoint'),
      testDelivery: refuse('endpoint'),
      listDeliveries: page,
      redeliver: refuse('delivery'),
      emit: () => Promise.resolve([]),
    },
    credentials: {
      status: refuse('connection'),
      describe: refuse('connection'),
      revoke: refuse('connection'),
    },
    apiKeys: { list: page, create: refuse('api_key'), revoke: refuse('api_key') },
    oauthApps: {
      list: page,
      get: refuse('app'),
      create: refuse('app'),
      update: refuse('app'),
      rotateSecret: refuse('app'),
      delete: refuse('app'),
      listGrants: page,
      revokeGrant: refuse('grant'),
    },
    billing: {
      getEntitlements: refuse('entitlements'),
      getUsage: refuse('usage'),
      createCheckout: refuse('checkout'),
      createPortalLink: refuse('portal'),
      handleProviderWebhook: () => Promise.resolve({ processed: true, duplicate: false }),
      hasEntitlement: () => Promise.resolve(true),
    },
    identity: {
      resolveLoginIdentifier: () => Promise.resolve(null),
      getSecurityProfile: () => Promise.resolve(null),
      getSessionView: () => Promise.resolve(null),
      recordSignupConsent: () => Promise.resolve(),
      setUsernameAlias: refuse('alias'),
    },
    audit: { list: page },
    dataExports: {
      request: refuse('data_export'),
      list: page,
      get: refuse('data_export'),
      build: refuse('data_export'),
      download: refuse('data_export'),
    },
    dataLifecycle: {
      request: refuse('deletion_request'),
      current: () => Promise.resolve(null),
      get: refuse('deletion_request'),
      cancel: refuse('deletion_request'),
    },
    dataDeletion: {
      loadDeletionScope: refuse('deletion_request'),
      cancelScheduledJob: refuse('publish_job'),
      revokeProviderConnection: refuse('connection'),
      deleteStoredObjects: refuse('storage'),
      tombstoneAnalytics: refuse('deletion_request'),
      finalizeDeletion: refuse('deletion_request'),
      markDeletionFailed: refuse('deletion_request'),
    },
    health: refuseHealth(),
  };
}

function refuseHealth(): Services['health'] {
  return {
    report: () =>
      Promise.resolve({
        status: 'ok',
        service: 'api',
        version: undefined,
        checkedAt: '2026-08-04T09:00:00.000Z',
        uptimeSeconds: 0,
        subsystems: [],
        connectors: [],
        checks: [],
        summary: { live: 0, degraded: 0, disabled: 0, failingChecks: 0 },
      }),
  };
}
