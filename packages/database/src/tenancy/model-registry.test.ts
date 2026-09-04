import { describe, expect, it } from 'vitest';

import { Prisma } from '@prisma/client';

import { GLOBAL_MODELS, TENANT_MODELS } from './model-registry';

/**
 * The registry is written by hand, and `model-registry.ts` explains why: a list
 * generated from Prisma would silently accept a new table that forgot
 * `workspace_id`, which is the exact mistake we want to fail loudly on.
 *
 * The cost of writing it by hand is that a model can be added to the schema and
 * forgotten here, and the failure is invisible until a query runs: `withWorkspace`
 * throws `tenantModelUnscoped` for anything it does not recognise. That is what
 * happened to `postCreditBalance`, so every workspace without a paid entitlement
 * row threw on the free-plan credit check rather than being told it had credits.
 *
 * This test keeps the hand-written property and removes the silence. It does not
 * decide which set a model belongs in, because that is the judgement the file
 * exists to record. It only insists that somebody made the decision.
 */
describe('model registry completeness', () => {
  const schemaModels = Prisma.dmmf.datamodel.models.map((model) =>
    // The DMMF gives PascalCase model names; the registry stores Prisma delegate
    // names, which are the same string with a lowercased first character.
    `${model.name.charAt(0).toLowerCase()}${model.name.slice(1)}`,
  );

  it('classifies every model in the Prisma schema as tenant owned or global', () => {
    const unclassified = schemaModels
      .filter((model) => !TENANT_MODELS.has(model) && !GLOBAL_MODELS.has(model))
      .sort();

    expect(
      unclassified,
      'Add each of these to TENANT_MODELS (it carries workspace_id) or GLOBAL_MODELS (it does not), in packages/database/src/tenancy/model-registry.ts. A model in neither set throws tenantModelUnscoped the first time a workspace-scoped query touches it.',
    ).toEqual([]);
  });

  it('names no model that the schema does not have', () => {
    const known = new Set(schemaModels);
    const stale = [...TENANT_MODELS, ...GLOBAL_MODELS].filter((model) => !known.has(model)).sort();

    // A stale entry is harmless at runtime and misleading to a reader: it looks
    // like a decision about a table that no longer exists.
    expect(stale, 'These are registered but absent from the Prisma schema.').toEqual([]);
  });

  it('puts no model in both sets', () => {
    const both = [...TENANT_MODELS].filter((model) => GLOBAL_MODELS.has(model)).sort();
    expect(both, 'A model is either workspace owned or it is not.').toEqual([]);
  });

  it('registers the four models whose absence broke live paths', () => {
    // Regression pins. `postCreditBalance` broke the free-plan publishing check
    // and `agentConfirmation` broke the human-confirmation escalation the MCP
    // publish path depends on.
    for (const model of [
      'postCreditBalance',
      'postCreditLedgerEntry',
      'agentConfirmation',
      'seoKeywordTarget',
    ]) {
      expect(TENANT_MODELS.has(model), model).toBe(true);
    }
  });
});
