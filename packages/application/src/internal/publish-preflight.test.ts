import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ValidationResult } from '@relay/contracts';

import type { ActorContext, ServiceDeps } from '../types';

/**
 * The shared commit preflight.
 *
 * The aggregate loader, capability loader and target resolver are faked so a
 * failure here is a preflight bug. What is real: the autonomy ladder from
 * `@relay/authz`, the escalation set the preview reports, and the exact-set
 * acknowledgement check the commit applies.
 */

const CHECKSUM = 'a'.repeat(64);

interface FakeVariant {
  id: string;
  connectionId: string;
  provider: string;
  accountDisplayName: string;
  accountHandle: string | null;
  settings: { overrides: unknown; privacyValue: string | null };
}

let variants: FakeVariant[] = [];
let approvalPolicy = 'none';
let receiptsByConnection: Record<string, number> = {};

vi.mock('./content-store', () => ({
  loadAggregate: async () => ({
    itemId: 'content_1',
    projectId: 'proj_1',
    approvalPolicy,
    approvedVersionId: null,
    approvedChecksum: null,
    currentVersionId: 'cver_1',
    checksum: CHECKSUM,
    master: {},
    variants,
  }),
}));

vi.mock('./capabilities', () => ({
  loadCapabilitiesFor: async () => new Map(),
  linkHosts: () => [],
}));

vi.mock('./stored-content', () => ({
  resolveTarget: () => ({ values: { body: 'Hello there', locale: 'en', schedule: null } }),
}));

const fakeDb = {
  publicationReceipt: {
    count: async ({ where }: { where: { connectionId?: string } }) =>
      where.connectionId === undefined ? 0 : (receiptsByConnection[where.connectionId] ?? 0),
  },
};

import { FixedClock } from '../ports/clock';
import {
  assertConfirmed,
  assertNoBlockers,
  runPublishPreflight,
  toCommitPreview,
  type PublishPreflightInput,
} from './publish-preflight';
import type { ActorSnapshot, Db } from './runtime';

const NOW = new Date('2026-06-05T10:00:00.000Z');

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_preflight',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

const actor = {
  ctx,
  userId: 'user_1',
  policyActor: { approvalLevel: 'level_3_confirm' },
  restrictions: {},
  workspace: { id: 'ws_1', defaultTimeZone: 'Europe/London' },
} as unknown as ActorSnapshot;

const deps = {
  clock: new FixedClock(NOW),
  billing: { checkEntitlement: async () => ({ allowed: true, limit: null, used: 0 }) },
} as unknown as ServiceDeps;

let validation: ValidationResult = { ok: true, issues: [] };

function input(overrides: Partial<PublishPreflightInput> = {}): PublishPreflightInput {
  return {
    contentItemId: 'content_1',
    scheduleSpec: {
      instant: '2026-06-06T10:00:00.000Z',
      ianaTimeZone: 'Europe/London',
      repeat: null,
    },
    kind: 'schedule',
    validate: async () => validation,
    ...overrides,
  } as PublishPreflightInput;
}

function variant(id: string, handle: string, provider = 'linkedin'): FakeVariant {
  return {
    id: `pv_${id}`,
    connectionId: `conn_${id}`,
    provider,
    accountDisplayName: `Account ${id}`,
    accountHandle: handle,
    settings: { overrides: {}, privacyValue: null },
  };
}

function run(overrides: Partial<PublishPreflightInput> = {}) {
  return runPublishPreflight(fakeDb as unknown as Db, deps, ctx, actor, input(overrides));
}

beforeEach(() => {
  variants = [variant('a', '@acme'), variant('b', '@acme_eu', 'mastodon')];
  approvalPolicy = 'none';
  receiptsByConnection = { conn_a: 3, conn_b: 1 };
  validation = { ok: true, issues: [] };
});

