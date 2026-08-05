import { RelayError } from '@relay/contracts';

import { getPrompt } from '../prompts/registry.js';
import type { AiCallContext, AiGateway } from '../types.js';
import { ALL_SCORERS, outputText } from './scorers.js';
import { EVAL_DIMENSIONS } from './types.js';
import type { CaseResult, EvalCase, EvalDimension, Scorer, SuiteReport } from './types.js';

/**
 * The evaluation harness.
 *
 * It runs a scored dataset through a gateway. With the echo provider it is a
 * deterministic regression suite that never touches the network; with a real
 * provider it is the gate a prompt version change has to clear.
 */

export interface RunSuiteOptions {
  readonly gateway: AiGateway;
  readonly cases: readonly EvalCase[];
  readonly callContext: AiCallContext;
  readonly scorers?: readonly Scorer[];
}

async function runCase(options: RunSuiteOptions, evalCase: EvalCase): Promise<CaseResult> {
  const prompt = getPrompt(evalCase.promptId);
  const scorers = options.scorers ?? ALL_SCORERS;

  try {
    const result = await options.gateway.completeStructured(prompt.schema, {
      context: { ...options.callContext, locale: evalCase.locale },
      promptId: evalCase.promptId,
      promptVersion: prompt.version,
      variables: evalCase.variables,
      ...(evalCase.untrustedSources === undefined
        ? {}
        : { untrustedSources: evalCase.untrustedSources }),
    });

    if (evalCase.expectation.expectRefusal === true) {
      return {
        caseId: evalCase.id,
        promptId: evalCase.promptId,
        locale: evalCase.locale,
        scores: [],
        passed: false,
        refused: false,
        errorCode: null,
      };
    }

    const text = outputText(result.output);
    const scores = scorers.map((scorer) => scorer.score({ evalCase, output: result.output, text }));
    return {
      caseId: evalCase.id,
      promptId: evalCase.promptId,
      locale: evalCase.locale,
      scores,
      passed: scores.every((score) => score.passed),
      refused: false,
      errorCode: null,
    };
  } catch (error) {
    const relay = RelayError.fromUnknown(error);
    // A refusal is the correct answer for an adversarial case.
    return {
      caseId: evalCase.id,
      promptId: evalCase.promptId,
      locale: evalCase.locale,
      scores: [],
      passed: evalCase.expectation.expectRefusal === true,
      refused: true,
      errorCode: relay.code,
    };
  }
}

function averageByDimension(results: readonly CaseResult[]): Record<EvalDimension, number> {
  const totals = new Map<EvalDimension, { sum: number; count: number }>();
  for (const dimension of EVAL_DIMENSIONS) {
    totals.set(dimension, { sum: 0, count: 0 });
  }
  for (const result of results) {
    for (const score of result.scores) {
      const bucket = totals.get(score.dimension);
      if (bucket !== undefined) {
        bucket.sum += score.score;
        bucket.count += 1;
      }
    }
  }
  // A dimension with no scored case is reported as 1 rather than 0, because no
  // evidence is not the same as a failure.
  const average = (dimension: EvalDimension): number => {
    const bucket = totals.get(dimension);
    return bucket === undefined || bucket.count === 0 ? 1 : bucket.sum / bucket.count;
  };
  return {
    factual_grounding: average('factual_grounding'),
    voice_adherence: average('voice_adherence'),
    platform_compliance: average('platform_compliance'),
    harmful_output: average('harmful_output'),
    verbosity: average('verbosity'),
  };
}

/** Run every case sequentially. Order is stable so reports diff cleanly. */
export async function runSuite(options: RunSuiteOptions): Promise<SuiteReport> {
  const results: CaseResult[] = [];
  for (const evalCase of options.cases) {
    results.push(await runCase(options, evalCase));
  }
  const passed = results.filter((result) => result.passed).length;
  return {
    total: results.length,
    passed,
    failed: results.length - passed,
    byDimension: averageByDimension(results),
    results,
    gatesMet: passed === results.length,
  };
}

/** A compact, deterministic text report for a pull request comment. */
export function formatReport(report: SuiteReport): string {
  const lines = [
    `cases: ${report.total}, passed: ${report.passed}, failed: ${report.failed}`,
    ...EVAL_DIMENSIONS.map(
      (dimension) => `${dimension}: ${report.byDimension[dimension].toFixed(3)}`,
    ),
  ];
  for (const result of report.results) {
    if (result.passed) {
      continue;
    }
    const notes = result.scores
      .filter((score) => !score.passed)
      .map((score) => `${score.dimension}=${score.score.toFixed(2)} (${score.notes.join('; ')})`);
    lines.push(`FAIL ${result.caseId}: ${notes.join(' | ') || result.errorCode || 'unknown'}`);
  }
  return lines.join('\n');
}
