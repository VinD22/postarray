import pg from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/**
 * Row level security tests.
 *
 * These attempt real cross-workspace reads and writes as every role and assert
 * that PostgreSQL refuses them. They talk to the database over `pg` rather than
 * Prisma on purpose: the thing under test is the policy, and going through the
 * ORM would let a bug in our own workspace-scoping proxy mask a missing policy.
 *
 * Every case runs inside a transaction that sets `request.jwt.claims` and then
 * rolls back, so the tests are order independent and leave nothing behind.
 *
 * Gated on DATABASE_URL. Without a database the suite skips cleanly rather than
 * failing, so `pnpm test` works on a laptop with no Docker running. CI sets the
 * variable, so the coverage is not optional there.
 */

const DATABASE_URL = process.env['DIRECT_DATABASE_URL'] ?? process.env['DATABASE_URL'];
const hasDatabase = DATABASE_URL !== undefined && DATABASE_URL !== '';

const FIXTURE = {
  workspaceA: '00000000-0000-4000-8000-0000000000a1',
  workspaceB: '00000000-0000-4000-8000-0000000000b1',
  brandA: '00000000-0000-4000-8000-0000000000a2',
  brandB: '00000000-0000-4000-8000-0000000000b2',
  itemA: '00000000-0000-4000-8000-0000000000a3',
  itemB: '00000000-0000-4000-8000-0000000000b3',
  versionA: '00000000-0000-4000-8000-0000000000a4',
  connectionA: '00000000-0000-4000-8000-0000000000a5',
  credentialA: '00000000-0000-4000-8000-0000000000a6',
  auditA: '00000000-0000-4000-8000-0000000000a7',
} as const;

const ROLES = ['owner', 'admin', 'manager', 'editor', 'approver', 'analyst', 'viewer'] as const;
type Role = (typeof ROLES)[number];

const USER_IDS: Record<Role, string> = {
  owner: '00000000-0000-4000-8000-00000000c001',
  admin: '00000000-0000-4000-8000-00000000c002',
  manager: '00000000-0000-4000-8000-00000000c003',
  editor: '00000000-0000-4000-8000-00000000c004',
  approver: '00000000-0000-4000-8000-00000000c005',
  analyst: '00000000-0000-4000-8000-00000000c006',
  viewer: '00000000-0000-4000-8000-00000000c007',
};

const OUTSIDER_USER_ID = '00000000-0000-4000-8000-00000000c008';

let client: pg.Client;

const serviceClaims = JSON.stringify({ role: 'service_role' });

function memberClaims(userId: string, workspaceId?: string): string {
  return JSON.stringify({
    role: 'authenticated',
    relay_user_id: userId,
    ...(workspaceId === undefined ? {} : { relay_workspace_id: workspaceId }),
  });
}

/** Runs `work` inside a transaction with the given claims, then rolls back. */
async function asActor<T>(claims: string | null, work: (tx: pg.Client) => Promise<T>): Promise<T> {
  await client.query('BEGIN');
  try {
    if (claims === null) {
      await client.query(`SELECT set_config('request.jwt.claims', '', true)`);
    } else {
      await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [claims]);
    }
    return await work(client);
  } finally {
    await client.query('ROLLBACK');
  }
}

async function expectRejected(
  claims: string | null,
  sql: string,
  params: readonly unknown[] = [],
): Promise<void> {
  const outcome = await asActor(claims, async (tx) => {
    try {
      const result = await tx.query(sql, [...params]);
      return { rejected: false, rowCount: result.rowCount ?? 0 };
    } catch {
      return { rejected: true, rowCount: 0 };
    }
  });

  // A write may be refused with an error (WITH CHECK failed) or silently affect
  // zero rows (USING filtered every candidate). Both are a denial; neither is a
  // leak. What must never happen is a row changing hands.
  expect(outcome.rejected || outcome.rowCount === 0).toBe(true);
}

