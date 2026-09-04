/**
 * Seeded demo data.
 *
 * Served only when `NEXT_PUBLIC_POSTARRAY_DEMO_MODE=true` is explicitly enabled in
 * a non-production environment. Every screen that renders this data also
 * renders the "Demo data" notice from the shell: this is example content, not a
 * fake dashboard pretending to be real.
 *
 * Rules this file obeys:
 *  - No invented company logos, no testimonials, no invented performance claims.
 *  - Metrics that a provider would not return are `unavailable` with a reason,
 *    never a fabricated zero.
 *  - The account names are obviously an example workspace.
 */

import type {
  ActionItemView,
  ApprovalRequestView,
  AuditEventView,
  BillingStateView,
  ProjectView,
  CalendarEntryView,
  ConnectionView,
  GrowthPlanSummaryView,
  HealthView,
  MemberView,
  OnboardingStateView,
  Paginated,
  ReceiptSummaryView,
  SessionView,
  UsageView,
} from './types';
import type { PublicationReceipt } from '@relay/contracts';
import type { PublishJobView } from '@relay/application';

/** Anchor everything to the moment the page loads so the demo never goes stale. */
function at(offsetMinutes: number): string {
  return new Date(Date.now() + offsetMinutes * 60_000).toISOString();
}

/** ISO-like local wall time for the receipt's recorded IANA zone. */
function localDateTimeAt(instant: string, timeZone: string): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
    .format(new Date(instant))
    .replace(' ', 'T');
}

const HOUR = 60;
const DAY = 24 * HOUR;

export function page<T>(data: readonly T[]): Paginated<T> {
  return { data, pageInfo: { nextCursor: null, hasMore: false, limit: 25 } };
}

export const demoProjects: readonly ProjectView[] = [
  {
    id: 'project_demo00000000000000001',
    workspaceId: 'ws_demo0000000000000000001',
    name: 'Example Studio EU',
    slug: 'example-studio-eu',
    voice: 'Direct, useful and specific.',
    audience: 'Independent teams publishing across multiple channels.',
    approvedClaims: [],
    blockedTerms: [],
    domains: [],
    defaultTimeZone: 'Europe/Berlin',
    defaultShortLinkOn: false,
    rememberTargetsEnabled: false,
    archived: false,
    connectionIds: ['conn_demo00000000000000001', 'conn_demo00000000000000002'],
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-01-12T09:00:00.000Z',
  },
  {
    id: 'project_demo00000000000000002',
    workspaceId: 'ws_demo0000000000000000001',
    name: 'Example Studio Labs',
    slug: 'example-studio-labs',
    voice: null,
    audience: null,
    approvedClaims: [],
    blockedTerms: [],
    domains: [],
    defaultTimeZone: 'Europe/Berlin',
    defaultShortLinkOn: false,
    rememberTargetsEnabled: false,
    archived: false,
    connectionIds: ['conn_demo00000000000000003'],
    createdAt: '2026-01-11T09:00:00.000Z',
    updatedAt: '2026-01-11T09:00:00.000Z',
  },
];

export const demoSession: SessionView = {
  user: {
    id: 'user_demo000000000000000001',
    name: 'Ana Ruiz',
    email: 'ana@example-studio.test',
    username: 'ana',
    avatarUrl: null,
    locale: 'en',
    timeZone: 'Europe/Berlin',
  },
  workspace: {
    id: 'ws_demo0000000000000000001',
    name: 'Example Studio',
    slug: 'example-studio',
    timeZone: 'Europe/Berlin',
    locale: 'en',
    role: 'owner',
    readOnly: false,
    projectLimit: 3,
  },
  workspaces: [
    {
      id: 'ws_demo0000000000000000001',
      name: 'Example Studio',
      slug: 'example-studio',
      timeZone: 'Europe/Berlin',
      locale: 'en',
      role: 'owner',
      readOnly: false,
      projectLimit: 3,
    },
    {
      id: 'ws_demo0000000000000000002',
      name: 'Northwind Client',
      slug: 'northwind-client',
      timeZone: 'America/New_York',
      locale: 'en',
      role: 'manager',
      readOnly: false,
      projectLimit: 3,
    },
  ],
  projects: demoProjects,
  scopes: ['content:write', 'publish:write', 'connections:write', 'analytics:read'],
  onboardingComplete: true,
};

