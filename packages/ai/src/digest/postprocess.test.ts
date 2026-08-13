import { describe, expect, it } from 'vitest';

import { postProcessDigest } from './postprocess';
import type { WeeklyDigestResult } from './schema';
import { makeReceiptsOnlyRetrieval } from './testing';

const RETRIEVAL = makeReceiptsOnlyRetrieval();

function makeDigest(overrides: Partial<WeeklyDigestResult> = {}): WeeklyDigestResult {
  return {
    headline: 'Some publications went out and nothing has been measured yet.',
    observations: [
      {
        statement:
          'One publication reached some destinations and not others, and is recorded as partial.',
        evidenceIds: ['receipt_a', 'receipt_b'],
        confidence: 'high',
        confounders: ['A partial publication may still be retried.'],
      },
    ],
    notSupported: ['No metrics have been synced for this window.'],
    suggestedNextAction: null,
    sampleIsSmall: true,
    uncertain: false,
    uncertaintyReason: null,
    ...overrides,
  };
}

describe('postProcessDigest', () => {
  it('accepts prose that restates the retrieved rows', () => {
    const result = postProcessDigest({ output: makeDigest(), retrieval: RETRIEVAL });

    expect(result.violations).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('D1 rejects a digest that invented a metric', () => {
    // The poisoned fixture. 4820 appears nowhere in the retrieval payload, so
    // the model either measured something we did not, or made it up.
    const poisoned = makeDigest({
      observations: [
        {
          statement: 'Your posts reached 4820 people this week, well above your usual reach.',
          evidenceIds: ['receipt_a'],
          confidence: 'high',
          confounders: ['Posting time varied.'],
        },
      ],
    });

    const result = postProcessDigest({ output: poisoned, retrieval: RETRIEVAL });

    expect(result.ok).toBe(false);
    expect(result.digest).toBeNull();
    expect(result.violations.map((violation) => violation.rule)).toContain('D1_INVENTED_NUMBER');
    expect(result.violations.some((violation) => violation.excerpt === '4820')).toBe(true);
  });

  it('allows a count of the evidence ids the model itself listed', () => {
    const result = postProcessDigest({
      output: makeDigest({
        observations: [
          {
            statement: 'Both of these publications completed.',
            evidenceIds: ['receipt_a', 'receipt_b'],
            confidence: 'high',
            confounders: ['2 publications is a small sample.'],
          },
        ],
      }),
      retrieval: RETRIEVAL,
    });

    expect(result.ok).toBe(true);
  });

  it('D2 rejects evidence that was never supplied', () => {
    const result = postProcessDigest({
      output: makeDigest({
        observations: [
          {
            statement: 'Something happened.',
            evidenceIds: ['receipt_never_retrieved'],
            confidence: 'low',
            confounders: ['Unknown.'],
          },
        ],
      }),
      retrieval: RETRIEVAL,
    });

    expect(result.violations.map((violation) => violation.rule)).toContain(
      'D2_UNKNOWN_EVIDENCE_ID',
    );
  });

  it('D3 rejects an association written as a cause', () => {
    const result = postProcessDigest({
      output: makeDigest({
        headline: 'Posting earlier caused more people to see your work.',
      }),
      retrieval: RETRIEVAL,
    });

    expect(result.violations.map((violation) => violation.rule)).toContain('D3_CAUSAL_LANGUAGE');
  });

  it('rejects output that does not match the schema at all', () => {
    const result = postProcessDigest({ output: { headline: 42 }, retrieval: RETRIEVAL });

    expect(result.ok).toBe(false);
  });
});
