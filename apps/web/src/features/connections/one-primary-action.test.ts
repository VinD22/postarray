import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The connections screen allows exactly one vermilion action: the page
// header's "Connect an account". Rows, notices and the empty state stay
// secondary. Dialogs are separate surfaces and may own their own primary.
const DIALOG_FILES = new Set([
  'connection-groups.tsx',
  'connect-dialog.tsx',
  'permissions-sheet.tsx',
  'oauth-account-selection.tsx',
]);

function filledButtons(file: string): number {
  const source = readFileSync(join(__dirname, file), 'utf8');
  return (source.match(/variant="(primary|cta)"/g) ?? []).length;
}

describe('connections screen primary actions', () => {
  it('renders a single primary action across the on-page components', () => {
    const files = readdirSync(__dirname).filter(
      (name) => name.endsWith('.tsx') && !name.endsWith('.test.tsx') && !DIALOG_FILES.has(name),
    );
    const counts = Object.fromEntries(files.map((file) => [file, filledButtons(file)]));
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    expect(counts['connections-screen.tsx']).toBe(1);
    expect(total).toBe(1);
  });
});
