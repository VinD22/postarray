import { describe, expect, it } from 'vitest';

import { progressStepForState } from './publish-progress';

describe('live publish progress', () => {
  it('moves forward with the durable publishing state machine', () => {
    expect(progressStepForState('scheduled')).toBe(0);
    expect(progressStepForState('preparing_media')).toBe(1);
    expect(progressStepForState('dispatching')).toBe(2);
    expect(progressStepForState('provider_processing')).toBe(3);
    expect(progressStepForState('published')).toBe(4);
  });

  it('places user-action failures at the handoff stage instead of claiming completion', () => {
    expect(progressStepForState('action_required')).toBe(3);
    expect(progressStepForState('failed_permanently')).toBe(3);
  });
});
