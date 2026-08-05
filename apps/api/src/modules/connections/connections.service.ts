import { Inject, Injectable } from '@nestjs/common';
import type { CapabilitySnapshot, Paginated } from '@relay/contracts';

import type {
  ActorContext,
  ConnectionView,
  CursorQuery,
  MentionEntity,
  ProviderDestination,
  Services,
} from '../../application/port.js';
import { SERVICES } from '../../application/tokens.js';
import type { BeginOAuthInput } from './connections.schemas.js';

/**
 * Transport-level delegation for connections.
 *
 * Token exchange, credential encryption, capability probing and provider
 * revocation all happen behind `services.connections`. This class never sees a
 * provider token, and there is no code path here that could log one.
 */
@Injectable()
export class ConnectionsService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  list(
    ctx: ActorContext,
    query: CursorQuery & { brandId?: string; provider?: string },
  ): Promise<Paginated<ConnectionView>> {
    return this.services.connections.list(ctx, query);
  }

  get(ctx: ActorContext, connectionId: string): Promise<ConnectionView> {
    return this.services.connections.get(ctx, connectionId);
  }

  getCapabilities(ctx: ActorContext, connectionId: string): Promise<CapabilitySnapshot> {
    return this.services.connections.getCapabilities(ctx, connectionId);
  }

  beginOAuth(
    ctx: ActorContext,
    input: BeginOAuthInput,
  ): Promise<{ authorizationUrl: string; transactionId: string }> {
    return this.services.connections.beginOAuth(ctx, input);
  }

  completeOAuth(
    ctx: ActorContext,
    input: { transactionId: string; code: string; state: string },
  ): Promise<readonly ConnectionView[]> {
    return this.services.connections.completeOAuth(ctx, input);
  }

  reconnect(ctx: ActorContext, connectionId: string): Promise<ConnectionView> {
    return this.services.connections.reconnect(ctx, connectionId);
  }

  pause(ctx: ActorContext, connectionId: string): Promise<ConnectionView> {
    return this.services.connections.pause(ctx, connectionId);
  }

  resume(ctx: ActorContext, connectionId: string): Promise<ConnectionView> {
    return this.services.connections.resume(ctx, connectionId);
  }

  disconnect(ctx: ActorContext, connectionId: string): Promise<ConnectionView> {
    return this.services.connections.disconnect(ctx, connectionId);
  }

  listDestinations(
    ctx: ActorContext,
    connectionId: string,
    input: { kind: string; query?: string },
  ): Promise<readonly ProviderDestination[]> {
    return this.services.connections.listDestinations(ctx, connectionId, input);
  }

  searchMentions(
    ctx: ActorContext,
    connectionId: string,
    input: { query: string },
  ): Promise<readonly MentionEntity[]> {
    return this.services.connections.searchMentions(ctx, connectionId, input);
  }
}
