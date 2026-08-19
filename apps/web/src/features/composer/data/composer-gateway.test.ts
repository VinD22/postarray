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
const getContent = vi.hoisted(() => vi.fn());

vi.mock('@/lib/api', () => ({
  api: {
    connections: { list: listConnections, getCapabilities },
    postingSets: { list: listPostingSets },
    content: { createDraft, get: getContent },
  },
  newIdempotencyKey: (prefix: string) => `${prefix}_test`,
}));

import { loadComposer } from './composer-gateway';

const INPUT = {
  contentItemId: null,
  projectId: 'project_01',
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
    getContent.mockResolvedValue({ id: 'content_01', projectId: 'project_01', body: '' });
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
    getCapabilities.mockResolvedValue({ provider: 'x' });

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
        capabilities: { provider: 'x' },
      },
    ]);
    expect(bootstrap.master.id).toBe('content_01');
    expect(createDraft).toHaveBeenCalledWith({ projectId: 'project_01' }, 'draft_test', undefined);
  });
});
