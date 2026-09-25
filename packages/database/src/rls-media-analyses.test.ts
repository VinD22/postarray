import pg from 'pg';
import { newIdFor } from '@relay/contracts';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/**
 * Row level security for opt-in image analysis (0080).
 *
 * Covers the two things that migration adds: `app.media_analyses`, a tenant
 * table, and `app.workspaces.ai_image_analysis_enabled`, a setting only an
 * owner or admin may change. Same approach as `rls.test.ts`: raw `pg`, claims
 * set per transaction, `SET LOCAL ROLE relay_app` so policies actually apply,
 * and a rollback after every case.
 *
 * Gated on DATABASE_URL and skips cleanly without one.
 */

const DATABASE_URL = process.env['DIRECT_DATABASE_URL'] ?? process.env['DATABASE_URL'];
const hasDatabase = DATABASE_URL !== undefined && DATABASE_URL !== '';

const IDS = {
  workspaceA: newIdFor('workspace'),
  workspaceB: newIdFor('workspace'),
  ownerA: newIdFor('user'),
  editorA: newIdFor('user'),
  viewerA: newIdFor('user'),
  ownerB: newIdFor('user'),
  mediaA: newIdFor('media'),
  mediaB: newIdFor('media'),
  analysisA: newIdFor('mediaAnalysis'),
  analysisB: newIdFor('mediaAnalysis'),
} as const;

const CHECKSUM_A = 'a'.repeat(64);
const CHECKSUM_B = 'b'.repeat(64);
const VERSION = '2026-09-23.1';

let client: pg.Client;

const serviceClaims = JSON.stringify({ role: 'service_role' });

function claimsFor(userId: string): string {
  return JSON.stringify({ role: 'authenticated', relay_user_id: userId });
}

async function asActor<T>(claims: string, work: (tx: pg.Client) => Promise<T>): Promise<T> {
  await client.query('BEGIN');
  try {
    await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [claims]);
    await client.query('SET LOCAL ROLE relay_app');
    return await work(client);
  } finally {
    await client.query('ROLLBACK');
  }
}

async function denied(claims: string, sql: string, params: readonly unknown[]): Promise<boolean> {
  return asActor(claims, async (tx) => {
    try {
      const result = await tx.query(sql, [...params]);
      return (result.rowCount ?? 0) === 0;
    } catch {
      return true;
    }
  });
}

const INSERT_ANALYSIS = `INSERT INTO app.media_analyses
  (workspace_id, media_asset_id, asset_checksum_sha256, prompt_version, provider, model, result)
  VALUES ($1, $2, $3, '${VERSION}', 'echo', 'echo', '{"subjects":[]}'::jsonb)`;

async function seed(): Promise<void> {
  await client.query('BEGIN');
  await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [serviceClaims]);
  for (const id of [IDS.ownerA, IDS.editorA, IDS.viewerA, IDS.ownerB]) {
    await client.query(
      `INSERT INTO app.users (id, email, display_name, status, updated_at)
       VALUES ($1, $2, $3, 'active', now()) ON CONFLICT (id) DO NOTHING`,
      [id, `${id}@example.test`, id],
    );
  }
  for (const [workspaceId, owner] of [
    [IDS.workspaceA, IDS.ownerA],
    [IDS.workspaceB, IDS.ownerB],
  ] as const) {
    await client.query(
      `INSERT INTO app.workspaces (id, name, slug, owner_user_id, status, updated_at)
       VALUES ($1, $2, $3, $4, 'active', now()) ON CONFLICT (id) DO NOTHING`,
      [workspaceId, workspaceId, workspaceId, owner],
    );
  }
  for (const [workspaceId, userId, role] of [
    [IDS.workspaceA, IDS.ownerA, 'owner'],
    [IDS.workspaceA, IDS.editorA, 'editor'],
    [IDS.workspaceA, IDS.viewerA, 'viewer'],
    [IDS.workspaceB, IDS.ownerB, 'owner'],
  ] as const) {
    await client.query(
      `INSERT INTO app.memberships (workspace_id, user_id, role, state, updated_at)
       VALUES ($1, $2, $3, 'active', now()) ON CONFLICT (workspace_id, user_id) DO NOTHING`,
      [workspaceId, userId, role],
    );
  }
  for (const [mediaId, workspaceId, checksum] of [
    [IDS.mediaA, IDS.workspaceA, CHECKSUM_A],
    [IDS.mediaB, IDS.workspaceB, CHECKSUM_B],
  ] as const) {
    await client.query(
      `INSERT INTO app.media_assets
         (id, workspace_id, kind, storage_bucket, storage_key, mime_type, byte_size,
          checksum_sha256, retention_expires_at, updated_at)
       VALUES ($1, $2, 'image', 'fixture', $3, 'image/jpeg', 10, $4, now() + interval '1 day', now())`,
      [mediaId, workspaceId, mediaId, checksum],
    );
  }
  for (const [analysisId, workspaceId, mediaId, checksum] of [
    [IDS.analysisA, IDS.workspaceA, IDS.mediaA, CHECKSUM_A],
    [IDS.analysisB, IDS.workspaceB, IDS.mediaB, CHECKSUM_B],
  ] as const) {
    await client.query(
      `INSERT INTO app.media_analyses
         (id, workspace_id, media_asset_id, asset_checksum_sha256, prompt_version, provider, model, result)
       VALUES ($1, $2, $3, $4, '${VERSION}', 'echo', 'echo', '{"subjects":[]}'::jsonb)`,
      [analysisId, workspaceId, mediaId, checksum],
    );
  }
  await client.query('COMMIT');
}