describe.skipIf(!hasDatabase)('row level security', () => {
  beforeAll(async () => {
    client = new pg.Client({ connectionString: DATABASE_URL });
    await client.connect();
    await seedFixture();
  });

  afterAll(async () => {
    if (client === undefined) return;
    await teardownFixture();
    await client.end();
  });

  describe('a request with no claims', () => {
    it('reads no workspaces', async () => {
      const rows = await asActor(null, async (tx) => tx.query('SELECT id FROM app.workspaces'));
      expect(rows.rowCount).toBe(0);
    });

    it('reads no content', async () => {
      const rows = await asActor(null, async (tx) => tx.query('SELECT id FROM app.content_items'));
      expect(rows.rowCount).toBe(0);
    });

    it('cannot insert content', async () => {
      await expectRejected(
        null,
        `INSERT INTO app.content_items (workspace_id, brand_id, title, state, updated_at)
         VALUES ($1, $2, 'anon insert', 'draft', now())`,
        [FIXTURE.workspaceA, FIXTURE.brandA],
      );
    });
  });

  describe.each(ROLES)('a %s of workspace A', (role) => {
    const claims = (): string => memberClaims(USER_IDS[role]);

    it('reads its own workspace content', async () => {
      const rows = await asActor(claims(), async (tx) =>
        tx.query('SELECT id FROM app.content_items WHERE workspace_id = $1', [FIXTURE.workspaceA]),
      );
      expect(rows.rowCount).toBe(1);
    });

    it('cannot read workspace B content', async () => {
      const rows = await asActor(claims(), async (tx) =>
        tx.query('SELECT id FROM app.content_items WHERE workspace_id = $1', [FIXTURE.workspaceB]),
      );
      expect(rows.rowCount).toBe(0);
    });

    it('cannot read workspace B itself', async () => {
      const rows = await asActor(claims(), async (tx) =>
        tx.query('SELECT id FROM app.workspaces WHERE id = $1', [FIXTURE.workspaceB]),
      );
      expect(rows.rowCount).toBe(0);
    });

    it('cannot insert content into workspace B', async () => {
      await expectRejected(
        claims(),
        `INSERT INTO app.content_items (workspace_id, brand_id, title, state, updated_at)
         VALUES ($1, $2, 'cross tenant insert', 'draft', now())`,
        [FIXTURE.workspaceB, FIXTURE.brandB],
      );
    });

    it('cannot update workspace B content', async () => {
      await expectRejected(
        claims(),
        `UPDATE app.content_items SET title = 'hijacked' WHERE id = $1`,
        [FIXTURE.itemB],
      );
    });

    it('cannot delete workspace B content', async () => {
      await expectRejected(claims(), 'DELETE FROM app.content_items WHERE id = $1', [
        FIXTURE.itemB,
      ]);
    });

    it('cannot read any encrypted credential', async () => {
      const outcome = await asActor(claims(), async (tx) => {
        try {
          const result = await tx.query('SELECT id FROM private.social_credentials');
          return result.rowCount ?? 0;
        } catch {
          return 0;
        }
      });
      expect(outcome).toBe(0);
    });

    it('cannot read the audit log', async () => {
      const outcome = await asActor(claims(), async (tx) => {
        try {
          const result = await tx.query('SELECT id FROM private.audit_events');
          return result.rowCount ?? 0;
        } catch {
          return 0;
        }
      });
      expect(outcome).toBe(0);
    });
  });

  describe('write permissions inside the workspace', () => {
    it('lets an editor create content', async () => {
      const rows = await asActor(memberClaims(USER_IDS.editor), async (tx) =>
        tx.query(
          `INSERT INTO app.content_items (workspace_id, brand_id, title, state, updated_at)
           VALUES ($1, $2, 'editor draft', 'draft', now()) RETURNING id`,
          [FIXTURE.workspaceA, FIXTURE.brandA],
        ),
      );
      expect(rows.rowCount).toBe(1);
    });

    it.each(['analyst', 'viewer', 'approver'] as const)(
      'does not let a %s create content',
      async (role) => {
        await expectRejected(
          memberClaims(USER_IDS[role]),
          `INSERT INTO app.content_items (workspace_id, brand_id, title, state, updated_at)
           VALUES ($1, $2, 'should not exist', 'draft', now())`,
          [FIXTURE.workspaceA, FIXTURE.brandA],
        );
      },
    );

    it.each(['manager', 'editor', 'approver', 'analyst', 'viewer'] as const)(
      'does not let a %s change workspace settings',
      async (role) => {
        await expectRejected(
          memberClaims(USER_IDS[role]),
          `UPDATE app.workspaces SET name = 'renamed' WHERE id = $1`,
          [FIXTURE.workspaceA],
        );
      },
    );

    it('lets an admin change workspace settings', async () => {
      const rows = await asActor(memberClaims(USER_IDS.admin), async (tx) =>
        tx.query(`UPDATE app.workspaces SET name = 'renamed' WHERE id = $1`, [FIXTURE.workspaceA]),
      );
      expect(rows.rowCount).toBe(1);
    });

    it.each(['editor', 'analyst', 'viewer'] as const)(
      'does not let a %s connect a social account',
      async (role) => {
        await expectRejected(
          memberClaims(USER_IDS[role]),
          `INSERT INTO app.social_connections
             (workspace_id, provider, external_account_id, account_type, display_name, updated_at)
           VALUES ($1, 'fake', 'sneaky-account', 'business_account', 'Sneaky', now())`,
          [FIXTURE.workspaceA],
        );
      },
    );

    it('does not let a member schedule a publish job directly', async () => {
      // Scheduling has to travel through the application service so idempotency,
      // approval and entitlement checks cannot be skipped.
      await expectRejected(
        memberClaims(USER_IDS.owner),
        `INSERT INTO app.publish_jobs
           (workspace_id, content_item_id, content_version_id, connection_id,
            scheduled_for, scheduled_time_zone, state, idempotency_key, updated_at)
         VALUES ($1, $2, $3, $4, now() + interval '1 day', 'UTC', 'scheduled', 'direct-write', now())`,
        [FIXTURE.workspaceA, FIXTURE.itemA, FIXTURE.versionA, FIXTURE.connectionA],
      );
    });
  });

  describe('a user with no membership at all', () => {
    it('reads nothing', async () => {
      const rows = await asActor(memberClaims(OUTSIDER_USER_ID), async (tx) =>
        tx.query('SELECT id FROM app.content_items'),
      );
      expect(rows.rowCount).toBe(0);
    });

    it('cannot write anywhere', async () => {
      await expectRejected(
        memberClaims(OUTSIDER_USER_ID),
        `INSERT INTO app.content_items (workspace_id, brand_id, title, state, updated_at)
         VALUES ($1, $2, 'outsider', 'draft', now())`,
        [FIXTURE.workspaceA, FIXTURE.brandA],
      );
    });
  });

  describe('a pinned workspace claim', () => {
    it('cannot widen access to a workspace the user is not in', async () => {
      const rows = await asActor(memberClaims(USER_IDS.owner, FIXTURE.workspaceB), async (tx) =>
        tx.query('SELECT id FROM app.content_items'),
      );
      expect(rows.rowCount).toBe(0);
    });

    it('narrows access to the pinned workspace only', async () => {
      const rows = await asActor(memberClaims(USER_IDS.owner, FIXTURE.workspaceA), async (tx) =>
        tx.query('SELECT workspace_id FROM app.content_items'),
      );
      expect(rows.rowCount).toBe(1);
      expect(rows.rows[0]).toMatchObject({ workspace_id: FIXTURE.workspaceA });
    });
  });

  describe('immutability', () => {
    it('rejects an update to a content version, even as the service role', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query(`UPDATE app.content_versions SET body = 'rewritten' WHERE id = $1`, [
            FIXTURE.versionA,
          ]),
        ),
      ).rejects.toThrow();
    });

    it('rejects an update to the audit log, even as the service role', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query(`UPDATE private.audit_events SET action = 'rewritten' WHERE id = $1`, [
            FIXTURE.auditA,
          ]),
        ),
      ).rejects.toThrow();
    });

    it('rejects a delete from the audit log, even as the service role', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query('DELETE FROM private.audit_events WHERE id = $1', [FIXTURE.auditA]),
        ),
      ).rejects.toThrow();
    });
  });

  describe('the service role', () => {
    it('can read across workspaces, which is why every use is audited', async () => {
      const rows = await asActor(serviceClaims, async (tx) =>
        tx.query('SELECT workspace_id FROM app.content_items WHERE workspace_id = ANY($1)', [
          [FIXTURE.workspaceA, FIXTURE.workspaceB],
        ]),
      );
      expect(rows.rowCount).toBe(2);
    });

    it('can read encrypted credentials', async () => {
      const rows = await asActor(serviceClaims, async (tx) =>
        tx.query('SELECT id FROM private.social_credentials WHERE id = $1', [FIXTURE.credentialA]),
      );
      expect(rows.rowCount).toBe(1);
    });
  });
});

