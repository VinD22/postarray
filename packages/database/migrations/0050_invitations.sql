-- 0050_invitations.sql
-- Invitation tables and indexes are part of the reviewed core schema. This
-- migration adds the cross-row ownership and lifecycle constraints Prisma
-- cannot express, then applies the server-only tenant policy.

ALTER TABLE private.invitations
  DROP CONSTRAINT IF EXISTS invitations_workspace_id_fkey,
  ADD CONSTRAINT invitations_workspace_id_fkey
    FOREIGN KEY (workspace_id) REFERENCES app.workspaces(id) ON DELETE CASCADE,
  DROP CONSTRAINT IF EXISTS invitations_invited_by_user_id_fkey,
  ADD CONSTRAINT invitations_invited_by_user_id_fkey
    FOREIGN KEY (invited_by_user_id) REFERENCES app.users(id) ON DELETE RESTRICT,
  DROP CONSTRAINT IF EXISTS invitations_lifecycle_consistent,
  ADD CONSTRAINT invitations_lifecycle_consistent CHECK (
    (state = 'pending' AND accepted_at IS NULL AND revoked_at IS NULL)
    OR (state = 'accepted' AND accepted_at IS NOT NULL AND revoked_at IS NULL)
    OR (state = 'revoked' AND revoked_at IS NOT NULL AND accepted_at IS NULL)
    OR (state = 'expired' AND accepted_at IS NULL AND revoked_at IS NULL)
  );

SELECT private.apply_tenant_policies(
  'private',
  'invitations',
  'workspace_id',
  'service',
  'service',
  'service',
  'service',
  'Invitation addresses and token digests are server-side membership material.'
);
