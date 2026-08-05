import { Global, Module, type DynamicModule } from '@nestjs/common';
import type { RelayConfig } from '@relay/config';
import type { Logger } from '@relay/observability';

import type { Clock, KeyValueStore, Services } from './port.js';
import type { IdentityProvider } from '../modules/auth/identity.port.js';
import { CLOCK, IDENTITY_PROVIDER, KEY_VALUE_STORE, LOGGER, RELAY_CONFIG, SERVICES } from './tokens.js';

/**
 * Everything the API is handed at bootstrap.
 *
 * The API constructs no infrastructure. It receives the application services,
 * the key value store, the clock, the config and the logger from the
 * composition root, which is `main.ts` in a deployment and the test harness in
 * a test. That is what makes the whole surface testable without a database, a
 * Redis, a Temporal cluster or a network, and it is why the integration suite
 * can assert real HTTP behaviour rather than mocking controllers.
 */
export interface RuntimeOptions {
  readonly services: Services;
  readonly kv: KeyValueStore;
  readonly clock: Clock;
  readonly config: RelayConfig;
  readonly logger: Logger;
  /**
   * Bound here rather than inside `AuthModule` so there is exactly one binding
   * site. A deployment passes `SupabaseIdentityProvider`; a test passes its own
   * implementation, so no auth route ever reaches a network.
   */
  readonly identityProvider: IdentityProvider;
}

@Global()
@Module({})
export class RuntimeModule {
  static forRoot(options: RuntimeOptions): DynamicModule {
    const providers = [
      { provide: SERVICES, useValue: options.services },
      { provide: KEY_VALUE_STORE, useValue: options.kv },
      { provide: CLOCK, useValue: options.clock },
      { provide: RELAY_CONFIG, useValue: options.config },
      { provide: LOGGER, useValue: options.logger },
      { provide: IDENTITY_PROVIDER, useValue: options.identityProvider },
    ];
    return {
      module: RuntimeModule,
      providers,
      exports: providers.map((provider) => provider.provide),
    };
  }
}
