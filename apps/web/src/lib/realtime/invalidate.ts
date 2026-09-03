import type { QueryClient } from '@tanstack/react-query';
import type { RealtimeEvent } from '@relay/contracts';

import { keys } from '@/lib/api/keys';

/**
 * What each live update makes stale.
 *
 * The event carries ids and enumerations and nothing else, so nothing here
 * writes into the cache. It marks queries stale and React Query refetches them
 * through the ordinary authorized client, which is what keeps one read path
 * and one set of authorization rules rather than two.
 *
 * Prefixes are used deliberately where an id is not enough. A post state change
 * invalidates the whole content prefix for the workspace because a job moving
 * changes the queue, the calendar and the item, and enumerating those three by
 * exact key would silently stop covering a fourth the day somebody adds one.
 */
export function invalidateForEvent(
  client: QueryClient,
  workspaceId: string,
  event: RealtimeEvent,
): void {
  const invalidate = (queryKey: readonly unknown[]): void => {
    void client.invalidateQueries({ queryKey });
  };

  switch (event.data.type) {
    case 'post.status': {
      invalidate(keys.publishJob(workspaceId, event.data.publishJobId));
      invalidate(['ws', workspaceId, 'content']);
      invalidate(['ws', workspaceId, 'calendar']);
      invalidate(keys.receipts(workspaceId));
      invalidate(['ws', workspaceId, 'action-center']);
      return;
    }
    case 'receipt.updated': {
      invalidate(keys.receipt(workspaceId, event.data.receiptId));
      invalidate(keys.receipts(workspaceId));
      if (event.data.publishJobId !== null) {
        invalidate(keys.publishJob(workspaceId, event.data.publishJobId));
      }
      if (event.data.contentItemId !== null) {
        invalidate(keys.contentItem(workspaceId, event.data.contentItemId));
      }
      return;
    }
    case 'action_item.created': {
      invalidate(['ws', workspaceId, 'action-center']);
      return;
    }
    case 'upload.scanned': {
      invalidate(['ws', workspaceId, 'media']);
      return;
    }
    case 'connection.status': {
      invalidate(keys.connection(workspaceId, event.data.connectionId));
      invalidate(['ws', workspaceId, 'connections']);
      invalidate(['ws', workspaceId, 'action-center']);
      return;
    }
    case 'notification.created': {
      invalidate(['ws', workspaceId, 'notifications']);
      invalidate(['ws', workspaceId, 'action-center']);
      return;
    }
  }
}

/**
 * The same refresh, without an event to say what changed.
 *
 * This is the fallback: when the stream has failed twice the client stops
 * knowing which query is stale, so on an interval it treats everything the
 * stream would have covered as stale. It is exactly the sixty-second polling
 * the action centre already does, extended to the screens that had none.
 */
export function invalidateLiveQueries(client: QueryClient, workspaceId: string): void {
  for (const prefix of [
    ['ws', workspaceId, 'content'],
    ['ws', workspaceId, 'calendar'],
    ['ws', workspaceId, 'job'],
    ['ws', workspaceId, 'receipt'],
    ['ws', workspaceId, 'receipts'],
    ['ws', workspaceId, 'action-center'],
    ['ws', workspaceId, 'connections'],
    ['ws', workspaceId, 'media'],
    ['ws', workspaceId, 'notifications'],
  ]) {
    void client.invalidateQueries({ queryKey: prefix });
  }
}
