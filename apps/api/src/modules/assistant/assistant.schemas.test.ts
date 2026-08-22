import { describe, expect, it } from 'vitest';

import {
  adaptDraftTextInputSchema,
  assistantTurnRequestSchema,
  planWeekInputSchema,
  schedulePostInputSchema,
} from './assistant.schemas';

/**
 * The assistant's transport boundary.
 *
 * These payloads are the shared contract, not a restatement of it, so the
 * assertions here are about the boundary doing its job: unknown fields are
 * refused rather than forwarded, and every route that can change something
 * requires a project id to check ownership against.
 */

describe('the turn payload', () => {
  it('accepts a message and an optional confirmation', () => {
    expect(
      assistantTurnRequestSchema.safeParse({
        projectId: 'project_1',
        message: 'What is going out this week?',
      }).success,
    ).toBe(true);
  });

  it('refuses a field the contract does not declare', () => {
    expect(
      assistantTurnRequestSchema.safeParse({
        projectId: 'project_1',
        message: 'Draw me a picture.',
        imagePrompt: 'a cat',
      }).success,
    ).toBe(false);
  });

  it('refuses an empty message', () => {
    expect(
      assistantTurnRequestSchema.safeParse({ projectId: 'project_1', message: '' }).success,
    ).toBe(false);
  });
});

describe('the mutating payloads', () => {
  it('always require a project id, so ownership can be checked', () => {
    expect(
      adaptDraftTextInputSchema.safeParse({
        contentItemId: 'post_1',
        targetId: 'target_1',
        body: 'text',
      }).success,
    ).toBe(false);
    expect(schedulePostInputSchema.safeParse({ contentItemId: 'post_1' }).success).toBe(false);
  });

  it('bound how many posts one plan may propose', () => {
    expect(
      planWeekInputSchema.safeParse({
        projectId: 'project_1',
        weekStartDate: '2026-08-24',
        postCount: 99,
      }).success,
    ).toBe(false);
  });

  it('refuses a week start that is not a plain date', () => {
    expect(
      planWeekInputSchema.safeParse({ projectId: 'project_1', weekStartDate: 'next monday' })
        .success,
    ).toBe(false);
  });
});
