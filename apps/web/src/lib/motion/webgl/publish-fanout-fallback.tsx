import type { ReactNode } from 'react';

/**
 * The static, server-rendered fallback for the hero's publish fan-out scene.
 *
 * This is what a crawler, a no-JS visitor, a reduced-motion visitor, a
 * low-power device and the very first paint on every device all see — the
 * WebGL canvas (`hero-publish-scene.tsx`) only ever replaces this after it
 * has mounted and successfully acquired a context client-side. So this is not
 * a loading spinner: it has to carry the same idea on its own, permanently,
 * for everyone `webgl-guard.ts` turns away.
 *
 * Plain SVG, five lines fanning from one node to five, one of them carrying a
 * small dot partway along to gesture at the same "in flight" idea the WebGL
 * version animates. No inline styles and no raw hex: every colour is a
 * `text-*` utility resolving to a design-system token, painted through
 * `currentColor`, so it repaints correctly under `[data-theme]` with no JS
 * branch at all.
 */
export function PublishFanoutFallback({ className }: { readonly className?: string }): ReactNode {
  return (
    <svg
      viewBox="0 0 200 150"
      className={className}
      role="presentation"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <g className="text-border-default" fill="none" stroke="currentColor" strokeWidth="1">
        <line x1="42" y1="75" x2="172" y2="18" />
        <line x1="42" y1="75" x2="172" y2="47" />
        <line x1="42" y1="75" x2="172" y2="75" />
        <line x1="42" y1="75" x2="172" y2="103" />
        <line x1="42" y1="75" x2="172" y2="132" />
      </g>
      <g className="text-accent-cool">
        <circle cx="109" cy="59" r="3" fill="currentColor" opacity="0.85" />
      </g>
      <g className="text-border-strong" fill="currentColor">
        <circle cx="172" cy="18" r="4" />
        <circle cx="172" cy="47" r="4" />
        <circle cx="172" cy="75" r="4" />
        <circle cx="172" cy="103" r="4" />
        <circle cx="172" cy="132" r="4" />
      </g>
      <g className="text-text-primary" fill="currentColor">
        <rect x="34" y="67" width="16" height="16" rx="3" transform="rotate(45 42 75)" />
      </g>
    </svg>
  );
}
