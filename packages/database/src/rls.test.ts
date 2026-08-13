import pg from 'pg';
import { newIdFor } from '@relay/contracts';
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
  workspaceA: newIdFor('workspace'),
  workspaceB: newIdFor('workspace'),
  brandA: newIdFor('brand'),
  brandB: newIdFor('brand'),
  itemA: newIdFor('contentItem'),
  itemB: newIdFor('contentItem'),
  versionA: newIdFor('contentVersion'),
  connectionA: newIdFor('connection'),
  credentialA: newIdFor('credential'),
  auditA: newIdFor('auditEvent'),
  exportA: newIdFor('dataExport'),
  exportB: newIdFor('dataExport'),
  deletionA: newIdFor('deletionRequest'),
  deletionB: newIdFor('deletionRequest'),
  oauthTxA: newIdFor('oauthTransaction'),
  oauthTxB: newIdFor('oauthTransaction'),
  queueRuleA: newIdFor('queueRule'),
  queueRuleB: newIdFor('queueRule'),
  queueSlotA: newIdFor('queueSlotReservation'),
  queueSlotB: newIdFor('queueSlotReservation'),
  importJobA: newIdFor('bulkImportJob'),
  importJobB: newIdFor('bulkImportJob'),
  importRowA: newIdFor('bulkImportRow'),
  importRowB: newIdFor('bulkImportRow'),
  publishJobA: newIdFor('publishJob'),
  memoryEditorA: newIdFor('rememberedTargets'),
  memoryManagerA: newIdFor('rememberedTargets'),
  memoryOutsiderB: newIdFor('rememberedTargets'),
} as const;

const ROLES = ['owner', 'admin', 'manager', 'editor', 'approver', 'analyst', 'viewer'] as const;
type Role = (typeof ROLES)[number];

const USER_IDS: Record<Role, string> = {
  owner: newIdFor('user'),
  admin: newIdFor('user'),
  manager: newIdFor('user'),
  editor: newIdFor('user'),
  approver: newIdFor('user'),
  analyst: newIdFor('user'),
  viewer: newIdFor('user'),
};

/**
 * The owner of workspace B. Everything workspace B needs a person for points at
 * this id.
 *
 * It used to be `OUTSIDER_USER_ID`, which quietly broke the outsider case below:
 * a user who owns workspace B is not an outsider, so "reads nothing" read one
 * row and the suite reported a leak the policies never had.
 */
const WORKSPACE_B_OWNER_ID = newIdFor('user');

/** A real outsider: seeded as a user, given no membership anywhere. */
const OUTSIDER_USER_ID = newIdFor('user');

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
    // Drop to `relay_app` before asserting anything. The migration owner is
    // BYPASSRLS on Neon (and on most managed Postgres), so without this every
    // policy is skipped and the whole suite passes vacuously while proving
    // nothing. `LOCAL` scopes the switch to this transaction, so the rollback
    // below restores the seeding role.
    //
    // `relay_app` (0073) is the role the application itself connects as: full
    // CRUD on `app` and `private`, no BYPASSRLS. Using it here is the point of
    // the suite. Grants are checked before policies, so a role without write
    // grants fails on the grant and the claims-based write branches never run;
    // with `relay_app` the only thing between this statement and the row is a
    // policy body a reviewer can read.
    //
    // The *claims* still carry the role, and that is what `app.is_service_role()`
    // reads. The database role is deliberately the same for a member and for a
    // service-role caller, so the suite proves that the claim is what widens
    // access, not the connection.
    await client.query('SET LOCAL ROLE relay_app');
    return await work(client);
  } finally {
    await client.query('ROLLBACK');
  }
}

/**
 * Runs `work` as the connecting migration owner, which carries BYPASSRLS, with
 * service-role claims set and a rollback at the end.
 *
 * Used only by the immutability probes. Those assert a trigger, and a trigger is
 * the layer *behind* the policy: `app.content_versions` and
 * `private.audit_events` have no UPDATE policy at all, so under RLS the
 * statement matches zero rows, no `BEFORE ... FOR EACH ROW` trigger fires, and
 * the update "succeeds" having changed nothing. Bypassing RLS is the only way to
 * make the trigger the thing under test, and it makes the assertion the stronger
 * one: not even an operator connection that skips every policy can rewrite the
 * audit log.
 */
async function asOwner<T>(work: (tx: pg.Client) => Promise<T>): Promise<T> {
  await client.query('BEGIN');
  try {
    await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [serviceClaims]);
    return await work(client);
  } finally {
    await client.query('ROLLBACK');
  }
}

