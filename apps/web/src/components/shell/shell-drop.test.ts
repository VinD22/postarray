import { describe, expect, it } from 'vitest';

import { droppableMedia, isFileDrag, shellDropEnabled, SHELL_DROP_MAX_FILES } from './shell-drop';

describe('shell drop rules', () => {
  it('stays out of screens that own a drop zone', () => {
    expect(shellDropEnabled('/home')).toBe(true);
    expect(shellDropEnabled('/fr/calendar')).toBe(true);
    expect(shellDropEnabled('/compose')).toBe(false);
    expect(shellDropEnabled('/de/compose')).toBe(false);
    expect(shellDropEnabled('/library')).toBe(false);
    expect(shellDropEnabled('/library/sets')).toBe(false);
  });

  it('only reacts to file drags', () => {
    expect(isFileDrag(null)).toBe(false);
    expect(isFileDrag({ types: ['text/plain'] } as unknown as DataTransfer)).toBe(false);
    expect(isFileDrag({ types: ['Files'] } as unknown as DataTransfer)).toBe(true);
  });

  it('keeps images and videos, capped', () => {
    const image = new File(['x'], 'a.png', { type: 'image/png' });
    const video = new File(['x'], 'b.mp4', { type: 'video/mp4' });
    const pdf = new File(['x'], 'c.pdf', { type: 'application/pdf' });
    expect(droppableMedia([image, pdf, video])).toEqual([image, video]);
    expect(droppableMedia(Array.from({ length: 15 }, () => image))).toHaveLength(
      SHELL_DROP_MAX_FILES,
    );
  });
});
