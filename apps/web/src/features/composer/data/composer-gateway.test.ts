import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The composer bootstrap.
 *
 * The behaviour under test is the one that was missing rather than wrong: the
 * composer asked for connections and a draft, hardcoded `sets: []`, and so made
 * "apply a Set" unreachable from the only screen where anybody would want it.
 * These tests hold the wiring in place, and hold the two honest states around
 * it: a real empty list stays empty, and a failed list is never presented as an
 * empty one.
 */

const listConnections = vi.hoisted(() => vi.fn());
const getCapabilities = vi.hoisted(() => vi.fn());
const listPostingSets = vi.hoisted(() => vi.fn());
const createDraft = vi.hoisted(() => vi.fn());
const getComposite = vi.hoisted(() => vi.fn());
const updateMaster = vi.hoisted(() => vi.fn());
const setTargets = vi.hoisted(() => vi.fn());
const overrideVariant = vi.hoisted(() => vi.fn());
const resetVariantToMaster = vi.hoisted(() => vi.fn());
const saveComposite = vi.hoisted(() => vi.fn());

vi.mock('@/lib/api', () => ({
  api: {
    connections: { list: listConnections, getCapabilities },
    postingSets: { list: listPostingSets },
    content: {
      createDraft,
      getComposite,
      updateMaster,
      setTargets,
      overrideVariant,
      resetVariantToMaster,
      saveComposite,
    },
  },
  newIdempotencyKey: (prefix: string) => `${prefix}_test`,
}));

import { createComposerGateway, loadComposer } from './composer-gateway';
import { initialComposerState } from '../state/seed';
import { composerReducer } from '../state/composer-reducer';
import type { ComposerState } from '../types';
import { SEED_BOOTSTRAP } from '../state/seed';
import { ComposerSaveConflict } from '../state/save-conflict';
import { ApiError } from '@/lib/api/error';

/** A snapshot that passes the contract's own schema. */
const SEED_ACCOUNT = SEED_BOOTSTRAP.accounts[0];
if (SEED_ACCOUNT === undefined) {
  throw new Error('The seed has no account to borrow a snapshot from.');
}
const SNAPSHOT = SEED_ACCOUNT.capabilities;

const INPUT = {
  contentItemId: null,
  projectId: 'project_01',
  workspaceId: 'ws_01',
  workspaceTimeZone: 'Europe/Berlin',
} as const;

function page<T>(data: readonly T[]) {
  return { data, pageInfo: { nextCursor: null, hasMore: false, limit: 25 } };
}

function postingSet(overrides: Record<string, unknown> = {}) {
  return {
    id: 'set_01',
    workspaceId: 'ws_01',
    projectId: 'project_01',
    name: 'Launch day',
    description: 'The three channels that carry a release.',
    connectionIds: ['conn_01', 'conn_02'],
    targetDefaults: [],
    signatureId: 'sig_01',
    approvalPolicy: 'inherit',
    slotBehavior: 'next_free',
    archivedAt: null,
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-08-01T09:00:00.000Z',
    ...overrides,
  };
}

