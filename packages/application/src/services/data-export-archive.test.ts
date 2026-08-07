import type { Db } from '../internal/runtime';
import { describe, expect, it, vi } from 'vitest';

import { readDataExportArchive } from './data-export-archive';

const at = new Date('2026-08-07T00:00:00.000Z');

function database(): Db {
  const user = { id: 'user_1', email: 'member@example.test', displayName: 'Member' };
  return {
    workspace: {
      findFirst: vi.fn().mockResolvedValue({
        id: 'ws_1',
        name: 'Workspace',
        slug: 'workspace',
        ownerUserId: 'user_1',
        status: 'active',
        defaultLocale: 'en',
        defaultTimeZone: 'UTC',
        contentLocales: ['en'],
        markets: ['US'],
        weekStart: 1,
        hourCycle: 'h23',
        createdAt: at,
        updatedAt: at,
        accessTokenCiphertext: 'must-not-export',
      }),
    },
    membership: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'membership_1',
          userId: user.id,
          role: 'owner',
          state: 'active',
          brandScope: [],
          invitedAt: null,
          acceptedAt: at,
          removedAt: null,
          createdAt: at,
          updatedAt: at,
          user,
        },
      ]),
    },
    brand: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'brand_1',
          name: 'Brand',
          slug: 'brand',
          voice: 'Direct',
          audience: 'Teams',
          approvedClaims: [],
          blockedTerms: [],
          domains: [],
          defaultTimeZone: 'UTC',
          archivedAt: null,
          createdAt: at,
          updatedAt: at,
        },
      ]),
    },
    campaign: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'campaign_1',
          brandId: 'brand_1',
          name: 'Launch',
          objective: 'announce',
          tags: [],
          startsAt: at,
          endsAt: null,
          archivedAt: null,
          createdAt: at,
          updatedAt: at,
        },
      ]),
    },
    contentItem: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'item_1',
          brandId: 'brand_1',
          campaignId: 'campaign_1',
          title: 'Post',
          brief: 'Brief',
          state: 'draft',
          approvalPolicy: 'single_approver',
          currentVersionId: 'version_1',
          approvedVersionId: null,
          scheduledAt: null,
          scheduledTimeZone: null,
          approvedAt: null,
          publishedAt: null,
          canceledAt: null,
          repeatEveryDays: null,
          repeatUntil: null,
          repeatCount: null,
          repeatOfItemId: null,
          surface: 'web',
          creationMethod: 'manual',
          createdByUserId: 'user_1',
          createdAt: at,
          updatedAt: at,
        },
      ]),
    },
    contentVersion: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'version_1',
          contentItemId: 'item_1',
          version: 1,
          body: 'Keep this text',
          contentHash: 'a'.repeat(64),
          locale: 'en',
          creationMethod: 'manual',
          sourceIds: [],
          createdByUserId: 'user_1',
          createdAt: at,
          payload: { secret: 'must-not-export' },
        },
      ]),
    },
    postVariant: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'variant_1',
          contentItemId: 'item_1',
          contentVersionId: 'version_1',
          connectionId: 'connection_1',
          destinationId: 'destination_1',
          provider: 'linkedin',
          locale: 'en',
          body: 'Keep this variant',
          mediaAssetIds: [],
          signatureId: 'signature_1',
          inheritedFields: [],
          overriddenFields: [],
          state: 'ready',
          capabilitySnapshotVersion: 'linkedin-v1',
          createdAt: at,
          updatedAt: at,
          settings: { secret: 'must-not-export' },
        },
      ]),
    },
    socialConnection: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'connection_1',
          brandId: 'brand_1',
          provider: 'linkedin',
          accountType: 'organization',
          displayName: 'Relay',
          handle: '@relay',
          avatarUrl: null,
          profileUrl: null,
          status: 'connected',
          statusReason: null,
          grantedScopes: ['openid'],
          capabilityVersion: 'linkedin-v1',
          capabilitiesRefreshedAt: at,
          connectedAt: at,
          disconnectedAt: null,
          createdAt: at,
          updatedAt: at,
          externalAccountId: 'must-not-export',
        },
      ]),
    },
    mediaAsset: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'media_1',
          brandId: 'brand_1',
          kind: 'image',
          mimeType: 'image/png',
          byteSize: 12n,
          checksumSha256: 'b'.repeat(64),
          width: 10,
          height: 10,
          durationMs: null,
          altText: 'Alt',
          rights: 'owned',
          originKind: 'upload',
          originUrl: null,
          scanState: 'clean',
          retentionExpiresAt: at,
          storageDeletedAt: null,
          deletedAt: null,
          createdAt: at,
          updatedAt: at,
          storageKey: 'must-not-export',
        },
      ]),
    },
    publishJob: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'job_1',
          contentItemId: 'item_1',
          contentVersionId: 'version_1',
          postVariantId: 'variant_1',
          connectionId: 'connection_1',
          approvalRequestId: null,
          approvalPolicy: 'single_approver',
          scheduledFor: at,
          scheduledTimeZone: 'UTC',
          state: 'published',
          attemptCount: 1,
          lastErrorClass: null,
          lastErrorCode: null,
          surface: 'web',
          dispatchedAt: at,
          completedAt: at,
          canceledAt: null,
          createdAt: at,
          updatedAt: at,
          idempotencyKey: 'must-not-export',
        },
      ]),
    },
    publicationReceipt: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'receipt_1',
          publishJobId: 'job_1',
          contentVersionId: 'version_1',
          connectionId: 'connection_1',
          provider: 'linkedin',
          externalPostId: 'post_1',
          permalink: 'https://example.test/post_1',
          contentHash: 'a'.repeat(64),
          mediaChecksums: [],
          publishedShortLinks: [],
          publishedAt: at,
          dispatchedAt: at,
          scheduledFor: at,
          scheduledTimeZone: 'UTC',
          surface: 'web',
          approvedByUserId: 'user_1',
          approvalPolicy: 'single_approver',
          costActualMinor: 0,
          costCurrency: 'USD',
          deletedExternallyAt: null,
          lastAnalyticsSyncAt: null,
          createdAt: at,
          responseEvidence: { secret: 'must-not-export' },
        },
      ]),
    },
    auditEvent: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'audit_1',
          actorType: 'user',
          actorId: 'user_1',
          surface: 'web',
          action: 'content.created',
          targetType: 'content_item',
          targetId: 'item_1',
          beforeHash: null,
          afterHash: 'c'.repeat(64),
          correlationId: 'corr_1',
          createdAt: at,
          metadata: { secret: 'must-not-export' },
        },
      ]),
    },
  } as unknown as Db;
}

describe('readDataExportArchive', () => {
  it('returns deterministic portable data without credentials or provider evidence', async () => {
    const archive = await readDataExportArchive(database(), {
      workspaceId: 'ws_1',
      exportId: 'export_1',
      generatedAt: at.toISOString(),
    });
    const serialized = JSON.stringify(archive);

    expect(serialized).toContain('Keep this text');
    expect(serialized).toContain('post_1');
    expect(serialized).toContain('content.created');
    expect(serialized).not.toContain('must-not-export');
    expect(serialized).not.toContain('accessTokenCiphertext');
    expect(serialized).not.toContain('storageKey');
    expect(serialized).not.toContain('responseEvidence');
    expect(serialized).not.toContain('externalAccountId');
    expect(serialized).not.toContain('idempotencyKey');
    expect(serialized).not.toContain('metadata');
  });
});
