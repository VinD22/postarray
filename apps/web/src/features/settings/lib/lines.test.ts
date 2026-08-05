import { describe, expect, it } from 'vitest';

import { fromLines, toLines } from './lines.js';

describe('line editing', () => {
  it('drops blank lines so an empty line never becomes an empty rule', () => {
    expect(fromLines('one\n\n  \ntwo\n')).toEqual(['one', 'two']);
  });

  it('trims surrounding space, which is what a paste from a document carries', () => {
    expect(fromLines('  guaranteed  \n\tbest in class ')).toEqual(['guaranteed', 'best in class']);
  });

  it('round trips a list without changing its order', () => {
    const values = ['acme.example', 'go.acme.example'];
    expect(fromLines(toLines(values))).toEqual(values);
  });

  it('returns an empty list for empty input rather than one empty string', () => {
    expect(fromLines('')).toEqual([]);
  });
});
