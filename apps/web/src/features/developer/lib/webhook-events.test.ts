import { describe, expect, it } from 'vitest';
import { WEBHOOK_EVENT_NAMES } from '@relay/contracts';

import { webhookEventGroups } from './webhook-events.js';

describe('webhookEventGroups', () => {
  it('offers every event the API can send, exactly once', () => {
    const offered = webhookEventGroups().flatMap((group) => group.events);
    expect([...offered].sort()).toEqual([...WEBHOOK_EVENT_NAMES].sort());
    expect(new Set(offered).size).toBe(offered.length);
  });

  it('keeps publishing events together, because that is what receivers subscribe to', () => {
    const publishing = webhookEventGroups().find((group) => group.id === 'publishing');
    expect(publishing?.events).toContain('post.published');
    expect(publishing?.events).toContain('post.partially_published');
    expect(publishing?.events).toContain('comment.failed');
  });
});
