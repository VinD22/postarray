/**
 * Where a platform stops showing text.
 *
 * A rule with no threshold returns the whole body as visible and `collapsed`
 * false. That is not a fallback, it is the honest answer: we only collapse
 * where the provider documents that it collapses, and a preview that invented
 * a "See more" at some plausible length would be teaching the writer a limit
 * that does not exist.
 */

import type { PresentationRule } from './types';

export interface CollapsedText {
  /** What the platform shows before any interaction. */
  readonly visible: string;
  /** The remainder, empty when nothing is hidden. */
  readonly hidden: string;
  readonly collapsed: boolean;
}

function cutOnWordBoundary(text: string, limit: number): number {
  if (text.length <= limit) {
    return text.length;
  }
  const window = text.slice(0, limit);
  const lastSpace = window.lastIndexOf(' ');
  return lastSpace > limit * 0.6 ? lastSpace : limit;
}

export function collapseText(text: string, rule: PresentationRule): CollapsedText {
  const whole: CollapsedText = { visible: text, hidden: '', collapsed: false };
  const collapse = rule.collapse;
  if (collapse === null || text.length === 0) {
    return whole;
  }

  const cuts: number[] = [];
  if (collapse.afterChars !== null && text.length > collapse.afterChars) {
    cuts.push(cutOnWordBoundary(text, collapse.afterChars));
  }
  if (collapse.afterLines !== null) {
    const lines = text.split('\n');
    if (lines.length > collapse.afterLines) {
      cuts.push(lines.slice(0, collapse.afterLines).join('\n').length);
    }
  }
  if (cuts.length === 0) {
    return whole;
  }

  const cut = Math.min(...cuts);
  const visible = text.slice(0, cut).trimEnd();
  const hidden = text.slice(cut);
  if (hidden.trim().length === 0) {
    return whole;
  }
  return { visible, hidden, collapsed: true };
}
