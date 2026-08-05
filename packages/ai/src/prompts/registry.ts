import { RelayError, ERROR_CODES } from '@relay/contracts';

import { PROMPT_IDS, PROMPT_VERSION_PATTERN } from './types.js';
import type { PromptId, PromptModule } from './types.js';
import {
  altTextPrompt,
  ctaOptionsPrompt,
  draftFromBriefPrompt,
  hookOptionsPrompt,
  platformVariantPrompt,
  shortenPrompt,
  toneAdjustPrompt,
  transcreatePrompt,
} from './content.js';
import {
  accessibilityCheckPrompt,
  claimCheckPrompt,
  duplicateCheckPrompt,
  platformFitCheckPrompt,
} from './review.js';
import {
  analyticsSummaryPrompt,
  experimentSuggestionPrompt,
  growthPlanPrompt,
} from './analysis.js';

/**
 * The prompt registry.
 *
 * A publication receipt records `promptId` plus `promptVersion`, so this map is
 * how support answers "which prompt produced that suggestion". Versions are
 * append-only: to change a prompt, add a new version rather than editing one
 * that has already produced a stored artifact.
 */

export const PROMPT_REGISTRY: Readonly<Record<PromptId, PromptModule>> = Object.freeze({
  'draft-from-brief': draftFromBriefPrompt,
  'platform-variant': platformVariantPrompt,
  transcreate: transcreatePrompt,
  shorten: shortenPrompt,
  'tone-adjust': toneAdjustPrompt,
  'alt-text': altTextPrompt,
  'hook-options': hookOptionsPrompt,
  'cta-options': ctaOptionsPrompt,
  'claim-check': claimCheckPrompt,
  'platform-fit-check': platformFitCheckPrompt,
  'duplicate-check': duplicateCheckPrompt,
  'accessibility-check': accessibilityCheckPrompt,
  'analytics-summary': analyticsSummaryPrompt,
  'experiment-suggestion': experimentSuggestionPrompt,
  'growth-plan': growthPlanPrompt,
});

export function listPrompts(): readonly PromptModule[] {
  return PROMPT_IDS.map((id) => PROMPT_REGISTRY[id]);
}

export function isPromptId(value: string): value is PromptId {
  return Object.hasOwn(PROMPT_REGISTRY, value);
}

/**
 * Look a prompt up. When `expectedVersion` is supplied it must match exactly,
 * so a caller replaying a stored artifact fails loudly rather than silently
 * running a newer prompt.
 */
export function getPrompt(id: string, expectedVersion?: string): PromptModule {
  if (!isPromptId(id)) {
    throw new RelayError(ERROR_CODES.NOT_FOUND, {
      messageKey: 'error.not_found.message',
      details: { promptId: id },
    });
  }
  const prompt = PROMPT_REGISTRY[id];
  if (expectedVersion !== undefined && expectedVersion !== prompt.version) {
    throw new RelayError(ERROR_CODES.CONFLICT, {
      messageKey: 'error.conflict.message',
      details: { promptId: id, requested: expectedVersion, current: prompt.version },
    });
  }
  return prompt;
}

export interface PromptProvenance {
  readonly promptId: PromptId;
  readonly promptVersion: string;
  readonly locale: string;
}

/** The provenance triple a content version or receipt stores. */
export function promptProvenance(prompt: PromptModule): PromptProvenance {
  return { promptId: prompt.id, promptVersion: prompt.version, locale: prompt.locale };
}

export interface RegistryProblem {
  readonly promptId: string;
  readonly problem: string;
}

/**
 * Structural self-check over the registry. Run by the unit tests and by the
 * eval harness so a malformed prompt module cannot reach a release.
 */
export function validateRegistry(): RegistryProblem[] {
  const problems: RegistryProblem[] = [];
  for (const id of PROMPT_IDS) {
    const prompt = PROMPT_REGISTRY[id];
    if (prompt.id !== id) {
      problems.push({ promptId: id, problem: 'ID_MISMATCH' });
    }
    if (!PROMPT_VERSION_PATTERN.test(prompt.version)) {
      problems.push({ promptId: id, problem: 'INVALID_VERSION' });
    }
    if (prompt.instruction.trim().length === 0) {
      problems.push({ promptId: id, problem: 'EMPTY_INSTRUCTION' });
    }
    if (prompt.requiredVariables.length === 0) {
      problems.push({ promptId: id, problem: 'NO_REQUIRED_VARIABLES' });
    }
    if (prompt.fixtures.length === 0) {
      problems.push({ promptId: id, problem: 'NO_FIXTURES' });
    }
    if (prompt.budgetCents <= 0 || prompt.timeoutMs <= 0 || prompt.maxOutputTokens <= 0) {
      problems.push({ promptId: id, problem: 'NON_POSITIVE_BUDGET' });
    }
    for (const fixture of prompt.fixtures) {
      const parsed = prompt.schema.safeParse(fixture.output);
      if (!parsed.success) {
        problems.push({ promptId: id, problem: `FIXTURE_INVALID:${fixture.name}` });
      }
      for (const variable of prompt.requiredVariables) {
        if (!Object.hasOwn(fixture.variables, variable)) {
          problems.push({ promptId: id, problem: `FIXTURE_MISSING_VARIABLE:${variable}` });
        }
      }
    }
  }
  return problems;
}
