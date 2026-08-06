-- Single-use workspace invitations. The bearer token is represented only by
-- its SHA-256 digest, and private schema access remains service-only.

DO $$ BEGIN
  CREATE TYPE private.invitation_state AS ENUM ('pending', 'accepted', 'revoked', 'expired');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS private.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES app.workspaces(id) ON DELETE CASCADE,
  email citext NOT NULL,
  role app.workspace_role NOT NULL,
  note text,
  token_hash text NOT NULL UNIQUE,
  state private.invitation_state NOT NULL DEFAULT 'pending',
  invited_by_user_id uuid NOT NULL REFERENCES app.users(id) ON DELETE RESTRICT,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT invitations_lifecycle_consistent CHECK (
    (state = 'pending' AND accepted_at IS NULL AND revoked_at IS NULL)
    OR (state = 'accepted' AND accepted_at IS NOT NULL AND revoked_at IS NULL)
    OR (state = 'revoked' AND revoked_at IS NOT NULL AND accepted_at IS NULL)
    OR (state = 'expired' AND accepted_at IS NULL AND revoked_at IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS invitations_workspace_idx
  ON private.invitations(workspace_id);
CREATE INDEX IF NOT EXISTS invitations_workspace_state_expiry_idx
  ON private.invitations(workspace_id, state, expires_at);
CREATE INDEX IF NOT EXISTS invitations_email_state_idx
  ON private.invitations(email, state);

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