describe('commit preflight escalations', () => {
  it('asks for acknowledgement of a first-use connection on a schedule', async () => {
    receiptsByConnection = { conn_a: 3 };
    const preflight = await run();
    const preview = toCommitPreview(preflight, 'schedule');

    expect(preview.canCommit).toBe(true);
    expect(preview.requiresConfirmation).toBe(true);
    expect(preview.targetCount).toBe(2);
    expect(preview.versionChecksum).toBe(CHECKSUM);
    expect(preview.escalations).toEqual([
      expect.objectContaining({
        code: 'first_use_connection',
        connectionId: 'conn_b',
        params: expect.objectContaining({ accountLabel: '@acme_eu', provider: 'mastodon' }),
      }),
    ]);

    // Scheduling used to send no confirmation at all, so a first post from a
    // new account could never be scheduled.
    expect(() => assertConfirmed(preflight, ctx, false)).toThrow(
      expect.objectContaining({ name: 'ApprovalRequiredError' }),
    );
    expect(() =>
      assertConfirmed(preflight, ctx, {
        acknowledgedTargetCount: 2,
        acknowledgedVersionChecksum: CHECKSUM,
        acknowledgedEscalations: ['first_use_connection'],
      }),
    ).not.toThrow();
  });

  it('needs both immediate_publish and first_use_connection for a first publish now', async () => {
    receiptsByConnection = {};
    variants = [variant('a', '@acme')];
    const preflight = await run({ kind: 'publish_now' });
    const codes = toCommitPreview(preflight, 'publish_now').escalations.map((e) => e.code);
    expect([...codes].sort()).toEqual(['first_use_connection', 'immediate_publish']);

    // What MCP and the CLI used to hard-code: only immediate_publish.
    expect(() =>
      assertConfirmed(preflight, ctx, {
        acknowledgedTargetCount: 1,
        acknowledgedVersionChecksum: CHECKSUM,
        acknowledgedEscalations: ['immediate_publish'],
      }),
    ).toThrow(expect.objectContaining({ name: 'ApprovalRequiredError' }));
    expect(() =>
      assertConfirmed(preflight, ctx, {
        acknowledgedTargetCount: 1,
        acknowledgedVersionChecksum: CHECKSUM,
        acknowledgedEscalations: ['immediate_publish', 'first_use_connection'],
      }),
    ).not.toThrow();
  });

  it('refuses an invented escalation as firmly as a missing one', async () => {
    const preflight = await run({ kind: 'publish_now' });
    expect(() =>
      assertConfirmed(preflight, ctx, {
        acknowledgedTargetCount: 2,
        acknowledgedVersionChecksum: CHECKSUM,
        acknowledgedEscalations: ['immediate_publish', 'privacy_change'],
      }),
    ).toThrow(expect.objectContaining({ name: 'ApprovalRequiredError' }));
  });

  it('refuses a confirmation made for a different target count', async () => {
    const preflight = await run();
    expect(() =>
      assertConfirmed(preflight, ctx, {
        acknowledgedTargetCount: 1,
        acknowledgedVersionChecksum: CHECKSUM,
        acknowledgedEscalations: [],
      }),
    ).toThrow(expect.objectContaining({ name: 'ValidationFailedError' }));
  });

  it('needs no confirmation for a schedule to accounts that have published before', async () => {
    const preflight = await run();
    expect(toCommitPreview(preflight, 'schedule').requiresConfirmation).toBe(false);
    expect(() => assertConfirmed(preflight, ctx, false)).not.toThrow();
  });
});

describe('commit preflight connection filter', () => {
  it('covers only the named connections and ignores issues on the others', async () => {
    validation = {
      ok: false,
      issues: [
        {
          code: 'TEXT_TOO_LONG',
          severity: 'error',
          targetId: 'conn_b',
          messageKey: 'validation.text_too_long.message',
          params: {},
        },
      ],
    };
    const preflight = await run({ connectionIds: ['conn_a'] });
    const preview = toCommitPreview(preflight, 'schedule');
    expect(preview.targetCount).toBe(1);
    expect(preview.validation.issues).toEqual([]);
    expect(preview.canCommit).toBe(true);
  });

  it('blocks when the filter matches no target', async () => {
    const preflight = await run({ connectionIds: ['conn_zzz'] });
    const preview = toCommitPreview(preflight, 'schedule');
    expect(preview.canCommit).toBe(false);
    expect(preview.blockers[0]?.code).toBe('no_targets_selected');
    expect(() => assertNoBlockers(preflight)).toThrow(
      expect.objectContaining({ name: 'ValidationFailedError' }),
    );
  });
});

describe('commit preflight blockers', () => {
  it('reports a missing approval without throwing, and the commit throws it', async () => {
    approvalPolicy = 'required';
    const preflight = await run();
    const preview = toCommitPreview(preflight, 'schedule');
    expect(preview.canCommit).toBe(false);
    expect(preview.blockers.map((entry) => entry.code)).toEqual(['approval_required']);
    expect(preview.blockers[0]).not.toHaveProperty('details');
    expect(() => assertNoBlockers(preflight)).toThrow(
      expect.objectContaining({ name: 'ApprovalRequiredError' }),
    );
  });

  it('reports validation errors as a content_invalid blocker', async () => {
    validation = {
      ok: false,
      issues: [
        {
          code: 'TEXT_TOO_LONG',
          severity: 'error',
          messageKey: 'validation.text_too_long.message',
          params: {},
        },
      ],
    };
    const preview = toCommitPreview(await run(), 'schedule');
    expect(preview.blockers.map((entry) => entry.code)).toEqual(['content_invalid']);
    expect(preview.validation.issues).toHaveLength(1);
  });
});
