import { describe, expect, it } from 'vitest';

import { newIdFor } from './ids';
import { postingSetInputSchema, postingSetPatchSchema } from './posting-sets';
import { canPause, pauseRefusal, PAUSABLE_PUBLISH_STATES } from './publishing';

const brandId = newIdFor('brand');
const connectionA = newIdFor('connection');
const connectionB = newIdFor('connection');

describe('postingSetInputSchema', () => {
  it('defaults an unconfigured Set to no approval and the queue slot', () => {
    const parsed = postingSetInputSchema.parse({ brandId, name: 'Launch' });
    expect(parsed.approvalPolicy).toBe('none');
    expect(parsed.slotBehavior).toBe('next_free_slot');
    expect(parsed.connectionIds).toEqual([]);
    expect(parsed.signatureId).toBeNull();
  });

  it('rejects the same channel twice', () => {
    const result = postingSetInputSchema.safeParse({
      brandId,
      name: 'Launch',
      connectionIds: [connectionA, connectionA],
    });
    expect(result.success).toBe(false);
  });

  it('rejects two defaults for the same platform', () => {
    const result = postingSetInputSchema.safeParse({
      brandId,
      name: 'Launch',
      targetDefaults: [{ provider: 'mastodon' }, { provider: 'mastodon' }],
    });
    expect(result.success).toBe(false);
  });

  it('accepts one default per platform', () => {
    const parsed = postingSetInputSchema.parse({
      brandId,
      name: 'Launch',
      connectionIds: [connectionA, connectionB],
      targetDefaults: [{ provider: 'mastodon' }, { provider: 'linkedin', requireAltText: true }],
    });
    expect(parsed.targetDefaults).toHaveLength(2);
    expect(parsed.targetDefaults[1]?.requireAltText).toBe(true);
    expect(parsed.targetDefaults[0]?.privacyValue).toBeNull();
  });
});

describe('postingSetPatchSchema', () => {
  it('treats an absent field as leave alone and null as clear', () => {
    const parsed = postingSetPatchSchema.parse({ signatureId: null });
    expect(parsed).toEqual({ signatureId: null });
    expect('name' in parsed).toBe(false);
  });

  it('refuses an unknown field rather than dropping it silently', () => {
    expect(postingSetPatchSchema.safeParse({ brandId }).success).toBe(false);
  });
});

describe('pause eligibility', () => {
  it('allows a pause only in the states where the clock is still ours', () => {
    for (const state of PAUSABLE_PUBLISH_STATES) {
      expect(canPause(state), state).toBe(true);
    }
  });

  it('refuses a job that already reached the platform', () => {
    expect(pauseRefusal('published')).toBe('already_published');
    expect(pauseRefusal('partially_published')).toBe('already_published');
    expect(pauseRefusal('deleted_externally')).toBe('already_published');
  });

  it('refuses a job that is mid dispatch', () => {
    expect(pauseRefusal('preparing_media')).toBe('in_flight');
    expect(pauseRefusal('dispatching')).toBe('in_flight');
    expect(pauseRefusal('provider_processing')).toBe('in_flight');
  });

  it('refuses a job that is already finished', () => {
    expect(pauseRefusal('canceled')).toBe('terminal');
    expect(pauseRefusal('failed_permanently')).toBe('terminal');
  });
});