describe('loadComposer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listConnections.mockResolvedValue(page([]));
    listPostingSets.mockResolvedValue(page([]));
    createDraft.mockResolvedValue({ id: 'content_01', projectId: 'project_01', body: '' });
    getComposite.mockResolvedValue(compositeItem());
    updateMaster.mockResolvedValue({ id: 'content_01', updatedAt: SAVED_AT });
    setTargets.mockResolvedValue({ id: 'content_01', targets: [] });
    overrideVariant.mockResolvedValue({});
    resetVariantToMaster.mockResolvedValue({});
  });

  it('asks for this project’s Posting Sets, so the rail has something to apply', async () => {
    await loadComposer(INPUT);

    expect(listPostingSets).toHaveBeenCalledWith({ projectId: 'project_01' }, undefined);
  });

  it('maps a Set to what the rail needs, and never invents seed text for it', async () => {
    listPostingSets.mockResolvedValue(page([postingSet()]));

    const bootstrap = await loadComposer(INPUT);

    expect(bootstrap.sets).toEqual([
      {
        id: 'set_01',
        name: 'Launch day',
        description: 'The three channels that carry a release.',
        connectionIds: ['conn_01', 'conn_02'],
        // A Set selects channels and a signature. It carries no draft text on
        // the server, and the reducer reads empty as "seeds nothing".
        seedBody: '',
        signatureId: 'sig_01',
      },
    ]);
  });

  it('carries a Set with no description through as an empty one, not as null', async () => {
    listPostingSets.mockResolvedValue(page([postingSet({ description: null })]));

    const bootstrap = await loadComposer(INPUT);

    expect(bootstrap.sets[0]?.description).toBe('');
  });

  it('leaves the list empty when the project genuinely has no Sets', async () => {
    const bootstrap = await loadComposer(INPUT);

    expect(bootstrap.sets).toEqual([]);
  });

  it('never presents a failed Set request as "no Sets saved yet"', async () => {
    // The rail's empty state is a claim about somebody's workspace. When the
    // request failed we do not know that claim is true, so the rejection has to
    // reach the designed error state on /compose instead of being swallowed.
    listPostingSets.mockRejectedValue(new Error('gateway timeout'));

    await expect(loadComposer(INPUT)).rejects.toThrow('gateway timeout');
  });

  it('leaves signatures and branded domains empty, because nothing lists them', async () => {
    // Not an oversight and not a stub to fill in here: there is no signatures
    // read endpoint anywhere in the API, and `ProjectView.domains` carries no
    // verification state, which is the only kind of domain LinkControls offers.
    const bootstrap = await loadComposer(INPUT);

    expect(bootstrap.signatures).toEqual([]);
    expect(bootstrap.brandedDomains).toEqual([]);
  });

  it('still loads the accounts and the draft the composer opens with', async () => {
    listConnections.mockResolvedValue(
      page([
        {
          id: 'conn_01',
          provider: 'x',
          displayName: 'Northbound',
          handle: '@northbound',
          avatarUrl: null,
          health: 'paused',
        },
      ]),
    );
    getCapabilities.mockResolvedValue(SNAPSHOT);

    const bootstrap = await loadComposer(INPUT);

    expect(bootstrap.accounts).toEqual([
      {
        connectionId: 'conn_01',
        provider: 'x',
        displayName: 'Northbound',
        handle: '@northbound',
        avatarUrl: null,
        projectId: 'project_01',
        paused: true,
        capabilities: SNAPSHOT,
      },
    ]);
    expect(bootstrap.unavailableAccounts).toEqual([]);
    // Opening the composer is not a draft: the row is created by the first
    // edit that has something in it, not by arriving on the screen.
    expect(bootstrap.master.id).toBe('');
    expect(createDraft).not.toHaveBeenCalled();
  });

  it('degrades only the channel whose capabilities fail, or come back unreadable', async () => {
    listConnections.mockResolvedValue(
      page(
        ['conn_ok', 'conn_down', 'conn_garbled'].map((id) => ({
          id,
          provider: 'x',
          displayName: id,
          handle: null,
          avatarUrl: null,
          health: 'healthy',
        })),
      ),
    );
    getCapabilities.mockImplementation((id: string) =>
      id === 'conn_ok'
        ? Promise.resolve(SNAPSHOT)
        : id === 'conn_down'
          ? Promise.reject(new Error('provider timeout'))
          : Promise.resolve({ provider: 'x' }),
    );

    const bootstrap = await loadComposer(INPUT);

    expect(bootstrap.accounts.map((account) => account.connectionId)).toEqual(['conn_ok']);
    expect(bootstrap.unavailableAccounts?.map((account) => account.connectionId)).toEqual([
      'conn_down',
      'conn_garbled',
    ]);
  });

  it('carries the version the draft was read at, so a save can prove it is current', async () => {
    getComposite.mockResolvedValue(compositeItem({ currentVersionId: 'ver_07' }));

    const bootstrap = await loadComposer({ ...INPUT, contentItemId: 'content_01' });

    expect(bootstrap.versionId).toBe('ver_07');
  });

  it('reads every per-target override and setting back out of a saved draft', async () => {
    getComposite.mockResolvedValue(
      compositeItem({
        variants: [
          variant({
            connectionId: 'conn_01',
            overrides: { body: 'The version X actually gets.' },
            privacyValue: 'public',
            destination: { id: 'dest_row_01', displayLabel: 'Builders' },
          }),
        ],
      }),
    );

    const bootstrap = await loadComposer({ ...INPUT, contentItemId: 'content_01' });

    expect(bootstrap.selectedConnectionIds).toEqual(['conn_01']);
    expect(bootstrap.overrides).toEqual({ conn_01: { body: 'The version X actually gets.' } });
    expect(bootstrap.settings.conn_01).toEqual({
      destination: {
        destinationId: 'dest_row_01',
        // The stored view knows the row, not the provider's own id.
        externalId: null,
        displayLabel: 'Builders',
      },
      mentions: [],
      privacyValue: 'public',
      disclosure: null,
    });
  });

  it('carries the master fields the narrowed list view drops', async () => {
    getComposite.mockResolvedValue(
      compositeItem({
        threadItems: [{ id: 'comment_01', kind: 'thread', order: 0, body: 'Two.', mediaIds: [], links: [], delaySeconds: 120, connectionId: null }],
        schedule: { instant: '2026-09-10T09:00:00.000Z', ianaTimeZone: 'Europe/Berlin', repeat: null },
      }),
    );

    const bootstrap = await loadComposer({ ...INPUT, contentItemId: 'content_01' });

    expect(bootstrap.master.threadItems).toHaveLength(1);
    expect(bootstrap.master.schedule?.ianaTimeZone).toBe('Europe/Berlin');
  });
});

