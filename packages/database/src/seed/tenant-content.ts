import { createHash } from 'node:crypto';

import type { RlsTransactionClient } from '../tenancy/rls-context.js';

import { SEED_METRIC_IDS } from './catalog.js';
import { SEED_IDS } from './tenant-core.js';
import { daysFromNow, hoursAgo, seedId } from './ids.js';

/**
 * Content, publishing evidence, automation and links.
 *
 * The point of this file is that the local database contains a realistic
 * *history*, not just a set of rows: two posts that actually published with
 * receipts and metric observations, one waiting in the queue with a real
 * approval behind it, and two drafts in different states. Without that, every
 * screen that renders a timeline, a receipt or an analytics comparison has to
 * be developed against an empty state.
 */

interface PostSpec {
  readonly key: string;
  readonly title: string;
  readonly body: string;
  readonly comment?: string;
}

export async function seedTenantContent(tx: RlsTransactionClient): Promise<void> {
  await seedDrafts(tx);
  await seedScheduledPost(tx);
  await seedPublishedPosts(tx);
  await seedAutomation(tx);
  await seedLinks(tx);
  await seedFeedbackLoop(tx);
  await seedAuditTrail(tx);
}

function contentHash(body: string): string {
  return createHash('sha256').update(body).digest('hex');
}

async function createItemWithVersion(
  tx: RlsTransactionClient,
  spec: PostSpec,
  state: 'draft' | 'validation_needed' | 'scheduled' | 'published',
  options: {
    readonly scheduledAt?: Date;
    readonly publishedAt?: Date;
    readonly approvedAt?: Date;
    readonly approvalPolicy: 'none' | 'single_approver';
  },
): Promise<{ itemId: string; versionId: string; hash: string }> {
  const itemId = seedId(`content_item:${spec.key}`);
  const versionId = seedId(`content_version:${spec.key}:1`);
  const hash = contentHash(spec.body);

  await tx.contentItem.upsert({
    where: { id: itemId },
    create: {
      id: itemId,
      workspaceId: SEED_IDS.workspace,
      brandId: SEED_IDS.brandSupply,
      campaignId: SEED_IDS.campaign,
      title: spec.title,
      state,
      approvalPolicy: options.approvalPolicy,
      surface: 'web',
      creationMethod: 'human',
      createdByUserId: SEED_IDS.editorUser,
      ...(options.scheduledAt === undefined
        ? {}
        : { scheduledAt: options.scheduledAt, scheduledTimeZone: 'Europe/Lisbon' }),
      ...(options.approvedAt === undefined ? {} : { approvedAt: options.approvedAt }),
      ...(options.publishedAt === undefined ? {} : { publishedAt: options.publishedAt }),
    },
    update: { state },
  });

  const existingVersion = await tx.contentVersion.findUnique({ where: { id: versionId } });
  if (existingVersion === null) {
    await tx.contentVersion.create({
      data: {
        id: versionId,
        workspaceId: SEED_IDS.workspace,
        contentItemId: itemId,
        version: 1,
        body: spec.body,
        payload: { blocks: [{ type: 'text', text: spec.body }], links: [] },
        contentHash: hash,
        locale: 'en',
        creationMethod: 'human',
        createdByUserId: SEED_IDS.editorUser,
      },
    });
  }

  await tx.contentItem.update({
    where: { id: itemId },
    data: { currentVersionId: versionId },
  });

  await tx.postVariant.upsert({
    where: { contentVersionId_connectionId: { contentVersionId: versionId, connectionId: SEED_IDS.connection } },
    create: {
      id: seedId(`post_variant:${spec.key}`),
      workspaceId: SEED_IDS.workspace,
      contentItemId: itemId,
      contentVersionId: versionId,
      connectionId: SEED_IDS.connection,
      destinationId: SEED_IDS.destination,
      provider: 'fake',
      locale: 'en',
      body: spec.body,
      settings: { privacy: 'public' },
      inheritedFields: ['body', 'media'],
      state: state === 'published' ? 'published' : state,
      capabilitySnapshotVersion: '2026-08-04.1',
      estimatedCostMinor: 0,
      estimatedCostCurrency: 'USD',
    },
    update: { state: state === 'published' ? 'published' : state },
  });

  if (spec.comment !== undefined) {
    await tx.commentThreadItem.upsert({
      where: {
        postVariantId_position: { postVariantId: seedId(`post_variant:${spec.key}`), position: 1 },
      },
      create: {
        id: seedId(`comment:${spec.key}:1`),
        workspaceId: SEED_IDS.workspace,
        postVariantId: seedId(`post_variant:${spec.key}`),
        position: 1,
        body: spec.comment,
        delayMinutes: 5,
        state: state === 'published' ? 'published' : 'draft',
      },
      update: {},
    });
  }

  return { itemId, versionId, hash };
}

