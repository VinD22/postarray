import { describe, expect, it } from 'vitest';

import {
  ASSISTANT_TOOLS,
  ASSISTANT_TOOL_OUTPUT_SCHEMAS,
  assistantActionOutputSchema,
  assistantTool,
  assistantToolContractProblems,
  assistantToolsFor,
} from './assistant-catalog';
import {
  ASSISTANT_TOOL_INPUT_SCHEMAS,
  ASSISTANT_TOOL_NAMES,
  assistantTurnResponseSchema,
  planWeekOutputSchema,
} from './assistant';

describe('the assistant tool catalog', () => {
  it('is structurally sound', () => {
    expect(assistantToolContractProblems()).toEqual([]);
  });

  it('gates every mutating tool behind a human confirmation', () => {
    for (const tool of ASSISTANT_TOOLS) {
      if (tool.mutating) {
        expect(tool.requiresHumanConfirmation).toBe(true);
      }
    }
  });

  it('names an existing application service for every tool', () => {
    for (const tool of ASSISTANT_TOOLS) {
      expect(tool.delegatesTo.length).toBeGreaterThan(0);
    }
  });

  it('covers every declared name exactly once', () => {
    expect(ASSISTANT_TOOLS.map((tool) => tool.name).sort()).toEqual(
      [...ASSISTANT_TOOL_NAMES].sort(),
    );
    expect(Object.keys(ASSISTANT_TOOL_INPUT_SCHEMAS).sort()).toEqual(
      [...ASSISTANT_TOOL_NAMES].sort(),
    );
    expect(Object.keys(ASSISTANT_TOOL_OUTPUT_SCHEMAS).sort()).toEqual(
      [...ASSISTANT_TOOL_NAMES].sort(),
    );
  });

  it('groups tools by capability', () => {
    expect(assistantToolsFor('do').map((tool) => tool.name)).toEqual([
      'draft_post',
      'adapt_draft_text',
      'schedule_post',
      'request_approval',
    ]);
    expect(assistantToolsFor('plan')).toHaveLength(1);
  });

  it('refuses an unknown tool name', () => {
    expect(() => assistantTool('not_a_tool' as never)).toThrow('UNKNOWN_ASSISTANT_TOOL');
  });
});

describe('the structured shapes a model can fill', () => {
  it('rejects a plan whose day offset is outside the week', () => {
    const parsed = planWeekOutputSchema.safeParse({
      projectId: 'project_1',
      weekStartDate: '2026-08-24',
      posts: [
        {
          dayOffset: 9,
          localTime: '09:00',
          slotReasonKeys: [],
          angle: 'launch',
          body: 'text',
          suggestedProviders: [],
        },
      ],
      groundingNotes: [],
      provenance: {
        label: 'suggestion',
        promptId: 'assistant-week-plan',
        promptVersion: '2026-08-18.1',
        provider: 'echo',
        model: 'echo',
        degraded: false,
      },
    });
    expect(parsed.success).toBe(false);
  });

  it('refuses provenance that claims a plan is a fact', () => {
    const parsed = assistantTurnResponseSchema.safeParse({
      tool: 'plan_week',
      capability: 'plan',
      risk: 'read',
      label: 'fact',
      messageKey: 'assistant.turn.planned',
      data: {},
      provenance: null,
    });
    expect(parsed.success).toBe(false);
  });

  it('refuses an applied action that carries no result id field', () => {
    const parsed = assistantActionOutputSchema.safeParse({
      tool: 'draft_post',
      state: 'applied',
      confirmationId: null,
      confirmUrl: null,
      proposal: {},
      blockedReasonKey: null,
    });
    expect(parsed.success).toBe(false);
  });
});
