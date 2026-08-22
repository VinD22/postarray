import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { createTestGateway, TEST_CALL_CONTEXT } from '../test-support';
import { createDisabledProvider } from '../providers/disabled';
import { assistantRouteResultSchema, assistantWeekPlanResultSchema } from './assistant';

/**
 * The assistant's prompts, run against the offline providers.
 *
 * The echo provider replays the prompt's own fixture, so these assertions are
 * about the gateway's contract rather than about a model's mood: a valid
 * fixture parses, a stricter schema than the prompt's own is still enforced,
 * and a workspace with no configured provider is told so instead of being
 * handed an invented answer. Nothing here touches a network.
 */

describe('the assistant routing prompt', () => {
  it('replays a schema-valid answer offline', async () => {
    const { gateway } = createTestGateway();

    const result = await gateway.completeStructured(assistantRouteResultSchema, {
      context: TEST_CALL_CONTEXT,
      promptId: 'assistant-route',
      variables: { message: 'Plan my week', availableTools: ['plan_week'], locale: 'en' },
    });

    expect(result.output.tool).toBe('plan_week');
    expect(result.meta.promptId).toBe('assistant-route');
    expect(result.meta.degraded).toBe(false);
  });

  it('rejects output that the caller narrowed away', async () => {
    const { gateway } = createTestGateway();
    // The caller narrows the contract: only report tools are acceptable here.
    const narrowed = assistantRouteResultSchema.extend({
      tool: z.enum(['report_week', 'report_failures']),
    });

    await expect(
      gateway.completeStructured(narrowed, {
        context: TEST_CALL_CONTEXT,
        promptId: 'assistant-route',
        variables: { message: 'Plan my week', availableTools: ['plan_week'], locale: 'en' },
      }),
    ).rejects.toMatchObject({ code: 'AI_OUTPUT_INVALID' });
  });
});

describe('the assistant week-plan prompt', () => {
  it('replays a grounded plan offline', async () => {
    const { gateway } = createTestGateway();

    const result = await gateway.completeStructured(assistantWeekPlanResultSchema, {
      context: TEST_CALL_CONTEXT,
      promptId: 'assistant-week-plan',
      variables: {
        postCount: 2,
        businessProfile: 'profile',
        connectedProviders: ['x'],
        contentLocale: 'en',
        prohibitedClaims: [],
      },
    });

    expect(result.output.posts.length).toBeGreaterThan(0);
    expect(result.output.groundingNotes.length).toBeGreaterThan(0);
  });

  it('says assistance is not configured rather than inventing a plan', async () => {
    const { gateway } = createTestGateway({ provider: createDisabledProvider('none') });

    await expect(
      gateway.completeStructured(assistantWeekPlanResultSchema, {
        context: TEST_CALL_CONTEXT,
        promptId: 'assistant-week-plan',
        variables: {
          postCount: 2,
          businessProfile: 'profile',
          connectedProviders: ['x'],
          contentLocale: 'en',
          prohibitedClaims: [],
        },
      }),
    ).rejects.toMatchObject({ code: 'AI_UNAVAILABLE' });
  });
});
