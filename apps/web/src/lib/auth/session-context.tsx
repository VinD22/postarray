'use client';

import { createContext, useContext, useInsertionEffect, useMemo, type ReactNode } from 'react';

import type { BrandView, SessionView, WorkspaceView } from '@/lib/api/types';

/**
 * The signed-in session, resolved once on the server and handed to the client.
 *
 * Every cache key and every workspace-scoped read reads the active workspace
 * from here, so switching workspace can never leave another tenant's rows on
 * the screen.
 */
export interface SessionContextValue {
  readonly session: SessionView;
  readonly workspace: WorkspaceView;
  readonly brands: readonly BrandView[];
  readonly hasScope: (scope: string) => boolean;
  readonly canPublish: boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const PUBLISHING_ROLES = new Set(['owner', 'admin', 'manager', 'editor']);

export function SessionProvider({
  session,
  children,
}: {
  readonly session: SessionView;
  readonly children: ReactNode;
}) {
  useInsertionEffect(() => {
    document.cookie = `relay_ws=${encodeURIComponent(session.workspace.id)}; path=/; SameSite=Lax`;
  }, [session.workspace.id]);

  const value = useMemo<SessionContextValue>(() => {
    const scopes = new Set(session.scopes);
    return {
      session,
      workspace: session.workspace,
      brands: session.brands,
      hasScope: (scope: string) => scopes.has(scope),
      canPublish: !session.workspace.readOnly && PUBLISHING_ROLES.has(session.workspace.role),
    };
  }, [session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession must be used inside a SessionProvider');
  }
  return value;
}

/** The active workspace id. The argument every cache key starts with. */
export function useWorkspaceId(): string {
  return useSession().workspace.id;
}
