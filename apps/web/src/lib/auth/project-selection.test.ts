import { describe, expect, it } from 'vitest';

import type { ProjectView } from '@/lib/api/types';

import { resolveActiveProject } from './project-selection';

const projects = [
  { id: 'project_one', name: 'One' },
  { id: 'project_two', name: 'Two' },
] as unknown as readonly ProjectView[];

describe('active project selection', () => {
  it('uses an authorized requested project', () => {
    expect(resolveActiveProject(projects, 'project_two')?.name).toBe('Two');
  });

  it('falls back when the cookie is stale or belongs to another workspace', () => {
    expect(resolveActiveProject(projects, 'project_elsewhere')?.name).toBe('One');
  });

  it('returns null when the workspace has no project', () => {
    expect(resolveActiveProject([], 'project_one')).toBeNull();
  });
});
