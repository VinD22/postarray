import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n/messages';

import {
  CAPABILITY_COLUMNS,
  CAPABILITY_SNAPSHOT,
  CONNECTORS,
  capabilityLabelKey,
  capabilityStateCounts,
} from './connectors';

/**
 * These are the merge gates for the public capability matrix. Each one exists
 * because breaking it would publish a claim we cannot stand behind.
 */
describe('public connector capability data', () => {
  it('gives every connector a cell for every capability column', () => {
    for (const connector of CONNECTORS) {
      for (const column of CAPABILITY_COLUMNS) {
        expect(connector.capabilities[column], `${connector.id}.${column}`).toBeDefined();
      }
    }
  });

  it('never claims a capability is supported, because no connector has passed its definition of done', () => {
    const counts = capabilityStateCounts();
    expect(counts.supported).toBe(0);
  });

  it('explains every cell that is not simply unbuilt', () => {
    for (const connector of CONNECTORS) {
      for (const column of CAPABILITY_COLUMNS) {
        const cell = connector.capabilities[column];
        if (cell.state === 'unsupported' || cell.state === 'requires_review') {
          expect(cell.noteKey, `${connector.id}.${column} needs a note`).toBeDefined();
        }
      }
    }
  });

  it('cites an official source for every claim about what a platform allows', () => {
    for (const connector of CONNECTORS) {
      for (const column of CAPABILITY_COLUMNS) {
        const cell = connector.capabilities[column];
        if (cell.state !== 'requires_review') {
          continue;
        }
        expect(cell.citation, `${connector.id}.${column} needs a citation`).toBeDefined();
        expect(cell.citation?.url).toMatch(/^https:\/\//);
        expect(cell.citation?.readOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it('records a primary and a policy source for every connector', () => {
    for (const connector of CONNECTORS) {
      expect(connector.primarySource.url, connector.id).toMatch(/^https:\/\//);
      expect(connector.policySource.url, connector.id).toMatch(/^https:\/\//);
    }
  });

  it('resolves every message key it references', () => {
    const catalog = en as Record<string, string | undefined>;
    for (const column of CAPABILITY_COLUMNS) {
      expect(catalog[capabilityLabelKey(column)], column).toBeDefined();
    }
    for (const connector of CONNECTORS) {
      for (const key of [
        connector.nameKey,
        connector.accountTypesKey,
        connector.restrictionKey,
        connector.costKey,
      ]) {
        expect(catalog[key], key).toBeDefined();
      }
      for (const column of CAPABILITY_COLUMNS) {
        const noteKey = connector.capabilities[column].noteKey;
        if (noteKey) {
          expect(catalog[noteKey], noteKey).toBeDefined();
        }
      }
    }
  });

  it('counts every cell exactly once', () => {
    const counts = capabilityStateCounts();
    const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
    expect(total).toBe(CONNECTORS.length * CAPABILITY_COLUMNS.length);
  });

  it('carries a dated, reviewable snapshot', () => {
    expect(CAPABILITY_SNAPSHOT.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Date(CAPABILITY_SNAPSHOT.nextReviewOn).getTime()).toBeGreaterThan(
      new Date(CAPABILITY_SNAPSHOT.reviewedOn).getTime(),
    );
  });
});
