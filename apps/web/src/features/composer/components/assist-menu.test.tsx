import { describe, expect, it } from 'vitest';

import { diffSegments } from './assist-menu';

describe('diffSegments', () => {
  it('marks the changed run and keeps the shared prefix and suffix', () => {
    const segments = diffSegments(
      'We shipped scheduled first comments today.',
      'We shipped first comments today.',
    );

    expect(segments.map((segment) => segment.operation)).toEqual([
      'unchanged',
      'removed',
      'unchanged',
    ]);
    expect(segments[1]?.text).toContain('scheduled');
  });

  it('produces an added run when text is only inserted', () => {
    const segments = diffSegments('Read the notes.', 'Read the release notes.');
    expect(segments.some((segment) => segment.operation === 'added')).toBe(true);
    expect(segments.some((segment) => segment.operation === 'removed')).toBe(false);
  });

  it('produces nothing to accept when the texts match', () => {
    expect(diffSegments('Same text.', 'Same text.')).toEqual([
      { id: 'prefix', operation: 'unchanged', text: 'Same text.' },
    ]);
  });
});
