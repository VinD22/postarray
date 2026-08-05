import { PROMPT_REGISTRY } from '../prompts/registry.js';
import { PROMPT_IDS } from '../prompts/types.js';
import type { PromptId } from '../prompts/types.js';
import type {
  AiProviderAdapter,
  ProviderRequest,
  ProviderResponse,
  ProviderStreamChunk,
} from '../types.js';

/**
 * The offline provider.
 *
 * It returns the canned, schema-valid fixture that belongs to the prompt named
 * in the request, so every AI feature is demoable and testable with no API key,
 * no network and no cost. Output is deterministic: the same request always
 * produces the same bytes, which is what the exporter and eval snapshots rely on.
 */

const PROMPT_MARKER = 'relay-prompt-id:';

/** The gateway stamps this line into the system message for the echo provider. */
export function promptMarker(promptId: string, fixtureName?: string): string {
  return fixtureName === undefined
    ? `${PROMPT_MARKER}${promptId}`
    : `${PROMPT_MARKER}${promptId}#${fixtureName}`;
}

function findMarker(request: ProviderRequest): { promptId: string; fixture: string | null } | null {
  for (const message of request.messages) {
    const index = message.content.indexOf(PROMPT_MARKER);
    if (index < 0) {
      continue;
    }
    const rest = message.content.slice(index + PROMPT_MARKER.length);
    const token = rest.split(/\s/, 1)[0] ?? '';
    const [promptId, fixture] = token.split('#');
    if (promptId !== undefined && promptId.length > 0) {
      return { promptId, fixture: fixture ?? null };
    }
  }
  return null;
}

function isPromptId(value: string): value is PromptId {
  return (PROMPT_IDS as readonly string[]).includes(value);
}

function fixtureFor(promptId: string, fixtureName: string | null): unknown {
  if (!isPromptId(promptId)) {
    return null;
  }
  const prompt = PROMPT_REGISTRY[promptId];
  const chosen =
    fixtureName === null
      ? prompt.fixtures[0]
      : prompt.fixtures.find((entry) => entry.name === fixtureName);
  return chosen === undefined ? null : chosen.output;
}

export interface EchoProviderOptions {
  /** Reported model id. Keeps receipts honest about what produced the text. */
  readonly model?: string;
  /** Override the canned answer for a specific prompt, used by tests. */
  readonly overrides?: Readonly<Record<string, unknown>>;
  /** Fail every call, so degradation paths can be exercised. */
  readonly failWith?: Error;
}

/** Deterministic, network free provider for local development and tests. */
export function createEchoProvider(options: EchoProviderOptions = {}): AiProviderAdapter {
  const model = options.model ?? 'echo-deterministic';

  function respond(request: ProviderRequest): ProviderResponse {
    if (options.failWith !== undefined) {
      throw options.failWith;
    }
    const marker = findMarker(request);
    const override =
      marker === null ? undefined : options.overrides?.[marker.promptId];
    const payload =
      override !== undefined
        ? override
        : marker === null
          ? null
          : fixtureFor(marker.promptId, marker.fixture);

    const text = request.jsonMode
      ? JSON.stringify(payload === null ? { uncertain: true, uncertaintyReason: 'no fixture' } : payload)
      : typeof payload === 'string'
        ? payload
        : JSON.stringify(payload);

    const inputCharacters = request.messages.reduce(
      (total, message) => total + message.content.length,
      0,
    );

    return {
      text,
      toolCalls: [],
      inputTokens: Math.ceil(inputCharacters / 4),
      outputTokens: Math.ceil(text.length / 4),
      finishReason: 'stop',
      model,
    };
  }

  return {
    name: 'echo',
    model,
    available: true,
    async complete(request) {
      return respond(request);
    },
    async *stream(request) {
      const response = respond(request);
      // Deterministic chunking so stream consumers are exercised realistically.
      const size = Math.max(1, Math.ceil(response.text.length / 4));
      for (let offset = 0; offset < response.text.length; offset += size) {
        const chunk: ProviderStreamChunk = {
          text: response.text.slice(offset, offset + size),
          done: false,
        };
        yield chunk;
      }
      yield { text: '', done: true, response };
    },
  };
}
