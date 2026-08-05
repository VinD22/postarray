import { aiOutputInvalidError } from './errors.js';
import { buildUntrustedBlock, newNonce, redactSecrets, untrustedDataPolicy } from './guardrails.js';
import type { GuardrailFinding } from './guardrails.js';
import { promptMarker } from './providers/echo.js';
import type { PromptModule } from './prompts/types.js';
import type { AiRequest, AiVariables, ProviderMessage } from './types.js';

/**
 * Message assembly.
 *
 * The instruction channel and the data channel are kept apart on purpose:
 * variables are rendered as a labelled JSON block, untrusted sources are fenced
 * with a per-call nonce, and nothing from either is ever concatenated into the
 * system instruction.
 */

export interface BuiltMessages {
  readonly messages: readonly ProviderMessage[];
  readonly nonce: string;
  readonly findings: readonly GuardrailFinding[];
  readonly sanitizedSourceIds: readonly string[];
  readonly includedSourceIds: readonly string[];
  readonly approximateInputCharacters: number;
}

/** Variables are first-party but may still quote a customer. Secrets are stripped. */
export function renderVariables(variables: AiVariables): string {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(variables)) {
    safe[key] = typeof value === 'string' ? redactSecrets(value).text : value;
  }
  return JSON.stringify(safe, null, 2);
}

export function missingVariables(
  prompt: PromptModule,
  variables: AiVariables,
): readonly string[] {
  return prompt.requiredVariables.filter((name) => !Object.hasOwn(variables, name));
}

export function buildMessages(prompt: PromptModule, request: AiRequest): BuiltMessages {
  const nonce = newNonce();
  const block = buildUntrustedBlock(request.untrustedSources ?? [], nonce);

  const systemParts = [
    untrustedDataPolicy(nonce),
    '',
    prompt.instruction,
    '',
    `Interface locale: ${request.context.locale}.`,
    request.context.contentLanguage === null
      ? 'Write in the locale named in the inputs.'
      : `Write the produced text in ${request.context.contentLanguage}.`,
    `[${promptMarker(prompt.id)} v${prompt.version}]`,
  ];

  const userParts = ['INPUTS (JSON):', renderVariables(request.variables)];
  if (block.text.length > 0) {
    userParts.push('', block.text);
  }
  if (request.repairInstruction !== undefined && request.repairInstruction.length > 0) {
    userParts.push(
      '',
      'The previous answer was rejected. Fix exactly these problems and answer again:',
      request.repairInstruction,
    );
  }

  const messages: ProviderMessage[] = [
    { role: 'system', content: systemParts.join('\n') },
    { role: 'user', content: userParts.join('\n') },
  ];

  return {
    messages,
    nonce,
    findings: block.findings,
    sanitizedSourceIds: block.sanitizedSourceIds,
    includedSourceIds: block.includedSourceIds,
    approximateInputCharacters: messages.reduce(
      (total, message) => total + message.content.length,
      0,
    ),
  };
}

const FENCE_PATTERN = /^```(?:json)?\s*([\s\S]*?)\s*```$/;

/**
 * Parse a JSON answer. Models occasionally wrap the object in a fence even when
 * asked not to, so that one specific case is unwrapped. Anything else is a
 * rejection: there is no free-text path from model output to a side effect.
 */
export function parseJsonOutput(text: string, correlationId?: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(FENCE_PATTERN);
  const candidate = fenced === null ? trimmed : (fenced[1] ?? '');
  if (candidate.length === 0) {
    throw aiOutputInvalidError('empty_output', {
      ...(correlationId === undefined ? {} : { correlationId }),
    });
  }
  try {
    return JSON.parse(candidate);
  } catch (cause) {
    throw aiOutputInvalidError('not_json', {
      ...(correlationId === undefined ? {} : { correlationId }),
      cause,
    });
  }
}
