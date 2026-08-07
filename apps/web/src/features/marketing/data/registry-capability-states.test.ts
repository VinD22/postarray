import { describe, expect, it } from 'vitest';

import { CAPABILITY_COLUMNS, CONNECTOR_SOURCE } from './connectors';
import { REGISTRY_MARKETING_CAPABILITY_STATES } from './registry-capability-states';

describe('registry marketing capability states', () => {
  it('covers every connector on the public matrix', () => {
    for (const connector of CONNECTOR_SOURCE) {
      expect(connector.id in REGISTRY_MARKETING_CAPABILITY_STATES).toBe(true);
    }
  });

  it('defines every capability column for every provider', () => {
    for (const connector of CONNECTOR_SOURCE) {
      if (!(connector.id in REGISTRY_MARKETING_CAPABILITY_STATES)) {
        continue;
      }
      const row =
        REGISTRY_MARKETING_CAPABILITY_STATES[
          connector.id as keyof typeof REGISTRY_MARKETING_CAPABILITY_STATES
        ];
      expect(row).toBeDefined();
      for (const column of CAPABILITY_COLUMNS) {
        expect(row?.[column]).toBeDefined();
      }
    }
  });

  it('never marks a cell supported on the public matrix', () => {
    for (const row of Object.values(REGISTRY_MARKETING_CAPABILITY_STATES)) {
      for (const state of Object.values(row)) {
        expect(state).not.toBe('supported');
      }
    }
  });
});
