import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadConfigFor } from '@relay/config';

import {
  buildPublicMarketingCapabilityStates,
  serializeMarketingCapabilityStates,
} from '../src/marketing-capability-grid';
import { createConnectorRegistry } from '../src/registry';
import { createTestDeps } from '../src/providers/shared/testing';
import { registerBuiltInProviders } from '../src/providers/index';

const here = dirname(fileURLToPath(import.meta.url));
const outputPath = join(
  here,
  '../../../apps/web/src/features/marketing/data/registry-capability-states.ts',
);

const config = loadConfigFor('api', {
  NODE_ENV: 'development',
  APP_URL: 'https://app.example.test',
  API_URL: 'https://api.example.test',
  DATABASE_URL: 'postgresql://relay:relay@localhost:5432/relay',
  TOKEN_ENCRYPTION_LOCAL_KEY: Buffer.alloc(32, 7).toString('base64'),
});
const { deps } = createTestDeps({ config });
const registry = createConnectorRegistry([], { clock: deps.clock });
registerBuiltInProviders(registry, deps, { verifiedProviders: [] });
const states = buildPublicMarketingCapabilityStates(registry);
writeFileSync(outputPath, serializeMarketingCapabilityStates(states), 'utf8');