export const demoConnections: readonly ConnectionView[] = [
  {
    id: 'conn_demo00000000000000001',
    workspaceId: 'ws_demo0000000000000000001',
    provider: 'x',
    accountType: 'personal_profile',
    displayName: 'Example Studio',
    handle: '@example_studio',
    avatarUrl: null,
    health: 'healthy',
    connectedAt: at(-63 * DAY),
    connectedByName: 'Ana Ruiz',
    expiresAt: null,
    lastPublishedAt: at(-5 * HOUR),
    lastAnalyticsSyncAt: at(-58),
    capabilitySnapshotVersion: '14',
    grantedScopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
  },
  {
    id: 'conn_demo00000000000000002',
    workspaceId: 'ws_demo0000000000000000001',
    provider: 'linkedin',
    accountType: 'organization',
    displayName: 'Example Studio EU',
    handle: null,
    avatarUrl: null,
    health: 'expiring_soon',
    connectedAt: at(-154 * DAY),
    connectedByName: 'Dana Ito',
    expiresAt: at(2 * DAY),
    lastPublishedAt: at(-2 * DAY),
    lastAnalyticsSyncAt: at(-3 * HOUR),
    capabilitySnapshotVersion: '14',
    grantedScopes: ['w_member_social', 'openid'],
  },
  {
    id: 'conn_demo00000000000000003',
    workspaceId: 'ws_demo0000000000000000001',
    provider: 'instagram',
    accountType: 'business_profile',
    displayName: 'example.studio',
    handle: '@example.studio',
    avatarUrl: null,
    health: 'healthy',
    connectedAt: at(-30 * DAY),
    connectedByName: 'Ana Ruiz',
    expiresAt: at(28 * DAY),
    lastPublishedAt: at(-DAY),
    lastAnalyticsSyncAt: at(-9 * HOUR),
    capabilitySnapshotVersion: '12',
    grantedScopes: ['instagram_content_publish', 'instagram_manage_insights', 'pages_show_list'],
  },
  {
    id: 'conn_demo00000000000000004',
    workspaceId: 'ws_demo0000000000000000001',
    provider: 'youtube',
    accountType: 'channel',
    displayName: 'Example Studio Channel',
    handle: null,
    avatarUrl: null,
    health: 'review_pending',
    connectedAt: at(-3 * DAY),
    connectedByName: 'Ana Ruiz',
    expiresAt: null,
    lastPublishedAt: null,
    lastAnalyticsSyncAt: null,
    capabilitySnapshotVersion: '9',
    // Never recorded for this account, so the permissions read as unknown.
    grantedScopes: null,
  },
];

export const demoActionItems: readonly ActionItemView[] = [
  {
    id: 'act_demo01',
    kind: 'connection_expiring',
    urgency: 'now',
    category: 'connections',
    subject: 'LinkedIn, Example Studio EU',
    provider: 'linkedin',
    createdAt: at(-4 * HOUR),
    dueAt: at(2 * DAY),
    snoozedUntil: null,
    href: '/connections/conn_demo00000000000000002',
    values: { account: 'Example Studio EU', date: at(2 * DAY) },
  },
  {
    id: 'act_demo02',
    kind: 'comment_failed',
    urgency: 'now',
    category: 'publishing',
    subject: 'X, @example_studio',
    provider: 'x',
    createdAt: at(-5 * HOUR),
    dueAt: null,
    snoozedUntil: null,
    href: '/posts/content_demo0000000000001',
    values: { account: '@example_studio' },
  },
  {
    id: 'act_demo03',
    kind: 'approval_overdue',
    urgency: 'soon',
    category: 'publishing',
    provider: 'linkedin',
    subject: 'Case study, Example Studio EU',
    createdAt: at(-26 * HOUR),
    dueAt: at(-2 * HOUR),
    snoozedUntil: null,
    href: '/approvals/approval_demo000000000001',
    values: { date: at(-2 * HOUR) },
  },
  {
    id: 'act_demo04',
    kind: 'analytics_stale',
    urgency: 'soon',
    category: 'publishing',
    provider: 'instagram',
    subject: 'Instagram, example.studio',
    createdAt: at(-9 * HOUR),
    dueAt: null,
    snoozedUntil: null,
    href: '/analytics?account=conn_demo00000000000000003',
    values: { account: 'example.studio', date: at(-9 * HOUR) },
  },
  {
    id: 'act_demo05',
    kind: 'rss_stalled',
    urgency: 'watching',
    category: 'automation',
    provider: null,
    subject: 'Feed, Example Studio blog',
    createdAt: at(-14 * DAY),
    dueAt: null,
    snoozedUntil: null,
    href: '/automation/rss/rss_demo0000000000000001',
    values: { name: 'Example Studio blog', date: at(-14 * DAY) },
  },
  {
    id: 'act_demo06',
    kind: 'webhook_failing',
    urgency: 'watching',
    category: 'automation',
    provider: null,
    subject: 'Endpoint, hooks.example-studio.test',
    createdAt: at(-2 * HOUR),
    dueAt: null,
    snoozedUntil: null,
    href: '/settings/webhooks',
    values: { endpoint: 'hooks.example-studio.test', count: 3 },
  },
];

