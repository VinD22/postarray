import { StrictMode, createElement, type ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useFirstLoadFlag } from './use-first-load-flag';

function strict({ children }: { children: ReactNode }) {
  return createElement(StrictMode, null, children);
}

describe('useFirstLoadFlag', () => {
  it('agrees across a strict double render of the first loaded commit', () => {
    const seen: boolean[] = [];
    renderHook(
      () => {
        const value = useFirstLoadFlag(true);
        seen.push(value);
        return value;
      },
      { wrapper: strict },
    );
    expect(seen.length).toBeGreaterThan(1);
    expect(seen.every(Boolean)).toBe(true);
  });

  it('is false before data and after the first loaded commit', () => {
    const { result, rerender } = renderHook(({ ready }) => useFirstLoadFlag(ready), {
      initialProps: { ready: false },
    });
    expect(result.current).toBe(false);
    rerender({ ready: true });
    expect(result.current).toBe(true);
    rerender({ ready: true });
    expect(result.current).toBe(false);
  });
});
