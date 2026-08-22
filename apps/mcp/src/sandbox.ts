import { createHash, randomUUID } from 'node:crypto';

import {
  NOT_IMPLEMENTED_CONTENT_KINDS,
  RelayError,
  capabilitySnapshotSchema,
  validationResult,
} from '@relay/contracts';
import type {
  CapabilitySnapshot,
  GrowthPlan,
  OpportunityRecord,
  ValidationResult,
} from '@relay/contracts';

import type {
  ActorContextLike,
  ApprovalRequestSummary,
  AuditRecordInput,
  AuditSink,
  CalendarEntrySummary,
  ConnectionSummary,
  ContentItemSummary,
  CreateDraftInputLike,
  MediaAssetSummary,
  MetricObservationSummary,
  OperationRefLike,
  PageLike,
  PreviewSummary,
  PublishJobSummary,
  ReceiptDetailSummary,
  ReceiptRowSummary,
  ReceiptSummary,
  RelayServicePort,
  ScheduleSpecLike,
} from './ports';

/**
 * Sandbox mode.
 *
 * A complete, in-memory implementation of the same port the real services
 * satisfy, backed by the `fake` provider. It exists so a developer can wire an
 * agent to this server, run every tool including the consequential ones, and
 * see receipts, without a single request reaching a real platform.
 *
 * The rules are not relaxed here. Sandbox mode still requires the scope, still
 * requires the idempotency key, and `publish_post` still requires a human
 * confirmation. A sandbox that is easier than production teaches an agent the
 * wrong habits and hides exactly the failures worth finding early.
 */

const FAKE_PROVIDER = 'fake';
export const SANDBOX_PROJECT_ID = 'project_sandbox';

export function fakeCapabilitySnapshot(
  connectionId: string,
  observedAt: string,
): CapabilitySnapshot {
  return capabilitySnapshotSchema.parse({
    capabilityVersion: 'fake@2026-08-04',
    observedAt,
    provider: FAKE_PROVIDER,
    accountType: 'business_profile',
    connectionId,
    text: {
      maxLength: 280,
      minLength: 1,
      supportsMarkdown: false,
      linkCounting: { mode: 'fixed', charactersPerLink: 23 },
    },
    media: {
      maxImages: 4,
      maxVideos: 1,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'video/mp4'],
      maxBytesByKind: {
        image: 5_242_880,
        video: 536_870_912,
        gif: 15_728_640,
        document: null,
        audio: null,
      },
      aspectRatios: { min: 0.5, max: 2, recommended: [1, 1.777] },
      maxDurationSeconds: 140,
      minDurationSeconds: 1,
      requiresThumbnail: false,
      altText: 'supported',
      maxAltTextLength: 1000,
    },
    contentKinds: {
      ...NOT_IMPLEMENTED_CONTENT_KINDS,
      text: 'supported',
      image: 'supported',
      thread: 'supported',
      video: 'unsupported',
    },
    destinations: [{ kind: 'none', support: 'supported', searchable: false }],
    mentions: { support: 'supported', resolvesToExternalId: true, maxMentions: 10 },
    firstComment: { support: 'supported', maxItems: 1, minDelaySeconds: 30 },
    threads: { support: 'supported', maxItems: 25, minDelaySeconds: 0 },
    scheduling: { providerNative: 'unsupported', maxLookAheadDays: 365, minLeadSeconds: 60 },
    privacy: {
      support: 'supported',
      mustBeExplicit: false,
      options: [{ value: 'public', labelKey: 'composer.privacy.public', isDefault: true }],
    },
    disclosure: {
      aiLabel: 'supported',
      commercialContent: 'supported',
      brandedContent: 'not_implemented',
    },
    analytics: {
      support: 'supported',
      postMetrics: ['impressions', 'likes', 'comments', 'shares'],
      accountMetrics: ['follower_delta', 'profile_views'],
      historyWindowDays: 90,
    },
    deletion: { support: 'supported', windowSeconds: null },
    drafts: { support: 'not_implemented' },
    rateLimit: { windowSeconds: 900, maxRequests: 300 },
    cost: { currency: 'USD', perCreateMinor: 2, perUrlCreateMinor: 20 },
  });
}

