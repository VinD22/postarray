import { describe, expect, it } from 'vitest';

import { aspectRatioIssues, countHashtags, hashtagIssues } from './validation-shape-rules';

const WINDOW = { min: 0.8, max: 1.91, recommended: [1, 0.8] };

describe('hashtagIssues', () => {
  it('counts hashtags the way the composer does', () => {
    expect(countHashtags('#one two #three#four')).toBe(2);
    expect(countHashtags('no tags')).toBe(0);
  });

  it('warns above the soft limit on providers without a published limit', () => {
    const body = Array.from({ length: 11 }, (_, i) => `#t${i}`).join(' ');
    const [issue] = hashtagIssues(body, 'x', 'target_1');
    expect(issue?.code).toBe('HASHTAG_COUNT_EXCEEDED');
    expect(issue?.severity).toBe('warning');
    expect(issue?.params).toMatchObject({ count: 11, limit: 10 });
  });

  it('blocks above a documented hard limit', () => {
    const body = Array.from({ length: 31 }, (_, i) => `#t${i}`).join(' ');
    const [issue] = hashtagIssues(body, 'instagram', 'target_1');
    expect(issue?.severity).toBe('error');
    expect(issue?.params).toMatchObject({ count: 31, limit: 30 });
  });

  it('says nothing at or under the limit', () => {
    const body = Array.from({ length: 10 }, (_, i) => `#t${i}`).join(' ');
    expect(hashtagIssues(body, 'x', 'target_1')).toEqual([]);
  });
});

describe('aspectRatioIssues', () => {
  it('flags a file outside the provider window', () => {
    const issues = aspectRatioIssues(
      [{ id: 'media_1', kind: 'image', width: 1080, height: 1920 }],
      WINDOW,
      'instagram',
      'target_1',
    );
    expect(issues).toHaveLength(1);
    expect(issues[0]?.code).toBe('MEDIA_ASPECT_RATIO_UNSUPPORTED');
    expect(issues[0]?.params).toMatchObject({ actual: '1080x1920', min: 0.8, max: 1.91 });
  });

  it('accepts files at the edge of the window', () => {
    expect(
      aspectRatioIssues(
        [{ id: 'media_1', kind: 'image', width: 1080, height: 1350 }],
        WINDOW,
        'instagram',
        'target_1',
      ),
    ).toEqual([]);
  });

  it('skips files whose dimensions are unavailable', () => {
    expect(
      aspectRatioIssues(
        [{ id: 'media_1', kind: 'image', width: null, height: null }],
        WINDOW,
        'instagram',
        'target_1',
      ),
    ).toEqual([]);
  });
});