const SAVED_AT = '2026-09-02T10:00:00.000Z';

function compositeItem(overrides: Record<string, unknown> = {}) {
  return {
    id: 'content_01',
    workspaceId: 'ws_01',
    projectId: 'project_01',
    campaignId: null,
    title: null,
    state: 'draft',
    approvalPolicy: 'any_approver',
    approvalState: 'not_required',
    locale: 'en',
    contentKind: 'text',
    body: 'Master text.',
    mediaIds: [],
    links: [],
    signature: null,
    threadItems: [],
    schedule: null,
    disclosure: { aiAssisted: false, commercialContent: false, brandedContent: false },
    variants: [],
    currentVersionId: null,
    approvedVersionId: null,
    currentChecksum: null,
    reapprovalRequired: false,
    createdVia: 'web',
    createdByUserId: null,
    createdAt: SAVED_AT,
    updatedAt: SAVED_AT,
    ...overrides,
  };
}

function variant(overrides: Record<string, unknown> = {}) {
  return {
    id: 'variant_01',
    contentItemId: 'content_01',
    connectionId: 'conn_01',
    provider: 'x',
    accountType: 'business_profile',
    accountDisplayName: 'Northbound',
    accountHandle: '@northbound',
    locale: 'en',
    body: 'Master text.',
    contentKind: 'text',
    mediaIds: [],
    links: [],
    signature: null,
    threadItems: [],
    schedule: null,
    overrides: {},
    inheritedFields: [],
    overriddenFields: [],
    destination: null,
    mentions: [],
    privacyValue: null,
    disclosure: null,
    capabilityVersion: null,
    state: 'draft',
    validationIssues: [],
    estimatedCostMinor: null,
    estimatedCostCurrency: null,
    ...overrides,
  };
}

async function bootstrapState(): Promise<ComposerState> {
  const bootstrap = await loadComposer({ ...INPUT, contentItemId: 'content_01' });
  return initialComposerState(bootstrap);
}

