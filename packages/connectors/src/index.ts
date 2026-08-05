/**
 * `@relay/connectors`
 *
 * The versioned connector contract, the registry, the shared provider HTTP
 * client, the SSRF guard, the error taxonomy, the OAuth helpers, the credential
 * vault, the duplicate publication guard, the capability drift check and the
 * fake provider.
 *
 * This package depends on `@relay/contracts` and `@relay/config` and on nothing
 * else in the workspace. It never imports `@relay/application` or
 * `@relay/database`: dependencies point inward, and a connector owns no
 * business logic. Scheduling, approval, cadence, duplicate policy and receipts
 * live in `packages/application`.
 */

export * from './ports.js';
export * from './contract.js';
export * from './errors.js';
export * from './sanitize.js';
export * from './ssrf.js';
export * from './http.js';
export * from './oauth.js';
export * from './vault.js';
export * from './registry.js';
export * from './idempotency.js';
export * from './capability-diff.js';
export * from './fake/index.js';

// Provider adapters. This barrel is owned by the provider adapter work and is
// the only place a concrete provider is exported from.
export * from './providers/index.js';
