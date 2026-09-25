import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ActorContext, ServiceDeps } from '../types';

/**
 * A read-only member may see image checks that were already computed, and
 * may not cause a new analysis. `checks` reads the stored row under
 * media.read and only falls through to `analyze`, gated on media.write, when
 * nothing is stored.
 */

const permissions: string[] = [];
let stored: Record<string, unknown> | null = null;

vi.mock('../internal/runtime', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  authorized: async (
    _deps: unknown,
    _ctx: unknown,
    permission: string,
    _resource: unknown,
    handler: (db: unknown, actor: unknown) => Promise<unknown>,
  ) => {
    permissions.push(permission);
    if (permission === 'media.write') {
      throw Object.assign(new Error('forbidden'), { code: 'FORBIDDEN' });
    }
    return handler(fakeDb, { userId: 'user_viewer', workspace: { id: 'ws_1' } });
  },
}));

vi.mock('../internal/audit', () => ({ recordAudit: async () => undefined }));

const fakeDb = {
  mediaAsset: {
    findFirst: async () => ({
      id: 'media_1',
      kind: 'image',
      scanState: 'clean',
      rights: {},
      checksumSha256: 'a'.repeat(64),
      mimeType: 'image/jpeg',
      byteSize: 10,
      width: null,
      height: null,
      storageKey: 'k',
      storageDeletedAt: null,
    }),
  },
  mediaAnalysis: { findFirst: async () => stored },
};

import { FixedClock } from '../ports/clock';
import { createMediaAnalysisService } from './media-analysis';
import { MEDIA_UNDERSTANDING_PROMPT_VERSION } from './media-analysis-types';

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_viewer',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_checks_read',
  approvalLevel: 'level_2_scheduled',
  locale: 'en',
};

const deps = {
  clock: new FixedClock(new Date('2026-09-24T10:00:00.000Z')),
} as unknown as ServiceDeps;

beforeEach(() => {
  permissions.length = 0;
  stored = null;
});

describe('image checks for a read-only member', () => {
  it('returns checks from a stored analysis without asking for media.write', async () => {
    stored = {
      id: 'manalysis_1',
      mediaAssetId: 'media_1',
      promptId: 'media-understanding',
      promptVersion: MEDIA_UNDERSTANDING_PROMPT_VERSION,
      provider: 'echo',
      model: 'echo',
      createdAt: new Date('2026-09-23T10:00:00.000Z'),
      result: {
        subjects: [],
        visibleText: [],
        setting: null,
        mood: null,
        textLegibilityRisk: 'none',
        sensitive: { faces: false, possibleMinors: false, logos: [] },
        evidenceIds: [],
        uncertain: false,
        uncertaintyReason: null,
      },
    };
    const view = await createMediaAnalysisService(deps).checks(ctx, { mediaId: 'media_1' });
    expect(view).toMatchObject({ status: 'ready', analysisId: 'manalysis_1' });
    expect(permissions).not.toContain('media.write');
  });

  it('does not start an analysis when none is stored', async () => {
    await expect(
      createMediaAnalysisService(deps).checks(ctx, { mediaId: 'media_1' }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' });
    expect(permissions).toContain('media.write');
  });
});
