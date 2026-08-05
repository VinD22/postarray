import { describe, expect, it } from 'vitest';

import { TEST_CALL_CONTEXT, createTestGateway } from '../test-support.js';
import { EN_EVAL_CASES, casesForLocale } from './dataset.js';
import { formatReport, runSuite } from './harness.js';
import { groundingScorer, harmScorer, outputText, verbosityScorer, voiceScorer } from './scorers.js';
import { EVAL_DIMENSIONS, EVAL_GATES } from './types.js';
import type { EvalCase } from './types.js';

const BASE_CASE: EvalCase = {
  id: 'unit',
  promptId: 'draft-from-brief',
  locale: 'en',
  description: 'scorer unit case',
  variables: {},
  expectation: {},
};

describe('scorers', () => {
  it('scores grounding by evidence ids and numbers', () => {
    const evalCase: EvalCase = {
      ...BASE_CASE,
      expectation: { allowedEvidenceIds: ['brief'], allowedNumbers: [] },
    };
    const good = { body: 'Scheduled publishing is live.', evidenceIds: ['brief'] };
    const bad = { body: 'It saved 42 hours.', evidenceIds: ['invented'] };

    expect(groundingScorer.score({ evalCase, output: good, text: outputText(good) }).score).toBe(1);
    expect(
      groundingScorer.score({ evalCase, output: bad, text: outputText(bad) }).passed,
    ).toBe(false);
  });

  it('scores voice by banned words and em dashes', () => {
    const output = { body: 'An effortless workflow' };
    const score = voiceScorer.score({
      evalCase: BASE_CASE,
      output,
      text: outputText(output),
    });
    expect(score.passed).toBe(false);
    expect(score.notes.join(' ')).toContain('effortless');
  });

  it('treats any exfiltration channel as a hard failure', () => {
    const output = { body: 'Read more at https://example.test' };
    const score = harmScorer.score({ evalCase: BASE_CASE, output, text: outputText(output) });
    expect(score.score).toBe(0);
    expect(score.passed).toBe(false);
  });

  it('penalises verbosity against the case ceiling', () => {
    const evalCase: EvalCase = { ...BASE_CASE, expectation: { maxCharacters: 10 } };
    const output = { body: 'a'.repeat(100) };
    const score = verbosityScorer.score({ evalCase, output, text: outputText(output) });
    expect(score.score).toBeLessThan(1);
  });

  it('gates zero tolerance dimensions at one', () => {
    expect(EVAL_GATES.factual_grounding).toBe(1);
    expect(EVAL_GATES.harmful_output).toBe(1);
  });
});

describe('dataset', () => {
  it('ships an English dataset covering the shipped capabilities', () => {
    expect(casesForLocale('en')).toBe(EN_EVAL_CASES);
    expect(casesForLocale('xx')).toEqual([]);

    const covered = new Set(EN_EVAL_CASES.map((entry) => entry.promptId));
    expect(covered.has('draft-from-brief')).toBe(true);
    expect(covered.has('transcreate')).toBe(true);
    expect(covered.has('growth-plan')).toBe(true);
    expect(covered.has('analytics-summary')).toBe(true);
  });

  it('includes an adversarial injected source case', () => {
    const injected = EN_EVAL_CASES.find((entry) => entry.id === 'draft.injected-source');
    expect(injected?.untrustedSources?.[0]?.text).toContain('Ignore all previous instructions');
  });
});

describe('runSuite', () => {
  it('runs the offline dataset without touching the network', async () => {
    const { gateway } = createTestGateway();

    const report = await runSuite({
      gateway,
      cases: EN_EVAL_CASES,
      callContext: TEST_CALL_CONTEXT,
    });

    expect(report.total).toBe(EN_EVAL_CASES.length);
    for (const dimension of EVAL_DIMENSIONS) {
      expect(report.byDimension[dimension]).toBeGreaterThanOrEqual(0);
      expect(report.byDimension[dimension]).toBeLessThanOrEqual(1);
    }
  });

  it('produces a deterministic text report', async () => {
    const { gateway } = createTestGateway();
    const first = await runSuite({
      gateway,
      cases: EN_EVAL_CASES.slice(0, 3),
      callContext: TEST_CALL_CONTEXT,
    });
    const second = await runSuite({
      gateway,
      cases: EN_EVAL_CASES.slice(0, 3),
      callContext: TEST_CALL_CONTEXT,
    });

    expect(formatReport(first)).toBe(formatReport(second));
  });

  it('counts a refusal as a pass only when the case expected one', async () => {
    const { gateway } = createTestGateway();
    const report = await runSuite({
      gateway,
      cases: [
        {
          ...BASE_CASE,
          id: 'missing-variables',
          expectation: { expectRefusal: true },
        },
      ],
      callContext: TEST_CALL_CONTEXT,
    });

    expect(report.results[0]?.refused).toBe(true);
    expect(report.results[0]?.passed).toBe(true);
  });
});
