import type { WorkflowOutboxInput } from '../outbox';

import { toJson } from './json';
import type { Db } from './runtime';

export async function enqueueWorkflowOutbox(
  db: Db,
  input: WorkflowOutboxInput & {
    readonly dedupeKey: string;
    readonly availableAt?: Date;
  },
): Promise<void> {
  await db.outboxEvent.create({
    data: {
      workspaceId: input.payload.workspaceId,
      kind: input.kind,
      dedupeKey: input.dedupeKey,
      payload: toJson(input.payload),
      ...(input.availableAt === undefined ? {} : { availableAt: input.availableAt }),
    },
  });
}
