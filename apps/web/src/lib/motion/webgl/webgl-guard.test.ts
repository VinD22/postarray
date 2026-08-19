import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import {
  mockMotionPreference,
  restoreMotionPreference,
} from '@/components/motion/motion-test-media';

import {
  canCreateWebglContext,
  readWebglHardwareSignals,
  shouldSkipWebgl,
  useWebglAllowed,
  type WebglHardwareSignals,
} from './webgl-guard';

/**
 * Every signal at its safest value: not save-data, memory/cores unreported
 * (so no threshold applies), context creation succeeds.
 */
const CLEAR_SIGNALS: WebglHardwareSignals = {
  saveData: false,
  deviceMemory: undefined,
  hardwareConcurrency: undefined,
  canCreateContext: true,
};

type NavigatorHintName = 'connection' | 'deviceMemory' | 'hardwareConcurrency';

/**
 * jsdom implements `navigator.hardwareConcurrency` (via a prototype getter)
 * but not `connection` or `deviceMemory` at all, so a plain own-property
 * `defineProperty`/`delete` pair works uniformly for all three: `delete`
 * either uncovers the real getter again or restores the genuine absence.
 */
function setNavigatorHint(name: NavigatorHintName, value: unknown): void {
  Object.defineProperty(window.navigator, name, { value, configurable: true });
}

function clearNavigatorHints(): void {
  const nav = window.navigator as unknown as Record<NavigatorHintName, unknown>;
  delete nav.connection;
  delete nav.deviceMemory;
  delete nav.hardwareConcurrency;
}

afterEach(() => {
  clearNavigatorHints();
  vi.restoreAllMocks();
  restoreMotionPreference();
});

describe('shouldSkipWebgl', () => {
  it('allows the scene when every signal is clear', () => {
    expect(shouldSkipWebgl(CLEAR_SIGNALS)).toBe(false);
  });

  it('skips on navigator.connection.saveData', () => {
    expect(shouldSkipWebgl({ ...CLEAR_SIGNALS, saveData: true })).toBe(true);
  });

  it('skips when deviceMemory is defined and under 4GB', () => {
    expect(shouldSkipWebgl({ ...CLEAR_SIGNALS, deviceMemory: 2 })).toBe(true);
  });

  it('allows deviceMemory at or above 4GB', () => {
    expect(shouldSkipWebgl({ ...CLEAR_SIGNALS, deviceMemory: 4 })).toBe(false);
    expect(shouldSkipWebgl({ ...CLEAR_SIGNALS, deviceMemory: 8 })).toBe(false);
  });

  it('leaves the scene on when deviceMemory is not reported at all', () => {
    expect(shouldSkipWebgl({ ...CLEAR_SIGNALS, deviceMemory: undefined })).toBe(false);
  });

  it('skips when hardwareConcurrency is defined and at most 4', () => {
    expect(shouldSkipWebgl({ ...CLEAR_SIGNALS, hardwareConcurrency: 4 })).toBe(true);
    expect(shouldSkipWebgl({ ...CLEAR_SIGNALS, hardwareConcurrency: 2 })).toBe(true);
  });

  it('allows hardwareConcurrency above 4', () => {
    expect(shouldSkipWebgl({ ...CLEAR_SIGNALS, hardwareConcurrency: 8 })).toBe(false);
  });

  it('leaves the scene on when hardwareConcurrency is not reported at all', () => {
    expect(shouldSkipWebgl({ ...CLEAR_SIGNALS, hardwareConcurrency: undefined })).toBe(false);
  });

  it('skips when no WebGL context could be acquired', () => {
    expect(shouldSkipWebgl({ ...CLEAR_SIGNALS, canCreateContext: false })).toBe(true);
  });
});

describe('canCreateWebglContext', () => {
  it('is false when the browser refuses every WebGL context', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    expect(canCreateWebglContext()).toBe(false);
  });

  it('is true once webgl2 or webgl comes back non-null', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as unknown as RenderingContext,
    );
    expect(canCreateWebglContext()).toBe(true);
  });

  it('is false, not thrown, when getContext throws (privacy extensions do this)', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
      throw new Error('WebGL is disabled by policy');
    });
    expect(() => canCreateWebglContext()).not.toThrow();
    expect(canCreateWebglContext()).toBe(false);
  });
});

describe('readWebglHardwareSignals', () => {
  it('reads saveData, deviceMemory and hardwareConcurrency off navigator', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as unknown as RenderingContext,
    );
    setNavigatorHint('connection', { saveData: true });
    setNavigatorHint('deviceMemory', 2);
    setNavigatorHint('hardwareConcurrency', 2);

    const signals = readWebglHardwareSignals();

    expect(signals).toEqual({
      saveData: true,
      deviceMemory: 2,
      hardwareConcurrency: 2,
      canCreateContext: true,
    });
  });

  it('reports the hints browsers may not expose as undefined/false rather than throwing', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    setNavigatorHint('connection', undefined);
    setNavigatorHint('deviceMemory', undefined);
    setNavigatorHint('hardwareConcurrency', undefined);

    const signals = readWebglHardwareSignals();

    expect(signals.saveData).toBe(false);
    expect(signals.deviceMemory).toBeUndefined();
    expect(signals.hardwareConcurrency).toBeUndefined();
  });
});

describe('useWebglAllowed', () => {
  it('is false when prefers-reduced-motion is set, even with clear hardware', async () => {
    mockMotionPreference('reduce');
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as unknown as RenderingContext,
    );

    const { result } = renderHook(() => useWebglAllowed());

    // Stays false: there is no clear-hardware state that overrides reduced motion.
    await waitFor(() => expect(result.current).toBe(false));
  });

  it('is false on navigator.connection.saveData, even with motion allowed', async () => {
    mockMotionPreference('no-preference');
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as unknown as RenderingContext,
    );
    setNavigatorHint('connection', { saveData: true });

    const { result } = renderHook(() => useWebglAllowed());

    await waitFor(() => expect(result.current).toBe(false));
  });

  it('is false when deviceMemory is reported below 4GB', async () => {
    mockMotionPreference('no-preference');
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as unknown as RenderingContext,
    );
    setNavigatorHint('deviceMemory', 2);

    const { result } = renderHook(() => useWebglAllowed());

    await waitFor(() => expect(result.current).toBe(false));
  });

  it('is false when hardwareConcurrency is reported at 4 or below', async () => {
    mockMotionPreference('no-preference');
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as unknown as RenderingContext,
    );
    setNavigatorHint('hardwareConcurrency', 4);

    const { result } = renderHook(() => useWebglAllowed());

    await waitFor(() => expect(result.current).toBe(false));
  });

  it('is false when the browser cannot acquire a WebGL context', async () => {
    mockMotionPreference('no-preference');
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    const { result } = renderHook(() => useWebglAllowed());

    await waitFor(() => expect(result.current).toBe(false));
  });

  it('is true once motion is allowed and every hardware signal clears', async () => {
    mockMotionPreference('no-preference');
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as unknown as RenderingContext,
    );

    const { result } = renderHook(() => useWebglAllowed());

    await waitFor(() => expect(result.current).toBe(true));
  });
});