export const demoCalendar: readonly CalendarEntryView[] = [
  {
    publishJobId: 'job_demo_calendar_1',
    contentItemId: 'content_demo0000000000002',
    projectId: 'project_demo00000000000000001',
    connectionId: 'conn_demo00000000000000001',
    title: 'Scheduled first comments, what shipped',
    scheduledAt: at(3 * HOUR),
    timeZone: 'Europe/Berlin',
    state: 'scheduled',
    approvalState: 'approved',
    provider: 'x',
    accountLabel: '@example_studio',
    targetCount: 1,
    mediaKind: 'text',
  },
  {
    publishJobId: 'job_demo_calendar_2',
    contentItemId: 'content_demo0000000000003',
    projectId: 'project_demo00000000000000001',
    connectionId: 'conn_demo00000000000000002',
    title: 'Case study, migrating a 40 account workspace',
    scheduledAt: at(7 * HOUR),
    timeZone: 'Europe/Berlin',
    state: 'approval_requested',
    approvalState: 'requested',
    provider: 'linkedin',
    accountLabel: 'Example Studio EU',
    targetCount: 1,
    mediaKind: 'document',
  },
  {
    publishJobId: 'job_demo_calendar_3',
    contentItemId: 'content_demo0000000000004',
    projectId: 'project_demo00000000000000001',
    connectionId: 'conn_demo00000000000000003',
    title: 'Reel, setting up an approval policy',
    scheduledAt: at(13 * HOUR),
    timeZone: 'Europe/Berlin',
    state: 'preparing_media',
    approvalState: 'approved',
    provider: 'instagram',
    accountLabel: 'example.studio',
    targetCount: 1,
    mediaKind: 'video',
  },
  {
    publishJobId: null,
    contentItemId: 'content_demo0000000000005',
    projectId: 'project_demo00000000000000001',
    connectionId: 'conn_demo00000000000000001',
    title: 'Weekly roundup',
    scheduledAt: at(22 * HOUR),
    timeZone: 'Europe/Berlin',
    state: 'draft',
    approvalState: 'not_required',
    provider: 'x',
    accountLabel: '@example_studio',
    targetCount: 2,
    mediaKind: 'image',
  },
];

/** Job records behind calendar rows, used by the honest in-progress post view. */
export const demoPublishJobs: readonly PublishJobView[] = demoCalendar.flatMap(
  (entry, index): readonly PublishJobView[] => {
    if (!entry.publishJobId) return [];
    const connection = demoConnections.find((candidate) => candidate.provider === entry.provider);
    if (!connection) return [];

    return [
      {
        id: entry.publishJobId,
        workspaceId: 'ws_demo0000000000000000001',
        contentItemId: entry.contentItemId,
        contentVersionId: `cver_demo_calendar_${index + 1}`,
        postVariantId: `pv_demo_calendar_${index + 1}`,
        connectionId: connection.id,
        provider: entry.provider,
        state: entry.state,
        scheduledInstant: entry.scheduledAt,
        ianaTimeZone: entry.timeZone,
        idempotencyKey: `demo.calendar.${index + 1}`,
        workflowId: null,
        approvalRequired: entry.approvalState !== 'not_required',
        approvalState: entry.approvalState,
        attemptCount: entry.state === 'preparing_media' ? 1 : 0,
        lastErrorCode: null,
        createdVia: 'web',
        createdAt: at(-DAY),
        updatedAt: at(-5),
        canceledAt: null,
        hold: null,
      },
    ];
  },
);

