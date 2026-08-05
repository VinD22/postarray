import { describe, expect, it } from 'vitest';

import {
  detectCompletion,
  experimentSchema,
  summarizeExperiment,
  tagBeforePublication,
  variantAgainstBaseline,
} from './experiments';
import type { Experiment } from './experiments';
import { makeHistory, makeObserved } from './test-support';

function makeExperiment(overrides: Partial<Experiment> = {}): Experiment {
  return experimentSchema.parse({
    id: 'exp_1',
    workspaceId: 'ws_1',
    hypothesis: 'Naming the change in the first line increases impressions.',
    successMetric: 'impressions',
    variants: [
      { id: 'a', label: 'Names the change', receiptIds: [] },
      { id: 'b', label: 'Names the problem', receiptIds: [] },
    ],
    windowStart: '2026-08-01T00:00:00Z',
    windowEnd: '2026-08-29T00:00:00Z',
    minimumSamplePerVariant: 2,
    state: 'running',
    caveats: ['Posting time is not held constant.'],
    ...overrides,
  });
}

describe('tagBeforePublication', () => {
  it('assigns a draft to a variant', () => {
    const result = tagBeforePublication({
      experiment: makeExperiment(),
      variantId: 'a',
      contentItemId: 'content_1',
      alreadyPublished: false,
    });

    expect(result.ok).toBe(true);
    expect(result.experiment.variants[0]?.receiptIds).toEqual(['content_1']);
  });

  it('refuses once the post already exists externally', () => {
    const result = tagBeforePublication({
      experiment: makeExperiment(),
      variantId: 'a',
      contentItemId: 'content_1',
      alreadyPublished: true,
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBe('ALREADY_PUBLISHED');
  });

  it('refuses an unknown variant', () => {
    const result = tagBeforePublication({
      experiment: makeExperiment(),
      variantId: 'zzz',
      contentItemId: 'content_1',
      alreadyPublished: false,
    });

    expect(result.error).toBe('UNKNOWN_VARIANT');
  });

  it('refuses to tag the same item twice', () => {
    const experiment = makeExperiment({
      variants: [
        { id: 'a', label: 'A', receiptIds: ['content_1'] },
        { id: 'b', label: 'B', receiptIds: [] },
      ],
    });
    const result = tagBeforePublication({
      experiment,
      variantId: 'b',
      contentItemId: 'content_1',
      alreadyPublished: false,
    });

    expect(result.error).toBe('RECEIPT_ALREADY_TAGGED');
  });

  it('refuses when the experiment is already complete', () => {
    const result = tagBeforePublication({
      experiment: makeExperiment({ state: 'complete' }),
      variantId: 'a',
      contentItemId: 'content_1',
      alreadyPublished: false,
    });

    expect(result.error).toBe('EXPERIMENT_NOT_RUNNING');
  });
});

describe('detectCompletion', () => {
  it('separates the window closing from the sample being reached', () => {
    const experiment = makeExperiment();

    const early = detectCompletion(experiment, new Date('2026-08-10T00:00:00Z'), { a: 1, b: 1 });
    expect(early.complete).toBe(false);
    expect(early.sampleReached).toBe(false);
    expect(early.shortfallByVariant['a']).toBe(1);

    const late = detectCompletion(experiment, new Date('2026-09-01T00:00:00Z'), { a: 2, b: 2 });
    expect(late.complete).toBe(true);
    expect(late.sampleReached).toBe(true);
    expect(late.shortfallByVariant['b']).toBe(0);
  });

  it('reports a closed window that never collected data', () => {
    const check = detectCompletion(makeExperiment(), new Date('2026-09-01T00:00:00Z'), {});
    expect(check.windowClosed).toBe(true);
    expect(check.sampleReached).toBe(false);
  });
});

describe('summarizeExperiment', () => {
  it('refuses to name a winner when a variant missed its minimum sample', () => {
    const experiment = makeExperiment({
      variants: [
        { id: 'a', label: 'A', receiptIds: ['receipt_a1'] },
        { id: 'b', label: 'B', receiptIds: ['receipt_b1'] },
      ],
    });
    const summary = summarizeExperiment(experiment, [
      makeObserved(2000, { receiptId: 'receipt_a1' }),
      makeObserved(1000, { receiptId: 'receipt_b1' }),
    ]);

    expect(summary.conclusive).toBe(false);
    expect(summary.leadingVariantId).toBeNull();
    expect(summary.caveats.map((entry) => entry.code)).toContain('SAMPLE_NOT_REACHED');
  });

  it('always carries the causation caveat', () => {
    const summary = summarizeExperiment(makeExperiment(), []);
    expect(summary.caveats.map((entry) => entry.code)).toContain('NO_CAUSATION');
  });

  it('counts unavailable readings separately instead of as zero', () => {
    const experiment = makeExperiment({
      variants: [
        { id: 'a', label: 'A', receiptIds: ['receipt_a1', 'receipt_a2'] },
        { id: 'b', label: 'B', receiptIds: ['receipt_b1'] },
      ],
    });
    const summary = summarizeExperiment(experiment, [
      makeObserved(2000, { receiptId: 'receipt_a1' }),
      makeObserved(null, { receiptId: 'receipt_a2' }),
      makeObserved(1000, { receiptId: 'receipt_b1' }),
    ]);

    const variantA = summary.variants.find((variant) => variant.variantId === 'a');
    expect(variantA?.sampleSize).toBe(1);
    expect(variantA?.unavailableCount).toBe(1);
    expect(variantA?.medianValue).toBe(2000);
    expect(summary.caveats.map((entry) => entry.code)).toContain('SOME_READINGS_UNAVAILABLE');
  });

  it('names a leader only with enough data and a difference outside the noise band', () => {
    const experiment = makeExperiment({
      minimumSamplePerVariant: 8,
      variants: [
        {
          id: 'a',
          label: 'A',
          receiptIds: Array.from({ length: 8 }, (_unused, index) => `receipt_a${index}`),
        },
        {
          id: 'b',
          label: 'B',
          receiptIds: Array.from({ length: 8 }, (_unused, index) => `receipt_b${index}`),
        },
      ],
    });
    const observations = [
      ...Array.from({ length: 8 }, (_unused, index) =>
        makeObserved(2000, { receiptId: `receipt_a${index}` }),
      ),
      ...Array.from({ length: 8 }, (_unused, index) =>
        makeObserved(1000, { receiptId: `receipt_b${index}` }),
      ),
    ];

    const summary = summarizeExperiment(experiment, observations);
    expect(summary.conclusive).toBe(true);
    expect(summary.leadingVariantId).toBe('a');
    expect(summary.relativeDifference).toBe(1);
  });
});

describe('variantAgainstBaseline', () => {
  it('falls back to the account baseline when only one variant has data', () => {
    const result = variantAgainstBaseline(
      'impressions',
      makeObserved(2000),
      makeHistory([1000, 1000, 1000, 1000, 1000]),
    );

    expect(result.outcome).toBe('compared');
    expect(result.direction).toBe('above');
  });
});
