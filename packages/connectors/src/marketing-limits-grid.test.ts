import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';
import { CORE_PROVIDER_IDS, type CoreProviderId } from '@relay/contracts';

import {
  LIMIT_PROVIDERS,
  PROVIDER_COUNTING_UNITS,
  type LimitSource,
  type ProviderLimits,
  buildProviderLimits,
  serializeProviderLimits,
} from './marketing-limits-grid';
import { createConnectorRegistry } from './registry';
import { registerBuiltInProviders } from './providers/index';
import { createTestDeps, testConnection } from './providers/shared/testing';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * The generated dataset lives in `apps/web`, outside this package's `rootDir`,
 * so it is read as text rather than imported. That is also the stricter test:
 * it compares the committed bytes, not a re-export of them.
 */
const GENERATED_PATH = join(
  here,
  '../../../apps/web/src/features/marketing/data/publishing-limits.ts',
);

const ASSIGNMENT = 'export const PUBLISHING_LIMITS';

function readCommittedFile(): string {
  return readFileSync(GENERATED_PATH, 'utf8');
}

/** The committed table. The serializer emits valid JSON for the object body. */
function readCommittedTable(): Readonly<Record<string, ProviderLimits | undefined>> {
  const text = readCommittedFile();
  const assignment = text.indexOf(ASSIGNMENT);
  const body = text.slice(text.indexOf('{', assignment), text.lastIndexOf('}') + 1);
  return JSON.parse(body) as Record<string, ProviderLimits>;
}

function buildRegistry(): ReturnType<typeof createConnectorRegistry> {
  const { deps } = createTestDeps();
  const registry = createConnectorRegistry([], { clock: deps.clock });
  registerBuiltInProviders(registry, deps, { verifiedProviders: [] });
  return registry;
}

function connectionFor(provider: Parameters<typeof testConnection>[0]['provider']) {
  return testConnection({ provider });
}

/** Where each cohort adapter's `connector.ts` lives, relative to `src/providers`. */
const ADAPTER_DIRECTORIES: Readonly<Partial<Record<CoreProviderId, string>>> = {
  x: 'x',
  instagram: 'meta/instagram',
  facebook: 'meta/facebook',
  linkedin: 'linkedin',
  tiktok: 'tiktok',
  youtube: 'youtube',
  pinterest: 'pinterest',
  bluesky: 'bluesky',
  threads: 'meta/threads',
};

describe('marketing publishing limits grid', () => {
  it('covers the launch cohort in cohort order', () => {
    expect(LIMIT_PROVIDERS).toEqual(CORE_PROVIDER_IDS);
  });

  it('keeps the committed dataset in sync with the connector registry', async () => {
    const committed = readCommittedTable();
    const built = await buildProviderLimits(buildRegistry(), { connectionFor });
    for (const provider of LIMIT_PROVIDERS) {
      // The citation is written by a person on the marketing connector record
      // and is deliberately not rebuilt here, so it is compared separately.
      expect({ ...committed[provider], source: null }, provider).toEqual({
        ...built[provider],
        source: null,
      });
    }
  });

  it('regenerates byte for byte from the registry', async () => {
    const committed = readCommittedTable();
    const citations: Partial<Record<CoreProviderId, LimitSource>> = {};
    for (const provider of LIMIT_PROVIDERS) {
      const source = committed[provider]?.source;
      if (source) {
        citations[provider] = { url: source.url, readOn: source.readOn };
      }
    }
    const built = await buildProviderLimits(buildRegistry(), { connectionFor, citations });
    expect(serializeProviderLimits(built)).toBe(readCommittedFile());
  });

  it('declares the counting unit each adapter actually validates with', () => {
    for (const [provider, directory] of Object.entries(ADAPTER_DIRECTORIES)) {
      const source = readFileSync(join(here, 'providers', directory, 'connector.ts'), 'utf8');
      const units = new Set(
        [...source.matchAll(/unit: '(utf16|grapheme|weighted)'/gu)].map((match) => match[1]),
      );
      expect(units.size, `${provider} uses more than one counting unit`).toBe(1);
      expect([...units][0], provider).toBe(PROVIDER_COUNTING_UNITS[provider as CoreProviderId]);
    }
  });

  it('never reports a missing adapter as zero', () => {
    const committed = readCommittedTable();
    for (const provider of LIMIT_PROVIDERS) {
      const row = committed[provider];
      if (row?.adapterPresent === false) {
        expect(row.text).toBeNull();
        expect(row.media).toBeNull();
        expect(row.maxTitleLength).toBeNull();
        expect(row.countingUnit).toBeNull();
      }
    }
  });
});
