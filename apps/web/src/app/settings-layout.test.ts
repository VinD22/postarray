import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Below 1024px the settings grid has one column. Left implicit, that column is
 * `auto`, sizes itself to the nav strip's min-content width, and pushes every
 * settings page past the edge of a 390px phone.
 */
describe('settings layout', () => {
  it('pins the narrow single column to minmax(0,1fr)', () => {
    const source = readFileSync(
      path.join(__dirname, '[locale]', '(app)', 'settings', 'layout.tsx'),
      'utf8',
    );
    expect(source).toContain('grid-cols-[minmax(0,1fr)] gap-3');
  });
});
