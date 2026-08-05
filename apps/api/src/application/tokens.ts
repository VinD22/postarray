/**
 * Injection tokens for everything the API is handed at bootstrap.
 *
 * The API constructs none of these. `createApiApp()` receives them from the
 * composition root (`main.ts` in deployment, the test harness in tests), which
 * is what keeps the transport layer free of infrastructure decisions.
 */

export const SERVICES = Symbol.for('relay.api.services');
export const KEY_VALUE_STORE = Symbol.for('relay.api.kv');
export const CLOCK = Symbol.for('relay.api.clock');
export const RELAY_CONFIG = Symbol.for('relay.api.config');
export const LOGGER = Symbol.for('relay.api.logger');
export const IDENTITY_PROVIDER = Symbol.for('relay.api.identity');
export const API_OPTIONS = Symbol.for('relay.api.options');
