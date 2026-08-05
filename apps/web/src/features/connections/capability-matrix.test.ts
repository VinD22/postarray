import { describe, expect, it } from 'vitest';
import type { CapabilitySnapshot } from '@relay/contracts';

import { buildCapabilityMatrix, strongest, supportFor } from './capability-matrix';
import {
  deriveHealth,
  missingPermissionCount,
  remediationAction,
  remediationKey,
  sortByUrgency,
} from './health';
import type { ConnectionRow } from './types';

function snapshot(overrides: Partial<CapabilitySnapshot> = {}): CapabilitySnapshot {
  return {
    capabilityVersion: 'v14',
    observedAt: '2026-08-06T08:00:00.000Z',
    provider: 'x',
    accountType: 'personal_profile',
    connectionId: 'conn_1',
    text: {
      maxLength: 280,
      minLength: 1,
      supportsMarkdown: false,
      linkCounting: { mode: 'fixed', charactersPerLink: 23 },
    },
    media: {
      maxImages: 4,
      maxVideos: 1,
      allowedMimeTypes: ['image/jpeg'],
      maxBytesByKind: {
        image: 5_000_000,
        video: 512_000_000,
        gif: 15_000_000,
        document: null,
        audio: null,
      },
      aspectRatios: { min: 0.5, max: 2, recommended: [1] },
      maxDurationSeconds: 140,
      minDurationSeconds: 1,
      requiresThumbnail: false,
      altText: 'supported',
      maxAltTextLength: 1000,
    },
    contentKinds: {
      text: 'supported',
      image: 'supported',
      carousel: 'unsupported',
      video: 'supported',
      short_video: 'not_implemented',
      long_video: 'unsupported',
      document: 'unsupported',
      thread: 'supported',
    },
    destinations: [
      { kind: 'none', support: 'supported', searchable: false },
      { kind: 'community', support: 'supported', searchable: true },
    ],
    mentions: { support: 'supported', resolvesToExternalId: true, maxMentions: 10 },
    firstComment: { support: 'supported', maxItems: 25, minDelaySeconds: 60 },
    threads: { support: 'supported', maxItems: 25, minDelaySeconds: 0 },
    scheduling: { providerNative: 'unsupported', maxLookAheadDays: 365, minLeadSeconds: 60 },
    privacy: { support: 'unsupported', mustBeExplicit: false, options: [] },
    disclosure: {
      aiLabel: 'not_implemented',
      commercialContent: 'unsupported',
      brandedContent: 'unsupported',
    },
    analytics: {
      support: 'supported',
      postMetrics: ['impressions'],
      accountMetrics: ['follower_delta'],
      historyWindowDays: 90,
    },
    deletion: { support: 'supported', windowSeconds: null },
    drafts: { support: 'not_implemented' },
    rateLimit: { windowSeconds: 900, maxRequests: 300 },
    cost: { currency: 'USD', perCreateMinor: 2, perUrlCreateMinor: 20 },
    ...overrides,
  };
}

describe('supportFor', () => {
  it('keeps "the provider does not offer it" separate from "we have not built it"', () => {
    const snap = snapshot();
    expect(supportFor(snap, 'carousel')).toBe('unsupported');
    expect(supportFor(snap, 'disclosure')).toBe('not_implemented');
    // Two different sentences, never merged into one "unavailable".
    expect(supportFor(snap, 'carousel')).not.toBe(supportFor(snap, 'disclosure'));
  });

  it('reads content kinds straight from the snapshot', () => {
    expect(supportFor(snapshot(), 'text')).toBe('supported');
    expect(supportFor(snapshot(), 'document')).toBe('unsupported');
  });

  it('reports destination support as the best available destination kind', () => {
    expect(supportFor(snapshot(), 'destinations')).toBe('supported');
    expect(
      supportFor(
        snapshot({ destinations: [{ kind: 'none', support: 'supported', searchable: false }] }),
        'destinations',
      ),
    ).toBe('unsupported');
  });

  it('surfaces a pending platform review rather than calling it unsupported', () => {
    expect(
      supportFor(
        snapshot({ analytics: { ...snapshot().analytics, support: 'requires_review' } }),
        'analytics',
      ),
    ).toBe('requires_review');
  });

  it('does not claim thumbnail support the adapter does not send', () => {
    expect(supportFor(snapshot(), 'thumbnail')).toBe('not_implemented');
    expect(
      supportFor(
        snapshot({ media: { ...snapshot().media, requiresThumbnail: true } }),
        'thumbnail',
      ),
    ).toBe('supported');
  });
});

describe('strongest', () => {
  it('ranks a provider limitation below anything on our side', () => {
    expect(strongest(['unsupported', 'not_implemented'])).toBe('not_implemented');
    expect(strongest(['not_implemented', 'requires_review'])).toBe('requires_review');
    expect(strongest(['requires_review', 'supported'])).toBe('supported');
    expect(strongest([])).toBe('unsupported');
  });
});

