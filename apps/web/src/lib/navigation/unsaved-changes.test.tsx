import { describe, expect, it, vi } from 'vitest';

import {
  confirmLeavingUnsaved,
  hasUnsavedChanges,
  registerUnsavedChanges,
} from './unsaved-changes';

/**
 * The registry, on its own. What matters is that an unregistered app never
 * asks a question nobody can answer, and that a clean screen is not treated as
 * a dirty one just because it is still mounted.
 */

describe('unsaved changes registry', () => {
  it('lets navigation through when nothing has registered', async () => {
    await expect(confirmLeavingUnsaved()).resolves.toBe(true);
    expect(hasUnsavedChanges()).toBe(false);
  });

  it('asks only while the registered screen says it is dirty', async () => {
    const confirmLeave = vi.fn(() => Promise.resolve(false));
    let dirty = false;
    const unregister = registerUnsavedChanges({ isDirty: () => dirty, confirmLeave });

    expect(hasUnsavedChanges()).toBe(false);
    await expect(confirmLeavingUnsaved()).resolves.toBe(true);
    expect(confirmLeave).not.toHaveBeenCalled();

    dirty = true;
    expect(hasUnsavedChanges()).toBe(true);
    await expect(confirmLeavingUnsaved()).resolves.toBe(false);
    expect(confirmLeave).toHaveBeenCalledTimes(1);

    unregister();
    expect(hasUnsavedChanges()).toBe(false);
  });

  it('leaves a later registration in place when an older one unregisters', () => {
    const stale = registerUnsavedChanges({
      isDirty: () => true,
      confirmLeave: () => Promise.resolve(true),
    });
    registerUnsavedChanges({ isDirty: () => false, confirmLeave: () => Promise.resolve(true) });

    stale();

    expect(hasUnsavedChanges()).toBe(false);
  });
});