export const demoApprovals: readonly ApprovalRequestView[] = [
  {
    id: 'approval_demo000000000001',
    contentItemId: 'content_demo0000000000003',
    contentVersionId: 'version_demo0000000000000001',
    policy: 'any_approver',
    state: 'requested',
    requestedBy: 'user_demo000000000000000001',
    assignedUserIds: ['user_demo000000000000000002'],
    note: 'Please check the migration figures and the LinkedIn wording before this goes out.',
    dueAt: at(3 * HOUR),
    resolvedAt: null,
    decisions: [],
    createdAt: at(-26 * HOUR),
  },
];

export const demoReceipts: readonly ReceiptSummaryView[] = [
  {
    receiptId: 'receipt_demo00000000000001',
    contentItemId: 'content_demo0000000000001',
    title: 'Launch thread',
    provider: 'x',
    accountLabel: '@example_studio',
    state: 'partially_published',
    publishedAt: at(-5 * HOUR),
    permalink: 'https://x.com/example_studio/status/1834000000000000221',
    failedItemCount: 1,
  },
  {
    receiptId: 'receipt_demo00000000000002',
    contentItemId: 'content_demo0000000000006',
    title: 'Connector capability update',
    provider: 'linkedin',
    accountLabel: 'Example Studio EU',
    state: 'published',
    publishedAt: at(-2 * DAY),
    permalink: 'https://www.linkedin.com/feed/update/urn:li:share:7000000000000000000',
    failedItemCount: 0,
  },
  {
    receiptId: 'receipt_demo00000000000003',
    contentItemId: 'content_demo0000000000007',
    title: 'Behind the schedule, three takes',
    provider: 'instagram',
    accountLabel: 'example.studio',
    state: 'published',
    publishedAt: at(-DAY),
    permalink: null,
    failedItemCount: 0,
  },
];

/**
 * Full immutable records behind the receipt summaries above.
 *
 * Demo mode is clearly labelled across the product shell, but its navigation
 * still has to be internally truthful. A summary that says a publication
 * partially succeeded must open the matching evidence, not an empty draft.
 */
export const demoPublicationReceipts: readonly PublicationReceipt[] = demoReceipts.map(
  (summary, index) => {
    const connection =
      summary.provider === 'x'
        ? demoConnections[0]
        : summary.provider === 'linkedin'
          ? demoConnections[1]
          : demoConnections[2];
    const publishedAt = summary.publishedAt ?? at(-(index + 1) * DAY);
    const dispatchedAt = new Date(new Date(publishedAt).getTime() - 2_000).toISOString();
    const scheduledInstant = new Date(new Date(publishedAt).getTime() - 10 * 60_000).toISOString();
    const jobId = `job_demo_receipt_${index + 1}`;
    const externalPostId = `demo-${summary.provider}-post-${index + 1}`;

    return {
      id: summary.receiptId,
      workspaceId: 'ws_demo0000000000000000001',
      publishJobId: jobId,
      provider: summary.provider,
      accountType: connection?.accountType ?? 'personal_profile',
      connectionId: connection?.id ?? 'conn_demo00000000000000001',
      externalAccountId: `demo-${summary.provider}-account`,
      externalPostId,
      permalink: summary.permalink,
      contentVersionId: `version_demo_receipt_${index + 1}`,
      contentVersionChecksum: String(index + 1).repeat(64),
      capabilityVersion: connection?.capabilitySnapshotVersion ?? '1',
      scheduledLocalTime: localDateTimeAt(scheduledInstant, 'Europe/Berlin'),
      ianaTimeZone: 'Europe/Berlin',
      scheduledInstant,
      dispatchedAt,
      publishedAt,
      creationSurface: 'web',
      approval: {
        state: 'not_required',
        approvalId: null,
        decidedBy: null,
        decidedAt: null,
        policyKey: null,
      },
      cost: null,
      attempts: [
        {
          id: `attempt_demo_receipt_${index + 1}`,
          publishJobId: jobId,
          attemptNumber: 1,
          startedAt: dispatchedAt,
          finishedAt: publishedAt,
          resultState: 'published',
          errorClass: null,
          errorCode: null,
          retryable: false,
          nextRetryAt: null,
          providerRequestId: `demo-request-${index + 1}`,
          httpStatus: 201,
          sanitizedResponse: { accepted: true },
        },
      ],
      sanitizedProviderResponse: { accepted: true, externalPostId },
      root: {
        kind: 'root',
        order: 0,
        threadItemId: null,
        state: 'published',
        externalPostId,
        permalink: summary.permalink,
        delaySeconds: 0,
        publishedAt,
        errorCode: null,
      },
      items:
        summary.failedItemCount > 0
          ? [
              {
                kind: 'comment',
                order: 0,
                threadItemId: `comment_demo_receipt_${index + 1}`,
                state: 'failed_permanently',
                externalPostId: null,
                permalink: null,
                delaySeconds: 300,
                publishedAt: null,
                errorCode: 'CONTENT_INVALID',
              },
            ]
          : [],
      lastAnalyticsSyncAt: null,
      createdAt: publishedAt,
    } satisfies PublicationReceipt;
  },
);

