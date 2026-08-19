import { newIdFor } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { createRuleSchema, testRunSchema } from './automation-rules.schemas';

const BASE_RULE = {
  projectId: newIdFor('project'),
  name: 'Respond to traction',
  trigger: { kind: 'analytics_threshold', config: {} },
  actions: [{ kind: 'request_approval', config: {} }],
  endCondition: { kind: 'count', runs: 20 },
  maxExecutionsPerSource: 1,
  cooldownSeconds: 3_600,
  measurementWindowSeconds: 86_400,
} as const;

describe('automation rule schemas', () => {
  it('keeps the lifetime end separate from the per-source threshold cap', () => {
    const parsed = createRuleSchema.parse(BASE_RULE);

    expect(parsed.endCondition).toEqual({ kind: 'count', runs: 20 });
    expect(parsed.maxExecutionsPerSource).toBe(1);
  });

  it('requires a JSON object for a test event', () => {
    expect(testRunSchema.safeParse({ sampleEvent: {} }).success).toBe(true);
    expect(testRunSchema.safeParse({ sampleEvent: null }).success).toBe(false);
    expect(testRunSchema.safeParse({ sampleEvent: [] }).success).toBe(false);
  });
});
