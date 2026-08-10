-- Preserve the evidence boundary used by the Growth Advisor. User supplied
-- proof, model assumptions, prohibited claims and prohibited topics must not
-- be collapsed into one untyped notes field.

ALTER TABLE "app"."business_profiles"
  ADD COLUMN IF NOT EXISTS "proof_assets" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "assumptions" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS "prohibited_topics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
