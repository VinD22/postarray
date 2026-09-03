import { describe, expect, it } from 'vitest';

import { collapseText } from './truncation';
import { DEFAULT_PRESENTATION } from './presentation-rules';
import type { PresentationRule } from './types';

function withCollapse(collapse: PresentationRule['collapse']): PresentationRule {
  return { ...DEFAULT_PRESENTATION, collapse };
}

const LABEL = 'composerWeb.preview.seeMore' as const;

describe('collapseText', () => {
  it('shows the whole body when the rule has no sourced threshold', () => {
    const text = 'a'.repeat(5000);
    const result = collapseText(text, DEFAULT_PRESENTATION);
    expect(result.collapsed).toBe(false);
    expect(result.visible).toBe(text);
    expect(result.hidden).toBe('');
  });

  it('cuts on a word boundary once a character threshold is set', () => {
    const rule = withCollapse({ afterChars: 20, afterLines: null, labelKey: LABEL });
    const result = collapseText('the quick brown fox jumps over the lazy dog', rule);
    expect(result.collapsed).toBe(true);
    expect(result.visible).toBe('the quick brown fox');
    expect(`${result.visible}${result.hidden}`.replace(/\s+/g, ' ')).toContain('lazy dog');
  });

  it('cuts at a line threshold and keeps whichever cut comes first', () => {
    const rule = withCollapse({ afterChars: 200, afterLines: 2, labelKey: LABEL });
    const result = collapseText('one\ntwo\nthree\nfour', rule);
    expect(result.visible).toBe('one\ntwo');
    expect(result.hidden).toBe('\nthree\nfour');
  });

  it('does not collapse when the hidden remainder is only whitespace', () => {
    const rule = withCollapse({ afterChars: 5, afterLines: null, labelKey: LABEL });
    expect(collapseText('hello   ', rule).collapsed).toBe(false);
  });

  it('leaves a body shorter than the threshold alone', () => {
    const rule = withCollapse({ afterChars: 100, afterLines: 10, labelKey: LABEL });
    const result = collapseText('short', rule);
    expect(result.collapsed).toBe(false);
    expect(result.visible).toBe('short');
  });
});
