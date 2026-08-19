import { notFound } from './errors';
import type { ActorSnapshot, Db } from './runtime';

/**
 * Project ownership, checked once, at the top of a handler.
 *
 * Row level security scopes every statement to the caller's workspace, so a
 * project id belonging to another tenant reads back as nothing. That closes the
 * cross-tenant hole and nothing here replaces it. What it does not do is answer
 * the second question: is this project id one this caller may name at all?
 * A handler that takes a `projectId` and drops it straight into a `where` clause
 * or a `data` payload treats "no such project" as "an empty project" and
 * "somebody else's project in my workspace" as "mine". The first is a confusing
 * empty screen; the second writes a row under a project the actor's policy
 * decision was never made against.
 *
 * So the rule is: load the project first, prove it belongs to this workspace,
 * and only then use its id. The lookup names the workspace explicitly rather
 * than trusting the session claim alone, which is the same belt-and-braces
 * posture the rest of the codebase takes with tenancy: the edge authenticates,
 * the service authorizes, PostgreSQL enforces.
 *
 * A project the caller may not reach is reported as `NOT_FOUND`, never as
 * `FORBIDDEN`. `FORBIDDEN` would confirm the id exists, which is exactly the
 * fact a caller probing another tenant's identifiers is trying to learn.
 */

export interface OwnedProject {
  readonly id: string;
  readonly workspaceId: string;
  readonly archivedAt: Date | null;
  /** Read by target memory. Carried here so the check stays a single query. */
  readonly rememberTargetsEnabled: boolean;
}

const OWNED_PROJECT_SELECT = {
  id: true,
  workspaceId: true,
  archivedAt: true,
  rememberTargetsEnabled: true,
} as const;

/**
 * Resolve `projectId` to a project this workspace owns, or throw.
 *
 * Archived projects are returned rather than refused: archiving retires a
 * project from the pickers, it does not make its existing content unreadable.
 * A caller that must refuse an archived project checks `archivedAt` itself.
 */
export async function requireProjectOwnership(
  db: Db,
  actor: ActorSnapshot,
  projectId: string,
): Promise<OwnedProject> {
  const project = await db.project.findFirst({
    where: { id: projectId, workspaceId: actor.workspace.id },
    select: OWNED_PROJECT_SELECT,
  });
  // The second half is not redundant with the `where` clause. It is the
  // assertion that the row we got back is the row we asked for, so a future
  // change to the scoped client cannot quietly widen this.
  if (project === null || project.workspaceId !== actor.workspace.id) {
    throw notFound('project', projectId);
  }
  return project;
}

/**
 * The same check for a parameter that is legitimately optional, such as a list
 * filter or an unfiled media asset. Absent means "not scoped to a project" and
 * is allowed; present means it is checked exactly as above.
 */
export async function requireProjectOwnershipIfPresent(
  db: Db,
  actor: ActorSnapshot,
  projectId: string | null | undefined,
): Promise<OwnedProject | null> {
  if (projectId === undefined || projectId === null || projectId.trim() === '') {
    return null;
  }
  return requireProjectOwnership(db, actor, projectId);
}
