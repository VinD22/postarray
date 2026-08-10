import { describe, expect, it } from 'vitest';

import { CAPABILITY_COLUMNS, CONNECTOR_SOURCE } from './connectors';
import { REGISTRY_MARKETING_CAPABILITY_STATES } from './registry-capability-states';

/**
 * Cohort platforms that are documented on the public matrix but have no adapter
 * in the connector registry, so the generator emits no states for them.
 *
 * An exact set, not a ceiling. When an adapter lands, the second assertion below
 * fails and whoever built it has to remove the name here, which is the point:
 * "documented but not built" should never quietly become permanent.
 */
const DOCUMENTED_WITHOUT_ADAPTER = ['google_business_profile'] as const;

describe('registry marketing capability states', () => {
  it('covers every connector on the public matrix that has an adapter', () => {
    for (const connector of CONNECTOR_SOURCE) {
      if ((DOCUMENTED_WITHOUT_ADAPTER as readonly string[]).includes(connector.id)) {
        continue;
      }
      expect(connector.id in REGISTRY_MARKETING_CAPABILITY_STATES).toBe(true);
    }
  });

  it('still has no adapter for the platforms named as unbuilt', () => {
    for (const provider of DOCUMENTED_WITHOUT_ADAPTER) {
      expect(
        provider in REGISTRY_MARKETING_CAPABILITY_STATES,
        `${provider} now has an adapter; remove it from DOCUMENTED_WITHOUT_ADAPTER`,
      ).toBe(false);
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