async function teardown(): Promise<void> {
  await client.query('BEGIN');
  await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [serviceClaims]);
  await client.query('ALTER TABLE private.audit_events DISABLE TRIGGER audit_events_append_only');
  await client.query('DELETE FROM private.audit_events WHERE workspace_id = ANY($1)', [
    [IDS.workspaceA, IDS.workspaceB],
  ]);
  await client.query('ALTER TABLE private.audit_events ENABLE TRIGGER audit_events_append_only');
  await client.query('DELETE FROM app.workspaces WHERE id = ANY($1)', [
    [IDS.workspaceA, IDS.workspaceB],
  ]);
  await client.query('DELETE FROM app.users WHERE id = ANY($1)', [
    [IDS.ownerA, IDS.editorA, IDS.viewerA, IDS.ownerB],
  ]);
  await client.query('COMMIT');
}

describe.skipIf(!hasDatabase)('row level security: image analysis', () => {
  beforeAll(async () => {
    client = new pg.Client({ connectionString: DATABASE_URL });
    await client.connect();
    await seed();
  });

  afterAll(async () => {
    if (client === undefined) return;
    await teardown();
    await client.end();
  });

  it('defaults the workspace setting to off', async () => {
    const rows = await asActor(serviceClaims, (tx) =>
      tx.query('SELECT ai_image_analysis_enabled FROM app.workspaces WHERE id = $1', [
        IDS.workspaceA,
      ]),
    );
    expect(rows.rows[0]?.ai_image_analysis_enabled).toBe(false);
  });

  it('lets a member read their own workspace analysis and nothing from another', async () => {
    const own = await asActor(claimsFor(IDS.viewerA), (tx) =>
      tx.query('SELECT id FROM app.media_analyses WHERE id = $1', [IDS.analysisA]),
    );
    expect(own.rowCount).toBe(1);
    const other = await asActor(claimsFor(IDS.viewerA), (tx) =>
      tx.query('SELECT id FROM app.media_analyses WHERE workspace_id = $1', [IDS.workspaceB]),
    );
    expect(other.rowCount).toBe(0);
  });

  it('refuses a cross-workspace insert, even by an owner', async () => {
    expect(
      await denied(claimsFor(IDS.ownerA), INSERT_ANALYSIS, [
        IDS.workspaceB,
        IDS.mediaB,
        'c'.repeat(64),
      ]),
    ).toBe(true);
  });

  it('refuses an insert by a viewer and allows one by an editor', async () => {
    expect(
      await denied(claimsFor(IDS.viewerA), INSERT_ANALYSIS, [
        IDS.workspaceA,
        IDS.mediaA,
        'd'.repeat(64),
      ]),
    ).toBe(true);
    expect(
      await denied(claimsFor(IDS.editorA), INSERT_ANALYSIS, [
        IDS.workspaceA,
        IDS.mediaA,
        'e'.repeat(64),
      ]),
    ).toBe(false);
  });

  it('never lets a tenant rewrite a stored analysis', async () => {
    expect(
      await denied(
        claimsFor(IDS.ownerA),
        `UPDATE app.media_analyses SET result = '{"subjects":[1]}'::jsonb WHERE id = $1`,
        [IDS.analysisA],
      ),
    ).toBe(true);
  });

  it('refuses a cross-workspace delete', async () => {
    expect(
      await denied(claimsFor(IDS.ownerA), 'DELETE FROM app.media_analyses WHERE id = $1', [
        IDS.analysisB,
      ]),
    ).toBe(true);
  });

  it('lets only an owner or admin turn image analysis on, and only for their workspace', async () => {
    const enable = 'UPDATE app.workspaces SET ai_image_analysis_enabled = true WHERE id = $1';
    expect(await denied(claimsFor(IDS.editorA), enable, [IDS.workspaceA])).toBe(true);
    expect(await denied(claimsFor(IDS.viewerA), enable, [IDS.workspaceA])).toBe(true);
    expect(await denied(claimsFor(IDS.ownerA), enable, [IDS.workspaceB])).toBe(true);
    expect(await denied(claimsFor(IDS.ownerA), enable, [IDS.workspaceA])).toBe(false);
  });
});