export const demoBilling: BillingStateView = {
  status: 'none',
  interval: null,
  trialEndsAt: null,
  firstChargeAt: null,
  firstChargeAmount: null,
  renewalAmount: null,
  portalUrl: null,
  activeChannelCount: 4,
  channelLimit: 10,
};

export const demoUsage: UsageView = {
  periodStart: at(-11 * DAY),
  total: { currency: 'USD', amountMinor: 142 },
  lines: [
    {
      provider: 'x',
      operation: 'post_create',
      count: 38,
      unitAmount: { currency: 'USD', amountMinor: 2 },
      amount: { currency: 'USD', amountMinor: 57 },
    },
    {
      provider: 'x',
      operation: 'post_create_with_url',
      count: 4,
      unitAmount: { currency: 'USD', amountMinor: 20 },
      amount: { currency: 'USD', amountMinor: 80 },
    },
  ],
};

export const demoGrowthPlan: GrowthPlanSummaryView = {
  planId: 'plan_demo00000000000000001',
  version: 3,
  approvedAt: at(-7 * DAY),
  currentWeek: 2,
  totalWeeks: 4,
  undraftedBriefCount: 5,
  profileComplete: true,
};

export const demoMembers: readonly MemberView[] = [
  {
    id: 'user_demo000000000000000001',
    userId: 'user_demo000000000000000001',
    name: 'Ana Ruiz',
    email: 'ana@example-studio.test',
    role: 'owner',
    invitePending: false,
    projectScope: [],
    invitedAt: null,
  },
  {
    id: 'user_demo000000000000000002',
    userId: 'user_demo000000000000000002',
    name: 'Dana Ito',
    email: 'dana@example-studio.test',
    role: 'approver',
    invitePending: false,
    projectScope: [],
    invitedAt: null,
  },
  {
    id: 'user_demo000000000000000003',
    userId: null,
    name: 'Sam Okafor',
    email: 'sam@example-studio.test',
    role: 'editor',
    invitePending: true,
    projectScope: [],
    invitedAt: at(-2 * DAY),
  },
];

export const demoAudit: readonly AuditEventView[] = [
  {
    id: 'aud_demo01',
    at: at(-5 * HOUR),
    actorName: 'Post Array',
    surface: 'web',
    action: 'post.published',
    subject: 'Launch thread',
  },
  {
    id: 'aud_demo02',
    at: at(-26 * HOUR),
    actorName: 'Ana Ruiz',
    surface: 'web',
    action: 'approval.requested',
    subject: 'Case study',
  },
];

export const demoHealth: HealthView = {
  api: 'operational',
  connectors: [
    { provider: 'x', state: 'operational', since: null },
    { provider: 'linkedin', state: 'operational', since: null },
    { provider: 'instagram', state: 'degraded', since: at(-9 * HOUR) },
    { provider: 'youtube', state: 'operational', since: null },
  ],
  checkedAt: at(0),
};

export const demoOnboardingState: OnboardingStateView = {
  checkoutConfirmed: false,
  workspaceNamed: false,
  useCase: null,
  connectionCount: 0,
  firstPostScheduled: false,
  firstReceiptId: null,
  completedSteps: [],
  complete: false,
};
