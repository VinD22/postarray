import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CORE_PROVIDER_IDS, type CoreProviderId } from '@relay/contracts';

import {
  type LimitSource,
  buildProviderLimits,
  serializeProviderLimits,
} from '../src/marketing-limits-grid';
import { createConnectorRegistry } from '../src/registry';
import { createTestDeps, testConnection } from '../src/providers/shared/testing';
import { registerBuiltInProviders } from '../src/providers/index';
// Build time only. The reviewed connector records on the marketing site are the
// single place a citation is written by a person, so the generator reads them
// rather than restating a URL or a verification date of its own.
import { CONNECTOR_SOURCE } from '../../../apps/web/src/features/marketing/data/connectors';

const here = dirname(fileURLToPath(import.meta.url));
const outputPath = join(here, '../../../apps/web/src/features/marketing/data/publishing-limits.ts');

const { deps } = createTestDeps();
const registry = createConnectorRegistry([], { clock: deps.clock });
registerBuiltInProviders(registry, deps, { verifiedProviders: [] });

const citations: Partial<Record<CoreProviderId, LimitSource>> = {};
for (const record of CONNECTOR_SOURCE) {
  if ((CORE_PROVIDER_IDS as readonly string[]).includes(record.id)) {
    citations[record.id as CoreProviderId] = {
      url: record.primarySource.url,
      readOn: record.primarySource.readOn,
    };
  }
}

const limits = await buildProviderLimits(registry, {
  connectionFor: (provider) => testConnection({ provider }),
  citations,
});
writeFileSync(outputPath, serializeProviderLimits(limits), 'utf8');
