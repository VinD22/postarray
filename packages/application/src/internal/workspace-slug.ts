import { randomUUID } from 'node:crypto';

/** Produce a readable, collision-resistant workspace slug. */
export function workspaceSlug(name: string): string {
  const base = name
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return `${base.length === 0 ? 'workspace' : base}-${randomUUID().slice(0, 8)}`;
}