/**
 * Asserts that `mutationSql` is refused by a trigger rather than silently
 * matching nothing.
 *
 * `probeSql` must return at least one row, so a statement whose `WHERE` matches
 * nothing can never masquerade as a guard firing. That vacuous pass is exactly
 * what hid behind three of the six failures in
 * docs/planning/25-rls-suite-findings.md.
 */
async function expectImmutable(
  probeSql: string,
  mutationSql: string,
  params: readonly unknown[],
): Promise<void> {
  const present = await asOwner(async (tx) => tx.query(probeSql, [...params]));
  expect(present.rowCount ?? 0).toBeGreaterThanOrEqual(1);

  await expect(asOwner(async (tx) => tx.query(mutationSql, [...params]))).rejects.toThrow();
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

  /**
   * Immutability.
   *
   * Two layers, asserted separately.
   *
   * Under RLS these tables have no UPDATE and no DELETE policy, so the statement
   * matches nothing and changes nothing. Behind that, a trigger refuses the
   * write outright, and the trigger is what still holds if a future migration
   * adds a policy by mistake. The trigger cases run with RLS bypassed, because a
   * row trigger cannot fire on a statement that matched no rows.
   */
  describe('immutability', () => {
    it('changes nothing when the service role updates a content version', async () => {
      const outcome = await asActor(serviceClaims, async (tx) =>
        tx.query(`UPDATE app.content_versions SET body = 'rewritten' WHERE id = $1`, [
          FIXTURE.versionA,
        ]),
      );
      expect(outcome.rowCount).toBe(0);
    });

    it('rejects an update to a content version, even with row level security bypassed', async () => {
      await expectImmutable(
        'SELECT id FROM app.content_versions WHERE id = $1',
        `UPDATE app.content_versions SET body = 'rewritten' WHERE id = $1`,
        [FIXTURE.versionA],
      );
    });

    it('rejects an update to the audit log, even with row level security bypassed', async () => {
      await expectImmutable(
        'SELECT id FROM private.audit_events WHERE id = $1',
        `UPDATE private.audit_events SET action = 'rewritten' WHERE id = $1`,
        [FIXTURE.auditA],
      );
    });

    it('rejects a delete from the audit log, even with row level security bypassed', async () => {
      await expectImmutable(
        'SELECT id FROM private.audit_events WHERE id = $1',
        'DELETE FROM private.audit_events WHERE id = $1',
        [FIXTURE.auditA],
      );
    });
  });

  /**
   * The roles themselves.
   *
   * `relay_app` is the role every case above runs as, so its shape is part of
   * the boundary rather than a deployment detail. `authenticated` is reserved
   * for a future Neon Data API surface and must stay read-only.
   */
  describe('the connecting roles', () => {
    it('does not let relay_app bypass row level security', async () => {
      const rows = await client.query(
        'SELECT rolbypassrls, rolsuper FROM pg_roles WHERE rolname = $1',
        ['relay_app'],
      );
      expect(rows.rows[0]).toMatchObject({ rolbypassrls: false, rolsuper: false });
    });

    it('gives relay_app the write grants that make the policies load bearing', async () => {
      const rows = await client.query(
        `SELECT has_table_privilege('relay_app', 'app.content_items', 'INSERT') AS insertable,
                has_table_privilege('relay_app', 'app.workspaces', 'UPDATE') AS updatable`,
      );
      expect(rows.rows[0]).toMatchObject({ insertable: true, updatable: true });
    });

    it('keeps the data api role read-only', async () => {
      await client.query('BEGIN');
      try {
        await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [
          memberClaims(USER_IDS.editor, FIXTURE.workspaceA),
        ]);
        await client.query('SET LOCAL ROLE authenticated');
        await expect(
          client.query(
            `INSERT INTO app.content_items (workspace_id, brand_id, title, state, updated_at)
             VALUES ($1, $2, 'data api write', 'draft', now())`,
            [FIXTURE.workspaceA, FIXTURE.brandA],
          ),
        ).rejects.toThrow(/permission denied/iu);
      } finally {
        await client.query('ROLLBACK');
      }
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

  describe('data rights, oauth and webhooks', () => {
    const memberClaimsA = (): string => memberClaims(USER_IDS.viewer, FIXTURE.workspaceA);

    it('lets a member read exports in their workspace', async () => {
      const rows = await asActor(memberClaimsA(), async (tx) =>
        tx.query('SELECT id FROM app.data_exports WHERE workspace_id = $1', [FIXTURE.workspaceA]),
      );
      expect(rows.rowCount).toBe(1);
    });

    it('cannot read another workspace export job', async () => {
      const rows = await asActor(memberClaimsA(), async (tx) =>
        tx.query('SELECT id FROM app.data_exports WHERE id = $1', [FIXTURE.exportB]),
      );
      expect(rows.rowCount).toBe(0);
    });

    it('cannot insert an export into another workspace', async () => {
      await expectRejected(
        memberClaimsA(),
        `INSERT INTO app.data_exports
           (id, workspace_id, requested_by_user_id, scope, format, state, updated_at)
         VALUES ($1, $2, $3, 'workspace', 'json', 'requested', now())`,
        [newIdFor('dataExport'), FIXTURE.workspaceB, USER_IDS.viewer],
      );
    });

    it('lets a member read deletion requests in their workspace', async () => {
      const rows = await asActor(memberClaimsA(), async (tx) =>
        tx.query('SELECT id FROM app.deletion_requests WHERE workspace_id = $1', [
          FIXTURE.workspaceA,
        ]),
      );
      expect(rows.rowCount).toBe(1);
    });

    it('cannot read another workspace deletion request', async () => {
      const rows = await asActor(memberClaimsA(), async (tx) =>
        tx.query('SELECT id FROM app.deletion_requests WHERE id = $1', [FIXTURE.deletionB]),
      );
      expect(rows.rowCount).toBe(0);
    });

    it('does not let a member delete a deletion request row', async () => {
      await expectRejected(memberClaimsA(), 'DELETE FROM app.deletion_requests WHERE id = $1', [
        FIXTURE.deletionA,
      ]);
    });

    it('does not expose oauth transaction state to workspace members', async () => {
      const outcome = await asActor(memberClaimsA(), async (tx) => {
        try {
          const result = await tx.query('SELECT id FROM private.oauth_transactions');
          return result.rowCount ?? 0;
        } catch {
          return 0;
        }
      });
      expect(outcome).toBe(0);
    });

    it('does not expose webhook signing material to workspace members', async () => {
      const outcome = await asActor(memberClaimsA(), async (tx) => {
        try {
          const result = await tx.query('SELECT id FROM private.webhook_endpoints');
          return result.rowCount ?? 0;
        } catch {
          return 0;
        }
      });
      expect(outcome).toBe(0);
    });
  });

  /**
   * Queue rules and slot reservations.
   *
   * A rule is editorial, so a member reads it and a writer edits it. A
   * reservation is evidence produced by the application service, so a browser
   * session may read one and may never mint or move one. The frozen columns are
   * refused even to the service role.
   */
  describe('queue rules and slot reservations', () => {
    const memberClaimsA = (): string => memberClaims(USER_IDS.editor, FIXTURE.workspaceA);

    it('lets a member read the queue rules in their workspace', async () => {
      const rows = await asActor(memberClaimsA(), async (tx) =>
        tx.query('SELECT id FROM app.queue_rules WHERE workspace_id = $1', [FIXTURE.workspaceA]),
      );
      expect(rows.rowCount).toBe(1);
    });

    it('cannot read another workspace queue rule', async () => {
      const rows = await asActor(memberClaimsA(), async (tx) =>
        tx.query('SELECT id FROM app.queue_rules WHERE id = $1', [FIXTURE.queueRuleB]),
      );
      expect(rows.rowCount).toBe(0);
    });

    it('cannot insert a queue rule into another workspace', async () => {
      await expectRejected(
        memberClaimsA(),
        `INSERT INTO app.queue_rules
           (id, workspace_id, brand_id, name, iana_time_zone, created_by_user_id, updated_at)
         VALUES ($1, $2, $3, 'stolen', 'UTC', $4, now())`,
        [newIdFor('queueRule'), FIXTURE.workspaceB, FIXTURE.brandB, USER_IDS.editor],
      );
    });

    it('cannot update or delete another workspace queue rule', async () => {
      await expectRejected(
        memberClaimsA(),
        `UPDATE app.queue_rules SET minimum_gap_minutes = 0 WHERE id = $1`,
        [FIXTURE.queueRuleB],
      );
      await expectRejected(memberClaimsA(), 'DELETE FROM app.queue_rules WHERE id = $1', [
        FIXTURE.queueRuleB,
      ]);
    });

    it('lets a member read the reservations in their workspace', async () => {
      const rows = await asActor(memberClaimsA(), async (tx) =>
        tx.query('SELECT id FROM app.queue_slot_reservations WHERE workspace_id = $1', [
          FIXTURE.workspaceA,
        ]),
      );
      expect(rows.rowCount).toBe(1);
    });

    it('cannot read another workspace reservation', async () => {
      const rows = await asActor(memberClaimsA(), async (tx) =>
        tx.query('SELECT id FROM app.queue_slot_reservations WHERE id = $1', [FIXTURE.queueSlotB]),
      );
      expect(rows.rowCount).toBe(0);
    });

    it('does not let a member mint a reservation directly, in any workspace', async () => {
      for (const [workspaceId, brandId] of [
        [FIXTURE.workspaceA, FIXTURE.brandA],
        [FIXTURE.workspaceB, FIXTURE.brandB],
      ] as const) {
        await expectRejected(
          memberClaimsA(),
          `INSERT INTO app.queue_slot_reservations
             (id, workspace_id, brand_id, state, scheduled_for, scheduled_time_zone,
              local_date_time, rule_snapshot, created_by_user_id, updated_at)
           VALUES ($1, $2, $3, 'proposed', now() + interval '1 day', 'UTC', '2030-01-01T09:00',
                   '{"reasons":[]}'::jsonb, $4, now())`,
          [newIdFor('queueSlotReservation'), workspaceId, brandId, USER_IDS.editor],
        );
      }
    });

    it('does not let a member move a reservation they can see', async () => {
      await expectRejected(
        memberClaimsA(),
        `UPDATE app.queue_slot_reservations SET scheduled_for = now() WHERE id = $1`,
        [FIXTURE.queueSlotA],
      );
    });

    it('refuses to rewrite the frozen evidence, even as the service role', async () => {
      for (const sql of [
        `UPDATE app.queue_slot_reservations SET rule_snapshot = '{"reasons":[]}'::jsonb WHERE id = $1`,
        `UPDATE app.queue_slot_reservations SET scheduled_for = now() WHERE id = $1`,
        `UPDATE app.queue_slot_reservations SET scheduled_time_zone = 'UTC' WHERE id = $1`,
      ]) {
        await expect(
          asActor(serviceClaims, async (tx) => tx.query(sql, [FIXTURE.queueSlotA])),
        ).rejects.toThrow();
      }
    });

    it('lets the service role change state and attach content, which is not evidence', async () => {
      const outcome = await asActor(serviceClaims, async (tx) =>
        tx.query(
          `UPDATE app.queue_slot_reservations
             SET state = 'accepted', content_item_id = $2, updated_at = now()
           WHERE id = $1`,
          [FIXTURE.queueSlotA, FIXTURE.itemA],
        ),
      );
      expect(outcome.rowCount).toBe(1);
    });

    it('refuses a second live reservation on the same project and instant', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query(
            `INSERT INTO app.queue_slot_reservations
               (id, workspace_id, brand_id, state, scheduled_for, scheduled_time_zone,
                local_date_time, rule_snapshot, created_by_user_id, updated_at)
             SELECT $1, workspace_id, brand_id, 'proposed', scheduled_for, scheduled_time_zone,
                    local_date_time, rule_snapshot, created_by_user_id, now()
             FROM app.queue_slot_reservations WHERE id = $2`,
            [newIdFor('queueSlotReservation'), FIXTURE.queueSlotA],
          ),
        ),
      ).rejects.toThrow();
    });

    it('refuses a negative daily maximum and keeps zero distinct from null', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query('UPDATE app.queue_rules SET maximum_per_day = -1 WHERE id = $1', [
            FIXTURE.queueRuleA,
          ]),
        ),
      ).rejects.toThrow();

      const stored = await asActor(serviceClaims, async (tx) => {
        await tx.query('UPDATE app.queue_rules SET maximum_per_day = 0 WHERE id = $1', [
          FIXTURE.queueRuleA,
        ]);
        return tx.query('SELECT maximum_per_day FROM app.queue_rules WHERE id = $1', [
          FIXTURE.queueRuleA,
        ]);
      });
      expect(stored.rows[0]?.maximum_per_day).toBe(0);
    });
  });

  /**
   * Bulk CSV import.
   *
   * A job and its rows are evidence produced by the application service: what
   * was uploaded, what the parser concluded and, once a person applied, which
   * draft each line became. A browser session reads its own workspace and
   * writes neither, and the per-row uniqueness that makes re-applying safe is
   * enforced here rather than hoped for in application code.
   */
  describe('bulk import jobs and rows', () => {
    const memberClaimsA = (): string => memberClaims(USER_IDS.editor, FIXTURE.workspaceA);

    it('lets a member read the import jobs in their workspace', async () => {
      const rows = await asActor(memberClaimsA(), async (tx) =>
        tx.query('SELECT id FROM app.bulk_import_jobs WHERE workspace_id = $1', [
          FIXTURE.workspaceA,
        ]),
      );
      expect(rows.rowCount).toBe(1);
    });

    it('cannot read another workspace import job or its rows', async () => {
      const jobs = await asActor(memberClaimsA(), async (tx) =>
        tx.query('SELECT id FROM app.bulk_import_jobs WHERE id = $1', [FIXTURE.importJobB]),
      );
      expect(jobs.rowCount).toBe(0);

      const rows = await asActor(memberClaimsA(), async (tx) =>
        tx.query('SELECT id FROM app.bulk_import_rows WHERE id = $1', [FIXTURE.importRowB]),
      );
      expect(rows.rowCount).toBe(0);
    });

    it('cannot mint an import job from a browser session', async () => {
      await expectRejected(
        memberClaimsA(),
        `INSERT INTO app.bulk_import_jobs
           (id, workspace_id, brand_id, filename, manifest_checksum, parser_version,
            requested_by_user_id, updated_at)
         VALUES ($1, $2, $3, 'forged.csv', $4, 'rls-test', $5, now())`,
        [
          newIdFor('bulkImportJob'),
          FIXTURE.workspaceA,
          FIXTURE.brandA,
          'c'.repeat(64),
          USER_IDS.editor,
        ],
      );
    });

    it('cannot mint or move an import row from a browser session', async () => {
      await expectRejected(
        memberClaimsA(),
        `INSERT INTO app.bulk_import_rows
           (id, workspace_id, bulk_import_job_id, external_row_key, line_number, updated_at)
         VALUES ($1, $2, $3, 'forged', 9, now())`,
        [newIdFor('bulkImportRow'), FIXTURE.workspaceA, FIXTURE.importJobA],
      );
      await expectRejected(
        memberClaimsA(),
        `UPDATE app.bulk_import_rows SET state = 'applied' WHERE id = $1`,
        [FIXTURE.importRowA],
      );
    });

    it('cannot write into another workspace import job', async () => {
      await expectRejected(
        memberClaimsA(),
        `UPDATE app.bulk_import_jobs SET state = 'applied' WHERE id = $1`,
        [FIXTURE.importJobB],
      );
      await expectRejected(memberClaimsA(), 'DELETE FROM app.bulk_import_jobs WHERE id = $1', [
        FIXTURE.importJobB,
      ]);
    });

    it('refuses a second row with the same key inside one job', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query(
            `INSERT INTO app.bulk_import_rows
               (id, workspace_id, bulk_import_job_id, external_row_key, line_number, updated_at)
             VALUES ($1, $2, $3, 'row-1', 3, now())`,
            [newIdFor('bulkImportRow'), FIXTURE.workspaceA, FIXTURE.importJobA],
          ),
        ),
      ).rejects.toThrow();
    });

    it('refuses a second job for the same manifest in one workspace', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query(
            `INSERT INTO app.bulk_import_jobs
               (id, workspace_id, brand_id, filename, manifest_checksum, parser_version,
                requested_by_user_id, updated_at)
             SELECT $1, workspace_id, brand_id, 'again.csv', manifest_checksum, parser_version,
                    requested_by_user_id, now()
             FROM app.bulk_import_jobs WHERE id = $2`,
            [newIdFor('bulkImportJob'), FIXTURE.importJobA],
          ),
        ),
      ).rejects.toThrow();
    });

    it('refuses an apply mode without an applied instant, even to the service', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query(`UPDATE app.bulk_import_jobs SET apply_mode = 'drafts' WHERE id = $1`, [
            FIXTURE.importJobA,
          ]),
        ),
      ).rejects.toThrow();
    });

    it('refuses rewriting the job, key or line a row was read from', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query(`UPDATE app.bulk_import_rows SET external_row_key = 'renamed' WHERE id = $1`, [
            FIXTURE.importRowA,
          ]),
        ),
      ).rejects.toThrow();
    });
  });

  /**
   * Remembered targets.
   *
   * Every other tenant table in this suite asks "is this row in my workspace".
   * This one asks a second question as well: "is this row mine". Workspace
   * membership is necessary and not sufficient. The editor and the manager are
   * both active members of workspace A and both have a memory in project A, and
   * neither may see the other's, because which accounts a colleague last posted
   * to is nobody else's business, including an administrator's.
   */
  describe('remembered targets are self-row', () => {
    const editorClaims = (): string => memberClaims(USER_IDS.editor, FIXTURE.workspaceA);
    const managerClaims = (): string => memberClaims(USER_IDS.manager, FIXTURE.workspaceA);
    const adminClaims = (): string => memberClaims(USER_IDS.admin, FIXTURE.workspaceA);

    it('lets a person read their own remembered selection', async () => {
      const rows = await asActor(editorClaims(), async (tx) =>
        tx.query('SELECT id FROM app.remembered_targets WHERE id = $1', [FIXTURE.memoryEditorA]),
      );
      expect(rows.rowCount).toBe(1);
    });

    it('hides a teammate memory in the same project', async () => {
      const rows = await asActor(managerClaims(), async (tx) =>
        tx.query('SELECT id FROM app.remembered_targets WHERE id = $1', [FIXTURE.memoryEditorA]),
      );
      expect(rows.rowCount).toBe(0);
    });

    it('hides every teammate memory from an administrator too', async () => {
      const rows = await asActor(adminClaims(), async (tx) =>
        tx.query('SELECT id FROM app.remembered_targets WHERE workspace_id = $1', [
          FIXTURE.workspaceA,
        ]),
      );
      expect(rows.rowCount).toBe(0);
    });

    it('cannot write a memory on somebody else behalf', async () => {
      await expectRejected(
        managerClaims(),
        `INSERT INTO app.remembered_targets (workspace_id, brand_id, user_id, connection_ids, updated_at)
         VALUES ($1, $2, $3, ARRAY[$4]::text[], now())`,
        [FIXTURE.workspaceA, FIXTURE.brandA, USER_IDS.viewer, FIXTURE.connectionA],
      );
    });

    it('cannot edit or delete a teammate memory', async () => {
      await expectRejected(
        managerClaims(),
        `UPDATE app.remembered_targets SET connection_ids = ARRAY[]::text[] WHERE id = $1`,
        [FIXTURE.memoryEditorA],
      );
      await expectRejected(managerClaims(), 'DELETE FROM app.remembered_targets WHERE id = $1', [
        FIXTURE.memoryEditorA,
      ]);
    });

    it('cannot reach into another workspace memory', async () => {
      const rows = await asActor(editorClaims(), async (tx) =>
        tx.query('SELECT id FROM app.remembered_targets WHERE id = $1', [FIXTURE.memoryOutsiderB]),
      );
      expect(rows.rowCount).toBe(0);
    });

    it('lets a person forget their own selection', async () => {
      const deleted = await asActor(editorClaims(), async (tx) =>
        tx.query('DELETE FROM app.remembered_targets WHERE id = $1', [FIXTURE.memoryEditorA]),
      );
      expect(deleted.rowCount).toBe(1);
    });

    it('refuses anything that is not a channel identifier, even to the service', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query(
            `UPDATE app.remembered_targets SET connection_ids = ARRAY['Ship it on Friday']::text[] WHERE id = $1`,
            [FIXTURE.memoryEditorA],
          ),
        ),
      ).rejects.toThrow();
    });

    it('keeps one memory per person per project', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query(
            `INSERT INTO app.remembered_targets (workspace_id, brand_id, user_id, connection_ids, updated_at)
             VALUES ($1, $2, $3, ARRAY[]::text[], now())`,
            [FIXTURE.workspaceA, FIXTURE.brandA, USER_IDS.editor],
          ),
        ),
      ).rejects.toThrow();
    });
  });

  /**
   * A hold on a publish job.
   *
   * The database refuses a half-written hold and a hold on work that already
   * reached a platform. Both are refused to the service role as well, because
   * "the application would never do that" is not an invariant.
   */
  describe('publish job holds', () => {
    it('accepts a complete hold by a person', async () => {
      const updated = await asActor(serviceClaims, async (tx) =>
        tx.query(
          `UPDATE app.publish_jobs
             SET paused_at = now(), paused_reason = 'user', paused_by_user_id = $2
           WHERE id = $1`,
          [FIXTURE.publishJobA, USER_IDS.editor],
        ),
      );
      expect(updated.rowCount).toBe(1);
    });

    it('accepts a billing hold with nobody attached', async () => {
      const updated = await asActor(serviceClaims, async (tx) =>
        tx.query(
          `UPDATE app.publish_jobs SET paused_at = now(), paused_reason = 'billing' WHERE id = $1`,
          [FIXTURE.publishJobA],
        ),
      );
      expect(updated.rowCount).toBe(1);
    });

    it('refuses a paused instant without a reason', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query('UPDATE app.publish_jobs SET paused_at = now() WHERE id = $1', [
            FIXTURE.publishJobA,
          ]),
        ),
      ).rejects.toThrow();
    });

    it('refuses a reason outside the closed vocabulary', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query(
            `UPDATE app.publish_jobs SET paused_at = now(), paused_reason = 'because' WHERE id = $1`,
            [FIXTURE.publishJobA],
          ),
        ),
      ).rejects.toThrow();
    });

    it("refuses a person's hold with no person on it", async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query(
            `UPDATE app.publish_jobs SET paused_at = now(), paused_reason = 'user' WHERE id = $1`,
            [FIXTURE.publishJobA],
          ),
        ),
      ).rejects.toThrow();
    });

    it('refuses a hold on work that already reached a platform', async () => {
      await expect(
        asActor(serviceClaims, async (tx) =>
          tx.query(
            `UPDATE app.publish_jobs
               SET state = 'published', paused_at = now(), paused_reason = 'user',
                   paused_by_user_id = $2
             WHERE id = $1`,
            [FIXTURE.publishJobA, USER_IDS.editor],
          ),
        ),
      ).rejects.toThrow();
    });
  });
});

