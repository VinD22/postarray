import { describe, expect, it } from 'vitest';

import type { ActorSnapshot, Db } from './runtime';

import { requireProjectOwnership, requireProjectOwnershipIfPresent } from './project-ownership';

/**
 * The ownership check itself, away from any one service.
 *
 * Two things are asserted here that a service test cannot show as clearly:
 * that the lookup names the workspace rather than trusting the session claim
 * alone, and that a row which comes back belonging to somebody else is refused
 * even though it was returned.
 */

const OWN_PROJECT = 'project_own';
const OTHER_WORKSPACE_PROJECT = 'project_other_workspace';

const rows: Record<string, Record<string, unknown>> = {
  [OWN_PROJECT]: {
    id: OWN_PROJECT,
    workspaceId: 'ws_1',
    archivedAt: null,
    rememberTargetsEnabled: false,
  },
  [OTHER_WORKSPACE_PROJECT]: {
    id: OTHER_WORKSPACE_PROJECT,
    workspaceId: 'ws_2',
    archivedAt: null,
    rememberTargetsEnabled: true,
  },
};

const actor = { workspace: { id: 'ws_1' } } as unknown as ActorSnapshot;

interface Recorded {
  readonly where: Record<string, unknown>;
}

/** A scoped client that honours `where`, as the real one does. */
function scopedDb(seen: Recorded[]): Db {
  return {
    project: {
      findFirst: async ({ where }: { where: Record<string, unknown> }) => {
        seen.push({ where });
        const row = rows[String(where['id'])];
        if (row === undefined) return null;
        return where['workspaceId'] === undefined || row['workspaceId'] === where['workspaceId']
          ? row
          : null;
      },
    },
  } as unknown as Db;
}

/** A client that ignores `where` entirely, standing in for a future mistake. */
function unscopedDb(): Db {
  return {
    project: {
      findFirst: async ({ where }: { where: Record<string, unknown> }) =>
        rows[String(where['id'])] ?? null,
    },
  } as unknown as Db;
}

describe('requireProjectOwnership', () => {
  it('returns the project this workspace owns', async () => {
    const seen: Recorded[] = [];
    await expect(requireProjectOwnership(scopedDb(seen), actor, OWN_PROJECT)).resolves.toMatchObject({
      id: OWN_PROJECT,
      workspaceId: 'ws_1',
    });
  });

  it('names the workspace in the query rather than trusting the session alone', async () => {
    const seen: Recorded[] = [];
    await requireProjectOwnership(scopedDb(seen), actor, OWN_PROJECT);
    expect(seen[0]?.where).toMatchObject({ id: OWN_PROJECT, workspaceId: 'ws_1' });
  });

  it('refuses a project that exists in another workspace', async () => {
    const seen: Recorded[] = [];
    await expect(
      requireProjectOwnership(scopedDb(seen), actor, OTHER_WORKSPACE_PROJECT),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
      messageKey: 'errors.not_found.project',
      details: { resource: 'project', id: OTHER_WORKSPACE_PROJECT },
    });
  });

  it('refuses a project that does not exist at all, with the same answer', async () => {
    const seen: Recorded[] = [];
    await expect(requireProjectOwnership(scopedDb(seen), actor, 'project_nope')).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('refuses a foreign row even from a client that ignored the workspace filter', async () => {
    // Defence in depth: the row we got back has to be the row we asked for.
    await expect(
      requireProjectOwnership(unscopedDb(), actor, OTHER_WORKSPACE_PROJECT),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});

describe('requireProjectOwnershipIfPresent', () => {
  it('allows an absent project, because nothing was named to own', async () => {
    const seen: Recorded[] = [];
    const db = scopedDb(seen);
    await expect(requireProjectOwnershipIfPresent(db, actor, undefined)).resolves.toBeNull();
    await expect(requireProjectOwnershipIfPresent(db, actor, null)).resolves.toBeNull();
    await expect(requireProjectOwnershipIfPresent(db, actor, '   ')).resolves.toBeNull();
    expect(seen).toEqual([]);
  });

  it('checks a project that was named, exactly as the required form does', async () => {
    const seen: Recorded[] = [];
    const db = scopedDb(seen);
    await expect(requireProjectOwnershipIfPresent(db, actor, OWN_PROJECT)).resolves.toMatchObject({
      id: OWN_PROJECT,
    });
    await expect(
      requireProjectOwnershipIfPresent(db, actor, OTHER_WORKSPACE_PROJECT),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});
