'use client';

import { Component, type ReactNode } from 'react';

export interface WebglErrorBoundaryProps {
  readonly fallback: ReactNode;
  readonly children: ReactNode;
}

interface WebglErrorBoundaryState {
  readonly failed: boolean;
}

/**
 * Catches a WebGL failure inside the hero's decorative scene and swaps back
 * to the static fallback, instead of letting it blank the hero.
 *
 * `webgl-guard.ts` already turns away every browser that fails a throwaway
 * `getContext` probe before the scene ever mounts, so this boundary is the
 * second line of defence: the failure mode it exists for is a `WebGLRenderer`
 * construction that fails with the scene's *real* context attributes (which
 * differ from the guard's probe) or a driver-level failure on mount, neither
 * of which a pre-check can fully predict. A class component because React
 * error boundaries have no hook equivalent. No logging here: this is
 * decorative marketing chrome falling back to an equally finished state, not
 * an application error worth a report.
 */
export class WebglErrorBoundary extends Component<
  WebglErrorBoundaryProps,
  WebglErrorBoundaryState
> {
  override state: WebglErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): WebglErrorBoundaryState {
    return { failed: true };
  }

  override render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
