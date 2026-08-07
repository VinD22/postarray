import { describe, expect, it } from 'vitest';

import { createFakeConnector } from './fake';
import { buildMarketingCapabilityStates } from './marketing-capability-grid';
import { createConnectorRegistry } from './registry';

describe('marketing capability grid', () => {
  it('maps registry features into marketing columns', () => {
    const registry = createConnectorRegistry([createFakeConnector({ instant: true })]);
    const states = buildMarketingCapabilityStates(registry);
    expect(states.fake?.text).toBe('supported');
    expect(states.fake?.document).toBe('not_implemented');
  });
});
