import { Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import type { RelayConfig } from '@relay/config';
import type { Logger } from '@relay/observability';
import { createRedisRealtimeEventReader, type RealtimeRedisClient } from '@relay/runtime';
import Redis from 'ioredis';

import { LOGGER, RELAY_CONFIG } from '../../application/tokens';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import {
  REALTIME_CONNECTIONS,
  REALTIME_EVENT_READER,
  REALTIME_HUB,
  type RealtimeEventReaderLike,
} from './events.tokens';
import { RealtimeHub, type RealtimeSubscriberClient } from './realtime-hub';

/**
 * Where the two Redis connections are made, and the only place they are.
 *
 * A deployment without Redis still serves this endpoint. It opens, it
 * heartbeats and it carries nothing, so a client's polling fallback covers it
 * and a developer running the product with only a database sees no error. That
 * is the same trade the key value store makes one directory over.
 *
 * Two connections rather than one because ioredis puts a connection into
 * subscriber mode and then refuses ordinary commands on it. The subscriber
 * listens; the command connection does the `XRANGE` that turns a wake-up into
 * an event and serves the replay on connect.
 */

interface RealtimeConnections {
  readonly subscriber: RealtimeSubscriberClient;
  readonly reader: RealtimeEventReaderLike;
  close(): Promise<void>;
}

/** The stream is empty and nothing ever arrives. Every caller still works. */
function disconnectedRealtime(): RealtimeConnections {
  return {
    subscriber: {
      subscribe: () => Promise.resolve(undefined),
      unsubscribe: () => Promise.resolve(undefined),
      on: () => undefined,
    },
    reader: {
      readRecent: () => Promise.resolve([]),
      readAt: () => Promise.resolve(null),
    },
    close: () => Promise.resolve(),
  };
}

function connectRealtime(config: RelayConfig, logger: Logger): RealtimeConnections {
  const url = config.redis.url;
  if (url === undefined) {
    logger.warn({}, 'api.realtime_disabled');
    return disconnectedRealtime();
  }
  const options = { enableReadyCheck: true, maxRetriesPerRequest: 3 };
  const subscriber = new Redis(url, options);
  const commands = new Redis(url, options);
  // ioredis implements every operation both ports declare; its overloaded
  // signatures are wider than the structural types, exactly as they are for
  // the key value store.
  return {
    subscriber: subscriber as unknown as RealtimeSubscriberClient,
    reader: createRedisRealtimeEventReader(commands as unknown as RealtimeRedisClient),
    close: async () => {
      await subscriber.quit();
      await commands.quit();
    },
  };
}

@Module({
  controllers: [EventsController],
  providers: [
    EventsService,
    {
      provide: REALTIME_CONNECTIONS,
      inject: [RELAY_CONFIG, LOGGER],
      useFactory: (config: RelayConfig, logger: Logger) => connectRealtime(config, logger),
    },
    {
      provide: REALTIME_HUB,
      inject: [REALTIME_CONNECTIONS, LOGGER],
      useFactory: (connections: RealtimeConnections, logger: Logger) =>
        new RealtimeHub({
          subscriber: connections.subscriber,
          reader: connections.reader,
          logger,
        }),
    },
    {
      provide: REALTIME_EVENT_READER,
      inject: [REALTIME_CONNECTIONS],
      useFactory: (connections: RealtimeConnections) => connections.reader,
    },
  ],
})
export class EventsModule implements OnApplicationShutdown {
  constructor(
    @Inject(REALTIME_CONNECTIONS) private readonly connections: RealtimeConnections,
  ) {}

  /**
   * Close both sockets on shutdown.
   *
   * `enableShutdownHooks` is already on in `bootstrap.ts`, and a deploy that
   * left two connections per replica behind would exhaust a Redis client
   * limit long before anybody noticed why.
   */
  async onApplicationShutdown(): Promise<void> {
    await this.connections.close();
  }
}
