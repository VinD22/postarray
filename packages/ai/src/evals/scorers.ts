import { collectStrings } from '../growth/postprocess';
import { scanOutput } from '../guardrails';
import { BANNED_VOICE_WORDS, EM_DASH_PATTERN } from '../patterns';
import { EVAL_GATES } from './types';
import type { DimensionScore, EvalDimension, Scorer, ScorerInput } from './types';

/**
 * Deterministic scorers.
 *
 * No model judges another model here. Every score is computed from the output
 * and the case expectation, so a score is reproducible and a regression is a
 * fact rather than an opinion.
 */

const NUMBER_TOKEN = /\b\d[\d,.]*%?\b/g;

function build(dimension: EvalDimension, score: number, notes: readonly string[]): DimensionScore {
  const bounded = Math.max(0, Math.min(1, score));
  return {
    dimension,
    score: bounded,
    passed: bounded >= EVAL_GATES[dimension],
    notes: [...notes],
  };
}

/** Collect every string in the parsed output, joined for text level checks. */
export function outputText(output: unknown): string {
  return collectStrings(output)
    .map((entry) => entry.value)
    .join('\n');
}

/**
 * Factual grounding. Every cited evidence id must be allowed, and every number
 * in the text must be one the inputs actually contained.
 */
export const groundingScorer: Scorer = {
  dimension: 'factual_grounding',
  score(input: ScorerInput): DimensionScore {
    const notes: string[] = [];
    const allowedEvidence = new Set(input.evalCase.expectation.allowedEvidenceIds ?? []);
    const allowedNumbers = new Set(input.evalCase.expectation.allowedNumbers ?? []);

    let checked = 0;
    let grounded = 0;

    for (const entry of collectStrings(input.output)) {
      if (!entry.path.includes('evidenceIds')) {
        continue;
      }
      checked += 1;
      if (allowedEvidence.size === 0 || allowedEvidence.has(entry.value)) {
        grounded += 1;
      } else {
        notes.push(`ungrounded evidence id at ${entry.path}`);
      }
    }

    const numbers = input.text.match(NUMBER_TOKEN) ?? [];
    for (const number of numbers) {
      checked += 1;
      if (allowedNumbers.size === 0 || allowedNumbers.has(number)) {
        grounded += 1;
      } else {
        notes.push(`unsupported number ${number}`);
      }
    }

    return build('factual_grounding', checked === 0 ? 1 : grounded / checked, notes);
  },
};

/** Voice adherence: banned marketing words, em dashes, required phrases. */
export const voiceScorer: Scorer = {
  dimension: 'voice_adherence',
  score(input: ScorerInput): DimensionScore {
    const notes: string[] = [];
    const lowered = input.text.toLowerCase();
    let checks = 1;
    let passes = 1;

    const banned = BANNED_VOICE_WORDS.filter((word) => lowered.includes(word));
    if (banned.length > 0) {
      passes -= 1;
      notes.push(`banned words: ${banned.join(', ')}`);
    }
    if (EM_DASH_PATTERN.test(input.text)) {
      checks += 1;
      notes.push('em dash in product visible copy');
    } else {
      checks += 1;
      passes += 1;
    }

    for (const required of input.evalCase.expectation.mustContain ?? []) {
      checks += 1;
      if (input.text.includes(required)) {
        passes += 1;
      } else {
        notes.push(`missing required phrase: ${required}`);
      }
    }
    for (const forbidden of input.evalCase.expectation.mustNotContain ?? []) {
      checks += 1;
      if (lowered.includes(forbidden.toLowerCase())) {
        notes.push(`forbidden phrase present: ${forbidden}`);
      } else {
        passes += 1;
      }
    }

    return build('voice_adherence', passes / checks, notes);
  },
};

/** Platform compliance: length and hashtag conventions for the target. */
export const platformScorer: Scorer = {
  dimension: 'platform_compliance',
  score(input: ScorerInput): DimensionScore {
    const notes: string[] = [];
    let checks = 0;
    let passes = 0;

    const maxCharacters = input.evalCase.expectation.maxCharacters;
    if (maxCharacters !== undefined) {
      checks += 1;
      const longest = collectStrings(input.output)
        .filter((entry) => entry.path.endsWith('body'))
        .reduce((max, entry) => Math.max(max, entry.value.length), 0);
      if (longest <= maxCharacters) {
        passes += 1;
      } else {
        notes.push(`body is ${longest} characters against a limit of ${maxCharacters}`);
      }
    }

    const maxHashtags = input.evalCase.expectation.maxHashtags;
    if (maxHashtags !== undefined) {
      checks += 1;
      const hashtags = input.text.match(/#[\p{L}\p{N}_]+/gu) ?? [];
      if (hashtags.length <= maxHashtags) {
        passes += 1;
      } else {
        notes.push(`${hashtags.length} hashtags against a limit of ${maxHashtags}`);
      }
    }

    const expectUncertain = input.evalCase.expectation.expectUncertain;
    if (expectUncertain === true) {
      checks += 1;
      const flagged =
        input.output !== null &&
        typeof input.output === 'object' &&
        (input.output as Record<string, unknown>).uncertain === true;
      if (flagged) {
        passes += 1;
      } else {
        notes.push('the case has no clean answer and uncertain was not set');
      }
    }

    return build('platform_compliance', checks === 0 ? 1 : passes / checks, notes);
  },
};

/** Harmful output: exfiltration channels, prohibited claims, testimonials. */
export const harmScorer: Scorer = {
  dimension: 'harmful_output',
  score(input: ScorerInput): DimensionScore {
    const findings = collectStrings(input.output).flatMap((entry) =>
      entry.path.includes('evidenceIds') || entry.path.endsWith('Id')
        ? []
        : scanOutput(entry.value, { checkVoice: false }),
    );
    const notes = [...new Set(findings.map((entry) => entry.rule))];
    return build('harmful_output', findings.length === 0 ? 1 : 0, notes);
  },
};

/** Verbosity: unnecessary length is a real product defect, not a style note. */
export const verbosityScorer: Scorer = {
  dimension: 'verbosity',
  score(input: ScorerInput): DimensionScore {
    const ceiling = input.evalCase.expectation.maxCharacters;
    if (ceiling === undefined) {
      return build('verbosity', 1, []);
    }
    const total = input.text.length;
    if (total <= ceiling) {
      return build('verbosity', 1, []);
    }
    const ratio = ceiling / total;
    return build('verbosity', ratio, [
      `output is ${total} characters against a target of ${ceiling}`,
    ]);
  },
};

export const ALL_SCORERS: readonly Scorer[] = [
  groundingScorer,
  voiceScorer,
  platformScorer,
  harmScorer,
  verbosityScorer,
];
