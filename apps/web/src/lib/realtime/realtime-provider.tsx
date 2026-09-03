'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { useWorkspaceEvents, type WorkspaceEventsState } from './use-workspace-events';

/**
 * One stream for the whole application.
 *
 * Mounted once in the app shell, because a hook per screen would open a
 * connection per screen and the caps on the endpoint exist precisely to stop
 * that. The context exists so a screen can say whether it is live without
 * opening a second one: an indicator, or a query that wants to keep its own
 * polling on while the stream is down.
 */

const DISCONNECTED: WorkspaceEventsState = { connected: false, polling: false };

const RealtimeStatusContext = createContext<WorkspaceEventsState>(DISCONNECTED);

export function RealtimeStatusProvider({ children }: { readonly children: ReactNode }) {
  const status = useWorkspaceEvents();
  return <RealtimeStatusContext.Provider value={status}>{children}</RealtimeStatusContext.Provider>;
}

/**
 * Whether live updates are arriving.
 *
 * Outside the provider it reports disconnected rather than throwing, so a
 * component rendered on a page without the shell, or in a test, behaves as it
 * does when the stream is simply down.
 */
export function useRealtimeStatus(): WorkspaceEventsState {
  return useContext(RealtimeStatusContext);
}
