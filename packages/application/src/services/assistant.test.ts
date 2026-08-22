import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import type { ActorContext, ServiceDeps } from '../types';
import type { AssistantDelegates } from './assistant-types';

/**
 * The four properties the assistant is not allowed to lose.
 *
 * Budget: a workspace over its monthly ceiling gets a typed refusal and the
 * model is never called. Confirmation: a mutating tool creates a durable
 * confirmation and writes nothing until a human approves it. Tenancy: a project
 * id from another workspace is refused before anything reads, prompts or
 * writes. Validation: output the schema rejects never becomes structured data.
 *
 * No test here reaches a network, a database or a model.
 */

const projects: Record<string, unknown>[] = [];
let monthlySpendMicros = 0;

const actor = {
  ctx: undefined as unknown,
  userId: 'user_1',
  workspace: { id: 'ws_1', defaultTimeZone: 'UTC', defaultLocale: 'en' },
  restrictions: {},
};

const fakeDb = {
  project: {
    findFirst: async ({ where }: { where: Record<string, unknown> }) =>
      projects.find((row) => Object.entries(where).every(([key, value]) => row[key] === value)) ??
      null,
  },
  usageEvent: {
    aggregate: async () => ({ _sum: { quantity: monthlySpendMicros } }),
  },
};

vi.mock('../internal/runtime', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  authorized: async (
    _deps: unknown,
    _ctx: unknown,
    _permission: string,
    _resource: unknown,
    handler: (db: unknown, actorSnapshot: unknown) => Promise<unknown>,
  ) => handler(fakeDb, actor),
}));

import { FixedClock } from '../ports/clock';
import { createAssistantService } from './assistant';

const OWN_PROJECT = 'project_own';
const OTHER_WORKSPACE_PROJECT = 'project_other_workspace';

const ctx: ActorContext = {
  actorType: 'user',
  actorId: 'user_1',
  workspaceId: 'ws_1',
  scopes: [],
  surface: 'web',
  correlationId: 'corr_assistant',
  approvalLevel: 'level_2_scheduled',
  locale: 'en',
};

/** A model that returns exactly this payload, then lets the schema decide. */
function gatewayReturning(payload: unknown, calls: unknown[]) {
  return {
    isAvailable: () => true,
    completeStructured: async <TOut>(schema: { parse(value: unknown): TOut }, request: unknown) => {
      calls.push(request);
      return {
        output: schema.parse(payload),
        meta: {
          provider: 'echo',
          model: 'echo-offline',
          promptId: 'assistant-route',
          promptVersion: '2026-08-18.1',
          inputTokens: 10,
          outputTokens: 20,
          costMicros: 42,
          degraded: false,
        },
      };
    },
  };
}

const recordedUsage: { key: string; quantity: number }[] = [];
let modelCalls: unknown[] = [];
let deps: ServiceDeps;
let confirmationRequests: string[] = [];
let writes: string[] = [];
let delegates: AssistantDelegates;

function buildDeps(payload: unknown): ServiceDeps {
  return {
    clock: new FixedClock(new Date('2026-08-18T10:00:00.000Z')),
    logger: { info: () => undefined, warn: () => undefined, error: () => undefined },
    config: { ai: { maxMonthlyUsdPerWorkspace: 25 } },
    ai: gatewayReturning(payload, modelCalls),
    billing: {
      recordUsage: async (input: { key: string; quantity: number }) => {
        recordedUsage.push({ key: input.key, quantity: input.quantity });
      },
    },
  } as unknown as ServiceDeps;
}

function buildDelegates(): AssistantDelegates {
  return {
    agentConfirmations: {
      request: async (_ctx: unknown, input: { contentItemId: string }) => {
        confirmationRequests.push(input.contentItemId);
        return { id: 'confirm_1', state: 'pending' };
      },
      consume: async () => ({ confirmationId: 'confirm_1' }),
    },
    content: {
      overrideVariant: async () => {
        writes.push('content.overrideVariant');
        return { id: 'variant_1' };
      },
      createDraft: async () => {
        writes.push('content.createDraft');
        return { id: 'post_1' };
      },
    },
    approvals: {
      request: async () => {
        writes.push('approvals.request');
        return { id: 'approval_1' };
      },
    },
  } as unknown as AssistantDelegates;
}

beforeEach(() => {
  projects.length = 0;
  projects.push(
    { id: OWN_PROJECT, workspaceId: 'ws_1', archivedAt: null, rememberTargetsEnabled: false },
    {
      id: OTHER_WORKSPACE_PROJECT,
      workspaceId: 'ws_2',
      archivedAt: null,
      rememberTargetsEnabled: false,
    },
  );
  monthlySpendMicros = 0;
  recordedUsage.length = 0;
  modelCalls = [];
  confirmationRequests = [];
  writes = [];
  delegates = buildDelegates();
  deps = buildDeps({
    tool: 'report_week',
    missingInformation: [],
    rationale: 'The request asks what is scheduled.',
    uncertain: false,
    uncertaintyReason: null,
  });
});