async function seedDrafts(tx: RlsTransactionClient): Promise<void> {
  await createItemWithVersion(
    tx,
    {
      key: 'draft-bench-vice',
      title: 'Bench vice restock note',
      body: 'The 125mm bench vice is back in stock. Same casting, same jaw plates, two year replacement guarantee.',
    },
    'draft',
    { approvalPolicy: 'none' },
  );

  await createItemWithVersion(
    tx,
    {
      key: 'draft-alt-text-missing',
      title: 'Workshop photo, alt text missing',
      body: 'A customer sent us a photo of their rebuilt lathe. Sharing with permission.',
    },
    'validation_needed',
    { approvalPolicy: 'single_approver' },
  );
}

async function seedScheduledPost(tx: RlsTransactionClient): Promise<void> {
  const scheduledFor = daysFromNow(3, 10, 0);
  const approvedAt = hoursAgo(4);

  const { itemId, versionId } = await createItemWithVersion(
    tx,
    {
      key: 'scheduled-consumables',
      title: 'Tuesday consumables list',
      body: 'Tuesday restock: cutting fluid, 80 grit belts, M6 taps. The full list is in the first comment.',
      comment: 'Full list, sizes and part numbers: https://nw.example.test/r/spring-list',
    },
    'scheduled',
    { scheduledAt: scheduledFor, approvedAt, approvalPolicy: 'single_approver' },
  );

  const approvalRequestId = seedId('approval_request:scheduled-consumables');

  await tx.approvalRequest.upsert({
    where: { id: approvalRequestId },
    create: {
      id: approvalRequestId,
      workspaceId: SEED_IDS.workspace,
      contentItemId: itemId,
      contentVersionId: versionId,
      policy: 'single_approver',
      state: 'approved',
      requestedByUserId: SEED_IDS.editorUser,
      assignedUserIds: [SEED_IDS.approverUser],
      resolvedAt: approvedAt,
    },
    update: { state: 'approved', resolvedAt: approvedAt },
  });

  await tx.approvalDecision.upsert({
    where: { id: seedId('approval_decision:scheduled-consumables') },
    create: {
      id: seedId('approval_decision:scheduled-consumables'),
      workspaceId: SEED_IDS.workspace,
      approvalRequestId,
      decision: 'approve',
      decidedByUserId: SEED_IDS.approverUser,
      comment: 'Part numbers checked against the stock list.',
      reviewedContentHash: contentHash(
        'Tuesday restock: cutting fluid, 80 grit belts, M6 taps. The full list is in the first comment.',
      ),
      createdAt: approvedAt,
    },
    update: {},
  });

  await tx.publishJob.upsert({
    where: { id: seedId('publish_job:scheduled-consumables') },
    create: {
      id: seedId('publish_job:scheduled-consumables'),
      workspaceId: SEED_IDS.workspace,
      contentItemId: itemId,
      contentVersionId: versionId,
      postVariantId: seedId('post_variant:scheduled-consumables'),
      connectionId: SEED_IDS.connection,
      approvalRequestId,
      approvalPolicy: 'single_approver',
      scheduledFor,
      scheduledTimeZone: 'Europe/Lisbon',
      state: 'scheduled',
      idempotencyKey: 'seed-scheduled-consumables-1',
      temporalWorkflowId: 'seed-publish-scheduled-consumables-1',
      surface: 'web',
    },
    update: { scheduledFor, state: 'scheduled' },
  });
}

