import { describe, expect, it } from 'vitest';

import { deriveOnboardingComplete, mergeStep } from './onboarding';

describe('deriveOnboardingComplete', () => {
  it('trusts an explicit completion above every other signal', () => {
    expect(
      deriveOnboardingComplete({
        explicitlyCompleted: true,
        activeProjectCount: 0,
        connectionCount: 0,
      }),
    ).toBe(true);
  });

  it('treats an established workspace as already onboarded', () => {
    // The case that matters: an account that predates the onboarding table.
    expect(
      deriveOnboardingComplete({
        explicitlyCompleted: false,
        activeProjectCount: 1,
        connectionCount: 1,
      }),
    ).toBe(true);
    expect(
      deriveOnboardingComplete({
        explicitlyCompleted: false,
        activeProjectCount: 4,
        connectionCount: 12,
      }),
    ).toBe(true);
  });

  it('requires both a project and a connection, not either', () => {
    expect(
      deriveOnboardingComplete({
        explicitlyCompleted: false,
        activeProjectCount: 1,
        connectionCount: 0,
      }),
    ).toBe(false);
    expect(
      deriveOnboardingComplete({
        explicitlyCompleted: false,
        activeProjectCount: 0,
        connectionCount: 1,
      }),
    ).toBe(false);
  });

  it('sends a genuinely new account into onboarding', () => {
    expect(
      deriveOnboardingComplete({
        explicitlyCompleted: false,
        activeProjectCount: 0,
        connectionCount: 0,
      }),
    ).toBe(false);
  });
});

describe('mergeStep', () => {
  it('appends a newly finished step in the order it happened', () => {
    expect(mergeStep([], 'plan')).toEqual(['plan']);
    expect(mergeStep(['plan'], 'workspace')).toEqual(['plan', 'workspace']);
  });

  it('does not duplicate or reorder a step the person went back to', () => {
    expect(mergeStep(['plan', 'workspace', 'use-case'], 'workspace')).toEqual([
      'plan',
      'workspace',
      'use-case',
    ]);
  });

  it('returns a fresh array rather than mutating the stored one', () => {
    const existing = ['plan'];
    const merged = mergeStep(existing, 'workspace');
    expect(existing).toEqual(['plan']);
    expect(merged).not.toBe(existing);
  });
});