describe('the monthly spend ceiling', () => {
  it('refuses the call before the model is reached, with a user-safe error', async () => {
    monthlySpendMicros = 25_000_000;
    const assistant = createAssistantService(deps, delegates);

    await expect(
      assistant.turn(ctx, { projectId: OWN_PROJECT, message: 'What is going out?' }),
    ).rejects.toMatchObject({
      code: 'QUOTA_EXCEEDED',
      messageKey: 'error.ai_budget_exceeded.message',
    });
    expect(modelCalls).toEqual([]);
  });

  it('allows the call under the ceiling and records what it cost', async () => {
    monthlySpendMicros = 1_000;
    const assistant = createAssistantService(deps, delegates);

    const response = await assistant.turn(ctx, {
      projectId: OWN_PROJECT,
      message: 'What is going out?',
    });

    expect(response.tool).toBe('report_week');
    expect(response.label).toBe('suggestion');
    expect(recordedUsage).toEqual([
      { key: 'ai.cost_micros', quantity: 42 },
      { key: 'ai_text_input_tokens', quantity: 10 },
      { key: 'ai_text_output_tokens', quantity: 20 },
    ]);
  });
});

describe('a mutating tool', () => {
  it('creates a confirmation and does not take effect before one', async () => {
    const assistant = createAssistantService(deps, delegates);

    const result = await assistant.adaptDraftText(ctx, {
      projectId: OWN_PROJECT,
      contentItemId: 'post_1',
      targetId: 'target_1',
      body: 'A shorter version for this account.',
    });

    expect(result.state).toBe('awaiting_confirmation');
    expect(result.confirmationId).toBe('confirm_1');
    expect(result.confirmUrl).toBe('/confirm/confirm_1');
    expect(confirmationRequests).toEqual(['post_1']);
    expect(writes).toEqual([]);
  });

  it('reaches the existing service only once the confirmation is consumed', async () => {
    const assistant = createAssistantService(deps, delegates);

    const result = await assistant.adaptDraftText(
      ctx,
      {
        projectId: OWN_PROJECT,
        contentItemId: 'post_1',
        targetId: 'target_1',
        body: 'A shorter version for this account.',
      },
      'confirm_1',
    );

    expect(result.state).toBe('applied');
    expect(result.resultId).toBe('variant_1');
    expect(writes).toEqual(['content.overrideVariant']);
  });

  it('proposes rather than writes when the subject cannot be confirmed yet', async () => {
    const assistant = createAssistantService(deps, delegates);

    const result = await assistant.draftPost(ctx, {
      projectId: OWN_PROJECT,
      title: null,
      body: 'A first draft.',
    });

    expect(result.state).toBe('proposal_only');
    expect(result.blockedReasonKey).toBe('assistant.blocked.no_confirmable_subject');
    expect(writes).toEqual([]);
    expect(confirmationRequests).toEqual([]);
  });
});

describe('a project id from another workspace', () => {
  it('is refused before a confirmation, a prompt or a write', async () => {
    const assistant = createAssistantService(deps, delegates);

    await expect(
      assistant.adaptDraftText(ctx, {
        projectId: OTHER_WORKSPACE_PROJECT,
        contentItemId: 'post_1',
        targetId: 'target_1',
        body: 'Not mine.',
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND', messageKey: 'errors.not_found.project' });
    expect(confirmationRequests).toEqual([]);
    expect(writes).toEqual([]);
  });

  it('is refused before the model is called on a read capability', async () => {
    const assistant = createAssistantService(deps, delegates);

    await expect(
      assistant.turn(ctx, { projectId: OTHER_WORKSPACE_PROJECT, message: 'Plan my week.' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    expect(modelCalls).toEqual([]);
  });
});

describe('structured output validation', () => {
  it('rejects a routed tool that is not in the catalog', async () => {
    deps = buildDeps({
      tool: 'publish_everywhere',
      missingInformation: [],
      rationale: 'no',
      uncertain: false,
      uncertaintyReason: null,
    });
    const assistant = createAssistantService(deps, delegates);

    await expect(
      assistant.turn(ctx, { projectId: OWN_PROJECT, message: 'Post this everywhere now.' }),
    ).rejects.toBeInstanceOf(z.ZodError);
  });

  it('rejects an output carrying a field the schema does not declare', async () => {
    deps = buildDeps({
      tool: 'report_week',
      missingInformation: [],
      rationale: 'ok',
      uncertain: false,
      uncertaintyReason: null,
      imageUrl: 'https://example.invalid/generated.png',
    });
    const assistant = createAssistantService(deps, delegates);

    await expect(
      assistant.turn(ctx, { projectId: OWN_PROJECT, message: 'What is going out?' }),
    ).rejects.toBeInstanceOf(z.ZodError);
  });
});