async function seedPublishedPosts(tx: RlsTransactionClient): Promise<void> {
  const posts: readonly { spec: PostSpec; hoursAgoPublished: number; externalId: string }[] = [
    {
      spec: {
        key: 'published-lathe-rebuild',
        title: 'Lathe rebuild walkthrough',
        body: 'A customer rebuilt a 1970s lathe using parts we stock. Photos and the part list, shared with permission.',
        comment: 'Part list and torque figures: https://nw.example.test/r/lathe-rebuild',
      },
      hoursAgoPublished: 26,
      externalId: 'fake-post-000451',
    },
    {
      spec: {
        key: 'published-belt-sizes',
        title: 'Belt sizes explained',
        body: 'Belt sizing is measured on the inside, not the outside. Here is how to check before you order.',
      },
      hoursAgoPublished: 74,
      externalId: 'fake-post-000418',
    },
  ];

  for (const post of posts) {
    const publishedAt = hoursAgo(post.hoursAgoPublished);
    const approvedAt = hoursAgo(post.hoursAgoPublished + 3);

    const { itemId, versionId, hash } = await createItemWithVersion(
      tx,
      post.spec,
      'published',
      { publishedAt, approvedAt, approvalPolicy: 'single_approver' },
    );

    const approvalRequestId = seedId(`approval_request:${post.spec.key}`);

    await tx.approvalRequest.upsert({
      where: { id: approvalRequestId },
      create: {
        id: approvalRequestId,
        workspaceId: SEED_IDS.workspace,
        contentItemId: itemId,
        contentVersionId: versionId,
        policy: 'single_approver',
        state: 'approved',
        requestedByUserId: SEED_IDS.editorUser,
        assignedUserIds: [SEED_IDS.approverUser],
        resolvedAt: approvedAt,
      },
      update: { state: 'approved', resolvedAt: approvedAt },
    });

    await tx.approvalDecision.upsert({
      where: { id: seedId(`approval_decision:${post.spec.key}`) },
      create: {
        id: seedId(`approval_decision:${post.spec.key}`),
        workspaceId: SEED_IDS.workspace,
        approvalRequestId,
        decision: 'approve',
        decidedByUserId: SEED_IDS.approverUser,
        reviewedContentHash: hash,
        createdAt: approvedAt,
      },
      update: {},
    });

    const jobId = seedId(`publish_job:${post.spec.key}`);

    await tx.publishJob.upsert({
      where: { id: jobId },
      create: {
        id: jobId,
        workspaceId: SEED_IDS.workspace,
        contentItemId: itemId,
        contentVersionId: versionId,
        postVariantId: seedId(`post_variant:${post.spec.key}`),
        connectionId: SEED_IDS.connection,
        approvalRequestId,
        approvalPolicy: 'single_approver',
        scheduledFor: publishedAt,
        scheduledTimeZone: 'Europe/Lisbon',
        state: 'published',
        idempotencyKey: `seed-${post.spec.key}-1`,
        temporalWorkflowId: `seed-publish-${post.spec.key}-1`,
        attemptCount: 1,
        surface: 'web',
        dispatchedAt: new Date(publishedAt.getTime() - 4_000),
        completedAt: publishedAt,
      },
      update: { state: 'published' },
    });

    await tx.publishAttempt.upsert({
      where: { publishJobId_attemptNumber: { publishJobId: jobId, attemptNumber: 1 } },
      create: {
        id: seedId(`publish_attempt:${post.spec.key}:1`),
        workspaceId: SEED_IDS.workspace,
        publishJobId: jobId,
        contentVersionId: versionId,
        connectionId: SEED_IDS.connection,
        attemptNumber: 1,
        outcome: 'succeeded',
        sanitizedResponse: { externalPostId: post.externalId, simulated: true },
        requestMetadata: { endpoint: 'simulator://posts.create', idempotencyToken: `seed-${post.spec.key}-1` },
        httpStatus: 201,
        startedAt: new Date(publishedAt.getTime() - 4_000),
        endedAt: publishedAt,
        costEstimateMinor: 0,
        costActualMinor: 0,
        costCurrency: 'USD',
      },
      update: {},
    });

    const receiptId = seedId(`receipt:${post.spec.key}`);

    const existingReceipt = await tx.publicationReceipt.findUnique({ where: { id: receiptId } });
    if (existingReceipt === null) {
      await tx.publicationReceipt.create({
        data: {
          id: receiptId,
          workspaceId: SEED_IDS.workspace,
          publishJobId: jobId,
          contentVersionId: versionId,
          connectionId: SEED_IDS.connection,
          provider: 'fake',
          externalPostId: post.externalId,
          permalink: `https://simulator.example.test/p/${post.externalId}`,
          contentHash: hash,
          publishedShortLinks:
            post.spec.comment === undefined ? [] : ['https://nw.example.test/r/lathe-rebuild'],
          publishedAt,
          dispatchedAt: new Date(publishedAt.getTime() - 4_000),
          scheduledFor: publishedAt,
          scheduledTimeZone: 'Europe/Lisbon',
          surface: 'web',
          approvedByUserId: SEED_IDS.approverUser,
          approvalPolicy: 'single_approver',
          costActualMinor: 0,
          costCurrency: 'USD',
          responseEvidence: { externalPostId: post.externalId, simulated: true },
          lastAnalyticsSyncAt: hoursAgo(1),
        },
      });
    }

    await seedObservations(tx, post.spec.key, receiptId, post.hoursAgoPublished);
  }
}

