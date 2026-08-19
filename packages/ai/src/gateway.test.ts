import { describe, expect, it } from 'vitest';

import { ERROR_CODES, RelayError } from '@relay/contracts';

import { createAiGateway, taskFor } from './gateway';
import { createBudgetGuard } from './budget';
import { fixedClock } from './clock';
import { altTextPrompt, draftFromBriefPrompt } from './prompts/content';
import { altTextResultSchema, draftFromBriefResultSchema } from './prompts/schemas';
import { createDisabledProvider } from './providers/disabled';
import { createEchoProvider } from './providers/echo';
import { createMemoryCounterStore } from './types';
import type { AiProviderAdapter, AiStreamEvent, AiVariables, ProviderResponse } from './types';
import { TEST_CALL_CONTEXT, createTestGateway, createTestLogger } from './test-support';

function baseRequest(promptId: string, variables: AiVariables) {
  return { context: TEST_CALL_CONTEXT, promptId, variables };
}

function scriptedProvider(responses: readonly (ProviderResponse | Error)[]): AiProviderAdapter {
  let index = 0;
  return {
    name: 'scripted',
    model: 'scripted-1',
    available: true,
    async complete() {
      const next = responses[Math.min(index, responses.length - 1)];
      index += 1;
      if (next instanceof Error) {
        throw next;
      }
      if (next === undefined) {
        throw new Error('no scripted response');
      }
      return next;
    },
    async *stream() {
      throw new Error('not used');
    },
  };
}

function jsonResponse(payload: unknown): ProviderResponse {
  return {
    text: JSON.stringify(payload),
    toolCalls: [],
    inputTokens: 100,
    outputTokens: 100,
    finishReason: 'stop',
    model: 'scripted-1',
  };
}

describe('gateway status', () => {
  it('reports disabled when no credentials are configured', () => {
    const gateway = createAiGateway({
      provider: createDisabledProvider('deepseek-v4-flash'),
      budget: createBudgetGuard({
        store: createMemoryCounterStore(() => 0),
        clock: fixedClock('2026-08-04T09:00:00Z'),
      }),
      logger: createTestLogger(),
      clock: fixedClock('2026-08-04T09:00:00Z'),
    });

    const status = gateway.status();
    expect(status.availability).toBe('disabled');
    expect(status.reasonKey).toBe('error.ai_unavailable.message');
  });

  it('reports ready with the offline provider', () => {
    expect(createTestGateway().gateway.status().availability).toBe('ready');
  });
});

describe('gateway degradation', () => {
  it('fails with a retryable AI_UNAVAILABLE rather than a generic error', async () => {
    const gateway = createAiGateway({
      provider: createDisabledProvider(),
      budget: createBudgetGuard({
        store: createMemoryCounterStore(() => 0),
        clock: fixedClock('2026-08-04T09:00:00Z'),
      }),
      logger: createTestLogger(),
    });

    await expect(
      gateway.completeStructured(
        altTextResultSchema,
        baseRequest('alt-text', {
          imageDescription: 'A calendar view.',
          language: 'en',
          context: 'Announcement.',
        }),
      ),
    ).rejects.toMatchObject({ code: ERROR_CODES.AI_UNAVAILABLE });
  });

  it('names the prompt degradation strategy in the error details', async () => {
    const gateway = createAiGateway({
      provider: createDisabledProvider(),
      budget: createBudgetGuard({
        store: createMemoryCounterStore(() => 0),
        clock: fixedClock('2026-08-04T09:00:00Z'),
      }),
      logger: createTestLogger(),
    });

    try {
      await gateway.complete(
        baseRequest('alt-text', {
          imageDescription: 'A calendar view.',
          language: 'en',
          context: 'Announcement.',
        }),
      );
      expect.unreachable('the call should have been refused');
    } catch (error) {
      expect(RelayError.is(error)).toBe(true);
      if (RelayError.is(error)) {
        expect(error.details['degradation']).toBe('leave_empty_required');
      }
    }
  });
});

