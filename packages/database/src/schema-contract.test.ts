import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { ID_PREFIX_VALUES } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

const packageRoot = path.resolve(import.meta.dirname, '..');
const schema = readFileSync(path.join(packageRoot, 'prisma/schema.prisma'), 'utf8');
const baseline = readFileSync(path.join(packageRoot, 'migrations/0004_core_schema.sql'), 'utf8');

function modelIdDefaults(source: string): ReadonlyMap<string, string> {
  const defaults = new Map<string, string>();
  const modelPattern = /model (\w+) \{([\s\S]*?)\n\}/gu;
  for (const model of source.matchAll(modelPattern)) {
    const name = model[1];
    const body = model[2];
    const prefix = body?.match(/\bid\s+String\s+@id\s+@default\(dbgenerated\("app\.new_id\('([^']+)'\)"\)\)/u)?.[1];
    if (name !== undefined && prefix !== undefined) defaults.set(name, prefix);
  }
  return defaults;
}

describe('database schema contract', () => {
  it('uses one registered prefixed identifier representation for every model', () => {
    const defaults = modelIdDefaults(schema);
    const modelCount = [...schema.matchAll(/^model /gmu)].length;

    expect(defaults.size).toBe(modelCount);
    for (const prefix of defaults.values()) {
      expect(ID_PREFIX_VALUES).toContain(prefix);
    }
    expect(schema).not.toContain('@db.Uuid');
  });

  it('keeps the immutable core baseline aligned with every model id default', () => {
    for (const prefix of modelIdDefaults(schema).values()) {
      expect(baseline).toContain(`DEFAULT app.new_id('${prefix}')`);
    }
  });

  it('keeps post-baseline migrations additive and free of legacy UUID columns', () => {
    const migrationDirectory = path.join(packageRoot, 'migrations');
    const laterSql = readdirSync(migrationDirectory)
      .filter((name) => /^00(?:1\d|[2-9]\d)_.*\.sql$/u.test(name))
      .map((name) => readFileSync(path.join(migrationDirectory, name), 'utf8'))
      .join('\n');

    expect(laterSql).not.toMatch(/\bCREATE\s+TABLE\b/iu);
    expect(laterSql).not.toMatch(/\buuid(?:\[\])?\b/iu);
  });
});
