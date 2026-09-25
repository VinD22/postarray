import { describe, expect, it, vi } from 'vitest';

import { createCommitKeyRegistry } from './commit-key-registry';

describe('composer commit idempotency keys', () => {
  it('reuses every operation key when the same user intent is retried', () => {
    const generate = vi
      .fn<(prefix: string) => string>()
      .mockImplementation((prefix) => `${prefix}.${generate.mock.calls.length}`);
    const registry = createCommitKeyRegistry(generate);

    expect(registry.keyFor('publish', 7)).toBe(registry.keyFor('publish', 7));
    expect(registry.keyFor('content_version', 7)).toBe(registry.keyFor('content_version', 7));
    expect(generate).toHaveBeenCalledTimes(2);
  });

  it('mints a new key after an edit creates a new intent', () => {
    let sequence = 0;
    const registry = createCommitKeyRegistry((prefix) => `${prefix}.${++sequence}`);

    const beforeEdit = registry.keyFor('schedule', 4);
    const afterEdit = registry.keyFor('schedule', 5);

    expect(afterEdit).not.toBe(beforeEdit);
  });

  it('keeps different external operations in separate idempotency domains', () => {
    let sequence = 0;
    const registry = createCommitKeyRegistry((prefix) => `${prefix}.${++sequence}`);

    expect(registry.keyFor('content_version', 3)).not.toBe(registry.keyFor('approval_request', 3));
  });
});
