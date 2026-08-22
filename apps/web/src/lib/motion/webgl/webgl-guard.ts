'use client';

import { useEffect, useState } from 'react';

import { useMotionOk } from '@/lib/motion/use-motion-ok';

/**
 * The bail-out gate for the hero's decorative WebGL scene.
 *
 * The scene (`hero-publish-scene.tsx`) is pure decoration next to real
 * product UI, so every one of these conditions turns it off permanently in
 * favour of `publish-fanout-fallback.tsx` rather than degrading it — there is
 * no "cheaper" WebGL mode to fall back to, only "on" or "static".
 *
 * `shouldSkipWebgl` is a pure function over signals the caller already read,
 * so the five bail-out conditions are testable without touching React or a
 * real browser. `useWebglAllowed` is the thin client-only wrapper every
 * caller actually uses: it adds the one signal that is not a device
 * capability at all — `prefers-reduced-motion`, read through `useMotionOk`,
 * the same hook every other animation in this codebase gates on, rather than
 * a second hand-rolled `matchMedia` check.
 */

/** The signals `shouldSkipWebgl` decides over. All device/network, not user preference. */
export interface WebglHardwareSignals {
  /** `navigator.connection?.saveData`. */
  readonly saveData: boolean;
  /** `navigator.deviceMemory`, in GB. `undefined` where the browser does not expose it. */
  readonly deviceMemory: number | undefined;
  /** `navigator.hardwareConcurrency`. `undefined` where the browser does not expose it. */
  readonly hardwareConcurrency: number | undefined;
  /** Whether a throwaway `<canvas>` could acquire a WebGL2 or WebGL context. */
  readonly canCreateContext: boolean;
}

/**
 * `navigator.connection` and `navigator.deviceMemory` are both real, shipping
 * browser APIs with no entry in TypeScript's bundled DOM lib. This is the
 * documented boundary shim for that gap: a narrow, locally-declared extension
 * of `Navigator` rather than a cast through `any`.
 */
interface NavigatorWithHints extends Navigator {
  readonly connection?: { readonly saveData?: boolean };
  readonly deviceMemory?: number;
}

/** Below this many gigabytes of device memory, skip the scene. */
const MIN_DEVICE_MEMORY_GB = 4;
/** At or below this many logical cores, skip the scene. */
const MAX_SKIPPED_HARDWARE_CONCURRENCY = 4;

/**
 * Attempts to acquire a WebGL context on a detached, never-rendered canvas.
 *
 * Wrapped in try/catch on purpose: most browsers simply return `null` when
 * WebGL is unavailable, but some privacy extensions and locked-down
 * environments throw out of `getContext` instead. Either outcome means the
 * same thing here — no context, no scene — and neither may reach the caller
 * as an unhandled error.
 */
export function canCreateWebglContext(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

/** Reads the live hardware/network signals from the current browser. */
export function readWebglHardwareSignals(): WebglHardwareSignals {
  const nav: NavigatorWithHints | undefined =
    typeof navigator === 'undefined' ? undefined : (navigator as NavigatorWithHints);
  return {
    saveData: Boolean(nav?.connection?.saveData),
    deviceMemory: nav?.deviceMemory,
    hardwareConcurrency: nav?.hardwareConcurrency,
    canCreateContext: canCreateWebglContext(),
  };
}

/**
 * Whether the hardware/network signals alone rule the scene out. Does not
 * consider `prefers-reduced-motion` — that is `useMotionOk`'s job, kept
 * separate so this stays a pure function over data the caller already has.
 */
export function shouldSkipWebgl(signals: WebglHardwareSignals): boolean {
  if (signals.saveData) return true;
  if (signals.deviceMemory !== undefined && signals.deviceMemory < MIN_DEVICE_MEMORY_GB)
    return true;
  if (
    signals.hardwareConcurrency !== undefined &&
    signals.hardwareConcurrency <= MAX_SKIPPED_HARDWARE_CONCURRENCY
  ) {
    return true;
  }
  if (!signals.canCreateContext) return true;
  return false;
}

/**
 * Whether the hero may attempt the WebGL scene at all.
 *
 * Defaults to `false` on the server and on the client's first render — the
 * hardware signals are read in an effect, never during render, so server HTML
 * and first paint always show `publish-fanout-fallback.tsx`. `useMotionOk`
 * already carries its own server-safe default (reduced motion assumed until
 * the client confirms otherwise), so combining the two here cannot flip a
 * static first paint into an animated one.
 *
 * This says nothing about scroll position, tab visibility or idle scheduling
 * — `hero-webgl-stage.tsx` owns those, and mounts the scene only once this is
 * `true` as well.
 */
export function useWebglAllowed(): boolean {
  const motionOk = useMotionOk();
  const [hardwareOk, setHardwareOk] = useState(false);

  useEffect(() => {
    setHardwareOk(!shouldSkipWebgl(readWebglHardwareSignals()));
  }, []);

  return motionOk && hardwareOk;
}