async function seedObservations(
  tx: RlsTransactionClient,
  key: string,
  receiptId: string,
  hoursSincePublish: number,
): Promise<void> {
  const observedAt = hoursAgo(1);
  const scale = hoursSincePublish > 48 ? 2 : 1;

  const values: readonly { metricId: string; value: number | null; label: string }[] = [
    { metricId: SEED_METRIC_IDS.impressions, value: 1_240 * scale, label: 'impressions' },
    { metricId: SEED_METRIC_IDS.reach, value: 910 * scale, label: 'reach' },
    { metricId: SEED_METRIC_IDS.likes, value: 63 * scale, label: 'likes' },
    { metricId: SEED_METRIC_IDS.comments, value: 11 * scale, label: 'comments' },
    { metricId: SEED_METRIC_IDS.shares, value: 7 * scale, label: 'shares' },
    // Deliberately unavailable. The UI must render this as "unavailable" with a
    // reason, never as a zero.
    { metricId: SEED_METRIC_IDS.linkClicks, value: null, label: 'link_clicks' },
  ];

  for (const entry of values) {
    const id = seedId(`observation:${key}:${entry.label}`);
    const existing = await tx.metricObservation.findUnique({ where: { id } });
    if (existing !== null) continue;

    await tx.metricObservation.create({
      data: {
        id,
        workspaceId: SEED_IDS.workspace,
        metricDefinitionId: entry.metricId,
        receiptId,
        connectionId: SEED_IDS.connection,
        provider: 'fake',
        observedAt,
        ...(entry.value === null
          ? {
              availability: 'unsupported',
              unavailableReason:
                'The fake provider does not return link clicks. First-party short link clicks measure a different thing.',
            }
          : { availability: 'available', rawValue: entry.value, normalizedValue: entry.value }),
        sourceResponseHash: createHash('sha256').update(`${key}:${entry.label}`).digest('hex'),
      },
    });
  }
}

