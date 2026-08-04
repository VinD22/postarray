import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * jsdom does not implement matchMedia, ResizeObserver, or the pointer capture
 * APIs that Radix primitives rely on. These shims keep component tests honest
 * about behaviour while allowing them to run headlessly.
 */

if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }

  if (!('ResizeObserver' in window)) {
    class ResizeObserverShim {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      value: ResizeObserverShim,
    });
  }

  if (!('DOMRect' in window)) {
    Object.defineProperty(window, 'DOMRect', {
      writable: true,
      value: class {
        constructor(
          public x = 0,
          public y = 0,
          public width = 0,
          public height = 0,
        ) {}
        get top(): number {
          return this.y;
        }
        get left(): number {
          return this.x;
        }
        get right(): number {
          return this.x + this.width;
        }
        get bottom(): number {
          return this.y + this.height;
        }
      },
    });
  }

  const proto = window.HTMLElement.prototype as unknown as Record<string, unknown>;
  if (!proto['hasPointerCapture']) proto['hasPointerCapture'] = () => false;
  if (!proto['setPointerCapture']) proto['setPointerCapture'] = () => undefined;
  if (!proto['releasePointerCapture']) proto['releasePointerCapture'] = () => undefined;
  if (!proto['scrollIntoView']) proto['scrollIntoView'] = () => undefined;

  if (!('requestAnimationFrame' in window)) {
    Object.defineProperty(window, 'requestAnimationFrame', {
      writable: true,
      value: (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0),
    });
  }
}

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
});