interface SandboxState {
  readonly connections: ConnectionSummary[];
  readonly contentItems: Map<string, ContentItemSummary>;
  readonly jobs: Map<string, PublishJobSummary>;
  readonly receipts: Map<string, ReceiptSummary[]>;
  readonly media: Map<string, MediaAssetSummary>;
  readonly auditLog: AuditRecordInput[];
}

export interface SandboxOptions {
  readonly clock: { now(): number };
  readonly workspaceId: string;
  readonly connectionCount?: number;
}

export interface SandboxServices extends RelayServicePort {
  /** The audit sink to hand the dispatcher in sandbox mode. */
  readonly auditSink: AuditSink;
  /** Everything the sandbox recorded. Used by tests and by the dry-run screen. */
  readonly auditLog: readonly AuditRecordInput[];
  readonly state: { readonly jobCount: number; readonly receiptCount: number };
}

function iso(epochMs: number): string {
  return new globalThis.Date(epochMs).toISOString();
}

function notFound(reason: string): RelayError {
  return new RelayError('NOT_FOUND', {
    messageKey: 'error.not_found.message',
    details: { reason },
  });
}

export function createSandboxServices(options: SandboxOptions): SandboxServices {
  const connectionCount = options.connectionCount ?? 2;
  const state: SandboxState = {
    connections: Array.from({ length: connectionCount }, (_, index) => ({
      id: `conn_sandbox_${index + 1}`,
      projectId: SANDBOX_PROJECT_ID,
      provider: FAKE_PROVIDER,
      accountType: 'business_profile' as const,
      displayName: `Sandbox account ${index + 1}`,
      handle: `sandbox${index + 1}`,
      health: 'connected',
      statusMessageKey: null,
      capabilityVersion: 'fake@2026-08-04',
    })),
    contentItems: new Map(),
    jobs: new Map(),
    receipts: new Map(),
    media: new Map(),
    auditLog: [],
  };

  const firstConnectionOf = (contentItemId: string): string =>
    state.contentItems.get(contentItemId)?.variants[0]?.connectionId ?? 'conn_sandbox_1';

  const assertWorkspace = (ctx: ActorContextLike): void => {
    if (ctx.workspaceId !== options.workspaceId) {
      throw new RelayError('WORKSPACE_NOT_FOUND', {
        messageKey: 'error.workspace_not_found.message',
        details: { reason: 'SANDBOX_WORKSPACE_MISMATCH' },
      });
    }
  };

  const makeReceipt = (now: number): ReceiptSummary => ({
    id: `receipt_${randomUUID().replace(/-/g, '').slice(0, 20)}`,
    externalPostId: `fake-post-${randomUUID().slice(0, 8)}`,
    permalink: `https://fake.invalid/posts/${randomUUID().slice(0, 8)}`,
    publishedAt: iso(now),
  });

  const observation = (
    name: MetricObservationSummary['normalizedName'],
    value: number | null,
    availability: MetricObservationSummary['availability'],
    now: number,
  ): MetricObservationSummary => ({
    normalizedName: name,
    provider: FAKE_PROVIDER,
    providerField: `fake_${name}`,
    providerDefinition: `The fake provider's own definition of ${name}.`,
    scope: 'post',
    value,
    unit: 'count',
    availability,
    observedAt: iso(now),
    freshnessSeconds: 60,
    derivationRestricted: false,
  });

  return {
    get auditLog(): readonly AuditRecordInput[] {
      return state.auditLog;
    },
    get state(): { readonly jobCount: number; readonly receiptCount: number } {
      return { jobCount: state.jobs.size, receiptCount: state.receipts.size };
    },

    connections: {
      async list(ctx, input): Promise<PageLike<ConnectionSummary>> {
        assertWorkspace(ctx);
        const limit = input?.limit ?? 10;
        const data = state.connections.slice(0, limit);
        return {
          data,
          pageInfo: { nextCursor: null, hasMore: state.connections.length > limit, limit },
        };
      },
      async getCapabilities(ctx, connectionId): Promise<CapabilitySnapshot> {
        assertWorkspace(ctx);
        if (!state.connections.some((connection) => connection.id === connectionId)) {
          throw notFound('CONNECTION_NOT_FOUND');
        }
        return fakeCapabilitySnapshot(connectionId, iso(options.clock.now()));
      },
    },

    content: {
      async createDraft(ctx, input: CreateDraftInputLike): Promise<ContentItemSummary> {
        assertWorkspace(ctx);
        const id = `content_${randomUUID().replace(/-/g, '').slice(0, 20)}`;
        const item: ContentItemSummary = {
          id,
          projectId: input.projectId,
          state: 'draft',
          approvalState: 'not_required',
          title: input.title ?? null,
          locale: input.locale ?? 'en',
          contentKind: input.contentKind ?? 'text',
          reapprovalRequired: false,
          currentChecksum: createHash('sha256').update(input.body).digest('hex'),
          variants: (input.targets ?? []).map((target) => ({
            connectionId: target.connectionId,
            provider: FAKE_PROVIDER,
            accountType: 'business_profile' as const,
          })),
          updatedAt: iso(options.clock.now()),
        };
        state.contentItems.set(id, item);
        return item;
      },
      async get(ctx, contentItemId): Promise<ContentItemSummary> {
        assertWorkspace(ctx);
        const item = state.contentItems.get(contentItemId);
        if (item === undefined) {
          throw notFound('CONTENT_ITEM_NOT_FOUND');
        }
        return item;
      },
      async preview(ctx, input): Promise<PreviewSummary> {
        assertWorkspace(ctx);
        const item = state.contentItems.get(input.contentItemId);
        if (item === undefined) {
          throw notFound('CONTENT_ITEM_NOT_FOUND');
        }
        const body = `Sandbox preview for ${item.id}`;
        return {
          contentItemId: item.id,
          targetId: input.targetId,
          provider: FAKE_PROVIDER,
          displayName: 'Sandbox account',
          handle: 'sandbox1',
          body,
          contentKind: item.contentKind,
          characterCount: body.length,
          characterLimit: 280,
          truncated: false,
          media: [],
          threadItems: [],
        };
      },
    },

    validation: {
      async validate(ctx, input): Promise<ValidationResult> {
        assertWorkspace(ctx);
        if (!state.contentItems.has(input.contentItemId)) {
          throw notFound('CONTENT_ITEM_NOT_FOUND');
        }
        const item = state.contentItems.get(input.contentItemId);
        return validationResult({
          issues: [],
          estimatedCostMinor: (item?.variants.length ?? 0) * 2,
          currency: 'USD',
        });
      },
    },

    approvals: {
      async request(ctx, input): Promise<ApprovalRequestSummary> {
        assertWorkspace(ctx);
        if (!state.contentItems.has(input.contentItemId)) {
          throw notFound('CONTENT_ITEM_NOT_FOUND');
        }
        return {
          id: `approval_${randomUUID().replace(/-/g, '').slice(0, 20)}`,
          contentItemId: input.contentItemId,
          state: 'requested',
          assignedUserIds: [...(input.approverIds ?? [])],
          createdAt: iso(options.clock.now()),
        };
      },
    },

    scheduling: {
      async schedule(
        ctx,
        input: { contentItemId: string; scheduleSpec: ScheduleSpecLike },
      ): Promise<PublishJobSummary> {
        assertWorkspace(ctx);
        if (!state.contentItems.has(input.contentItemId)) {
          throw notFound('CONTENT_ITEM_NOT_FOUND');
        }
        const connectionId = firstConnectionOf(input.contentItemId);
        const job: PublishJobSummary = {
          id: `job_${randomUUID().replace(/-/g, '').slice(0, 20)}`,
          contentItemId: input.contentItemId,
          connectionId,
          provider: FAKE_PROVIDER,
          state: 'scheduled',
          scheduledInstant: input.scheduleSpec.instant,
          ianaTimeZone: input.scheduleSpec.ianaTimeZone,
          approvalRequired: false,
          approvalState: 'not_required',
          attemptCount: 0,
          lastErrorCode: null,
        };
        state.jobs.set(job.id, job);
        return job;
      },
      async cancel(ctx, input): Promise<PublishJobSummary> {
        assertWorkspace(ctx);
        const job = state.jobs.get(input.jobId);
        if (job === undefined) {
          throw notFound('JOB_NOT_FOUND');
        }
        const cancelled: PublishJobSummary = { ...job, state: 'canceled' };
        state.jobs.set(job.id, cancelled);
        return cancelled;
      },
      async getCalendar(ctx, input): Promise<PageLike<CalendarEntrySummary>> {
        assertWorkspace(ctx);
        const entries = [...state.jobs.values()]
          .filter((job) => job.scheduledInstant >= input.from && job.scheduledInstant <= input.to)
          .map((job) => ({
            jobId: job.id,
            contentItemId: job.contentItemId,
            connectionId: job.connectionId,
            provider: job.provider,
            state: job.state,
            instant: job.scheduledInstant,
            ianaTimeZone: job.ianaTimeZone,
            title: state.contentItems.get(job.contentItemId)?.title ?? null,
            approvalRequired: job.approvalRequired,
          }));
        return { data: entries, pageInfo: { nextCursor: null, hasMore: false, limit: 10 } };
      },
    },

    publishing: {
      async publishNow(ctx, input): Promise<PublishJobSummary> {
        assertWorkspace(ctx);
        if (!state.contentItems.has(input.contentItemId)) {
          throw notFound('CONTENT_ITEM_NOT_FOUND');
        }
        const now = options.clock.now();
        const job: PublishJobSummary = {
          id: `job_${randomUUID().replace(/-/g, '').slice(0, 20)}`,
          contentItemId: input.contentItemId,
          connectionId: firstConnectionOf(input.contentItemId),
          provider: FAKE_PROVIDER,
          state: 'published',
          scheduledInstant: iso(now),
          ianaTimeZone: 'UTC',
          approvalRequired: true,
          approvalState: 'approved',
          attemptCount: 1,
          lastErrorCode: null,
        };
        state.jobs.set(job.id, job);
        state.receipts.set(job.id, [makeReceipt(now)]);
        return job;
      },
      async getJob(ctx, jobId): Promise<PublishJobSummary> {
        assertWorkspace(ctx);
        const job = state.jobs.get(jobId);
        if (job === undefined) {
          throw notFound('JOB_NOT_FOUND');
        }
        return job;
      },
    },

    receipts: {
      async listForJob(ctx, jobId): Promise<readonly ReceiptSummary[]> {
        assertWorkspace(ctx);
        return state.receipts.get(jobId) ?? [];
      },
      async get(ctx, receiptId): Promise<ReceiptDetailSummary> {
        assertWorkspace(ctx);
        for (const [jobId, receipts] of state.receipts) {
          const match = receipts.find((receipt) => receipt.id === receiptId);
          if (match !== undefined) {
            return {
              id: match.id,
              publishJobId: jobId,
              connectionId: state.jobs.get(jobId)?.connectionId ?? 'conn_sandbox_1',
              provider: FAKE_PROVIDER,
              externalPostId: match.externalPostId,
              permalink: match.permalink,
              contentVersionChecksum: createHash('sha256').update(match.id).digest('hex'),
              scheduledInstant: match.publishedAt,
              publishedAt: match.publishedAt,
            };
          }
        }
        throw notFound('RECEIPT_NOT_FOUND');
      },
      async listRecent(ctx, input): Promise<PageLike<ReceiptRowSummary>> {
        assertWorkspace(ctx);
        const limit = input?.limit ?? 10;
        const rows: ReceiptRowSummary[] = [];
        for (const [jobId, receipts] of state.receipts) {
          for (const receipt of receipts) {
            rows.push({
              receiptId: receipt.id,
              contentItemId: state.jobs.get(jobId)?.contentItemId ?? jobId,
              provider: FAKE_PROVIDER,
              accountLabel: 'Sandbox account 1',
              state: 'published',
              publishedAt: receipt.publishedAt,
              permalink: receipt.permalink,
              failedItemCount: 0,
            });
          }
        }
        rows.reverse();
        const data = rows.slice(0, limit);
        return { data, pageInfo: { nextCursor: null, hasMore: rows.length > limit, limit } };
      },
    },

    media: {
      async importFromUrl(ctx, input): Promise<OperationRefLike> {
        assertWorkspace(ctx);
        // The sandbox never performs a network fetch. It records the asset the
        // real service would have created, so an agent can rehearse the
        // import-then-poll sequence without a byte leaving the process.
        const id = `media_${randomUUID().replace(/-/g, '').slice(0, 20)}`;
        const now = options.clock.now();
        state.media.set(id, {
          id,
          projectId: input.projectId ?? SANDBOX_PROJECT_ID,
          kind: 'image',
          mimeType: 'image/png',
          byteSize: 1024,
          width: 64,
          height: 64,
          durationMs: null,
          fileName: 'sandbox-import.png',
          altText: null,
          scanState: 'clean',
          originKind: 'url_import',
          originUrl: input.url,
          retentionExpiresAt: iso(now + 30 * 86_400_000),
          storageAvailable: true,
          createdAt: iso(now),
        });
        return {
          operationId: `op_${randomUUID().replace(/-/g, '').slice(0, 20)}`,
          status: 'succeeded',
          resourceType: 'media_asset',
          resourceId: id,
        };
      },
      async get(ctx, mediaId): Promise<MediaAssetSummary> {
        assertWorkspace(ctx);
        const asset = state.media.get(mediaId);
        if (asset === undefined) {
          throw notFound('MEDIA_NOT_FOUND');
        }
        return asset;
      },
      async list(ctx, input): Promise<PageLike<MediaAssetSummary>> {
        assertWorkspace(ctx);
        const limit = input?.limit ?? 10;
        const all = [...state.media.values()].reverse();
        const filtered =
          input?.projectId === undefined
            ? all
            : all.filter((asset) => asset.projectId === input.projectId);
        return {
          data: filtered.slice(0, limit),
          pageInfo: { nextCursor: null, hasMore: filtered.length > limit, limit },
        };
      },
    },

    analytics: {
      async getPostMetrics(ctx): Promise<readonly MetricObservationSummary[]> {
        assertWorkspace(ctx);
        const now = options.clock.now();
        return [
          observation('impressions', 1234, 'available', now),
          observation('likes', 42, 'available', now),
          // Deliberately unavailable: a metric we cannot read is never a zero.
          observation('shares', null, 'unavailable_permission', now),
        ];
      },
      async getAccountMetrics(ctx): Promise<readonly MetricObservationSummary[]> {
        assertWorkspace(ctx);
        const now = options.clock.now();
        return [
          { ...observation('follower_delta', 12, 'available', now), scope: 'account' },
          { ...observation('profile_views', null, 'unavailable_provider', now), scope: 'account' },
        ];
      },
    },

    growth: {
      async getPlan(): Promise<GrowthPlan> {
        throw new RelayError('CAPABILITY_NOT_IMPLEMENTED', {
          messageKey: 'error.not_implemented.message',
          details: { reason: 'SANDBOX_HAS_NO_SEEDED_PLAN' },
        });
      },
      async generatePlan(ctx): Promise<OperationRefLike> {
        assertWorkspace(ctx);
        return {
          operationId: `op_${randomUUID().replace(/-/g, '').slice(0, 20)}`,
          status: 'queued',
          resourceType: 'growth_plan',
          resourceId: null,
        };
      },
      async createDraftFromItem(ctx): Promise<ContentItemSummary> {
        assertWorkspace(ctx);
        const id = `content_${randomUUID().replace(/-/g, '').slice(0, 20)}`;
        const item: ContentItemSummary = {
          id,
          projectId: SANDBOX_PROJECT_ID,
          state: 'draft',
          approvalState: 'not_required',
          title: 'Sandbox plan item',
          locale: 'en',
          contentKind: 'text',
          reapprovalRequired: false,
          currentChecksum: createHash('sha256').update('Sandbox plan item').digest('hex'),
          variants: [
            {
              connectionId: 'conn_sandbox_1',
              provider: FAKE_PROVIDER,
              accountType: 'business_profile',
            },
          ],
          updatedAt: iso(options.clock.now()),
        };
        state.contentItems.set(id, item);
        return item;
      },
      async listOpportunities(ctx): Promise<readonly OpportunityRecord[]> {
        assertWorkspace(ctx);
        // An empty catalog is the honest sandbox answer. Inventing a directory
        // URL here would teach an agent that this tool returns made-up links.
        return [];
      },
    },

    auditSink: {
      async record(input: AuditRecordInput): Promise<void> {
        state.auditLog.push(input);
      },
    },
  };
}