async function seedAutomation(tx: RlsTransactionClient): Promise<void> {
  const ruleId = seedId('automation_rule:restock-followup');

  await tx.automationRule.upsert({
    where: {
      workspaceId_brandId_name: {
        workspaceId: SEED_IDS.workspace,
        brandId: SEED_IDS.brandSupply,
        name: 'Restock follow-up comment',
      },
    },
    create: {
      id: ruleId,
      workspaceId: SEED_IDS.workspace,
      brandId: SEED_IDS.brandSupply,
      name: 'Restock follow-up comment',
      state: 'active',
      trigger: { kind: 'post_published', filter: { campaignId: SEED_IDS.campaign } },
      conditions: [
        { kind: 'connection_healthy', connectionId: SEED_IDS.connection },
        { kind: 'quiet_hours', start: '20:00', end: '07:00', timeZone: 'Europe/Lisbon', invert: true },
      ],
      actions: [
        { kind: 'request_approval' },
        { kind: 'publish_follow_up_comment', connectionId: SEED_IDS.connection, template: 'restock-list' },
      ],
      delaySeconds: 300,
      endCondition: { kind: 'max_executions', value: 20 },
      cooldownSeconds: 3_600,
      maxExecutions: 20,
      runOncePerSource: true,
      skipWhenMetricStale: true,
      requiresApproval: true,
      preauthorizedConnectionIds: [SEED_IDS.connection],
      lastRunAt: hoursAgo(26),
      createdByUserId: SEED_IDS.ownerUser,
    },
    update: { state: 'active' },
  });

  await tx.automationRuleRun.upsert({
    where: {
      automationRuleId_sourceKind_sourceId: {
        automationRuleId: ruleId,
        sourceKind: 'publication_receipt',
        sourceId: seedId('receipt:published-lathe-rebuild'),
      },
    },
    create: {
      id: seedId('automation_rule_run:1'),
      workspaceId: SEED_IDS.workspace,
      automationRuleId: ruleId,
      ruleVersion: 1,
      state: 'succeeded',
      sourceKind: 'publication_receipt',
      sourceId: seedId('receipt:published-lathe-rebuild'),
      triggerPayload: { receiptId: seedId('receipt:published-lathe-rebuild') },
      evaluatedConditions: [
        { kind: 'connection_healthy', result: true },
        { kind: 'quiet_hours', result: true },
      ],
      performedActions: [{ kind: 'request_approval', result: 'approved' }],
      startedAt: hoursAgo(26),
      endedAt: hoursAgo(25),
    },
    update: {},
  });

  const feedId = seedId('rss_feed:supplier-notes');

  await tx.rssFeed.upsert({
    where: { workspaceId_feedUrl: { workspaceId: SEED_IDS.workspace, feedUrl: 'https://feeds.example.test/supplier-notes.xml' } },
    create: {
      id: feedId,
      workspaceId: SEED_IDS.workspace,
      brandId: SEED_IDS.brandSupply,
      title: 'Supplier notes (simulator feed)',
      feedUrl: 'https://feeds.example.test/supplier-notes.xml',
      health: 'healthy',
      connectionIds: [SEED_IDS.connection],
      publishPolicy: 'draft',
      templateBody: 'New from our suppliers: {{title}}',
      markCurrentAsSeen: true,
      pollIntervalSeconds: 900,
      lastPolledAt: hoursAgo(1),
      lastNewItemAt: hoursAgo(30),
      createdByUserId: SEED_IDS.ownerUser,
    },
    update: { health: 'healthy', lastPolledAt: hoursAgo(1) },
  });

  await tx.rssFeedItem.upsert({
    where: { rssFeedId_fingerprint: { rssFeedId: feedId, fingerprint: 'seed-item-0001' } },
    create: {
      id: seedId('rss_feed_item:1'),
      workspaceId: SEED_IDS.workspace,
      rssFeedId: feedId,
      guid: 'seed-item-0001',
      fingerprint: 'seed-item-0001',
      link: 'https://feeds.example.test/supplier-notes/0001',
      title: 'Carbide insert grades explained',
      summary: 'Simulator feed item used by the local seed.',
      publishedAt: hoursAgo(30),
      state: 'drafted',
      contentItemId: seedId('content_item:draft-bench-vice'),
    },
    update: {},
  });
}

