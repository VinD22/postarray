import { isDomainEventOutboxKind, type DomainEventService } from '@relay/application';

import { UnknownOutboxKindError, type OutboxDispatchResult } from './outbox-dispatch';
import type { ClaimedOutboxEvent } from './outbox-repository';

/**
 * Dispatch one domain event.
 *
 * The workflow dispatcher answers "start this Temporal workflow" and returns
 * the workflow identity it created. A domain event starts nothing, so the
 * result is empty; the shape is shared only so one dispatcher class can drive
 * both loops.
 */
export async function dispatchDomainEventOutbox(
  domainEvents: DomainEventService,
  event: ClaimedOutboxEvent,
): Promise<OutboxDispatchResult> {
  if (!isDomainEventOutboxKind(event.kind)) {
    throw new UnknownOutboxKindError(event.kind);
  }

  await domainEvents.dispatch({
    id: event.id,
    workspaceId: event.workspaceId,
    kind: event.kind,
    dedupeKey: event.dedupeKey,
    payload: event.payload,
  });

  return { workflowId: null, runId: null, publishJobId: null };
}