describe('createComposerGateway', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listConnections.mockResolvedValue(page([]));
    listPostingSets.mockResolvedValue(page([]));
    createDraft.mockResolvedValue({ id: 'content_new', projectId: 'project_01', body: '' });
    getComposite.mockResolvedValue(compositeItem());
    updateMaster.mockResolvedValue({ id: 'content_01', updatedAt: SAVED_AT });
    setTargets.mockResolvedValue({
      id: 'content_01',
      targets: [{ variantId: 'variant_01', connectionId: 'conn_01' }],
    });
    overrideVariant.mockResolvedValue({});
    resetVariantToMaster.mockResolvedValue({});
    saveComposite.mockResolvedValue(compositeItem({ currentVersionId: 'ver_02' }));
  });

  it('round-trips one override and one setting through one composite save', async () => {
    const start = await bootstrapState();
    const edited = [
      { type: 'target/add', connectionId: 'conn_01' },
      {
        type: 'variant/override',
        connectionId: 'conn_01',
        field: 'body',
        value: 'The version X actually gets.',
      },
      {
        type: 'variant/settings',
        connectionId: 'conn_01',
        patch: { privacyValue: 'public' },
      },
    ].reduce<ComposerState>(
      (state, action) => composerReducer(state, action as never),
      start,
    );

    const gateway = createComposerGateway({
      contentItemId: 'content_01',
      versionId: 'ver_01',
      projectId: 'project_01',
    });
    await gateway.save(edited);

    // One request, one version: nothing goes out per target any more.
    expect(saveComposite).toHaveBeenCalledTimes(1);
    expect(updateMaster).not.toHaveBeenCalled();
    expect(setTargets).not.toHaveBeenCalled();
    expect(overrideVariant).not.toHaveBeenCalled();
    expect(saveComposite).toHaveBeenCalledWith(
      'content_01',
      expect.objectContaining({
        expectedVersionId: 'ver_01',
        targets: [
          {
            connectionId: 'conn_01',
            destinationId: null,
            mentions: [],
            privacyValue: 'public',
            disclosure: null,
          },
        ],
        variantOverrides: { conn_01: { body: 'The version X actually gets.' } },
      }),
    );

    getComposite.mockResolvedValue(
      compositeItem({
        variants: [
          variant({
            overrides: { body: 'The version X actually gets.' },
            privacyValue: 'public',
          }),
        ],
      }),
    );
    const reopened = await bootstrapState();

    expect(reopened.overrides).toEqual(edited.overrides);
    expect(reopened.settings.conn_01?.privacyValue).toBe('public');
  });

  it('builds each save on the version the previous one wrote', async () => {
    saveComposite
      .mockResolvedValueOnce(compositeItem({ currentVersionId: 'ver_02' }))
      .mockResolvedValueOnce(compositeItem({ currentVersionId: 'ver_03' }));
    const state = await bootstrapState();
    const gateway = createComposerGateway({
      contentItemId: 'content_01',
      versionId: 'ver_01',
      projectId: 'project_01',
    });

    const outcome = await gateway.save(state);
    await gateway.save(state);

    expect(saveComposite.mock.calls[0]?.[1]).toMatchObject({ expectedVersionId: 'ver_01' });
    expect(saveComposite.mock.calls[1]?.[1]).toMatchObject({ expectedVersionId: 'ver_02' });
    expect(outcome.failedConnectionIds).toEqual([]);
    expect(outcome.savedAt).toBe(SAVED_AT);
  });

  it('turns a 409 into a conflict carrying the saved text, and rebases only when accepted', async () => {
    saveComposite
      .mockRejectedValueOnce(
        new ApiError({
          code: 'CONFLICT',
          status: 409,
          messageCode: 'conflict',
          retryable: false,
          details: {},
          correlationId: null,
          retryAfterSeconds: null,
        }),
      )
      .mockResolvedValueOnce(compositeItem({ currentVersionId: 'ver_09' }));
    getComposite.mockResolvedValue(
      compositeItem({ body: 'Their text.', currentVersionId: 'ver_08' }),
    );
    const state = await bootstrapState();
    const gateway = createComposerGateway({
      contentItemId: 'content_01',
      versionId: 'ver_01',
      projectId: 'project_01',
    });

    const conflict = await gateway.save(state).catch((error: unknown) => error);

    expect(conflict).toBeInstanceOf(ComposerSaveConflict);
    expect((conflict as ComposerSaveConflict).theirBody).toBe('Their text.');
    (conflict as ComposerSaveConflict).accept();
    await gateway.save(state);
    expect(saveComposite.mock.calls[1]?.[1]).toMatchObject({ expectedVersionId: 'ver_08' });
  });

  it('creates the draft once, however many saves race for it', async () => {
    const gateway = createComposerGateway({ contentItemId: null, projectId: 'project_01' });

    const [first, second] = await Promise.all([gateway.ensureDraftId(), gateway.ensureDraftId()]);

    expect(first).toBe('content_new');
    expect(second).toBe('content_new');
    expect(createDraft).toHaveBeenCalledTimes(1);
  });

  it('asks again after a failed creation rather than resolving to a missing draft', async () => {
    createDraft.mockRejectedValueOnce(new Error('offline'));
    const gateway = createComposerGateway({ contentItemId: null, projectId: 'project_01' });

    await expect(gateway.ensureDraftId()).rejects.toThrow('offline');
    await expect(gateway.ensureDraftId()).resolves.toBe('content_new');
    expect(createDraft).toHaveBeenCalledTimes(2);
  });
});
