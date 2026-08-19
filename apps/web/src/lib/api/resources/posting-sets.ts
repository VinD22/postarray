/**
 * Posting Sets and the composer's remembered channel selection.
 *
 * Both are configuration, not content. Nothing here publishes, schedules or
 * edits a draft, and the remembered selection carries channel identifiers only.
 */

import type {
  Paginated as ContractPaginated,
  PostingSetInput,
  PostingSetPatch,
  PostingSetView,
  RememberedTargetsView,
} from '@relay/contracts';

import { call } from '../call';
import { page } from '../fixtures';
import type { ForwardAuth } from '../transport';

/**
 * Demo mode shows an empty list rather than an invented Set. A fabricated
 * "Launch day" Set would be a claim about this workspace that is not true.
 */
const NO_SETS: readonly PostingSetView[] = [];

export const postingSetsApi = {
  list: (
    query: { projectId?: string; includeArchived?: boolean } = {},
    forward?: ForwardAuth,
  ): Promise<ContractPaginated<PostingSetView>> =>
    call('/posting-sets', { query, ...forward }, () => page(NO_SETS)),

  get: (setId: string): Promise<PostingSetView | null> =>
    call(`/posting-sets/${setId}`, {}, () => null),

  create: (input: PostingSetInput, idempotencyKey: string): Promise<PostingSetView> =>
    call('/posting-sets', { method: 'POST', body: input, idempotencyKey }, () => {
      throw new Error('Creating a Posting Set is unavailable in demo mode.');
    }),

  update: (
    setId: string,
    patch: PostingSetPatch,
    idempotencyKey: string,
  ): Promise<PostingSetView> =>
    call(`/posting-sets/${setId}`, { method: 'PATCH', body: patch, idempotencyKey }, () => {
      throw new Error('Editing a Posting Set is unavailable in demo mode.');
    }),

  archive: (setId: string): Promise<PostingSetView> =>
    call(`/posting-sets/${setId}`, { method: 'DELETE' }, () => {
      throw new Error('Archiving a Posting Set is unavailable in demo mode.');
    }),
};

/** A project that has not opted in, which is the honest demo-mode answer. */
function optedOut(projectId: string): RememberedTargetsView {
  return {
    projectId,
    enabled: false,
    connectionIds: [],
    droppedConnectionIds: [],
    updatedAt: null,
  };
}

export const targetMemoryApi = {
  read: (projectId: string): Promise<RememberedTargetsView> =>
    call(`/projects/${projectId}/remembered-targets`, {}, () => optedOut(projectId)),

  remember: (
    projectId: string,
    connectionIds: readonly string[],
  ): Promise<RememberedTargetsView> =>
    call(
      `/projects/${projectId}/remembered-targets`,
      { method: 'PUT', body: { connectionIds: [...connectionIds] } },
      () => optedOut(projectId),
    ),

  forget: (projectId: string): Promise<void> =>
    call(`/projects/${projectId}/remembered-targets`, { method: 'DELETE' }, () => undefined),

  setEnabled: (
    projectId: string,
    enabled: boolean,
  ): Promise<{ readonly projectId: string; readonly enabled: boolean }> =>
    call(
      `/projects/${projectId}/remembered-targets/setting`,
      { method: 'PUT', body: { enabled } },
      () => ({ projectId, enabled: false }),
    ),
};