async function seedFixture(): Promise<void> {
  await client.query('BEGIN');
  await client.query(`SELECT set_config('request.jwt.claims', $1, true)`, [serviceClaims]);

  const people: readonly [string, string][] = [
    ...ROLES.map((role): [string, string] => [USER_IDS[role], `rls-${role}@example.test`]),
    [WORKSPACE_B_OWNER_ID, 'rls-workspace-b-owner@example.test'],
    // Seeded as a person and deliberately never given a membership anywhere.
    [OUTSIDER_USER_ID, 'rls-outsider@example.test'],
  ];

  for (const [id, email] of people) {
    await client.query(
      `INSERT INTO app.users (id, email, display_name, status, updated_at)
       VALUES ($1, $2, $3, 'active', now()) ON CONFLICT (id) DO NOTHING`,
      [id, email, email],
    );
  }

  for (const [workspaceId, slug, ownerUserId] of [
    [FIXTURE.workspaceA, 'rls-fixture-a', USER_IDS.owner],
    [FIXTURE.workspaceB, 'rls-fixture-b', WORKSPACE_B_OWNER_ID],
  ] as const) {
    await client.query(
      `INSERT INTO app.workspaces (id, name, slug, owner_user_id, status, updated_at)
       VALUES ($1, $2, $3, $4, 'active', now()) ON CONFLICT (id) DO NOTHING`,
      [workspaceId, slug, slug, ownerUserId],
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
    [FIXTURE.workspaceB, WORKSPACE_B_OWNER_ID],
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

  for (const [exportId, workspaceId, userId] of [
    [FIXTURE.exportA, FIXTURE.workspaceA, USER_IDS.owner],
    [FIXTURE.exportB, FIXTURE.workspaceB, WORKSPACE_B_OWNER_ID],
  ] as const) {
    await client.query(
      `INSERT INTO app.data_exports
         (id, workspace_id, requested_by_user_id, scope, format, state, updated_at)
       VALUES ($1, $2, $3, 'workspace', 'json', 'requested', now())
       ON CONFLICT (id) DO NOTHING`,
      [exportId, workspaceId, userId],
    );
  }

  const executeAfter = new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString();
  for (const [deletionId, workspaceId, userId] of [
    [FIXTURE.deletionA, FIXTURE.workspaceA, USER_IDS.owner],
    [FIXTURE.deletionB, FIXTURE.workspaceB, WORKSPACE_B_OWNER_ID],
  ] as const) {
    await client.query(
      `INSERT INTO app.deletion_requests
         (id, workspace_id, requested_by_user_id, scope, state, execute_after, updated_at)
       VALUES ($1, $2, $3, 'workspace', 'requested', $4, now())
       ON CONFLICT (id) DO NOTHING`,
      [deletionId, workspaceId, userId, executeAfter],
    );
  }

  for (const [oauthId, workspaceId, stateHash] of [
    // `state_hash` is CHECKed against ^[0-9a-f]{64}$ (0062).
    [
      FIXTURE.oauthTxA,
      FIXTURE.workspaceA,
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1',
    ],
    [
      FIXTURE.oauthTxB,
      FIXTURE.workspaceB,
      'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb2',
    ],
  ] as const) {
    await client.query(
      `INSERT INTO private.oauth_transactions
         (id, workspace_id, purpose, state_hash, redirect_uri, expires_at)
       VALUES ($1, $2, 'connect_social_account', $3, 'https://app.example.test/oauth/callback', now() + interval '10 minutes')
       ON CONFLICT (id) DO NOTHING`,
      [oauthId, workspaceId, stateHash],
    );
  }

  for (const [ruleId, workspaceId, brandId, name] of [
    [FIXTURE.queueRuleA, FIXTURE.workspaceA, FIXTURE.brandA, 'rls-queue-a'],
    [FIXTURE.queueRuleB, FIXTURE.workspaceB, FIXTURE.brandB, 'rls-queue-b'],
  ] as const) {
    await client.query(
      `INSERT INTO app.queue_rules
         (id, workspace_id, brand_id, name, iana_time_zone, windows, minimum_gap_minutes,
          maximum_per_day, created_by_user_id, updated_at)
       VALUES ($1, $2, $3, $4, 'Europe/London',
               '[{"weekday":1,"startMinute":540,"endMinute":1020}]'::jsonb, 60, NULL, $5, now())
       ON CONFLICT (id) DO NOTHING`,
      [ruleId, workspaceId, brandId, name, USER_IDS.owner],
    );
  }

  for (const [slotId, workspaceId, brandId, ruleId, instant, local] of [
    [
      FIXTURE.queueSlotA,
      FIXTURE.workspaceA,
      FIXTURE.brandA,
      FIXTURE.queueRuleA,
      '2030-06-10T08:00:00.000Z',
      '2030-06-10T09:00',
    ],
    [
      FIXTURE.queueSlotB,
      FIXTURE.workspaceB,
      FIXTURE.brandB,
      FIXTURE.queueRuleB,
      '2030-06-10T09:00:00.000Z',
      '2030-06-10T10:00',
    ],
  ] as const) {
    await client.query(
      `INSERT INTO app.queue_slot_reservations
         (id, workspace_id, brand_id, queue_rule_id, state, scheduled_for, scheduled_time_zone,
          local_date_time, rule_snapshot, created_by_user_id, updated_at)
       VALUES ($1, $2, $3, $4, 'proposed', $5, 'Europe/London', $6,
               '{"reasons":[{"key":"queue.reason.matchedRule","values":{}}]}'::jsonb, $7, now())
       ON CONFLICT (id) DO NOTHING`,
      [slotId, workspaceId, brandId, ruleId, instant, local, USER_IDS.owner],
    );
  }

  // A scheduled job in workspace A, so the hold constraints have something real
  // to be asserted against.
  await client.query(
    `INSERT INTO app.publish_jobs
       (id, workspace_id, content_item_id, content_version_id, connection_id, scheduled_for,
        scheduled_time_zone, state, idempotency_key, updated_at)
     VALUES ($1, $2, $3, $4, $5, '2030-06-10T08:00:00.000Z', 'Europe/London', 'scheduled',
             'rls-fixture-job', now())
     ON CONFLICT (id) DO NOTHING`,
    [FIXTURE.publishJobA, FIXTURE.workspaceA, FIXTURE.itemA, FIXTURE.versionA, FIXTURE.connectionA],
  );

  // One memory per person per project. The editor's and the manager's rows are
  // both inside workspace A, which is what makes the self-row assertions below
  // meaningful: same tenant, same project, different people.
  for (const [memoryId, workspaceId, brandId, userId] of [
    [FIXTURE.memoryEditorA, FIXTURE.workspaceA, FIXTURE.brandA, USER_IDS.editor],
    [FIXTURE.memoryManagerA, FIXTURE.workspaceA, FIXTURE.brandA, USER_IDS.manager],
    [FIXTURE.memoryOutsiderB, FIXTURE.workspaceB, FIXTURE.brandB, WORKSPACE_B_OWNER_ID],
  ] as const) {
    await client.query(
      `INSERT INTO app.remembered_targets
         (id, workspace_id, brand_id, user_id, connection_ids, updated_at)
       VALUES ($1, $2, $3, $4, ARRAY[$5]::text[], now())
       ON CONFLICT (id) DO NOTHING`,
      [memoryId, workspaceId, brandId, userId, FIXTURE.connectionA],
    );
  }

  for (const [jobId, rowId, workspaceId, brandId, userId, checksum] of [
    [
      FIXTURE.importJobA,
      FIXTURE.importRowA,
      FIXTURE.workspaceA,
      FIXTURE.brandA,
      USER_IDS.owner,
      'a'.repeat(64),
    ],
    [
      FIXTURE.importJobB,
      FIXTURE.importRowB,
      FIXTURE.workspaceB,
      FIXTURE.brandB,
      WORKSPACE_B_OWNER_ID,
      'b'.repeat(64),
    ],
  ] as const) {
    await client.query(
      `INSERT INTO app.bulk_import_jobs
         (id, workspace_id, brand_id, state, filename, manifest_checksum, byte_size,
          parser_version, requested_by_user_id, updated_at)
       VALUES ($1, $2, $3, 'validated', 'manifest.csv', $4, 128, 'rls-test', $5, now())
       ON CONFLICT (id) DO NOTHING`,
      [jobId, workspaceId, brandId, checksum, userId],
    );
    await client.query(
      `INSERT INTO app.bulk_import_rows
         (id, workspace_id, bulk_import_job_id, external_row_key, line_number, state, updated_at)
       VALUES ($1, $2, $3, 'row-1', 2, 'valid', now())
       ON CONFLICT (id) DO NOTHING`,
      [rowId, workspaceId, jobId],
    );
  }

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
    [...ROLES.map((role) => USER_IDS[role]), WORKSPACE_B_OWNER_ID, OUTSIDER_USER_ID],
  ]);

  await client.query('COMMIT');
}
