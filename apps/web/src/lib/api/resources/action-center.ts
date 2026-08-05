/**
 * The Action center queue.
 *
 * One queue for every situation that needs a human, from any part of the
 * system. The API assembles it; the client never derives it by scanning other
 * lists, because a derived queue silently misses the cases nobody thought of.
 */

import { call } from '../call';
import { demoActionItems, page } from '../fixtures';
import type { ActionItemCategory, ActionItemView, Paginated } from '../types';

export type ActionCenterQuery = {
  readonly category?: ActionItemCategory;
  readonly includeSnoozed?: boolean;
  readonly cursor?: string;
  readonly limit?: number;
};

export const actionCenterApi = {
  list: (query: ActionCenterQuery = {}): Promise<Paginated<ActionItemView>> =>
    call('/action-center', { query }, () =>
      page(
        demoActionItems.filter((item) => {
          if (query.category !== undefined && item.category !== query.category) {
            return false;
          }
          return query.includeSnoozed === true || item.snoozedUntil === null;
        }),
      ),
    ),

  snooze: (
    itemId: string,
    input: { until: string },
    idempotencyKey: string,
  ): Promise<ActionItemView | null> =>
    call(
      `/action-center/${itemId}/snooze`,
      { method: 'POST', body: input, idempotencyKey },
      () => null,
    ),

  unsnooze: (itemId: string): Promise<void> =>
    call(`/action-center/${itemId}/snooze`, { method: 'DELETE' }, () => undefined),
};
