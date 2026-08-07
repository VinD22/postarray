ALTER TABLE private.oauth_clients
  ADD COLUMN IF NOT EXISTS support_email TEXT;

ALTER TABLE private.oauth_clients
  ADD CONSTRAINT oauth_clients_support_email_length
  CHECK (support_email IS NULL OR char_length(support_email) BETWEEN 3 AND 320);
