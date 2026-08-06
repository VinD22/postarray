import type { RlsTransactionClient } from '../tenancy/rls-context';
import { ACTIVE_CHANNEL_LIMIT, WORKSPACE_MEMBER_LIMIT } from '@relay/contracts';

import { SEED_OPPORTUNITY_IDS } from './catalog';
import { SEED_WORKSPACE_ID, hoursAgo, seedId } from './ids';

/**
 * Identity, tenancy, brands and the fake provider connection.
 *
 * The fake connector exists so the whole compose, approve, schedule, publish,
 * receipt and analytics loop is exercisable with no provider keys and no
 * network. Its capability snapshot is a full one on purpose: it is the fixture
 * the composer, the validators and the preview are built against, so it has to
 * express the same shape a real connector reports, including the difference
 * between `unsupported` and `not_implemented`.
 */

export const SEED_IDS = {
  workspace: SEED_WORKSPACE_ID,
  ownerUser: seedId('user:owner'),
  editorUser: seedId('user:editor'),
  approverUser: seedId('user:approver'),
  brandSupply: seedId('brand:supply'),
  brandLabs: seedId('brand:labs'),
  businessProfile: seedId('business_profile:supply'),
  campaign: seedId('campaign:spring-restock'),
  connection: seedId('connection:fake-supply'),
  credential: seedId('credential:fake-supply'),
  destination: seedId('destination:fake-community'),
  mentionEntity: seedId('mention:fake-partner'),
  signature: seedId('signature:supply-default'),
  postingSet: seedId('posting_set:launch'),
  serviceAccount: seedId('service_account:calendar-bot'),
  apiKey: seedId('api_key:calendar-bot'),
  growthPlan: seedId('growth_plan:supply-v1'),
  polarCustomer: seedId('polar_customer:northwind'),
  subscription: seedId('subscription:northwind-trial'),
  webhookEndpoint: seedId('webhook_endpoint:ops'),
} as const;

/**
 * The capability snapshot the fake provider reports. Data, not code.
 * Deliberately mixed so every UI state has a case to render.
 */