async function seedLinks(tx: RlsTransactionClient): Promise<void> {
  const linkId = seedId('short_link:spring-list');

  await tx.shortLink.upsert({
    where: { id: linkId },
    create: {
      id: linkId,
      workspaceId: SEED_IDS.workspace,
      brandId: SEED_IDS.brandSupply,
      campaignId: SEED_IDS.campaign,
      domain: 'nw.example.test',
      slug: 'spring-list',
      destinationUrl: 'https://northwind.example.test/restock/spring',
      utmParameters: { utm_source: 'social', utm_medium: 'organic', utm_campaign: 'spring-restock' },
      state: 'active',
      safetyScan: { scheme: 'https', privateNetwork: false, openRedirect: false, verdict: 'allow' },
      safetyScannedAt: hoursAgo(30),
      createdByUserId: SEED_IDS.editorUser,
    },
    update: {},
  });

  const clicks = [
    { key: 'a', hours: 24, country: 'PT', device: 'mobile', referrer: 'social', bot: 'human' as const },
    { key: 'b', hours: 23, country: 'PT', device: 'desktop', referrer: 'social', bot: 'human' as const },
    { key: 'c', hours: 22, country: 'ES', device: 'mobile', referrer: 'direct', bot: 'human' as const },
    { key: 'd', hours: 22, country: 'US', device: 'unknown', referrer: 'unknown', bot: 'suspected_bot' as const },
  ];

  for (const click of clicks) {
    const dedupeKey = `seed-click-${click.key}`;
    await tx.shortLinkClick.upsert({
      where: { shortLinkId_dedupeKey: { shortLinkId: linkId, dedupeKey } },
      create: {
        id: seedId(`short_link_click:${click.key}`),
        workspaceId: SEED_IDS.workspace,
        shortLinkId: linkId,
        occurredAt: hoursAgo(click.hours),
        countryCode: click.country,
        deviceClass: click.device,
        referrerClass: click.referrer,
        botClass: click.bot,
        dedupeKey,
        dedupeExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      update: {},
    });
  }
}

async function seedFeedbackLoop(tx: RlsTransactionClient): Promise<void> {
  const experimentId = seedId('experiment:first-comment-delay');

  await tx.experiment.upsert({
    where: { id: experimentId },
    create: {
      id: experimentId,
      workspaceId: SEED_IDS.workspace,
      campaignId: SEED_IDS.campaign,
      name: 'First comment delay: 30 minutes against 5 minutes',
      hypothesis: 'A shorter delay before the first comment increases replies on restock posts.',
      variants: [
        { key: 'control', delayMinutes: 30 },
        { key: 'variant', delayMinutes: 5 },
      ],
      successMetric: 'comments',
      windowStart: hoursAgo(168),
      windowEnd: daysFromNow(7, 12, 0),
      state: 'running',
      caveats:
        'Four posts per arm is a small sample. Image posts and text posts are not directly comparable here.',
      createdByUserId: SEED_IDS.ownerUser,
    },
    update: {},
  });

  await tx.insight.upsert({
    where: { id: seedId('insight:comments-delay') },
    create: {
      id: seedId('insight:comments-delay'),
      workspaceId: SEED_IDS.workspace,
      contentItemId: seedId('content_item:published-lathe-rebuild'),
      experimentId,
      messageKey: 'insight.metric_above_trailing_median',
      messageArgs: { metric: 'reach', deltaPercent: 42, baselineWindow: 10 },
      evidenceIds: [seedId('receipt:published-lathe-rebuild')],
      confidence: 'low',
      sampleSize: 10,
      state: 'new',
    },
    update: {},
  });

  await tx.connectionIncident.upsert({
    where: { id: seedId('incident:capability-refresh') },
    create: {
      id: seedId('incident:capability-refresh'),
      workspaceId: SEED_IDS.workspace,
      connectionId: SEED_IDS.connection,
      kind: 'rate_limited',
      state: 'resolved',
      remediationKey: 'connection.incident.rate_limited',
      detail: { resource: 'post.create', retryAfterSeconds: 120 },
      detectedAt: hoursAgo(50),
      resolvedAt: hoursAgo(49),
    },
    update: {},
  });
}

async function seedAuditTrail(tx: RlsTransactionClient): Promise<void> {
  const events = [
    { key: 'workspace', action: 'workspace.created', targetType: 'workspace', targetId: SEED_IDS.workspace, hours: 720 },
    { key: 'connection', action: 'connection.connected', targetType: 'social_connection', targetId: SEED_IDS.connection, hours: 700 },
    { key: 'approval', action: 'approval.decided', targetType: 'approval_request', targetId: seedId('approval_request:published-lathe-rebuild'), hours: 29 },
    { key: 'published', action: 'post.published', targetType: 'publication_receipt', targetId: seedId('receipt:published-lathe-rebuild'), hours: 26 },
  ];

  for (const event of events) {
    const id = seedId(`audit:${event.key}`);
    const existing = await tx.auditEvent.findUnique({ where: { id } });
    if (existing !== null) continue;

    await tx.auditEvent.create({
      data: {
        id,
        workspaceId: SEED_IDS.workspace,
        actorType: 'user',
        actorId: SEED_IDS.ownerUser,
        surface: 'web',
        action: event.action,
        targetType: event.targetType,
        targetId: event.targetId,
        metadata: { seeded: true },
        correlationId: `seed-${event.key}`,
        createdAt: hoursAgo(event.hours),
      },
    });
  }
}