describe('buildCapabilityMatrix', () => {
  it('has one row per feature and one column per provider', () => {
    const matrix = buildCapabilityMatrix([
      snapshot(),
      snapshot({ provider: 'linkedin', connectionId: 'conn_2' }),
    ]);
    expect(matrix.providers).toEqual(['linkedin', 'x']);
    expect(matrix.rows.every((row) => row.cells.length === 2)).toBe(true);
    expect(matrix.rows.map((row) => row.feature)).toContain('altText');
  });

  it('keeps the newest snapshot when one provider has two connections', () => {
    const matrix = buildCapabilityMatrix([
      snapshot({
        observedAt: '2026-01-01T00:00:00.000Z',
        contentKinds: {
          ...snapshot().contentKinds,
          carousel: 'not_implemented',
        },
      }),
      snapshot({ observedAt: '2026-08-06T08:00:00.000Z' }),
    ]);
    const carousel = matrix.rows.find((row) => row.feature === 'carousel');
    expect(carousel?.cells[0]?.support).toBe('unsupported');
  });

  it('reports one connector version only when every snapshot agrees', () => {
    expect(
      buildCapabilityMatrix([snapshot(), snapshot({ provider: 'linkedin' })]).capabilityVersion,
    ).toBe('v14');
    expect(
      buildCapabilityMatrix([
        snapshot(),
        snapshot({ provider: 'linkedin', capabilityVersion: 'v15' }),
      ]).capabilityVersion,
    ).toBeNull();
  });

  it('reports the newest observation across the matrix', () => {
    const matrix = buildCapabilityMatrix([
      snapshot({ observedAt: '2026-08-01T00:00:00.000Z' }),
      snapshot({ provider: 'linkedin', observedAt: '2026-08-06T08:00:00.000Z' }),
    ]);
    expect(matrix.observedAt).toBe('2026-08-06T08:00:00.000Z');
  });

  it('is empty rather than invented when there are no snapshots', () => {
    const matrix = buildCapabilityMatrix([]);
    expect(matrix.providers).toEqual([]);
    expect(matrix.observedAt).toBeNull();
  });
});

describe('health', () => {
  const now = new Date('2026-08-06T00:00:00.000Z');

  it('never calls an unreadable expiry healthy', () => {
    expect(deriveHealth(null, now)).toBe('unknown');
    expect(deriveHealth('not-a-date', now)).toBe('unknown');
  });

  it('warns inside the expiry window and fails after it', () => {
    expect(deriveHealth('2026-08-07T00:00:00.000Z', now)).toBe('expiring_soon');
    expect(deriveHealth('2026-08-05T00:00:00.000Z', now)).toBe('expired');
    expect(deriveHealth('2026-09-06T00:00:00.000Z', now)).toBe('healthy');
  });

  it('gives Instagram the account type remediation rather than a bare reconnect', () => {
    expect(remediationKey('permission_missing', 'instagram')).toBe(
      'connection.incident.accountTypeInvalid',
    );
    expect(remediationKey('permission_missing', 'linkedin')).toBe(
      'connection.incident.permissionLost',
    );
  });

  it('has no remediation for a healthy account', () => {
    expect(remediationKey('healthy', 'x')).toBeNull();
    expect(remediationAction('healthy')).toBeNull();
  });

  it('offers resume rather than reconnect for a paused account', () => {
    expect(remediationAction('paused')).toBe('resume');
  });
});

describe('connection ordering', () => {
  function row(overrides: Partial<ConnectionRow>): ConnectionRow {
    return {
      id: 'conn_1',
      workspaceId: 'ws_1',
      provider: 'x',
      accountType: 'personal_profile',
      displayName: '@acme',
      handle: '@acme',
      avatarUrl: null,
      health: 'healthy',
      connectedAt: '2026-06-12T00:00:00.000Z',
      connectedByName: 'Ana Ruiz',
      expiresAt: null,
      lastPublishedAt: null,
      lastAnalyticsSyncAt: null,
      capabilitySnapshotVersion: 14,
      ...overrides,
    };
  }

  it('puts the accounts that need a person first', () => {
    const sorted = sortByUrgency([
      row({ id: 'a', health: 'healthy' }),
      row({ id: 'b', health: 'revoked' }),
      row({ id: 'c', health: 'expiring_soon' }),
      row({ id: 'd', health: 'paused' }),
    ]);
    expect(sorted.map((item) => item.id)).toEqual(['b', 'c', 'd', 'a']);
  });

  it('counts the permissions the provider has not granted', () => {
    expect(
      missingPermissionCount(
        row({
          permissions: [
            { scope: 'w_member_social', granted: true, purposeKey: 'x' },
            { scope: 'r_organization_social', granted: false, purposeKey: 'y' },
          ],
        }),
      ),
    ).toBe(1);
  });
});