describe('completeStructured', () => {
  it('returns the offline fixture and records provenance', async () => {
    const { gateway } = createTestGateway();

    const result = await gateway.completeStructured(
      altTextResultSchema,
      baseRequest('alt-text', {
        imageDescription: 'Screenshot of a calendar view with four scheduled posts on Tuesday.',
        language: 'en',
        context: 'Product announcement post.',
      }),
    );

    expect(result.output.altText.length).toBeGreaterThan(8);
    expect(result.meta.promptId).toBe('alt-text');
    expect(result.meta.promptVersion).toBe(altTextPrompt.version);
    expect(result.meta.attempts).toBe(1);
    expect(result.meta.costMicros).toBeGreaterThan(0);
  });

  it('rejects a request that is missing a required variable', async () => {
    const { gateway } = createTestGateway();

    await expect(
      gateway.completeStructured(altTextResultSchema, baseRequest('alt-text', { language: 'en' })),
    ).rejects.toMatchObject({ code: ERROR_CODES.AI_OUTPUT_INVALID });
  });

  it('repairs once on a schema failure and succeeds on the second answer', async () => {
    const good = altTextPrompt.fixtures[0]?.output;
    const provider = scriptedProvider([jsonResponse({ altText: 12 }), jsonResponse(good)]);
    const { gateway } = createTestGateway({ provider });

    const result = await gateway.completeStructured(
      altTextResultSchema,
      baseRequest('alt-text', {
        imageDescription: 'A calendar view.',
        language: 'en',
        context: 'Announcement.',
      }),
    );

    expect(result.output.language).toBe('en');
    expect(result.meta.attempts).toBe(2);
  });

  it('gives up after a second schema failure instead of retrying forever', async () => {
    const provider = scriptedProvider([jsonResponse({ altText: 12 })]);
    const { gateway } = createTestGateway({ provider });

    await expect(
      gateway.completeStructured(
        altTextResultSchema,
        baseRequest('alt-text', {
          imageDescription: 'A calendar view.',
          language: 'en',
          context: 'Announcement.',
        }),
      ),
    ).rejects.toMatchObject({ code: ERROR_CODES.AI_OUTPUT_INVALID });
  });

  it('blocks output that carries a URL, even when the schema accepted it', async () => {
    const provider = scriptedProvider([
      jsonResponse({
        altText: 'Read the details at https://example.test/post now.',
        language: 'en',
        describesText: false,
        uncertain: false,
        uncertaintyReason: null,
      }),
    ]);
    const { gateway } = createTestGateway({ provider });

    await expect(
      gateway.completeStructured(
        altTextResultSchema,
        baseRequest('alt-text', {
          imageDescription: 'A calendar view.',
          language: 'en',
          context: 'Announcement.',
        }),
      ),
    ).rejects.toMatchObject({ code: ERROR_CODES.POLICY_BLOCKED });
  });

  it('refuses before calling the provider when the budget is exhausted', async () => {
    let calls = 0;
    const provider: AiProviderAdapter = {
      name: 'counting',
      model: 'counting-1',
      available: true,
      async complete() {
        calls += 1;
        return jsonResponse({});
      },
      async *stream() {
        throw new Error('not used');
      },
    };
    const { gateway } = createTestGateway({
      provider,
      limits: {
        callsPerMinute: 0,
        callsPerDay: 0,
        softDailyCostMicros: 1,
        hardDailyCostMicros: 1,
      },
    });

    await expect(
      gateway.completeStructured(
        altTextResultSchema,
        baseRequest('alt-text', {
          imageDescription: 'A calendar view.',
          language: 'en',
          context: 'Announcement.',
        }),
      ),
    ).rejects.toMatchObject({ code: ERROR_CODES.QUOTA_EXCEEDED });
    expect(calls).toBe(0);
  });
});

describe('telemetry', () => {
  it('logs identifiers and counts, never prompt bodies or customer text', async () => {
    const { gateway, logger } = createTestGateway();

    await gateway.completeStructured(
      draftFromBriefResultSchema,
      baseRequest('draft-from-brief', {
        brief: 'A very distinctive customer sentence about kittens.',
        contentKind: 'text',
        locale: 'en',
        projectVoice: 'direct',
      }),
    );

    const serialized = JSON.stringify(logger.records);
    expect(serialized).toContain('ai.call.completed');
    expect(serialized).not.toContain('kittens');
    expect(serialized).not.toContain(draftFromBriefPrompt.instruction.slice(0, 40));
  });
});

describe('stream', () => {
  it('emits deltas and a final meta event', async () => {
    const { gateway } = createTestGateway({ provider: createEchoProvider() });
    const events: AiStreamEvent[] = [];

    for await (const event of gateway.stream(
      baseRequest('alt-text', {
        imageDescription: 'A calendar view.',
        language: 'en',
        context: 'Announcement.',
      }),
    )) {
      events.push(event);
    }

    expect(events.length).toBeGreaterThan(1);
    expect(events[events.length - 1]?.kind).toBe('done');
  });
});

describe('taskFor', () => {
  it('derives a task descriptor from a prompt module', () => {
    const task = taskFor(altTextPrompt);
    expect(task.id).toBe('alt-text');
    expect(task.promptVersion).toBe(altTextPrompt.version);
    expect(task.budgetCents).toBe(altTextPrompt.budgetCents);
  });

  it('runs a task through the gateway', async () => {
    const { gateway } = createTestGateway();
    const result = await gateway.run(
      taskFor(altTextPrompt),
      baseRequest('alt-text', {
        imageDescription: 'A calendar view.',
        language: 'en',
        context: 'Announcement.',
      }),
    );
    expect(result.output.altText.length).toBeGreaterThan(8);
  });
});
