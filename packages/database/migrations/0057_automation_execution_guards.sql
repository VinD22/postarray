-- Keep the per-source threshold guard separate from the rule's lifetime run
-- limit. Reusing max_executions for both would make a rule configured to run
-- once per source stop forever after its first source.

ALTER TABLE "app"."automation_rules"
  ADD COLUMN "max_executions_per_source" INTEGER;

ALTER TABLE "app"."automation_rules"
  ADD CONSTRAINT "automation_rules_max_executions_per_source_positive"
  CHECK ("max_executions_per_source" IS NULL OR "max_executions_per_source" > 0);
