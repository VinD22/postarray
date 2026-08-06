import { describe, expect, it } from 'vitest';

import {
  confirmationMatchesContent,
  confirmationMatchesEscalations,
} from './publish-confirmation';

const evidence = {
  acknowledgedTargetCount: 2,
  acknowledgedVersionChecksum: 'a'.repeat(64),
  acknowledgedEscalations: ['immediate_publish', 'first_use_connection'],
} as const;

describe('publish confirmation evidence', () => {
  it('matches only the exact content checksum and target count', () => {
    expect(
      confirmationMatchesContent(evidence, {
        targetCount: 2,
        checksum: 'a'.repeat(64),
      }),
    ).toBe(true);
    expect(
      confirmationMatchesContent(evidence, {
        targetCount: 3,
        checksum: 'a'.repeat(64),
      }),
    ).toBe(false);
    expect(
      confirmationMatchesContent(evidence, {
        targetCount: 2,
        checksum: 'b'.repeat(64),
      }),
    ).toBe(false);
  });

  it('requires the exact escalation set regardless of order or duplicates', () => {
    expect(
      confirmationMatchesEscalations(evidence, [
        'first_use_connection',
        'immediate_publish',
        'first_use_connection',
      ]),
    ).toBe(true);
    expect(confirmationMatchesEscalations(evidence, ['immediate_publish'])).toBe(false);
    expect(
      confirmationMatchesEscalations(evidence, [
        'immediate_publish',
        'first_use_connection',
        'privacy_change',
      ]),
    ).toBe(false);
  });
});