async function seedFixture(): Promise<void> {
  await client.query('BEGIN');
  await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [serviceClaims]);

  const people: readonly [string, string][] = [
    ...ROLES.map((role): [string, string] => [USER_IDS[role], `rls-${role}@example.test`]),
    [OUTSIDER_USER_ID, 'rls-outsider@example.test'],
  ];

  for (const [id, email] of people) {
    await client.query(
      `INSERT INTO app.users (id, email, display_name, status, updated_at)
       VALUES ($1, $2, $3, 'active', now()) ON CONFLICT (id) DO NOTHING`,
      [id, email, email],
    );
  }

  for (const [workspaceId, slug] of [
    [FIXTURE.workspaceA, 'rls-fixture-a'],
    [FIXTURE.workspaceB, 'rls-fixture-b'],
  ] as const) {
    await client.query(
      `INSERT INTO app.workspaces (id, name, slug, owner_user_id, status, updated_at)
       VALUES ($1, $2, $3, $4, 'active', now()) ON CONFLICT (id) DO NOTHING`,
      [workspaceId, slug, slug, USER_IDS.owner],
    );
  }

  for (const role of ROLES) {
    await client.query(
      `INSERT INTO app.memberships (workspace_id, user_id, role, state, updated_at)
       VALUES ($1, $2, $3, 'active', now())
       ON CONFLICT (workspace_id, user_id) DO UPDATE SET role = EXCLUDED.role`,
      [FIXTURE.workspaceA, USER_IDS[role], role],
    );
  }

  // Workspace B has a single owner who is not a member of workspace A.
  await client.query(
    `INSERT INTO app.memberships (workspace_id, user_id, role, state, updated_at)
     VALUES ($1, $2, 'owner', 'active', now())
     ON CONFLICT (workspace_id, user_id) DO NOTHING`,
    [FIXTURE.workspaceB, OUTSIDER_USER_ID],
  );

  for (const [brandId, workspaceId, slug] of [
    [FIXTURE.brandA, FIXTURE.workspaceA, 'brand-a'],
    [FIXTURE.brandB, FIXTURE.workspaceB, 'brand-b'],
  ] as const) {
    await client.query(
      `INSERT INTO app.brands (id, workspace_id, name, slug, updated_at)
       VALUES ($1, $2, $3, $4, now()) ON CONFLICT (id) DO NOTHING`,
      [brandId, workspaceId, slug, slug],
    );
  }

  for (const [itemId, workspaceId, brandId] of [
    [FIXTURE.itemA, FIXTURE.workspaceA, FIXTURE.brandA],
    [FIXTURE.itemB, FIXTURE.workspaceB, FIXTURE.brandB],
  ] as const) {
    await client.query(
      `INSERT INTO app.content_items (id, workspace_id, brand_id, title, state, updated_at)
       VALUES ($1, $2, $3, 'fixture', 'draft', now()) ON CONFLICT (id) DO NOTHING`,
      [itemId, workspaceId, brandId],
    );
  }

  await client.query(
    `INSERT INTO app.content_versions (id, workspace_id, content_item_id, version, body, content_hash)
     VALUES ($1, $2, $3, 1, 'fixture body', 'fixture-hash') ON CONFLICT (id) DO NOTHING`,
    [FIXTURE.versionA, FIXTURE.workspaceA, FIXTURE.itemA],
  );

  await client.query(
    `INSERT INTO app.social_connections
       (id, workspace_id, provider, external_account_id, account_type, display_name, updated_at)
     VALUES ($1, $2, 'fake', 'rls-fixture-account', 'business_account', 'Fixture', now())
     ON CONFLICT (id) DO NOTHING`,
    [FIXTURE.connectionA, FIXTURE.workspaceA],
  );

  await client.query(
    `INSERT INTO private.social_credentials
       (id, workspace_id, connection_id, access_token_ciphertext, access_token_nonce, key_version, updated_at)
     VALUES ($1, $2, $3, '\\x00', '\\x00', 'test', now()) ON CONFLICT (id) DO NOTHING`,
    [FIXTURE.credentialA, FIXTURE.workspaceA, FIXTURE.connectionA],
  );

  await client.query(
    `INSERT INTO private.audit_events
       (id, workspace_id, actor_type, surface, action, target_type)
     VALUES ($1, $2, 'system', 'api', 'fixture.created', 'content_item')
     ON CONFLICT (id) DO NOTHING`,
    [FIXTURE.auditA, FIXTURE.workspaceA],
  );

  await client.query('COMMIT');
}

async function teardownFixture(): Promise<void> {
  await client.query('BEGIN');
  await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [serviceClaims]);

  // The audit log rejects DELETE by design, so the fixture row is removed with
  // the guard temporarily off. This is test teardown against a local database
  // and is the only place in the codebase that does it.
  await client.query('ALTER TABLE private.audit_events DISABLE TRIGGER audit_events_append_only');
  await client.query('DELETE FROM private.audit_events WHERE workspace_id = ANY($1)', [
    [FIXTURE.workspaceA, FIXTURE.workspaceB],
  ]);
  await client.query('ALTER TABLE private.audit_events ENABLE TRIGGER audit_events_append_only');

  await client.query('DELETE FROM app.workspaces WHERE id = ANY($1)', [
    [FIXTURE.workspaceA, FIXTURE.workspaceB],
  ]);
  await client.query('DELETE FROM app.users WHERE id = ANY($1)', [
    [...ROLES.map((role) => USER_IDS[role]), OUTSIDER_USER_ID],
  ]);

  await client.query('COMMIT');
}
