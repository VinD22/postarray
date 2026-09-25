import type { RealtimeEvent } from '@relay/contracts';

/**
 * The two things the events module is handed rather than builds.
 *
 * The API constructs no infrastructure anywhere else, and this module is not
 * the place to start. The providers file decides whether a deployment has
 * Redis; everything below it takes a hub and a reader and does not care which
 * kind it got, which is what lets the whole surface be tested without a socket.
 */

export const REALTIME_CONNECTIONS = Symbol.for('relay.api.realtime.connections');
export const REALTIME_HUB = Symbol.for('relay.api.realtime.hub');
export const REALTIME_EVENT_READER = Symbol.for('relay.api.realtime.reader');

/** The reader shape this module needs, narrower than the runtime's. */
export interface RealtimeEventReaderLike {
  readRecent(
    workspaceId: string,
    input: { readonly since: string | null; readonly limit?: number },
  ): Promise<readonly RealtimeEvent[]>;
  readAt(workspaceId: string, id: string): Promise<RealtimeEvent | null>;
}
