import { describe, expect, it } from 'vitest';

import { PROMPT_IDS, PROMPT_VERSION_PATTERN } from './types.js';
import {
  PROMPT_REGISTRY,
  getPrompt,
  isPromptId,
  listPrompts,
  promptProvenance,
  validateRegistry,
} from './registry.js';

describe('prompt registry', () => {
  it('is structurally valid', () => {
    expect(validateRegistry()).toEqual([]);
  });

  it('covers every declared prompt id exactly once', () => {
    expect(listPrompts()).toHaveLength(PROMPT_IDS.length);
    expect(new Set(listPrompts().map((prompt) => prompt.id)).size).toBe(PROMPT_IDS.length);
  });

  it('ships the fifteen V1 capabilities', () => {
    expect(PROMPT_IDS).toContain('draft-from-brief');
    expect(PROMPT_IDS).toContain('transcreate');
    expect(PROMPT_IDS).toContain('alt-text');
    expect(PROMPT_IDS).toContain('claim-check');
    expect(PROMPT_IDS).toContain('analytics-summary');
    expect(PROMPT_IDS).toContain('growth-plan');
    expect(PROMPT_IDS).toHaveLength(15);
  });

  it('versions every prompt as YYYY-MM-DD.N', () => {
    for (const prompt of listPrompts()) {
      expect(prompt.version).toMatch(PROMPT_VERSION_PATTERN);
    }
  });

  it('gives every prompt a fixture that satisfies its own schema', () => {
    for (const prompt of listPrompts()) {
      expect(prompt.fixtures.length).toBeGreaterThan(0);
      for (const fixture of prompt.fixtures) {
        expect(prompt.schema.safeParse(fixture.output).success).toBe(true);
      }
    }
  });

  it('declares a degradation strategy so nothing fails silently', () => {
    for (const prompt of listPrompts()) {
      expect(prompt.degradation).toBeTruthy();
    }
  });

  it('never lets a prompt instruction contain an em dash', () => {
    for (const prompt of listPrompts()) {
      expect(prompt.instruction).not.toMatch(/[—–]/);
    }
  });

  it('resolves a prompt by id', () => {
    expect(getPrompt('alt-text').id).toBe('alt-text');
    expect(isPromptId('alt-text')).toBe(true);
    expect(isPromptId('nope')).toBe(false);
  });

  it('refuses an unknown prompt id', () => {
    expect(() => getPrompt('does-not-exist')).toThrowError();
  });

  it('refuses a version that does not match, so replays cannot drift', () => {
    expect(() => getPrompt('alt-text', '1999-01-01.1')).toThrowError();
    expect(() => getPrompt('alt-text', PROMPT_REGISTRY['alt-text'].version)).not.toThrow();
  });

  it('produces the provenance triple a receipt stores', () => {
    const provenance = promptProvenance(PROMPT_REGISTRY['growth-plan']);
    expect(provenance.promptId).toBe('growth-plan');
    expect(provenance.locale).toBe('en');
    expect(provenance.promptVersion).toMatch(PROMPT_VERSION_PATTERN);
  });

  it('forbids image or video generation prompts', () => {
    const joined = listPrompts()
      .map((prompt) => `${prompt.id} ${prompt.instruction}`)
      .join('\n')
      .toLowerCase();
    expect(joined).not.toContain('generate an image');
    expect(joined).not.toContain('generate a video');
    expect(PROMPT_IDS.some((id) => id.includes('image') || id.includes('video'))).toBe(false);
  });
});
