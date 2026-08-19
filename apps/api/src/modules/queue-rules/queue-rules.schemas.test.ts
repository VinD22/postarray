import { newIdFor } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { OPERATIONS } from '../../openapi/catalog';
import {
  acceptQueueSlotSchema,
  createQueueRuleSchema,
  nextQueueSlotQuerySchema,
  proposeQueueSlotSchema,
  queueRuleIdSchema,
  queueSlotIdSchema,
} from './queue-rules.schemas';

const BASE = {
  projectId: newIdFor('project'),
  name: 'Weekday mornings',
  ianaTimeZone: 'Europe/London',
  windows: [{ weekday: 1, startMinute: 540, endMinute: 720 }],
  minimumGapMinutes: 120,
} as const;

describe('queue rule payloads', () => {
  it('keeps an absent daily maximum distinct from zero at the edge', () => {
    expect(
      createQueueRuleSchema.safeParse({ ...BASE, maximumPerDay: null }).data?.maximumPerDay,
    ).toBeNull();
    expect(createQueueRuleSchema.safeParse({ ...BASE, maximumPerDay: 0 }).data?.maximumPerDay).toBe(
      0,
    );
    // The field is required in the body: nothing gets to guess which one a
    // caller meant.
    expect(createQueueRuleSchema.safeParse(BASE).success).toBe(false);
  });

  it('refuses a project id that is not a project id', () => {
    expect(
      createQueueRuleSchema.safeParse({
        ...BASE,
        maximumPerDay: null,
        projectId: newIdFor('connection'),
      }).success,
    ).toBe(false);
  });

  it('parses its own identifier prefixes and refuses the other one', () => {
    const rule = newIdFor('queueRule');
    const slot = newIdFor('queueSlotReservation');
    expect(queueRuleIdSchema.safeParse(rule).success).toBe(true);
    expect(queueSlotIdSchema.safeParse(slot).success).toBe(true);
    expect(queueRuleIdSchema.safeParse(slot).success).toBe(false);
    expect(queueSlotIdSchema.safeParse(rule).success).toBe(false);
  });

  it('requires a content item to accept a slot, because that is the decision', () => {
    expect(acceptQueueSlotSchema.safeParse({}).success).toBe(false);
    expect(
      acceptQueueSlotSchema.safeParse({ contentItemId: newIdFor('contentItem') }).success,
    ).toBe(true);
  });

  it('accepts an optional draft when proposing and an optional after instant', () => {
    expect(proposeQueueSlotSchema.safeParse({ projectId: BASE.projectId }).success).toBe(true);
    expect(
      proposeQueueSlotSchema.safeParse({
        projectId: BASE.projectId,
        after: '2026-06-08T08:00:00.000Z',
        contentItemId: newIdFor('contentItem'),
      }).success,
    ).toBe(true);
    expect(
      nextQueueSlotQuerySchema.safeParse({ projectId: BASE.projectId, after: 'yesterday' }).success,
    ).toBe(false);
  });
});

describe('the published catalog', () => {
  const queue = OPERATIONS.filter((operation) => operation.tag === 'queue');

  it('publishes every queue route', () => {
    expect(queue.map((operation) => operation.operationId).toSorted()).toEqual([
      'queueRules.acceptSlot',
      'queueRules.archive',
      'queueRules.create',
      'queueRules.get',
      'queueRules.list',
      'queueRules.listSlots',
      'queueRules.nextSlot',
      'queueRules.proposeSlot',
      'queueRules.releaseSlot',
      'queueRules.update',
    ]);
  });

  it('never grants posts:publish anywhere in the queue, because it schedules nothing', () => {
    for (const operation of queue) {
      expect(operation.scopes).not.toContain('posts:publish');
    }
  });

  it('demands an idempotency key on every write that holds or creates something', () => {
    const keyed = queue
      .filter((operation) => operation.requiresIdempotencyKey === true)
      .map((operation) => operation.operationId)
      .toSorted();
    expect(keyed).toEqual([
      'queueRules.acceptSlot',
      'queueRules.create',
      'queueRules.proposeSlot',
      'queueRules.update',
    ]);
  });
});