export const FAKE_CAPABILITY_SNAPSHOT = {
  version: '2026-08-04.1',
  text: { maxLength: 480, supportsLineBreaks: true, supportsHashtags: true },
  media: {
    image: {
      state: 'supported',
      maxCount: 4,
      maxBytes: 8_000_000,
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    video: {
      state: 'supported',
      maxCount: 1,
      maxBytes: 200_000_000,
      maxDurationSeconds: 180,
      mimeTypes: ['video/mp4'],
    },
    document: { state: 'unsupported', reason: 'The fake provider has no document post type.' },
    carousel: { state: 'supported', minItems: 2, maxItems: 4 },
    altText: { state: 'supported', required: false, maxLength: 400 },
    thumbnail: { state: 'not_implemented', reason: 'Custom video thumbnails are not built yet.' },
  },
  destinations: { state: 'supported', kinds: ['community'] },
  mentions: { lookup: 'supported', nativeTagging: 'supported' },
  firstComment: { state: 'supported', maxLength: 480 },
  threads: { state: 'supported', maxItems: 5 },
  drafts: { state: 'unsupported', reason: 'The fake provider has no remote draft store.' },
  privacyOptions: { state: 'supported', values: ['public', 'unlisted'] },
  scheduling: { providerSideScheduling: 'unsupported' },
  deletePost: { state: 'supported' },
  analytics: { state: 'supported', postLevel: true, accountLevel: false, freshnessMinutes: 60 },
  aiDisclosure: {
    state: 'not_implemented',
    reason: 'No disclosure field is exposed by this simulator yet.',
  },
  costPerCreate: { minor: 0, currency: 'USD' },
};

export async function seedTenantCore(tx: RlsTransactionClient): Promise<void> {
  await seedPeopleAndWorkspace(tx);
  await seedBrands(tx);
  await seedConnection(tx);
  await seedReusables(tx);
  await seedGrowthPlan(tx);
  await seedBilling(tx);
}

async function seedPeopleAndWorkspace(tx: RlsTransactionClient): Promise<void> {
  const people = [
    {
      id: SEED_IDS.ownerUser,
      email: 'owner@example.test',
      displayName: 'Ada Okafor',
      handle: 'ada',
    },
    {
      id: SEED_IDS.editorUser,
      email: 'editor@example.test',
      displayName: 'Ben Marsh',
      handle: 'ben',
    },
    {
      id: SEED_IDS.approverUser,
      email: 'approver@example.test',
      displayName: 'Chloe Dupont',
      handle: 'chloe',
    },
  ];

  for (const person of people) {
    await tx.user.upsert({
      where: { id: person.id },
      create: {
        id: person.id,
        // Local seed identities have no Neon Auth subject: nobody can sign in as
        // them until a real auth user is linked.
        email: person.email,
        emailVerifiedAt: hoursAgo(720),
        displayName: person.displayName,
        status: 'active',
        locale: 'en',
        timeZone: 'Europe/Lisbon',
      },
      update: { displayName: person.displayName },
    });

    await tx.userAlias.upsert({
      where: { normalizedHandle: person.handle },
      create: {
        id: seedId(`alias:${person.handle}`),
        userId: person.id,
        handle: person.handle,
        normalizedHandle: person.handle,
        verifiedAt: hoursAgo(720),
        isPrimary: true,
      },
      update: {},
    });

    await tx.consent.upsert({
      where: {
        userId_kind_documentVersion: {
          userId: person.id,
          kind: 'terms_of_service',
          documentVersion: '2026-08-01',
        },
      },
      create: {
        id: seedId(`consent:${person.handle}`),
        userId: person.id,
        workspaceId: SEED_IDS.workspace,
        kind: 'terms_of_service',
        state: 'granted',
        documentVersion: '2026-08-01',
        grantedAt: hoursAgo(720),
      },
      update: {},
    });
  }

  await tx.workspace.upsert({
    where: { id: SEED_IDS.workspace },
    create: {
      id: SEED_IDS.workspace,
      name: 'Northwind Supply Co.',
      slug: 'northwind-demo',
      ownerUserId: SEED_IDS.ownerUser,
      status: 'trialing',
      defaultLocale: 'en',
      defaultTimeZone: 'Europe/Lisbon',
    },
    update: { name: 'Northwind Supply Co.' },
  });

  const memberships = [
    { userId: SEED_IDS.ownerUser, role: 'owner' as const },
    { userId: SEED_IDS.editorUser, role: 'editor' as const },
    { userId: SEED_IDS.approverUser, role: 'approver' as const },
  ];

  for (const membership of memberships) {
    await tx.membership.upsert({
      where: {
        workspaceId_userId: { workspaceId: SEED_IDS.workspace, userId: membership.userId },
      },
      create: {
        id: seedId(`membership:${membership.role}`),
        workspaceId: SEED_IDS.workspace,
        userId: membership.userId,
        role: membership.role,
        state: 'active',
        invitedAt: hoursAgo(720),
        acceptedAt: hoursAgo(719),
      },
      update: { role: membership.role, state: 'active' },
    });
  }

  await tx.serviceAccount.upsert({
    where: { workspaceId_name: { workspaceId: SEED_IDS.workspace, name: 'calendar-bot' } },
    create: {
      id: SEED_IDS.serviceAccount,
      workspaceId: SEED_IDS.workspace,
      name: 'calendar-bot',
      description: 'Reads the calendar and drafts posts. Cannot publish.',
      scopes: ['accounts:read', 'drafts:write', 'analytics:read'],
      maxApprovalLevel: 1,
      maxDailyPublishes: 0,
      maxLookAheadDays: 30,
      createdByUserId: SEED_IDS.ownerUser,
    },
    update: {},
  });

  await tx.apiKey.upsert({
    where: { id: SEED_IDS.apiKey },
    create: {
      id: SEED_IDS.apiKey,
      workspaceId: SEED_IDS.workspace,
      serviceAccountId: SEED_IDS.serviceAccount,
      name: 'calendar-bot local',
      prefix: 'seedkey_local',
      // Not a credential. A fixed non-verifying digest so nothing can
      // authenticate with this row even if the database is copied.
      secretHash: 'seed-placeholder-never-matches',
      hashAlgorithm: 'argon2id',
      scopes: ['accounts:read', 'drafts:write'],
      createdByUserId: SEED_IDS.ownerUser,
    },
    update: {},
  });
}

async function seedBrands(tx: RlsTransactionClient): Promise<void> {
  await tx.brand.upsert({
    where: { workspaceId_slug: { workspaceId: SEED_IDS.workspace, slug: 'supply' } },
    create: {
      id: SEED_IDS.brandSupply,
      workspaceId: SEED_IDS.workspace,
      name: 'Northwind Supply',
      slug: 'supply',
      voice: 'Direct, practical, no hype. Short sentences. Concrete numbers.',
      audience: 'Independent workshop owners buying tools and consumables.',
      approvedClaims: ['Ships within two working days', 'Two year replacement guarantee'],
      blockedTerms: ['revolutionary', 'game changing', 'guaranteed results'],
      domains: ['northwind.example.test'],
      defaultTimeZone: 'Europe/Lisbon',
      defaultShortLinkOn: true,
      disclosureDefaults: {
        paidPartnership: 'Paid partnership disclosure required for sponsored posts.',
      },
    },
    update: {},
  });

  await tx.brand.upsert({
    where: { workspaceId_slug: { workspaceId: SEED_IDS.workspace, slug: 'labs' } },
    create: {
      id: SEED_IDS.brandLabs,
      workspaceId: SEED_IDS.workspace,
      name: 'Northwind Labs',
      slug: 'labs',
      voice: 'Curious and technical. Explains a decision, never sells.',
      audience: 'Engineers evaluating materials and tolerances.',
      approvedClaims: ['Test methodology published for every result'],
      blockedTerms: ['best in class', 'industry leading'],
      domains: ['labs.northwind.example.test'],
      defaultTimeZone: 'Europe/Lisbon',
    },
    update: {},
  });

  await tx.businessProfile.upsert({
    where: { brandId_version: { brandId: SEED_IDS.brandSupply, version: 1 } },
    create: {
      id: SEED_IDS.businessProfile,
      workspaceId: SEED_IDS.workspace,
      brandId: SEED_IDS.brandSupply,
      version: 1,
      productUrl: 'https://northwind.example.test',
      productUrlVerifiedAt: hoursAgo(700),
      description: 'Workshop tools and consumables sold direct to independent workshops.',
      category: 'ecommerce',
      markets: ['PT', 'ES', 'FR'],
      languages: ['en', 'pt', 'es'],
      idealCustomer: 'Owner operator of a two to ten person workshop.',
      objective: 'Repeat orders from existing customers.',
      conversionEvent: 'checkout_completed',
      provenClaims: [
        {
          claim: 'Ships within two working days',
          evidence: 'Internal fulfilment report',
          confirmed: true,
        },
      ],
      prohibitedClaims: ['cheapest anywhere', 'guaranteed delivery date'],
      weeklyCapacityHours: 4,
      completenessScore: 72,
      confirmedAt: hoursAgo(690),
      confirmedByUserId: SEED_IDS.ownerUser,
    },
    update: {},
  });

  await tx.glossaryTerm.upsert({
    where: {
      brandId_locale_term: { brandId: SEED_IDS.brandSupply, locale: 'pt', term: 'workshop' },
    },
    create: {
      id: seedId('glossary:pt:workshop'),
      workspaceId: SEED_IDS.workspace,
      brandId: SEED_IDS.brandSupply,
      locale: 'pt',
      term: 'workshop',
      preferredTranslation: 'oficina',
      prohibitedTranslations: ['seminário'],
      context: 'A physical workspace, never a training session.',
    },
    update: {},
  });

  await tx.campaign.upsert({
    where: { id: SEED_IDS.campaign },
    create: {
      id: SEED_IDS.campaign,
      workspaceId: SEED_IDS.workspace,
      brandId: SEED_IDS.brandSupply,
      name: 'Spring restock',
      objective: 'Bring dormant customers back for consumables.',
      tags: ['restock', 'consumables'],
      utmDefaults: { utm_source: 'social', utm_medium: 'organic', utm_campaign: 'spring-restock' },
      startsAt: hoursAgo(240),
      createdByUserId: SEED_IDS.ownerUser,
    },
    update: {},
  });
}

async function seedConnection(tx: RlsTransactionClient): Promise<void> {
  await tx.socialConnection.upsert({
    where: { id: SEED_IDS.connection },
    create: {
      id: SEED_IDS.connection,
      workspaceId: SEED_IDS.workspace,
      brandId: SEED_IDS.brandSupply,
      provider: 'fake',
      externalAccountId: 'fake-account-000123',
      accountType: 'business_account',
      displayName: 'Northwind Supply (simulator)',
      handle: 'northwind_supply',
      profileUrl: 'https://simulator.example.test/northwind_supply',
      status: 'active',
      grantedScopes: ['posts:write', 'posts:read', 'analytics:read', 'mentions:read'],
      capabilities: FAKE_CAPABILITY_SNAPSHOT,
      capabilityVersion: FAKE_CAPABILITY_SNAPSHOT.version,
      capabilitiesRefreshedAt: hoursAgo(2),
      lastSuccessfulActionAt: hoursAgo(20),
      connectedAt: hoursAgo(700),
      createdByUserId: SEED_IDS.ownerUser,
    },
    update: {
      capabilities: FAKE_CAPABILITY_SNAPSHOT,
      capabilityVersion: FAKE_CAPABILITY_SNAPSHOT.version,
      capabilitiesRefreshedAt: hoursAgo(2),
    },
  });

  await tx.socialCredential.upsert({
    where: { connectionId: SEED_IDS.connection },
    create: {
      id: SEED_IDS.credential,
      workspaceId: SEED_IDS.workspace,
      connectionId: SEED_IDS.connection,
      // Not a credential and not decryptable: fixed bytes so the column shape is
      // exercised without any material that could authenticate anywhere.
      accessTokenCiphertext: Buffer.from('seed-simulator-ciphertext'),
      accessTokenNonce: Buffer.from('seed-nonce-0001'),
      algorithm: 'aes-256-gcm',
      keyVersion: 'local-dev-v1',
      accessTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    update: {},
  });

  await tx.providerDestination.upsert({
    where: {
      connectionId_kind_externalId: {
        connectionId: SEED_IDS.connection,
        kind: 'community',
        externalId: 'fake-community-42',
      },
    },
    create: {
      id: SEED_IDS.destination,
      workspaceId: SEED_IDS.workspace,
      connectionId: SEED_IDS.connection,
      provider: 'fake',
      kind: 'community',
      externalId: 'fake-community-42',
      displayName: 'Workshop Owners (simulator community)',
      permalink: 'https://simulator.example.test/c/fake-community-42',
      refreshedAt: hoursAgo(6),
    },
    update: { refreshedAt: hoursAgo(6) },
  });

  await tx.mentionEntity.upsert({
    where: {
      connectionId_provider_externalId: {
        connectionId: SEED_IDS.connection,
        provider: 'fake',
        externalId: 'fake-entity-77',
      },
    },
    create: {
      id: SEED_IDS.mentionEntity,
      workspaceId: SEED_IDS.workspace,
      connectionId: SEED_IDS.connection,
      provider: 'fake',
      kind: 'company',
      externalId: 'fake-entity-77',
      handle: 'meridian_tools',
      displayLabel: 'Meridian Tools (simulator entity)',
      resolvedAt: hoursAgo(6),
    },
    update: { resolvedAt: hoursAgo(6) },
  });

  await tx.providerLimit.upsert({
    where: { id: seedId('provider_limit:fake:create') },
    create: {
      id: seedId('provider_limit:fake:create'),
      workspaceId: SEED_IDS.workspace,
      connectionId: SEED_IDS.connection,
      provider: 'fake',
      resource: 'post.create',
      windowSeconds: 86_400,
      limitValue: 100,
      remaining: 94,
      resetsAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      policyVersion: '2026-08-04',
    },
    update: { remaining: 94 },
  });
}

async function seedReusables(tx: RlsTransactionClient): Promise<void> {
  await tx.signature.upsert({
    where: {
      workspaceId_brandId_name_locale: {
        workspaceId: SEED_IDS.workspace,
        brandId: SEED_IDS.brandSupply,
        name: 'Standard close',
        locale: 'en',
      },
    },
    create: {
      id: SEED_IDS.signature,
      workspaceId: SEED_IDS.workspace,
      brandId: SEED_IDS.brandSupply,
      name: 'Standard close',
      body: 'Questions about a part number? Reply here and we will answer.',
      locale: 'en',
      providers: ['fake'],
      autoApply: false,
    },
    update: {},
  });

  await tx.postingSet.upsert({
    where: {
      workspaceId_brandId_name: {
        workspaceId: SEED_IDS.workspace,
        brandId: SEED_IDS.brandSupply,
        name: 'Weekly restock',
      },
    },
    create: {
      id: SEED_IDS.postingSet,
      workspaceId: SEED_IDS.workspace,
      brandId: SEED_IDS.brandSupply,
      name: 'Weekly restock',
      description: 'The targets and defaults used for the Tuesday restock note.',
      connectionIds: [SEED_IDS.connection],
      targetDefaults: {
        fake: { destinationId: 'fake-community-42', privacy: 'public' },
      },
      commentSkeleton: [{ position: 1, delayMinutes: 5, placeholder: 'Link to the restock list.' }],
      signatureId: SEED_IDS.signature,
      approvalPolicy: 'single_approver',
      slotBehavior: 'next_free_slot',
      createdByUserId: SEED_IDS.editorUser,
    },
    update: {},
  });

  await tx.webhookEndpoint.upsert({
    where: { workspaceId_name: { workspaceId: SEED_IDS.workspace, name: 'ops-notifications' } },
    create: {
      id: SEED_IDS.webhookEndpoint,
      workspaceId: SEED_IDS.workspace,
      name: 'ops-notifications',
      url: 'https://hooks.example.test/relay/ops',
      state: 'active',
      // Fixed bytes, not a signing secret. Rotate before any real delivery.
      secretCiphertext: Buffer.from('seed-webhook-ciphertext'),
      secretNonce: Buffer.from('seed-nonce-0002'),
      keyVersion: 'local-dev-v1',
      subscribedEvents: ['post.published', 'post.failed', 'connection.action_required'],
      createdByUserId: SEED_IDS.ownerUser,
    },
    update: {},
  });
}

async function seedGrowthPlan(tx: RlsTransactionClient): Promise<void> {
  await tx.growthPlan.upsert({
    where: { brandId_version: { brandId: SEED_IDS.brandSupply, version: 1 } },
    create: {
      id: SEED_IDS.growthPlan,
      workspaceId: SEED_IDS.workspace,
      brandId: SEED_IDS.brandSupply,
      businessProfileId: SEED_IDS.businessProfile,
      version: 1,
      state: 'draft',
      objective: 'Repeat orders from existing customers.',
      schemaVersion: '1',
      sections: {
        business_snapshot: {
          confirmed: ['Ships within two working days'],
          missing: ['No conversion baseline has been provided yet.'],
        },
        goals_and_metrics: {
          objective: 'Repeat orders',
          conversion_event: 'checkout_completed',
          baseline: 'unavailable',
          window_weeks: 4,
        },
      },
      channelPriorities: [
        { channel: 'fake', priority: 1, rationale: 'The only connected account in this seed.' },
      ],
      contentPillars: [
        { name: 'Restock notes', description: 'What came back into stock and why it matters.' },
        { name: 'Repair walkthroughs', description: 'One fix, one part, start to finish.' },
        { name: 'Customer workshops', description: 'Shops using the tools, with permission.' },
      ],
      cadence: { postsPerWeek: 3, quietHours: { start: '20:00', end: '07:00' } },
      ugcPlan: {
        goal: 'Collect five workshop photos with written permission.',
        consentChecklist: ['written permission', 'usage window agreed', 'credit line agreed'],
      },
      measurementPlan: { primary: 'reach', secondary: 'comments', window_weeks: 4 },
      risksAndUnknowns: [
        {
          risk: 'No baseline exists, so the first four weeks establish one rather than prove anything.',
        },
      ],
      evidenceIds: [SEED_IDS.businessProfile],
    },
    update: {},
  });

  const matches = [
    { key: 'directory', opportunityId: SEED_OPPORTUNITY_IDS.directory, rank: 1 },
    { key: 'community', opportunityId: SEED_OPPORTUNITY_IDS.community, rank: 2 },
    { key: 'newsletter', opportunityId: SEED_OPPORTUNITY_IDS.newsletter, rank: 3 },
  ];

  for (const match of matches) {
    await tx.strategyOpportunityMatch.upsert({
      where: {
        growthPlanId_opportunityId: {
          growthPlanId: SEED_IDS.growthPlan,
          opportunityId: match.opportunityId,
        },
      },
      create: {
        id: seedId(`match:${match.key}`),
        workspaceId: SEED_IDS.workspace,
        growthPlanId: SEED_IDS.growthPlan,
        opportunityId: match.opportunityId,
        rank: match.rank,
        fitExplanation:
          'Seed match. It demonstrates ranking and the rules panel. It is not a recommendation and it does not promise a link.',
        estimatedEffort: 'about an hour',
        evidenceIds: [SEED_IDS.businessProfile],
        decision: 'proposed',
      },
      update: {},
    });
  }
}

async function seedBilling(tx: RlsTransactionClient): Promise<void> {
  await tx.polarCustomer.upsert({
    where: { workspaceId: SEED_IDS.workspace },
    create: {
      id: SEED_IDS.polarCustomer,
      workspaceId: SEED_IDS.workspace,
      polarCustomerId: 'seed_polar_customer_northwind',
      billingEmail: 'billing@example.test',
    },
    update: {},
  });

  const trialStart = hoursAgo(48);
  const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000);

  await tx.subscription.upsert({
    where: { id: SEED_IDS.subscription },
    create: {
      id: SEED_IDS.subscription,
      workspaceId: SEED_IDS.workspace,
      polarCustomerId: SEED_IDS.polarCustomer,
      polarSubscriptionId: 'seed_polar_subscription_northwind',
      polarProductId: 'seed_polar_product_monthly',
      status: 'trialing',
      interval: 'month',
      // $29.00 in integer minor units.
      amountMinor: 2900,
      currency: 'USD',
      trialStartsAt: trialStart,
      trialEndsAt: trialEnd,
      currentPeriodStart: trialStart,
      currentPeriodEnd: trialEnd,
      lastReconciledAt: hoursAgo(1),
    },
    update: { status: 'trialing', trialEndsAt: trialEnd },
  });

  interface EntitlementSeed {
    readonly key: string;
    readonly kind: 'numeric_limit' | 'boolean_flag';
    readonly numericValue?: number;
    readonly booleanValue?: boolean;
  }

  // One public plan, no feature tiers. Limits mirror the public contract so a
  // local environment cannot advertise or exercise a plan that production
  // would refuse.
  const entitlements: readonly EntitlementSeed[] = [
    { key: 'channels.active.max', kind: 'numeric_limit', numericValue: ACTIVE_CHANNEL_LIMIT },
    { key: 'team.members.max', kind: 'numeric_limit', numericValue: WORKSPACE_MEMBER_LIMIT },
    { key: 'publishing.enabled', kind: 'boolean_flag', booleanValue: true },
    { key: 'api.enabled', kind: 'boolean_flag', booleanValue: true },
    { key: 'mcp.enabled', kind: 'boolean_flag', booleanValue: true },
    { key: 'ai.text.enabled', kind: 'boolean_flag', booleanValue: true },
  ];

  for (const entitlement of entitlements) {
    await tx.entitlement.upsert({
      where: { workspaceId_key: { workspaceId: SEED_IDS.workspace, key: entitlement.key } },
      create: {
        id: seedId(`entitlement:${entitlement.key}`),
        workspaceId: SEED_IDS.workspace,
        subscriptionId: SEED_IDS.subscription,
        key: entitlement.key,
        kind: entitlement.kind,
        ...(entitlement.numericValue === undefined
          ? {}
          : { numericValue: entitlement.numericValue }),
        ...(entitlement.booleanValue === undefined
          ? {}
          : { booleanValue: entitlement.booleanValue }),
        source: 'polar_webhook',
      },
      update: {},
    });
  }
}
