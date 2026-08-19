import type { PublishSceneColors } from './hero-publish-scene';

/**
 * Reads the WebGL scene's colours from the design system's own custom
 * properties, the same `getComputedStyle` pattern `ScrollScene` already uses
 * to resolve its background tokens — see that component's doc comment. No
 * colour here is invented: `node` is `--text-primary` (the same ink the
 * headline is set in), `line`/`satellite` are the two border tokens already
 * used for structure everywhere else on the page, and `pulse` is
 * `--accent-cool-default` (ultramarine), documented in
 * `packages/design-system/README.md` as the family for "live" and
 * "published" moments — which is exactly what the travelling pulses are.
 *
 * Three.js materials take colour strings directly (hex, `rgb()`, named
 * colours), so the resolved custom-property values pass straight through
 * with no parsing.
 */

/**
 * Fallback values, used only if `getComputedStyle` somehow returns an empty
 * string for a token that is always defined in `theme.css` (a detached
 * element, for instance). These are the same light-theme hex values the
 * tokens themselves resolve to, not new colours: `--text-primary`,
 * `--border-strong`, `--border-default` and `--accent-cool-default` in
 * `packages/design-system/src/tokens/theme.css`.
 */
const FALLBACK_COLORS: PublishSceneColors = {
  node: '#141413',
  satellite: '#6b6866',
  line: '#e0dbd1',
  pulse: '#3b4cc0',
};

function readToken(computed: CSSStyleDeclaration, name: string, fallback: string): string {
  const value = computed.getPropertyValue(name).trim();
  return value === '' ? fallback : value;
}

/** Resolves the scene's palette against `el`'s computed style. */
export function readSceneColors(el: Element): PublishSceneColors {
  const computed = getComputedStyle(el);
  return {
    node: readToken(computed, '--text-primary', FALLBACK_COLORS.node),
    satellite: readToken(computed, '--border-strong', FALLBACK_COLORS.satellite),
    line: readToken(computed, '--border-default', FALLBACK_COLORS.line),
    pulse: readToken(computed, '--accent-cool-default', FALLBACK_COLORS.pulse),
  };
}
