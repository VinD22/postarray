import { describe, expect, it } from 'vitest';

import type { BrandView } from '@/lib/api/types';

import { resolveActiveProject } from './project-selection';

const projects = [
  { id: 'brand_one', name: 'One' },
  { id: 'brand_two', name: 'Two' },
] as unknown as readonly BrandView[];

describe('active project selection', () => {
  it('uses an authorized requested project', () => {
    expect(resolveActiveProject(projects, 'brand_two')?.name).toBe('Two');
  });

  it('falls back when the cookie is stale or belongs to another workspace', () => {
    expect(resolveActiveProject(projects, 'brand_elsewhere')?.name).toBe('One');
  });

  it('returns null when the workspace has no project', () => {
    expect(resolveActiveProject([], 'brand_one')).toBeNull();
  });
});
