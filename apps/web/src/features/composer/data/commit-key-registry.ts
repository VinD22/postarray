import { newIdempotencyKey } from '@/lib/api';

export type CommitOperation = 'content_version' | 'approval_request' | 'schedule' | 'publish';

export interface CommitKeyRegistry {
  /**
   * Returns one key for one operation and draft revision.
   *
   * A retry after an ambiguous network failure must reuse the first key. A
   * later edit bumps the composer revision, which deliberately starts a new
   * intent and therefore receives a new key.
   */
  readonly keyFor: (operation: CommitOperation, revision: number) => string;
}

export function createCommitKeyRegistry(
  generate: (prefix: string) => string = newIdempotencyKey,
): CommitKeyRegistry {
  const entries = new Map<CommitOperation, { readonly revision: number; readonly key: string }>();

  return {
    keyFor(operation, revision) {
      const existing = entries.get(operation);
      if (existing?.revision === revision) {
        return existing.key;
      }

      const key = generate(operation);
      entries.set(operation, { revision, key });
      return key;
    },
  };
}
